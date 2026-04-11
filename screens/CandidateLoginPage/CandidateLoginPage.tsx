import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  FileBadge2,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { loginCandidate } from "@/app/candidate/login/actions";
import { CandidateLoginSubmitButton } from "./CandidateLoginSubmitButton";

const candidateHighlights = [
  {
    description: "Keep your resume profile ready for recruiter review.",
    icon: FileBadge2,
    title: "Profile Ready",
  },
  {
    description: "Return to your candidate dashboard anytime you need it.",
    icon: BriefcaseBusiness,
    title: "Track Your Journey",
  },
  {
    description: "Jump back into the same Synergy hiring flow in seconds.",
    icon: Sparkles,
    title: "Fast Access",
  },
];

const inputClassName =
  "mt-2 h-[56px] w-full rounded-[20px] border border-[#dbe3f1] bg-[#f8fbff] px-4 text-[16px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8b96b3] focus:border-[#00adef] focus:bg-white";

type CandidateLoginPageProps = {
  errorMessage?: string;
  isSupabaseConfigured: boolean;
  jobTitle?: string;
  redirectTo?: string;
};

export const CandidateLoginPage = ({
  errorMessage,
  isSupabaseConfigured,
  jobTitle,
  redirectTo,
}: CandidateLoginPageProps) => {
  const loginDisabled = !isSupabaseConfigured;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#edf7ff_0%,#ffffff_48%,#f7f9fc_100%)]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at top left, rgba(0,173,239,0.16), transparent 28%), radial-gradient(circle at bottom right, rgba(29,34,63,0.12), transparent 30%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] items-center justify-center px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="w-full max-w-[640px] gap-8 lg:grid lg:max-w-none lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden overflow-hidden rounded-[36px] bg-[#1d223f] px-6 py-8 text-white shadow-[0_32px_90px_rgba(29,34,63,0.24)] sm:px-10 sm:py-12 lg:block">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 40%), radial-gradient(circle at bottom left, rgba(0,173,239,0.3), transparent 35%)",
              }}
            />

            <div className="relative">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-white/14"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Website
              </Link>

              <div className="mt-12 max-w-[560px]">
                <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#a6e4ff]">
                  Candidate Login
                </p>
                <h1 className="mt-5 text-[40px] font-bold leading-[1.15] sm:text-[54px]">
                  Pick Up Your Profile
                  <br />
                   Where You Left It!
                </h1>
                <p className="mt-5 max-w-[520px] text-[18px] leading-[1.7] text-white/78 sm:text-[20px]">
                  Sign in to view your candidate profile, resume status, and
                  profile-ready details for upcoming opportunities.
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {candidateHighlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="rounded-[24px] border border-white/12 bg-white/8 p-5 backdrop-blur-sm"
                    >
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 text-[#86ddff]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h2 className="mt-4 text-[18px] font-semibold leading-[1.2]">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-[14px] leading-[1.6] text-white/72">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>

              <div className="mt-10 rounded-[28px] border border-white/12 bg-white/6 p-6 backdrop-blur-sm">
                <p className="text-[18px] font-semibold leading-[1.2]">
                  New here?
                </p>
                <p className="mt-2 max-w-[480px] text-[15px] leading-[1.7] text-white/72">
                  Create your candidate account once, upload your resume, and
                  come back anytime to access your Synergy profile.
                </p>
                <Link
                  href="/registration/create-account"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-5 py-3 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-white/16"
                >
                  Register for free
                </Link>
              </div>
            </div>
          </section>

          <section className="flex items-center">
            <div className="w-full rounded-[36px] border border-[#dce6f4] bg-white p-6 shadow-[0_30px_80px_rgba(29,34,63,0.12)] sm:p-8 lg:p-10">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eaf8ff] text-[#00adef]">
                <LockKeyhole className="h-6 w-6" />
              </div>

              <div className="mt-6">
                <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-[#00adef]">
                  Welcome Back
                </p>
                <h2 className="mt-3 text-[34px] font-bold leading-[1.1] text-[#1d223f] sm:text-[40px]">
                  Candidate Sign In
                </h2>
                <p className="mt-3 text-[16px] leading-[1.7] text-[#67728f]">
                  Use the same email and password you created during candidate
                  registration.
                </p>
              </div>

              {jobTitle ? (
                <div className="mt-6 rounded-[22px] border border-[#d8f0ff] bg-[#eef9ff] px-4 py-3 text-[14px] font-medium text-[#0b5f86]">
                  Sign in to apply for <span className="font-semibold">{jobTitle}</span>.
                </div>
              ) : null}

              {errorMessage ? (
                <div className="mt-8 rounded-[22px] border border-[#ffd8d8] bg-[#fff5f5] px-4 py-3 text-[14px] font-medium text-[#b53c3c]">
                  {errorMessage}
                </div>
              ) : null}

              <form action={loginCandidate} className="mt-10 space-y-6">
                <input type="hidden" name="redirectTo" value={redirectTo || "/candidate/profile"} />
                <div>
                  <label
                    htmlFor="candidate-email"
                    className="text-[15px] font-semibold text-[#1d223f]"
                  >
                    Email ID
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#8b96b3]" />
                    <input
                      id="candidate-email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      placeholder="Enter your registered email"
                      className={`${inputClassName} pl-11`}
                      disabled={loginDisabled}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="candidate-password"
                      className="text-[15px] font-semibold text-[#1d223f]"
                    >
                      Password
                    </label>
                    <Link
                      href="/candidate/forgot-password"
                      className="text-[14px] font-semibold text-[#00adef] transition-colors duration-200 hover:text-[#008fc7]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#8b96b3]" />
                    <input
                      id="candidate-password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className={`${inputClassName} pl-11`}
                      disabled={loginDisabled}
                      required
                    />
                  </div>
                </div>

                <CandidateLoginSubmitButton disabled={loginDisabled} />
              </form>

              <div className="mt-8 rounded-[28px] bg-[#f5f9ff] p-5">
                <p className="text-[15px] font-semibold text-[#1d223f]">
                  Need a profile first?
                </p>
                <p className="mt-2 text-[14px] leading-[1.7] text-[#67728f]">
                  {isSupabaseConfigured
                    ? "Register once to create your candidate account, then sign in here anytime."
                    : "Add the required Supabase environment variables before enabling candidate sign-in."}
                </p>
                <Link
                  href="/registration/create-account"
                  className="mt-4 inline-flex text-[14px] font-semibold text-[#00adef] transition-colors duration-200 hover:text-[#008fc7]"
                >
                  Create candidate account
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
