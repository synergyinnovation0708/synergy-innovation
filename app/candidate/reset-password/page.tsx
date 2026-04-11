import { cookies } from "next/headers";
import { CandidateResetPasswordPage } from "@/screens/CandidateLoginPage/CandidateResetPasswordPage";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { CANDIDATE_PASSWORD_RECOVERY_COOKIE } from "@/lib/candidate-password-recovery";

export default async function CandidateResetPassword() {
  const cookieStore = await cookies();
  const canReset =
    cookieStore.get(CANDIDATE_PASSWORD_RECOVERY_COOKIE)?.value === "1";

  return (
    <CandidateResetPasswordPage
      canReset={canReset}
      isSupabaseConfigured={hasSupabaseEnv()}
    />
  );
}
