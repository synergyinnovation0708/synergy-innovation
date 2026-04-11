import { redirectIfAuthenticatedAdmin } from "@/lib/admin-auth";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { AdminLoginPage } from "@/screens/AdminLoginPage/AdminLoginPage";

const loginErrorMessages: Record<string, string> = {
  "invalid-credentials": "The admin email or password is incorrect.",
  "missing-credentials": "Enter both the admin email and password to continue.",
  "not-authorized": "Your account signed in successfully, but it does not have admin access.",
  "supabase-not-configured":
    "Supabase is not configured yet. Add the required environment variables before signing in.",
};

type AdminLoginProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLogin({ searchParams }: AdminLoginProps) {
  await redirectIfAuthenticatedAdmin();

  const params = searchParams ? await searchParams : undefined;
  const errorParam = params?.error;
  const errorCode = Array.isArray(errorParam) ? errorParam[0] : errorParam;

  return (
    <AdminLoginPage
      emailHint={process.env.SUPABASE_ADMIN_EMAIL}
      errorMessage={errorCode ? loginErrorMessages[errorCode] : undefined}
      isSupabaseConfigured={hasSupabaseEnv()}
    />
  );
}
