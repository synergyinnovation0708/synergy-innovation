"use client";

import {
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  PencilLine,
  RefreshCcw,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  AdminEmployerRecord,
  AdminEmployerSummary,
} from "@/lib/admin-employers-shared";
import type { AdminIdentity } from "@/lib/admin-auth-shared";
import {
  employerHiringTypes,
  employerInquiryStatuses,
  type EmployerInquiryStatus,
} from "@/lib/employer-inquiries";
import { cn } from "@/lib/utils";
import { AdminEmployerDetailsModal } from "./AdminEmployerDetailsModal";
import { AdminEmployerStatusModal } from "./AdminEmployerStatusModal";
import { AdminNewEmployerModal } from "./AdminNewEmployerModal";
import { AdminShell } from "./AdminShell";

type AdminEmployersPageProps = AdminIdentity & {
  employers: AdminEmployerRecord[];
  errorMessage: string | null;
  summary: AdminEmployerSummary;
};

type EmployerFilterValues = {
  contact: string;
  employer: string;
  hiringRequirement: string;
  hiringType: string;
  locations: string;
  openRoles: string;
  status: EmployerInquiryStatus | "";
  submitted: string;
};

const employersPerPage = 20;
const filterInputClassName =
  "mt-2 h-12 w-full rounded-[16px] border border-[#dbe5f1] bg-white px-4 text-[14px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8a97b3] focus:border-[#00adef]";
const initialFilterValues: EmployerFilterValues = {
  contact: "",
  employer: "",
  hiringRequirement: "",
  hiringType: "",
  locations: "",
  openRoles: "",
  status: "",
  submitted: "",
};

