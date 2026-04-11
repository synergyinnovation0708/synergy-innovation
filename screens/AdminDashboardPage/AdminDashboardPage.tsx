"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import type {
  AdminAiUsageRecord,
  AdminAiUsageSummary,
} from "@/lib/admin-ai-usage-shared";
import type {
  AdminJobSeekerRecord,
  AdminJobSeekersSummary,
} from "@/lib/admin-job-seekers-shared";
import { cn } from "@/lib/utils";
import { AdminNewJobModal } from "./AdminNewJobModal";
import { AdminShell } from "./AdminShell";
import type { AdminIdentity } from "@/lib/admin-auth-shared";

type AdminDashboardPageProps = AdminIdentity & {
  aiUsage: AdminAiUsageRecord[];
  aiUsageErrorMessage: string | null;
  aiUsageSummary: AdminAiUsageSummary;
  jobSeekers: AdminJobSeekerRecord[];
  jobSeekersErrorMessage: string | null;
  jobSeekersSummary: AdminJobSeekersSummary;
};

const statusBadgeClassName = (status: string) => {
  if (status === "success") {
    return "bg-[#ecfbf5] text-[#0f8c63]";
  }

  if (status === "rate_limited") {
    return "bg-[#fff5e8] text-[#a85c00]";
  }

  if (status === "error") {
    return "bg-[#ffecec] text-[#c93b3b]";
  }

  return "bg-[#f3f5fb] text-[#66728f]";
};

