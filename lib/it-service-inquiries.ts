export const itServiceOptions = [
  "Website Development",
  "Mobile App Development",
  "Custom Software Development",
  "ERP Development",
  "CRM Development",
  "UI/UX Designing",
  "Game Development",
  "SEO & SEM",
  "PPC & Performance Marketing",
  "AI Integration & Development",
] as const;

export const itServiceInquiryStatuses = [
  "pending",
  "contacted",
  "closed",
] as const;

export type ITServiceInquiryFormValues = {
  businessEmail: string;
  companyName: string;
  contact: string;
  name: string;
  projectBrief: string;
  serviceRequired: string;
};

export type ITServiceInquiryFieldName = keyof ITServiceInquiryFormValues;

export type ITServiceInquiryStatus =
  (typeof itServiceInquiryStatuses)[number];

export type ITServiceInquiryValidationErrors = Partial<
  Record<ITServiceInquiryFieldName, string>
>;

export type ITServiceInquiryRecord = {
  business_email: string;
  company_name: string;
  contact_number: string;
  full_name: string;
  project_brief: string;
  service_required: string;
  status: ITServiceInquiryStatus;
};

export const itServiceInquiryInitialValues: ITServiceInquiryFormValues = {
  businessEmail: "",
  companyName: "",
  contact: "",
  name: "",
  projectBrief: "",
  serviceRequired: "",
};

const professionalEmailBlockedDomains = new Set([
  "aol.com",
  "gmail.com",
  "gmx.com",
  "googlemail.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "mail.com",
  "msn.com",
  "outlook.com",
  "pm.me",
  "protonmail.com",
  "rediffmail.com",
  "yahoo.com",
  "ymail.com",
]);

const itServiceOptionMap = new Map(
  itServiceOptions.map((service) => [service.toLowerCase(), service]),
);

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const normalizeService = (value: string) =>
  itServiceOptionMap.get(normalizeText(value).toLowerCase()) ?? normalizeText(value);

const isProfessionalEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return false;
  }

  const [, domain = ""] = email.split("@");

  return !professionalEmailBlockedDomains.has(domain.toLowerCase());
};

export const normalizeITServiceInquiryValues = (
  values: ITServiceInquiryFormValues,
): ITServiceInquiryFormValues => ({
  businessEmail: normalizeText(values.businessEmail).toLowerCase(),
  companyName: normalizeText(values.companyName),
  contact: values.contact.replace(/\D/g, ""),
  name: normalizeText(values.name),
  projectBrief: normalizeText(values.projectBrief),
  serviceRequired: normalizeService(values.serviceRequired),
});

export const validateITServiceInquiryValues = (
  values: ITServiceInquiryFormValues,
) => {
  const normalized = normalizeITServiceInquiryValues(values);
  const errors: ITServiceInquiryValidationErrors = {};

  if (!normalized.name) {
    errors.name = "Name is required.";
  }

  if (!normalized.businessEmail) {
    errors.businessEmail = "Business email is required.";
  } else if (!isProfessionalEmail(normalized.businessEmail)) {
    errors.businessEmail = "Enter a valid business email.";
  }

  if (!normalized.contact) {
    errors.contact = "Contact number is required.";
  } else if (normalized.contact.length < 10 || normalized.contact.length > 12) {
    errors.contact = "Contact number must be between 10 and 12 digits.";
  }

  if (!normalized.companyName) {
    errors.companyName = "Company name is required.";
  }

  if (!normalized.serviceRequired) {
    errors.serviceRequired = "Select a service.";
  } else if (
    !itServiceOptions.includes(
      normalized.serviceRequired as (typeof itServiceOptions)[number],
    )
  ) {
    errors.serviceRequired = "Select a valid service.";
  }

  if (normalized.projectBrief.length > 1000) {
    errors.projectBrief = "Project brief must be under 1000 characters.";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    isValid,
    normalized,
    record: isValid
      ? {
          business_email: normalized.businessEmail,
          company_name: normalized.companyName,
          contact_number: normalized.contact,
          full_name: normalized.name,
          project_brief: normalized.projectBrief,
          service_required: normalized.serviceRequired,
          status: "pending",
        }
      : null,
  };
};

export const isITServiceInquiryStatus = (
  status: string,
): status is ITServiceInquiryStatus =>
  itServiceInquiryStatuses.includes(status as ITServiceInquiryStatus);
