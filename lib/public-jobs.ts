import "server-only";
import { isAdminUser } from "./admin-auth";
import {
  jobListingStatuses,
  parseJobListingSkills,
  type JobListingStatus,
} from "./job-listings";
import {
  formatExperienceLabel,
  formatSalaryLabel,
  getExperienceBucket,
  splitJobLocations,
  stripHtmlContent,
  type PublicJobListing,
} from "./public-jobs-shared";
import { createAdminClient } from "./supabase/admin";
import { createClient } from "./supabase/server";

type JobListingRow = {
  applicants_count: number;
  application_deadline: string;
  company_name: string | null;
  created_at: string;
  department: string;
  employment_type: string;
  experience_max_years: number;
  experience_min_years: number;
  id: string;
  job_summary_html: string;
  job_title: string;
  location: string;
  openings: number;
  required_skills: string;
  responsibilities_html: string;
  salary_max_lpa: number;
  salary_min_lpa: number;
  status: string;
  work_mode: string;
};

type PublicJobsData = {
  errorMessage: string | null;
  jobs: PublicJobListing[];
};

type CandidateJobApplicationRow = {
  job_id: string | null;
};

const jobListingsTableName =
  process.env.SUPABASE_JOB_LISTINGS_TABLE?.trim() || "job_listings";
const candidateJobApplicationsTableName =
  process.env.SUPABASE_CANDIDATE_JOB_APPLICATIONS_TABLE?.trim() ||
  "candidate_job_applications";
const jobListingsBaseSelect =
  "id, job_title, department, employment_type, work_mode, location, experience_min_years, experience_max_years, openings, salary_min_lpa, salary_max_lpa, application_deadline, status, required_skills, job_summary_html, responsibilities_html, applicants_count, created_at";
const jobListingsExtendedSelect = `company_name, ${jobListingsBaseSelect}`;

const isJobListingStatus = (value: string): value is JobListingStatus =>
  jobListingStatuses.includes(value as JobListingStatus);

const isMissingTableError = (message: string) =>
  /candidate_job_applications|relation .* does not exist/i.test(message);

const isDynamicServerUsageError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "digest" in error &&
  error.digest === "DYNAMIC_SERVER_USAGE";

const formatRelativePostedTime = (createdAt: string) => {
  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return "Posted recently";
  }

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const differenceInMinutes = Math.round(
    (createdDate.getTime() - Date.now()) / (1000 * 60),
  );

  if (Math.abs(differenceInMinutes) < 60) {
    return `Posted ${formatter.format(differenceInMinutes, "minute")}`;
  }

  const differenceInHours = Math.round(differenceInMinutes / 60);

  if (Math.abs(differenceInHours) < 24) {
    return `Posted ${formatter.format(differenceInHours, "hour")}`;
  }

  const differenceInDays = Math.round(differenceInHours / 24);

  if (Math.abs(differenceInDays) < 30) {
    return `Posted ${formatter.format(differenceInDays, "day")}`;
  }

  const differenceInMonths = Math.round(differenceInDays / 30);

  return `Posted ${formatter.format(differenceInMonths, "month")}`;
};

export const getCurrentCandidateAppliedJobIds = async (): Promise<string[]> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || isAdminUser(user)) {
      return [];
    }

    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
      .from(candidateJobApplicationsTableName)
      .select("job_id")
      .eq("candidate_user_id", user.id);

    if (error) {
      if (!isMissingTableError(error.message)) {
        console.error("Candidate applied jobs lookup failed:", error);
      }

      return [];
    }

    return Array.from(
      new Set(
        ((data ?? []) as CandidateJobApplicationRow[])
          .map((application) => application.job_id?.trim() ?? "")
          .filter(Boolean),
      ),
    );
  } catch (error) {
    if (!isDynamicServerUsageError(error)) {
      console.error("Candidate applied jobs lookup failed:", error);
    }

    return [];
  }
};

export const getPublicJobsData = async (): Promise<PublicJobsData> => {
  try {
    const supabase = createAdminClient();
    const result = await supabase
      .from(jobListingsTableName)
      .select(jobListingsExtendedSelect)
      .order("created_at", { ascending: false });
    const { data, error } = result.error?.message?.includes("company_name")
      ? await supabase
          .from(jobListingsTableName)
          .select(jobListingsBaseSelect)
          .order("created_at", { ascending: false })
      : result;

    if (error) {
      return {
        errorMessage: "Unable to load jobs from Supabase right now.",
        jobs: [],
      };
    }

    const jobs = ((data ?? []) as JobListingRow[]).map((record) => {
      const locations = splitJobLocations(record.location);

      return {
        applicants: record.applicants_count,
        applicationDeadline: record.application_deadline,
        companyName: record.company_name?.trim() || "Company not provided",
        createdAt: record.created_at,
        department: record.department,
        employmentType: record.employment_type,
        experienceBucket: getExperienceBucket(
          record.experience_min_years,
          record.experience_max_years,
        ),
        experienceLabel: formatExperienceLabel(
          record.experience_min_years,
          record.experience_max_years,
        ),
        id: record.id,
        jobSummaryHtml: record.job_summary_html,
        jobSummaryText: stripHtmlContent(record.job_summary_html),
        jobTitle: record.job_title,
        location: locations.join(", "),
        locations,
        openings: record.openings,
        postedLabel: formatRelativePostedTime(record.created_at),
        requiredSkills: parseJobListingSkills(record.required_skills),
        responsibilitiesHtml: record.responsibilities_html,
        salaryLabel: formatSalaryLabel(
          record.salary_min_lpa,
          record.salary_max_lpa,
        ),
        salaryMaxLpa: record.salary_max_lpa,
        salaryMinLpa: record.salary_min_lpa,
        status: isJobListingStatus(record.status) ? record.status : "Draft",
        workMode: record.work_mode,
      } satisfies PublicJobListing;
    });

    return {
      errorMessage: null,
      jobs,
    };
  } catch {
    return {
      errorMessage: "Unable to connect to Supabase jobs right now.",
      jobs: [],
    };
  }
};
