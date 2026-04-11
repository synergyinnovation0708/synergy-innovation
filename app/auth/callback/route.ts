import { type NextRequest, NextResponse } from "next/server";
import { isAdminUser } from "@/lib/admin-auth";
import {
  ADMIN_PASSWORD_RECOVERY_COOKIE,
  adminForgotPasswordPath,
  adminResetPasswordPath,
  getSafeRedirectPath,
} from "@/lib/admin-password-recovery";
import {
  CANDIDATE_PASSWORD_RECOVERY_COOKIE,
  candidateForgotPasswordPath,
  candidateResetPasswordPath,
} from "@/lib/candidate-password-recovery";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { createRouteClient } from "@/lib/supabase/route";

const buildRedirectResponse = (request: NextRequest, nextPath: string) =>
  NextResponse.redirect(new URL(nextPath, request.url));

const recoveryConfigByPath = {
  [adminResetPasswordPath]: {
    cookieName: ADMIN_PASSWORD_RECOVERY_COOKIE,
    forgotPath: adminForgotPasswordPath,
    isAuthorizedUser: isAdminUser,
    resetPath: adminResetPasswordPath,
  },
  [candidateResetPasswordPath]: {
    cookieName: CANDIDATE_PASSWORD_RECOVERY_COOKIE,
    forgotPath: candidateForgotPasswordPath,
    isAuthorizedUser: (user: Parameters<typeof isAdminUser>[0]) =>
      !isAdminUser(user),
    resetPath: candidateResetPasswordPath,
  },
} as const;

export const GET = async (request: NextRequest) => {
  const requestUrl = new URL(request.url);
  const nextPath = getSafeRedirectPath(requestUrl.searchParams.get("next"));
  const code = requestUrl.searchParams.get("code");
  const recoveryConfig =
    recoveryConfigByPath[nextPath as keyof typeof recoveryConfigByPath];
  const forgotPasswordErrorPath = recoveryConfig
    ? `${recoveryConfig.forgotPath}?error=invalid-link`
    : `${adminForgotPasswordPath}?error=invalid-link`;

  if (!hasSupabaseEnv()) {
    return buildRedirectResponse(
      request,
      recoveryConfig
        ? `${recoveryConfig.forgotPath}?error=supabase-not-configured`
        : "/",
    );
  }

  if (!code) {
    return buildRedirectResponse(
      request,
      recoveryConfig ? forgotPasswordErrorPath : nextPath,
    );
  }

  try {
    const { applySupabaseCookies, supabase } = createRouteClient(request);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return applySupabaseCookies(
        buildRedirectResponse(
          request,
          recoveryConfig ? forgotPasswordErrorPath : "/",
        ),
      );
    }

    if (!recoveryConfig) {
      return applySupabaseCookies(buildRedirectResponse(request, nextPath));
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !recoveryConfig.isAuthorizedUser(user)) {
      await supabase.auth.signOut().catch(() => null);

      return applySupabaseCookies(
        buildRedirectResponse(
          request,
          `${recoveryConfig.forgotPath}?error=not-authorized`,
        ),
      );
    }

    const response = buildRedirectResponse(request, recoveryConfig.resetPath);

    response.cookies.set({
      maxAge: 0,
      name: recoveryConfig.cookieName,
      path: recoveryConfig.resetPath,
      value: "",
    });

    response.cookies.set({
      httpOnly: true,
      maxAge: 60 * 15,
      name: recoveryConfig.cookieName,
      path: "/",
      sameSite: "lax",
      secure: requestUrl.protocol === "https:",
      value: "1",
    });

    return applySupabaseCookies(response);
  } catch {
    return buildRedirectResponse(request, forgotPasswordErrorPath);
  }
};
