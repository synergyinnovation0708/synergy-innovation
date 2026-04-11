"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPinned,
  PencilLine,
  Plus,
  RefreshCcw,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminIdentity } from "@/lib/admin-auth-shared";
import type {
  AdminJobListingRecord,
  AdminJobListingsSummary,
} from "@/lib/admin-jobs-shared";
import type { JobListingStatus } from "@/lib/job-listings";
import { cn } from "@/lib/utils";
import { AdminJobApplicantsModal } from "./AdminJobApplicantsModal";
import { AdminJobDetailsModal } from "./AdminJobDetailsModal";
import { AdminNewJobModal } from "./AdminNewJobModal";
import { AdminJobStatusModal } from "./AdminJobStatusModal";
import { AdminShell } from "./AdminShell";

type AdminJobListingsPageProps = AdminIdentity & {
  errorMessage: string | null;
  jobs: AdminJobListingRecord[];
  summary: AdminJobListingsSummary;
};

type JobListingFilterValues = {
  applicants: string;
  department: string;
  employmentType: string;
  location: string;
  openings: string;
  postedOn: string;
  role: string;
  status: JobListingStatus | "";
  workMode: string;
};

const jobListingsPerPage = 20;
const filterInputClassName =
  "mt-2 h-12 w-full rounded-[16px] border border-[#dbe5f1] bg-white px-4 text-[14px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8a97b3] focus:border-[#00adef]";
const initialFilterValues: JobListingFilterValues = {
  applicants: "",
  department: "",
  employmentType: "",
  location: "",
  openings: "",
  postedOn: "",
  role: "",
  status: "",
  workMode: "",
};

const getJobStatusBadgeClassName = (status: JobListingStatus) => {
  if (status === "Active") {
    return "bg-[#eafbf5] text-[#0b9f6d]";
  }

  if (status === "Urgent Requirement") {
    return "bg-[#fff1f1] text-[#d84b4b]";
  }

  if (status === "Upcoming Requirement") {
    return "bg-[#fff6e5] text-[#d58a00]";
  }

  if (status === "Draft") {
    return "bg-[#eef3ff] text-[#4f6ed7]";
  }

  return "bg-[#f3f5fb] text-[#66728f]";
};

