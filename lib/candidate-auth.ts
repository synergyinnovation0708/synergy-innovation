import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { isAdminUser } from "./admin-auth";
import { createClient } from "./supabase/server";
import { hasSupabaseEnv } from "./supabase/public-env";

const candidateLoginPath = "/candidate/login";
const candidateProfilePath = "/candidate/profile";

export const resolveCandidateRedirectPath = (redirectTo?: string | null) => {
  if (redirectTo?.startsWith("/")) {
    return redirectTo;
  }

  return candidateProfilePath;
};

export type CandidateIdentity = {
  email: string;
  id: string;
  joinedAt: string | null;
  name: string;
};

export const toCandidateIdentity = (user: User): CandidateIdentity => ({
  email: user.email ?? "",
  id: user.id,
  joinedAt: user.created_at ?? null,
  name:
    (typeof user.user_metadata?.full_name === "string" &&
      user.user_metadata.full_name) ||
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
    "Candidate",
});

export const requireCandidateUser = async () => {
  if (!hasSupabaseEnv()) {
    redirect(`${candidateLoginPath}?error=supabase-not-configured`);
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(candidateLoginPath);
  }

  if (isAdminUser(user)) {
    redirect("/admin/dashboard");
  }

  return toCandidateIdentity(user);
};

export const redirectIfAuthenticatedCandidate = async (
  redirectTo?: string | null,
) => {
  if (!hasSupabaseEnv()) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  if (isAdminUser(user)) {
    redirect("/admin/dashboard");
  }

  redirect(resolveCandidateRedirectPath(redirectTo));
};
