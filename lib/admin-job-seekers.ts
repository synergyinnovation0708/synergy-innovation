import "server-only";
import type {
  AdminJobSeekerRecord,
  AdminJobSeekersSummary,
} from "./admin-job-seekers-shared";
import { createAdminClient } from "./supabase/admin";

type JobSeekerInquiryRow = {
  contact_number: string | null;
  created_at: string;
  current_company: string | null;
  current_position: string | null;
  email: string | null;
  full_name: string | null;
  id: string;
  resume_bytes: number | null;
  resume_extension: string | null;
  resume_original_name: string | null;
  resume_url: string | null;
};

type AdminJobSeekersData = {
  errorMessage: string | null;
  jobSeekers: AdminJobSeekerRecord[];
  summary: AdminJobSeekersSummary;
};

const jobSeekerInquiriesTableName =
  process.env.SUPABASE_JOB_SEEKER_INQUIRIES_TABLE?.trim() ||
  "job_seeker_inquiries";

const createEmptySummary = (): AdminJobSeekersSummary => ({
  latestSubmissionLabel: null,
  recentSubmissions: 0,
  resumesUploaded: 0,
  totalJobSeekers: 0,
  uniqueEmails: 0,
});

const formatRelativeTime = (dateValue: string) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Submitted recently";
  }

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const differenceInMinutes = Math.round(
    (date.getTime() - Date.now()) / (1000 * 60),
  );
  const absoluteDifferenceInMinutes = Math.abs(differenceInMinutes);

  if (absoluteDifferenceInMinutes < 60) {
    return `Submitted ${formatter.format(differenceInMinutes, "minute")}`;
  }

  const differenceInHours = Math.round(differenceInMinutes / 60);

  if (Math.abs(differenceInHours) < 24) {
    return `Submitted ${formatter.format(differenceInHours, "hour")}`;
  }

  const differenceInDays = Math.round(differenceInHours / 24);

  if (Math.abs(differenceInDays) < 30) {
    return `Submitted ${formatter.format(differenceInDays, "day")}`;
  }

  const differenceInMonths = Math.round(differenceInDays / 30);

  return `Submitted ${formatter.format(differenceInMonths, "month")}`;
};

const formatLongDateTime = (dateValue: string) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const getAdminJobSeekersData = async (): Promise<AdminJobSeekersData> => {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(jobSeekerInquiriesTableName)
      .select(
        "id, full_name, email, contact_number, current_position, current_company, resume_url, resume_original_name, resume_extension, resume_bytes, created_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      return {
        errorMessage: "Unable to load job seeker inquiries from Supabase.",
        jobSeekers: [],
        summary: createEmptySummary(),
      };
    }

    const jobSeekerRows = (data ?? []) as JobSeekerInquiryRow[];
    const recentThreshold = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const uniqueEmails = new Set(
      jobSeekerRows
        .map((jobSeeker) => jobSeeker.email?.trim().toLowerCase() ?? "")
        .filter((email) => email.length > 0),
    );
    const jobSeekers = jobSeekerRows.map((jobSeeker) => ({
      contactNumber: jobSeeker.contact_number?.trim() || "",
      currentCompany: jobSeeker.current_company?.trim() || "",
      currentPosition: jobSeeker.current_position?.trim() || "",
      email: jobSeeker.email?.trim() || "",
      fullName: jobSeeker.full_name?.trim() || "Job Seeker",
      id: jobSeeker.id,
      resumeBytes: jobSeeker.resume_bytes ?? 0,
      resumeExtension: jobSeeker.resume_extension?.trim() || "",
      resumeOriginalName: jobSeeker.resume_original_name?.trim() || "",
      resumeUrl: jobSeeker.resume_url?.trim() || "",
      submittedAt: jobSeeker.created_at,
      submittedAtLabel: formatRelativeTime(jobSeeker.created_at),
      submittedAtLongLabel: formatLongDateTime(jobSeeker.created_at),
    }));

    return {
      errorMessage: null,
      jobSeekers,
      summary: {
        latestSubmissionLabel:
          jobSeekers[0]?.submittedAtLabel ?? "No job seeker inquiries yet",
        recentSubmissions: jobSeekers.filter((jobSeeker) => {
          const submittedAt = new Date(jobSeeker.submittedAt).getTime();

          return (
            Number.isFinite(submittedAt) &&
            submittedAt >= recentThreshold
          );
        }).length,
        resumesUploaded: jobSeekers.filter((jobSeeker) =>
          Boolean(jobSeeker.resumeUrl),
        ).length,
        totalJobSeekers: jobSeekers.length,
        uniqueEmails: uniqueEmails.size,
      },
    };
  } catch {
    return {
      errorMessage: "Unable to connect to Supabase job seeker data.",
      jobSeekers: [],
      summary: createEmptySummary(),
    };
  }
};
