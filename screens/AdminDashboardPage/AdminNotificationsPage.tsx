"use client";

import Link from "next/link";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPinned,
} from "lucide-react";
import { useState } from "react";
import type { AdminIdentity } from "@/lib/admin-auth-shared";
import type {
  AdminEmployerRecord,
  AdminEmployerSummary,
} from "@/lib/admin-employers-shared";
import type { EmployerInquiryStatus } from "@/lib/employer-inquiries";
import { cn } from "@/lib/utils";
import { AdminShell } from "./AdminShell";

type AdminNotificationsPageProps = AdminIdentity & {
  employers: AdminEmployerRecord[];
  errorMessage: string | null;
  summary: AdminEmployerSummary;
};

const notificationsPerPage = 20;

const statusLabelMap: Record<EmployerInquiryStatus, string> = {
  cancelled: "Cancelled",
  in_progress: "In Progress",
  onboarded: "Onboarded",
  pending: "Pending Review",
};

const getStatusBadgeClassName = (status: EmployerInquiryStatus) => {
  if (status === "pending") {
    return "bg-[#fff6e5] text-[#d58a00]";
  }

  if (status === "in_progress") {
    return "bg-[#eef3ff] text-[#4f6ed7]";
  }

  if (status === "onboarded") {
    return "bg-[#eafbf5] text-[#0b9f6d]";
  }

  return "bg-[#fff1f1] text-[#d84b4b]";
};

