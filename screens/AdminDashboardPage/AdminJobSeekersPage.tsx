"use client";

import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { AdminIdentity } from "@/lib/admin-auth-shared";
import type {
  AdminJobSeekerRecord,
  AdminJobSeekersSummary,
} from "@/lib/admin-job-seekers-shared";
import { cn } from "@/lib/utils";
import { AdminShell } from "./AdminShell";
import { useState } from "react";

type AdminJobSeekersPageProps = AdminIdentity & {
  errorMessage: string | null;
  jobSeekers: AdminJobSeekerRecord[];
  summary: AdminJobSeekersSummary;
};

const jobSeekersPerPage = 20;
const filterInputClassName =
  "mt-2 h-12 w-full rounded-[16px] border border-[#dbe5f1] bg-white px-4 text-[14px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8a97b3] focus:border-[#00adef]";

type JobSeekerFilterValues = {
  contact: string;
  currentCompany: string;
  currentPosition: string;
  jobSeeker: string;
  resumeStatus: "" | "with_resume" | "without_resume";
  submitted: string;
};

const initialFilterValues: JobSeekerFilterValues = {
  contact: "",
  currentCompany: "",
  currentPosition: "",
  jobSeeker: "",
  resumeStatus: "",
  submitted: "",
};

export const AdminJobSeekersPage = ({
  email,
  errorMessage,
  jobSeekers,
  name,
  summary,
}: AdminJobSeekersPageProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<JobSeekerFilterValues>(
    initialFilterValues,
  );
  const jobSeekerFilter = filters.jobSeeker.trim().toLowerCase();
  const contactFilter = filters.contact.trim().toLowerCase();
  const currentPositionFilter = filters.currentPosition.trim().toLowerCase();
  const currentCompanyFilter = filters.currentCompany.trim().toLowerCase();
  const resumeStatusFilter = filters.resumeStatus;
  const submittedFilter = filters.submitted.trim().toLowerCase();
  const filteredJobSeekers = jobSeekers.filter((jobSeeker) => {
    if (
      jobSeekerFilter &&
      !(
        jobSeeker.fullName.toLowerCase().includes(jobSeekerFilter) ||
        jobSeeker.email.toLowerCase().includes(jobSeekerFilter)
      )
    ) {
      return false;
    }

    if (
      contactFilter &&
      !(
        jobSeeker.email.toLowerCase().includes(contactFilter) ||
        jobSeeker.contactNumber.toLowerCase().includes(contactFilter)
      )
    ) {
      return false;
    }

    if (
      currentPositionFilter &&
      !jobSeeker.currentPosition.toLowerCase().includes(currentPositionFilter)
    ) {
      return false;
    }

    if (
      currentCompanyFilter &&
      !jobSeeker.currentCompany.toLowerCase().includes(currentCompanyFilter)
    ) {
      return false;
    }

    if (resumeStatusFilter === "with_resume" && !jobSeeker.resumeUrl) {
      return false;
    }

    if (resumeStatusFilter === "without_resume" && jobSeeker.resumeUrl) {
      return false;
    }

    if (
      submittedFilter &&
      !(
        jobSeeker.submittedAtLabel.toLowerCase().includes(submittedFilter) ||
        jobSeeker.submittedAtLongLabel.toLowerCase().includes(submittedFilter)
      )
    ) {
      return false;
    }

    return true;
  });
  const totalPages = Math.max(
    Math.ceil(filteredJobSeekers.length / jobSeekersPerPage),
    1,
  );
  const resolvedCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (resolvedCurrentPage - 1) * jobSeekersPerPage;
  const endIndex = startIndex + jobSeekersPerPage;
  const visibleJobSeekers = filteredJobSeekers.slice(startIndex, endIndex);
  const showingFrom = filteredJobSeekers.length === 0 ? 0 : startIndex + 1;
  const showingTo =
    filteredJobSeekers.length === 0
      ? 0
      : Math.min(endIndex, filteredJobSeekers.length);
  const hasActiveFilters = Object.values(filters).some(
    (value) => String(value).trim() !== "",
  );
  const statCards = [
    {
      accent: "from-[#00adef] to-[#62d4ff]",
      helper: summary.latestSubmissionLabel ?? "No submissions yet",
      icon: Users,
      label: "Total Submissions",
      value: summary.totalJobSeekers.toString(),
    },
    {
      accent: "from-[#1d223f] to-[#3b4677]",
      helper:
        summary.recentSubmissions > 0
          ? `${summary.recentSubmissions} submissions in the last 7 days`
          : "No new submissions in the last 7 days",
      icon: BriefcaseBusiness,
      label: "Recent Submissions",
      value: summary.recentSubmissions.toString(),
    },
    {
      accent: "from-[#00c389] to-[#5fe0ba]",
      helper:
        summary.resumesUploaded > 0
          ? `${summary.resumesUploaded} resumes available to review`
          : "No resumes uploaded yet",
      icon: FileText,
      label: "Resume Uploads",
      value: summary.resumesUploaded.toString(),
    },
    {
      accent: "from-[#6366f1] to-[#a5b4fc]",
      helper:
        summary.uniqueEmails > 0
          ? `${summary.uniqueEmails} unique job seeker emails captured`
          : "Unique emails will appear here",
      icon: ShieldCheck,
      label: "Unique Emails",
      value: summary.uniqueEmails.toString(),
    },
  ];

  const updateFilter = <FieldName extends keyof JobSeekerFilterValues>(
    fieldName: FieldName,
    value: JobSeekerFilterValues[FieldName],
  ) => {
    setCurrentPage(1);
    setFilters((currentFilters) => ({
      ...currentFilters,
      [fieldName]: value,
    }));
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setFilters(initialFilterValues);
  };

  return (
    <AdminShell
      activePath="/admin/job-seekers"
      adminEmail={email}
      adminName={name}
      breadcrumbLabel="Job Seekers"
      title="Job Seeker Submissions"
      description="Review only the homepage ApplyFormModal job seeker submissions stored in Supabase, including role, company, contact details, and resume access."
      showSearch={false}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
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
              ApplyFormModal Records
            </p>
            <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#1d223f]">
              Job seekers from homepage form
            </h2>
            <p className="mt-2 max-w-[760px] text-[15px] leading-[1.7] text-[#68748f]">
              This list only includes job seeker entries submitted from the homepage
              ApplyFormModal flow.
            </p>
          </div>

          <p className="text-[14px] font-medium text-[#6f7b98]">
            Showing {showingFrom}-{showingTo} of {filteredJobSeekers.length} submissions
            {hasActiveFilters ? ` (filtered from ${jobSeekers.length})` : ""}
          </p>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-[20px] border border-[#fde3b0] bg-[#fff9eb] px-4 py-3 text-[14px] font-medium text-[#9a6700]">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-6 rounded-[24px] border border-[#e6eef6] bg-[#f8fbff] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
                Field Filters
              </p>
              <p className="mt-1 text-[14px] text-[#6d7894]">
                Filter homepage job seeker submissions by each visible table field.
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#dbe5f1] bg-white px-4 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear Filters
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <label className="text-[13px] font-semibold text-[#5d6884]">
              Job Seeker
              <input
                type="text"
                value={filters.jobSeeker}
                onChange={(event) => updateFilter("jobSeeker", event.target.value)}
                placeholder="Name or email"
                className={filterInputClassName}
              />
            </label>

            <label className="text-[13px] font-semibold text-[#5d6884]">
              Contact
              <input
                type="text"
                value={filters.contact}
                onChange={(event) => updateFilter("contact", event.target.value)}
                placeholder="Email or contact number"
                className={filterInputClassName}
              />
            </label>

            <label className="text-[13px] font-semibold text-[#5d6884]">
              Current Position
              <input
                type="text"
                value={filters.currentPosition}
                onChange={(event) =>
                  updateFilter("currentPosition", event.target.value)
                }
                placeholder="Search current role"
                className={filterInputClassName}
              />
            </label>

            <label className="text-[13px] font-semibold text-[#5d6884]">
              Current Company
              <input
                type="text"
                value={filters.currentCompany}
                onChange={(event) =>
                  updateFilter("currentCompany", event.target.value)
                }
                placeholder="Search current company"
                className={filterInputClassName}
              />
            </label>

            <label className="text-[13px] font-semibold text-[#5d6884]">
              Resume
              <select
                value={filters.resumeStatus}
                onChange={(event) =>
                  updateFilter(
                    "resumeStatus",
                    event.target.value as JobSeekerFilterValues["resumeStatus"],
                  )
                }
                className={filterInputClassName}
              >
                <option value="">All resumes</option>
                <option value="with_resume">With resume</option>
                <option value="without_resume">Without resume</option>
              </select>
            </label>

            <label className="text-[13px] font-semibold text-[#5d6884]">
              Submitted
              <input
                type="text"
                value={filters.submitted}
                onChange={(event) => updateFilter("submitted", event.target.value)}
                placeholder="Relative or full date"
                className={filterInputClassName}
              />
            </label>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[1220px] border-separate border-spacing-y-3">
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
              {visibleJobSeekers.length > 0 ? (
                visibleJobSeekers.map((jobSeeker) => (
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
                    <td className="border-y border-[#e6eef6] px-4 py-4">
                      <div className="space-y-1 text-[14px] text-[#52607d]">
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-[#7c89a5]" />
                          <span>{jobSeeker.email}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#7c89a5]" />
                          <span>{jobSeeker.contactNumber}</span>
                        </p>
                      </div>
                    </td>
                    <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] font-medium text-[#1d223f]">
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
                          className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dbe5f1] bg-white px-4 text-[13px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
                        >
                          <Download className="h-4 w-4" />
                          {jobSeeker.resumeOriginalName || "View Resume"}
                        </a>
                      ) : (
                        <span className="text-[14px] text-[#8a97b3]">
                          Resume unavailable
                        </span>
                      )}
                    </td>
                    <td className="rounded-r-[22px] border-y border-r border-[#e6eef6] px-4 py-4 text-[14px] text-[#6d7894]">
                      <p>{jobSeeker.submittedAtLabel}</p>
                      <p className="mt-1 text-[13px] text-[#8b96af]">
                        {jobSeeker.submittedAtLongLabel}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-[#fbfdff]">
                  <td
                    colSpan={6}
                    className="rounded-[22px] border border-[#e6eef6] px-4 py-12 text-center text-[15px] text-[#6d7894]"
                  >
                    {hasActiveFilters
                      ? "No homepage job seeker submissions match the current filters."
                      : "No homepage job seeker submissions found in Supabase yet."}
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
