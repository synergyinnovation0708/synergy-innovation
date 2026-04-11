import type {
  CandidateCertificationItem,
  CandidateEducationHistoryItem,
  CandidateEmploymentHistoryItem,
  CandidateItSkillItem,
  CandidateLanguageItem,
  CandidateProfessionalQualificationItem,
  CandidateProjectItem,
} from "./candidate-profile-shared";

export const adminCandidateAccountStatuses = ["active", "suspended"] as const;

export type AdminCandidateAccountStatus =
  (typeof adminCandidateAccountStatuses)[number];

export type AdminCandidateRecord = {
  applicationsCount: number;
  candidateName: string;
  currentCompany: string;
  currentLocation: string;
  currentPosition: string;
  email: string;
  experienceLabel: string;
  homeAddress: string;
  id: string;
  itSkills: CandidateItSkillItem[];
  joinedLabel: string;
  keySkills: string[];
  languages: CandidateLanguageItem[];
  lastActivityLabel: string;
  lastAppliedAtLabel: string | null;
  lastAppliedJobTitle: string | null;
  linkedinUrl: string;
  noticePeriod: string;
  portfolioUrl: string;
  preferredEmploymentTypes: string[];
  preferredJobTitles: string[];
  preferredLocations: string[];
  preferredWorkModes: string[];
  primarySkill: string;
  profileHeadline: string;
  profileSummary: string;
  professionalQualifications: CandidateProfessionalQualificationItem[];
  projects: CandidateProjectItem[];
  resumeBytes: number;
  resumeExtension: string;
  resumeOriginalName: string;
  resumeUrl: string;
  suspendedUntil: string | null;
  totalExperienceMonths: number;
  totalExperienceYears: number;
  workStatusLabel: string;
  accountStatus: AdminCandidateAccountStatus;
  contactNumber: string;
  currentAnnualCtc: string;
  dateOfBirth: string | null;
  educationHistory: CandidateEducationHistoryItem[];
  employmentHistory: CandidateEmploymentHistoryItem[];
  expectedAnnualCtc: string;
  gender: string;
  certifications: CandidateCertificationItem[];
};

export type AdminCandidatesSummary = {
  activeAccounts: number;
  profilesWithResume: number;
  suspendedAccounts: number;
  totalApplications: number;
  totalCandidates: number;
};
