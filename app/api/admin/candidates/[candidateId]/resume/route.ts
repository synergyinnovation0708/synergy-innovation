import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api";
import {
  createCloudinaryPrivateDownloadUrl,
  hasCloudinaryEnv,
} from "@/lib/cloudinary";
import { createAdminClient } from "@/lib/supabase/admin";

const candidateProfilesTableName =
  process.env.SUPABASE_CANDIDATE_PROFILES_TABLE?.trim() || "candidate_profiles";

type RouteContext = {
  params: Promise<{
    candidateId: string;
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

  const { candidateId } = await context.params;

  if (!candidateId?.trim()) {
    return NextResponse.json(
      {
        message: "Candidate id is required.",
      },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(candidateProfilesTableName)
      .select("resume_url")
      .eq("user_id", candidateId)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          message: "Unable to load the candidate resume right now.",
        },
        { status: 500 },
      );
    }

    const resumeUrl =
      typeof data?.resume_url === "string" ? data.resume_url.trim() : "";

    if (!resumeUrl) {
      return NextResponse.json(
        {
          message: "Resume not found for this candidate.",
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
        message: "Unable to load the candidate resume right now.",
      },
      { status: 500 },
    );
  }
};
