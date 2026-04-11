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

const getPayloadValue = (
  payload: unknown,
  fieldName: keyof typeof jobListingInitialValues,
) =>
  typeof payload === "object" &&
  payload !== null &&
  fieldName in (payload as Record<string, unknown>)
    ? String((payload as Record<string, unknown>)[fieldName])
    : "";

export const POST = async (request: Request) => {
  const accessErrorResponse = await requireAdminApiAccess();

  if (accessErrorResponse) {
    return accessErrorResponse;
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
    const { error } = await supabase
      .from(jobListingsTableName)
      .insert(validationResult.record);

    if (error) {
      logJobListingWriteError("create", error);

      return NextResponse.json(
        {
          message: getJobListingWriteFailureMessage("create", error.message),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Job listing created successfully.",
    });
  } catch (error) {
    logJobListingWriteError("create", error);

    return NextResponse.json(
      {
        message: getJobListingWriteFailureMessage(
          "create",
          error instanceof Error ? error.message : undefined,
        ),
      },
      { status: 500 },
    );
  }
};
