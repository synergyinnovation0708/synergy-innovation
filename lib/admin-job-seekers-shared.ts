export type AdminJobSeekerRecord = {
  contactNumber: string;
  currentCompany: string;
  currentPosition: string;
  email: string;
  fullName: string;
  id: string;
  resumeBytes: number;
  resumeExtension: string;
  resumeOriginalName: string;
  resumeUrl: string;
  submittedAt: string;
  submittedAtLabel: string;
  submittedAtLongLabel: string;
};

export type AdminJobSeekersSummary = {
  latestSubmissionLabel: string | null;
  recentSubmissions: number;
  resumesUploaded: number;
  totalJobSeekers: number;
  uniqueEmails: number;
};
