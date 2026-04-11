import { type NextRequest, NextResponse } from "next/server";
import {
  buildPasswordRecoveryRedirectUrl,
  getPasswordRecoveryErrorMessage,
} from "@/lib/auth-recovery-url";
import { candidateResetPasswordPath } from "@/lib/candidate-password-recovery";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { createRouteClient } from "@/lib/supabase/route";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const readPayloadEmail = (payload: unknown) =>
  typeof payload === "object" &&
  payload !== null &&
  "email" in (payload as Record<string, unknown>)
    ? String((payload as Record<string, unknown>).email).trim().toLowerCase()
    : "";

export const POST = async (request: NextRequest) => {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      {
        message:
          "Supabase is not configured yet. Add the required environment variables before sending reset emails.",
      },
      { status: 500 },
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

  const email = readPayloadEmail(payload);

  if (!email) {
    return NextResponse.json(
      {
        errors: {
          email: "Candidate email is required.",
        },
        message: "Enter the candidate email address to continue.",
      },
      { status: 400 },
    );
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      {
        errors: {
          email: "Enter a valid email address.",
        },
        message: "Enter a valid candidate email address.",
      },
      { status: 400 },
    );
  }

  const successResponse = NextResponse.json({
    message:
      "If a candidate account matches that email, a reset link has been sent.",
  });

  try {
    const { applySupabaseCookies, supabase } = createRouteClient(request);
    const redirectTo = buildPasswordRecoveryRedirectUrl(
      request,
      candidateResetPasswordPath,
    );

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error("Candidate forgot password error:", error.message);

      return applySupabaseCookies(
        NextResponse.json(
          {
            message: getPasswordRecoveryErrorMessage(
              "candidate",
              error.message,
            ),
          },
          { status: 500 },
        ),
      );
    }

    return applySupabaseCookies(successResponse);
  } catch (error) {
    console.error("Candidate forgot password exception:", error);

    return NextResponse.json(
      {
        message: "Unable to send the candidate reset email right now.",
      },
      { status: 500 },
    );
  }
};
