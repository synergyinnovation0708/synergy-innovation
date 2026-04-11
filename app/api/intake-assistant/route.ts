import { NextResponse } from "next/server";
import {
  getAiResponseId,
  getAiUsageFromResponse,
  logAiUsageEvent,
} from "@/lib/ai-usage";
import {
  employerHiringTypes,
  employerLocations,
} from "@/lib/employer-inquiries";
import {
  checkRateLimit,
  getClientIpAddress,
  normalizePromptText,
  readPositiveIntegerEnv,
  stringifyForPrompt,
} from "@/lib/openai-usage-guard";
import {
  getEmployerAssistantAppliedFieldLabels,
  getEmployerAssistantMissingFieldLabels,
  getJobSeekerAssistantAppliedFieldLabels,
  getJobSeekerAssistantMissingFieldLabels,
  mergeEmployerAssistantValues,
  mergeJobSeekerAssistantValues,
  sanitizeEmployerAssistantValues,
  sanitizeJobSeekerAssistantValues,
  type IntakeAssistantMode,
  type IntakeAssistantResponseMap,
} from "@/lib/intake-assistant";
import { validateResumeMetadata } from "@/lib/job-seeker-inquiries";
import {
  buildServiceKnowledgePrompt,
  serviceKnowledgeTitles,
} from "@/lib/service-knowledge";

export const runtime = "nodejs";

const openAiResponsesUrl = "https://api.openai.com/v1/responses";
const openAiDefaultModel = process.env.OPENAI_INTAKE_MODEL?.trim() || "gpt-4.1-mini";
const intakeAssistantRateLimitMax = readPositiveIntegerEnv(
  process.env.OPENAI_INTAKE_RATE_LIMIT_MAX,
  6,
);
const intakeAssistantRateLimitWindowMs = readPositiveIntegerEnv(
  process.env.OPENAI_INTAKE_RATE_LIMIT_WINDOW_MS,
  30 * 60 * 1000,
);
const intakeAssistantMaxMessageChars = readPositiveIntegerEnv(
  process.env.OPENAI_INTAKE_MAX_MESSAGE_CHARS,
  4000,
);
const intakeAssistantMaxCurrentValuesChars = readPositiveIntegerEnv(
  process.env.OPENAI_INTAKE_MAX_CURRENT_VALUES_CHARS,
  3000,
);
const intakeAssistantMaxOutputTokens = readPositiveIntegerEnv(
  process.env.OPENAI_INTAKE_MAX_OUTPUT_TOKENS,
  700,
);

const hasOpenAiEnv = () => Boolean(process.env.OPENAI_API_KEY?.trim());

const getStringField = (formData: FormData, fieldName: string) => {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
};

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

const buildSystemPrompt = (mode: IntakeAssistantMode) => {
  if (mode === "employer") {
    return [
      "You are Synergy Innovation's employer intake assistant.",
      "Your job is to read hiring briefs, job descriptions, recruiter notes, and service-related questions.",
      "Return only valid JSON with this exact shape:",
      JSON.stringify(
        {
          assistantMessage: "string",
          serviceAnswer: "string",
          relatedServiceLabels: [],
          suggestedValues: {
            companyName: "",
            yourName: "",
            workEmail: "",
            contact: "",
            hiringRequirement: "",
            hiringType: "",
            hiringLocations: [],
            numberOfPositions: "",
          },
        },
        null,
        2,
      ),
      "Rules:",
      `- hiringType must be one of: ${employerHiringTypes.join(", ")}. Use an empty string if unclear.`,
      `- hiringLocations must only contain values from: ${employerLocations.join(", ")}.`,
      `- relatedServiceLabels must only use these titles when relevant: ${serviceKnowledgeTitles.join(", ")}.`,
      "- serviceAnswer should answer service or product questions using the provided catalog only. Keep it empty if the user did not ask about services.",
      "- contact must contain digits only.",
      "- numberOfPositions must contain digits only.",
      "- Do not invent emails, phone numbers, company names, or recruiter names.",
      "- assistantMessage should be short, practical, and mention what was filled plus the most important missing details.",
      "Service catalog:",
      buildServiceKnowledgePrompt(),
    ].join("\n");
  }

  return [
    "You are Synergy Innovation's job seeker intake assistant.",
    "Your job is to read resume content, candidate summaries, profile notes, and service-related questions.",
    "Return only valid JSON with this exact shape:",
    JSON.stringify(
      {
        assistantMessage: "string",
        serviceAnswer: "string",
        relatedServiceLabels: [],
        suggestedValues: {
          name: "",
          email: "",
          contact: "",
          currentPosition: "",
          currentCompany: "",
        },
      },
      null,
      2,
    ),
    "Rules:",
    `- relatedServiceLabels must only use these titles when relevant: ${serviceKnowledgeTitles.join(", ")}.`,
    "- serviceAnswer should answer service or product questions using the provided catalog only. Keep it empty if the user did not ask about services.",
    "- contact must contain digits only.",
    "- Do not invent phone numbers, email addresses, company names, or job titles.",
    "- If the candidate is clearly a fresher/student and no active role is mentioned, currentPosition may be 'Fresher Candidate'.",
    "- If the resume shows a college or institute but no employer, currentCompany may use that institute name.",
    "- assistantMessage should be short, practical, and mention what was filled plus the most important missing details.",
    "Service catalog:",
    buildServiceKnowledgePrompt(),
  ].join("\n");
};

