import "server-only";
import type {
  AdminAiUsageRecord,
  AdminAiUsageSummary,
} from "./admin-ai-usage-shared";
import {
  getAiUsageEventsTableName,
  isMissingAiUsageTableError,
} from "./ai-usage";
import { createAdminClient } from "./supabase/admin";

type AiUsageEventRow = {
  context_label: string | null;
  created_at: string;
  error_message: string | null;
  feature: string | null;
  id: string;
  input_characters: number | null;
  input_tokens: number | null;
  model: string | null;
  output_characters: number | null;
  output_tokens: number | null;
  response_id: string | null;
  status: string | null;
  total_tokens: number | null;
};

type AdminAiUsageData = {
  errorMessage: string | null;
  records: AdminAiUsageRecord[];
  summary: AdminAiUsageSummary;
};

const aiUsageEventsTableName = getAiUsageEventsTableName();
const aiUsageWindowDays = 30;
const recentAiUsageLimit = 10;

const createEmptySummary = (): AdminAiUsageSummary => ({
  failedRequests: 0,
  inputTokens: 0,
  intakeAssistantRequests: 0,
  last24HoursRequests: 0,
  latestUsageLabel: null,
  outputTokens: 0,
  rateLimitedRequests: 0,
  serviceChatRequests: 0,
  successfulRequests: 0,
  totalRequests: 0,
  totalTokens: 0,
  windowLabel: `Last ${aiUsageWindowDays} days`,
});

const formatRelativeTime = (dateValue: string) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Recorded recently";
  }

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const differenceInMinutes = Math.round(
    (date.getTime() - Date.now()) / (1000 * 60),
  );
  const absoluteDifferenceInMinutes = Math.abs(differenceInMinutes);

  if (absoluteDifferenceInMinutes < 60) {
    return `Recorded ${formatter.format(differenceInMinutes, "minute")}`;
  }

  const differenceInHours = Math.round(differenceInMinutes / 60);

  if (Math.abs(differenceInHours) < 24) {
    return `Recorded ${formatter.format(differenceInHours, "hour")}`;
  }

  const differenceInDays = Math.round(differenceInHours / 24);

  if (Math.abs(differenceInDays) < 30) {
    return `Recorded ${formatter.format(differenceInDays, "day")}`;
  }

  const differenceInMonths = Math.round(differenceInDays / 30);

  return `Recorded ${formatter.format(differenceInMonths, "month")}`;
};

const featureLabelMap: Record<string, string> = {
  intake_assistant: "Intake Assistant",
  service_chat: "Service Chatbot",
};

const statusLabelMap: Record<string, string> = {
  error: "Error",
  rate_limited: "Rate Limited",
  rejected: "Rejected",
  success: "Success",
};

const formatFeatureLabel = (value: string) =>
  featureLabelMap[value] ?? "AI Request";

const formatStatusLabel = (value: string) =>
  statusLabelMap[value] ?? "Unknown";

export const getAdminAiUsageData = async (): Promise<AdminAiUsageData> => {
  try {
    const sinceIso = new Date(
      Date.now() - aiUsageWindowDays * 24 * 60 * 60 * 1000,
    ).toISOString();
    const last24HoursThreshold = Date.now() - 24 * 60 * 60 * 1000;
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(aiUsageEventsTableName)
      .select(
        "id, feature, context_label, status, model, input_tokens, output_tokens, total_tokens, input_characters, output_characters, error_message, response_id, created_at",
      )
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        errorMessage: isMissingAiUsageTableError(error.message)
          ? "Run supabase/ai_usage_events.sql in Supabase to enable the admin AI usage dashboard."
          : "Unable to load AI usage activity from Supabase.",
        records: [],
        summary: createEmptySummary(),
      };
    }

    const rows = (data ?? []) as AiUsageEventRow[];
    const records = rows.slice(0, recentAiUsageLimit).map((row) => ({
      contextLabel: row.context_label?.trim() || "",
      createdAt: row.created_at,
      createdAtLabel: formatRelativeTime(row.created_at),
      errorMessage: row.error_message?.trim() || "",
      feature: row.feature?.trim() || "",
      featureLabel: formatFeatureLabel(row.feature?.trim() || ""),
      id: row.id,
      inputCharacters: row.input_characters ?? 0,
      inputTokens: row.input_tokens ?? 0,
      model: row.model?.trim() || "",
      outputCharacters: row.output_characters ?? 0,
      outputTokens: row.output_tokens ?? 0,
      responseId: row.response_id?.trim() || "",
      status: row.status?.trim() || "",
      statusLabel: formatStatusLabel(row.status?.trim() || ""),
      totalTokens: row.total_tokens ?? 0,
    }));

    return {
      errorMessage: null,
      records,
      summary: {
        failedRequests: rows.filter((row) => {
          const status = row.status?.trim() || "";

          return status === "error" || status === "rejected";
        }).length,
        inputTokens: rows.reduce(
          (sum, row) => sum + (row.input_tokens ?? 0),
          0,
        ),
        intakeAssistantRequests: rows.filter(
          (row) => row.feature?.trim() === "intake_assistant",
        ).length,
        last24HoursRequests: rows.filter((row) => {
          const createdAt = new Date(row.created_at).getTime();

          return Number.isFinite(createdAt) && createdAt >= last24HoursThreshold;
        }).length,
        latestUsageLabel: rows[0]?.created_at
          ? formatRelativeTime(rows[0].created_at)
          : null,
        outputTokens: rows.reduce(
          (sum, row) => sum + (row.output_tokens ?? 0),
          0,
        ),
        rateLimitedRequests: rows.filter(
          (row) => row.status?.trim() === "rate_limited",
        ).length,
        serviceChatRequests: rows.filter(
          (row) => row.feature?.trim() === "service_chat",
        ).length,
        successfulRequests: rows.filter(
          (row) => row.status?.trim() === "success",
        ).length,
        totalRequests: rows.length,
        totalTokens: rows.reduce(
          (sum, row) => sum + (row.total_tokens ?? 0),
          0,
        ),
        windowLabel: `Last ${aiUsageWindowDays} days`,
      },
    };
  } catch {
    return {
      errorMessage: "Unable to connect to Supabase AI usage data.",
      records: [],
      summary: createEmptySummary(),
    };
  }
};
