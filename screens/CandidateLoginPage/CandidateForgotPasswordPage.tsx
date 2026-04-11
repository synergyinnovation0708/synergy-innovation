"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const forgotPasswordHighlights = [
  {
    description:
      "Request a secure reset link without exposing your candidate password.",
    icon: ShieldCheck,
    title: "Protected Recovery",
  },
  {
    description:
      "Use the same email you registered with for your Synergy candidate profile.",
    icon: BadgeCheck,
    title: "Same Candidate Identity",
  },
  {
    description:
      "After opening the verified email link, choose a fresh password and sign in again.",
    icon: KeyRound,
    title: "Fresh Credentials",
  },
];

const inputClassName =
  "mt-2 h-[56px] w-full rounded-[20px] border border-[#dbe3f1] bg-[#f8fbff] px-4 text-[16px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8b96b3] focus:border-[#00adef] focus:bg-white";

type CandidateForgotPasswordPageProps = {
  errorMessage?: string;
  isSupabaseConfigured: boolean;
};

export const CandidateForgotPasswordPage = ({
  errorMessage,
  isSupabaseConfigured,
}: CandidateForgotPasswordPageProps) => {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    tone: "error" | "success";
    value: string;
  } | null>(
    errorMessage
      ? {
          tone: "error",
          value: errorMessage,
        }
      : null,
  );
  const isDisabled = !isSupabaseConfigured || isSubmitting;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldError(null);
    setStatusMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/candidate/forgot-password", {
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json().catch(() => null)) as
        | {
            errors?: {
              email?: string;
            };
            message?: string;
          }
        | null;

      if (!response.ok) {
        setFieldError(data?.errors?.email ?? null);
        setStatusMessage({
          tone: "error",
          value:
            data?.message ?? "Unable to send the candidate reset email right now.",
        });
        return;
      }

      setFieldError(null);
      setStatusMessage({
        tone: "success",
        value:
          data?.message ??
          "If a candidate account matches that email, a reset link has been sent.",
      });
    } catch {
      setStatusMessage({
        tone: "error",
        value: "Unable to send the candidate reset email right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#edf7ff_0%,#ffffff_50%,#f7f8fc_100%)]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at top left, rgba(0,173,239,0.18), transparent 26%), radial-gradient(circle at bottom right, rgba(29,34,63,0.12), transparent 30%)",
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
                  "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 42%), radial-gradient(circle at bottom left, rgba(0,173,239,0.35), transparent 35%)",
              }}
            />

            <div className="relative">
              <Link
                href="/candidate/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-white/14"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Candidate Login
              </Link>

              <div className="mt-12 max-w-[560px]">
                <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#a6e4ff]">
                  Candidate Recovery
                </p>
                <h1 className="mt-5 text-[40px] font-bold leading-[1.05] sm:text-[54px]">
                  Recover access to
                  <br />
                  your profile
                </h1>
                <p className="mt-5 max-w-[520px] text-[18px] leading-[1.7] text-white/78 sm:text-[20px]">
                  Request a secure password reset link for your candidate
                  account and continue back into your profile after verification.
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {forgotPasswordHighlights.map((item) => {
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
                  Recovery note
                </p>
                <p className="mt-2 max-w-[480px] text-[15px] leading-[1.7] text-white/72">
                  Use the same email you used during candidate registration.
                  After the email link is verified, you can choose a fresh
                  password and sign in again.
                </p>
              </div>
            </div>
          </section>

          <section className="flex items-center">
            <div className="w-full rounded-[36px] border border-[#dce6f4] bg-white p-6 shadow-[0_30px_80px_rgba(29,34,63,0.12)] sm:p-8 lg:p-10">
              <Link
                href="/candidate/login"
                className="inline-flex items-center gap-2 rounded-full border border-[#dbe3f1] bg-[#f8fbff] px-4 py-2 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-white lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Candidate Login
              </Link>

              <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eaf8ff] text-[#00adef] lg:mt-0">
                <Mail className="h-6 w-6" />
              </div>

              <div className="mt-6">
                <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-[#00adef]">
                  Reset Access
                </p>
                <h2 className="mt-3 text-[34px] font-bold leading-[1.1] text-[#1d223f] sm:text-[40px]">
                  Forgot password
                </h2>
                <p className="mt-3 text-[16px] leading-[1.7] text-[#67728f]">
                  Enter your candidate email and we&apos;ll send a reset link if
                  the account is eligible for recovery.
                </p>
              </div>

              {statusMessage ? (
                <div
                  className={cn(
                    "mt-8 rounded-[22px] px-4 py-3 text-[14px] font-medium",
                    statusMessage.tone === "success"
                      ? "border border-[#cdeedc] bg-[#eefbf4] text-[#147a4b]"
                      : "border border-[#ffd8d8] bg-[#fff5f5] text-[#b53c3c]",
                  )}
                >
                  {statusMessage.value}
                </div>
              ) : null}

              <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="candidate-recovery-email"
                    className="text-[15px] font-semibold text-[#1d223f]"
                  >
                    Candidate Email
                  </label>
                  <input
                    id="candidate-recovery-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setFieldError(null);
                    }}
                    placeholder="Enter your registered email"
                    className={inputClassName}
                    disabled={isDisabled}
                    required
                  />
                  {fieldError ? (
                    <p className="mt-2 text-[13px] text-[#c05a5a]">
                      {fieldError}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={isDisabled}
                  className="group mx-auto inline-flex h-[54px] items-center justify-center gap-2 rounded-full bg-[#1d223f] px-4 text-[17px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/10">
                        <LockKeyhole className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
                      </span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 rounded-[28px] bg-[#f5f9ff] p-5">
                <p className="text-[15px] font-semibold text-[#1d223f]">
                  Remembered your password?
                </p>
                <p className="mt-2 text-[14px] leading-[1.7] text-[#67728f]">
                  {isSupabaseConfigured
                    ? "Go back to candidate login anytime if you remember the password."
                    : "Add the required Supabase environment variables before using candidate password recovery."}
                </p>
                <Link
                  href="/candidate/login"
                  className="mt-4 inline-flex text-[14px] font-semibold text-[#00adef] transition-colors duration-200 hover:text-[#008fc7]"
                >
                  Return to candidate login
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
