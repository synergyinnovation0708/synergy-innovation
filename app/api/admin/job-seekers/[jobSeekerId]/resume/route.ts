import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api";
import {
  createCloudinaryPrivateDownloadUrl,
  hasCloudinaryEnv,
} from "@/lib/cloudinary";
import { createAdminClient } from "@/lib/supabase/admin";

const jobSeekerInquiriesTableName =
  process.env.SUPABASE_JOB_SEEKER_INQUIRIES_TABLE?.trim() ||
  "job_seeker_inquiries";

type RouteContext = {
  params: Promise<{
    jobSeekerId: string;
  }>;
};

export const GET = async (_request: Request, context: RouteContext) => {
  const accessErrorResponse = await requireAdminApiAccess();

  if (accessErrorResponse) {
    return accessErrorResponse;
  }

  if (!hasCloudinaryEnv()) {
    return NextResponse.json(
      {
        message: "Cloudinary resume access is not configured.",
      },
      { status: 500 },
    );
  }

  const { jobSeekerId } = await context.params;

  if (!jobSeekerId?.trim()) {
    return NextResponse.json(
      {
        message: "Job seeker id is required.",
      },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(jobSeekerInquiriesTableName)
      .select("resume_url")
      .eq("id", jobSeekerId)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          message: "Unable to load the job seeker resume right now.",
        },
        { status: 500 },
      );
    }

    const resumeUrl =
      typeof data?.resume_url === "string" ? data.resume_url.trim() : "";

    if (!resumeUrl) {
      return NextResponse.json(
        {
          message: "Resume not found for this job seeker.",
        },
        { status: 404 },
      );
    }

    const signedResumeUrl = createCloudinaryPrivateDownloadUrl(resumeUrl);

    return NextResponse.redirect(signedResumeUrl, {
      status: 302,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Unable to load the job seeker resume right now.",
      },
      { status: 500 },
    );
  }
};
