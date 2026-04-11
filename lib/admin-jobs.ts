import "server-only";
import type {
  AdminJobListingRecord,
  AdminJobListingsSummary,
} from "./admin-jobs-shared";
import { jobListingStatuses, type JobListingStatus } from "./job-listings";
import { createAdminClient } from "./supabase/admin";

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

type AdminJobsData = {
  errorMessage: string | null;
  jobs: AdminJobListingRecord[];
  summary: AdminJobListingsSummary;
};

const jobListingsTableName =
  process.env.SUPABASE_JOB_LISTINGS_TABLE?.trim() || "job_listings";
const jobListingsBaseSelect =
  "id, job_title, department, employment_type, work_mode, location, experience_min_years, experience_max_years, openings, salary_min_lpa, salary_max_lpa, application_deadline, status, required_skills, job_summary_html, responsibilities_html, applicants_count, created_at";
const jobListingsExtendedSelect = `company_name, ${jobListingsBaseSelect}`;

const isJobListingStatus = (value: string): value is JobListingStatus =>
  jobListingStatuses.includes(value as JobListingStatus);

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

const createEmptySummary = (): AdminJobListingsSummary => ({
  activeRoles: 0,
  newApplicants: 0,
  totalListings: 0,
});

export const getAdminJobsData = async (): Promise<AdminJobsData> => {
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
        errorMessage: "Unable to load job listings from Supabase.",
        jobs: [],
        summary: createEmptySummary(),
      };
    }

    const jobRows = (data ?? []) as JobListingRow[];
    const jobs = jobRows.map((record) => ({
      applicationDeadline: record.application_deadline,
      applicants: record.applicants_count,
      companyName: record.company_name?.trim() || "Company not provided",
      department: record.department,
      employmentType: record.employment_type,
      experienceMaxYears: record.experience_max_years,
      experienceMinYears: record.experience_min_years,
      id: record.id,
      jobTitle: record.job_title,
      jobSummaryHtml: record.job_summary_html,
      location: record.location,
      openings: record.openings,
      postedOn: formatRelativePostedTime(record.created_at),
      requiredSkills: record.required_skills,
      responsibilitiesHtml: record.responsibilities_html,
      salaryMaxLpa: record.salary_max_lpa,
      salaryMinLpa: record.salary_min_lpa,
      status: isJobListingStatus(record.status) ? record.status : "Draft",
      workMode: record.work_mode,
    }));

    return {
      errorMessage: null,
      jobs,
      summary: {
        activeRoles: jobs.filter((job) => job.status === "Active").length,
        newApplicants: jobs.reduce(
          (totalApplicants, job) => totalApplicants + job.applicants,
          0,
        ),
        totalListings: jobs.length,
      },
    };
  } catch {
    return {
      errorMessage: "Unable to connect to Supabase job listings.",
      jobs: [],
      summary: createEmptySummary(),
    };
  }
};