const pluralize = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`;

export const AdminNotificationsPage = ({
  email,
  employers,
  errorMessage,
  name,
  summary,
}: AdminNotificationsPageProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(
    Math.ceil(employers.length / notificationsPerPage),
    1,
  );
  const resolvedCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (resolvedCurrentPage - 1) * notificationsPerPage;
  const endIndex = startIndex + notificationsPerPage;
  const visibleNotifications = employers.slice(startIndex, endIndex);
  const showingFrom = employers.length === 0 ? 0 : startIndex + 1;
  const showingTo =
    employers.length === 0 ? 0 : Math.min(endIndex, employers.length);
  const overviewCards = [
    {
      accent: "from-[#00adef] to-[#62d4ff]",
      helper:
        summary.latestSubmission ?? "No employer form submissions have arrived yet",
      icon: Bell,
      label: "Total Alerts",
      value: employers.length.toString(),
    },
    {
      accent: "from-[#f59e0b] to-[#ffd36e]",
      helper:
        summary.pendingEmployers > 0
          ? `${pluralize(summary.pendingEmployers, "submission", "submissions")} still need review`
          : "No pending employer submissions right now",
      icon: Clock3,
      label: "Pending Review",
      value: summary.pendingEmployers.toString(),
    },
    {
      accent: "from-[#00c389] to-[#5fe0ba]",
      helper:
        summary.recentSubmissions > 0
          ? `${pluralize(summary.recentSubmissions, "submission", "submissions")} landed in the last 24 hours`
          : "No new employer submissions in the last 24 hours",
      icon: Building2,
      label: "Last 24 Hours",
      value: summary.recentSubmissions.toString(),
    },
    {
      accent: "from-[#1d223f] to-[#3b4677]",
      helper:
        summary.totalPositions > 0
          ? `${summary.totalPositions} requested openings across all employer alerts`
          : "Requested openings will appear here",
      icon: BriefcaseBusiness,
      label: "Requested Openings",
      value: summary.totalPositions.toString(),
    },
  ];

  return (
    <AdminShell
      activePath="/admin/notifications"
      adminEmail={email}
      adminName={name}
      breadcrumbLabel="Notifications"
      title="Employer Submission Alerts"
      description="Track every employer form submission as an admin notification so the hiring team can jump on new requests quickly."
      showSearch={false}
      headerActions={
        <Link
          href="/admin/employers"
          className="inline-flex h-[52px] items-center gap-2 rounded-[18px] bg-[#1d223f] px-5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#2d3661]"
        >
          Open Employers
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className="overflow-hidden rounded-[28px] border border-[#dde7f2] bg-white shadow-[0_20px_50px_rgba(29,34,63,0.08)]"
            >
              <div className={cn("h-1.5 bg-gradient-to-r", card.accent)} />
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
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
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[#eef8ff] text-[#00adef]">
                  <Icon className="h-6 w-6" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-6 rounded-[32px] border border-[#dde7f2] bg-white p-6 shadow-[0_20px_50px_rgba(29,34,63,0.08)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
              Notification Feed
            </p>
            <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#1d223f]">
              Employer form submission activity
            </h2>
            <p className="mt-2 max-w-[760px] text-[15px] leading-[1.7] text-[#68748f]">
              Every notification below represents an employer hiring form submission
              captured in Supabase, ordered from newest to oldest.
            </p>
          </div>

          <p className="text-[14px] font-medium text-[#6f7b98]">
            Showing {showingFrom}-{showingTo} of {employers.length} notifications
          </p>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-[20px] border border-[#fde3b0] bg-[#fff9eb] px-4 py-3 text-[14px] font-medium text-[#9a6700]">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[1440px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-[12px] font-bold uppercase tracking-[0.16em] text-[#7c89a5]">
                <th className="px-4 pb-1">Employer</th>
                <th className="px-4 pb-1">Contact</th>
                <th className="px-4 pb-1">Hiring Requirement</th>
                <th className="px-4 pb-1">Hiring Type</th>
                <th className="px-4 pb-1">Locations</th>
                <th className="px-4 pb-1">Openings</th>
                <th className="px-4 pb-1">Status</th>
                <th className="px-4 pb-1">Submitted</th>
                <th className="px-4 pb-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleNotifications.length > 0 ? (
                visibleNotifications.map((employer) => (
                  <tr key={employer.id} className="bg-[#fbfdff]">
                    <td className="rounded-l-[22px] border-y border-l border-[#e6eef6] px-4 py-4">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef8ff] text-[#00adef]">
                          <Bell className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-[15px] font-semibold text-[#1d223f]">
                            {employer.company}
                          </p>
                          <p className="mt-1 text-[14px] text-[#6d7894]">
                            {employer.contactEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="border-y border-[#e6eef6] px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-[15px] font-medium text-[#1d223f]">
                          {employer.contactName}
                        </p>
                        <p className="text-[14px] text-[#6d7894]">
                          {employer.contactNumber}
                        </p>
                      </div>
                    </td>
                    <td
                      className="border-y border-[#e6eef6] px-4 py-4 text-[15px] text-[#52607d]"
                      title={employer.hiringRequirement}
                    >
                      {employer.hiringRequirement}
                    </td>
                    <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] font-medium text-[#1d223f]">
                      {employer.hiringType}
                    </td>
                    <td
                      className="border-y border-[#e6eef6] px-4 py-4 text-[15px] text-[#52607d]"
                      title={employer.locationsTooltip}
                    >
                      <div className="flex items-start gap-2">
                        <MapPinned className="mt-0.5 h-4 w-4 shrink-0 text-[#7c89a5]" />
                        <span>{employer.locations}</span>
                      </div>
                    </td>
                    <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] font-semibold text-[#1d223f]">
                      {employer.openRoles}
                    </td>
                    <td className="border-y border-[#e6eef6] px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1.5 text-[12px] font-bold",
                          getStatusBadgeClassName(employer.status),
                        )}
                      >
                        {statusLabelMap[employer.status]}
                      </span>
                    </td>
                    <td className="border-y border-[#e6eef6] px-4 py-4 text-[14px] text-[#6d7894]">
                      <p>{employer.submittedAtLabel}</p>
                      <p className="mt-1 text-[13px] text-[#8b96af]">
                        {employer.submittedAtLongLabel}
                      </p>
                    </td>
                    <td className="rounded-r-[22px] border-y border-r border-[#e6eef6] px-4 py-4 whitespace-nowrap">
                      <Link
                        href="/admin/employers"
                        className="inline-flex h-10 items-center justify-center rounded-full border border-[#dbe5f1] bg-white px-4 text-[13px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
                      >
                        Review submission
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-[#fbfdff]">
                  <td
                    colSpan={9}
                    className="rounded-[22px] border border-[#e6eef6] px-4 py-12 text-center text-[15px] text-[#6d7894]"
                  >
                    No employer notifications yet. New employer form submissions
                    will appear here as soon as they are stored in Supabase.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-[#e5edf6] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] font-medium text-[#6f7b98]">
            Page {resolvedCurrentPage} of {totalPages}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((current) =>
                  Math.max(Math.min(current, totalPages) - 1, 1),
                )
              }
              disabled={resolvedCurrentPage === 1}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#dbe5f1] px-4 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => {
                const isActive = pageNumber === resolvedCurrentPage;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex h-11 w-11 items-center justify-center rounded-full border text-[14px] font-semibold transition-colors duration-200",
                      isActive
                        ? "border-[#1d223f] bg-[#1d223f] text-white"
                        : "border-[#dbe5f1] bg-white text-[#1d223f] hover:bg-[#f4f8fc]",
                    )}
                  >
                    {pageNumber}
                  </button>
                );
              },
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((current) =>
                  Math.min(Math.min(current, totalPages) + 1, totalPages),
                )
              }
              disabled={resolvedCurrentPage === totalPages}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#dbe5f1] px-4 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </AdminShell>
  );
};
