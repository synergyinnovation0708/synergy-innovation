"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  Download,
  FileText,
  Globe,
  Link2,
  Mail,
  MapPinned,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, type ComponentType, type ReactNode } from "react";
import type { AdminCandidateRecord } from "@/lib/admin-candidates-shared";
import { formatCandidateProfileBytes } from "@/lib/candidate-profile-shared";
import { cn } from "@/lib/utils";

type AdminCandidateDetailsModalProps = {
  candidate: AdminCandidateRecord | null;
  isOpen: boolean;
  onClose: () => void;
};

const accountStatusLabelMap = {
  active: "Active",
  suspended: "Suspended",
} as const;

const getAccountStatusBadgeClassName = (
  status: AdminCandidateRecord["accountStatus"],
) =>
  status === "active"
    ? "bg-[#eafbf5] text-[#0b9f6d]"
    : "bg-[#fff1f1] text-[#d84b4b]";

const formatListText = (values: string[], fallback = "Not specified") =>
  values.length > 0 ? values.join(", ") : fallback;

const formatDateText = (value: string | null, fallback = "Not specified") => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleDateString("en-IN", {
    dateStyle: "medium",
  });
};

const formatRangeText = (startValue: string, endValue: string, isCurrent = false) => {
  const startText = startValue || "Start not added";
  const endText = isCurrent ? "Present" : endValue || "End not added";

  return `${startText} - ${endText}`;
};

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) => {
  const Icon = icon;

  return (
    <div className="rounded-[24px] border border-[#dde7f2] bg-[#fbfdff] p-5">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#eef8ff] text-[#00adef]">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7a87a4]">
        {label}
      </p>
      <p className="mt-2 text-[15px] font-semibold leading-[1.6] text-[#1d223f]">
        {value}
      </p>
    </div>
  );
};

