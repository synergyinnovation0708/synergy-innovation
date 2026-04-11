import { NextResponse } from "next/server";
import {
  getAiResponseId,
  getAiUsageFromResponse,
  logAiUsageEvent,
} from "@/lib/ai-usage";
import {
  checkRateLimit,
  getClientIpAddress,
  normalizePromptText,
  readPositiveIntegerEnv,
  trimMessagesToTotalChars,
} from "@/lib/openai-usage-guard";
import {
  buildServiceKnowledgePrompt,
  serviceKnowledgeTitles,
} from "@/lib/service-knowledge";

export const runtime = "nodejs";

type ServiceChatMessage = {
  content: string;
  role: "assistant" | "user";
};

const openAiResponsesUrl = "https://api.openai.com/v1/responses";
const openAiDefaultModel =
  process.env.OPENAI_SERVICE_CHAT_MODEL?.trim() || "gpt-4.1-mini";
const serviceChatRateLimitMax = readPositiveIntegerEnv(
  process.env.OPENAI_SERVICE_CHAT_RATE_LIMIT_MAX,
  15,
);
const serviceChatRateLimitWindowMs = readPositiveIntegerEnv(
  process.env.OPENAI_SERVICE_CHAT_RATE_LIMIT_WINDOW_MS,
  10 * 60 * 1000,
);
const serviceChatMaxInputChars = readPositiveIntegerEnv(
  process.env.OPENAI_SERVICE_CHAT_MAX_INPUT_CHARS,
  500,
);
const serviceChatMaxHistoryMessages = readPositiveIntegerEnv(
  process.env.OPENAI_SERVICE_CHAT_MAX_HISTORY_MESSAGES,
  8,
);
const serviceChatMaxTotalChars = readPositiveIntegerEnv(
  process.env.OPENAI_SERVICE_CHAT_MAX_TOTAL_CHARS,
  2400,
);
const serviceChatMaxOutputTokens = readPositiveIntegerEnv(
  process.env.OPENAI_SERVICE_CHAT_MAX_OUTPUT_TOKENS,
  450,
);

const hasOpenAiEnv = () => Boolean(process.env.OPENAI_API_KEY?.trim());

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const safeParseJson = (value: string) => {
  if (!value.trim()) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
};

const stripMarkdownCodeFence = (value: string) =>
  value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

const getResponseOutputText = (payload: unknown) => {
  if (isRecord(payload) && typeof payload.output_text === "string") {
    return payload.output_text;
  }

  if (!isRecord(payload) || !Array.isArray(payload.output)) {
    return "";
  }

  for (const item of payload.output) {
    if (!isRecord(item) || !Array.isArray(item.content)) {
      continue;
    }

    for (const part of item.content) {
      if (isRecord(part) && typeof part.text === "string" && part.text.trim()) {
        return part.text;
      }
    }
  }

  return "";
};

const dedupeLabels = (labels: string[]) => Array.from(new Set(labels));

const readString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const readRelatedServiceLabels = (value: unknown) =>
  Array.isArray(value)
    ? dedupeLabels(
        value
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter((item) =>
            serviceKnowledgeTitles.includes(
              item as (typeof serviceKnowledgeTitles)[number],
            ),
          ),
      )
    : [];

const buildSystemPrompt = () =>
  [
    "You are Synergy Innovation's service chatbot.",
    "Respond in English unless the user explicitly asks for another language.",
    "Answer service and product questions using only the approved service catalog below.",
    "Do not invent capabilities, clients, pricing, timelines, or technical details beyond what the catalog supports.",
    "If the user asks something outside the catalog, say that you can help with Synergy's listed services and invite them to ask about the closest matching offering.",
    "Return only valid JSON with this exact shape:",
    JSON.stringify(
      {
        answer: "string",
        relatedServiceLabels: [],
      },
      null,
      2,
    ),
    `relatedServiceLabels must only use these titles when relevant: ${serviceKnowledgeTitles.join(", ")}.`,
    "Keep the answer concise, sales-friendly, and useful.",
    "Service catalog:",
    buildServiceKnowledgePrompt(),
  ].join("\n");

const serviceChatResponseSchema = {
  type: "object",
  properties: {
    answer: {
      type: "string",
    },
    relatedServiceLabels: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["answer", "relatedServiceLabels"],
  additionalProperties: false,
} as const;

const getLatestUserMessage = (payload: unknown) => {
  if (!Array.isArray(payload)) {
    return "";
  }

  for (let index = payload.length - 1; index >= 0; index -= 1) {
    const item = payload[index];

    if (!isRecord(item)) {
      continue;
    }

    if (item.role === "user" && typeof item.content === "string") {
      return item.content.trim();
    }
  }

  return "";
};

const normalizeMessages = (payload: unknown) => {
  if (!Array.isArray(payload)) {
    return [] as ServiceChatMessage[];
  }

  const normalizedMessages = payload
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      const role = item.role;
      const content = item.content;

      if (
        (role === "assistant" || role === "user") &&
        typeof content === "string" &&
        content.trim()
      ) {
        const normalizedContent = normalizePromptText(
          content,
          serviceChatMaxInputChars,
        );

        if (!normalizedContent) {
          return null;
        }

        return {
          content: normalizedContent,
          role,
        } satisfies ServiceChatMessage;
      }

      return null;
    })
    .filter((item): item is ServiceChatMessage => Boolean(item))
    .slice(-serviceChatMaxHistoryMessages);

  return trimMessagesToTotalChars(
    normalizedMessages,
    serviceChatMaxTotalChars,
    (item) => item.content.length,
  );
};

