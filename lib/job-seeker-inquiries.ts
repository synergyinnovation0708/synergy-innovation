const allowedResumeExtensions = ["pdf", "doc", "docx"] as const;

const allowedResumeMimeTypes = new Set([
  "application/msword",
  "application/octet-stream",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const resumeFileAcceptAttribute =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const jobSeekerResumeMaxBytes = 5 * 1024 * 1024;
export const jobSeekerResumeHelpText = "Only PDF or Word files up to 5 MB.";
export const jobSeekerPasswordRequirementText =
  "Use 8-16 characters with at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";

export type ResumeExtension = (typeof allowedResumeExtensions)[number];

export type JobSeekerFormValues = {
  contact: string;
  currentCompany: string;
  currentPosition: string;
  email: string;
  name: string;
  password: string;
};

export type JobSeekerFieldName = keyof JobSeekerFormValues | "resume";

export type JobSeekerValidationErrors = Partial<
  Record<JobSeekerFieldName, string>
>;

export type JobSeekerInquiryRecord = {
  contact_number: string;
  current_company: string;
  current_position: string;
  email: string;
  full_name: string;
  resume_bytes: number;
  resume_content_type: string;
  resume_extension: ResumeExtension;
  resume_original_name: string;
  resume_public_id: string;
  resume_url: string;
};

export type ResumeValidationInput = {
  name: string;
  size: number;
  type?: string | null;
};

export const jobSeekerInquiryInitialValues: JobSeekerFormValues = {
  contact: "",
  currentCompany: "",
  currentPosition: "",
  email: "",
  name: "",
  password: "",
};

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])[^\s]{8,16}$/;

const formatBytesToMegabytes = (bytes: number) =>
  `${(bytes / (1024 * 1024)).toFixed(0)} MB`;

export const getResumeExtension = (fileName: string): ResumeExtension | null => {
  const extension = fileName.split(".").pop()?.trim().toLowerCase();

  if (!extension) {
    return null;
  }

  return allowedResumeExtensions.includes(extension as ResumeExtension)
    ? (extension as ResumeExtension)
    : null;
};

const getDefaultMimeTypeForResume = (extension: ResumeExtension) => {
  if (extension === "pdf") {
    return "application/pdf";
  }

  if (extension === "doc") {
    return "application/msword";
  }

  return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
};

export const normalizeJobSeekerInquiryValues = (
  values: JobSeekerFormValues,
): JobSeekerFormValues => ({
  contact: values.contact.replace(/\D/g, ""),
  currentCompany: normalizeText(values.currentCompany),
  currentPosition: normalizeText(values.currentPosition),
  email: normalizeText(values.email).toLowerCase(),
  name: normalizeText(values.name),
  password: values.password.trim(),
});

export const isJobSeekerPasswordValid = (password: string) =>
  passwordPattern.test(password.trim());

type ValidateJobSeekerInquiryOptions = {
  requirePassword?: boolean;
};

export const validateJobSeekerInquiryValues = (
  values: JobSeekerFormValues,
  options: ValidateJobSeekerInquiryOptions = {},
) => {
  const { requirePassword = false } = options;
  const normalized = normalizeJobSeekerInquiryValues(values);
  const errors: JobSeekerValidationErrors = {};

  if (!normalized.name) {
    errors.name = "Name is required.";
  }

  if (!normalized.email) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(normalized.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!normalized.contact) {
    errors.contact = "Contact number is required.";
  } else if (
    normalized.contact.length < 10 ||
    normalized.contact.length > 12
  ) {
    errors.contact = "Contact number must be between 10 and 12 digits.";
  }

  if (!normalized.currentPosition) {
    errors.currentPosition = "Current position is required.";
  }

  if (!normalized.currentCompany) {
    errors.currentCompany = "Current company is required.";
  }

  if (requirePassword || normalized.password) {
    if (!normalized.password) {
      errors.password = "Password is required.";
    } else if (!isJobSeekerPasswordValid(normalized.password)) {
      errors.password = jobSeekerPasswordRequirementText;
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    normalized,
    record: Object.keys(errors).length === 0
      ? {
          contact_number: normalized.contact,
          current_company: normalized.currentCompany,
          current_position: normalized.currentPosition,
          email: normalized.email,
          full_name: normalized.name,
        }
      : null,
  };
};

export const validateResumeMetadata = (file: ResumeValidationInput | null) => {
  if (!file) {
    return {
      error: "Resume is required.",
      extension: null,
      mimeType: null,
    };
  }

  const extension = getResumeExtension(file.name);

  if (!extension) {
    return {
      error: "Upload only PDF or Word files.",
      extension: null,
      mimeType: null,
    };
  }

  if (!file.size) {
    return {
      error: "Resume file is empty. Upload a valid file.",
      extension: null,
      mimeType: null,
    };
  }

  if (file.size > jobSeekerResumeMaxBytes) {
    return {
      error: `Resume must be ${formatBytesToMegabytes(jobSeekerResumeMaxBytes)} or smaller.`,
      extension: null,
      mimeType: null,
    };
  }

  const normalizedMimeType = file.type?.trim().toLowerCase() ?? "";

  if (normalizedMimeType && !allowedResumeMimeTypes.has(normalizedMimeType)) {
    return {
      error: "Upload only PDF or Word files.",
      extension: null,
      mimeType: null,
    };
  }

  return {
    error: null,
    extension,
    mimeType: normalizedMimeType || getDefaultMimeTypeForResume(extension),
  };
};

export const validateResumeFileBytes = (
  fileBytes: Uint8Array,
  fileName: string,
) => {
  const extension = getResumeExtension(fileName);

  if (!extension) {
    return {
      error: "Upload only PDF or Word files.",
      extension: null,
    };
  }

  if (extension === "pdf") {
    const isPdf =
      fileBytes.length >= 5 &&
      fileBytes[0] === 0x25 &&
      fileBytes[1] === 0x50 &&
      fileBytes[2] === 0x44 &&
      fileBytes[3] === 0x46 &&
      fileBytes[4] === 0x2d;

    return {
      error: isPdf ? null : "Resume content does not match a valid PDF file.",
      extension: isPdf ? extension : null,
    };
  }

  if (extension === "doc") {
    const isDoc =
      fileBytes.length >= 8 &&
      fileBytes[0] === 0xd0 &&
      fileBytes[1] === 0xcf &&
      fileBytes[2] === 0x11 &&
      fileBytes[3] === 0xe0 &&
      fileBytes[4] === 0xa1 &&
      fileBytes[5] === 0xb1 &&
      fileBytes[6] === 0x1a &&
      fileBytes[7] === 0xe1;

    return {
      error: isDoc ? null : "Resume content does not match a valid DOC file.",
      extension: isDoc ? extension : null,
    };
  }

  const isDocx =
    fileBytes.length >= 4 &&
    fileBytes[0] === 0x50 &&
    fileBytes[1] === 0x4b &&
    fileBytes[2] === 0x03 &&
    fileBytes[3] === 0x04;

  return {
    error: isDocx ? null : "Resume content does not match a valid DOCX file.",
    extension: isDocx ? extension : null,
  };
};
