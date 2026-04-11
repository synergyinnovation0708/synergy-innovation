import "server-only";
import type {
  AdminEmployerRecord,
  AdminEmployerSummary,
} from "./admin-employers-shared";
import { isEmployerInquiryStatus } from "./employer-inquiries";
import { createAdminClient } from "./supabase/admin";

type EmployerInquiryRow = {
  company_name: string;
  contact_number: string;
  contact_name: string;
  created_at: string;
  hiring_locations: string[] | null;
  hiring_requirement: string;
  hiring_type: string;
  id: string;
  number_of_positions: number;
  status: string | null;
  work_email: string;
};

type AdminEmployersData = {
  employers: AdminEmployerRecord[];
  errorMessage: string | null;
  summary: AdminEmployerSummary;
};

const employerInquiriesTableName =
  process.env.SUPABASE_EMPLOYER_INQUIRIES_TABLE?.trim() || "employer_inquiries";

const employerInquiriesBaseSelect =
  "id, company_name, contact_name, work_email, contact_number, hiring_requirement, hiring_type, hiring_locations, number_of_positions, created_at";

const employerInquiriesExtendedSelect = `${employerInquiriesBaseSelect}, status`;

const formatRelativeSubmissionTime = (submittedAt: string) => {
  const submissionDate = new Date(submittedAt);

  if (Number.isNaN(submissionDate.getTime())) {
    return "Submitted recently";
  }

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const differenceInMinutes = Math.round(
    (submissionDate.getTime() - Date.now()) / (1000 * 60),
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

const formatLocations = (locations: string[] | null) => {
  if (!locations || locations.length === 0) {
    return "Not specified";
  }

  return locations.join(", ");
};

const formatLocationsTooltip = (locations: string[] | null) => {
  if (!locations || locations.length === 0) {
    return "Not specified";
  }

  return locations.join(", ");
};

const createEmptySummary = (): AdminEmployerSummary => ({
  latestSubmission: null,
  onboardedEmployers: 0,
  pendingEmployers: 0,
  recentSubmissions: 0,
  totalEmployers: 0,
  totalPositions: 0,
  uniqueLocations: 0,
});

export const getAdminEmployersData = async (): Promise<AdminEmployersData> => {
  try {
    const supabase = createAdminClient();
    const result = await supabase
      .from(employerInquiriesTableName)
      .select(employerInquiriesExtendedSelect)
      .order("created_at", { ascending: false });

    const { data, error } = result.error?.message?.includes("status")
      ? await supabase
          .from(employerInquiriesTableName)
          .select(employerInquiriesBaseSelect)
          .order("created_at", { ascending: false })
      : result;

    if (error) {
      return {
        employers: [],
        errorMessage: "Unable to load employer records from Supabase.",
        summary: createEmptySummary(),
      };
    }

    const employerRows = (data ?? []) as EmployerInquiryRow[];
    const recentThreshold = Date.now() - 24 * 60 * 60 * 1000;
    const employers = employerRows.map((record) => {
      const nextStatus = record.status ?? "";

      return {
        company: record.company_name,
        contactEmail: record.work_email,
        contactNumber: record.contact_number,
        contactName: record.contact_name,
        hiringRequirement: record.hiring_requirement,
        hiringLocations: record.hiring_locations ?? [],
        hiringType: record.hiring_type,
        id: record.id,
        locations: formatLocations(record.hiring_locations),
        locationsTooltip: formatLocationsTooltip(record.hiring_locations),
        openRoles: record.number_of_positions,
        status: isEmployerInquiryStatus(nextStatus) ? nextStatus : "pending",
        submittedAt: record.created_at,
        submittedAtLabel: formatRelativeSubmissionTime(record.created_at),
        submittedAtLongLabel: formatLongDateTime(record.created_at),
        submittedOn: formatRelativeSubmissionTime(record.created_at),
      };
    });
    const uniqueLocations = new Set(
      employerRows.flatMap((record) => record.hiring_locations ?? []),
    ).size;

    return {
      employers,
      errorMessage: null,
      summary: {
        latestSubmission:
          employerRows[0]?.created_at
            ? formatRelativeSubmissionTime(employerRows[0].created_at)
            : null,
        onboardedEmployers: employers.filter(
          (record) => record.status === "onboarded",
        ).length,
        pendingEmployers: employers.filter((record) => record.status === "pending")
          .length,
        recentSubmissions: employerRows.filter((record) => {
          const submittedAt = new Date(record.created_at).getTime();

          return Number.isFinite(submittedAt) && submittedAt >= recentThreshold;
        }).length,
        totalEmployers: employerRows.length,
        totalPositions: employerRows.reduce(
          (total, record) => total + record.number_of_positions,
          0,
        ),
        uniqueLocations,
      },
    };
  } catch {
    return {
      employers: [],
      errorMessage: "Unable to connect to Supabase employer data.",
      summary: createEmptySummary(),
    };
  }
};