export const AdminDashboardPage = ({
  aiUsage,
  aiUsageErrorMessage,
  aiUsageSummary,
  email,
  jobSeekers,
  jobSeekersErrorMessage,
  jobSeekersSummary,
  name,
}: AdminDashboardPageProps) => {
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const recentJobSeekers = jobSeekers.slice(0, 6);
  const overviewCards = [
    {
      accent: "from-[#00adef] to-[#62d4ff]",
      helper:
        jobSeekersSummary.totalJobSeekers > 0
          ? `${jobSeekersSummary.totalJobSeekers} ApplyFormModal submissions received`
          : "No job seekers registered yet",
      label: "Job Seekers",
      value: jobSeekersSummary.totalJobSeekers.toString(),
    },
    {
      accent: "from-[#1d223f] to-[#3b4677]",
      helper:
        jobSeekersSummary.recentSubmissions > 0
          ? "New ApplyFormModal job seeker submissions this week"
          : "No recent homepage job seeker submissions",
      label: "Recent Submissions",
      value: jobSeekersSummary.recentSubmissions.toString(),
    },
    {
      accent: "from-[#00c389] to-[#5fe0ba]",
      helper:
        jobSeekersSummary.resumesUploaded > 0
          ? `${jobSeekersSummary.resumesUploaded} profiles have resumes`
          : "No resumes uploaded yet",
      label: "Resume Profiles",
      value: jobSeekersSummary.resumesUploaded.toString(),
    },
  ];
  const quickPanels = [
    {
      detail:
        jobSeekersSummary.uniqueEmails > 0
          ? `${jobSeekersSummary.uniqueEmails} unique job seeker email addresses captured.`
          : "No job seeker emails captured yet.",
      title: "Unique Emails",
    },
    {
      detail:
        jobSeekersSummary.latestSubmissionLabel
          ? `${jobSeekersSummary.latestSubmissionLabel}.`
          : "No recent homepage job seeker activity right now.",
      title: "Latest Submission",
    },
    {
      detail:
        jobSeekersSummary.totalJobSeekers > 0
          ? `${jobSeekersSummary.resumesUploaded}/${jobSeekersSummary.totalJobSeekers} job seekers uploaded resumes.`
          : "Resume coverage appears after candidate registration.",
      title: "Resume Coverage",
    },
  ];
  const aiOverviewCards = [
    {
      accent: "from-[#00adef] to-[#62d4ff]",
      helper:
        aiUsageSummary.totalRequests > 0
          ? `${aiUsageSummary.windowLabel} across all tracked AI flows`
          : "No AI activity recorded yet",
      label: "AI Requests",
      value: aiUsageSummary.totalRequests.toString(),
    },
    {
      accent: "from-[#1d223f] to-[#3b4677]",
      helper:
        aiUsageSummary.totalTokens > 0
          ? `${aiUsageSummary.inputTokens} input + ${aiUsageSummary.outputTokens} output tokens`
          : "Token totals appear after the first successful AI call",
      label: "Total Tokens",
      value: aiUsageSummary.totalTokens.toLocaleString("en-IN"),
    },
    {
      accent: "from-[#00c389] to-[#5fe0ba]",
      helper:
        aiUsageSummary.last24HoursRequests > 0
          ? "Requests recorded in the last 24 hours"
          : "No AI requests recorded in the last 24 hours",
      label: "24h Requests",
      value: aiUsageSummary.last24HoursRequests.toString(),
    },
    {
      accent: "from-[#ff9b52] to-[#ffd19e]",
      helper:
        aiUsageSummary.rateLimitedRequests > 0
          ? "Requests blocked by the server-side usage guard"
          : "No rate-limited AI calls in the current dashboard window",
      label: "Blocked Requests",
      value: aiUsageSummary.rateLimitedRequests.toString(),
    },
  ];
  const aiQuickPanels = [
    {
      detail:
        aiUsageSummary.serviceChatRequests > 0
          ? `${aiUsageSummary.serviceChatRequests} requests came from the homepage service chatbot.`
          : "No homepage service chatbot usage recorded yet.",
      title: "Service Chatbot",
    },
    {
      detail:
        aiUsageSummary.intakeAssistantRequests > 0
          ? `${aiUsageSummary.intakeAssistantRequests} requests came from the intake assistant flows.`
          : "No intake assistant activity recorded yet.",
      title: "Intake Assistant",
    },
    {
      detail:
        aiUsageSummary.latestUsageLabel
          ? `${aiUsageSummary.latestUsageLabel}. ${aiUsageSummary.successfulRequests} successful and ${aiUsageSummary.failedRequests} failed/rejected requests in ${aiUsageSummary.windowLabel.toLowerCase()}.`
          : "Recent AI activity will appear here after the first tracked request.",
      title: "Latest Activity",
    },
  ];

  return (
    <>
      <AdminShell
        activePath="/admin/dashboard"
        adminEmail={email}
        adminName={name}
        breadcrumbLabel="Overview"
        title="Team Control Center"
        description="Monitor activity, manage jobs, and keep the hiring pipeline moving."
        headerActions={
          <button
            type="button"
            onClick={() => setIsNewJobModalOpen(true)}
            className="inline-flex h-[52px] items-center gap-2 rounded-[18px] bg-[#1d223f] px-5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#2d3661]"
          >
            <Plus className="h-4 w-4" />
            New Job
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {overviewCards.map((card) => (
            <article
              key={card.label}
              className="overflow-hidden rounded-[28px] border border-[#dde7f2] bg-white shadow-[0_20px_50px_rgba(29,34,63,0.08)]"
            >
              <div className={cn("h-1.5 bg-gradient-to-r", card.accent)} />
              <div className="p-6">
                <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#6f7b98]">
                  {card.label}
                </p>
                <p className="mt-3 text-[38px] font-bold leading-none text-[#1d223f]">
                  {card.value}
                </p>
                <p className="mt-3 text-[14px] font-medium text-[#00adef]">
                  {card.helper}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[32px] border border-[#dde7f2] bg-white p-6 shadow-[0_20px_50px_rgba(29,34,63,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
                  Dashboard Listing
                </p>
                <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#1d223f]">
                  Recent job seekers
                </h2>
                <p className="mt-2 max-w-[720px] text-[15px] leading-[1.7] text-[#68748f]">
                  Latest homepage ApplyFormModal job seeker submissions from
                  Supabase, sorted by most recent submission so the admin team can
                  quickly review fresh resumes.
                </p>
              </div>
              <Link
                href="/admin/job-seekers"
                className="rounded-full border border-[#dbe5f1] px-4 py-2 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
              >
                View all
              </Link>
            </div>

            {jobSeekersErrorMessage ? (
              <div className="mt-6 rounded-[20px] border border-[#fde3b0] bg-[#fff9eb] px-4 py-3 text-[14px] font-medium text-[#9a6700]">
                {jobSeekersErrorMessage}
              </div>
            ) : null}

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-[12px] font-bold uppercase tracking-[0.16em] text-[#7c89a5]">
                    <th className="px-4 pb-1">Job Seeker</th>
                    <th className="px-4 pb-1">Contact</th>
                    <th className="px-4 pb-1">Current Position</th>
                    <th className="px-4 pb-1">Current Company</th>
                    <th className="px-4 pb-1">Resume</th>
                    <th className="px-4 pb-1">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobSeekers.length > 0 ? (
                    recentJobSeekers.map((jobSeeker) => (
                      <tr key={jobSeeker.id} className="bg-[#fbfdff]">
                        <td className="rounded-l-[22px] border-y border-l border-[#e6eef6] px-4 py-4">
                          <div>
                            <p className="text-[15px] font-semibold text-[#1d223f]">
                              {jobSeeker.fullName}
                            </p>
                            <p className="mt-1 text-[14px] text-[#6d7894]">
                              {jobSeeker.email}
                            </p>
                          </div>
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] text-[#52607d]">
                          {jobSeeker.contactNumber}
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] font-semibold text-[#1d223f]">
                          {jobSeeker.currentPosition}
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] text-[#52607d]">
                          {jobSeeker.currentCompany}
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4">
                          {jobSeeker.resumeUrl ? (
                            <a
                              href={`/api/admin/job-seekers/${jobSeeker.id}/resume`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex rounded-full border border-[#dbe5f1] bg-white px-3 py-1.5 text-[12px] font-bold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
                            >
                              Resume
                            </a>
                          ) : (
                            <span className="inline-flex rounded-full bg-[#f3f5fb] px-3 py-1.5 text-[12px] font-bold text-[#66728f]">
                              No Resume
                            </span>
                          )}
                        </td>
                        <td className="rounded-r-[22px] border-y border-r border-[#e6eef6] px-4 py-4 text-[14px] text-[#6d7894]">
                          {jobSeeker.submittedAtLabel}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-[#fbfdff]">
                      <td
                        colSpan={6}
                        className="rounded-[22px] border border-[#e6eef6] px-4 py-12 text-center text-[15px] text-[#6d7894]"
                      >
                        No job seekers found in Supabase yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[32px] border border-[#dde7f2] bg-white p-6 shadow-[0_20px_50px_rgba(29,34,63,0.08)]">
              <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
                Job Seeker Snapshot
              </p>
              <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#1d223f]">
                Priority panels
              </h2>

              <div className="mt-6 space-y-4">
                {quickPanels.map((panel) => (
                  <article
                    key={panel.title}
                    className="rounded-[24px] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5 ring-1 ring-[#e4edf6]"
                  >
                    <h3 className="text-[18px] font-semibold text-[#1d223f]">
                      {panel.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-[1.7] text-[#68748f]">
                      {panel.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] bg-[#1d223f] p-6 text-white shadow-[0_20px_50px_rgba(29,34,63,0.18)]">
              <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#86ddff]">
                Candidate Workspace
              </p>
              <h2 className="mt-2 text-[28px] font-bold leading-[1.15]">
                Job seeker directory ready
              </h2>
              <p className="mt-3 text-[15px] leading-[1.7] text-white/74">
                Open the full job seeker submissions page to inspect every
                homepage ApplyFormModal response and review uploaded resumes.
              </p>
              <Link
                href="/admin/job-seekers"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#eef8ff]"
              >
                Open Job Seekers
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <section className="rounded-[32px] border border-[#dde7f2] bg-white p-6 shadow-[0_20px_50px_rgba(29,34,63,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
                  AI Operations
                </p>
                <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#1d223f]">
                  Recent AI activity
                </h2>
                <p className="mt-2 max-w-[720px] text-[15px] leading-[1.7] text-[#68748f]">
                  Request and token usage from the service chatbot and intake
                  assistant, tracked server-side and grouped into a live admin
                  summary.
                </p>
              </div>
              <span className="inline-flex rounded-full border border-[#dbe5f1] bg-[#f8fbff] px-4 py-2 text-[13px] font-semibold text-[#1d223f]">
                {aiUsageSummary.windowLabel}
              </span>
            </div>

            {aiUsageErrorMessage ? (
              <div className="mt-6 rounded-[20px] border border-[#fde3b0] bg-[#fff9eb] px-4 py-3 text-[14px] font-medium text-[#9a6700]">
                {aiUsageErrorMessage}
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {aiOverviewCards.map((card) => (
                <article
                  key={card.label}
                  className="overflow-hidden rounded-[28px] border border-[#dde7f2] bg-[#fbfdff] shadow-[0_16px_40px_rgba(29,34,63,0.06)]"
                >
                  <div className={cn("h-1.5 bg-gradient-to-r", card.accent)} />
                  <div className="p-5">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#6f7b98]">
                      {card.label}
                    </p>
                    <p className="mt-3 text-[30px] font-bold leading-none text-[#1d223f]">
                      {card.value}
                    </p>
                    <p className="mt-3 text-[13px] leading-[1.6] text-[#68748f]">
                      {card.helper}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-[12px] font-bold uppercase tracking-[0.16em] text-[#7c89a5]">
                    <th className="px-4 pb-1">Feature</th>
                    <th className="px-4 pb-1">Status</th>
                    <th className="px-4 pb-1">Model</th>
                    <th className="px-4 pb-1">Tokens</th>
                    <th className="px-4 pb-1">Characters</th>
                    <th className="px-4 pb-1">Recorded</th>
                  </tr>
                </thead>
                <tbody>
                  {aiUsage.length > 0 ? (
                    aiUsage.map((record) => (
                      <tr key={record.id} className="bg-[#fbfdff]">
                        <td className="rounded-l-[22px] border-y border-l border-[#e6eef6] px-4 py-4">
                          <div>
                            <p className="text-[15px] font-semibold text-[#1d223f]">
                              {record.featureLabel}
                            </p>
                            <p className="mt-1 text-[13px] text-[#6d7894]">
                              {record.contextLabel || "General flow"}
                            </p>
                          </div>
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-3 py-1.5 text-[12px] font-bold",
                              statusBadgeClassName(record.status),
                            )}
                          >
                            {record.statusLabel}
                          </span>
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4 text-[14px] text-[#52607d]">
                          {record.model || "Default model"}
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4 text-[14px] font-semibold text-[#1d223f]">
                          {record.totalTokens.toLocaleString("en-IN")}
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4 text-[14px] text-[#52607d]">
                          {record.inputCharacters}/{record.outputCharacters}
                        </td>
                        <td className="rounded-r-[22px] border-y border-r border-[#e6eef6] px-4 py-4 text-[14px] text-[#6d7894]">
                          {record.createdAtLabel}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-[#fbfdff]">
                      <td
                        colSpan={6}
                        className="rounded-[22px] border border-[#e6eef6] px-4 py-12 text-center text-[15px] text-[#6d7894]"
                      >
                        No AI usage has been recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[32px] border border-[#dde7f2] bg-white p-6 shadow-[0_20px_50px_rgba(29,34,63,0.08)]">
              <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
                AI Snapshot
              </p>
              <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#1d223f]">
                Usage panels
              </h2>

              <div className="mt-6 space-y-4">
                {aiQuickPanels.map((panel) => (
                  <article
                    key={panel.title}
                    className="rounded-[24px] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5 ring-1 ring-[#e4edf6]"
                  >
                    <h3 className="text-[18px] font-semibold text-[#1d223f]">
                      {panel.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-[1.7] text-[#68748f]">
                      {panel.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] bg-[#1d223f] p-6 text-white shadow-[0_20px_50px_rgba(29,34,63,0.18)]">
              <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#86ddff]">
                Usage Guard
              </p>
              <h2 className="mt-2 text-[28px] font-bold leading-[1.15]">
                AI protections are active
              </h2>
              <p className="mt-3 text-[15px] leading-[1.7] text-white/74">
                The server is now tracking requests, token volume, and blocked
                calls from the AI endpoints so the admin team can spot spikes
                before they become a cost issue.
              </p>
            </div>
          </section>
        </div>
      </AdminShell>

      <AdminNewJobModal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        onSaved={() => setIsNewJobModalOpen(false)}
      />
    </>
  );
};
