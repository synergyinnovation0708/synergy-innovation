import "server-only";
import type { CandidateIdentity } from "./candidate-auth";
import {
  calculateCandidateProfileStrength,
  candidateProfileInitialValues,
  type CandidateCertificationItem,
  type CandidateEducationHistoryItem,
  type CandidateEmploymentHistoryItem,
  type CandidateItSkillItem,
  type CandidateLanguageItem,
  type CandidateProfessionalQualificationItem,
  type CandidateProfileFormValues,
  type CandidateProjectItem,
  inferCandidateWorkStatus,
} from "./candidate-profile-shared";
import { createAdminClient } from "./supabase/admin";

type JobSeekerInquiryRow = {
  contact_number: string;
  created_at: string;
  current_company: string;
  current_position: string;
  email: string;
  full_name: string;
  resume_bytes: number;
  resume_extension: string;
  resume_original_name: string;
  resume_url: string;
};

type CandidateProfileRow = {
  certifications: unknown;
  contact_number: string | null;
  created_at: string;
  current_annual_ctc: string | null;
  current_company: string | null;
  current_location: string | null;
  current_position: string | null;
  date_of_birth: string | null;
  education_history: unknown;
  email: string;
  employment_history: unknown;
  expected_annual_ctc: string | null;
  full_name: string | null;
  gender: string | null;
  home_address: string | null;
  it_skills: unknown;
  key_skills: string[] | null;
  languages: unknown;
  linkedin_url: string | null;
  notice_period: string | null;
  portfolio_url: string | null;
  preferred_employment_types: string[] | null;
  preferred_job_titles: string[] | null;
  preferred_locations: string[] | null;
  preferred_work_modes: string[] | null;
  professional_qualifications: unknown;
  profile_headline: string | null;
  profile_summary: string | null;
  projects: unknown;
  resume_bytes: number | null;
  resume_extension: string | null;
  resume_original_name: string | null;
  resume_url: string | null;
  total_experience_months: number | null;
  total_experience_years: number | null;
  updated_at: string;
  user_id: string;
};

export type CandidateProfileMeta = {
  hasSavedProfile: boolean;
  joinedLabel: string;
  profileStrength: number;
  submittedLabel: string;
  workStatusLabel: string;
};

export type CandidateProfileData = {
  errorMessage: string | null;
  initialValues: CandidateProfileFormValues;
  meta: CandidateProfileMeta;
};

type CandidateAccessIdentity = Pick<CandidateIdentity, "email" | "id">;

const jobSeekerInquiriesTableName =
  process.env.SUPABASE_JOB_SEEKER_INQUIRIES_TABLE?.trim() ||
  "job_seeker_inquiries";
const candidateProfilesTableName =
  process.env.SUPABASE_CANDIDATE_PROFILES_TABLE?.trim() || "candidate_profiles";

const isMissingTableError = (error: unknown, tableName: string) =>
  error instanceof Error &&
  new RegExp(`${tableName}|relation .* does not exist|column .* does not exist`, "i").test(
    error.message,
  );

const formatRelativeTime = (dateValue: string, prefix: string) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return prefix;
  }

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const differenceInMinutes = Math.round(
    (date.getTime() - Date.now()) / (1000 * 60),
  );

  if (Math.abs(differenceInMinutes) < 60) {
    return `${prefix} ${formatter.format(differenceInMinutes, "minute")}`;
  }

  const differenceInHours = Math.round(differenceInMinutes / 60);

  if (Math.abs(differenceInHours) < 24) {
    return `${prefix} ${formatter.format(differenceInHours, "hour")}`;
  }

  const differenceInDays = Math.round(differenceInHours / 24);

  if (Math.abs(differenceInDays) < 30) {
    return `${prefix} ${formatter.format(differenceInDays, "day")}`;
  }

  const differenceInMonths = Math.round(differenceInDays / 30);

  return `${prefix} ${formatter.format(differenceInMonths, "month")}`;
};

const ensureStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const ensureObjectArray = <T extends Record<string, unknown>>(
  value: unknown,
  mapper: (item: Record<string, unknown>) => T,
) =>
  Array.isArray(value)
    ? value
        .filter(
          (item): item is Record<string, unknown> =>
            typeof item === "object" && item !== null,
        )
        .map(mapper)
    : [];

const mapEmploymentHistoryItem = (
  item: Record<string, unknown>,
): CandidateEmploymentHistoryItem => ({
  companyName: typeof item.companyName === "string" ? item.companyName : "",
  currentlyWorking: Boolean(item.currentlyWorking),
  description: typeof item.description === "string" ? item.description : "",
  designation: typeof item.designation === "string" ? item.designation : "",
  employmentType:
    typeof item.employmentType === "string" ? item.employmentType : "",
  endDate: typeof item.endDate === "string" ? item.endDate : "",
  location: typeof item.location === "string" ? item.location : "",
  startDate: typeof item.startDate === "string" ? item.startDate : "",
});

const mapEducationHistoryItem = (
  item: Record<string, unknown>,
): CandidateEducationHistoryItem => ({
  degree: typeof item.degree === "string" ? item.degree : "",
  educationLevel:
    typeof item.educationLevel === "string" ? item.educationLevel : "",
  endYear: typeof item.endYear === "string" ? item.endYear : "",
  gradingType: typeof item.gradingType === "string" ? item.gradingType : "",
  institution: typeof item.institution === "string" ? item.institution : "",
  score: typeof item.score === "string" ? item.score : "",
  specialization:
    typeof item.specialization === "string" ? item.specialization : "",
  startYear: typeof item.startYear === "string" ? item.startYear : "",
});

const mapItSkillItem = (item: Record<string, unknown>): CandidateItSkillItem => ({
  experienceMonths:
    typeof item.experienceMonths === "string" ? item.experienceMonths : "",
  experienceYears:
    typeof item.experienceYears === "string" ? item.experienceYears : "",
  lastUsedYear: typeof item.lastUsedYear === "string" ? item.lastUsedYear : "",
  skill: typeof item.skill === "string" ? item.skill : "",
  version: typeof item.version === "string" ? item.version : "",
});

const mapProjectItem = (item: Record<string, unknown>): CandidateProjectItem => ({
  description: typeof item.description === "string" ? item.description : "",
  endDate: typeof item.endDate === "string" ? item.endDate : "",
  role: typeof item.role === "string" ? item.role : "",
  startDate: typeof item.startDate === "string" ? item.startDate : "",
  technologies: typeof item.technologies === "string" ? item.technologies : "",
  title: typeof item.title === "string" ? item.title : "",
});

const mapCertificationItem = (
  item: Record<string, unknown>,
): CandidateCertificationItem => ({
  credentialId:
    typeof item.credentialId === "string" ? item.credentialId : "",
  issuer: typeof item.issuer === "string" ? item.issuer : "",
  name: typeof item.name === "string" ? item.name : "",
  year: typeof item.year === "string" ? item.year : "",
});

const mapProfessionalQualificationItem = (
  item: Record<string, unknown>,
): CandidateProfessionalQualificationItem => ({
  institution: typeof item.institution === "string" ? item.institution : "",
  title: typeof item.title === "string" ? item.title : "",
  year: typeof item.year === "string" ? item.year : "",
});

const mapLanguageItem = (
  item: Record<string, unknown>,
): CandidateLanguageItem => ({
  language: typeof item.language === "string" ? item.language : "",
  proficiency: typeof item.proficiency === "string" ? item.proficiency : "",
});

