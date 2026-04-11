import "server-only";
import { createAdminClient } from "./supabase/admin";

export type AiUsageFeature = "intake_assistant" | "service_chat";
export type AiUsageStatus = "error" | "rate_limited" | "rejected" | "success";

type LogAiUsageEventInput = {
  contextLabel?: string;
  errorMessage?: string;
  feature: AiUsageFeature;
  inputCharacters?: number;
  inputTokens?: number;
  model?: string;
  outputCharacters?: number;
  outputTokens?: number;
  responseId?: string;
  status: AiUsageStatus;
  totalTokens?: number;
};

const aiUsageEventsTableName =
  process.env.SUPABASE_AI_USAGE_EVENTS_TABLE?.trim() || "ai_usage_events";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readNonNegativeInteger = (value: unknown) => {
  const normalizedValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : Number.NaN;

  return Number.isFinite(normalizedValue) && normalizedValue >= 0
    ? Math.round(normalizedValue)
    : 0;
};

export const getAiUsageFromResponse = (payload: unknown) => {
  const usage = isRecord(payload) && isRecord(payload.usage) ? payload.usage : null;

  return {
    inputTokens: readNonNegativeInteger(usage?.input_tokens),
    outputTokens: readNonNegativeInteger(usage?.output_tokens),
    totalTokens: readNonNegativeInteger(usage?.total_tokens),
  };
};

export const getAiResponseId = (payload: unknown) =>
  isRecord(payload) && typeof payload.id === "string" ? payload.id.trim() : "";

export const logAiUsageEvent = async ({
  contextLabel = "",
  errorMessage = "",
  feature,
  inputCharacters = 0,
  inputTokens = 0,
  model = "",
  outputCharacters = 0,
  outputTokens = 0,
  responseId = "",
  status,
  totalTokens = 0,
}: LogAiUsageEventInput) => {
  try {
    const supabase = createAdminClient();

    await supabase.from(aiUsageEventsTableName).insert({
      context_label: contextLabel.trim(),
      error_message: errorMessage.trim(),
      feature,
      input_characters: Math.max(inputCharacters, 0),
      input_tokens: Math.max(inputTokens, 0),
      model: model.trim(),
      output_characters: Math.max(outputCharacters, 0),
      output_tokens: Math.max(outputTokens, 0),
      response_id: responseId.trim(),
      status,
      total_tokens: Math.max(totalTokens, 0),
    });
  } catch (error) {
    console.error("Unable to write AI usage event:", error);
  }
};

export const isMissingAiUsageTableError = (message: string) =>
  message.includes("does not exist") ||
  message.includes("relation") ||
  message.includes("ai_usage_events");

export const getAiUsageEventsTableName = () => aiUsageEventsTableName;
