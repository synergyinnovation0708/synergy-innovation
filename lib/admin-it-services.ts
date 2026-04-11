import "server-only";
import type {
  AdminITServiceInquiryRecord,
  AdminITServicesSummary,
} from "./admin-it-services-shared";
import { isITServiceInquiryStatus } from "./it-service-inquiries";
import { createAdminClient } from "./supabase/admin";

type ITServiceInquiryRow = {
  business_email: string;
  company_name: string;
  contact_number: string;
  created_at: string;
  full_name: string;
  id: string;
  project_brief: string | null;
  service_required: string;
  status: string | null;
};

type AdminITServicesData = {
  errorMessage: string | null;
  inquiries: AdminITServiceInquiryRecord[];
  summary: AdminITServicesSummary;
};

const itServiceInquiriesTableName =
  process.env.SUPABASE_IT_SERVICE_INQUIRIES_TABLE?.trim() ||
  "it_service_inquiries";

const itServiceInquiriesBaseSelect =
  "id, full_name, business_email, contact_number, company_name, service_required, project_brief, created_at";

const itServiceInquiriesExtendedSelect = `${itServiceInquiriesBaseSelect}, status`;

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

const createEmptySummary = (): AdminITServicesSummary => ({
  closedInquiries: 0,
  contactedInquiries: 0,
  latestSubmission: null,
  pendingInquiries: 0,
  recentSubmissions: 0,
  totalInquiries: 0,
});

export const getAdminITServicesData =
  async (): Promise<AdminITServicesData> => {
    try {
      const supabase = createAdminClient();
      const result = await supabase
        .from(itServiceInquiriesTableName)
        .select(itServiceInquiriesExtendedSelect)
        .order("created_at", { ascending: false });

      const { data, error } = result.error?.message?.includes("status")
        ? await supabase
            .from(itServiceInquiriesTableName)
            .select(itServiceInquiriesBaseSelect)
            .order("created_at", { ascending: false })
        : result;

      if (error) {
        return {
          errorMessage: error.message.includes("does not exist")
            ? "Run the it_service_inquiries SQL migration in Supabase to load IT services inquiries."
            : "Unable to load IT services inquiries from Supabase.",
          inquiries: [],
          summary: createEmptySummary(),
        };
      }

      const inquiryRows = (data ?? []) as ITServiceInquiryRow[];
      const recentThreshold = Date.now() - 24 * 60 * 60 * 1000;
      const inquiries = inquiryRows.map((record) => {
        const nextStatus = record.status ?? "";

        return {
          businessEmail: record.business_email,
          companyName: record.company_name,
          contactNumber: record.contact_number,
          id: record.id,
          name: record.full_name,
          projectBrief: record.project_brief?.trim() || "No project brief shared.",
          serviceRequired: record.service_required,
          status: isITServiceInquiryStatus(nextStatus) ? nextStatus : "pending",
          submittedAt: record.created_at,
          submittedAtLabel: formatRelativeSubmissionTime(record.created_at),
          submittedAtLongLabel: formatLongDateTime(record.created_at),
          submittedOn: formatRelativeSubmissionTime(record.created_at),
        };
      });

      return {
        errorMessage: null,
        inquiries,
        summary: {
          closedInquiries: inquiries.filter(
            (record) => record.status === "closed",
          ).length,
          contactedInquiries: inquiries.filter(
            (record) => record.status === "contacted",
          ).length,
          latestSubmission:
            inquiryRows[0]?.created_at
              ? formatRelativeSubmissionTime(inquiryRows[0].created_at)
              : null,
          pendingInquiries: inquiries.filter(
            (record) => record.status === "pending",
          ).length,
          recentSubmissions: inquiryRows.filter((record) => {
            const submittedAt = new Date(record.created_at).getTime();

            return Number.isFinite(submittedAt) && submittedAt >= recentThreshold;
          }).length,
          totalInquiries: inquiryRows.length,
        },
      };
    } catch {
      return {
        errorMessage: "Unable to connect to Supabase IT services data.",
        inquiries: [],
        summary: createEmptySummary(),
      };
    }
  };
