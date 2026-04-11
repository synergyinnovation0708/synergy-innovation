"use client";

import {
  KeyRound,
  LoaderCircle,
  Mail,
  Settings2,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { useState } from "react";
import type { AdminIdentity } from "@/lib/admin-auth-shared";
import { jobSeekerPasswordRequirementText } from "@/lib/job-seeker-inquiries";
import { cn } from "@/lib/utils";
import { AdminShell } from "./AdminShell";

type AdminSettingsPageProps = AdminIdentity;

type PasswordFormValues = {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
};

type PasswordFieldName = keyof PasswordFormValues;
type PasswordFormErrors = Partial<Record<PasswordFieldName, string>>;

const inputClassName =
  "mt-2 h-12 w-full rounded-[16px] border border-[#dbe5f1] bg-white px-4 text-[14px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8a97b3] focus:border-[#00adef]";

const initialPasswordFormValues: PasswordFormValues = {
  confirmPassword: "",
  currentPassword: "",
  newPassword: "",
};

export const AdminSettingsPage = ({
  email,
  name,
}: AdminSettingsPageProps) => {
  const [formValues, setFormValues] = useState<PasswordFormValues>(
    initialPasswordFormValues,
  );
  const [formErrors, setFormErrors] = useState<PasswordFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    tone: "error" | "success";
    value: string;
  } | null>(null);

  const updateFieldValue = (
    fieldName: PasswordFieldName,
    value: PasswordFormValues[PasswordFieldName],
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
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/admin/settings/password", {
        body: JSON.stringify(formValues),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json().catch(() => null)) as
        | {
            errors?: PasswordFormErrors;
            message?: string;
          }
        | null;

      if (!response.ok) {
        setFormErrors(data?.errors ?? {});
        setStatusMessage({
          tone: "error",
          value: data?.message ?? "Unable to update the admin password right now.",
        });
        return;
      }

      setFormErrors({});
      setFormValues(initialPasswordFormValues);
      setStatusMessage({
        tone: "success",
        value: data?.message ?? "Admin password updated successfully.",
      });
    } catch {
      setStatusMessage({
        tone: "error",
        value: "Unable to update the admin password right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const highlights = [
    {
      description: "Your current email stays the account identifier for admin access.",
      icon: Mail,
      label: "Admin Email",
      value: email,
    },
    {
      description: "Current password confirmation is required before we save a new one.",
      icon: ShieldCheck,
      label: "Security Check",
      value: "Current password required",
    },
    {
      description: "Use a strong password that follows the platform password policy.",
      icon: KeyRound,
      label: "Password Rule",
      value: "8-16 secure characters",
    },
  ];

  return (
    <AdminShell
      activePath="/admin/settings"
      adminEmail={email}
      adminName={name}
      breadcrumbLabel="Settings"
      title="Admin Settings"
      description="Manage your admin account security and update your password with current-password verification."
      showSearch={false}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className="overflow-hidden rounded-[28px] border border-[#dde7f2] bg-white p-6 shadow-[0_20px_50px_rgba(29,34,63,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#6f7b98]">
                    {card.label}
                  </p>
                  <p className="mt-3 text-[24px] font-bold leading-[1.2] text-[#1d223f]">
                    {card.value}
                  </p>
                  <p className="mt-3 text-[14px] leading-[1.7] text-[#68748f]">
                    {card.description}
                  </p>
                </div>
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[#eef8ff] text-[#00adef]">
                  <Icon className="h-6 w-6" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[32px] border border-[#dde7f2] bg-white p-6 shadow-[0_20px_50px_rgba(29,34,63,0.08)]">
          <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
            Account Snapshot
          </p>
          <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#1d223f]">
            Current admin profile
          </h2>
          <p className="mt-2 text-[15px] leading-[1.7] text-[#68748f]">
            Review the account details tied to this admin session before changing
            your password.
          </p>

          <div className="mt-6 rounded-[28px] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-6 ring-1 ring-[#e4edf6]">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#1d223f] text-white">
                <UserCircle2 className="h-7 w-7" />
              </span>
              <div>
                <p className="text-[20px] font-semibold text-[#1d223f]">
                  {name}
                </p>
                <p className="mt-1 text-[15px] text-[#68748f]">{email}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#dbe5f1] bg-white p-5">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef8ff] text-[#00adef]">
                  <Settings2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[16px] font-semibold text-[#1d223f]">
                    Password update policy
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.7] text-[#68748f]">
                    For security, the current password must be entered before a
                    new password can be saved.
                  </p>
                  <p className="mt-3 text-[14px] font-medium text-[#00adef]">
                    {jobSeekerPasswordRequirementText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-[#dde7f2] bg-white p-6 shadow-[0_20px_50px_rgba(29,34,63,0.08)]">
          <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
            Change Password
          </p>
          <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#1d223f]">
            Update admin password
          </h2>
          <p className="mt-2 max-w-[760px] text-[15px] leading-[1.7] text-[#68748f]">
            Enter your current password, then choose a new password and confirm it
            to complete the update.
          </p>

          {statusMessage ? (
            <div
              className={cn(
                "mt-6 rounded-[20px] px-4 py-3 text-[14px] font-medium",
                statusMessage.tone === "success"
                  ? "border border-[#cdeedc] bg-[#eefbf4] text-[#147a4b]"
                  : "border border-[#ffd8d8] bg-[#fff5f5] text-[#b53c3c]",
              )}
            >
              {statusMessage.value}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block text-[13px] font-semibold text-[#5d6884]">
              Current Password
              <input
                type="password"
                autoComplete="current-password"
                value={formValues.currentPassword}
                onChange={(event) =>
                  updateFieldValue("currentPassword", event.target.value)
                }
                placeholder="Enter your current password"
                className={inputClassName}
              />
              {formErrors.currentPassword ? (
                <span className="mt-2 block text-[13px] text-[#c05a5a]">
                  {formErrors.currentPassword}
                </span>
              ) : null}
            </label>

            <label className="block text-[13px] font-semibold text-[#5d6884]">
              New Password
              <input
                type="password"
                autoComplete="new-password"
                value={formValues.newPassword}
                onChange={(event) =>
                  updateFieldValue("newPassword", event.target.value)
                }
                placeholder="Enter a new password"
                className={inputClassName}
              />
              {formErrors.newPassword ? (
                <span className="mt-2 block text-[13px] text-[#c05a5a]">
                  {formErrors.newPassword}
                </span>
              ) : (
                <span className="mt-2 block text-[13px] font-medium text-[#7a86a3]">
                  {jobSeekerPasswordRequirementText}
                </span>
              )}
            </label>

            <label className="block text-[13px] font-semibold text-[#5d6884]">
              Confirm New Password
              <input
                type="password"
                autoComplete="new-password"
                value={formValues.confirmPassword}
                onChange={(event) =>
                  updateFieldValue("confirmPassword", event.target.value)
                }
                placeholder="Re-enter the new password"
                className={inputClassName}
              />
              {formErrors.confirmPassword ? (
                <span className="mt-2 block text-[13px] text-[#c05a5a]">
                  {formErrors.confirmPassword}
                </span>
              ) : null}
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-[52px] items-center gap-2 rounded-[18px] bg-[#1d223f] px-5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#2d3661] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Updating Password
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Save New Password
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </AdminShell>
  );
};
