import { NextResponse } from "next/server";
import type {
  AdminJobApplicantRecord,
  AdminJobApplicantsResponse,
  AdminJobApplicantsSummary,
} from "@/lib/admin-job-applications-shared";
import {
  createCloudinaryPrivateDownloadUrl,
  hasCloudinaryEnv,
} from "@/lib/cloudinary";
import { requireAdminApiAccess } from "@/lib/admin-api";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

type JobListingRow = {
  id: string;
  job_title: string;
};

type CandidateJobApplicationRow = {
  application_status: string;
  applied_at: string;
  candidate_email: string;
  candidate_full_name: string;
  candidate_user_id: string;
  current_company: string;
  current_position: string;
  id: string;
  resume_bytes: number;
  resume_original_name: string;
  resume_url: string;
};

type CandidateProfileLiteRow = {
  contact_number: string | null;
  current_location: string | null;
  linkedin_url: string | null;
  notice_period: string | null;
  total_experience_months: number | null;
  total_experience_years: number | null;
  user_id: string;
};

const candidateApplicationsTableName =
  process.env.SUPABASE_CANDIDATE_JOB_APPLICATIONS_TABLE?.trim() ||
  "candidate_job_applications";
const candidateProfilesTableName =
  process.env.SUPABASE_CANDIDATE_PROFILES_TABLE?.trim() || "candidate_profiles";
const jobListingsTableName =
  process.env.SUPABASE_JOB_LISTINGS_TABLE?.trim() || "job_listings";

const createEmptySummary = (): AdminJobApplicantsSummary => ({
  latestAppliedAtLabel: null,
  resumeCount: 0,
  shortlistedCount: 0,
  totalApplicants: 0,
});

const formatLongDateTime = (dateValue: string) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatExperienceLabel = (
  totalExperienceYears: number | null,
  totalExperienceMonths: number | null,
) => {
  const years = Math.max(totalExperienceYears ?? 0, 0);
  const months = Math.max(totalExperienceMonths ?? 0, 0);

  if (years <= 0 && months <= 0) {
    return "Not specified";
  }

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} year${years === 1 ? "" : "s"}`);
  }

  if (months > 0) {
    parts.push(`${months} month${months === 1 ? "" : "s"}`);
  }

  return parts.join(" ");
};

const slugifyFileName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "job-applicants";

const escapeCsvValue = (value: string | number | null | undefined) => {
  const resolvedValue =
    value === null || value === undefined ? "" : String(value);

  if (/[",\r\n]/.test(resolvedValue)) {
    return `"${resolvedValue.replace(/"/g, '""')}"`;
  }

  return resolvedValue;
};

const buildCsvContent = (
  jobTitle: string,
  applications: AdminJobApplicantRecord[],
) => {
  const headerRow = [
    "Job Title",
    "Candidate Name",
    "Candidate Email",
    "Contact Number",
    "Current Company",
    "Current Position",
    "Current Location",
    "Experience",
    "Application Status",
    "Applied At",
    "Resume File Name",
    "Resume Size (Bytes)",
    "LinkedIn URL",
    "Notice Period",
  ];

  const rows = applications.map((application) => [
    jobTitle,
    application.candidateName,
    application.candidateEmail,
    application.contactNumber,
    application.currentCompany,
    application.currentPosition,
    application.currentLocation,
    application.experienceLabel,
    application.applicationStatus,
    application.appliedAtLabel,
    application.resumeOriginalName,
    application.resumeBytes,
    application.linkedinUrl,
    application.noticePeriod,
  ]);

  return `\uFEFF${[headerRow, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
    .join("\r\n")}`;
};

const buildResumeDownloadUrl = (resumeUrl: string) => {
  if (!resumeUrl.trim() || !hasCloudinaryEnv()) {
    return "";
  }

  try {
    return createCloudinaryPrivateDownloadUrl(resumeUrl, {
      attachment: true,
    });
  } catch {
    return "";
  }
};

