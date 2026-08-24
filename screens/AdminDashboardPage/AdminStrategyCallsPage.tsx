"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Calendar,
  PhoneCall,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminIdentity } from "@/lib/admin-auth-shared";
import type {
  AdminStrategyCallRecord,
  AdminStrategyCallsSummary,
} from "@/lib/admin-strategy-calls";
import {
  strategyCallStatuses,
  type StrategyCallStatus,
} from "@/lib/strategy-calls";
import { cn } from "@/lib/utils";
import { AdminShell } from "./AdminShell";
import { AdminStrategyCallsStatusModal } from "./AdminStrategyCallsStatusModal";

type AdminStrategyCallsPageProps = AdminIdentity & {
  errorMessage: string | null;
  calls: AdminStrategyCallRecord[];
  summary: AdminStrategyCallsSummary;
};

type StrategyCallFilterValues = {
  fullName: string;
  businessEmail: string;
  contactNumber: string;
  subject: string;
  status: StrategyCallStatus | "";
};

const callsPerPage = 20;
const filterInputClassName =
  "mt-2 h-12 w-full rounded-[16px] border border-[#dbe5f1] bg-white px-4 text-[14px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8a97b3] focus:border-[#00adef]";

const initialFilterValues: StrategyCallFilterValues = {
  fullName: "",
  businessEmail: "",
  contactNumber: "",
  subject: "",
  status: "",
};

