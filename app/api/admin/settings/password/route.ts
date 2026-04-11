import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api";
import {
  isJobSeekerPasswordValid,
  jobSeekerPasswordRequirementText,
} from "@/lib/job-seeker-inquiries";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/supabase/public-env";

type PasswordFieldName =
  | "confirmPassword"
  | "currentPassword"
  | "newPassword";

type PasswordValidationErrors = Partial<Record<PasswordFieldName, string>>;

const readPayloadField = (payload: unknown, fieldName: PasswordFieldName) =>
  typeof payload === "object" &&
  payload !== null &&
  fieldName in (payload as Record<string, unknown>)
    ? String((payload as Record<string, unknown>)[fieldName]).trim()
    : "";

export const POST = async (request: Request) => {
  const accessErrorResponse = await requireAdminApiAccess();

  if (accessErrorResponse) {
    return accessErrorResponse;
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      {
        message: "Authentication required.",
      },
      { status: 401 },
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

  const currentPassword = readPayloadField(payload, "currentPassword");
  const newPassword = readPayloadField(payload, "newPassword");
  const confirmPassword = readPayloadField(payload, "confirmPassword");
  const errors: PasswordValidationErrors = {};

  if (!currentPassword) {
    errors.currentPassword = "Current password is required.";
  }

  if (!newPassword) {
    errors.newPassword = "New password is required.";
  } else if (!isJobSeekerPasswordValid(newPassword)) {
    errors.newPassword = jobSeekerPasswordRequirementText;
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm your new password.";
  } else if (newPassword && confirmPassword !== newPassword) {
    errors.confirmPassword = "New password and confirmation must match.";
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.newPassword = "Choose a new password different from the current password.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        errors,
        message: "Please correct the highlighted password fields.",
      },
      { status: 400 },
    );
  }

  if (!user.email) {
    return NextResponse.json(
      {
        message: "Admin email is unavailable for password verification.",
      },
      { status: 400 },
    );
  }

  try {
    const { supabasePublishableKey, supabaseUrl } = getSupabasePublicEnv();
    const verificationClient = createSupabaseClient(
      supabaseUrl,
      supabasePublishableKey,
      {
        auth: {
          autoRefreshToken: false,
          detectSessionInUrl: false,
          persistSession: false,
        },
      },
    );
    const {
      data: verificationData,
      error: verificationError,
    } = await verificationClient.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verificationError || !verificationData.user) {
      return NextResponse.json(
        {
          errors: {
            currentPassword: "Current password is incorrect.",
          } satisfies PasswordValidationErrors,
          message: "Current password is incorrect.",
        },
        { status: 400 },
      );
    }

    await verificationClient.auth.signOut().catch(() => null);

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return NextResponse.json(
        {
          message: "Unable to update the admin password right now.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Admin password updated successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        message: "Unable to update the admin password right now.",
      },
      { status: 500 },
    );
  }
};