const buildFormValuesFromProfileRow = (
  row: CandidateProfileRow,
): CandidateProfileFormValues => ({
  certifications: ensureObjectArray(row.certifications, mapCertificationItem),
  contactNumber: row.contact_number ?? "",
  currentAnnualCtc: row.current_annual_ctc ?? "",
  currentCompany: row.current_company ?? "",
  currentLocation: row.current_location ?? "",
  currentPosition: row.current_position ?? "",
  dateOfBirth: row.date_of_birth ?? "",
  educationHistory: ensureObjectArray(row.education_history, mapEducationHistoryItem),
  email: row.email,
  employmentHistory: ensureObjectArray(
    row.employment_history,
    mapEmploymentHistoryItem,
  ),
  expectedAnnualCtc: row.expected_annual_ctc ?? "",
  fullName: row.full_name ?? "",
  gender: row.gender ?? "",
  homeAddress: row.home_address ?? "",
  itSkills: ensureObjectArray(row.it_skills, mapItSkillItem),
  keySkills: ensureStringArray(row.key_skills),
  languages: ensureObjectArray(row.languages, mapLanguageItem),
  linkedinUrl: row.linkedin_url ?? "",
  noticePeriod: row.notice_period ?? "",
  portfolioUrl: row.portfolio_url ?? "",
  preferredEmploymentTypes: ensureStringArray(row.preferred_employment_types),
  preferredJobTitles: ensureStringArray(row.preferred_job_titles),
  preferredLocations: ensureStringArray(row.preferred_locations),
  preferredWorkModes: ensureStringArray(row.preferred_work_modes),
  professionalQualifications: ensureObjectArray(
    row.professional_qualifications,
    mapProfessionalQualificationItem,
  ),
  profileHeadline: row.profile_headline ?? "",
  profileSummary: row.profile_summary ?? "",
  projects: ensureObjectArray(row.projects, mapProjectItem),
  resumeBytes: row.resume_bytes ?? 0,
  resumeExtension: row.resume_extension ?? "",
  resumeOriginalName: row.resume_original_name ?? "",
  resumeUrl: row.resume_url ?? "",
  totalExperienceMonths:
    row.total_experience_months !== null && row.total_experience_months !== undefined
      ? String(row.total_experience_months)
      : "",
  totalExperienceYears:
    row.total_experience_years !== null && row.total_experience_years !== undefined
      ? String(row.total_experience_years)
      : "",
});

const buildFormValuesFromInquiryRow = (
  row: JobSeekerInquiryRow,
  identity: CandidateIdentity,
): CandidateProfileFormValues => ({
  ...candidateProfileInitialValues,
  contactNumber: row.contact_number,
  currentCompany: row.current_company,
  currentPosition: row.current_position,
  currentLocation: "",
  email: row.email || identity.email,
  fullName: row.full_name || identity.name,
  resumeBytes: row.resume_bytes,
  resumeExtension: row.resume_extension,
  resumeOriginalName: row.resume_original_name,
  resumeUrl: row.resume_url,
});

const createMeta = (
  values: CandidateProfileFormValues,
  submittedAt: string | null,
  joinedAt: string | null,
  hasSavedProfile: boolean,
): CandidateProfileMeta => ({
  hasSavedProfile,
  joinedLabel:
    joinedAt && !Number.isNaN(new Date(joinedAt).getTime())
      ? formatRelativeTime(joinedAt, "Joined")
      : "Recently joined",
  profileStrength: calculateCandidateProfileStrength(values),
  submittedLabel: submittedAt
    ? formatRelativeTime(submittedAt, "Profile updated")
    : "Profile ready to complete",
  workStatusLabel: inferCandidateWorkStatus(values),
});

const getFallbackProfileData = async (
  supabase: ReturnType<typeof createAdminClient>,
  identity: CandidateIdentity,
): Promise<CandidateProfileData> => {
  const { data, error } = await supabase
    .from(jobSeekerInquiriesTableName)
    .select(
      "full_name, email, contact_number, current_position, current_company, resume_url, resume_original_name, resume_extension, resume_bytes, created_at",
    )
    .eq("email", identity.email)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    return {
      errorMessage: "Unable to load your candidate profile right now.",
      initialValues: {
        ...candidateProfileInitialValues,
        email: identity.email,
        fullName: identity.name,
      },
      meta: createMeta(
        {
          ...candidateProfileInitialValues,
          email: identity.email,
          fullName: identity.name,
        },
        null,
        identity.joinedAt,
        false,
      ),
    };
  }

  const latestRecord = (data?.[0] ?? null) as JobSeekerInquiryRow | null;
  const initialValues = latestRecord
    ? buildFormValuesFromInquiryRow(latestRecord, identity)
    : {
        ...candidateProfileInitialValues,
        email: identity.email,
        fullName: identity.name,
      };

  return {
    errorMessage: null,
    initialValues,
    meta: createMeta(
      initialValues,
      latestRecord?.created_at ?? null,
      identity.joinedAt,
      false,
    ),
  };
};

