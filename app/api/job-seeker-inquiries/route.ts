import { NextResponse } from "next/server";
import {
  deleteCloudinaryUpload,
  hasCloudinaryEnv,
  uploadResumeToCloudinary,
} from "@/lib/cloudinary";
import {
  validateJobSeekerInquiryValues,
  validateResumeFileBytes,
  validateResumeMetadata,
  type JobSeekerValidationErrors,
} from "@/lib/job-seeker-inquiries";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";

const jobSeekerInquiriesTableName =
  process.env.SUPABASE_JOB_SEEKER_INQUIRIES_TABLE?.trim() ||
  "job_seeker_inquiries";
const candidateProfilesTableName =
  process.env.SUPABASE_CANDIDATE_PROFILES_TABLE?.trim() || "candidate_profiles";

const getStringField = (formData: FormData, fieldName: string) => {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
};

const getEmailAlreadyRegisteredMessage = () =>
  "An account with this email already exists. Try logging in with the same email.";

const isAuthUserAlreadyRegisteredError = (error: unknown) =>
  error instanceof Error &&
  /already registered|already exists|duplicate/i.test(error.message);

const getJobSeekerFailureMessage = (error: unknown) => {
  if (!(error instanceof Error) || !error.message) {
    return "Unable to submit your profile right now.";
  }

  // Log the error for server-side monitoring
  // console.error("Job seeker inquiry internal error:", error);

  // Return the actual error message even in production for debugging
  return error.message;
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

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      {
        message: "Invalid form submission.",
      },
      { status: 400 },
    );
  }

  const validationResult = validateJobSeekerInquiryValues({
    contact: getStringField(formData, "contact"),
    currentCompany: getStringField(formData, "currentCompany"),
    currentPosition: getStringField(formData, "currentPosition"),
    email: getStringField(formData, "email"),
    name: getStringField(formData, "name"),
    password: getStringField(formData, "password"),
  }, {
    requirePassword: Boolean(getStringField(formData, "password").trim()),
  });
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
  const errors: JobSeekerValidationErrors = {
    ...validationResult.errors,
  };

  if (resumeMetadataValidation.error) {
    errors.resume = resumeMetadataValidation.error;
  }

  if (!validationResult.isValid || !validationResult.record || errors.resume) {
    return NextResponse.json(
      {
        errors,
        message: "Please correct the highlighted fields.",
      },
      { status: 400 },
    );
  }

  const selectedResumeFile = resumeFile;

  if (!selectedResumeFile) {
    return NextResponse.json(
      {
        errors: {
          resume: "Resume is required.",
        },
        message: "Please upload a valid resume file.",
      },
      { status: 400 },
    );
  }

  const fileBytes = new Uint8Array(await selectedResumeFile.arrayBuffer());
  const resumeFileValidation = validateResumeFileBytes(
    fileBytes,
    selectedResumeFile.name,
  );

  if (resumeFileValidation.error || !resumeFileValidation.extension) {
    return NextResponse.json(
      {
        errors: {
          resume:
            resumeFileValidation.error ?? "Upload a valid PDF or Word resume.",
        },
        message: "Please upload a valid resume file.",
      },
      { status: 400 },
    );
  }

  let uploadedResume:
    | {
        publicId: string;
        secureUrl: string;
      }
    | null = null;
  let createdAuthUserId: string | null = null;

  try {
    const cloudinaryUpload = await uploadResumeToCloudinary({
      contentType:
        resumeMetadataValidation.mimeType ?? "application/octet-stream",
      extension: resumeFileValidation.extension,
      fileBytes,
      fileName: selectedResumeFile.name,
    });

    uploadedResume = {
      publicId: cloudinaryUpload.publicId,
      secureUrl: cloudinaryUpload.secureUrl,
    };

    const supabase = createAdminClient();
    const normalizedPassword = validationResult.normalized.password;

    if (normalizedPassword) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: validationResult.normalized.email,
        email_confirm: true,
        password: normalizedPassword,
        user_metadata: {
          candidate_registration: true,
          current_company: validationResult.normalized.currentCompany,
          current_position: validationResult.normalized.currentPosition,
          full_name: validationResult.normalized.name,
        },
      });

      if (authError) {
        await deleteCloudinaryUpload(cloudinaryUpload.publicId).catch(() => null);

        if (isAuthUserAlreadyRegisteredError(authError)) {
          return NextResponse.json(
            {
              errors: {
                email: getEmailAlreadyRegisteredMessage(),
              },
              message: getEmailAlreadyRegisteredMessage(),
            },
            { status: 409 },
          );
        }

        throw authError;
      }

      createdAuthUserId = authData.user?.id ?? null;
    }

    const { error } = await supabase.from(jobSeekerInquiriesTableName).insert({
      ...validationResult.record,
      resume_bytes: cloudinaryUpload.bytes,
      resume_content_type: resumeMetadataValidation.mimeType,
      resume_extension: resumeFileValidation.extension,
      resume_original_name: selectedResumeFile.name,
      resume_public_id: cloudinaryUpload.publicId,
      resume_url: cloudinaryUpload.secureUrl,
    });

    if (error) {
      await deleteCloudinaryUpload(cloudinaryUpload.publicId).catch(() => null);
      if (createdAuthUserId) {
        await supabase.auth.admin.deleteUser(createdAuthUserId).catch(() => null);
      }
      console.error("Job seeker inquiry insert failed:", error);

      return NextResponse.json(
        {
          message: error.message || "Unable to submit your profile right now.",
        },
        { status: 500 },
      );
    }

    if (createdAuthUserId) {
      const { error: candidateProfileSeedError } = await supabase
        .from(candidateProfilesTableName)
        .upsert(
          {
            contact_number: validationResult.normalized.contact,
            current_company: validationResult.normalized.currentCompany,
            current_position: validationResult.normalized.currentPosition,
            email: validationResult.normalized.email,
            full_name: validationResult.normalized.name,
            resume_bytes: cloudinaryUpload.bytes,
            resume_extension: resumeFileValidation.extension,
            resume_original_name: selectedResumeFile.name,
            resume_url: cloudinaryUpload.secureUrl,
            updated_at: new Date().toISOString(),
            user_id: createdAuthUserId,
          },
          {
            onConflict: "user_id",
          },
        );

      if (candidateProfileSeedError) {
        console.error("Candidate profile seed skipped:", candidateProfileSeedError);
      }
    }

    return NextResponse.json({
      message: normalizedPassword
        ? "Your account and candidate profile have been created successfully."
        : "Your profile has been submitted successfully.",
    });
  } catch (error) {
    console.error("Job seeker inquiry submission failed:", error);

    if (uploadedResume?.publicId) {
      await deleteCloudinaryUpload(uploadedResume.publicId).catch(() => null);
    }

    if (createdAuthUserId) {
      await createAdminClient().auth.admin.deleteUser(createdAuthUserId).catch(() => null);
    }

    return NextResponse.json(
      {
        message: getJobSeekerFailureMessage(error),
      },
      { status: 500 },
    );
  }
};
