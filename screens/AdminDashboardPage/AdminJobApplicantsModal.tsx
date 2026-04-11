"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  Download,
  FileText,
  Link2,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  AdminJobApplicantRecord,
  AdminJobApplicantsResponse,
  AdminJobApplicantsSummary,
} from "@/lib/admin-job-applications-shared";
import type { AdminJobListingRecord } from "@/lib/admin-jobs-shared";
import { formatCandidateProfileBytes } from "@/lib/candidate-profile-shared";
import { cn } from "@/lib/utils";

type AdminJobApplicantsModalProps = {
  isOpen: boolean;
  job: AdminJobListingRecord | null;
  onClose: () => void;
};

const createEmptySummary = (): AdminJobApplicantsSummary => ({
  latestAppliedAtLabel: null,
  resumeCount: 0,
  shortlistedCount: 0,
  totalApplicants: 0,
});

const formatApplicationStatusLabel = (status: string) =>
  status
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getApplicationStatusBadgeClassName = (status: string) => {
  if (status === "hired") {
    return "bg-[#eafbf5] text-[#0b9f6d]";
  }

  if (status === "shortlisted") {
    return "bg-[#eff8ff] text-[#00adef]";
  }

  if (status === "reviewing") {
    return "bg-[#fff6e5] text-[#d58a00]";
  }

  if (status === "rejected") {
    return "bg-[#fff1f1] text-[#d84b4b]";
  }

  return "bg-[#f3f5fb] text-[#66728f]";
};

const exportButtonClassName =
  "inline-flex h-[48px] items-center gap-2 rounded-[18px] px-5 text-[14px] font-semibold transition-colors duration-200";

