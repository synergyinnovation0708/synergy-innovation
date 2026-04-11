export const ADMIN_PASSWORD_RECOVERY_COOKIE = "admin-password-recovery";
export const adminForgotPasswordPath = "/admin/forgot-password";
export const adminResetPasswordPath = "/admin/reset-password";

export const getSafeRedirectPath = (
  value: string | null | undefined,
  fallbackPath = "/",
) => {
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return fallbackPath;
  }

  return value;
};
