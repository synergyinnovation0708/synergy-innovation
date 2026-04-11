import {
  employerInquiryInitialValues,
  normalizeEmployerInquiryValues,
  validateEmployerInquiryValues,
  type EmployerInquiryFieldName,
  type EmployerInquiryFormValues,
} from "./employer-inquiries";
import {
  jobSeekerInquiryInitialValues,
  validateJobSeekerInquiryValues,
  type JobSeekerFieldName,
  type JobSeekerFormValues,
} from "./job-seeker-inquiries";

export type IntakeAssistantMode = "employer" | "jobSeeker";

export type IntakeAssistantSuggestedValuesMap = {
  employer: EmployerInquiryFormValues;
  jobSeeker: JobSeekerFormValues;
};

export type IntakeAssistantResponseMap = {
  [K in IntakeAssistantMode]: {
    appliedFieldLabels: string[];
    assistantMessage: string;
    missingFieldLabels: string[];
    relatedServiceLabels: string[];
    serviceAnswer: string;
    suggestedValues: IntakeAssistantSuggestedValuesMap[K];
  };
};

export const employerAssistantFieldNames = [
  "companyName",
  "yourName",
  "workEmail",
  "contact",
  "hiringRequirement",
  "hiringType",
  "hiringLocations",
  "numberOfPositions",
] as const satisfies readonly EmployerInquiryFieldName[];

export const jobSeekerAssistantFieldNames = [
  "name",
  "email",
  "contact",
  "currentPosition",
  "currentCompany",
] as const satisfies readonly Exclude<JobSeekerFieldName, "password" | "resume">[];

const employerAssistantFieldLabels: Record<EmployerInquiryFieldName, string> = {
  companyName: "Company name",
  contact: "Contact number",
  hiringLocations: "Hiring locations",
  hiringRequirement: "Hiring requirement",
  hiringType: "Hiring type",
  numberOfPositions: "Number of positions",
  workEmail: "Work email",
  yourName: "Your name",
};

const jobSeekerAssistantFieldLabels: Record<
  Exclude<JobSeekerFieldName, "password" | "resume">,
  string
> = {
  contact: "Contact number",
  currentCompany: "Current company / institute",
  currentPosition: "Current position",
  email: "Email",
  name: "Full name",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readString = (record: Record<string, unknown>, key: string) =>
  typeof record[key] === "string" ? record[key] : "";

const readStringArray = (record: Record<string, unknown>, key: string) =>
  Array.isArray(record[key])
    ? record[key]
        .map((value) => (typeof value === "string" ? value : ""))
        .filter((value) => value.trim().length > 0)
    : [];

export const isMeaningfulAssistantValue = (value: unknown) => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return false;
};

export const sanitizeEmployerAssistantValues = (value: unknown) => {
  const record = isRecord(value) ? value : {};

  return normalizeEmployerInquiryValues({
    companyName: readString(record, "companyName"),
    contact: readString(record, "contact"),
    hiringLocations: readStringArray(record, "hiringLocations"),
    hiringRequirement: readString(record, "hiringRequirement"),
    hiringType: readString(record, "hiringType"),
    numberOfPositions: readString(record, "numberOfPositions"),
    workEmail: readString(record, "workEmail"),
    yourName: readString(record, "yourName"),
  });
};

export const sanitizeJobSeekerAssistantValues = (value: unknown) => {
  const record = isRecord(value) ? value : {};

  return validateJobSeekerInquiryValues({
    contact: readString(record, "contact"),
    currentCompany: readString(record, "currentCompany"),
    currentPosition: readString(record, "currentPosition"),
    email: readString(record, "email"),
    name: readString(record, "name"),
    password: "",
  }).normalized;
};

export const mergeEmployerAssistantValues = (
  currentValues: EmployerInquiryFormValues,
  suggestedValues: EmployerInquiryFormValues,
) =>
  normalizeEmployerInquiryValues({
    ...currentValues,
    companyName: suggestedValues.companyName || currentValues.companyName,
    contact: suggestedValues.contact || currentValues.contact,
    hiringLocations:
      suggestedValues.hiringLocations.length > 0
        ? suggestedValues.hiringLocations
        : currentValues.hiringLocations,
    hiringRequirement:
      suggestedValues.hiringRequirement || currentValues.hiringRequirement,
    hiringType: suggestedValues.hiringType || currentValues.hiringType,
    numberOfPositions:
      suggestedValues.numberOfPositions || currentValues.numberOfPositions,
    workEmail: suggestedValues.workEmail || currentValues.workEmail,
    yourName: suggestedValues.yourName || currentValues.yourName,
  });

export const mergeJobSeekerAssistantValues = (
  currentValues: JobSeekerFormValues,
  suggestedValues: JobSeekerFormValues,
) => {
  const mergedValues = {
    ...currentValues,
    contact: suggestedValues.contact || currentValues.contact,
    currentCompany: suggestedValues.currentCompany || currentValues.currentCompany,
    currentPosition:
      suggestedValues.currentPosition || currentValues.currentPosition,
    email: suggestedValues.email || currentValues.email,
    name: suggestedValues.name || currentValues.name,
  };

  return {
    ...validateJobSeekerInquiryValues(mergedValues).normalized,
    password: currentValues.password,
  };
};

const getAppliedFieldLabels = <FieldName extends string>(
  labels: Record<FieldName, string>,
  fieldNames: readonly FieldName[],
  values: Record<FieldName, string | string[]>,
) =>
  fieldNames
    .filter((fieldName) => isMeaningfulAssistantValue(values[fieldName]))
    .map((fieldName) => labels[fieldName]);

export const getEmployerAssistantAppliedFieldLabels = (
  values: EmployerInquiryFormValues,
) =>
  getAppliedFieldLabels(
    employerAssistantFieldLabels,
    employerAssistantFieldNames,
    values,
  );

export const getJobSeekerAssistantAppliedFieldLabels = (
  values: JobSeekerFormValues,
) =>
  getAppliedFieldLabels(
    jobSeekerAssistantFieldLabels,
    jobSeekerAssistantFieldNames,
    values,
  );

const mapMissingFieldLabels = <FieldName extends string>(
  errors: Partial<Record<FieldName, string>>,
  labels: Record<FieldName, string>,
) =>
  Object.keys(errors)
    .map((fieldName) => labels[fieldName as FieldName])
    .filter((label): label is string => Boolean(label));

export const getEmployerAssistantMissingFieldLabels = (
  values: EmployerInquiryFormValues,
) =>
  mapMissingFieldLabels(
    validateEmployerInquiryValues(values).errors,
    employerAssistantFieldLabels,
  );

export const getJobSeekerAssistantMissingFieldLabels = (
  values: JobSeekerFormValues,
) => {
  const { errors } = validateJobSeekerInquiryValues(values);
  const filteredErrors = { ...errors };

  delete filteredErrors.password;
  delete filteredErrors.resume;

  return mapMissingFieldLabels(filteredErrors, jobSeekerAssistantFieldLabels);
};

export const intakeAssistantInitialValues = {
  employer: employerInquiryInitialValues,
  jobSeeker: jobSeekerInquiryInitialValues,
} as const satisfies IntakeAssistantSuggestedValuesMap;
