import type { JobListingStatus } from "./job-listings";

export type ExperienceBucketId = "0-3" | "4-6" | "7-10" | "10+";

export type JobsSortOption = "latest" | "relevance" | "salary";

export type PublicJobListing = {
  applicants: number;
  applicationDeadline: string;
  companyName: string;
  createdAt: string;
  department: string;
  experienceBucket: ExperienceBucketId;
  experienceLabel: string;
  employmentType: string;
  id: string;
  jobSummaryHtml: string;
  jobSummaryText: string;
  jobTitle: string;
  location: string;
  locations: string[];
  openings: number;
  postedLabel: string;
  requiredSkills: string[];
  responsibilitiesHtml: string;
  salaryLabel: string;
  salaryMaxLpa: number;
  salaryMinLpa: number;
  status: JobListingStatus;
  workMode: string;
};

export const experienceBuckets: Array<{
  id: ExperienceBucketId;
  label: string;
}> = [
  { id: "0-3", label: "0-3 years" },
  { id: "4-6", label: "4-6 years" },
  { id: "7-10", label: "7-10 years" },
  { id: "10+", label: "10+ years" },
];

export const getExperienceBucket = (
  experienceMinYears: number,
  experienceMaxYears: number,
): ExperienceBucketId => {
  const resolvedExperience = Math.max(experienceMinYears, experienceMaxYears);

  if (resolvedExperience <= 3) {
    return "0-3";
  }

  if (resolvedExperience <= 6) {
    return "4-6";
  }

  if (resolvedExperience <= 10) {
    return "7-10";
  }

  return "10+";
};

export const formatExperienceLabel = (
  experienceMinYears: number,
  experienceMaxYears: number,
) => {
  if (experienceMinYears === experienceMaxYears) {
    return `${experienceMinYears} year${experienceMinYears === 1 ? "" : "s"}`;
  }

  return `${experienceMinYears}-${experienceMaxYears} years`;
};

export const formatSalaryLabel = (
  salaryMinLpa: number,
  salaryMaxLpa: number,
) => `${salaryMinLpa}-${salaryMaxLpa} LPA`;

export const splitJobLocations = (value: string) =>
  value
    .split(",")
    .map((location) => location.trim())
    .filter(Boolean);

export const stripHtmlContent = (value: string) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

export const getJobInitials = (value: string) => {
  const parts = value
    .split(/[\s/,&-]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (parts[0]?.[0] ?? "J") + (parts[1]?.[0] ?? "");
};
