export type AdminAiUsageRecord = {
  contextLabel: string;
  createdAt: string;
  createdAtLabel: string;
  errorMessage: string;
  feature: string;
  featureLabel: string;
  id: string;
  inputCharacters: number;
  inputTokens: number;
  model: string;
  outputCharacters: number;
  outputTokens: number;
  responseId: string;
  status: string;
  statusLabel: string;
  totalTokens: number;
};

export type AdminAiUsageSummary = {
  failedRequests: number;
  intakeAssistantRequests: number;
  last24HoursRequests: number;
  latestUsageLabel: string | null;
  outputTokens: number;
  rateLimitedRequests: number;
  serviceChatRequests: number;
  successfulRequests: number;
  totalRequests: number;
  totalTokens: number;
  windowLabel: string;
  inputTokens: number;
};
