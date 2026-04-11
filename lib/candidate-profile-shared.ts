export const candidateGenderOptions = [
  "Female",
  "Male",
  "Non-binary",
  "Prefer not to say",
] as const;

export const candidateNoticePeriodOptions = [
  "Immediate",
  "15 Days",
  "30 Days",
  "45 Days",
  "60 Days",
  "90 Days",
  "Serving Notice",
] as const;

export const candidateEmploymentTypeOptions = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
  "Freelance",
] as const;

export const candidateWorkModeOptions = [
  "On-site",
  "Hybrid",
  "Remote",
] as const;

export const candidateLanguageProficiencyOptions = [
  "Beginner",
  "Intermediate",
  "Professional",
  "Native / Bilingual",
] as const;

export const candidateEducationLevelOptions = [
  "High School",
  "Diploma",
  "Bachelor's",
  "Master's",
  "Doctorate",
  "Certification",
  "Other",
] as const;

export const candidateEmploymentHistoryItemInitialValue = () => ({
  companyName: "",
  currentlyWorking: false,
  description: "",
  designation: "",
  employmentType: "",
  endDate: "",
  location: "",
  startDate: "",
});

export type CandidateEmploymentHistoryItem = ReturnType<
  typeof candidateEmploymentHistoryItemInitialValue
>;

export const candidateEducationHistoryItemInitialValue = () => ({
  degree: "",
  educationLevel: "",
  endYear: "",
  gradingType: "",
  institution: "",
  score: "",
  specialization: "",
  startYear: "",
});

export type CandidateEducationHistoryItem = ReturnType<
  typeof candidateEducationHistoryItemInitialValue
>;

export const candidateItSkillItemInitialValue = () => ({
  experienceMonths: "",
  experienceYears: "",
  lastUsedYear: "",
  skill: "",
  version: "",
});

export type CandidateItSkillItem = ReturnType<
  typeof candidateItSkillItemInitialValue
>;

export const candidateProjectItemInitialValue = () => ({
  description: "",
  endDate: "",
  role: "",
  startDate: "",
  technologies: "",
  title: "",
});

export type CandidateProjectItem = ReturnType<
  typeof candidateProjectItemInitialValue
>;

export const candidateCertificationItemInitialValue = () => ({
  credentialId: "",
  issuer: "",
  name: "",
  year: "",
});

export type CandidateCertificationItem = ReturnType<
  typeof candidateCertificationItemInitialValue
>;

export const candidateProfessionalQualificationItemInitialValue = () => ({
  institution: "",
  title: "",
  year: "",
});

export type CandidateProfessionalQualificationItem = ReturnType<
  typeof candidateProfessionalQualificationItemInitialValue
>;

export const candidateLanguageItemInitialValue = () => ({
  language: "",
  proficiency: "",
});

export type CandidateLanguageItem = ReturnType<
  typeof candidateLanguageItemInitialValue
>;

export type CandidateProfileFormValues = {
  certifications: CandidateCertificationItem[];
  contactNumber: string;
  currentAnnualCtc: string;
  currentCompany: string;
  currentLocation: string;
  currentPosition: string;
  dateOfBirth: string;
  educationHistory: CandidateEducationHistoryItem[];
  email: string;
  employmentHistory: CandidateEmploymentHistoryItem[];
  expectedAnnualCtc: string;
  fullName: string;
  gender: string;
  homeAddress: string;
  itSkills: CandidateItSkillItem[];
  keySkills: string[];
  languages: CandidateLanguageItem[];
  linkedinUrl: string;
  noticePeriod: string;
  portfolioUrl: string;
  preferredEmploymentTypes: string[];
  preferredJobTitles: string[];
  preferredLocations: string[];
  preferredWorkModes: string[];
  professionalQualifications: CandidateProfessionalQualificationItem[];
  profileHeadline: string;
  profileSummary: string;
  projects: CandidateProjectItem[];
  resumeBytes: number;
  resumeExtension: string;
  resumeOriginalName: string;
  resumeUrl: string;
  totalExperienceMonths: string;
  totalExperienceYears: string;
};

export type CandidateProfileFieldName = keyof CandidateProfileFormValues;

export type CandidateProfileValidationErrors = Partial<
  Record<CandidateProfileFieldName, string>
>;

