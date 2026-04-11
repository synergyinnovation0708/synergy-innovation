import "server-only";
import type { User } from "@supabase/supabase-js";
import type {
  AdminCandidateRecord,
  AdminCandidatesSummary,
} from "./admin-candidates-shared";
import { isAdminUser } from "./admin-auth";
import { createAdminClient } from "./supabase/admin";

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

type CandidateApplicationRow = {
  applied_at: string;
  candidate_user_id: string;
  job_title: string;
};

type AdminCandidatesData = {
  candidates: AdminCandidateRecord[];
  errorMessage: string | null;
  summary: AdminCandidatesSummary;
};

const candidateProfilesTableName =
  process.env.SUPABASE_CANDIDATE_PROFILES_TABLE?.trim() || "candidate_profiles";
const candidateApplicationsTableName =
  process.env.SUPABASE_CANDIDATE_JOB_APPLICATIONS_TABLE?.trim() ||
  "candidate_job_applications";

const createEmptySummary = (): AdminCandidatesSummary => ({
  activeAccounts: 0,
  profilesWithResume: 0,
  suspendedAccounts: 0,
  totalApplications: 0,
  totalCandidates: 0,
});

const formatRelativeTime = (
  dateValue: string | null | undefined,
  prefix: string,
) => {
  if (!dateValue) {
    return prefix;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return prefix;
  }

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const differenceInMinutes = Math.round(
    (date.getTime() - Date.now()) / (1000 * 60),
  );
  const absoluteDifferenceInMinutes = Math.abs(differenceInMinutes);

  if (absoluteDifferenceInMinutes < 60) {
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

const mapEmploymentHistoryItem = (item: Record<string, unknown>) => ({
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

const mapEducationHistoryItem = (item: Record<string, unknown>) => ({
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

const mapItSkillItem = (item: Record<string, unknown>) => ({
  experienceMonths:
    typeof item.experienceMonths === "string" ? item.experienceMonths : "",
  experienceYears:
    typeof item.experienceYears === "string" ? item.experienceYears : "",
  lastUsedYear: typeof item.lastUsedYear === "string" ? item.lastUsedYear : "",
  skill: typeof item.skill === "string" ? item.skill : "",
  version: typeof item.version === "string" ? item.version : "",
});

const mapProjectItem = (item: Record<string, unknown>) => ({
  description: typeof item.description === "string" ? item.description : "",
  endDate: typeof item.endDate === "string" ? item.endDate : "",
  role: typeof item.role === "string" ? item.role : "",
  startDate: typeof item.startDate === "string" ? item.startDate : "",
  technologies: typeof item.technologies === "string" ? item.technologies : "",
  title: typeof item.title === "string" ? item.title : "",
});

const mapCertificationItem = (item: Record<string, unknown>) => ({
  credentialId:
    typeof item.credentialId === "string" ? item.credentialId : "",
  issuer: typeof item.issuer === "string" ? item.issuer : "",
  name: typeof item.name === "string" ? item.name : "",
  year: typeof item.year === "string" ? item.year : "",
});

const mapProfessionalQualificationItem = (item: Record<string, unknown>) => ({
  institution: typeof item.institution === "string" ? item.institution : "",
  title: typeof item.title === "string" ? item.title : "",
  year: typeof item.year === "string" ? item.year : "",
});

const mapLanguageItem = (item: Record<string, unknown>) => ({
  language: typeof item.language === "string" ? item.language : "",
  proficiency: typeof item.proficiency === "string" ? item.proficiency : "",
});

const formatExperienceLabel = (
  totalExperienceYears: number | null,
  totalExperienceMonths: number | null,
) => {
  const years = Math.max(totalExperienceYears ?? 0, 0);
  const months = Math.max(totalExperienceMonths ?? 0, 0);

  if (years === 0 && months === 0) {
    return "Fresher";
  }

  if (months === 0) {
    return `${years} Year${years === 1 ? "" : "s"}`;
  }

  return `${years} Year${years === 1 ? "" : "s"} ${months} Month${
    months === 1 ? "" : "s"
  }`;
};

const inferWorkStatusLabel = (
  totalExperienceYears: number | null,
  totalExperienceMonths: number | null,
  currentCompany: string | null,
  currentPosition: string | null,
) => {
  const totalExperience =
    Math.max(totalExperienceYears ?? 0, 0) * 12 +
    Math.max(totalExperienceMonths ?? 0, 0);

  if (totalExperience > 0) {
    return "Experienced";
  }

  if (
    currentPosition === "Fresher Candidate" ||
    /college|institute/i.test(currentCompany ?? "")
  ) {
    return "Fresher";
  }

  return currentCompany || currentPosition ? "Experienced" : "Not specified";
};

const isSuspendedCandidate = (user: Pick<User, "banned_until">) => {
  if (!user.banned_until) {
    return false;
  }

  const bannedUntil = new Date(user.banned_until);

  return !Number.isNaN(bannedUntil.getTime()) && bannedUntil.getTime() > Date.now();
};

const listAllAuthUsers = async (supabase: ReturnType<typeof createAdminClient>) => {
  const users: User[] = [];
  let currentPage = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page: currentPage,
      perPage: 200,
    });

    if (error) {
      throw error;
    }

    const nextUsers = data.users ?? [];

    if (nextUsers.length === 0) {
      break;
    }

    users.push(...nextUsers);

    if (!data.nextPage || data.nextPage === currentPage) {
      break;
    }

    currentPage = data.nextPage;
  }

  return users;
};

export const getAdminCandidatesData = async (): Promise<AdminCandidatesData> => {
  try {
    const supabase = createAdminClient();
    const [authUsers, candidateProfilesResult, candidateApplicationsResult] =
      await Promise.all([
        listAllAuthUsers(supabase),
        supabase
          .from(candidateProfilesTableName)
          .select(
            "user_id, email, full_name, contact_number, profile_headline, profile_summary, current_location, home_address, linkedin_url, portfolio_url, gender, date_of_birth, total_experience_years, total_experience_months, current_company, current_position, notice_period, current_annual_ctc, expected_annual_ctc, preferred_job_titles, preferred_locations, preferred_employment_types, preferred_work_modes, key_skills, languages, professional_qualifications, employment_history, education_history, it_skills, projects, certifications, resume_url, resume_original_name, resume_extension, resume_bytes, created_at, updated_at",
          )
          .order("updated_at", { ascending: false }),
        supabase
          .from(candidateApplicationsTableName)
          .select("candidate_user_id, job_title, applied_at")
          .order("applied_at", { ascending: false }),
      ]);

    const candidateProfilesError = candidateProfilesResult.error;

    if (candidateProfilesError) {
      return {
        candidates: [],
        errorMessage: "Unable to load candidate profiles from Supabase.",
        summary: createEmptySummary(),
      };
    }

    const candidateProfileRows = (candidateProfilesResult.data ??
      []) as CandidateProfileRow[];
    const candidateApplicationRows = candidateApplicationsResult.error
      ? []
      : ((candidateApplicationsResult.data ?? []) as CandidateApplicationRow[]);
    const candidateProfilesByUserId = new Map(
      candidateProfileRows.map((record) => [record.user_id, record]),
    );
    const candidateApplicationSummaryByUserId = new Map<
      string,
      {
        count: number;
        latestAppliedAt: string | null;
        latestJobTitle: string | null;
      }
    >();

    for (const application of candidateApplicationRows) {
      const currentSummary = candidateApplicationSummaryByUserId.get(
        application.candidate_user_id,
      );

      if (!currentSummary) {
        candidateApplicationSummaryByUserId.set(application.candidate_user_id, {
          count: 1,
          latestAppliedAt: application.applied_at,
          latestJobTitle: application.job_title,
        });
        continue;
      }

      candidateApplicationSummaryByUserId.set(application.candidate_user_id, {
        count: currentSummary.count + 1,
        latestAppliedAt: currentSummary.latestAppliedAt,
        latestJobTitle: currentSummary.latestJobTitle,
      });
    }

    const candidates = authUsers
      .filter((user) => !isAdminUser(user))
      .map((user) => {
        const profile = candidateProfilesByUserId.get(user.id);
        const applications =
          candidateApplicationSummaryByUserId.get(user.id) ?? null;
        const candidateName =
          profile?.full_name?.trim() ||
          (typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name.trim()
            : "") ||
          (typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name.trim()
            : "") ||
          user.email ||
          "Candidate";
        const currentLocation =
          profile?.current_location?.trim() ||
          profile?.preferred_locations?.[0]?.trim() ||
          "Not specified";
        const primarySkill =
          profile?.key_skills?.[0]?.trim() ||
          ensureObjectArray(profile?.it_skills, mapItSkillItem)[0]?.skill ||
          profile?.current_position?.trim() ||
          "Not specified";
        const accountStatus = isSuspendedCandidate(user) ? "suspended" : "active";
        const lastActivitySource =
          applications?.latestAppliedAt ||
          profile?.updated_at ||
          user.last_sign_in_at ||
          user.created_at;
        const lastActivityTimestamp = lastActivitySource
          ? new Date(lastActivitySource).getTime()
          : 0;
        const joinedTimestamp = user.created_at
          ? new Date(user.created_at).getTime()
          : 0;

        return {
          candidate: {
            accountStatus,
            applicationsCount: applications?.count ?? 0,
            candidateName,
            certifications: ensureObjectArray(
              profile?.certifications,
              mapCertificationItem,
            ),
            contactNumber: profile?.contact_number?.trim() || "",
            currentAnnualCtc: profile?.current_annual_ctc?.trim() || "",
            currentCompany: profile?.current_company?.trim() || "",
            currentLocation,
            currentPosition: profile?.current_position?.trim() || "",
            dateOfBirth: profile?.date_of_birth ?? null,
            educationHistory: ensureObjectArray(
              profile?.education_history,
              mapEducationHistoryItem,
            ),
            email: profile?.email?.trim() || user.email || "",
            employmentHistory: ensureObjectArray(
              profile?.employment_history,
              mapEmploymentHistoryItem,
            ),
            expectedAnnualCtc: profile?.expected_annual_ctc?.trim() || "",
            experienceLabel: formatExperienceLabel(
              profile?.total_experience_years ?? 0,
              profile?.total_experience_months ?? 0,
            ),
            gender: profile?.gender?.trim() || "",
            homeAddress: profile?.home_address?.trim() || "",
            id: user.id,
            itSkills: ensureObjectArray(profile?.it_skills, mapItSkillItem),
            joinedLabel: formatRelativeTime(user.created_at, "Joined"),
            keySkills: ensureStringArray(profile?.key_skills),
            languages: ensureObjectArray(profile?.languages, mapLanguageItem),
            lastActivityLabel: formatRelativeTime(lastActivitySource, "Updated"),
            lastAppliedAtLabel: applications?.latestAppliedAt
              ? formatRelativeTime(applications.latestAppliedAt, "Applied")
              : null,
            lastAppliedJobTitle: applications?.latestJobTitle ?? null,
            linkedinUrl: profile?.linkedin_url?.trim() || "",
            noticePeriod: profile?.notice_period?.trim() || "Not specified",
            portfolioUrl: profile?.portfolio_url?.trim() || "",
            preferredEmploymentTypes: ensureStringArray(
              profile?.preferred_employment_types,
            ),
            preferredJobTitles: ensureStringArray(profile?.preferred_job_titles),
            preferredLocations: ensureStringArray(profile?.preferred_locations),
            preferredWorkModes: ensureStringArray(profile?.preferred_work_modes),
            primarySkill,
            professionalQualifications: ensureObjectArray(
              profile?.professional_qualifications,
              mapProfessionalQualificationItem,
            ),
            profileHeadline: profile?.profile_headline?.trim() || "",
            profileSummary: profile?.profile_summary?.trim() || "",
            projects: ensureObjectArray(profile?.projects, mapProjectItem),
            resumeBytes: profile?.resume_bytes ?? 0,
            resumeExtension: profile?.resume_extension?.trim() || "",
            resumeOriginalName: profile?.resume_original_name?.trim() || "",
            resumeUrl: profile?.resume_url?.trim() || "",
            suspendedUntil: user.banned_until ?? null,
            totalExperienceMonths: Math.max(
              profile?.total_experience_months ?? 0,
              0,
            ),
            totalExperienceYears: Math.max(
              profile?.total_experience_years ?? 0,
              0,
            ),
            workStatusLabel: inferWorkStatusLabel(
              profile?.total_experience_years ?? 0,
              profile?.total_experience_months ?? 0,
              profile?.current_company ?? "",
              profile?.current_position ?? "",
            ),
          } satisfies AdminCandidateRecord,
          joinedTimestamp: Number.isFinite(joinedTimestamp) ? joinedTimestamp : 0,
          lastActivityTimestamp: Number.isFinite(lastActivityTimestamp)
            ? lastActivityTimestamp
            : 0,
        };
      })
      .sort((firstCandidate, secondCandidate) => {
        if (
          firstCandidate.lastActivityTimestamp !==
          secondCandidate.lastActivityTimestamp
        ) {
          return (
            secondCandidate.lastActivityTimestamp -
            firstCandidate.lastActivityTimestamp
          );
        }

        return secondCandidate.joinedTimestamp - firstCandidate.joinedTimestamp;
      })
      .map(({ candidate }) => candidate);

    return {
      candidates,
      errorMessage: candidateApplicationsResult.error
        ? "Candidate profiles loaded, but job application counts are unavailable until candidate_job_applications exists."
        : null,
      summary: {
        activeAccounts: candidates.filter(
          (candidate) => candidate.accountStatus === "active",
        ).length,
        profilesWithResume: candidates.filter(
          (candidate) => Boolean(candidate.resumeUrl),
        ).length,
        suspendedAccounts: candidates.filter(
          (candidate) => candidate.accountStatus === "suspended",
        ).length,
        totalApplications: candidates.reduce(
          (total, candidate) => total + candidate.applicationsCount,
          0,
        ),
        totalCandidates: candidates.length,
      },
    };
  } catch {
    return {
      candidates: [],
      errorMessage: "Unable to connect to Supabase candidate data.",
      summary: createEmptySummary(),
    };
  }
};