export const POST = async (request: Request) => {
  if (!hasOpenAiEnv()) {
    return NextResponse.json(
      {
        message:
          "OpenAI is not configured. Add OPENAI_API_KEY to enable the service chatbot.",
      },
      { status: 500 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        message: "Invalid chatbot request.",
      },
      { status: 400 },
    );
  }

  const messages = normalizeMessages(
    isRecord(payload) ? payload.messages : null,
  );
  const latestUserMessage = getLatestUserMessage(
    isRecord(payload) ? payload.messages : null,
  );

  if (messages.length === 0) {
    return NextResponse.json(
      {
        message: "Ask a question about Synergy services first.",
      },
      { status: 400 },
    );
  }

  if (!latestUserMessage) {
    return NextResponse.json(
      {
        message: "Ask a question about Synergy services first.",
      },
      { status: 400 },
    );
  }

  if (latestUserMessage.length > serviceChatMaxInputChars) {
    await logAiUsageEvent({
      errorMessage: `Input exceeded ${serviceChatMaxInputChars} characters.`,
      feature: "service_chat",
      inputCharacters: latestUserMessage.length,
      model: openAiDefaultModel,
      status: "rejected",
    });

    return NextResponse.json(
      {
        message: `Keep each chatbot message under ${serviceChatMaxInputChars} characters.`,
      },
      { status: 400 },
    );
  }

  const clientIp = getClientIpAddress(request);
  const rateLimit = checkRateLimit({
    bucketKey: `service-chat:${clientIp}`,
    maxRequests: serviceChatRateLimitMax,
    windowMs: serviceChatRateLimitWindowMs,
  });

  if (rateLimit.limited) {
    await logAiUsageEvent({
      errorMessage: "Rate limit exceeded.",
      feature: "service_chat",
      inputCharacters: latestUserMessage.length,
      model: openAiDefaultModel,
      status: "rate_limited",
    });

    return NextResponse.json(
      {
        message: `Too many chatbot requests. Please wait ${rateLimit.retryAfterSeconds} seconds and try again.`,
      },
      {
        headers: {
          "Retry-After": rateLimit.retryAfterSeconds.toString(),
        },
        status: 429,
      },
    );
  }

  try {
    const openAiResponse = await fetch(openAiResponsesUrl, {
      body: JSON.stringify({
        input: [
          {
            content: [
              {
                text: buildSystemPrompt(),
                type: "input_text",
              },
            ],
            role: "system",
          },
          ...messages.map((message) => ({
            content: [
              {
                text: message.content,
                type: message.role === "assistant" ? "output_text" : "input_text",
              },
            ],
            role: message.role,
          })),
        ],
        max_output_tokens: serviceChatMaxOutputTokens,
        model: openAiDefaultModel,
        text: {
          format: {
            type: "json_schema",
            name: "service_chat_response",
            strict: true,
            schema: serviceChatResponseSchema,
          },
        },
      }),
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const rawPayload = (await openAiResponse.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!openAiResponse.ok) {
      const apiErrorMessage =
        rawPayload &&
        isRecord(rawPayload.error) &&
        typeof rawPayload.error.message === "string"
          ? rawPayload.error.message
          : "OpenAI request failed.";

      const usage = getAiUsageFromResponse(rawPayload);

      await logAiUsageEvent({
        errorMessage: apiErrorMessage,
        feature: "service_chat",
        inputCharacters: latestUserMessage.length,
        inputTokens: usage.inputTokens,
        model: openAiDefaultModel,
        outputTokens: usage.outputTokens,
        responseId: getAiResponseId(rawPayload),
        status: "error",
        totalTokens: usage.totalTokens,
      });

      return NextResponse.json(
        {
          message: apiErrorMessage,
        },
        { status: 502 },
      );
    }

    const outputText = stripMarkdownCodeFence(getResponseOutputText(rawPayload));
    const parsedOutput = safeParseJson(outputText);

    if (!isRecord(parsedOutput)) {
      const fallbackAnswer =
        outputText ||
        "I can help with Synergy's recruitment, IT services, branding, AI attendance, and school transport offerings.";

      const usage = getAiUsageFromResponse(rawPayload);

      await logAiUsageEvent({
        feature: "service_chat",
        inputCharacters: latestUserMessage.length,
        inputTokens: usage.inputTokens,
        model: openAiDefaultModel,
        outputCharacters: fallbackAnswer.length,
        outputTokens: usage.outputTokens,
        responseId: getAiResponseId(rawPayload),
        status: "success",
        totalTokens: usage.totalTokens,
      });

      return NextResponse.json({
        answer: fallbackAnswer,
        relatedServiceLabels: [],
      });
    }

    const answer =
      readString(parsedOutput.answer) ||
      "I can help with Synergy's recruitment, IT services, branding, AI attendance, and school transport offerings.";
    const relatedServiceLabels = readRelatedServiceLabels(
      parsedOutput.relatedServiceLabels,
    );
    const usage = getAiUsageFromResponse(rawPayload);

    await logAiUsageEvent({
      feature: "service_chat",
      inputCharacters: latestUserMessage.length,
      inputTokens: usage.inputTokens,
      model: openAiDefaultModel,
      outputCharacters: answer.length,
      outputTokens: usage.outputTokens,
      responseId: getAiResponseId(rawPayload),
      status: "success",
      totalTokens: usage.totalTokens,
    });

    return NextResponse.json({
      answer,
      relatedServiceLabels,
    });
  } catch (error) {
    console.error("Service chatbot request failed:", error);

    await logAiUsageEvent({
      errorMessage:
        error instanceof Error ? error.message : "Unexpected service chat error.",
      feature: "service_chat",
      inputCharacters: latestUserMessage.length,
      model: openAiDefaultModel,
      status: "error",
    });

    return NextResponse.json(
      {
        message:
          "The service chatbot is unavailable right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
};
