import type { JobListingStatus } from "./job-listings";

export type AdminJobListingRecord = {
  applicationDeadline: string;
  applicants: number;
  companyName: string;
  department: string;
  employmentType: string;
  experienceMaxYears: number;
  experienceMinYears: number;
  id: string;
  jobTitle: string;
  jobSummaryHtml: string;
  location: string;
  openings: number;
  postedOn: string;
  status: JobListingStatus;
  requiredSkills: string;
  responsibilitiesHtml: string;
  salaryMaxLpa: number;
  salaryMinLpa: number;
  workMode: string;
};

export type AdminJobListingsSummary = {
  activeRoles: number;
  newApplicants: number;
  totalListings: number;
};