export const candidateProfileInitialValues: CandidateProfileFormValues = {
  certifications: [],
  contactNumber: "",
  currentAnnualCtc: "",
  currentCompany: "",
  currentLocation: "",
  currentPosition: "",
  dateOfBirth: "",
  educationHistory: [],
  email: "",
  employmentHistory: [],
  expectedAnnualCtc: "",
  fullName: "",
  gender: "",
  homeAddress: "",
  itSkills: [],
  keySkills: [],
  languages: [],
  linkedinUrl: "",
  noticePeriod: "",
  portfolioUrl: "",
  preferredEmploymentTypes: [],
  preferredJobTitles: [],
  preferredLocations: [],
  preferredWorkModes: [],
  professionalQualifications: [],
  profileHeadline: "",
  profileSummary: "",
  projects: [],
  resumeBytes: 0,
  resumeExtension: "",
  resumeOriginalName: "",
  resumeUrl: "",
  totalExperienceMonths: "",
  totalExperienceYears: "",
};

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const normalizeTextareaList = (values: string[]) =>
  Array.from(
    new Set(
      values
        .map((value) => normalizeText(value))
        .filter((value) => value.length > 0),
    ),
  );

const normalizeDigits = (value: string) => value.replace(/\D/g, "");

const normalizeUrl = (value: string) => value.trim();

const normalizeEmploymentHistory = (
  values: CandidateEmploymentHistoryItem[],
) =>
  values
    .map((item) => ({
      companyName: normalizeText(item.companyName),
      currentlyWorking: Boolean(item.currentlyWorking),
      description: normalizeText(item.description),
      designation: normalizeText(item.designation),
      employmentType: normalizeText(item.employmentType),
      endDate: item.currentlyWorking ? "" : item.endDate.trim(),
      location: normalizeText(item.location),
      startDate: item.startDate.trim(),
    }))
    .filter((item) =>
      [
        item.companyName,
        item.designation,
        item.location,
        item.startDate,
        item.endDate,
        item.description,
        item.employmentType,
      ].some((value) => value.length > 0),
    );

const normalizeEducationHistory = (values: CandidateEducationHistoryItem[]) =>
  values
    .map((item) => ({
      degree: normalizeText(item.degree),
      educationLevel: normalizeText(item.educationLevel),
      endYear: normalizeDigits(item.endYear).slice(0, 4),
      gradingType: normalizeText(item.gradingType),
      institution: normalizeText(item.institution),
      score: normalizeText(item.score),
      specialization: normalizeText(item.specialization),
      startYear: normalizeDigits(item.startYear).slice(0, 4),
    }))
    .filter((item) =>
      [
        item.degree,
        item.educationLevel,
        item.endYear,
        item.gradingType,
        item.institution,
        item.score,
        item.specialization,
        item.startYear,
      ].some((value) => value.length > 0),
    );

const normalizeItSkills = (values: CandidateItSkillItem[]) =>
  values
    .map((item) => ({
      experienceMonths: normalizeDigits(item.experienceMonths).slice(0, 2),
      experienceYears: normalizeDigits(item.experienceYears).slice(0, 2),
      lastUsedYear: normalizeDigits(item.lastUsedYear).slice(0, 4),
      skill: normalizeText(item.skill),
      version: normalizeText(item.version),
    }))
    .filter((item) =>
      [
        item.experienceMonths,
        item.experienceYears,
        item.lastUsedYear,
        item.skill,
        item.version,
      ].some((value) => value.length > 0),
    );

const normalizeProjects = (values: CandidateProjectItem[]) =>
  values
    .map((item) => ({
      description: normalizeText(item.description),
      endDate: item.endDate.trim(),
      role: normalizeText(item.role),
      startDate: item.startDate.trim(),
      technologies: normalizeText(item.technologies),
      title: normalizeText(item.title),
    }))
    .filter((item) =>
      [
        item.description,
        item.endDate,
        item.role,
        item.startDate,
        item.technologies,
        item.title,
      ].some((value) => value.length > 0),
    );

const normalizeCertifications = (values: CandidateCertificationItem[]) =>
  values
    .map((item) => ({
      credentialId: normalizeText(item.credentialId),
      issuer: normalizeText(item.issuer),
      name: normalizeText(item.name),
      year: normalizeDigits(item.year).slice(0, 4),
    }))
    .filter((item) =>
      [item.credentialId, item.issuer, item.name, item.year].some(
        (value) => value.length > 0,
      ),
    );