export const AdminJobListingsPage = ({
  email,
  errorMessage,
  jobs,
  name,
  summary,
}: AdminJobListingsPageProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<JobListingFilterValues>(initialFilterValues);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [selectedJobForDetails, setSelectedJobForDetails] =
    useState<AdminJobListingRecord | null>(null);
  const [selectedJobForApplicants, setSelectedJobForApplicants] =
    useState<AdminJobListingRecord | null>(null);
  const [selectedJobForEdit, setSelectedJobForEdit] =
    useState<AdminJobListingRecord | null>(null);
  const [selectedJobForStatus, setSelectedJobForStatus] =
    useState<AdminJobListingRecord | null>(null);
  const roleFilter = filters.role.trim().toLowerCase();
  const departmentFilter = filters.department.trim();
  const employmentTypeFilter = filters.employmentType.trim();
  const workModeFilter = filters.workMode.trim();
  const locationFilter = filters.location.trim().toLowerCase();
  const statusFilter = filters.status;
  const openingsFilter = filters.openings.trim();
  const applicantsFilter = filters.applicants.trim();
  const postedOnFilter = filters.postedOn.trim().toLowerCase();
  const filteredJobs = jobs.filter((job) => {
    if (
      roleFilter &&
      !(
        job.jobTitle.toLowerCase().includes(roleFilter) ||
        job.companyName.toLowerCase().includes(roleFilter)
      )
    ) {
      return false;
    }

    if (departmentFilter && job.department !== departmentFilter) {
      return false;
    }

    if (employmentTypeFilter && job.employmentType !== employmentTypeFilter) {
      return false;
    }

    if (workModeFilter && job.workMode !== workModeFilter) {
      return false;
    }

    if (
      locationFilter &&
      !job.location.toLowerCase().includes(locationFilter)
    ) {
      return false;
    }

    if (statusFilter && job.status !== statusFilter) {
      return false;
    }

    if (openingsFilter && String(job.openings) !== openingsFilter) {
      return false;
    }

    if (applicantsFilter && String(job.applicants) !== applicantsFilter) {
      return false;
    }

    if (
      postedOnFilter &&
      !job.postedOn.toLowerCase().includes(postedOnFilter)
    ) {
      return false;
    }

    return true;
  });
  const totalPages = Math.max(Math.ceil(filteredJobs.length / jobListingsPerPage), 1);
  const resolvedCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (resolvedCurrentPage - 1) * jobListingsPerPage;
  const endIndex = startIndex + jobListingsPerPage;
  const visibleJobs = filteredJobs.slice(startIndex, endIndex);
  const showingFrom = filteredJobs.length === 0 ? 0 : startIndex + 1;
  const showingTo =
    filteredJobs.length === 0 ? 0 : Math.min(endIndex, filteredJobs.length);
  const hasActiveFilters = Object.values(filters).some(
    (value) => String(value).trim() !== "",
  );
  const departmentOptions = Array.from(
    new Set(jobs.map((job) => job.department.trim()).filter(Boolean)),
  ).sort((firstDepartment, secondDepartment) =>
    firstDepartment.localeCompare(secondDepartment),
  );
  const employmentTypeOptions = Array.from(
    new Set(jobs.map((job) => job.employmentType.trim()).filter(Boolean)),
  ).sort((firstType, secondType) => firstType.localeCompare(secondType));
  const workModeOptions = Array.from(
    new Set(jobs.map((job) => job.workMode.trim()).filter(Boolean)),
  ).sort((firstMode, secondMode) => firstMode.localeCompare(secondMode));
  const statusOptions = Array.from(
    new Set(jobs.map((job) => job.status)),
  ).sort((firstStatus, secondStatus) => firstStatus.localeCompare(secondStatus));
  const jobListingStats = [
    {
      accent: "from-[#00adef] to-[#62d4ff]",
      helper:
        summary.totalListings > 0
          ? `${summary.totalListings} total roles in Supabase`
          : "No job listings created yet",
      icon: BriefcaseBusiness,
      label: "Total Listings",
      value: summary.totalListings.toString(),
    },
    {
      accent: "from-[#00c389] to-[#5fe0ba]",
      helper:
        summary.activeRoles > 0
          ? `${summary.activeRoles} currently marked active`
          : "No active roles yet",
      icon: CalendarDays,
      label: "Active Roles",
      value: summary.activeRoles.toString(),
    },
    {
      accent: "from-[#f59e0b] to-[#ffd36e]",
      helper:
        summary.newApplicants > 0
          ? "Applicant count across all jobs"
          : "No applicants tracked yet",
      icon: Users,
      label: "New Applicants",
      value: summary.newApplicants.toString(),
    },
  ];

  const updateFilter = <FieldName extends keyof JobListingFilterValues>(
    fieldName: FieldName,
    value: JobListingFilterValues[FieldName],
  ) => {
    setCurrentPage(1);
    setFilters((currentFilters) => ({
      ...currentFilters,
      [fieldName]:
        fieldName === "applicants" || fieldName === "openings"
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
        activePath="/admin/job-listings"
        adminEmail={email}
        adminName={name}
        breadcrumbLabel="Job Listings"
        title="Job Listings"
        description="Manage published roles, review demand across departments, and keep the hiring inventory up to date."
        showSearch={false}
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
          {jobListingStats.map((card) => {
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
                Job Table
              </p>
              <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#1d223f]">
                Current hiring roles
              </h2>
              <p className="mt-2 max-w-[720px] text-[15px] leading-[1.7] text-[#68748f]">
                Review openings across departments, watch applicant volume, and
                track which roles need fresh publishing attention.
              </p>
            </div>

            <p className="text-[14px] font-medium text-[#6f7b98]">
              Showing {showingFrom}-{showingTo} of {filteredJobs.length} jobs
              {hasActiveFilters ? ` (filtered from ${jobs.length})` : ""}
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
                  Narrow jobs by title, department, status, work setup, or exact
                  hiring counts without leaving this table.
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
                Role
                <input
                  type="text"
                  value={filters.role}
                  onChange={(event) => updateFilter("role", event.target.value)}
                  placeholder="Search job title"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Department
                <select
                  value={filters.department}
                  onChange={(event) => updateFilter("department", event.target.value)}
                  className={filterInputClassName}
                >
                  <option value="">All departments</option>
                  {departmentOptions.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Employment Type
                <select
                  value={filters.employmentType}
                  onChange={(event) =>
                    updateFilter("employmentType", event.target.value)
                  }
                  className={filterInputClassName}
                >
                  <option value="">All employment types</option>
                  {employmentTypeOptions.map((employmentType) => (
                    <option key={employmentType} value={employmentType}>
                      {employmentType}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Work Mode
                <select
                  value={filters.workMode}
                  onChange={(event) => updateFilter("workMode", event.target.value)}
                  className={filterInputClassName}
                >
                  <option value="">All work modes</option>
                  {workModeOptions.map((workMode) => (
                    <option key={workMode} value={workMode}>
                      {workMode}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Location
                <input
                  type="text"
                  value={filters.location}
                  onChange={(event) => updateFilter("location", event.target.value)}
                  placeholder="City or hiring region"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Status
                <select
                  value={filters.status}
                  onChange={(event) =>
                    updateFilter("status", event.target.value as JobListingStatus | "")
                  }
                  className={filterInputClassName}
                >
                  <option value="">All statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Openings
                <input
                  type="text"
                  inputMode="numeric"
                  value={filters.openings}
                  onChange={(event) => updateFilter("openings", event.target.value)}
                  placeholder="Exact openings count"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Applicants
                <input
                  type="text"
                  inputMode="numeric"
                  value={filters.applicants}
                  onChange={(event) => updateFilter("applicants", event.target.value)}
                  placeholder="Exact applicant count"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884] md:col-span-2 xl:col-span-4">
                Posted
                <input
                  type="text"
                  value={filters.postedOn}
                  onChange={(event) => updateFilter("postedOn", event.target.value)}
                  placeholder="Search posted label like today, day, month"
                  className={filterInputClassName}
                />
              </label>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1080px] border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-[12px] font-bold uppercase tracking-[0.16em] text-[#7c89a5]">
                  <th className="px-4 pb-1">Role</th>
                  <th className="px-4 pb-1">Department</th>
                  <th className="px-4 pb-1">Employment</th>
                  <th className="px-4 pb-1">Location</th>
                  <th className="px-4 pb-1">Openings</th>
                  <th className="px-4 pb-1">Applicants</th>
                  <th className="px-4 pb-1">Status</th>
                  <th className="px-4 pb-1">Posted</th>
                  <th className="px-4 pb-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleJobs.length > 0 ? (
                  visibleJobs.map((job) => (
                    <tr key={job.id} className="bg-[#fbfdff]">
                      <td className="rounded-l-[22px] border-y border-l border-[#e6eef6] px-4 py-4">
                        <div>
                          <p className="text-[15px] font-semibold text-[#1d223f]">
                            {job.jobTitle}
                          </p>
                          <p className="mt-1 text-[14px] text-[#6d7894]">
                            {job.companyName}
                          </p>
                        </div>
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] font-medium text-[#1d223f]">
                        {job.department}
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] text-[#52607d]">
                        <p>{job.employmentType}</p>
                        <p className="mt-1 text-[13px] text-[#8b96af]">
                          {job.workMode}
                        </p>
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4">
                        <div className="flex items-center gap-2 text-[15px] text-[#52607d]">
                          <MapPinned className="h-4 w-4 text-[#7c89a5]" />
                          <span>{job.location}</span>
                        </div>
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] font-semibold text-[#1d223f]">
                        {job.openings}
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] font-semibold text-[#1d223f]">
                        {job.applicants}
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1.5 text-[12px] font-bold",
                            getJobStatusBadgeClassName(job.status),
                          )}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4 text-[14px] text-[#6d7894]">
                        {job.postedOn}
                      </td>
                      <td className="rounded-r-[22px] border-y border-r border-[#e6eef6] px-4 py-4 text-[14px] text-[#6d7894] whitespace-nowrap">
                        <div className="flex flex-nowrap items-center gap-2 whitespace-nowrap">
                          <button
                            type="button"
                            title="View applicants"
                            onClick={() => setSelectedJobForApplicants(job)}
                            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#f6ddb0] bg-[#fff8e8] px-3 text-[#c98800] transition-colors duration-200 hover:bg-[#fff1cc]"
                          >
                            <Users className="h-4 w-4" />
                            <span className="text-[12px] font-bold">
                              {job.applicants}
                            </span>
                          </button>
                          <button
                            type="button"
                            title="View details"
                            onClick={() => setSelectedJobForDetails(job)}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dbe5f1] bg-[#eef8ff] text-[#00adef] transition-colors duration-200 hover:bg-[#dff3ff]"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="Update status"
                            onClick={() => setSelectedJobForStatus(job)}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1d223f] text-white transition-colors duration-200 hover:bg-[#2b3561]"
                          >
                            <RefreshCcw className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="Edit job"
                            onClick={() => setSelectedJobForEdit(job)}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dbe5f1] text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
                          >
                            <PencilLine className="h-4 w-4" />
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
                        ? "No jobs match the current filters."
                        : "No job listings found in Supabase yet."}
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

      <AdminNewJobModal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        onSaved={() => router.refresh()}
      />
      {selectedJobForEdit ? (
        <AdminNewJobModal
          key={selectedJobForEdit.id}
          job={selectedJobForEdit}
          isOpen
          onClose={() => setSelectedJobForEdit(null)}
          onSaved={() => router.refresh()}
        />
      ) : null}
      <AdminJobStatusModal
        job={selectedJobForStatus}
        isOpen={selectedJobForStatus !== null}
        onClose={() => setSelectedJobForStatus(null)}
        onUpdated={() => router.refresh()}
      />
      <AdminJobApplicantsModal
        job={selectedJobForApplicants}
        isOpen={selectedJobForApplicants !== null}
        onClose={() => setSelectedJobForApplicants(null)}
      />
      <AdminJobDetailsModal
        job={selectedJobForDetails}
        isOpen={selectedJobForDetails !== null}
        onClose={() => setSelectedJobForDetails(null)}
      />
    </>
  );
};
