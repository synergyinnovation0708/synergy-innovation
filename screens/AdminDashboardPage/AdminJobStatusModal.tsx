"use client";

import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Clock3,
  FileText,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { AdminJobListingRecord } from "@/lib/admin-jobs-shared";
import {
  jobListingStatuses,
  type JobListingStatus,
} from "@/lib/job-listings";

type AdminJobStatusModalProps = {
  isOpen: boolean;
  job: AdminJobListingRecord | null;
  onClose: () => void;
  onUpdated: () => void;
};

type SaveState = {
  message: string;
  type: "error" | "success";
};

const statusDescriptions: Record<JobListingStatus, string> = {
  Active: "Make this role live and visible as an active opening.",
  Archived: "Close this role and keep it only for record keeping.",
  Draft: "Keep this role in progress until it is ready to publish.",
  "Upcoming Requirement":
    "Mark this role as planned so the team can prepare ahead.",
  "Urgent Requirement":
    "Highlight this role as high priority for immediate attention.",
};

const statusIcons = {
  Active: CheckCircle2,
  Archived: Archive,
  Draft: FileText,
  "Upcoming Requirement": Clock3,
  "Urgent Requirement": AlertTriangle,
} satisfies Record<JobListingStatus, typeof CheckCircle2>;

export const AdminJobStatusModal = ({
  isOpen,
  job,
  onClose,
  onUpdated,
}: AdminJobStatusModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<JobListingStatus>("Draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveState, setSaveState] = useState<SaveState | null>(null);

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
    setSelectedStatus(job?.status ?? "Draft");
    setIsSubmitting(false);
    setSaveState(null);
  }, [isOpen, job]);

  if (!isOpen || !job) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSaveState(null);

    try {
      const response = await fetch(`/api/admin/job-listings/${job.id}/status`, {
        body: JSON.stringify({ status: selectedStatus }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
      const data = (await response.json().catch(() => null)) as
        | {
            message?: string;
          }
        | null;

      if (!response.ok) {
        setSaveState({
          message: data?.message ?? "Unable to update job status right now.",
          type: "error",
        });
        return;
      }

      setSaveState({
        message: data?.message ?? "Job status updated successfully.",
        type: "success",
      });
      onUpdated();
      onClose();
    } catch {
      setSaveState({
        message: "Network error. Please try again in a moment.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d223f]/58 px-4 py-6 backdrop-blur-[5px] sm:px-6"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-[620px] flex-col overflow-hidden rounded-[34px] bg-white shadow-[0_32px_90px_rgba(29,34,63,0.3)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close job status modal"
          className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe5f1] bg-white text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-[linear-gradient(180deg,#eef9ff_0%,#ffffff_100%)] px-6 pb-7 pt-7 sm:px-8">
          <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
            Update Status
          </p>
          <h2 className="mt-2 text-[32px] font-bold leading-[1.1] text-[#1d223f] sm:text-[38px]">
            Change job status
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-[#6b7894] sm:text-[16px]">
            Update the hiring workflow stage for <strong>{job.jobTitle}</strong>.
          </p>
        </div>

        <form className="px-6 pb-8 pt-2 sm:px-8 sm:pb-10" onSubmit={handleSubmit}>
          <div className="space-y-3">
            {jobListingStatuses.map((status) => {
              const Icon = statusIcons[status];
              const isSelected = selectedStatus === status;

              return (
                <label
                  key={status}
                  className={`flex cursor-pointer items-start gap-4 rounded-[22px] border px-4 py-4 transition-colors duration-200 ${
                    isSelected
                      ? "border-[#1d223f] bg-[#f6f9ff]"
                      : "border-[#dbe5f1] bg-white hover:bg-[#f8fbff]"
                  }`}
                >
                  <input
                    type="radio"
                    name="job-status"
                    value={status}
                    checked={isSelected}
                    className="mt-1 h-4 w-4 shrink-0"
                    onChange={() => setSelectedStatus(status)}
                  />
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#eef8ff] text-[#00adef]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[16px] font-semibold text-[#1d223f]">
                      {status}
                    </span>
                    <span className="mt-1 block text-[14px] leading-[1.6] text-[#6b7894]">
                      {statusDescriptions[status]}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          {saveState ? (
            <p
              className={`mt-6 text-[14px] font-medium ${
                saveState.type === "success" ? "text-[#15803d]" : "text-[#dc2626]"
              }`}
            >
              {saveState.message}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 border-t border-[#e5edf6] pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-[52px] items-center justify-center rounded-full border border-[#dbe5f1] px-6 text-[15px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#1d223f] px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#2b3561] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
