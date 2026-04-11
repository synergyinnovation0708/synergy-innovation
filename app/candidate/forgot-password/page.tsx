import { redirectIfAuthenticatedCandidate } from "@/lib/candidate-auth";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { CandidateForgotPasswordPage } from "@/screens/CandidateLoginPage/CandidateForgotPasswordPage";

const forgotPasswordErrorMessages: Record<string, string> = {
  "invalid-link":
    "That recovery link is invalid or has expired. Request a fresh reset email.",
  "not-authorized":
    "That recovery link is not tied to a candidate account.",
  "supabase-not-configured":
    "Supabase is not configured yet. Add the required environment variables before using password recovery.",
};

type CandidateForgotPasswordProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CandidateForgotPassword({
  searchParams,
}: CandidateForgotPasswordProps) {
  await redirectIfAuthenticatedCandidate();

  const params = searchParams ? await searchParams : undefined;
  const errorParam = params?.error;
  const errorCode = Array.isArray(errorParam) ? errorParam[0] : errorParam;

  return (
    <CandidateForgotPasswordPage
      errorMessage={
        errorCode ? forgotPasswordErrorMessages[errorCode] : undefined
      }
      isSupabaseConfigured={hasSupabaseEnv()}
    />
  );
}
