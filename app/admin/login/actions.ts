"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";

const readField = (formData: FormData, key: string) => {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
};

const redirectWithError = (code: string) => {
  redirect(`/admin/login?error=${code}`);
};

export const loginAdmin = async (formData: FormData) => {
  if (!hasSupabaseEnv()) {
    redirectWithError("supabase-not-configured");
  }

  const email = readField(formData, "email").toLowerCase();
  const password = readField(formData, "password");

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

  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    redirectWithError("not-authorized");
  }

  revalidatePath("/", "layout");
  redirect("/admin/dashboard");
};
