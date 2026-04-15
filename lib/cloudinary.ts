import "server-only";
import { createHash, randomUUID } from "node:crypto";
import type { ResumeExtension } from "./job-seeker-inquiries";

type UploadResumeToCloudinaryArgs = {
  contentType: string;
  extension: ResumeExtension;
  fileBytes: Uint8Array;
  fileName: string;
};

type CloudinaryUploadResponse = {
  error?: {
    message?: string;
  };
  bytes?: number;
  public_id?: string;
  resource_type?: string;
  secure_url?: string;
};

type ParsedCloudinaryAsset = {
  format: string;
  publicId: string;
  resourceType: string;
  type: string;
};

const getCloudinaryEnv = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary environment variables. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  return {
    apiKey,
    apiSecret,
    cloudName,
    folder:
      process.env.CLOUDINARY_RESUME_FOLDER?.trim() || "job-seeker-resumes",
  };
};

export const hasCloudinaryEnv = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );

const signCloudinaryParams = (
  params: Record<string, string>,
  apiSecret: string,
) => {
  const serializedParams = Object.entries(params)
    .filter(([, value]) => value)
    .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${serializedParams}${apiSecret}`)
    .digest("hex");
};

const parseCloudinaryAssetFromUrl = (
  assetUrl: string,
): ParsedCloudinaryAsset | null => {
  try {
    const { cloudName } = getCloudinaryEnv();
    const url = new URL(assetUrl);
    const pathSegments = url.pathname.split("/").filter(Boolean);

    if (
      url.hostname !== "res.cloudinary.com" ||
      pathSegments.length < 5 ||
      pathSegments[0] !== cloudName
    ) {
      return null;
    }

    const [, resourceType, type, ...assetSegmentsWithVersion] = pathSegments;
    const assetSegments =
      assetSegmentsWithVersion[0]?.match(/^v\d+$/)
        ? assetSegmentsWithVersion.slice(1)
        : assetSegmentsWithVersion;
    const lastSegment = assetSegments.at(-1);

    if (!lastSegment || !lastSegment.includes(".")) {
      return null;
    }

    const format = lastSegment.split(".").pop()?.trim().toLowerCase();

    if (!format) {
      return null;
    }

    const publicIdSegments = [...assetSegments];

    if (resourceType !== "raw") {
      publicIdSegments[publicIdSegments.length - 1] = lastSegment.replace(
        /\.[^.]+$/,
        "",
      );
    }

    return {
      format,
      publicId: publicIdSegments.join("/"),
      resourceType,
      type,
    };
  } catch {
    return null;
  }
};

export const getCloudinaryAssetFromUrl = (assetUrl: string) =>
  parseCloudinaryAssetFromUrl(assetUrl);

export const createCloudinaryPrivateDownloadUrl = (
  assetUrl: string,
  options?: {
    attachment?: boolean;
    expiresAt?: number;
  },
) => {
  const { apiKey, apiSecret, cloudName } = getCloudinaryEnv();
  const parsedAsset = parseCloudinaryAssetFromUrl(assetUrl);

  if (!parsedAsset) {
    throw new Error("Invalid Cloudinary asset URL.");
  }

  const timestamp = `${Math.floor(Date.now() / 1000)}`;
  const queryParams: Record<string, string> = {
    format: parsedAsset.format,
    public_id: parsedAsset.publicId,
    timestamp,
    type: parsedAsset.type,
  };

  if (options?.attachment) {
    queryParams.attachment = "true";
  }

  if (options?.expiresAt) {
    queryParams.expires_at = `${options.expiresAt}`;
  }

  const signature = signCloudinaryParams(queryParams, apiSecret);
  const searchParams = new URLSearchParams({
    ...queryParams,
    api_key: apiKey,
    signature,
  });

  return `https://api.cloudinary.com/v1_1/${cloudName}/${parsedAsset.resourceType}/download?${searchParams.toString()}`;
};

export const createCloudinaryResumeAccessUrl = (
  assetUrl: string,
  options?: {
    attachment?: boolean;
    expiresAt?: number;
  },
) => {
  const trimmedAssetUrl = assetUrl.trim();

  if (!trimmedAssetUrl) {
    throw new Error("Cloudinary asset URL is required.");
  }

  // Resume files can be blocked from public raw delivery, so always use a signed URL.
  return createCloudinaryPrivateDownloadUrl(trimmedAssetUrl, options);
};

export const uploadResumeToCloudinary = async ({
  contentType,
  extension,
  fileBytes,
  fileName,
}: UploadResumeToCloudinaryArgs) => {
  const { apiKey, apiSecret, cloudName, folder } = getCloudinaryEnv();
  const timestamp = `${Math.floor(Date.now() / 1000)}`;
  const publicId = `resume-${randomUUID()}.${extension}`;
  const signature = signCloudinaryParams(
    {
      folder,
      public_id: publicId,
      timestamp,
    },
    apiSecret,
  );
  const formData = new FormData();

  formData.set(
    "file",
    new File([Buffer.from(fileBytes)], fileName, { type: contentType }),
  );
  formData.set("api_key", apiKey);
  formData.set("folder", folder);
  formData.set("public_id", publicId);
  formData.set("signature", signature);
  formData.set("timestamp", timestamp);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    {
      body: formData,
      method: "POST",
    },
  );
  const payload = (await response.json().catch(() => null)) as
    | CloudinaryUploadResponse
    | null;

  if (!response.ok || !payload?.secure_url || !payload.public_id) {
    const cloudinaryMessage = payload?.error?.message?.trim();

    throw new Error(
      cloudinaryMessage
        ? `Cloudinary upload failed: ${cloudinaryMessage}`
        : "Cloudinary upload failed.",
    );
  }

  return {
    bytes: Number(payload.bytes) || fileBytes.byteLength,
    extension,
    publicId: payload.public_id,
    resourceType: payload.resource_type ?? "raw",
    secureUrl: payload.secure_url,
  };
};

export const deleteCloudinaryUpload = async (publicId: string) => {
  const { apiKey, apiSecret, cloudName } = getCloudinaryEnv();
  const timestamp = `${Math.floor(Date.now() / 1000)}`;
  const signature = signCloudinaryParams(
    {
      public_id: publicId,
      timestamp,
      type: "upload",
    },
    apiSecret,
  );
  const formData = new FormData();

  formData.set("api_key", apiKey);
  formData.set("invalidate", "true");
  formData.set("public_id", publicId);
  formData.set("signature", signature);
  formData.set("timestamp", timestamp);
  formData.set("type", "upload");

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/destroy`, {
    body: formData,
    method: "POST",
  });
};
