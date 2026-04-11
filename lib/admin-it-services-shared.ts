import type { ITServiceInquiryStatus } from "./it-service-inquiries";

export type AdminITServiceInquiryRecord = {
  businessEmail: string;
  companyName: string;
  contactNumber: string;
  id: string;
  name: string;
  projectBrief: string;
  serviceRequired: string;
  status: ITServiceInquiryStatus;
  submittedAt: string;
  submittedAtLabel: string;
  submittedAtLongLabel: string;
  submittedOn: string;
};

export type AdminITServicesSummary = {
  closedInquiries: number;
  contactedInquiries: number;
  latestSubmission: string | null;
  pendingInquiries: number;
  recentSubmissions: number;
  totalInquiries: number;
};