const pluralize = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`;

const statusLabelMap: Record<EmployerInquiryStatus, string> = {
  cancelled: "Cancelled",
  in_progress: "In Progress",
  onboarded: "Onboarded",
  pending: "Pending",
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

export const AdminEmployersPage = ({
  email,
  employers,
  errorMessage,
  name,
  summary,
}: AdminEmployersPageProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<EmployerFilterValues>(initialFilterValues);
  const [isNewEmployerModalOpen, setIsNewEmployerModalOpen] = useState(false);
  const [selectedEmployerForEdit, setSelectedEmployerForEdit] =
    useState<AdminEmployerRecord | null>(null);
  const [selectedEmployerForStatus, setSelectedEmployerForStatus] =
    useState<AdminEmployerRecord | null>(null);
  const employerFilter = filters.employer.trim().toLowerCase();
  const contactFilter = filters.contact.trim().toLowerCase();
  const requirementFilter = filters.hiringRequirement.trim().toLowerCase();
  const hiringTypeFilter = filters.hiringType.trim();
  const locationsFilter = filters.locations.trim().toLowerCase();
  const openRolesFilter = filters.openRoles.trim();
  const statusFilter = filters.status;
  const submittedFilter = filters.submitted.trim().toLowerCase();
  const filteredEmployers = employers.filter((employer) => {
    if (
      employerFilter &&
      !(
        employer.company.toLowerCase().includes(employerFilter) ||
        employer.contactEmail.toLowerCase().includes(employerFilter)
      )
    ) {
      return false;
    }

    if (
      contactFilter &&
      !(
        employer.contactName.toLowerCase().includes(contactFilter) ||
        employer.contactNumber.toLowerCase().includes(contactFilter)
      )
    ) {
      return false;
    }

    if (
      requirementFilter &&
      !employer.hiringRequirement.toLowerCase().includes(requirementFilter)
    ) {
      return false;
    }

    if (hiringTypeFilter && employer.hiringType !== hiringTypeFilter) {
      return false;
    }

    if (
      locationsFilter &&
      !(
        employer.locations.toLowerCase().includes(locationsFilter) ||
        employer.hiringLocations.some((location) =>
          location.toLowerCase().includes(locationsFilter),
        )
      )
    ) {
      return false;
    }

    if (openRolesFilter && String(employer.openRoles) !== openRolesFilter) {
      return false;
    }

    if (statusFilter && employer.status !== statusFilter) {
      return false;
    }

    if (
      submittedFilter &&
      !employer.submittedOn.toLowerCase().includes(submittedFilter)
    ) {
      return false;
    }

    return true;
  });
  const totalPages = Math.max(
    Math.ceil(filteredEmployers.length / employersPerPage),
    1,
  );
  const resolvedCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (resolvedCurrentPage - 1) * employersPerPage;
  const endIndex = startIndex + employersPerPage;
  const visibleEmployers = filteredEmployers.slice(startIndex, endIndex);
  const showingFrom = filteredEmployers.length === 0 ? 0 : startIndex + 1;
  const showingTo =
    filteredEmployers.length === 0
      ? 0
      : Math.min(endIndex, filteredEmployers.length);
  const hasActiveFilters = Object.values(filters).some(
    (value) => String(value).trim() !== "",
  );
  const employerStats = [
    {
      accent: "from-[#00adef] to-[#62d4ff]",
      helper: summary.latestSubmission ?? "No employer requests yet",
      icon: Building2,
      label: "Total Employers",
      value: summary.totalEmployers.toString(),
    },
    {
      accent: "from-[#00c389] to-[#5fe0ba]",
      helper:
        summary.onboardedEmployers > 0
          ? `${pluralize(summary.onboardedEmployers, "employer", "employers")} onboarded`
          : "No employers onboarded yet",
      icon: BriefcaseBusiness,
      label: "Open Positions",
      value: summary.totalPositions.toString(),
    },
    {
      accent: "from-[#f59e0b] to-[#ffd36e]",
      helper:
        summary.pendingEmployers > 0
          ? `${pluralize(summary.pendingEmployers, "request", "requests")} need review`
          : "No pending employer requests",
      icon: CircleDashed,
      label: "Pending Status",
      value: summary.pendingEmployers.toString(),
    },
  ];

  const updateFilter = <FieldName extends keyof EmployerFilterValues>(
    fieldName: FieldName,
    value: EmployerFilterValues[FieldName],
  ) => {
    setCurrentPage(1);
    setFilters((currentFilters) => ({
      ...currentFilters,
      [fieldName]:
        fieldName === "openRoles"
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
        activePath="/admin/employers"
        adminEmail={email}
        adminName={name}
        breadcrumbLabel="Employers"
        title="Employer Directory"
        description="Review live employer inquiries from Supabase, track requested roles, and follow up with hiring contacts from one admin workspace."
        showSearch={false}
        // headerActions={
        //   <button
        //     type="button"
        //     onClick={() => setIsNewEmployerModalOpen(true)}
        //     className="inline-flex h-[52px] items-center gap-2 rounded-[18px] bg-[#1d223f] px-5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#2d3661]"
        //   >
        //     <Plus className="h-4 w-4" />
        //     Create Employer
        //   </button>
        // }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {employerStats.map((card) => {
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
                Employer Table
              </p>
              <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#1d223f]">
                Employer inquiries from Supabase
              </h2>
              <p className="mt-2 max-w-[720px] text-[15px] leading-[1.7] text-[#68748f]">
                Every employer request submitted through the homepage form appears
                here with the requested role, hiring type, locations, and contact
                details.
              </p>
            </div>

            <p className="text-[14px] font-medium text-[#6f7b98]">
              Showing {showingFrom}-{showingTo} of {filteredEmployers.length} employers
              {hasActiveFilters ? ` (filtered from ${employers.length})` : ""}
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
                  Filter employers by each table field without changing the table
                  layout.
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
                Employer
                <input
                  type="text"
                  value={filters.employer}
                  onChange={(event) => updateFilter("employer", event.target.value)}
                  placeholder="Company or work email"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Contact
                <input
                  type="text"
                  value={filters.contact}
                  onChange={(event) => updateFilter("contact", event.target.value)}
                  placeholder="Name or contact number"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Hiring Requirement
                <input
                  type="text"
                  value={filters.hiringRequirement}
                  onChange={(event) =>
                    updateFilter("hiringRequirement", event.target.value)
                  }
                  placeholder="Search role or requirement"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Hiring Type
                <select
                  value={filters.hiringType}
                  onChange={(event) => updateFilter("hiringType", event.target.value)}
                  className={filterInputClassName}
                >
                  <option value="">All hiring types</option>
                  {employerHiringTypes.map((hiringType) => (
                    <option key={hiringType} value={hiringType}>
                      {hiringType}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Locations
                <input
                  type="text"
                  value={filters.locations}
                  onChange={(event) => updateFilter("locations", event.target.value)}
                  placeholder="City or remote"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Open Roles
                <input
                  type="text"
                  inputMode="numeric"
                  value={filters.openRoles}
                  onChange={(event) => updateFilter("openRoles", event.target.value)}
                  placeholder="Exact position count"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Status
                <select
                  value={filters.status}
                  onChange={(event) =>
                    updateFilter(
                      "status",
                      event.target.value as EmployerFilterValues["status"],
                    )
                  }
                  className={filterInputClassName}
                >
                  <option value="">All statuses</option>
                  {employerInquiryStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabelMap[status]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Submitted
                <input
                  type="text"
                  value={filters.submitted}
                  onChange={(event) => updateFilter("submitted", event.target.value)}
                  placeholder="Minute, day, month"
                  className={filterInputClassName}
                />
              </label>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[1400px] w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-[12px] font-bold uppercase tracking-[0.16em] text-[#7c89a5]">
                  <th className="px-4 pb-1">Employer</th>
                  <th className="px-4 pb-1">Contact</th>
                  <th className="px-4 pb-1">Hiring Requirement</th>
                  <th className="px-4 pb-1">Hiring Type</th>
                  <th className="px-4 pb-1">Locations</th>
                  <th className="px-4 pb-1">Open Roles</th>
                  <th className="px-4 pb-1">Status</th>
                  <th className="px-4 pb-1">Submitted</th>
                  <th className="px-4 pb-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleEmployers.length > 0 ? (
                  visibleEmployers.map((employer) => (
                    <tr key={employer.id} className="bg-[#fbfdff]">
                      <td className="rounded-l-[22px] border-y border-l border-[#e6eef6] px-4 py-4">
                        <div className="flex items-start gap-3">
                          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef8ff] text-[#00adef]">
                            <Building2 className="h-5 w-5" />
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
                        <div className="flex items-start gap-2">
                          <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[#7c89a5]" />
                          <div>
                            <p className="text-[15px] font-medium text-[#1d223f]">
                              {employer.contactName}
                            </p>
                            <p className="mt-1 text-[14px] text-[#6d7894]">
                              {employer.contactNumber}
                            </p>
                          </div>
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
                        {employer.locations}
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
                        {employer.submittedOn}
                      </td>
                      <td className="rounded-r-[22px] border-y border-r border-[#e6eef6] px-4 py-4 text-[14px] text-[#6d7894] whitespace-nowrap">
                        <div className="flex flex-nowrap items-center gap-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedEmployerForEdit(employer)}
                            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#dbe5f1] px-4 text-[13px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
                          >
                            <PencilLine className="h-4 w-4" />
                            
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedEmployerForStatus(employer)}
                            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#1d223f] px-4 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[#2b3561]"
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
                        ? "No employer inquiries match the current filters."
                        : "No employer inquiries found in Supabase yet."}
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

      <AdminNewEmployerModal
        isOpen={isNewEmployerModalOpen}
        onClose={() => setIsNewEmployerModalOpen(false)}
      />
      <AdminEmployerDetailsModal
        employer={selectedEmployerForEdit}
        isOpen={selectedEmployerForEdit !== null}
        onClose={() => setSelectedEmployerForEdit(null)}
        onSaved={() => router.refresh()}
      />
      <AdminEmployerStatusModal
        employer={selectedEmployerForStatus}
        isOpen={selectedEmployerForStatus !== null}
        onClose={() => setSelectedEmployerForStatus(null)}
        onUpdated={() => router.refresh()}
      />
    </>
  );
};
