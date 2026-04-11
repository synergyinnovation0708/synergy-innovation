import { cookies } from "next/headers";
import { ADMIN_PASSWORD_RECOVERY_COOKIE } from "@/lib/admin-password-recovery";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { AdminResetPasswordPage } from "@/screens/AdminLoginPage/AdminResetPasswordPage";

export default async function AdminResetPassword() {
  const cookieStore = await cookies();
  const canReset =
    cookieStore.get(ADMIN_PASSWORD_RECOVERY_COOKIE)?.value === "1";

  return (
    <AdminResetPasswordPage
      canReset={canReset}
      isSupabaseConfigured={hasSupabaseEnv()}
    />
  );
}
