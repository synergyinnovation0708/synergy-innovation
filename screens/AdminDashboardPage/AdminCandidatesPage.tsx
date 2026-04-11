"use client";

import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  MapPinned,
  RefreshCcw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminIdentity } from "@/lib/admin-auth-shared";
import type {
  AdminCandidateAccountStatus,
  AdminCandidateRecord,
  AdminCandidatesSummary,
} from "@/lib/admin-candidates-shared";
import { cn } from "@/lib/utils";
import { AdminCandidateDetailsModal } from "./AdminCandidateDetailsModal";
import { AdminCandidateStatusModal } from "./AdminCandidateStatusModal";
import { AdminShell } from "./AdminShell";

type AdminCandidatesPageProps = AdminIdentity & {
  candidates: AdminCandidateRecord[];
  errorMessage: string | null;
  summary: AdminCandidatesSummary;
};

const candidatesPerPage = 20;
const filterInputClassName =
  "mt-2 h-12 w-full rounded-[16px] border border-[#dbe5f1] bg-white px-4 text-[14px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8a97b3] focus:border-[#00adef]";

type CandidateFilterValues = {
  accountStatus: AdminCandidateAccountStatus | "";
  applications: string;
  candidate: string;
  experience: string;
  lastActivity: string;
  location: string;
  primarySkill: string;
  workStatus: string;
};

const initialFilterValues: CandidateFilterValues = {
  accountStatus: "",
  applications: "",
  candidate: "",
  experience: "",
  lastActivity: "",
  location: "",
  primarySkill: "",
  workStatus: "",
};

const accountStatusLabelMap: Record<AdminCandidateAccountStatus, string> = {
  active: "Active",
  suspended: "Suspended",
};

const getAccountStatusBadgeClassName = (status: AdminCandidateAccountStatus) => {
  if (status === "active") {
    return "bg-[#eafbf5] text-[#0b9f6d]";
  }

  return "bg-[#fff1f1] text-[#d84b4b]";
};

