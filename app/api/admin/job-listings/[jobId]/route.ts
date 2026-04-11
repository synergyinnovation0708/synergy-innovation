import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api";
import {
  jobListingInitialValues,
  validateJobListingValues,
  type JobListingValidationErrors,
} from "@/lib/job-listings";
import {
  getJobListingWriteFailureMessage,
  logJobListingWriteError,
} from "@/lib/job-listing-write-errors";
import { createAdminClient } from "@/lib/supabase/admin";

const jobListingsTableName =
  process.env.SUPABASE_JOB_LISTINGS_TABLE?.trim() || "job_listings";

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

const getPayloadValue = (
  payload: unknown,
  fieldName: keyof typeof jobListingInitialValues,
) =>
  typeof payload === "object" &&
  payload !== null &&
  fieldName in (payload as Record<string, unknown>)
    ? String((payload as Record<string, unknown>)[fieldName])
    : "";

export const PATCH = async (request: Request, context: RouteContext) => {
  const adminAccessError = await requireAdminApiAccess();

  if (adminAccessError) {
    return adminAccessError;
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

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        message: "Invalid request payload.",
      },
      { status: 400 },
    );
  }

  const validationResult = validateJobListingValues({
    applicationDeadline: getPayloadValue(payload, "applicationDeadline"),
    companyName: getPayloadValue(payload, "companyName"),
    department: getPayloadValue(payload, "department"),
    employmentType: getPayloadValue(payload, "employmentType"),
    experienceMax: getPayloadValue(payload, "experienceMax"),
    experienceMin: getPayloadValue(payload, "experienceMin"),
    jobStatus: getPayloadValue(payload, "jobStatus"),
    jobSummary: getPayloadValue(payload, "jobSummary"),
    jobTitle: getPayloadValue(payload, "jobTitle"),
    location: getPayloadValue(payload, "location"),
    openings: getPayloadValue(payload, "openings"),
    requiredSkills: getPayloadValue(payload, "requiredSkills"),
    responsibilities: getPayloadValue(payload, "responsibilities"),
    salaryMax: getPayloadValue(payload, "salaryMax"),
    salaryMin: getPayloadValue(payload, "salaryMin"),
    workMode: getPayloadValue(payload, "workMode"),
  });

  if (!validationResult.isValid || !validationResult.record) {
    return NextResponse.json(
      {
        errors: validationResult.errors satisfies JobListingValidationErrors,
        message: "Please correct the highlighted fields.",
      },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { applicants_count: applicantsCount, ...jobUpdateValues } =
      validationResult.record;
    void applicantsCount;
    const { error } = await supabase
      .from(jobListingsTableName)
      .update({
        ...jobUpdateValues,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (error) {
      logJobListingWriteError("update", error);

      return NextResponse.json(
        {
          message: getJobListingWriteFailureMessage("update", error.message),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Job listing updated successfully.",
    });
  } catch (error) {
    logJobListingWriteError("update", error);

    return NextResponse.json(
      {
        message: getJobListingWriteFailureMessage(
          "update",
          error instanceof Error ? error.message : undefined,
        ),
      },
      { status: 500 },
    );
  }
};
