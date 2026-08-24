import "server-only";
import { isStrategyCallStatus, type StrategyCallStatus } from "./strategy-calls";
import { createAdminClient } from "./supabase/admin";

export type AdminStrategyCallRecord = {
  id: string;
  fullName: string;
  businessEmail: string;
  contactNumber: string;
  subject: string;
  preferredDate: string;
  preferredTimeSlot: string;
  notes: string;
  status: StrategyCallStatus;
  createdAt: string;
  submittedAtLabel: string;
  submittedAtLongLabel: string;
};

export type AdminStrategyCallsSummary = {
  pendingCalls: number;
  scheduledCalls: number;
  completedCalls: number;
  cancelledCalls: number;
  totalCalls: number;
  recentCalls: number;
  latestSubmission: string | null;
};

type StrategyCallRow = {
  id: string;
  full_name: string;
  business_email: string;
  contact_number: string;
  subject: string;
  preferred_date: string;
  preferred_time_slot: string;
  notes: string;
  status: string;
  created_at: string;
};

type AdminStrategyCallsData = {
  errorMessage: string | null;
  calls: AdminStrategyCallRecord[];
  summary: AdminStrategyCallsSummary;
};

const formatRelativeSubmissionTime = (submittedAt: string) => {
  const submissionDate = new Date(submittedAt);

  if (Number.isNaN(submissionDate.getTime())) {
    return "Submitted recently";
  }

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const differenceInMinutes = Math.round(
    (submissionDate.getTime() - Date.now()) / (1000 * 60),
  );
  const absoluteDifferenceInMinutes = Math.abs(differenceInMinutes);

  if (absoluteDifferenceInMinutes < 60) {
    return `Submitted ${formatter.format(differenceInMinutes, "minute")}`;
  }

  const differenceInHours = Math.round(differenceInMinutes / 60);

  if (Math.abs(differenceInHours) < 24) {
    return `Submitted ${formatter.format(differenceInHours, "hour")}`;
  }

  const differenceInDays = Math.round(differenceInHours / 24);

  if (Math.abs(differenceInDays) < 30) {
    return `Submitted ${formatter.format(differenceInDays, "day")}`;
  }

  const differenceInMonths = Math.round(differenceInDays / 30);

  return `Submitted ${formatter.format(differenceInMonths, "month")}`;
};

const formatLongDateTime = (dateValue: string) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const createEmptySummary = (): AdminStrategyCallsSummary => ({
  pendingCalls: 0,
  scheduledCalls: 0,
  completedCalls: 0,
  cancelledCalls: 0,
  totalCalls: 0,
  recentCalls: 0,
  latestSubmission: null,
});

export const getAdminStrategyCallsData = async (): Promise<AdminStrategyCallsData> => {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("strategy_calls")
      .select("id, full_name, business_email, contact_number, subject, preferred_date, preferred_time_slot, notes, status, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return {
        errorMessage: error.message.includes("does not exist")
          ? "Run the strategy_calls SQL migration in Supabase to load strategy call schedules."
          : "Unable to load strategy calls from Supabase.",
        calls: [],
        summary: createEmptySummary(),
      };
    }

    const rows = (data ?? []) as StrategyCallRow[];
    const recentThreshold = Date.now() - 24 * 60 * 60 * 1000;
    const calls = rows.map((record) => {
      const nextStatus = record.status ?? "";

      return {
        id: record.id,
        fullName: record.full_name,
        businessEmail: record.business_email,
        contactNumber: record.contact_number,
        subject: record.subject,
        preferredDate: record.preferred_date,
        preferredTimeSlot: record.preferred_time_slot,
        notes: record.notes?.trim() || "No notes shared.",
        status: isStrategyCallStatus(nextStatus) ? nextStatus : "pending",
        createdAt: record.created_at,
        submittedAtLabel: formatRelativeSubmissionTime(record.created_at),
        submittedAtLongLabel: formatLongDateTime(record.created_at),
      };
    });

    return {
      errorMessage: null,
      calls,
      summary: {
        pendingCalls: calls.filter((c) => c.status === "pending").length,
        scheduledCalls: calls.filter((c) => c.status === "scheduled").length,
        completedCalls: calls.filter((c) => c.status === "completed").length,
        cancelledCalls: calls.filter((c) => c.status === "cancelled").length,
        totalCalls: calls.length,
        recentCalls: rows.filter((record) => {
          const submittedAt = new Date(record.created_at).getTime();
          return Number.isFinite(submittedAt) && submittedAt >= recentThreshold;
        }).length,
        latestSubmission: rows[0]?.created_at
          ? formatRelativeSubmissionTime(rows[0].created_at)
          : null,
      },
    };
  } catch {
    return {
      errorMessage: "Unable to connect to Supabase strategy calls data.",
      calls: [],
      summary: createEmptySummary(),
    };
  }
};
