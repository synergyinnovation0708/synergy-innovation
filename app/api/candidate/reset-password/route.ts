import { type NextRequest, NextResponse } from "next/server";
import { isAdminUser } from "@/lib/admin-auth";
import {
  CANDIDATE_PASSWORD_RECOVERY_COOKIE,
  candidateResetPasswordPath,
} from "@/lib/candidate-password-recovery";
import {
  isJobSeekerPasswordValid,
  jobSeekerPasswordRequirementText,
} from "@/lib/job-seeker-inquiries";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { createRouteClient } from "@/lib/supabase/route";

type ResetPasswordFieldName = "confirmPassword" | "newPassword";
type ResetPasswordErrors = Partial<Record<ResetPasswordFieldName, string>>;

const readPayloadField = (
  payload: unknown,
  fieldName: ResetPasswordFieldName,
) =>
  typeof payload === "object" &&
  payload !== null &&
  fieldName in (payload as Record<string, unknown>)
    ? String((payload as Record<string, unknown>)[fieldName]).trim()
    : "";

const clearRecoveryCookie = (response: NextResponse) => {
  response.cookies.set({
    maxAge: 0,
    name: CANDIDATE_PASSWORD_RECOVERY_COOKIE,
    path: "/",
    value: "",
  });

  response.cookies.set({
    maxAge: 0,
    name: CANDIDATE_PASSWORD_RECOVERY_COOKIE,
    path: candidateResetPasswordPath,
    value: "",
  });

  return response;
};

export const POST = async (request: NextRequest) => {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      {
        message:
          "Supabase is not configured yet. Add the required environment variables before resetting the password.",
      },
      { status: 500 },
    );
  }

  if (request.cookies.get(CANDIDATE_PASSWORD_RECOVERY_COOKIE)?.value !== "1") {
    return clearRecoveryCookie(
      NextResponse.json(
        {
          message: "Recovery session expired. Request a new reset email.",
        },
        { status: 401 },
      ),
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

  const newPassword = readPayloadField(payload, "newPassword");
  const confirmPassword = readPayloadField(payload, "confirmPassword");
  const errors: ResetPasswordErrors = {};

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

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        errors,
        message: "Please correct the highlighted password fields.",
      },
      { status: 400 },
    );
  }

  try {
    const { applySupabaseCookies, supabase } = createRouteClient(request);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || isAdminUser(user)) {
      await supabase.auth.signOut().catch(() => null);

      return applySupabaseCookies(
        clearRecoveryCookie(
          NextResponse.json(
            {
              message: "Recovery session expired. Request a new reset email.",
            },
            { status: 401 },
          ),
        ),
      );
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return applySupabaseCookies(
        NextResponse.json(
          {
            message: "Unable to reset the candidate password right now.",
          },
          { status: 500 },
        ),
      );
    }

    await supabase.auth.signOut().catch(() => null);

    return applySupabaseCookies(
      clearRecoveryCookie(
        NextResponse.json({
          message:
            "Candidate password reset successfully. Sign in with your new password.",
        }),
      ),
    );
  } catch {
    return NextResponse.json(
      {
        message: "Unable to reset the candidate password right now.",
      },
      { status: 500 },
    );
  }
};