const ApplicantResumeCell = ({
  application,
}: {
  application: AdminJobApplicantRecord;
}) =>
  application.hasResume ? (
    <div className="min-w-[170px]">
      <p className="text-[14px] font-semibold text-[#1d223f]">
        {application.resumeOriginalName || "Resume uploaded"}
      </p>
      <p className="mt-1 text-[13px] text-[#6f7b98]">
        {formatCandidateProfileBytes(application.resumeBytes)}
      </p>
      {application.resumeDownloadUrl ? (
        <a
          href={application.resumeDownloadUrl}
          rel="noreferrer"
          target="_blank"
          className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-[#00adef] hover:text-[#008fc7]"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </a>
      ) : null}
    </div>
  ) : (
    <span className="text-[14px] text-[#6f7b98]">No resume</span>
  );

export const AdminJobApplicantsModal = ({
  isOpen,
  job,
  onClose,
}: AdminJobApplicantsModalProps) => {
  const [applications, setApplications] = useState<AdminJobApplicantRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<AdminJobApplicantsSummary>(
    createEmptySummary(),
  );

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

  useEffect(() => {
    if (!isOpen || !job) {
      return;
    }

    let isCancelled = false;

    const loadApplications = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setApplications([]);
      setSummary(createEmptySummary());

      try {
        const response = await fetch(
          `/api/admin/job-listings/${job.id}/applications`,
          {
            cache: "no-store",
          },
        );
        const data = (await response.json().catch(() => null)) as
          | AdminJobApplicantsResponse
          | { message?: string }
          | null;

        if (isCancelled) {
          return;
        }

        if (!response.ok) {
          setErrorMessage(
            data && "message" in data && typeof data.message === "string"
              ? data.message
              : "Unable to load applicants for this job right now.",
          );
          return;
        }

        setApplications(
          data && "applications" in data && Array.isArray(data.applications)
            ? data.applications
            : [],
        );
        setSummary(
          data && "summary" in data && data.summary
            ? data.summary
            : createEmptySummary(),
        );
        setErrorMessage(
          data && "errorMessage" in data && typeof data.errorMessage === "string"
            ? data.errorMessage
            : null,
        );
      } catch {
        if (!isCancelled) {
          setErrorMessage("Unable to load applicants for this job right now.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadApplications();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, job]);

  const exportHref = useMemo(
    () =>
      job
        ? `/api/admin/job-listings/${job.id}/applications?format=csv`
        : "#",
    [job],
  );

  if (!isOpen || !job) {
    return null;
  }

  const infoCards = [
    {
      icon: Users,
      label: "Applicants",
      value: `${summary.totalApplicants}`,
    },
    {
      icon: FileText,
      label: "Resumes",
      value: `${summary.resumeCount}`,
    },
    {
      icon: Sparkles,
      label: "Shortlisted",
      value: `${summary.shortlistedCount}`,
    },
    {
      icon: CalendarDays,
      label: "Latest Applied",
      value: summary.latestAppliedAtLabel || "No applications yet",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d223f]/58 px-4 py-6 backdrop-blur-[5px] sm:px-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-[1280px] flex-col overflow-hidden rounded-[34px] bg-white shadow-[0_32px_90px_rgba(29,34,63,0.3)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close job applicants modal"
          className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe5f1] bg-white text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto">
          <div className="bg-[linear-gradient(180deg,#eef9ff_0%,#ffffff_100%)] px-6 pb-7 pt-7 sm:px-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eaf8ff] text-[#00adef]">
              <Users className="h-6 w-6" />
            </div>
            <p className="mt-6 text-[14px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
              Job Applicants
            </p>
            <div className="mt-2 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h2 className="text-[32px] font-bold leading-[1.1] text-[#1d223f] sm:text-[38px]">
                  {job.jobTitle}
                </h2>
                <p className="mt-3 max-w-[760px] text-[15px] leading-[1.7] text-[#6b7894] sm:text-[16px]">
                  Review every candidate who applied for this role and export the
                  job-wise applicant list for Excel.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={exportHref}
                  className={cn(
                    exportButtonClassName,
                    summary.totalApplicants > 0
                      ? "bg-[#1d223f] text-white hover:bg-[#2b3561]"
                      : "pointer-events-none bg-[#edf2f8] text-[#94a3b8]",
                  )}
                >
                  <Download className="h-4 w-4" />
                  Export Excel
                </a>
              </div>
            </div>
          </div>

          <div className="px-6 pb-8 pt-6 sm:px-8 sm:pb-10">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {infoCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="rounded-[24px] border border-[#dde7f2] bg-[#fbfdff] p-5"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#eef8ff] text-[#00adef]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7a87a4]">
                      {card.label}
                    </p>
                    <p className="mt-2 text-[15px] font-semibold leading-[1.6] text-[#1d223f]">
                      {card.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {errorMessage ? (
              <div className="mt-6 rounded-[20px] border border-[#fde3b0] bg-[#fff9eb] px-4 py-3 text-[14px] font-medium text-[#9a6700]">
                {errorMessage}
              </div>
            ) : null}

            {isLoading ? (
              <div className="mt-6 rounded-[28px] border border-[#dde7f2] bg-white px-6 py-12 text-center text-[15px] text-[#6b7894]">
                Loading applicants for this job...
              </div>
            ) : applications.length > 0 ? (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[1220px] border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-[12px] font-bold uppercase tracking-[0.16em] text-[#7c89a5]">
                      <th className="px-4 pb-1">Candidate</th>
                      <th className="px-4 pb-1">Contact</th>
                      <th className="px-4 pb-1">Current Role</th>
                      <th className="px-4 pb-1">Location</th>
                      <th className="px-4 pb-1">Experience</th>
                      <th className="px-4 pb-1">Applied</th>
                      <th className="px-4 pb-1">Status</th>
                      <th className="px-4 pb-1">Resume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.applicationId} className="bg-[#fbfdff]">
                        <td className="rounded-l-[22px] border-y border-l border-[#e6eef6] px-4 py-4 align-top">
                          <div className="min-w-[180px]">
                            <p className="text-[15px] font-semibold text-[#1d223f]">
                              {application.candidateName}
                            </p>
                            {application.linkedinUrl ? (
                              <a
                                href={application.linkedinUrl}
                                rel="noreferrer"
                                target="_blank"
                                className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-[#00adef] hover:text-[#008fc7]"
                              >
                                <Link2 className="h-3.5 w-3.5" />
                                LinkedIn
                              </a>
                            ) : (
                              <p className="mt-2 text-[13px] text-[#6f7b98]">
                                LinkedIn not added
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4 align-top">
                          <div className="min-w-[220px] space-y-2">
                            <a
                              href={`mailto:${application.candidateEmail}`}
                              className="flex items-start gap-2 text-[14px] font-medium text-[#1d223f] hover:text-[#00adef]"
                            >
                              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#00adef]" />
                              <span className="break-all">{application.candidateEmail}</span>
                            </a>
                            <div className="flex items-start gap-2 text-[14px] text-[#52607d]">
                              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#00adef]" />
                              <span>{application.contactNumber || "Not added"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4 align-top">
                          <div className="min-w-[190px]">
                            <p className="flex items-start gap-2 text-[14px] font-semibold text-[#1d223f]">
                              <BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0 text-[#00adef]" />
                              <span>
                                {application.currentPosition || "Position not added"}
                              </span>
                            </p>
                            <p className="mt-2 text-[13px] text-[#6f7b98]">
                              {application.currentCompany || "Company not added"}
                            </p>
                            <p className="mt-2 text-[13px] text-[#6f7b98]">
                              Notice period: {application.noticePeriod || "Not specified"}
                            </p>
                          </div>
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4 align-top text-[14px] text-[#52607d]">
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00adef]" />
                            <span>{application.currentLocation || "Not specified"}</span>
                          </div>
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4 align-top text-[14px] font-medium text-[#1d223f]">
                          {application.experienceLabel}
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4 align-top text-[14px] text-[#52607d]">
                          {application.appliedAtLabel}
                        </td>
                        <td className="border-y border-[#e6eef6] px-4 py-4 align-top">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-3 py-1.5 text-[12px] font-bold",
                              getApplicationStatusBadgeClassName(
                                application.applicationStatus,
                              ),
                            )}
                          >
                            {formatApplicationStatusLabel(application.applicationStatus)}
                          </span>
                        </td>
                        <td className="rounded-r-[22px] border-y border-r border-[#e6eef6] px-4 py-4 align-top">
                          <ApplicantResumeCell application={application} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-6 rounded-[28px] border border-[#dde7f2] bg-white px-6 py-12 text-center">
                <p className="text-[18px] font-semibold text-[#1d223f]">
                  No applications yet for this job
                </p>
                <p className="mt-2 text-[14px] leading-[1.7] text-[#6b7894]">
                  Once candidates start applying, their details will appear here
                  and the export button will become available.
                </p>
              </div>
            )}

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
