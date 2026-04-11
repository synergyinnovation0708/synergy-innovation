"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/admin-auth";
import { resolveCandidateRedirectPath } from "@/lib/candidate-auth";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";

const readField = (formData: FormData, key: string) => {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
};

const redirectWithError = (code: string) => {
  redirect(`/candidate/login?error=${code}`);
};

export const loginCandidate = async (formData: FormData) => {
  if (!hasSupabaseEnv()) {
    redirectWithError("supabase-not-configured");
  }

  const email = readField(formData, "email").toLowerCase();
  const password = readField(formData, "password");
  const redirectTo = readField(formData, "redirectTo");

  if (!email || !password) {
    redirectWithError("missing-credentials");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirectWithError("invalid-credentials");
  }

  revalidatePath("/", "layout");

  if (isAdminUser(data.user)) {
    redirect("/admin/dashboard");
  }

  redirect(resolveCandidateRedirectPath(redirectTo));
};