export const AdminCandidatesPage = ({
  candidates,
  email,
  errorMessage,
  name,
  summary,
}: AdminCandidatesPageProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CandidateFilterValues>(initialFilterValues);
  const [selectedCandidateForDetails, setSelectedCandidateForDetails] =
    useState<AdminCandidateRecord | null>(null);
  const [selectedCandidateForStatus, setSelectedCandidateForStatus] =
    useState<AdminCandidateRecord | null>(null);
  const candidateFilter = filters.candidate.trim().toLowerCase();
  const primarySkillFilter = filters.primarySkill.trim().toLowerCase();
  const experienceFilter = filters.experience.trim().toLowerCase();
  const locationFilter = filters.location.trim().toLowerCase();
  const workStatusFilter = filters.workStatus.trim().toLowerCase();
  const applicationsFilter = filters.applications.trim();
  const accountStatusFilter = filters.accountStatus;
  const lastActivityFilter = filters.lastActivity.trim().toLowerCase();
  const filteredCandidates = candidates.filter((candidate) => {
    if (
      candidateFilter &&
      !(
        candidate.candidateName.toLowerCase().includes(candidateFilter) ||
        candidate.email.toLowerCase().includes(candidateFilter)
      )
    ) {
      return false;
    }

    if (
      primarySkillFilter &&
      !(
        candidate.primarySkill.toLowerCase().includes(primarySkillFilter) ||
        candidate.keySkills.some((skill) =>
          skill.toLowerCase().includes(primarySkillFilter),
        )
      )
    ) {
      return false;
    }

    if (
      experienceFilter &&
      !candidate.experienceLabel.toLowerCase().includes(experienceFilter)
    ) {
      return false;
    }

    if (
      locationFilter &&
      !(
        candidate.currentLocation.toLowerCase().includes(locationFilter) ||
        candidate.preferredLocations.some((location) =>
          location.toLowerCase().includes(locationFilter),
        )
      )
    ) {
      return false;
    }

    if (
      workStatusFilter &&
      !candidate.workStatusLabel.toLowerCase().includes(workStatusFilter)
    ) {
      return false;
    }

    if (
      applicationsFilter &&
      String(candidate.applicationsCount) !== applicationsFilter
    ) {
      return false;
    }

    if (accountStatusFilter && candidate.accountStatus !== accountStatusFilter) {
      return false;
    }

    if (
      lastActivityFilter &&
      !(
        candidate.lastActivityLabel.toLowerCase().includes(lastActivityFilter) ||
        candidate.joinedLabel.toLowerCase().includes(lastActivityFilter) ||
        (candidate.lastAppliedJobTitle ?? "")
          .toLowerCase()
          .includes(lastActivityFilter)
      )
    ) {
      return false;
    }

    return true;
  });
  const totalPages = Math.max(
    Math.ceil(filteredCandidates.length / candidatesPerPage),
    1,
  );
  const resolvedCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (resolvedCurrentPage - 1) * candidatesPerPage;
  const endIndex = startIndex + candidatesPerPage;
  const visibleCandidates = filteredCandidates.slice(startIndex, endIndex);
  const showingFrom = filteredCandidates.length === 0 ? 0 : startIndex + 1;
  const showingTo =
    filteredCandidates.length === 0
      ? 0
      : Math.min(endIndex, filteredCandidates.length);
  const hasActiveFilters = Object.values(filters).some(
    (value) => String(value).trim() !== "",
  );
  const workStatusOptions = Array.from(
    new Set(
      candidates
        .map((candidate) => candidate.workStatusLabel.trim())
        .filter((status) => status.length > 0),
    ),
  ).sort((firstStatus, secondStatus) => firstStatus.localeCompare(secondStatus));
  const candidateStats = [
    {
      accent: "from-[#00adef] to-[#62d4ff]",
      helper:
        summary.totalCandidates > 0
          ? `${summary.totalCandidates} candidate accounts in Supabase`
          : "No candidate accounts found yet",
      icon: Users,
      label: "Total Candidates",
      value: summary.totalCandidates.toString(),
    },
    {
      accent: "from-[#00c389] to-[#5fe0ba]",
      helper:
        summary.profilesWithResume > 0
          ? `${summary.profilesWithResume} profiles have resumes uploaded`
          : "No resumes uploaded yet",
      icon: ShieldCheck,
      label: "Active Accounts",
      value: summary.activeAccounts.toString(),
    },
    {
      accent: "from-[#f97316] to-[#fdba74]",
      helper:
        summary.suspendedAccounts > 0
          ? "Suspended accounts can be reactivated anytime"
          : "No suspended accounts right now",
      icon: FileText,
      label: "Suspended Accounts",
      value: summary.suspendedAccounts.toString(),
    },
    {
      accent: "from-[#6366f1] to-[#a5b4fc]",
      helper:
        summary.totalApplications > 0
          ? "Applications submitted across all listed candidates"
          : "No candidate applications tracked yet",
      icon: BriefcaseBusiness,
      label: "Total Applications",
      value: summary.totalApplications.toString(),
    },
  ];

  const updateFilter = <FieldName extends keyof CandidateFilterValues>(
    fieldName: FieldName,
    value: CandidateFilterValues[FieldName],
  ) => {
    setCurrentPage(1);
    setFilters((currentFilters) => ({
      ...currentFilters,
      [fieldName]:
        fieldName === "applications"
          ? String(value).replace(/\D/g, "")
          : value,
    }));
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setFilters(initialFilterValues);
  };

  return (
    <>
      <AdminShell
        activePath="/admin/candidates"
        adminEmail={email}
        adminName={name}
        breadcrumbLabel="Candidates"
        title="Candidate Directory"
        description="Review real candidate profiles from Supabase, inspect complete profile details, and manage account access from one admin workspace."
        showSearch={false}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {candidateStats.map((card) => {
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
                Candidate Table
              </p>
              <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#1d223f]">
                Candidate accounts from Supabase
              </h2>
              <p className="mt-2 max-w-[720px] text-[15px] leading-[1.7] text-[#68748f]">
                Review the latest candidate profiles, see application activity,
                and open the complete candidate record before taking action.
              </p>
            </div>

            <p className="text-[14px] font-medium text-[#6f7b98]">
              Showing {showingFrom}-{showingTo} of {filteredCandidates.length} candidates
              {hasActiveFilters ? ` (filtered from ${candidates.length})` : ""}
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
                  Narrow job seekers by candidate name, skills, location, account
                  access, and recent activity.
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

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="text-[13px] font-semibold text-[#5d6884]">
                Candidate
                <input
                  type="text"
                  value={filters.candidate}
                  onChange={(event) => updateFilter("candidate", event.target.value)}
                  placeholder="Name or email"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Primary Skill
                <input
                  type="text"
                  value={filters.primarySkill}
                  onChange={(event) =>
                    updateFilter("primarySkill", event.target.value)
                  }
                  placeholder="Skill or keyword"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Experience
                <input
                  type="text"
                  value={filters.experience}
                  onChange={(event) => updateFilter("experience", event.target.value)}
                  placeholder="Fresher, 2 years"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Location
                <input
                  type="text"
                  value={filters.location}
                  onChange={(event) => updateFilter("location", event.target.value)}
                  placeholder="City or preferred location"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Work Status
                <select
                  value={filters.workStatus}
                  onChange={(event) => updateFilter("workStatus", event.target.value)}
                  className={filterInputClassName}
                >
                  <option value="">All work statuses</option>
                  {workStatusOptions.map((workStatus) => (
                    <option key={workStatus} value={workStatus}>
                      {workStatus}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Applications
                <input
                  type="text"
                  inputMode="numeric"
                  value={filters.applications}
                  onChange={(event) =>
                    updateFilter("applications", event.target.value)
                  }
                  placeholder="Exact applications count"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Account Status
                <select
                  value={filters.accountStatus}
                  onChange={(event) =>
                    updateFilter(
                      "accountStatus",
                      event.target.value as CandidateFilterValues["accountStatus"],
                    )
                  }
                  className={filterInputClassName}
                >
                  <option value="">All account statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Last Activity
                <input
                  type="text"
                  value={filters.lastActivity}
                  onChange={(event) =>
                    updateFilter("lastActivity", event.target.value)
                  }
                  placeholder="Updated, joined, job title"
                  className={filterInputClassName}
                />
              </label>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1260px] border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-[12px] font-bold uppercase tracking-[0.16em] text-[#7c89a5]">
                  <th className="px-4 pb-1">Candidate</th>
                  <th className="px-4 pb-1">Primary Skill</th>
                  <th className="px-4 pb-1">Experience</th>
                  <th className="px-4 pb-1">Location</th>
                  <th className="px-4 pb-1">Work Status</th>
                  <th className="px-4 pb-1">Applications</th>
                  <th className="px-4 pb-1">Account Status</th>
                  <th className="px-4 pb-1">Last Activity</th>
                  <th className="px-4 pb-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleCandidates.length > 0 ? (
                  visibleCandidates.map((candidate) => (
                    <tr key={candidate.id} className="bg-[#fbfdff]">
                      <td className="rounded-l-[22px] border-y border-l border-[#e6eef6] px-4 py-4">
                        <div>
                          <p className="text-[15px] font-semibold text-[#1d223f]">
                            {candidate.candidateName}
                          </p>
                          <p className="mt-1 text-[14px] text-[#6d7894]">
                            {candidate.email}
                          </p>
                        </div>
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] font-medium text-[#1d223f]">
                        {candidate.primarySkill}
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] text-[#52607d]">
                        {candidate.experienceLabel}
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4">
                        <div className="flex items-center gap-2 text-[15px] text-[#52607d]">
                          <MapPinned className="h-4 w-4 text-[#7c89a5]" />
                          <span>{candidate.currentLocation}</span>
                        </div>
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] font-medium text-[#1d223f]">
                        {candidate.workStatusLabel}
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4">
                        <p className="text-[15px] font-semibold text-[#1d223f]">
                          {candidate.applicationsCount}
                        </p>
                        <p className="mt-1 text-[13px] text-[#6d7894]">
                          {candidate.lastAppliedJobTitle
                            ? candidate.lastAppliedJobTitle
                            : "No job applications yet"}
                        </p>
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1.5 text-[12px] font-bold",
                            getAccountStatusBadgeClassName(candidate.accountStatus),
                          )}
                        >
                          {accountStatusLabelMap[candidate.accountStatus]}
                        </span>
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4 text-[14px] text-[#6d7894]">
                        <p>{candidate.lastActivityLabel}</p>
                        <p className="mt-1 text-[13px] text-[#8b96af]">
                          {candidate.joinedLabel}
                        </p>
                      </td>
                      <td className="rounded-r-[22px] border-y border-r border-[#e6eef6] px-4 py-4 text-[14px] text-[#6d7894] whitespace-nowrap">
                        <div className="flex flex-nowrap items-center gap-2 whitespace-nowrap">
                          <button
                            type="button"
                            title="View candidate details"
                            onClick={() => setSelectedCandidateForDetails(candidate)}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dbe5f1] bg-[#eef8ff] text-[#00adef] transition-colors duration-200 hover:bg-[#dff3ff]"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="Update candidate account"
                            onClick={() => setSelectedCandidateForStatus(candidate)}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1d223f] text-white transition-colors duration-200 hover:bg-[#2b3561]"
                          >
                            <RefreshCcw className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-[#fbfdff]">
                    <td
                      colSpan={9}
                      className="rounded-[22px] border border-[#e6eef6] px-4 py-12 text-center text-[15px] text-[#6d7894]"
                    >
                      {hasActiveFilters
                        ? "No job seekers match the current filters."
                        : "No candidate accounts found in Supabase yet."}
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

      <AdminCandidateDetailsModal
        candidate={selectedCandidateForDetails}
        isOpen={selectedCandidateForDetails !== null}
        onClose={() => setSelectedCandidateForDetails(null)}
      />
      <AdminCandidateStatusModal
        candidate={selectedCandidateForStatus}
        isOpen={selectedCandidateForStatus !== null}
        onClose={() => setSelectedCandidateForStatus(null)}
        onUpdated={() => router.refresh()}
      />
    </>
  );
};
