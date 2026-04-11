export type AdminJobApplicantRecord = {
  applicationId: string;
  applicationStatus: string;
  appliedAt: string;
  appliedAtLabel: string;
  candidateEmail: string;
  candidateName: string;
  candidateUserId: string;
  contactNumber: string;
  currentCompany: string;
  currentLocation: string;
  currentPosition: string;
  experienceLabel: string;
  hasResume: boolean;
  linkedinUrl: string;
  noticePeriod: string;
  resumeBytes: number;
  resumeDownloadUrl: string;
  resumeOriginalName: string;
};

export type AdminJobApplicantsSummary = {
  latestAppliedAtLabel: string | null;
  resumeCount: number;
  shortlistedCount: number;
  totalApplicants: number;
};

export type AdminJobApplicantsResponse = {
  applications: AdminJobApplicantRecord[];
  errorMessage: string | null;
  summary: AdminJobApplicantsSummary;
};