const buildResponsePayload = async (
  jobId: string,
): Promise<{
  payload: AdminJobApplicantsResponse;
  status: number;
  title: string | null;
}> => {
  const supabase = createAdminClient();
  const [jobResult, applicationsResult] = await Promise.all([
    supabase
      .from(jobListingsTableName)
      .select("id, job_title")
      .eq("id", jobId)
      .maybeSingle(),
    supabase
      .from(candidateApplicationsTableName)
      .select(
        "id, candidate_user_id, candidate_email, candidate_full_name, current_company, current_position, application_status, resume_url, resume_original_name, resume_bytes, applied_at",
      )
      .eq("job_id", jobId)
      .order("applied_at", { ascending: false }),
  ]);

  if (jobResult.error) {
    return {
      payload: {
        applications: [],
        errorMessage: "Unable to load the selected job right now.",
        summary: createEmptySummary(),
      },
      status: 500,
      title: null,
    };
  }

  if (!jobResult.data) {
    return {
      payload: {
        applications: [],
        errorMessage: "Job not found.",
        summary: createEmptySummary(),
      },
      status: 404,
      title: null,
    };
  }

  if (applicationsResult.error) {
    const message = /candidate_job_applications|relation .* does not exist/i.test(
      applicationsResult.error.message,
    )
      ? "Job applications table is missing. Run supabase/candidate_job_applications.sql first."
      : "Unable to load job applicants right now.";

    return {
      payload: {
        applications: [],
        errorMessage: message,
        summary: createEmptySummary(),
      },
      status: 500,
      title: jobResult.data.job_title,
    };
  }

  const applicationRows = (applicationsResult.data ?? []) as CandidateJobApplicationRow[];
  const candidateUserIds = Array.from(
    new Set(
      applicationRows
        .map((application) => application.candidate_user_id.trim())
        .filter(Boolean),
    ),
  );

  let profileErrorMessage: string | null = null;
  const candidateProfilesByUserId = new Map<string, CandidateProfileLiteRow>();

  if (candidateUserIds.length > 0) {
    const candidateProfilesResult = await supabase
      .from(candidateProfilesTableName)
      .select(
        "user_id, contact_number, current_location, total_experience_years, total_experience_months, linkedin_url, notice_period",
      )
      .in("user_id", candidateUserIds);

    if (candidateProfilesResult.error) {
      if (
        !/candidate_profiles|relation .* does not exist|column .* does not exist/i.test(
          candidateProfilesResult.error.message,
        )
      ) {
        profileErrorMessage =
          "Applicant list loaded, but some candidate profile details are unavailable.";
      }
    } else {
      for (const profile of (candidateProfilesResult.data ??
        []) as CandidateProfileLiteRow[]) {
        candidateProfilesByUserId.set(profile.user_id, profile);
      }
    }
  }

  const applications = applicationRows.map((application) => {
    const profile =
      candidateProfilesByUserId.get(application.candidate_user_id) ?? null;
    const resumeOriginalName = application.resume_original_name.trim();
    const resumeUrl = application.resume_url.trim();

    return {
      applicationId: application.id,
      applicationStatus: application.application_status,
      appliedAt: application.applied_at,
      appliedAtLabel: formatLongDateTime(application.applied_at),
      candidateEmail: application.candidate_email,
      candidateName: application.candidate_full_name,
      candidateUserId: application.candidate_user_id,
      contactNumber: profile?.contact_number?.trim() || "",
      currentCompany: application.current_company.trim(),
      currentLocation: profile?.current_location?.trim() || "",
      currentPosition: application.current_position.trim(),
      experienceLabel: formatExperienceLabel(
        profile?.total_experience_years ?? null,
        profile?.total_experience_months ?? null,
      ),
      hasResume: Boolean(resumeOriginalName || resumeUrl || application.resume_bytes > 0),
      linkedinUrl: profile?.linkedin_url?.trim() || "",
      noticePeriod: profile?.notice_period?.trim() || "",
      resumeBytes: application.resume_bytes,
      resumeDownloadUrl: buildResumeDownloadUrl(resumeUrl),
      resumeOriginalName,
    } satisfies AdminJobApplicantRecord;
  });

  return {
    payload: {
      applications,
      errorMessage: profileErrorMessage,
      summary: {
        latestAppliedAtLabel: applications[0]?.appliedAtLabel ?? null,
        resumeCount: applications.filter((application) => application.hasResume).length,
        shortlistedCount: applications.filter(
          (application) => application.applicationStatus === "shortlisted",
        ).length,
        totalApplicants: applications.length,
      },
    },
    status: 200,
    title: (jobResult.data as JobListingRow).job_title,
  };
};

export const GET = async (request: Request, context: RouteContext) => {
  const accessErrorResponse = await requireAdminApiAccess();

  if (accessErrorResponse) {
    return accessErrorResponse;
  }

  const { jobId } = await context.params;

  if (!jobId?.trim()) {
    return NextResponse.json(
      {
        message: "Job id is required.",
      },
      { status: 400 },
    );
  }

  try {
    const url = new URL(request.url);
    const format = url.searchParams.get("format")?.trim().toLowerCase() || "json";
    const { payload, status, title } = await buildResponsePayload(jobId);

    if (format === "csv") {
      if (status !== 200) {
        return NextResponse.json(
          {
            message: payload.errorMessage || "Unable to export applicants right now.",
          },
          { status },
        );
      }

      const csvContent = buildCsvContent(title || "Job Applicants", payload.applications);

      return new Response(csvContent, {
        headers: {
          "Content-Disposition": `attachment; filename=\"${slugifyFileName(title || jobId)}-applicants.csv\"`,
          "Content-Type": "text/csv; charset=utf-8",
        },
        status: 200,
      });
    }

    return NextResponse.json(payload, { status });
  } catch {
    return NextResponse.json(
      {
        message: "Unable to load job applicants right now.",
      },
      { status: 500 },
    );
  }
};
