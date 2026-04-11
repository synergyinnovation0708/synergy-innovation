"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  PhoneCall,
  RefreshCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminIdentity } from "@/lib/admin-auth-shared";
import type {
  AdminITServiceInquiryRecord,
  AdminITServicesSummary,
} from "@/lib/admin-it-services-shared";
import {
  itServiceInquiryStatuses,
  itServiceOptions,
  type ITServiceInquiryStatus,
} from "@/lib/it-service-inquiries";
import { cn } from "@/lib/utils";
import { AdminShell } from "./AdminShell";
import { AdminITServicesStatusModal } from "./AdminITServicesStatusModal";

type AdminITServicesPageProps = AdminIdentity & {
  errorMessage: string | null;
  inquiries: AdminITServiceInquiryRecord[];
  summary: AdminITServicesSummary;
};

type ITServiceFilterValues = {
  company: string;
  contact: string;
  name: string;
  projectBrief: string;
  serviceRequired: string;
  status: ITServiceInquiryStatus | "";
  submitted: string;
};

const inquiriesPerPage = 20;
const filterInputClassName =
  "mt-2 h-12 w-full rounded-[16px] border border-[#dbe5f1] bg-white px-4 text-[14px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8a97b3] focus:border-[#00adef]";
const initialFilterValues: ITServiceFilterValues = {
  company: "",
  contact: "",
  name: "",
  projectBrief: "",
  serviceRequired: "",
  status: "",
  submitted: "",
};

const statusLabelMap: Record<ITServiceInquiryStatus, string> = {
  closed: "Closed",
  contacted: "Contacted",
  pending: "Pending",
};

const getStatusBadgeClassName = (status: ITServiceInquiryStatus) => {
  if (status === "pending") {
    return "bg-[#fff6e5] text-[#d58a00]";
  }

  if (status === "contacted") {
    return "bg-[#eafbf5] text-[#0b9f6d]";
  }

  return "bg-[#eef2f8] text-[#5f6b86]";
};