const normalizeProfessionalQualifications = (
  values: CandidateProfessionalQualificationItem[],
) =>
  values
    .map((item) => ({
      institution: normalizeText(item.institution),
      title: normalizeText(item.title),
      year: normalizeDigits(item.year).slice(0, 4),
    }))
    .filter((item) =>
      [item.institution, item.title, item.year].some(
        (value) => value.length > 0,
      ),
    );

const normalizeLanguages = (values: CandidateLanguageItem[]) =>
  values
    .map((item) => ({
      language: normalizeText(item.language),
      proficiency: normalizeText(item.proficiency),
    }))
    .filter((item) =>
      [item.language, item.proficiency].some((value) => value.length > 0),
    );

export const normalizeCandidateProfileValues = (
  values: CandidateProfileFormValues,
): CandidateProfileFormValues => ({
  certifications: normalizeCertifications(values.certifications),
  contactNumber: normalizeDigits(values.contactNumber),
  currentAnnualCtc: normalizeText(values.currentAnnualCtc),
  currentCompany: normalizeText(values.currentCompany),
  currentLocation: normalizeText(values.currentLocation),
  currentPosition: normalizeText(values.currentPosition),
  dateOfBirth: values.dateOfBirth.trim(),
  educationHistory: normalizeEducationHistory(values.educationHistory),
  email: normalizeText(values.email).toLowerCase(),
  employmentHistory: normalizeEmploymentHistory(values.employmentHistory),
  expectedAnnualCtc: normalizeText(values.expectedAnnualCtc),
  fullName: normalizeText(values.fullName),
  gender: normalizeText(values.gender),
  homeAddress: normalizeText(values.homeAddress),
  itSkills: normalizeItSkills(values.itSkills),
  keySkills: normalizeTextareaList(values.keySkills),
  languages: normalizeLanguages(values.languages),
  linkedinUrl: normalizeUrl(values.linkedinUrl),
  noticePeriod: normalizeText(values.noticePeriod),
  portfolioUrl: normalizeUrl(values.portfolioUrl),
  preferredEmploymentTypes: normalizeTextareaList(
    values.preferredEmploymentTypes,
  ),
  preferredJobTitles: normalizeTextareaList(values.preferredJobTitles),
  preferredLocations: normalizeTextareaList(values.preferredLocations),
  preferredWorkModes: normalizeTextareaList(values.preferredWorkModes),
  professionalQualifications: normalizeProfessionalQualifications(
    values.professionalQualifications,
  ),
  profileHeadline: normalizeText(values.profileHeadline),
  profileSummary: normalizeText(values.profileSummary),
  projects: normalizeProjects(values.projects),
  resumeBytes: Number.isFinite(values.resumeBytes) ? values.resumeBytes : 0,
  resumeExtension: normalizeText(values.resumeExtension),
  resumeOriginalName: normalizeText(values.resumeOriginalName),
  resumeUrl: normalizeUrl(values.resumeUrl),
  totalExperienceMonths: normalizeDigits(values.totalExperienceMonths).slice(0, 2),
  totalExperienceYears: normalizeDigits(values.totalExperienceYears).slice(0, 2),
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidOptionalUrl = (value: string) => {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const validateCandidateProfileValues = (
  values: CandidateProfileFormValues,
) => {
  const normalized = normalizeCandidateProfileValues(values);
  const errors: CandidateProfileValidationErrors = {};
  const experienceYears = Number(normalized.totalExperienceYears || 0);
  const experienceMonths = Number(normalized.totalExperienceMonths || 0);

  if (!normalized.fullName) {
    errors.fullName = "Full name is required.";
  }

  if (!normalized.email) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(normalized.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!normalized.contactNumber) {
    errors.contactNumber = "Contact number is required.";
  } else if (
    normalized.contactNumber.length < 10 ||
    normalized.contactNumber.length > 12
  ) {
    errors.contactNumber = "Contact number must be between 10 and 12 digits.";
  }

  if (!normalized.currentLocation) {
    errors.currentLocation = "Current location is required.";
  }

  if (experienceMonths > 11) {
    errors.totalExperienceMonths = "Experience months cannot be more than 11.";
  }

  if (!isValidOptionalUrl(normalized.linkedinUrl)) {
    errors.linkedinUrl = "Enter a valid LinkedIn URL.";
  }

  if (!isValidOptionalUrl(normalized.portfolioUrl)) {
    errors.portfolioUrl = "Enter a valid portfolio URL.";
  }

  if (!isValidOptionalUrl(normalized.resumeUrl)) {
    errors.resumeUrl = "Enter a valid resume URL.";
  }

  if (
    normalized.dateOfBirth &&
    Number.isNaN(new Date(normalized.dateOfBirth).getTime())
  ) {
    errors.dateOfBirth = "Enter a valid date of birth.";
  }

  if (
    normalized.noticePeriod &&
    !candidateNoticePeriodOptions.includes(
      normalized.noticePeriod as (typeof candidateNoticePeriodOptions)[number],
    )
  ) {
    errors.noticePeriod = "Choose a valid notice period.";
  }

  if (
    normalized.gender &&
    !candidateGenderOptions.includes(
      normalized.gender as (typeof candidateGenderOptions)[number],
    )
  ) {
    errors.gender = "Choose a valid gender option.";
  }

  if (
    normalized.preferredEmploymentTypes.some(
      (value) =>
        !candidateEmploymentTypeOptions.includes(
          value as (typeof candidateEmploymentTypeOptions)[number],
        ),
    )
  ) {
    errors.preferredEmploymentTypes =
      "Choose valid preferred employment types.";
  }

  if (
    normalized.preferredWorkModes.some(
      (value) =>
        !candidateWorkModeOptions.includes(
          value as (typeof candidateWorkModeOptions)[number],
        ),
    )
  ) {
    errors.preferredWorkModes = "Choose valid preferred work modes.";
  }

  if (
    normalized.languages.some(
      (item) =>
        item.proficiency &&
        !candidateLanguageProficiencyOptions.includes(
          item.proficiency as (typeof candidateLanguageProficiencyOptions)[number],
        ),
    )
  ) {
    errors.languages = "Choose valid language proficiency values.";
  }

  if (
    normalized.educationHistory.some(
      (item) =>
        item.educationLevel &&
        !candidateEducationLevelOptions.includes(
          item.educationLevel as (typeof candidateEducationLevelOptions)[number],
        ),
    )
  ) {
    errors.educationHistory = "Choose valid education levels.";
  }

  if (
    normalized.employmentHistory.some(
      (item) =>
        item.employmentType &&
        !candidateEmploymentTypeOptions.includes(
          item.employmentType as (typeof candidateEmploymentTypeOptions)[number],
        ),
    )
  ) {
    errors.employmentHistory = "Choose valid employment types in work history.";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    normalized,
    record:
      Object.keys(errors).length === 0
        ? {
            ...normalized,
            totalExperienceMonths: String(experienceMonths),
            totalExperienceYears: String(experienceYears),
          }
        : null,
  };
};

export const calculateCandidateProfileStrength = (
  values: CandidateProfileFormValues,
) => {
  const normalized = normalizeCandidateProfileValues(values);
  const checkpoints = [
    normalized.fullName,
    normalized.email,
    normalized.contactNumber,
    normalized.currentLocation,
    normalized.profileHeadline,
    normalized.profileSummary,
    normalized.currentCompany,
    normalized.currentPosition,
    normalized.keySkills.length > 0 ? "yes" : "",
    normalized.employmentHistory.length > 0 ? "yes" : "",
    normalized.educationHistory.length > 0 ? "yes" : "",
    normalized.languages.length > 0 ? "yes" : "",
    normalized.resumeUrl,
  ];
  const completed = checkpoints.filter((value) => value.length > 0).length;

  return Math.round((completed / checkpoints.length) * 100);
};

export const inferCandidateWorkStatus = (values: CandidateProfileFormValues) => {
  const normalized = normalizeCandidateProfileValues(values);
  const totalExperience =
    Number(normalized.totalExperienceYears || 0) * 12 +
    Number(normalized.totalExperienceMonths || 0);

  if (totalExperience > 0) {
    return "Experienced";
  }

  if (
    normalized.currentPosition === "Fresher Candidate" ||
    /college|institute/i.test(normalized.currentCompany)
  ) {
    return "Fresher";
  }

  return normalized.currentCompany || normalized.currentPosition
    ? "Experienced"
    : "Not specified";
};

export const candidateProfileStringArrayToText = (values: string[]) =>
  values.join(", ");

export const candidateProfileTextToStringArray = (value: string) =>
  value
    .split(/[\n,]/)
    .map((item) => normalizeText(item))
    .filter((item) => item.length > 0);

export const formatCandidateProfileBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "File size unavailable";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
