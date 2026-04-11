"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  MapPin,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useEffect } from "react";
import type { PublicJobListing } from "@/lib/public-jobs-shared";
import { cn } from "@/lib/utils";

type JobDetailsModalProps = {
  hasApplied?: boolean;
  isApplying?: boolean;
  isOpen: boolean;
  job: PublicJobListing | null;
  onApply: () => void;
  onClose: () => void;
};

const getStatusBadgeClassName = (status: PublicJobListing["status"]) => {
  if (status === "Active") {
    return "border-[#b8ecff] bg-[#effbff] text-[#00adef]";
  }

  if (status === "Urgent Requirement") {
    return "border-[#ffc9c9] bg-[#fff1f1] text-[#d84b4b]";
  }

  if (status === "Upcoming Requirement") {
    return "border-[#ffe3a7] bg-[#fff8e7] text-[#d58a00]";
  }

  if (status === "Draft") {
    return "border-[#d7e4ff] bg-[#eef3ff] text-[#4f6ed7]";
  }

  return "border-[#dfe6f0] bg-[#f4f7fb] text-[#66728f]";
};

export const JobDetailsModal = ({
  hasApplied = false,
  isApplying = false,
  isOpen,
  job,
  onApply,
  onClose,
}: JobDetailsModalProps) => {
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

  if (!isOpen || !job) {
    return null;
  }

  const detailCards = [
    {
      icon: Building2,
      label: "Company",
      value: job.companyName,
    },
    {
      icon: BriefcaseBusiness,
      label: "Department",
      value: job.department,
    },
    {
      icon: BriefcaseBusiness,
      label: "Employment",
      value: `${job.employmentType} | ${job.workMode}`,
    },
    {
      icon: MapPin,
      label: "Locations",
      value: job.location,
    },
    {
      icon: Sparkles,
      label: "Experience",
      value: job.experienceLabel,
    },
    {
      icon: CircleDollarSign,
      label: "Salary",
      value: job.salaryLabel,
    },
    {
      icon: Users,
      label: "Hiring",
      value: `${job.openings} openings | ${job.applicants} applicants`,
    },
    {
      icon: CalendarDays,
      label: "Deadline",
      value: job.applicationDeadline,
    },
    {
      icon: CalendarDays,
      label: "Posted",
      value: job.postedLabel,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d223f]/58 px-4 py-6 backdrop-blur-[5px] sm:px-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-[34px] bg-white shadow-[0_32px_90px_rgba(29,34,63,0.3)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close job details modal"
          className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe5f1] bg-white text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto">
          <div className="bg-[linear-gradient(180deg,#eef9ff_0%,#ffffff_100%)] px-6 pb-7 pt-7 sm:px-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eaf8ff] text-[#00adef]">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <p className="mt-6 text-[14px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
              View Details
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-[32px] font-bold leading-[1.1] text-[#1d223f] sm:text-[38px]">
                  {job.jobTitle}
                </h2>
                <p className="mt-3 text-[16px] font-semibold text-[#5c6985] sm:text-[17px]">
                  {job.companyName}
                </p>
                <p className="mt-3 max-w-[720px] text-[15px] leading-[1.7] text-[#6b7894] sm:text-[16px]">
                  Review the full role overview, skills, responsibilities, and
                  hiring details for this opportunity.
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex rounded-full border px-4 py-2 text-[13px] font-bold",
                  getStatusBadgeClassName(job.status),
                )}
              >
                {job.status}
              </span>
            </div>
          </div>

          <div className="px-6 pb-8 pt-6 sm:px-8 sm:pb-10">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {detailCards.map((card) => {
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

            <div className="mt-6 rounded-[28px] border border-[#dde7f2] bg-white p-6">
              <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
                Required Skills
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.requiredSkills.length > 0 ? (
                  job.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex rounded-full border border-[#dbe5f1] bg-[#f8fbff] px-3 py-2 text-[13px] font-semibold text-[#1d223f]"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-[14px] text-[#6b7894]">No skills added yet.</p>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <section className="rounded-[28px] border border-[#dde7f2] bg-white p-6">
                <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
                  Job Summary
                </p>
                <div
                  className="mt-4 text-[15px] leading-[1.8] text-[#52607d] [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:ml-5 [&_ul]:list-disc"
                  dangerouslySetInnerHTML={{ __html: job.jobSummaryHtml }}
                />
              </section>

              <section className="rounded-[28px] border border-[#dde7f2] bg-white p-6">
                <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
                  Key Responsibilities
                </p>
                <div
                  className="mt-4 text-[15px] leading-[1.8] text-[#52607d] [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:ml-5 [&_ul]:list-disc"
                  dangerouslySetInnerHTML={{ __html: job.responsibilitiesHtml }}
                />
              </section>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-[#e5edf6] pt-6">
              <button
                type="button"
                onClick={onApply}
                disabled={isApplying || hasApplied}
                className={cn(
                  "inline-flex h-[52px] items-center justify-center rounded-full text-[15px] font-semibold transition-all duration-200",
                  hasApplied
                    ? "min-w-[128px] cursor-not-allowed gap-2 border border-[#b8ecff] bg-[#effbff] px-6 text-[#008fc7]"
                    : isApplying
                      ? "cursor-not-allowed bg-[#1d223f] px-6 text-white opacity-70"
                      : "group gap-3 bg-[#1d223f] px-6 text-white hover:-translate-y-0.5",
                )}
              >
                {hasApplied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Applied</span>
                  </>
                ) : (
                  <span>{isApplying ? "Applying..." : "Apply now"}</span>
                )}
                {!hasApplied && !isApplying ? (
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/10">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45" />
                  </span>
                ) : null}
              </button>
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
