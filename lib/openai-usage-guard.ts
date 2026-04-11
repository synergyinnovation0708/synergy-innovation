type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitBucket>();

export const readPositiveIntegerEnv = (
  rawValue: string | undefined,
  fallbackValue: number,
) => {
  const parsedValue = Number.parseInt(rawValue?.trim() ?? "", 10);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallbackValue;
};

export const getClientIpAddress = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for")?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim();

  if (cloudflareIp) {
    return cloudflareIp;
  }

  if (realIp) {
    return realIp;
  }

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return "unknown";
};

export const checkRateLimit = ({
  bucketKey,
  maxRequests,
  windowMs,
}: {
  bucketKey: string;
  maxRequests: number;
  windowMs: number;
}) => {
  const now = Date.now();
  const currentBucket = rateLimitStore.get(bucketKey);

  if (!currentBucket || currentBucket.resetAt <= now) {
    rateLimitStore.set(bucketKey, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      limited: false,
      remaining: Math.max(maxRequests - 1, 0),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (currentBucket.count >= maxRequests) {
    return {
      limited: true,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((currentBucket.resetAt - now) / 1000),
      ),
    };
  }

  currentBucket.count += 1;
  rateLimitStore.set(bucketKey, currentBucket);

  return {
    limited: false,
    remaining: Math.max(maxRequests - currentBucket.count, 0),
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((currentBucket.resetAt - now) / 1000),
    ),
  };
};

export const normalizePromptText = (value: string, maxChars: number) =>
  value.replace(/\s+/g, " ").trim().slice(0, maxChars).trim();

export const stringifyForPrompt = (value: unknown, maxChars: number) =>
  normalizePromptText(JSON.stringify(value, null, 2), maxChars);

export const trimMessagesToTotalChars = <T>(
  items: readonly T[],
  maxChars: number,
  getLength: (item: T) => number,
) => {
  const keptItems: T[] = [];
  let totalChars = 0;

  for (let index = items.length - 1; index >= 0; index -= 1) {
    const item = items[index];
    const itemLength = getLength(item);

    if (itemLength <= 0) {
      continue;
    }

    if (totalChars + itemLength > maxChars) {
      break;
    }

    keptItems.unshift(item);
    totalChars += itemLength;
  }

  return keptItems;
};
