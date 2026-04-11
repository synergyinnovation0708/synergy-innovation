"use client";

import { MessageSquareText, Sparkles, WandSparkles } from "lucide-react";
import { useState } from "react";
import type { EmployerInquiryFormValues } from "@/lib/employer-inquiries";
import {
  employerAssistantFieldNames,
  jobSeekerAssistantFieldNames,
  type IntakeAssistantResponseMap,
} from "@/lib/intake-assistant";
import type { JobSeekerFormValues } from "@/lib/job-seeker-inquiries";

type CommonProps = {
  className?: string;
  disabled?: boolean;
};

type EmployerAssistantCardProps = CommonProps & {
  currentValues: EmployerInquiryFormValues;
  mode: "employer";
  onApplySuggestedValues: (values: EmployerInquiryFormValues) => void;
};

type JobSeekerAssistantCardProps = CommonProps & {
  currentValues: JobSeekerFormValues;
  mode: "jobSeeker";
  onApplySuggestedValues: (values: JobSeekerFormValues) => void;
  resumeFile?: File | null;
  resumeLabel?: string | null;
};

type IntakeAssistantCardProps =
  | EmployerAssistantCardProps
  | JobSeekerAssistantCardProps;

type ChatTurn = {
  role: "assistant" | "user";
  text: string;
};

