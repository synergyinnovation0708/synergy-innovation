import {
  redirectIfAuthenticatedCandidate,
  resolveCandidateRedirectPath,
} from "@/lib/candidate-auth";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { CandidateLoginPage } from "@/screens/CandidateLoginPage/CandidateLoginPage";

const loginErrorMessages: Record<string, string> = {
  "invalid-credentials": "The email or password you entered is incorrect.",
  "missing-credentials": "Enter both your email and password to continue.",
  "supabase-not-configured":
    "Supabase is not configured yet. Add the required environment variables before candidate sign-in.",
};

type CandidateLoginRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CandidateLogin({
  searchParams,
}: CandidateLoginRouteProps) {
  const params = searchParams ? await searchParams : undefined;
  const errorParam = params?.error;
  const redirectParam = params?.redirectTo;
  const jobTitleParam = params?.jobTitle;
  const errorCode = Array.isArray(errorParam) ? errorParam[0] : errorParam;
  const redirectTo = resolveCandidateRedirectPath(
    Array.isArray(redirectParam) ? redirectParam[0] : redirectParam,
  );
  const jobTitle = Array.isArray(jobTitleParam) ? jobTitleParam[0] : jobTitleParam;

  await redirectIfAuthenticatedCandidate(redirectTo);

  return (
    <CandidateLoginPage
      errorMessage={errorCode ? loginErrorMessages[errorCode] : undefined}
      isSupabaseConfigured={hasSupabaseEnv()}
      jobTitle={jobTitle}
      redirectTo={redirectTo}
    />
  );
}
