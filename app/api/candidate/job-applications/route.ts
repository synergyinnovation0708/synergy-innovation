import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireCandidateApiAccess } from "@/lib/candidate-api";
import { getCandidateProfileData } from "@/lib/candidate-profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";

type JobListingRow = {
  applicants_count: number | null;
  application_deadline: string;
  department: string;
  id: string;
  job_title: string;
  status: string;
};

const candidateJobApplicationsTableName =
  process.env.SUPABASE_CANDIDATE_JOB_APPLICATIONS_TABLE?.trim() ||
  "candidate_job_applications";
const jobListingsTableName =
  process.env.SUPABASE_JOB_LISTINGS_TABLE?.trim() || "job_listings";

const applicationClosedStatuses = new Set(["Archived", "Draft"]);

const getInvalidApplicationMessage = (status: string, deadline: string) => {
  if (applicationClosedStatuses.has(status)) {
    return "This job is not open for applications right now.";
  }

  const deadlineDate = new Date(`${deadline}T23:59:59`);

  if (!Number.isNaN(deadlineDate.getTime()) && deadlineDate.getTime() < Date.now()) {
    return "The application deadline for this job has passed.";
  }

  return null;
};

const getJobApplicationFailureMessage = (error: unknown) => {
  if (!(error instanceof Error) || !error.message) {
    return "Unable to submit your job application right now.";
  }

  if (/candidate_job_applications|relation .* does not exist/i.test(error.message)) {
    return "Job applications table is missing. Run supabase/candidate_job_applications.sql first.";
  }

  if (process.env.NODE_ENV !== "production") {
    return error.message;
  }

  return "Unable to submit your job application right now.";
};

export const POST = async (request: Request) => {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      {
        message: "Supabase is not configured.",
      },
      { status: 500 },
    );
  }

  const { errorResponse, identity } = await requireCandidateApiAccess({
    adminForbidden:
      "Admin accounts cannot apply for jobs. Please use a candidate account.",
    nonCandidateForbidden:
      "Employer and other non-candidate accounts cannot apply for jobs. Please use a candidate account.",
    unauthenticated: "Please sign in with a candidate account to apply.",
  });

  if (errorResponse || !identity) {
    return errorResponse;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        message: "Invalid application payload.",
      },
      { status: 400 },
    );
  }

  const jobId =
    typeof (body as { jobId?: unknown }).jobId === "string"
      ? (body as { jobId: string }).jobId.trim()
      : "";

  if (!jobId) {
    return NextResponse.json(
      {
        message: "Job ID is required.",
      },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { data: jobRecord, error: jobError } = await supabase
      .from(jobListingsTableName)
      .select("id, job_title, department, status, application_deadline, applicants_count")
      .eq("id", jobId)
      .limit(1)
      .maybeSingle();

    if (jobError) {
      console.error("Job application job lookup failed:", jobError);

      return NextResponse.json(
        {
          message: "Unable to verify this job right now.",
        },
        { status: 500 },
      );
    }

    if (!jobRecord) {
      return NextResponse.json(
        {
          message: "Job not found.",
        },
        { status: 404 },
      );
    }

    const job = jobRecord as JobListingRow;
    const invalidApplicationMessage = getInvalidApplicationMessage(
      job.status,
      job.application_deadline,
    );

    if (invalidApplicationMessage) {
      return NextResponse.json(
        {
          message: invalidApplicationMessage,
        },
        { status: 400 },
      );
    }

    const { data: existingApplications, error: existingApplicationsError } =
      await supabase
        .from(candidateJobApplicationsTableName)
        .select("id")
        .eq("job_id", job.id)
        .eq("candidate_user_id", identity.id)
        .limit(1);

    if (existingApplicationsError) {
      throw existingApplicationsError;
    }

    if ((existingApplications?.length ?? 0) > 0) {
      const { count } = await supabase
        .from(candidateJobApplicationsTableName)
        .select("*", { count: "exact", head: true })
        .eq("job_id", job.id);

      return NextResponse.json(
        {
          applicantsCount: count ?? job.applicants_count ?? 0,
          jobId: job.id,
          message: "You have already applied for this job.",
        },
        { status: 409 },
      );
    }

    const { initialValues } = await getCandidateProfileData(identity);
    const candidateFullName =
      initialValues.fullName.trim() || identity.name.trim() || identity.email;
    const { error: insertError } = await supabase
      .from(candidateJobApplicationsTableName)
      .insert({
        application_status: "applied",
        candidate_email: identity.email,
        candidate_full_name: candidateFullName,
        candidate_user_id: identity.id,
        current_company: initialValues.currentCompany.trim(),
        current_position: initialValues.currentPosition.trim(),
        department: job.department,
        job_id: job.id,
        job_title: job.job_title,
        resume_bytes: initialValues.resumeBytes,
        resume_extension: initialValues.resumeExtension.trim(),
        resume_original_name: initialValues.resumeOriginalName.trim(),
        resume_url: initialValues.resumeUrl.trim(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      if (/duplicate key value|unique/i.test(insertError.message)) {
        const { count } = await supabase
          .from(candidateJobApplicationsTableName)
          .select("*", { count: "exact", head: true })
          .eq("job_id", job.id);

        return NextResponse.json(
          {
            applicantsCount: count ?? job.applicants_count ?? 0,
            jobId: job.id,
            message: "You have already applied for this job.",
          },
          { status: 409 },
        );
      }

      throw insertError;
    }

    const { count } = await supabase
      .from(candidateJobApplicationsTableName)
      .select("*", { count: "exact", head: true })
      .eq("job_id", job.id);
    const applicantsCount = count ?? (job.applicants_count ?? 0) + 1;

    await supabase
      .from(jobListingsTableName)
      .update({
        applicants_count: applicantsCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    revalidatePath("/jobs");

    return NextResponse.json({
      applicantsCount,
      jobId: job.id,
      message: "Your application has been submitted successfully.",
    });
  } catch (error) {
    console.error("Candidate job application failed:", error);

    return NextResponse.json(
      {
        message: getJobApplicationFailureMessage(error),
      },
      { status: 500 },
    );
  }
};