const pluralize = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`;

export const AdminITServicesPage = ({
  email,
  errorMessage,
  inquiries,
  name,
  summary,
}: AdminITServicesPageProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ITServiceFilterValues>(initialFilterValues);
  const [selectedInquiryForStatus, setSelectedInquiryForStatus] =
    useState<AdminITServiceInquiryRecord | null>(null);
  const nameFilter = filters.name.trim().toLowerCase();
  const companyFilter = filters.company.trim().toLowerCase();
  const contactFilter = filters.contact.trim().toLowerCase();
  const projectBriefFilter = filters.projectBrief.trim().toLowerCase();
  const serviceRequiredFilter = filters.serviceRequired.trim();
  const statusFilter = filters.status;
  const submittedFilter = filters.submitted.trim().toLowerCase();
  const filteredInquiries = inquiries.filter((inquiry) => {
    if (
      nameFilter &&
      !(
        inquiry.name.toLowerCase().includes(nameFilter) ||
        inquiry.businessEmail.toLowerCase().includes(nameFilter)
      )
    ) {
      return false;
    }

    if (
      companyFilter &&
      !inquiry.companyName.toLowerCase().includes(companyFilter)
    ) {
      return false;
    }

    if (
      contactFilter &&
      !(
        inquiry.contactNumber.toLowerCase().includes(contactFilter) ||
        inquiry.businessEmail.toLowerCase().includes(contactFilter)
      )
    ) {
      return false;
    }

    if (
      projectBriefFilter &&
      !inquiry.projectBrief.toLowerCase().includes(projectBriefFilter)
    ) {
      return false;
    }

    if (
      serviceRequiredFilter &&
      inquiry.serviceRequired !== serviceRequiredFilter
    ) {
      return false;
    }

    if (statusFilter && inquiry.status !== statusFilter) {
      return false;
    }

    if (
      submittedFilter &&
      !(
        inquiry.submittedOn.toLowerCase().includes(submittedFilter) ||
        inquiry.submittedAtLongLabel.toLowerCase().includes(submittedFilter)
      )
    ) {
      return false;
    }

    return true;
  });
  const totalPages = Math.max(
    Math.ceil(filteredInquiries.length / inquiriesPerPage),
    1,
  );
  const resolvedCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (resolvedCurrentPage - 1) * inquiriesPerPage;
  const endIndex = startIndex + inquiriesPerPage;
  const visibleInquiries = filteredInquiries.slice(startIndex, endIndex);
  const showingFrom = filteredInquiries.length === 0 ? 0 : startIndex + 1;
  const showingTo =
    filteredInquiries.length === 0
      ? 0
      : Math.min(endIndex, filteredInquiries.length);
  const hasActiveFilters = Object.values(filters).some(
    (value) => String(value).trim() !== "",
  );
  const overviewCards = [
    {
      accent: "from-[#00adef] to-[#62d4ff]",
      helper:
        summary.latestSubmission ?? "No IT services inquiries have arrived yet",
      icon: Code2,
      label: "Total Inquiries",
      value: summary.totalInquiries.toString(),
    },
    {
      accent: "from-[#f59e0b] to-[#ffd36e]",
      helper:
        summary.pendingInquiries > 0
          ? `${pluralize(summary.pendingInquiries, "lead", "leads")} still need review`
          : "No pending IT services leads right now",
      icon: Clock3,
      label: "Pending Review",
      value: summary.pendingInquiries.toString(),
    },
    {
      accent: "from-[#00c389] to-[#5fe0ba]",
      helper:
        summary.contactedInquiries > 0
          ? `${pluralize(summary.contactedInquiries, "lead", "leads")} already contacted`
          : "No IT services leads marked as contacted yet",
      icon: PhoneCall,
      label: "Contacted",
      value: summary.contactedInquiries.toString(),
    },
    {
      accent: "from-[#1d223f] to-[#3b4677]",
      helper:
        summary.recentSubmissions > 0
          ? `${pluralize(summary.recentSubmissions, "inquiry", "inquiries")} landed in the last 24 hours`
          : "No new IT services inquiries in the last 24 hours",
      icon: CalendarDays,
      label: "Last 24 Hours",
      value: summary.recentSubmissions.toString(),
    },
  ];

  const updateFilter = <FieldName extends keyof ITServiceFilterValues>(
    fieldName: FieldName,
    value: ITServiceFilterValues[FieldName],
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
    <>
      <AdminShell
        activePath="/admin/it-services"
        adminEmail={email}
        adminName={name}
        breadcrumbLabel="IT Services"
        title="IT Services Leads"
        description="Track IT services inquiries submitted from the website, review project briefs, and update each lead status from one admin workspace."
        showSearch={false}
        headerActions={
          <Link
            href="/it-services"
            className="inline-flex h-[52px] items-center gap-2 rounded-[18px] bg-[#1d223f] px-5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#2d3661]"
          >
            Open Public Page
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
                IT Services Table
              </p>
              <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#1d223f]">
                IT services inquiries from Supabase
              </h2>
              <p className="mt-2 max-w-[720px] text-[15px] leading-[1.7] text-[#68748f]">
                Every IT services lead submitted from the public site appears here
                with company, contact details, requested service, project brief, and
                workflow status.
              </p>
            </div>

            <p className="text-[14px] font-medium text-[#6f7b98]">
              Showing {showingFrom}-{showingTo} of {filteredInquiries.length} inquiries
              {hasActiveFilters ? ` (filtered from ${inquiries.length})` : ""}
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
                  Filter IT services leads by each table field without changing the
                  table layout.
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
                Name
                <input
                  type="text"
                  value={filters.name}
                  onChange={(event) => updateFilter("name", event.target.value)}
                  placeholder="Name or business email"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Company
                <input
                  type="text"
                  value={filters.company}
                  onChange={(event) => updateFilter("company", event.target.value)}
                  placeholder="Search company name"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Contact
                <input
                  type="text"
                  value={filters.contact}
                  onChange={(event) => updateFilter("contact", event.target.value)}
                  placeholder="Phone or email"
                  className={filterInputClassName}
                />
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Service Required
                <select
                  value={filters.serviceRequired}
                  onChange={(event) =>
                    updateFilter("serviceRequired", event.target.value)
                  }
                  className={filterInputClassName}
                >
                  <option value="">All services</option>
                  {itServiceOptions.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-[13px] font-semibold text-[#5d6884]">
                Project Brief
                <input
                  type="text"
                  value={filters.projectBrief}
                  onChange={(event) =>
                    updateFilter("projectBrief", event.target.value)
                  }
                  placeholder="Search brief keywords"
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
                      event.target.value as ITServiceFilterValues["status"],
                    )
                  }
                  className={filterInputClassName}
                >
                  <option value="">All statuses</option>
                  {itServiceInquiryStatuses.map((status) => (
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
                  <th className="px-4 pb-1">Lead</th>
                  <th className="px-4 pb-1">Company</th>
                  <th className="px-4 pb-1">Contact</th>
                  <th className="px-4 pb-1">Service</th>
                  <th className="px-4 pb-1">Project Brief</th>
                  <th className="px-4 pb-1">Status</th>
                  <th className="px-4 pb-1">Submitted</th>
                  <th className="px-4 pb-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleInquiries.length > 0 ? (
                  visibleInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="bg-[#fbfdff]">
                      <td className="rounded-l-[22px] border-y border-l border-[#e6eef6] px-4 py-4">
                        <div className="flex items-start gap-3">
                          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef8ff] text-[#00adef]">
                            <Code2 className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-[15px] font-semibold text-[#1d223f]">
                              {inquiry.name}
                            </p>
                            <p className="mt-1 text-[14px] text-[#6d7894]">
                              {inquiry.businessEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] font-medium text-[#1d223f]">
                        {inquiry.companyName}
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] text-[#52607d]">
                        {inquiry.contactNumber}
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4 text-[15px] font-medium text-[#1d223f]">
                        {inquiry.serviceRequired}
                      </td>
                      <td
                        className="border-y border-[#e6eef6] px-4 py-4 text-[15px] leading-[1.6] text-[#52607d]"
                        title={inquiry.projectBrief}
                      >
                        <div className="max-w-[340px]">
                          {inquiry.projectBrief}
                        </div>
                      </td>
                      <td className="border-y border-[#e6eef6] px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1.5 text-[12px] font-bold",
                            getStatusBadgeClassName(inquiry.status),
                          )}
                        >
                          {statusLabelMap[inquiry.status]}
                        </span>
                      </td>
                      <td
                        className="border-y border-[#e6eef6] px-4 py-4 text-[14px] text-[#6d7894]"
                        title={inquiry.submittedAtLongLabel}
                      >
                        {inquiry.submittedOn}
                      </td>
                      <td className="rounded-r-[22px] border-y border-r border-[#e6eef6] px-4 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedInquiryForStatus(inquiry)}
                          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#1d223f] px-4 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[#2b3561]"
                        >
                          <RefreshCcw className="h-4 w-4" />
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-[#fbfdff]">
                    <td
                      colSpan={8}
                      className="rounded-[22px] border border-[#e6eef6] px-4 py-12 text-center text-[15px] text-[#6d7894]"
                    >
                      {hasActiveFilters
                        ? "No IT services inquiries match the current filters."
                        : "No IT services inquiries found in Supabase yet."}
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

      <AdminITServicesStatusModal
        inquiry={selectedInquiryForStatus}
        isOpen={selectedInquiryForStatus !== null}
        onClose={() => setSelectedInquiryForStatus(null)}
        onUpdated={() => router.refresh()}
      />
    </>
  );
};