const buildUserPrompt = ({
  currentValues,
  hasResumeFile,
  message,
  mode,
}: {
  currentValues: unknown;
  hasResumeFile: boolean;
  message: string;
  mode: IntakeAssistantMode;
}) =>
  [
    `Intake mode: ${mode}`,
    `Current form values: ${stringifyForPrompt(currentValues, intakeAssistantMaxCurrentValuesChars)}`,
    `Resume file attached: ${hasResumeFile ? "yes" : "no"}`,
    `User note: ${
      message.trim()
        ? normalizePromptText(message, intakeAssistantMaxMessageChars)
        : "No extra note provided. Use the attached file if available."
    }`,
  ].join("\n\n");

const buildResumeFileDataUrl = async (file: File) => {
  const bytes = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type?.trim() || "application/octet-stream";

  return `data:${mimeType};base64,${bytes.toString("base64")}`;
};

const dedupeLabels = (labels: string[]) => Array.from(new Set(labels));

const readString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const readRelatedServiceLabels = (value: unknown) =>
  Array.isArray(value)
    ? dedupeLabels(
        value
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter((item) => serviceKnowledgeTitles.includes(item as (typeof serviceKnowledgeTitles)[number])),
      )
    : [];

export const POST = async (request: Request) => {
  if (!hasOpenAiEnv()) {
    return NextResponse.json(
      {
        message:
          "OpenAI is not configured. Add OPENAI_API_KEY to enable the AI intake assistant.",
      },
      { status: 500 },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      {
        message: "Invalid assistant request.",
      },
      { status: 400 },
    );
  }

  const intakeType = getStringField(formData, "intakeType");

  if (intakeType !== "employer" && intakeType !== "jobSeeker") {
    return NextResponse.json(
      {
        message: "Unsupported assistant mode.",
      },
      { status: 400 },
    );
  }

  const message = getStringField(formData, "message");
  const currentValuesPayload = safeParseJson(getStringField(formData, "currentValues"));
  const resumeEntry = formData.get("resume");
  const resumeFile = resumeEntry instanceof File ? resumeEntry : null;

  if (!message.trim() && !resumeFile) {
    return NextResponse.json(
      {
        message:
          "Paste a hiring brief or resume summary, or attach a resume file first.",
      },
      { status: 400 },
    );
  }

  if (message.trim().length > intakeAssistantMaxMessageChars) {
    await logAiUsageEvent({
      contextLabel: intakeType,
      errorMessage: `Input exceeded ${intakeAssistantMaxMessageChars} characters.`,
      feature: "intake_assistant",
      inputCharacters: message.trim().length,
      model: openAiDefaultModel,
      status: "rejected",
    });

    return NextResponse.json(
      {
        message: `Keep the AI assistant note under ${intakeAssistantMaxMessageChars} characters.`,
      },
      { status: 400 },
    );
  }

  if (resumeFile) {
    const resumeValidation = validateResumeMetadata({
      name: resumeFile.name,
      size: resumeFile.size,
      type: resumeFile.type,
    });

    if (resumeValidation.error) {
      return NextResponse.json(
        {
          message: resumeValidation.error,
        },
        { status: 400 },
      );
    }
  }

  const clientIp = getClientIpAddress(request);
  const rateLimit = checkRateLimit({
    bucketKey: `intake-assistant:${clientIp}`,
    maxRequests: intakeAssistantRateLimitMax,
    windowMs: intakeAssistantRateLimitWindowMs,
  });

  if (rateLimit.limited) {
    await logAiUsageEvent({
      contextLabel: intakeType,
      errorMessage: "Rate limit exceeded.",
      feature: "intake_assistant",
      inputCharacters: message.trim().length,
      model: openAiDefaultModel,
      status: "rate_limited",
    });

    return NextResponse.json(
      {
        message: `Too many AI assistant requests. Please wait ${rateLimit.retryAfterSeconds} seconds and try again.`,
      },
      {
        headers: {
          "Retry-After": rateLimit.retryAfterSeconds.toString(),
        },
        status: 429,
      },
    );
  }

  const inputContent: Array<Record<string, string>> = [
    {
      text: buildUserPrompt({
        currentValues: currentValuesPayload,
        hasResumeFile: Boolean(resumeFile),
        message,
        mode: intakeType,
      }),
      type: "input_text",
    },
  ];

  if (resumeFile) {
    inputContent.unshift({
      file_data: await buildResumeFileDataUrl(resumeFile),
      filename: resumeFile.name,
      type: "input_file",
    });
  }

  try {
    const openAiResponse = await fetch(openAiResponsesUrl, {
      body: JSON.stringify({
        input: [
          {
            content: [
              {
                text: buildSystemPrompt(intakeType),
                type: "input_text",
              },
            ],
            role: "system",
          },
          {
            content: inputContent,
            role: "user",
          },
        ],
        max_output_tokens: intakeAssistantMaxOutputTokens,
        model: openAiDefaultModel,
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
        contextLabel: intakeType,
        errorMessage: apiErrorMessage,
        feature: "intake_assistant",
        inputCharacters: message.trim().length,
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
      const usage = getAiUsageFromResponse(rawPayload);

      await logAiUsageEvent({
        contextLabel: intakeType,
        errorMessage: "Unreadable assistant response payload.",
        feature: "intake_assistant",
        inputCharacters: message.trim().length,
        inputTokens: usage.inputTokens,
        model: openAiDefaultModel,
        outputCharacters: outputText.length,
        outputTokens: usage.outputTokens,
        responseId: getAiResponseId(rawPayload),
        status: "error",
        totalTokens: usage.totalTokens,
      });

      return NextResponse.json(
        {
          message:
            "The AI assistant returned an unreadable response. Please try again with a shorter brief.",
        },
        { status: 502 },
      );
    }

    const assistantMessage =
      readString(parsedOutput.assistantMessage) ||
      "I filled what I could. Please review the form and complete any remaining required details.";
    const serviceAnswer = readString(parsedOutput.serviceAnswer);
    const relatedServiceLabels = readRelatedServiceLabels(
      parsedOutput.relatedServiceLabels,
    );
    const usage = getAiUsageFromResponse(rawPayload);

    await logAiUsageEvent({
      contextLabel: intakeType,
      feature: "intake_assistant",
      inputCharacters: message.trim().length,
      inputTokens: usage.inputTokens,
      model: openAiDefaultModel,
      outputCharacters: assistantMessage.length + serviceAnswer.length,
      outputTokens: usage.outputTokens,
      responseId: getAiResponseId(rawPayload),
      status: "success",
      totalTokens: usage.totalTokens,
    });

    if (intakeType === "employer") {
      const currentValues = sanitizeEmployerAssistantValues(currentValuesPayload);
      const suggestedValues = sanitizeEmployerAssistantValues(
        parsedOutput.suggestedValues,
      );
      const mergedValues = mergeEmployerAssistantValues(
        currentValues,
        suggestedValues,
      );
      const responsePayload: IntakeAssistantResponseMap["employer"] = {
        appliedFieldLabels: getEmployerAssistantAppliedFieldLabels(
          suggestedValues,
        ),
        assistantMessage,
        missingFieldLabels: getEmployerAssistantMissingFieldLabels(mergedValues),
        relatedServiceLabels,
        serviceAnswer,
        suggestedValues,
      };

      return NextResponse.json(responsePayload);
    }

    const currentValues = sanitizeJobSeekerAssistantValues(currentValuesPayload);
    const suggestedValues = sanitizeJobSeekerAssistantValues(
      parsedOutput.suggestedValues,
    );
    const mergedValues = mergeJobSeekerAssistantValues(
      currentValues,
      suggestedValues,
    );
    const missingFieldLabels = getJobSeekerAssistantMissingFieldLabels(mergedValues);

    if (!resumeFile) {
      missingFieldLabels.push("Resume");
    }

    const responsePayload: IntakeAssistantResponseMap["jobSeeker"] = {
      appliedFieldLabels: getJobSeekerAssistantAppliedFieldLabels(
        suggestedValues,
      ),
      assistantMessage,
      missingFieldLabels: dedupeLabels(missingFieldLabels),
      relatedServiceLabels,
      serviceAnswer,
      suggestedValues,
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Intake assistant request failed:", error);

    await logAiUsageEvent({
      contextLabel: intakeType,
      errorMessage:
        error instanceof Error ? error.message : "Unexpected intake assistant error.",
      feature: "intake_assistant",
      inputCharacters: message.trim().length,
      model: openAiDefaultModel,
      status: "error",
    });

    return NextResponse.json(
      {
        message:
          "The AI intake assistant is unavailable right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
};
