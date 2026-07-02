"use client";

import {
  SendHorizonal,
  Sparkles,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { serviceKnowledgeTitles } from "@/lib/service-knowledge";

type ChatTurn = {
  relatedServiceLabels?: string[];
  role: "assistant" | "user";
  text: string;
};

type ServiceChatbotCardProps = {
  headerEyebrow?: string;
  headerTitle?: string;
  initialAssistantMessage?: string;
  starterPrompts?: string[];
  teaserText?: string;
};

const serviceChatInputMaxChars = 500;

const defaultStarterPrompts = [
  "What job opportunities are available right now?",
  "How can you help me hire candidates quickly?",
  "Tell me about your IT services and AI offerings",
  "What is included in your branding services?",
];

const defaultInitialAssistantMessage =
  "Hi! I'm SynergyBot. You can ask me about jobs, hiring, IT services, branding, AI solutions, the AI IP Camera system, or the School Bus platform.";

export const ServiceChatbotCard = ({
  headerEyebrow = "Conversation with SynergyBot",
  headerTitle = "Interactive Service Assistant",
  initialAssistantMessage = defaultInitialAssistantMessage,
  starterPrompts = defaultStarterPrompts,
  teaserText = "Ask about Synergy services",
}: ServiceChatbotCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      role: "assistant",
      text: initialAssistantMessage,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [isLoading, isOpen, messages]);

  const sendMessage = async (messageText: string) => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    if (trimmedMessage.length > serviceChatInputMaxChars) {
      setStatusMessage(
        `Keep each chatbot message under ${serviceChatInputMaxChars} characters.`,
      );
      return;
    }

    const nextMessages = [
      ...messages,
      {
        role: "user" as const,
        text: trimmedMessage,
      },
    ];

    setMessages(nextMessages);
    setInputValue("");
    setStatusMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/service-chat", {
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            content: message.text,
            role: message.role,
          })),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json().catch(() => null)) as
        | {
            answer?: string;
            message?: string;
            relatedServiceLabels?: string[];
          }
        | null;

      if (!response.ok) {
        setStatusMessage(
          data?.message ??
            "The chatbot could not get a response. Please try again in a moment.",
        );
        setMessages(messages);
        return;
      }

      setMessages([
        ...nextMessages,
        {
          relatedServiceLabels: Array.isArray(data?.relatedServiceLabels)
            ? data.relatedServiceLabels
            : [],
          role: "assistant",
          text: data?.answer ?? "I can help with Synergy's available services.",
        },
      ]);
    } catch {
      setStatusMessage("A network error occurred. Please try again.");
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    void sendMessage(inputValue);
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-5 right-4 z-[140] w-[min(380px,calc(100vw-1.5rem))] overflow-hidden rounded-[28px] border border-[#d9e6ef] bg-white shadow-[0_28px_70px_rgba(18,30,61,0.24)] sm:bottom-6 sm:right-6">
          <div className="flex items-center justify-between gap-3 border-b border-[#edf2f8] bg-[linear-gradient(135deg,#f5fbff_0%,#ffffff_55%,#ecfaf6_100%)] px-5 py-4">
            <div className="min-w-0">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
                {headerEyebrow}
              </p>
              <p className="mt-1 text-[15px] font-semibold text-[#1d223f]">
                {headerTitle}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close chatbot"
              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#d9e6ef] bg-white text-[#1d223f] transition-colors duration-200 hover:bg-[#f6f9fc]"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="h-[420px] overflow-y-auto bg-[#fbfdff] px-4 py-4">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index + 1}`}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef8ff] text-[#00adef]">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  ) : null}

                  <div
                    className={`max-w-[78%] rounded-[20px] px-4 py-3 text-[14px] leading-[1.75] ${
                      message.role === "assistant"
                        ? "border border-[#dbe6f2] bg-white text-[#1d223f]"
                        : "bg-[#2d6f84] text-white shadow-[0_12px_26px_rgba(45,111,132,0.26)]"
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}

              {messages.length === 1 ? (
                <div className="pl-[52px]">
                  <div className="flex flex-wrap gap-2">
                    {starterPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        disabled={isLoading}
                        className="cursor-pointer rounded-full border border-[#dbe6f2] bg-white px-3 py-2 text-left text-[12px] font-medium text-[#1d223f] transition-colors duration-200 hover:bg-[#f5fbff] disabled:cursor-not-allowed disabled:opacity-70"
                        onClick={() => void sendMessage(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {isLoading ? (
                <div className="flex gap-3">
                  <div className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef8ff] text-[#00adef]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="rounded-[20px] border border-[#dbe6f2] bg-white px-4 py-3 text-[14px] text-[#67728f]">
                    SynergyBot is thinking...
                  </div>
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-[#edf2f8] bg-white px-4 py-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 rounded-[18px] border border-[#dbe6f2] bg-[#fbfdff] px-4 py-3">
                <input
                  value={inputValue}
                  disabled={isLoading}
                  maxLength={serviceChatInputMaxChars}
                  placeholder="Write your message here"
                  className="w-full border-0 bg-transparent text-[14px] text-[#1d223f] outline-none placeholder:text-[#8a96b2]"
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                type="button"
                aria-label="Send message"
                disabled={isLoading}
                className="inline-flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1d223f] text-white shadow-[0_18px_34px_rgba(29,34,63,0.24)] transition-colors duration-200 hover:bg-[#2a3158] disabled:cursor-not-allowed disabled:opacity-70"
                onClick={() => void sendMessage(inputValue)}
              >
                <SendHorizonal className="h-5 w-5" />
              </button>
            </div>
            {statusMessage ? (
              <p className="mt-3 text-[13px] font-medium text-[#dc2626]">
                {statusMessage}
              </p>
            ) : (
              <p className="mt-3 text-[12px] text-[#7a86a2]">
                Service information is available for{" "}
                {serviceKnowledgeTitles.length} Synergy offerings. Limit:{" "}
                {serviceChatInputMaxChars} characters per message.
              </p>
            )}
          </div>
        </div>
      ) : null}

      <div className="fixed bottom-5 right-4 z-[141] sm:bottom-6 sm:right-6">
        <button
          type="button"
          aria-label={isOpen ? "Chatbot open" : "Open chatbot"}
          className={`group inline-flex h-[74px] w-[74px] cursor-pointer items-center justify-center rounded-full border border-[#1d223f] bg-[#1d223f] text-white shadow-[0_22px_46px_rgba(29,34,63,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#2a3158] ${
            isOpen ? "pointer-events-none scale-90 opacity-0" : ""
          }`}
          onClick={() => setIsOpen(true)}
        >
          <img
            src="/icons/chatbot-icon.svg"
            alt=""
            aria-hidden="true"
            className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
          />
        </button>
        {!isOpen ? (
          <div className="pointer-events-none absolute -left-[184px] top-1/2 hidden -translate-y-1/2 rounded-full border border-[#dbe6f2] bg-white/96 px-4 py-2 text-[13px] font-medium text-[#1d223f] shadow-[0_12px_30px_rgba(18,30,61,0.12)] md:block">
            {teaserText}
          </div>
        ) : null}
      </div>
    </>
  );
};
