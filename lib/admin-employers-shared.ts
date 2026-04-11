import type {
  EmployerInquiryFormValues,
  EmployerInquiryStatus,
} from "./employer-inquiries";

export type AdminEmployerRecord = {
  company: string;
  contactEmail: string;
  contactName: string;
  contactNumber: string;
  hiringRequirement: string;
  hiringType: string;
  hiringLocations: string[];
  id: string;
  locations: string;
  locationsTooltip: string;
  openRoles: number;
  status: EmployerInquiryStatus;
  submittedAt: string;
  submittedAtLabel: string;
  submittedAtLongLabel: string;
  submittedOn: string;
};

export type AdminEmployerUpdateValues = EmployerInquiryFormValues;

export type AdminEmployerSummary = {
  latestSubmission: string | null;
  onboardedEmployers: number;
  pendingEmployers: number;
  recentSubmissions: number;
  totalEmployers: number;
  totalPositions: number;
  uniqueLocations: number;
};
