"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { candidateForgotPasswordPath } from "@/lib/candidate-password-recovery";
import { jobSeekerPasswordRequirementText } from "@/lib/job-seeker-inquiries";
import { cn } from "@/lib/utils";

type ResetPasswordFormValues = {
  confirmPassword: string;
  newPassword: string;
};

type ResetPasswordFieldName = keyof ResetPasswordFormValues;
type ResetPasswordFormErrors = Partial<Record<ResetPasswordFieldName, string>>;

const resetPasswordHighlights = [
  {
    description:
      "The password can only be changed after a verified candidate recovery link is opened.",
    icon: ShieldCheck,
    title: "Verified Session",
  },
  {
    description:
      "Choose a new password that follows the same candidate account rules.",
    icon: KeyRound,
    title: "Secure Update",
  },
  {
    description:
      "After the reset, return to candidate login and continue your profile journey.",
    icon: BadgeCheck,
    title: "Back to Login",
  },
];

const inputClassName =
  "mt-2 h-[56px] w-full rounded-[20px] border border-[#dbe3f1] bg-[#f8fbff] px-4 text-[16px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8b96b3] focus:border-[#00adef] focus:bg-white";

const initialFormValues: ResetPasswordFormValues = {
  confirmPassword: "",
  newPassword: "",
};

type CandidateResetPasswordPageProps = {
  canReset: boolean;
  isSupabaseConfigured: boolean;
};

export const CandidateResetPasswordPage = ({
  canReset,
  isSupabaseConfigured,
}: CandidateResetPasswordPageProps) => {
  const [formValues, setFormValues] =
    useState<ResetPasswordFormValues>(initialFormValues);
  const [formErrors, setFormErrors] = useState<ResetPasswordFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    tone: "error" | "success";
    value: string;
  } | null>(null);
  const isDisabled = !isSupabaseConfigured || !canReset || isSubmitting;

  const updateFieldValue = (
    fieldName: ResetPasswordFieldName,
    value: ResetPasswordFormValues[ResetPasswordFieldName],
  ) => {
    setStatusMessage(null);
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: undefined,
    }));
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/candidate/reset-password", {
        body: JSON.stringify(formValues),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json().catch(() => null)) as
        | {
            errors?: ResetPasswordFormErrors;
            message?: string;
          }
        | null;

      if (!response.ok) {
        setFormErrors(data?.errors ?? {});
        setStatusMessage({
          tone: "error",
          value:
            data?.message ?? "Unable to reset the candidate password right now.",
        });
        return;
      }

      setFormErrors({});
      setFormValues(initialFormValues);
      setIsComplete(true);
      setStatusMessage({
        tone: "success",
        value:
          data?.message ??
          "Candidate password reset successfully. Sign in with your new password.",
      });
    } catch {
      setStatusMessage({
        tone: "error",
        value: "Unable to reset the candidate password right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showRecoveryError = !canReset || !isSupabaseConfigured;

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
                href={candidateForgotPasswordPath}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-white/14"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Recovery
              </Link>

              <div className="mt-12 max-w-[560px]">
                <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#a6e4ff]">
                  Candidate Reset
                </p>
                <h1 className="mt-5 text-[40px] font-bold leading-[1.05] sm:text-[54px]">
                  Create a new
                  <br />
                  candidate password
                </h1>
                <p className="mt-5 max-w-[520px] text-[18px] leading-[1.7] text-white/78 sm:text-[20px]">
                  Finish the recovery flow by choosing a strong password for
                  your candidate account, then sign in again with the updated
                  credentials.
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {resetPasswordHighlights.map((item) => {
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
            </div>
          </section>

          <section className="flex items-center">
            <div className="w-full rounded-[36px] border border-[#dce6f4] bg-white p-6 shadow-[0_30px_80px_rgba(29,34,63,0.12)] sm:p-8 lg:p-10">
              <Link
                href={candidateForgotPasswordPath}
                className="inline-flex items-center gap-2 rounded-full border border-[#dbe3f1] bg-[#f8fbff] px-4 py-2 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-white lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Recovery
              </Link>

              <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eaf8ff] text-[#00adef] lg:mt-0">
                <LockKeyhole className="h-6 w-6" />
              </div>

              <div className="mt-6">
                <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-[#00adef]">
                  Password Reset
                </p>
                <h2 className="mt-3 text-[34px] font-bold leading-[1.1] text-[#1d223f] sm:text-[40px]">
                  Set a new password
                </h2>
                <p className="mt-3 text-[16px] leading-[1.7] text-[#67728f]">
                  Use a strong password that follows the platform policy, then
                  return to candidate login.
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

              {showRecoveryError ? (
                <div className="mt-8 rounded-[28px] bg-[#f5f9ff] p-5">
                  <p className="text-[15px] font-semibold text-[#1d223f]">
                    Recovery link required
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.7] text-[#67728f]">
                    {isSupabaseConfigured
                      ? "This reset session is missing or has expired. Request a new candidate reset email to continue."
                      : "Add the required Supabase environment variables before using candidate password recovery."}
                  </p>
                  <Link
                    href={candidateForgotPasswordPath}
                    className="mt-4 inline-flex text-[14px] font-semibold text-[#00adef] transition-colors duration-200 hover:text-[#008fc7]"
                  >
                    Request a new reset link
                  </Link>
                </div>
              ) : isComplete ? (
                <div className="mt-8 rounded-[28px] bg-[#f5f9ff] p-5">
                  <p className="text-[15px] font-semibold text-[#1d223f]">
                    Password updated
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.7] text-[#67728f]">
                    Your candidate password has been reset. Return to the login
                    page and sign in with the new password.
                  </p>
                  <Link
                    href="/candidate/login"
                    className="mt-4 inline-flex text-[14px] font-semibold text-[#00adef] transition-colors duration-200 hover:text-[#008fc7]"
                  >
                    Go to candidate login
                  </Link>
                </div>
              ) : (
                <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="candidate-new-password"
                      className="text-[15px] font-semibold text-[#1d223f]"
                    >
                      New Password
                    </label>
                    <input
                      id="candidate-new-password"
                      type="password"
                      autoComplete="new-password"
                      value={formValues.newPassword}
                      onChange={(event) =>
                        updateFieldValue("newPassword", event.target.value)
                      }
                      placeholder="Enter a new password"
                      className={inputClassName}
                      disabled={isDisabled}
                      required
                    />
                    {formErrors.newPassword ? (
                      <p className="mt-2 text-[13px] text-[#c05a5a]">
                        {formErrors.newPassword}
                      </p>
                    ) : (
                      <p className="mt-2 text-[13px] font-medium text-[#7a86a3]">
                        {jobSeekerPasswordRequirementText}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="candidate-confirm-password"
                      className="text-[15px] font-semibold text-[#1d223f]"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="candidate-confirm-password"
                      type="password"
                      autoComplete="new-password"
                      value={formValues.confirmPassword}
                      onChange={(event) =>
                        updateFieldValue("confirmPassword", event.target.value)
                      }
                      placeholder="Re-enter the new password"
                      className={inputClassName}
                      disabled={isDisabled}
                      required
                    />
                    {formErrors.confirmPassword ? (
                      <p className="mt-2 text-[13px] text-[#c05a5a]">
                        {formErrors.confirmPassword}
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
                      <span>Save New Password</span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/10">
                        <LockKeyhole className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
                      </span>
                    </>
                  )}
                </button>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