const statusLabelMap: Record<StrategyCallStatus, string> = {
  pending: "Pending",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

const getStatusBadgeClassName = (status: StrategyCallStatus) => {
  if (status === "pending") {
    return "bg-[#fff6e5] text-[#d58a00]";
  }
  if (status === "scheduled") {
    return "bg-[#eef2f8] text-[#4f6ed7]";
  }
  if (status === "completed") {
    return "bg-[#eafbf5] text-[#0b9f6d]";
  }
  return "bg-[#fceeed] text-[#dc2626]";
};

const pluralize = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`;

export const AdminStrategyCallsPage = ({
  email,
  errorMessage,
  calls,
  name,
  summary,
}: AdminStrategyCallsPageProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<StrategyCallFilterValues>(initialFilterValues);
  const [selectedCallForStatus, setSelectedCallForStatus] =
    useState<AdminStrategyCallRecord | null>(null);

  const fullNameFilter = filters.fullName.trim().toLowerCase();
  const emailFilter = filters.businessEmail.trim().toLowerCase();
  const contactFilter = filters.contactNumber.trim().toLowerCase();
  const subjectFilter = filters.subject.trim().toLowerCase();
  const statusFilter = filters.status;

  const filteredCalls = calls.filter((call) => {
    if (fullNameFilter && !call.fullName.toLowerCase().includes(fullNameFilter)) {
      return false;
    }
    if (emailFilter && !call.businessEmail.toLowerCase().includes(emailFilter)) {
      return false;
    }
    if (contactFilter && !call.contactNumber.toLowerCase().includes(contactFilter)) {
      return false;
    }
    if (subjectFilter && !call.subject.toLowerCase().includes(subjectFilter)) {
      return false;
    }
    if (statusFilter && call.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCalls.length / callsPerPage));
  const showingFrom = filteredCalls.length === 0 ? 0 : (currentPage - 1) * callsPerPage + 1;
  const showingTo = Math.min(currentPage * callsPerPage, filteredCalls.length);
  const paginatedCalls = filteredCalls.slice(showingFrom - 1, showingTo);

  const hasActiveFilters =
    fullNameFilter || emailFilter || contactFilter || subjectFilter || statusFilter;

  const overviewCards = [
    {
      accent: "from-[#f59e0b] to-[#d97706]",
      helper:
        summary.pendingCalls > 0
          ? `${pluralize(summary.pendingCalls, "call", "calls")} pending follow-up`
          : "All calls addressed",
      icon: Clock3,
      label: "Pending Calls",
      value: summary.pendingCalls.toString(),
    },
    {
      accent: "from-[#3b82f6] to-[#2563eb]",
      helper: `${summary.scheduledCalls} calls confirmed & scheduled`,
      icon: Calendar,
      label: "Scheduled Calls",
      value: summary.scheduledCalls.toString(),
    },
    {
      accent: "from-[#10b981] to-[#059669]",
      helper: `${summary.completedCalls} sessions completed successfully`,
      icon: CheckCircle2,
      label: "Completed Calls",
      value: summary.completedCalls.toString(),
    },
    {
      accent: "from-[#1d223f] to-[#3b4677]",
      helper:
        summary.recentCalls > 0
          ? `${pluralize(summary.recentCalls, "call", "calls")} booked in last 24h`
          : "No bookings in last 24 hours",
      icon: CalendarDays,
      label: "Last 24 Hours",
      value: summary.recentCalls.toString(),
    },
  ];

  const updateFilter = <FieldName extends keyof StrategyCallFilterValues>(
    fieldName: FieldName,
    value: StrategyCallFilterValues[FieldName],
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
        activePath="/admin/strategy-calls"
        adminEmail={email}
        adminName={name}
        breadcrumbLabel="Strategy Calls"
        title="Strategy Call Bookings"
        description="Review and schedule client strategy calls, inspect preferences, and keep status updated."
        showSearch={false}
        headerActions={
          <Link
            href="/web-development"
            className="inline-flex h-[52px] items-center gap-2 rounded-[18px] bg-[#1d223f] px-5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#2d3661]"
          >
            Open Web Development Page
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
                Bookings Table
              </p>
              <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#1d223f]">
                Strategy calls booked from Supabase
              </h2>
              <p className="mt-2 max-w-[720px] text-[15px] leading-[1.7] text-[#68748f]">
                Track all incoming strategy call schedules, view requested time slots, client briefs, and manage workflow.
              </p>
            </div>

            <p className="text-[14px] font-medium text-[#6f7b98]">
              Showing {showingFrom}-{showingTo} of {filteredCalls.length} calls
              {hasActiveFilters ? ` (filtered from ${calls.length})` : ""}
            </p>
          </div>

          <div className="mt-6 grid gap-4 rounded-[24px] border border-[#e8f1fb] bg-[#fbfdff] p-5 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
            <div>
              <label htmlFor="filter-name" className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#6c7895]">
                Client Name
              </label>
              <input
                id="filter-name"
                value={filters.fullName}
                onChange={(e) => updateFilter("fullName", e.target.value)}
                placeholder="Filter by name..."
                className={filterInputClassName}
              />
            </div>
            <div>
              <label htmlFor="filter-email" className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#6c7895]">
                Business Email
              </label>
              <input
                id="filter-email"
                value={filters.businessEmail}
                onChange={(e) => updateFilter("businessEmail", e.target.value)}
                placeholder="Filter by email..."
                className={filterInputClassName}
              />
            </div>
            <div>
              <label htmlFor="filter-contact" className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#6c7895]">
                Contact Number
              </label>
              <input
                id="filter-contact"
                value={filters.contactNumber}
                onChange={(e) => updateFilter("contactNumber", e.target.value)}
                placeholder="Filter by number..."
                className={filterInputClassName}
              />
            </div>
            <div>
              <label htmlFor="filter-subject" className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#6c7895]">
                Subject
              </label>
              <input
                id="filter-subject"
                value={filters.subject}
                onChange={(e) => updateFilter("subject", e.target.value)}
                placeholder="Filter by subject..."
                className={filterInputClassName}
              />
            </div>
            <div>
              <label htmlFor="filter-status" className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#6c7895]">
                Workflow Status
              </label>
              <select
                id="filter-status"
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value as StrategyCallStatus | "")}
                className={filterInputClassName}
              >
                <option value="">All statuses</option>
                {strategyCallStatuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabelMap[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters ? (
            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-[38px] items-center gap-2 rounded-full border border-[#dbe5f1] px-4 text-[13px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Clear Filters
              </button>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mt-6 rounded-[22px] border border-[#fdd8d8] bg-[#fff5f5] p-5 text-[15px] font-medium text-[#dc2626]">
              {errorMessage}
            </div>
          ) : filteredCalls.length === 0 ? (
            <div className="mt-6 rounded-[26px] border border-dashed border-[#c9d6e5] p-10 text-center">
              <p className="text-[16px] font-bold text-[#1d223f]">No strategy call bookings found.</p>
              <p className="mt-1.5 text-[14px] text-[#68748f]">
                {hasActiveFilters
                  ? "Try widening your filters to view more strategy calls."
                  : "New strategy calls scheduled on the website will appear here."}
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#eef3fa] text-[13px] font-bold uppercase tracking-[0.14em] text-[#6c7895]">
                    <th className="pb-4 pl-4 pr-3">Client Details</th>
                    <th className="pb-4 px-3">Subject</th>
                    <th className="pb-4 px-3">Slot Requested</th>
                    <th className="pb-4 px-3">Brief / Notes</th>
                    <th className="pb-4 px-3">Status</th>
                    <th className="pb-4 px-3">Booked At</th>
                    <th className="pb-4 pl-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef3fa] text-[14.5px] font-medium text-[#1d223f]">
                  {paginatedCalls.map((call) => (
                    <tr key={call.id} className="hover:bg-[#fafcfe]/50 transition-colors duration-150">
                      <td className="py-4 pl-4 pr-3">
                        <span className="block font-bold text-[#1d223f]">{call.fullName}</span>
                        <span className="mt-1 block text-[13px] text-[#68748f]">{call.businessEmail}</span>
                        <span className="mt-1 block text-[13px] text-[#68748f]">{call.contactNumber}</span>
                      </td>
                      <td className="py-4 px-3 text-[#1d223f]">{call.subject}</td>
                      <td className="py-4 px-3">
                        <span className="block font-semibold text-[#1d223f]">{call.preferredDate}</span>
                        <span className="mt-1 block text-[13.5px] text-[#00adef] font-semibold">
                          {call.preferredTimeSlot}
                        </span>
                      </td>
                      <td className="py-4 px-3 max-w-[280px]">
                        <p className="line-clamp-3 text-[13.5px] text-[#68748f] font-normal leading-[1.6]">
                          {call.notes}
                        </p>
                      </td>
                      <td className="py-4 px-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-[12px] font-bold uppercase tracking-[0.12em]",
                            getStatusBadgeClassName(call.status),
                          )}
                        >
                          {statusLabelMap[call.status]}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-[13.5px] text-[#6c7895]">{call.submittedAtLongLabel}</td>
                      <td className="py-4 pl-3 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCallForStatus(call)}
                          className="inline-flex h-[38px] items-center justify-center rounded-full border border-[#dbe5f1] px-4 text-[13px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#1d223f] hover:text-white"
                        >
                          Change Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-between border-t border-[#eef3fa] pt-5">
              <p className="text-[13.5px] text-[#6c7895]">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((c) => c - 1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe5f1] text-[#1d223f] hover:bg-[#f4f8fc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((c) => c + 1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe5f1] text-[#1d223f] hover:bg-[#f4f8fc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </AdminShell>

      <AdminStrategyCallsStatusModal
        call={selectedCallForStatus}
        isOpen={selectedCallForStatus !== null}
        onClose={() => setSelectedCallForStatus(null)}
        onUpdated={() => {
          router.refresh();
        }}
      />
    </>
  );
};
