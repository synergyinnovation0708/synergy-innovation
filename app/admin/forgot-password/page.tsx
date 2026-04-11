import { redirectIfAuthenticatedAdmin } from "@/lib/admin-auth";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { AdminForgotPasswordPage } from "@/screens/AdminLoginPage/AdminForgotPasswordPage";

const forgotPasswordErrorMessages: Record<string, string> = {
  "invalid-link":
    "That recovery link is invalid or has expired. Request a fresh reset email.",
  "not-authorized":
    "That recovery link is not tied to an authorized admin account.",
  "supabase-not-configured":
    "Supabase is not configured yet. Add the required environment variables before using password recovery.",
};

type AdminForgotPasswordProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminForgotPassword({
  searchParams,
}: AdminForgotPasswordProps) {
  await redirectIfAuthenticatedAdmin();

  const params = searchParams ? await searchParams : undefined;
  const errorParam = params?.error;
  const errorCode = Array.isArray(errorParam) ? errorParam[0] : errorParam;

  return (
    <AdminForgotPasswordPage
      emailHint={process.env.SUPABASE_ADMIN_EMAIL}
      errorMessage={
        errorCode ? forgotPasswordErrorMessages[errorCode] : undefined
      }
      isSupabaseConfigured={hasSupabaseEnv()}
    />
  );
}