const Section = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <section className="rounded-[28px] border border-[#dde7f2] bg-white p-6">
    <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
      {title}
    </p>
    <div className="mt-4">{children}</div>
  </section>
);

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
}) => {
  const Icon = icon;

  return (
    <div className="flex items-start gap-3 rounded-[18px] bg-[#f8fbff] px-4 py-3">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-[#00adef]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7a87a4]">
          {label}
        </p>
        <div className="mt-1 break-words text-[15px] font-medium leading-[1.7] text-[#1d223f]">
          {value}
        </div>
      </div>
    </div>
  );
};

const TagList = ({
  emptyText,
  values,
}: {
  emptyText: string;
  values: string[];
}) =>
  values.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className="inline-flex rounded-full border border-[#dbe5f1] bg-[#f8fbff] px-3 py-2 text-[13px] font-semibold text-[#1d223f]"
        >
          {value}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-[14px] text-[#6b7894]">{emptyText}</p>
  );

export const AdminCandidateDetailsModal = ({
  candidate,
  isOpen,
  onClose,
}: AdminCandidateDetailsModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !candidate) {
    return null;
  }

  const infoCards = [
    {
      icon: BriefcaseBusiness,
      label: "Applications",
      value: `${candidate.applicationsCount}`,
    },
    {
      icon: Sparkles,
      label: "Experience",
      value: candidate.experienceLabel,
    },
    {
      icon: UserRound,
      label: "Work Status",
      value: candidate.workStatusLabel,
    },
    {
      icon: MapPinned,
      label: "Current Location",
      value: candidate.currentLocation,
    },
    {
      icon: CalendarDays,
      label: "Joined",
      value: candidate.joinedLabel,
    },
    {
      icon: CalendarDays,
      label: "Last Activity",
      value: candidate.lastActivityLabel,
    },
    {
      icon: BriefcaseBusiness,
      label: "Notice Period",
      value: candidate.noticePeriod,
    },
    {
      icon: FileText,
      label: "Resume",
      value: candidate.resumeOriginalName || "Not uploaded",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d223f]/58 px-4 py-6 backdrop-blur-[5px] sm:px-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-[34px] bg-white shadow-[0_32px_90px_rgba(29,34,63,0.3)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close candidate details modal"
          className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe5f1] bg-white text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto">
          <div className="bg-[linear-gradient(180deg,#eef9ff_0%,#ffffff_100%)] px-6 pb-7 pt-7 sm:px-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eaf8ff] text-[#00adef]">
              <UserRound className="h-6 w-6" />
            </div>
            <p className="mt-6 text-[14px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
              Candidate Details
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-[32px] font-bold leading-[1.1] text-[#1d223f] sm:text-[38px]">
                  {candidate.candidateName}
                </h2>
                <p className="mt-3 max-w-[760px] text-[15px] leading-[1.7] text-[#6b7894] sm:text-[16px]">
                  Review the complete candidate profile synced from Supabase,
                  including work preferences, background, and recruiter-facing
                  documents.
                </p>
                {candidate.lastAppliedJobTitle ? (
                  <p className="mt-3 text-[14px] font-medium text-[#1d223f]">
                    Last applied role: {candidate.lastAppliedJobTitle}
                    {candidate.lastAppliedAtLabel
                      ? ` (${candidate.lastAppliedAtLabel})`
                      : ""}
                  </p>
                ) : null}
              </div>
              <span
                className={cn(
                  "inline-flex rounded-full px-4 py-2 text-[13px] font-bold",
                  getAccountStatusBadgeClassName(candidate.accountStatus),
                )}
              >
                {accountStatusLabelMap[candidate.accountStatus]}
              </span>
            </div>
          </div>

          <div className="px-6 pb-8 pt-6 sm:px-8 sm:pb-10">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {infoCards.map((card) => (
                <InfoCard
                  key={card.label}
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                />
              ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <Section title="Profile Summary">
                <div className="space-y-4">
                  <div className="rounded-[20px] bg-[#f8fbff] p-4">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7a87a4]">
                      Headline
                    </p>
                    <p className="mt-2 text-[15px] font-semibold leading-[1.7] text-[#1d223f]">
                      {candidate.profileHeadline || "Not added"}
                    </p>
                  </div>
                  <div className="rounded-[20px] bg-[#f8fbff] p-4">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7a87a4]">
                      Summary
                    </p>
                    <p className="mt-2 text-[15px] leading-[1.8] text-[#52607d]">
                      {candidate.profileSummary || "Profile summary not added yet."}
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <DetailRow
                      icon={BriefcaseBusiness}
                      label="Current Company"
                      value={candidate.currentCompany || "Not specified"}
                    />
                    <DetailRow
                      icon={BriefcaseBusiness}
                      label="Current Position"
                      value={candidate.currentPosition || "Not specified"}
                    />
                    <DetailRow
                      icon={BriefcaseBusiness}
                      label="Current CTC"
                      value={candidate.currentAnnualCtc || "Not specified"}
                    />
                    <DetailRow
                      icon={BriefcaseBusiness}
                      label="Expected CTC"
                      value={candidate.expectedAnnualCtc || "Not specified"}
                    />
                  </div>
                </div>
              </Section>

              <Section title="Contact Information">
                <div className="grid gap-3">
                  <DetailRow icon={Mail} label="Email" value={candidate.email} />
                  <DetailRow
                    icon={Phone}
                    label="Contact Number"
                    value={candidate.contactNumber || "Not specified"}
                  />
                  <DetailRow
                    icon={UserRound}
                    label="Gender"
                    value={candidate.gender || "Not specified"}
                  />
                  <DetailRow
                    icon={CalendarDays}
                    label="Date of Birth"
                    value={formatDateText(candidate.dateOfBirth)}
                  />
                  <DetailRow
                    icon={MapPinned}
                    label="Home Address"
                    value={candidate.homeAddress || "Not specified"}
                  />
                  <DetailRow
                    icon={Link2}
                    label="LinkedIn"
                    value={
                      candidate.linkedinUrl ? (
                        <a
                          href={candidate.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#00adef] underline-offset-2 hover:underline"
                        >
                          {candidate.linkedinUrl}
                        </a>
                      ) : (
                        "Not added"
                      )
                    }
                  />
                  <DetailRow
                    icon={Globe}
                    label="Portfolio"
                    value={
                      candidate.portfolioUrl ? (
                        <a
                          href={candidate.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#00adef] underline-offset-2 hover:underline"
                        >
                          {candidate.portfolioUrl}
                        </a>
                      ) : (
                        "Not added"
                      )
                    }
                  />
                </div>
              </Section>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <Section title="Preferences">
                <div className="space-y-5">
                  <div>
                    <p className="text-[14px] font-semibold text-[#1d223f]">
                      Preferred Job Titles
                    </p>
                    <div className="mt-3">
                      <TagList
                        emptyText="No preferred job titles added."
                        values={candidate.preferredJobTitles}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#1d223f]">
                      Preferred Locations
                    </p>
                    <div className="mt-3">
                      <TagList
                        emptyText="No preferred locations added."
                        values={candidate.preferredLocations}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#1d223f]">
                      Preferred Employment Types
                    </p>
                    <div className="mt-3">
                      <TagList
                        emptyText="No preferred employment types added."
                        values={candidate.preferredEmploymentTypes}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#1d223f]">
                      Preferred Work Modes
                    </p>
                    <div className="mt-3">
                      <TagList
                        emptyText="No preferred work modes added."
                        values={candidate.preferredWorkModes}
                      />
                    </div>
                  </div>
                </div>
              </Section>

              <Section title="Skills and Languages">
                <div className="space-y-5">
                  <div className="rounded-[20px] bg-[#f8fbff] p-4">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7a87a4]">
                      Primary Skill
                    </p>
                    <p className="mt-2 text-[15px] font-semibold text-[#1d223f]">
                      {candidate.primarySkill}
                    </p>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#1d223f]">
                      Key Skills
                    </p>
                    <div className="mt-3">
                      <TagList
                        emptyText="No key skills added."
                        values={candidate.keySkills}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#1d223f]">
                      IT Skills
                    </p>
                    <div className="mt-3 space-y-3">
                      {candidate.itSkills.length > 0 ? (
                        candidate.itSkills.map((skill, index) => (
                          <div
                            key={`${skill.skill}-${index + 1}`}
                            className="rounded-[18px] bg-[#f8fbff] p-4"
                          >
                            <p className="text-[15px] font-semibold text-[#1d223f]">
                              {skill.skill || "Unnamed skill"}
                            </p>
                            <p className="mt-1 text-[14px] text-[#6b7894]">
                              {formatListText(
                                [
                                  skill.version && `Version ${skill.version}`,
                                  (skill.experienceYears || skill.experienceMonths) &&
                                    `${skill.experienceYears || "0"}y ${
                                      skill.experienceMonths || "0"
                                    }m`,
                                  skill.lastUsedYear &&
                                    `Last used ${skill.lastUsedYear}`,
                                ].filter((value): value is string => Boolean(value)),
                                "Additional IT skill details not added.",
                              )}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[14px] text-[#6b7894]">
                          No IT skills added.
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#1d223f]">
                      Languages
                    </p>
                    <div className="mt-3">
                      <TagList
                        emptyText="No languages added."
                        values={candidate.languages
                          .map((language) =>
                            language.proficiency
                              ? `${language.language} (${language.proficiency})`
                              : language.language,
                          )
                          .filter((value) => value.length > 0)}
                      />
                    </div>
                  </div>
                </div>
              </Section>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <Section title="Employment History">
                <div className="space-y-4">
                  {candidate.employmentHistory.length > 0 ? (
                    candidate.employmentHistory.map((employment, index) => (
                      <div
                        key={`${employment.companyName}-${employment.designation}-${index + 1}`}
                        className="rounded-[20px] bg-[#f8fbff] p-4"
                      >
                        <p className="text-[16px] font-semibold text-[#1d223f]">
                          {employment.designation || "Role not specified"}
                        </p>
                        <p className="mt-1 text-[14px] font-medium text-[#00adef]">
                          {employment.companyName || "Company not specified"}
                        </p>
                        <p className="mt-2 text-[14px] text-[#6b7894]">
                          {formatRangeText(
                            employment.startDate,
                            employment.endDate,
                            employment.currentlyWorking,
                          )}
                        </p>
                        <p className="mt-2 text-[14px] text-[#52607d]">
                          {formatListText(
                            [
                              employment.location,
                              employment.employmentType,
                            ].filter((value): value is string => Boolean(value)),
                            "Location and employment type not added.",
                          )}
                        </p>
                        {employment.description ? (
                          <p className="mt-3 text-[14px] leading-[1.7] text-[#52607d]">
                            {employment.description}
                          </p>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-[14px] text-[#6b7894]">
                      No employment history added yet.
                    </p>
                  )}
                </div>
              </Section>

              <Section title="Education History">
                <div className="space-y-4">
                  {candidate.educationHistory.length > 0 ? (
                    candidate.educationHistory.map((education, index) => (
                      <div
                        key={`${education.degree}-${education.institution}-${index + 1}`}
                        className="rounded-[20px] bg-[#f8fbff] p-4"
                      >
                        <p className="text-[16px] font-semibold text-[#1d223f]">
                          {education.degree || "Degree not specified"}
                        </p>
                        <p className="mt-1 text-[14px] font-medium text-[#00adef]">
                          {education.institution || "Institution not specified"}
                        </p>
                        <p className="mt-2 text-[14px] text-[#6b7894]">
                          {formatListText(
                            [
                              education.educationLevel,
                              education.specialization,
                              education.startYear &&
                                education.endYear &&
                                `${education.startYear} - ${education.endYear}`,
                              education.score &&
                                `${education.gradingType || "Score"}: ${education.score}`,
                            ].filter((value): value is string => Boolean(value)),
                            "Education details not added.",
                          )}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[14px] text-[#6b7894]">
                      No education history added yet.
                    </p>
                  )}
                </div>
              </Section>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <Section title="Projects">
                <div className="space-y-4">
                  {candidate.projects.length > 0 ? (
                    candidate.projects.map((project, index) => (
                      <div
                        key={`${project.title}-${project.role}-${index + 1}`}
                        className="rounded-[20px] bg-[#f8fbff] p-4"
                      >
                        <p className="text-[16px] font-semibold text-[#1d223f]">
                          {project.title || "Project title not added"}
                        </p>
                        <p className="mt-1 text-[14px] font-medium text-[#00adef]">
                          {project.role || "Role not specified"}
                        </p>
                        <p className="mt-2 text-[14px] text-[#6b7894]">
                          {formatRangeText(project.startDate, project.endDate)}
                        </p>
                        {project.technologies ? (
                          <p className="mt-2 text-[14px] text-[#52607d]">
                            Technologies: {project.technologies}
                          </p>
                        ) : null}
                        {project.description ? (
                          <p className="mt-3 text-[14px] leading-[1.7] text-[#52607d]">
                            {project.description}
                          </p>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-[14px] text-[#6b7894]">
                      No projects added yet.
                    </p>
                  )}
                </div>
              </Section>

              <Section title="Certifications and Qualifications">
                <div className="space-y-5">
                  <div>
                    <p className="text-[14px] font-semibold text-[#1d223f]">
                      Certifications
                    </p>
                    <div className="mt-3 space-y-3">
                      {candidate.certifications.length > 0 ? (
                        candidate.certifications.map((certification, index) => (
                          <div
                            key={`${certification.name}-${certification.issuer}-${index + 1}`}
                            className="rounded-[18px] bg-[#f8fbff] p-4"
                          >
                            <p className="text-[15px] font-semibold text-[#1d223f]">
                              {certification.name || "Certification not specified"}
                            </p>
                            <p className="mt-1 text-[14px] text-[#6b7894]">
                              {formatListText(
                                [
                                  certification.issuer,
                                  certification.year,
                                  certification.credentialId &&
                                    `Credential ID: ${certification.credentialId}`,
                                ].filter((value): value is string => Boolean(value)),
                                "Certification details not added.",
                              )}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[14px] text-[#6b7894]">
                          No certifications added.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-[14px] font-semibold text-[#1d223f]">
                      Professional Qualifications
                    </p>
                    <div className="mt-3 space-y-3">
                      {candidate.professionalQualifications.length > 0 ? (
                        candidate.professionalQualifications.map(
                          (qualification, index) => (
                            <div
                              key={`${qualification.title}-${qualification.institution}-${index + 1}`}
                              className="rounded-[18px] bg-[#f8fbff] p-4"
                            >
                              <p className="text-[15px] font-semibold text-[#1d223f]">
                                {qualification.title || "Qualification not specified"}
                              </p>
                              <p className="mt-1 text-[14px] text-[#6b7894]">
                                {formatListText(
                                  [
                                    qualification.institution,
                                    qualification.year,
                                  ].filter((value): value is string => Boolean(value)),
                                  "Qualification details not added.",
                                )}
                              </p>
                            </div>
                          ),
                        )
                      ) : (
                        <p className="text-[14px] text-[#6b7894]">
                          No professional qualifications added.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Section>
            </div>

            <div className="mt-6">
              <Section title="Resume">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                  <div className="grid gap-4 md:grid-cols-3">
                    <DetailRow
                      icon={FileText}
                      label="File Name"
                      value={candidate.resumeOriginalName || "No resume uploaded"}
                    />
                    <DetailRow
                      icon={FileText}
                      label="Extension"
                      value={candidate.resumeExtension || "Not available"}
                    />
                    <DetailRow
                      icon={ShieldCheck}
                      label="File Size"
                      value={formatCandidateProfileBytes(candidate.resumeBytes)}
                    />
                  </div>

                  {candidate.resumeUrl ? (
                    <a
                      href={`/api/admin/candidates/${candidate.id}/resume`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#1d223f] px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#2b3561]"
                    >
                      <Download className="h-4 w-4" />
                      View Resume
                    </a>
                  ) : (
                    <span className="inline-flex h-[52px] items-center justify-center rounded-full border border-[#dbe5f1] px-6 text-[15px] font-semibold text-[#7a87a4]">
                      Resume not uploaded
                    </span>
                  )}
                </div>
              </Section>
            </div>

            <div className="mt-8 flex justify-end border-t border-[#e5edf6] pt-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-[52px] items-center justify-center rounded-full border border-[#dbe5f1] px-6 text-[15px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
