import { NextResponse } from "next/server";
import { requireCandidateApiAccess } from "@/lib/candidate-api";
import { getCandidateProfileData } from "@/lib/candidate-profile";
import {
  createCloudinaryResumeAccessUrl,
  deleteCloudinaryUpload,
  getCloudinaryAssetFromUrl,
  hasCloudinaryEnv,
  uploadResumeToCloudinary,
} from "@/lib/cloudinary";
import {
  validateResumeFileBytes,
  validateResumeMetadata,
} from "@/lib/job-seeker-inquiries";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";

const candidateProfilesTableName =
  process.env.SUPABASE_CANDIDATE_PROFILES_TABLE?.trim() || "candidate_profiles";

export const GET = async () => {
  const { errorResponse, identity } = await requireCandidateApiAccess();

  if (errorResponse || !identity) {
    return errorResponse;
  }

  try {
    const { initialValues } = await getCandidateProfileData(identity);
    const resumeUrl = initialValues.resumeUrl?.trim();

    if (!resumeUrl) {
      return NextResponse.json(
        {
          message: "Resume not found.",
        },
        { status: 404 },
      );
    }

    const signedResumeUrl = createCloudinaryResumeAccessUrl(resumeUrl);

    return NextResponse.redirect(signedResumeUrl, {
      status: 302,
    });
  } catch (error) {
    console.error("Candidate resume access failed:", error);

    return NextResponse.json(
      {
        message: "Unable to load your resume right now.",
      },
      { status: 500 },
    );
  }
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

  if (!hasCloudinaryEnv()) {
    return NextResponse.json(
      {
        message: "Cloudinary resume upload is not configured.",
      },
      { status: 500 },
    );
  }

  const { errorResponse, identity } = await requireCandidateApiAccess();

  if (errorResponse || !identity) {
    return errorResponse;
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      {
        message: "Invalid resume submission.",
      },
      { status: 400 },
    );
  }

  const resumeEntry = formData.get("resume");
  const resumeFile = resumeEntry instanceof File ? resumeEntry : null;
  const resumeMetadataValidation = validateResumeMetadata(
    resumeFile
      ? {
          name: resumeFile.name,
          size: resumeFile.size,
          type: resumeFile.type,
        }
      : null,
  );

  if (resumeMetadataValidation.error || !resumeFile) {
    return NextResponse.json(
      {
        message:
          resumeMetadataValidation.error ?? "Please upload a valid resume file.",
      },
      { status: 400 },
    );
  }

  const fileBytes = new Uint8Array(await resumeFile.arrayBuffer());
  const resumeFileValidation = validateResumeFileBytes(
    fileBytes,
    resumeFile.name,
  );

  if (resumeFileValidation.error || !resumeFileValidation.extension) {
    return NextResponse.json(
      {
        message:
          resumeFileValidation.error ?? "Please upload a valid resume file.",
      },
      { status: 400 },
    );
  }

  let uploadedResume:
    | {
        bytes: number;
        publicId: string;
        secureUrl: string;
      }
    | null = null;

  try {
    const { initialValues } = await getCandidateProfileData(identity);
    const previousResumeAsset = initialValues.resumeUrl
      ? getCloudinaryAssetFromUrl(initialValues.resumeUrl)
      : null;
    const supabase = createAdminClient();
    const cloudinaryUpload = await uploadResumeToCloudinary({
      contentType:
        resumeMetadataValidation.mimeType ?? "application/octet-stream",
      extension: resumeFileValidation.extension,
      fileBytes,
      fileName: resumeFile.name,
    });

    uploadedResume = {
      bytes: cloudinaryUpload.bytes,
      publicId: cloudinaryUpload.publicId,
      secureUrl: cloudinaryUpload.secureUrl,
    };

    const fullName =
      initialValues.fullName.trim() || identity.name.trim() || identity.email;
    const { error } = await supabase.from(candidateProfilesTableName).upsert(
      {
        contact_number: initialValues.contactNumber.trim(),
        email: identity.email,
        full_name: fullName,
        resume_bytes: cloudinaryUpload.bytes,
        resume_extension: resumeFileValidation.extension,
        resume_original_name: resumeFile.name,
        resume_url: cloudinaryUpload.secureUrl,
        updated_at: new Date().toISOString(),
        user_id: identity.id,
      },
      {
        onConflict: "user_id",
      },
    );

    if (error) {
      await deleteCloudinaryUpload(cloudinaryUpload.publicId).catch(() => null);

      console.error("Candidate resume replace failed:", error);

      return NextResponse.json(
        {
          message: "Unable to replace your resume right now.",
        },
        { status: 500 },
      );
    }

    if (
      previousResumeAsset?.publicId &&
      previousResumeAsset.publicId !== cloudinaryUpload.publicId
    ) {
      await deleteCloudinaryUpload(previousResumeAsset.publicId).catch(() => null);
    }

    return NextResponse.json({
      message: "Your resume has been replaced successfully.",
      resumeBytes: cloudinaryUpload.bytes,
      resumeExtension: resumeFileValidation.extension,
      resumeOriginalName: resumeFile.name,
      resumeUrl: cloudinaryUpload.secureUrl,
    });
  } catch (error) {
    console.error("Candidate resume replacement failed:", error);

    if (uploadedResume?.publicId) {
      await deleteCloudinaryUpload(uploadedResume.publicId).catch(() => null);
    }

    return NextResponse.json(
      {
        message: "Unable to replace your resume right now.",
      },
      { status: 500 },
    );
  }
};