type AssistantInsight = {
  appliedFieldLabels: string[];
  missingFieldLabels: string[];
  relatedServiceLabels: string[];
  serviceAnswer: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const cardCopy = {
  employer: {
    helperText:
      "Paste hiring brief, JD, ya quick requirements. Assistant form ko fill karega aur Synergy services ya products ke bare mein bhi batayega.",
    placeholder:
      "Example: We need 4 backend engineers in Bangalore and Pune for a 6 month contract. Also tell me if you support RPO or ATS development.",
    title: "AI Hiring Assistant",
  },
  jobSeeker: {
    helperText:
      "Resume summary paste karein ya selected resume ke saath short note bhejein. Assistant candidate fields ko autofill karega aur relevant services bhi explain kar sakta hai.",
    placeholder:
      "Example: I am a Java developer with 3 years of experience in Spring Boot, Microservices, and AWS. Please fill my profile and tell me about your IT services.",
    title: "AI Resume Assistant",
  },
} as const;

const getCurrentValuesPayload = (props: IntakeAssistantCardProps) => {
  if (props.mode === "employer") {
    return employerAssistantFieldNames.reduce<Record<string, string | string[]>>(
      (payload, fieldName) => {
        payload[fieldName] = props.currentValues[fieldName];
        return payload;
      },
      {},
    );
  }

  return jobSeekerAssistantFieldNames.reduce<Record<string, string>>(
    (payload, fieldName) => {
      payload[fieldName] = props.currentValues[fieldName];
      return payload;
    },
    {},
  );
};

export const IntakeAssistantCard = (props: IntakeAssistantCardProps) => {
  const copy = cardCopy[props.mode];
  const [inputValue, setInputValue] = useState("");
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);
  const [insight, setInsight] = useState<AssistantInsight | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedInput = inputValue.trim();
    const hasResumeFile =
      props.mode === "jobSeeker" ? Boolean(props.resumeFile) : false;

    if (!trimmedInput && !hasResumeFile) {
      setStatusMessage(
        props.mode === "jobSeeker"
          ? "Resume attach karein ya profile note paste karein."
          : "Hiring brief ya recruiter note paste karein.",
      );
      return;
    }

    const submittedMessage =
      trimmedInput ||
      (props.mode === "jobSeeker"
        ? "Use my selected resume to autofill the job seeker form."
        : "Use the provided details to autofill the employer form.");

    setStatusMessage(null);
    setIsLoading(true);

    try {
      const payload = new FormData();

      payload.set("intakeType", props.mode);
      payload.set("message", trimmedInput);
      payload.set(
        "currentValues",
        JSON.stringify(getCurrentValuesPayload(props)),
      );

      if (props.mode === "jobSeeker" && props.resumeFile) {
        payload.set("resume", props.resumeFile);
      }

      const response = await fetch("/api/intake-assistant", {
        body: payload,
        method: "POST",
      });
      const data = (await response.json().catch(() => null)) as unknown;

      if (!response.ok) {
        setStatusMessage(
          isRecord(data) && typeof data.message === "string"
            ? data.message
            : "AI assistant se response nahi mila. Thodi der baad try karein.",
        );
        return;
      }

      if (
        !isRecord(data) ||
        typeof data.assistantMessage !== "string" ||
        !Array.isArray(data.appliedFieldLabels) ||
        !Array.isArray(data.missingFieldLabels) ||
        !Array.isArray(data.relatedServiceLabels) ||
        typeof data.serviceAnswer !== "string" ||
        !("suggestedValues" in data)
      ) {
        setStatusMessage(
          "Assistant response samajh nahi aaya. Please short brief ke saath phir try karein.",
        );
        return;
      }

      setChatTurns((currentTurns) => [
        ...currentTurns,
        {
          role: "user",
          text: submittedMessage,
        },
        {
          role: "assistant",
          text: [
            (data as IntakeAssistantResponseMap["employer"] | IntakeAssistantResponseMap["jobSeeker"])
              .serviceAnswer,
            (data as IntakeAssistantResponseMap["employer"] | IntakeAssistantResponseMap["jobSeeker"])
              .assistantMessage,
          ]
            .filter((value) => value.trim().length > 0)
            .join("\n\n"),
        },
      ]);

      if (props.mode === "employer") {
        const result = data as IntakeAssistantResponseMap["employer"];

        props.onApplySuggestedValues(
          result.suggestedValues,
        );
      } else {
        const result = data as IntakeAssistantResponseMap["jobSeeker"];

        props.onApplySuggestedValues(
          result.suggestedValues,
        );
      }

      setInsight({
        appliedFieldLabels:
          (data as IntakeAssistantResponseMap["employer"] | IntakeAssistantResponseMap["jobSeeker"])
            .appliedFieldLabels,
        missingFieldLabels:
          (data as IntakeAssistantResponseMap["employer"] | IntakeAssistantResponseMap["jobSeeker"])
            .missingFieldLabels,
        relatedServiceLabels:
          (data as IntakeAssistantResponseMap["employer"] | IntakeAssistantResponseMap["jobSeeker"])
            .relatedServiceLabels,
        serviceAnswer:
          (data as IntakeAssistantResponseMap["employer"] | IntakeAssistantResponseMap["jobSeeker"])
            .serviceAnswer,
      });
      setInputValue("");
      setStatusMessage("Suggested details were applied to the form.");
    } catch {
      setStatusMessage("Network error aa gaya. Please ek baar phir try karein.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className={`rounded-[28px] border border-[#dbe6f2] bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_100%)] p-5 shadow-[0_16px_36px_rgba(29,34,63,0.06)] ${props.className ?? ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[640px]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef8ff] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
            <Sparkles className="h-3.5 w-3.5" />
            Conversational Autofill
          </div>
          <h3 className="mt-3 text-[22px] font-bold leading-[1.2] text-[#1d223f]">
            {copy.title}
          </h3>
          <p className="mt-2 text-[14px] leading-[1.7] text-[#67728f]">
            {copy.helperText}
          </p>
        </div>

        {props.mode === "jobSeeker" && props.resumeLabel ? (
          <div className="rounded-full border border-[#dbe6f2] bg-white px-4 py-2 text-[13px] font-medium text-[#1d223f]">
            Resume ready: {props.resumeLabel}
          </div>
        ) : null}
      </div>

      {chatTurns.length > 0 ? (
        <div className="mt-5 space-y-3">
          {chatTurns.map((turn, index) => (
            <div
              key={`${turn.role}-${index + 1}`}
              className={`rounded-[22px] px-4 py-3 text-[14px] leading-[1.7] ${
                turn.role === "assistant"
                  ? "border border-[#dbe6f2] bg-white text-[#1d223f]"
                  : "bg-[#1d223f] text-white"
              }`}
            >
              <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em]">
                {turn.role === "assistant" ? (
                  <WandSparkles className="h-3.5 w-3.5" />
                ) : (
                  <MessageSquareText className="h-3.5 w-3.5" />
                )}
                {turn.role === "assistant" ? "Assistant" : "You"}
              </div>
              <p>{turn.text}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-5">
        <label className="text-[14px] font-semibold text-[#1d223f]">
          Brief / note for assistant
        </label>
        <textarea
          value={inputValue}
          disabled={props.disabled || isLoading}
          placeholder={copy.placeholder}
          className="mt-2 min-h-[124px] w-full rounded-[20px] border border-[#dbe6f2] bg-white px-4 py-3 text-[15px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8b96b2] focus:border-[#00adef]"
          onChange={(event) => setInputValue(event.target.value)}
        />
      </div>

      {insight ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {insight.relatedServiceLabels.length > 0 || insight.serviceAnswer ? (
            <div className="rounded-[20px] bg-white p-4 lg:col-span-2">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
                Service Info
              </p>
              {insight.relatedServiceLabels.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {insight.relatedServiceLabels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-[#eef8ff] px-3 py-1.5 text-[13px] font-medium text-[#1d223f]"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              ) : null}
              {insight.serviceAnswer ? (
                <p className="mt-3 text-[14px] leading-[1.7] text-[#4f5d7a]">
                  {insight.serviceAnswer}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="rounded-[20px] bg-white p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
              Autofilled
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {insight.appliedFieldLabels.length > 0 ? (
                insight.appliedFieldLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-[#eef8ff] px-3 py-1.5 text-[13px] font-medium text-[#1d223f]"
                  >
                    {label}
                  </span>
                ))
              ) : (
                <p className="text-[14px] text-[#67728f]">
                  Abhi koi reliable field extract nahi hua.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[20px] bg-white p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
              Still Needed
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {insight.missingFieldLabels.length > 0 ? (
                insight.missingFieldLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-[#fff6e8] px-3 py-1.5 text-[13px] font-medium text-[#8a5a00]"
                  >
                    {label}
                  </span>
                ))
              ) : (
                <p className="text-[14px] text-[#15803d]">
                  Required fields kaafi had tak complete lag rahe hain.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {statusMessage ? (
        <p
          className={`mt-4 text-[14px] font-medium ${
            statusMessage.includes("apply") || statusMessage.includes("Suggested")
              ? "text-[#15803d]"
              : "text-[#dc2626]"
          }`}
        >
          {statusMessage}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={props.disabled || isLoading}
          className="inline-flex items-center gap-2 rounded-full bg-[#1d223f] px-5 py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-[#2a3158] disabled:cursor-not-allowed disabled:opacity-70"
          onClick={handleSubmit}
        >
          <Sparkles className="h-4 w-4" />
          {isLoading ? "Thinking..." : "Ask AI & Autofill"}
        </button>

        {props.mode === "jobSeeker" ? (
          <p className="text-[13px] leading-[1.6] text-[#67728f]">
            Resume selected ho to assistant usse bhi read karega.
          </p>
        ) : (
          <p className="text-[13px] leading-[1.6] text-[#67728f]">
            Recruitment, IT services, branding, ATS, ya AI products ke bare mein bhi pooch sakte ho.
          </p>
        )}
      </div>
    </section>
  );
};
