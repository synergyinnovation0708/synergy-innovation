import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api";
import {
  jobListingStatuses,
  type JobListingStatus,
} from "@/lib/job-listings";
import { createAdminClient } from "@/lib/supabase/admin";

const jobListingsTableName =
  process.env.SUPABASE_JOB_LISTINGS_TABLE?.trim() || "job_listings";

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

const isJobListingStatus = (value: string): value is JobListingStatus =>
  jobListingStatuses.includes(value as JobListingStatus);

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

  const status =
    typeof payload === "object" &&
    payload !== null &&
    "status" in (payload as Record<string, unknown>)
      ? String((payload as Record<string, unknown>).status).trim()
      : "";

  if (!status) {
    return NextResponse.json(
      {
        message: "Status is required.",
      },
      { status: 400 },
    );
  }

  if (!isJobListingStatus(status)) {
    return NextResponse.json(
      {
        message: "Select a valid job status.",
      },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from(jobListingsTableName)
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (error) {
      return NextResponse.json(
        {
          message: "Unable to update job status right now.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Job status updated successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        message: "Unable to update job status right now.",
      },
      { status: 500 },
    );
  }
};
