import { type NextRequest } from "next/server";

const DEFAULT_PUBLIC_APP_ORIGIN = "https://synergyinnovation.tech";
const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");
const isLocalOrigin = (value: string) =>
  /localhost|127\.0\.0\.1/i.test(value);

export const resolvePublicOrigin = (request: NextRequest) => {
  const configuredOrigin =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim();

  if (configuredOrigin) {
    return trimTrailingSlash(configuredOrigin);
  }

  const originHeader = request.headers.get("origin")?.trim();

  if (originHeader && isLocalOrigin(originHeader)) {
    return trimTrailingSlash(originHeader);
  }

  const forwardedHost = request.headers.get("x-forwarded-host")?.trim();

  if (forwardedHost && isLocalOrigin(forwardedHost)) {
    const forwardedProto =
      request.headers.get("x-forwarded-proto")?.trim() || "https";

    return `${forwardedProto}://${trimTrailingSlash(forwardedHost)}`;
  }

  if (isLocalOrigin(request.nextUrl.origin)) {
    return trimTrailingSlash(request.nextUrl.origin);
  }

  return DEFAULT_PUBLIC_APP_ORIGIN;
};

export const buildPasswordRecoveryRedirectUrl = (
  request: NextRequest,
  nextPath: string,
) => {
  const redirectTo = new URL("/auth/callback", resolvePublicOrigin(request));

  redirectTo.searchParams.set("next", nextPath);

  return redirectTo.toString();
};

export const getPasswordRecoveryErrorMessage = (
  audience: "admin" | "candidate",
  errorMessage: string,
) => {
  const normalizedMessage = errorMessage.toLowerCase();

  if (normalizedMessage.includes("redirect")) {
    return "Password recovery redirect URL is not allowed yet. Add this site URL to Supabase Auth redirect URLs and try again.";
  }

  if (normalizedMessage.includes("rate limit")) {
    return "Too many reset requests were sent recently. Please wait a bit and try again.";
  }

  return `Unable to send the ${audience} reset email right now.`;
};