export const getCandidateProfileData = async (
  identity: CandidateIdentity,
): Promise<CandidateProfileData> => {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(candidateProfilesTableName)
      .select(
        "user_id, email, full_name, contact_number, profile_headline, profile_summary, current_location, home_address, linkedin_url, portfolio_url, gender, date_of_birth, total_experience_years, total_experience_months, current_company, current_position, notice_period, current_annual_ctc, expected_annual_ctc, preferred_job_titles, preferred_locations, preferred_employment_types, preferred_work_modes, key_skills, languages, professional_qualifications, employment_history, education_history, it_skills, projects, certifications, resume_url, resume_original_name, resume_extension, resume_bytes, created_at, updated_at",
      )
      .eq("user_id", identity.id)
      .limit(1)
      .maybeSingle();

    if (
      error &&
      /candidate_profiles|relation .* does not exist|column .* does not exist/i.test(
        error.message,
      )
    ) {
      return getFallbackProfileData(supabase, identity);
    }

    if (error) {
      return {
        errorMessage: "Unable to load your candidate profile right now.",
        initialValues: {
          ...candidateProfileInitialValues,
          email: identity.email,
          fullName: identity.name,
        },
        meta: createMeta(
          {
            ...candidateProfileInitialValues,
            email: identity.email,
            fullName: identity.name,
          },
          null,
          identity.joinedAt,
          false,
        ),
      };
    }

    if (!data) {
      return getFallbackProfileData(supabase, identity);
    }

    const row = data as CandidateProfileRow;
    const initialValues = buildFormValuesFromProfileRow(row);

    return {
      errorMessage: null,
      initialValues,
      meta: createMeta(initialValues, row.updated_at, identity.joinedAt, true),
    };
  } catch {
    return {
      errorMessage: "Unable to connect to your candidate profile.",
      initialValues: {
        ...candidateProfileInitialValues,
        email: identity.email,
        fullName: identity.name,
      },
      meta: createMeta(
        {
          ...candidateProfileInitialValues,
          email: identity.email,
          fullName: identity.name,
        },
        null,
        identity.joinedAt,
        false,
      ),
    };
  }
};

export const hasCandidateAccessRecord = async (
  identity: CandidateAccessIdentity,
): Promise<boolean> => {
  try {
    const supabase = createAdminClient();
    const candidateProfileResult = await supabase
      .from(candidateProfilesTableName)
      .select("user_id", { count: "exact", head: true })
      .eq("user_id", identity.id);

    if (!candidateProfileResult.error) {
      if ((candidateProfileResult.count ?? 0) > 0) {
        return true;
      }
    } else if (!isMissingTableError(candidateProfileResult.error, candidateProfilesTableName)) {
      console.error("Candidate profile access lookup failed:", candidateProfileResult.error);
    }

    const jobSeekerInquiryResult = await supabase
      .from(jobSeekerInquiriesTableName)
      .select("email", { count: "exact", head: true })
      .eq("email", identity.email);

    if (jobSeekerInquiryResult.error) {
      if (!isMissingTableError(jobSeekerInquiryResult.error, jobSeekerInquiriesTableName)) {
        console.error("Candidate inquiry access lookup failed:", jobSeekerInquiryResult.error);
      }

      return false;
    }

    return (jobSeekerInquiryResult.count ?? 0) > 0;
  } catch (error) {
    console.error("Candidate access record lookup failed:", error);
    return false;
  }
};
