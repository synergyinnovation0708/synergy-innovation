"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  IndianRupee,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  jobDepartments,
  jobEmploymentTypes,
  jobListingLocations,
  jobListingStatuses,
  jobWorkModes,
} from "@/lib/job-listings";
import { cn } from "@/lib/utils";
import { FooterSection } from "../HomePage/sections/FooterSection";
import { NavigationHeaderSection } from "../HomePage/sections/NavigationHeaderSection";
import { JobDetailsModal } from "./JobDetailsModal";
import {
  experienceBuckets,
  getJobInitials,
  type ExperienceBucketId,
  type JobsSortOption,
  type PublicJobListing,
} from "./jobsData";

type JobsPageProps = {
  errorMessage: string | null;
  initialAppliedJobIds?: string[];
  initialKeyword?: string;
  initialLocation?: string;
  jobs: PublicJobListing[];
};

type FilterSectionId =
  | "department"
  | "employmentType"
  | "experience"
  | "location"
  | "status"
  | "workMode";

type ApplicationStatus = {
  message: string;
  type: "error" | "info" | "success";
};

const sidebarSectionClassName =
  "rounded-[28px] border border-[#dce7f2] bg-white/88 p-5 shadow-[0_16px_40px_rgba(29,34,63,0.06)] backdrop-blur-sm";
const JOBS_PAGE_BATCH_SIZE = 8;

const initialFilterSections: Record<FilterSectionId, boolean> = {
  department: true,
  employmentType: true,
  experience: true,
  location: true,
  status: true,
  workMode: true,
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

const FilterCheckbox = ({
  checked,
  count,
  label,
  onToggle,
}: {
  checked: boolean;
  count: number;
  label: string;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={cn(
      "flex w-full items-center justify-between gap-2.5 rounded-[18px] px-2.5 py-2.5 text-left transition-colors duration-200",
      checked
        ? "bg-[#eef8ff] text-[#1d223f] shadow-[inset_0_0_0_1px_rgba(0,173,239,0.18)]"
        : "hover:bg-[#f4f8fc]",
    )}
  >
    <span className="flex min-w-0 flex-1 items-center gap-2.5">
      <span
        className={cn(
          "inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition-colors duration-200",
          checked
            ? "border-[#00adef] bg-[#00adef] text-white"
            : "border-[#c9d6e5] bg-white text-transparent",
        )}
      >
        <span className="h-2 w-2 rounded-full bg-current" />
      </span>
      <span className="min-w-0 text-[14px] font-medium leading-[1.35] lg:whitespace-nowrap">
        {label}
      </span>
    </span>
    <span
      className={cn(
        "inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-2 text-[11px] font-semibold",
        checked
          ? "bg-white text-[#00adef]"
          : "bg-[#f3f7fb] text-[#64708c]",
      )}
    >
      {count}
    </span>
  </button>
);

const FilterSection = ({
  children,
  isOpen,
  onToggle,
  title,
}: {
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  title: string;
}) => (
  <section className="rounded-[22px] border border-[#edf3f9] bg-white/72 p-3">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 text-left"
    >
      <h3 className="text-[15px] font-bold uppercase tracking-[0.14em] text-[#6f7b98]">
        {title}
      </h3>
      <ChevronDown
        className={cn(
          "h-4 w-4 text-[#6f7b98] transition-transform duration-200",
          isOpen ? "rotate-180" : "",
        )}
      />
    </button>

    {isOpen ? <div className="mt-3 space-y-1.5">{children}</div> : null}
  </section>
);

const JobCard = ({
  hasApplied,
  isApplying,
  job,
  onApply,
  onViewDetails,
}: {
  hasApplied: boolean;
  isApplying: boolean;
  job: PublicJobListing;
  onApply: () => void;
  onViewDetails: () => void;
}) => (
  <article className="overflow-hidden rounded-[30px] border border-[#dbe7f2] bg-white shadow-[0_18px_48px_rgba(29,34,63,0.08)]">
    <div
      className={cn(
        "h-1.5 w-full",
        job.status === "Urgent Requirement"
          ? "bg-[linear-gradient(90deg,#d84b4b_0%,#ffb2b2_100%)]"
          : job.status === "Active"
            ? "bg-[linear-gradient(90deg,#00adef_0%,#7fe0ff_100%)]"
            : "bg-[linear-gradient(90deg,#1d223f_0%,#6b79aa_100%)]",
      )}
    />

    <div className="p-6 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#1d223f_0%,#00adef_100%)] text-[16px] font-bold tracking-[0.08em] text-white">
            {getJobInitials(job.companyName)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex rounded-full border px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em]",
                  getStatusBadgeClassName(job.status),
                )}
              >
                {job.status}
              </span>
              <span className="inline-flex rounded-full bg-[#f4f7fb] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] text-[#6b7897]">
                {job.employmentType}
              </span>
              <span className="inline-flex rounded-full bg-[#eef6ff] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] text-[#1d223f]">
                {job.workMode}
              </span>
            </div>

            <h3 className="mt-3 text-[24px] font-bold leading-[1.15] text-[#1d223f]">
              {job.jobTitle}
            </h3>
            <p className="mt-2 flex items-center gap-2 text-[15px] font-medium text-[#5f6c88]">
              <Building2 className="h-4 w-4 text-[#00adef]" />
              {job.companyName}
            </p>
          </div>
        </div>

        <p className="rounded-full bg-[#f3f8fc] px-3 py-1.5 text-[13px] font-semibold text-[#5d6984]">
          {job.postedLabel}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[20px] bg-[#f7fbff] px-4 py-3">
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7a87a3]">
            <BriefcaseBusiness className="h-4 w-4 text-[#00adef]" />
            Experience
          </p>
          <p className="mt-2 text-[16px] font-semibold text-[#1d223f]">{job.experienceLabel}</p>
        </div>
        <div className="rounded-[20px] bg-[#f7fbff] px-4 py-3">
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7a87a3]">
            <MapPin className="h-4 w-4 text-[#00adef]" />
            Location
          </p>
          <p className="mt-2 text-[16px] font-semibold text-[#1d223f]">{job.location}</p>
        </div>
        <div className="rounded-[20px] bg-[#f7fbff] px-4 py-3">
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7a87a3]">
            <IndianRupee className="h-4 w-4 text-[#00adef]" />
            Salary
          </p>
          <p className="mt-2 text-[16px] font-semibold text-[#1d223f]">{job.salaryLabel}</p>
        </div>
      </div>

      <p className="mt-6 text-[15px] leading-[1.75] text-[#63708c]">
        {job.jobSummaryText || "No summary added for this job yet."}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {job.requiredSkills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-[#d7e6f2] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#4d5b77]"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-[#e3edf6] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#63708c]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f3f8fc] px-3 py-1.5 font-medium">
            <Clock3 className="h-4 w-4 text-[#00adef]" />
            {job.applicants} applied
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f3f8fc] px-3 py-1.5 font-medium">
            <Users className="h-4 w-4 text-[#00adef]" />
            {job.openings} openings
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f3f8fc] px-3 py-1.5 font-medium">
            <CalendarDays className="h-4 w-4 text-[#00adef]" />
            Deadline {job.applicationDeadline}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onViewDetails}
            className="inline-flex h-[46px] items-center justify-center rounded-full border border-[#d4e1ee] px-5 text-[15px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
          >
            View details
          </button>
          <button
            type="button"
            onClick={onApply}
            disabled={isApplying || hasApplied}
            className={cn(
              "inline-flex h-[46px] items-center justify-center rounded-full text-[15px] font-semibold transition-all duration-200",
              hasApplied
                ? "min-w-[118px] cursor-not-allowed gap-2 border border-[#b8ecff] bg-[#effbff] px-5 text-[#008fc7]"
                : isApplying
                  ? "cursor-not-allowed gap-3 bg-[#1d223f] px-5 text-white opacity-70"
                  : "group gap-3 bg-[#1d223f] pl-5 pr-1.5 text-white hover:-translate-y-0.5",
            )}
          >
            {hasApplied ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Applied</span>
              </>
            ) : isApplying ? (
              "Applying..."
            ) : (
              "Apply now"
            )}
            {!hasApplied && !isApplying ? (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/10">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45" />
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </div>
  </article>
);

export const JobsPage = ({
  errorMessage,
  initialAppliedJobIds = [],
  initialKeyword = "",
  initialLocation = "",
  jobs,
}: JobsPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoApplyJobIdRef = useRef<string | null>(null);
  const applyToJobRef = useRef<
    ((job: PublicJobListing, options?: { clearPendingApply?: boolean }) => Promise<void>) | null
  >(null);
  const clearPendingApplyQueryRef = useRef<(() => void) | null>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);
  const [jobsState, setJobsState] = useState(jobs);
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatus | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(initialAppliedJobIds);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [locationQuery, setLocationQuery] = useState(initialLocation);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<string[]>([]);
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceBucketId[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<PublicJobListing | null>(null);
  const [sortBy, setSortBy] = useState<JobsSortOption>("latest");
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(true);
  const [visibleJobsCount, setVisibleJobsCount] = useState(JOBS_PAGE_BATCH_SIZE);
  const [openSections, setOpenSections] =
    useState<Record<FilterSectionId, boolean>>(initialFilterSections);

  const deferredKeyword = useDeferredValue(keyword);
  const deferredLocationQuery = useDeferredValue(locationQuery);
  const normalizedKeyword = deferredKeyword.trim().toLowerCase();
  const normalizedLocationQuery = deferredLocationQuery.trim().toLowerCase();

  const departmentSet = new Set(jobsState.map((job) => job.department));
  const departments = [
    ...jobDepartments.filter((department) => departmentSet.has(department)),
    ...Array.from(departmentSet).filter(
      (department) =>
        !jobDepartments.includes(department as (typeof jobDepartments)[number]),
    ),
  ];

  const employmentTypeSet = new Set(jobsState.map((job) => job.employmentType));
  const employmentTypes = [
    ...jobEmploymentTypes.filter((employmentType) =>
      employmentTypeSet.has(employmentType),
    ),
    ...Array.from(employmentTypeSet).filter(
      (employmentType) =>
        !jobEmploymentTypes.includes(
          employmentType as (typeof jobEmploymentTypes)[number],
        ),
    ),
  ];

  const workModeSet = new Set(jobsState.map((job) => job.workMode));
  const workModes = [
    ...jobWorkModes.filter((workMode) => workModeSet.has(workMode)),
    ...Array.from(workModeSet).filter(
      (workMode) => !jobWorkModes.includes(workMode as (typeof jobWorkModes)[number]),
    ),
  ];

  const locationSet = new Set(jobsState.flatMap((job) => job.locations));
  const locations = [
    ...jobListingLocations.filter((location) => locationSet.has(location)),
    ...Array.from(locationSet).filter(
      (location) =>
        !jobListingLocations.includes(location as (typeof jobListingLocations)[number]),
    ),
  ];

  const statusSet = new Set(jobsState.map((job) => job.status));
  const statuses = jobListingStatuses.filter((status) => statusSet.has(status));
  const availableExperienceBuckets = experienceBuckets.filter((bucket) =>
    jobsState.some((job) => job.experienceBucket === bucket.id),
  );

  const activeFilterCount =
    (keyword.trim() ? 1 : 0) +
    (locationQuery.trim() ? 1 : 0) +
    selectedDepartments.length +
    selectedEmploymentTypes.length +
    selectedWorkModes.length +
    selectedLocations.length +
    selectedExperience.length +
    selectedStatuses.length;

  const toggleOption = <T,>(items: T[], value: T, setItems: (next: T[]) => void) => {
    setItems(items.includes(value) ? items.filter((item) => item !== value) : [...items, value]);
  };

  const toggleSection = (sectionId: FilterSectionId) => {
    setOpenSections((currentSections) => ({
      ...currentSections,
      [sectionId]: !currentSections[sectionId],
    }));
  };

  const areAllSectionsOpen = Object.values(openSections).every(Boolean);

  const setAllSections = (isOpen: boolean) => {
    setOpenSections({
      department: isOpen,
      employmentType: isOpen,
      experience: isOpen,
      location: isOpen,
      status: isOpen,
      workMode: isOpen,
    });
  };

  const clearAllFilters = () => {
    setKeyword(initialKeyword);
    setLocationQuery(initialLocation);
    setSelectedDepartments([]);
    setSelectedEmploymentTypes([]);
    setSelectedWorkModes([]);
    setSelectedLocations([]);
    setSelectedExperience([]);
    setSelectedStatuses([]);
    setSortBy("latest");
  };

  const matchesJob = (job: PublicJobListing, ignoredGroup?: FilterSectionId) => {
    const searchableText = [
      job.jobTitle,
      job.companyName,
      job.department,
      job.location,
      job.requiredSkills.join(" "),
      job.jobSummaryText,
      job.status,
      job.employmentType,
      job.workMode,
    ]
      .join(" ")
      .toLowerCase();

    const matchesKeyword = normalizedKeyword ? searchableText.includes(normalizedKeyword) : true;
    const matchesLocationQuery = normalizedLocationQuery
      ? job.location.toLowerCase().includes(normalizedLocationQuery)
      : true;
    const matchesDepartment =
      ignoredGroup === "department" ||
      selectedDepartments.length === 0 ||
      selectedDepartments.includes(job.department);
    const matchesEmploymentType =
      ignoredGroup === "employmentType" ||
      selectedEmploymentTypes.length === 0 ||
      selectedEmploymentTypes.includes(job.employmentType);
    const matchesWorkMode =
      ignoredGroup === "workMode" ||
      selectedWorkModes.length === 0 || selectedWorkModes.includes(job.workMode);
    const matchesLocation =
      ignoredGroup === "location" ||
      selectedLocations.length === 0 ||
      job.locations.some((location) => selectedLocations.includes(location));
    const matchesExperience =
      ignoredGroup === "experience" ||
      selectedExperience.length === 0 ||
      selectedExperience.includes(job.experienceBucket);
    const matchesStatus =
      ignoredGroup === "status" ||
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(job.status);

    return (
      matchesKeyword &&
      matchesLocationQuery &&
      matchesDepartment &&
      matchesEmploymentType &&
      matchesWorkMode &&
      matchesLocation &&
      matchesExperience &&
      matchesStatus
    );
  };

  const countMatches = (group: FilterSectionId, option: string) =>
    jobsState.filter((job) => {
      if (!matchesJob(job, group)) {
        return false;
      }

      if (group === "department") {
        return job.department === option;
      }

      if (group === "employmentType") {
        return job.employmentType === option;
      }

      if (group === "workMode") {
        return job.workMode === option;
      }

      if (group === "status") {
        return job.status === option;
      }

      if (group === "location") {
        return job.locations.includes(option);
      }

      return job.experienceBucket === option;
    }).length;

  const filteredJobs = jobsState.filter((job) => matchesJob(job));

  const sortedJobs = [...filteredJobs].sort((firstJob, secondJob) => {
    if (sortBy === "salary") {
      return secondJob.salaryMaxLpa - firstJob.salaryMaxLpa;
    }

    if (sortBy === "latest") {
      return (
        new Date(secondJob.createdAt).getTime() - new Date(firstJob.createdAt).getTime()
      );
    }

    if (
      firstJob.status === "Urgent Requirement" &&
      secondJob.status !== "Urgent Requirement"
    ) {
      return -1;
    }

    if (
      firstJob.status !== "Urgent Requirement" &&
      secondJob.status === "Urgent Requirement"
    ) {
      return 1;
    }

    return secondJob.applicants - firstJob.applicants;
  });
  const visibleJobs = sortedJobs.slice(0, visibleJobsCount);
  const hasMoreJobs = visibleJobs.length < sortedJobs.length;

  const buildLoginRedirectPath = (job: PublicJobListing) =>
    `/candidate/login?redirectTo=${encodeURIComponent(
      `/jobs?applyJobId=${job.id}`,
    )}&jobTitle=${encodeURIComponent(job.jobTitle)}`;

  const clearPendingApplyQuery = () => {
    const nextParams = new URLSearchParams(searchParams.toString());

    nextParams.delete("applyJobId");

    const nextQuery = nextParams.toString();

    router.replace(nextQuery ? `/jobs?${nextQuery}` : "/jobs", {
      scroll: false,
    });
  };
  clearPendingApplyQueryRef.current = clearPendingApplyQuery;

  const updateAppliedJobState = (jobId: string, applicantsCount?: number) => {
    setJobsState((currentJobs) =>
      currentJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              applicants:
                typeof applicantsCount === "number"
                  ? applicantsCount
                  : job.applicants + 1,
            }
          : job,
      ),
    );
    setSelectedJob((currentJob) =>
      currentJob && currentJob.id === jobId
        ? {
            ...currentJob,
            applicants:
              typeof applicantsCount === "number"
                ? applicantsCount
                : currentJob.applicants + 1,
          }
        : currentJob,
    );
  };

  const applyToJob = async (
    job: PublicJobListing,
    options?: { clearPendingApply?: boolean },
  ) => {
    let shouldClearPendingApply = Boolean(options?.clearPendingApply);

    if (appliedJobIds.includes(job.id)) {
      setApplicationStatus({
        message: "You have already applied for this job.",
        type: "info",
      });

      if (shouldClearPendingApply) {
        clearPendingApplyQuery();
      }

      return;
    }

    if (applyingJobId === job.id) {
      return;
    }

    setApplicationStatus(null);
    setApplyingJobId(job.id);

    try {
      const response = await fetch("/api/candidate/job-applications", {
        body: JSON.stringify({
          jobId: job.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json().catch(() => null)) as
        | {
            applicantsCount?: number;
            message?: string;
          }
        | null;

      if (response.status === 401) {
        shouldClearPendingApply = false;
        router.push(buildLoginRedirectPath(job));
        return;
      }

      if (response.status === 403) {
        setApplicationStatus({
          message: data?.message ?? "Please sign in with a candidate account.",
          type: "error",
        });
        return;
      }

      if (response.status === 409) {
        setAppliedJobIds((currentIds) =>
          currentIds.includes(job.id) ? currentIds : [...currentIds, job.id],
        );
        setApplicationStatus({
          message: data?.message ?? "You have already applied for this job.",
          type: "info",
        });

        if (typeof data?.applicantsCount === "number") {
          updateAppliedJobState(job.id, data.applicantsCount);
        }

        return;
      }

      if (!response.ok) {
        setApplicationStatus({
          message: data?.message ?? "Unable to submit your application right now.",
          type: "error",
        });
        return;
      }

      setAppliedJobIds((currentIds) =>
        currentIds.includes(job.id) ? currentIds : [...currentIds, job.id],
      );
      updateAppliedJobState(job.id, data?.applicantsCount);
      setApplicationStatus({
        message: data?.message ?? "Your application has been submitted successfully.",
        type: "success",
      });
    } catch {
      setApplicationStatus({
        message: "Network error. Please try again in a moment.",
        type: "error",
      });
    } finally {
      setApplyingJobId(null);

      if (shouldClearPendingApply) {
        clearPendingApplyQuery();
      }
    }
  };
  applyToJobRef.current = applyToJob;

  useEffect(() => {
    const pendingJobId = searchParams.get("applyJobId");

    if (!pendingJobId || autoApplyJobIdRef.current === pendingJobId) {
      return;
    }

    const pendingJob = jobsState.find((job) => job.id === pendingJobId);

    if (!pendingJob) {
      clearPendingApplyQueryRef.current?.();
      return;
    }

    autoApplyJobIdRef.current = pendingJobId;
    void applyToJobRef.current?.(pendingJob, { clearPendingApply: true });
  }, [jobsState, searchParams]);

  useEffect(() => {
    setVisibleJobsCount(JOBS_PAGE_BATCH_SIZE);
  }, [
    sortBy,
    normalizedKeyword,
    normalizedLocationQuery,
    selectedDepartments,
    selectedEmploymentTypes,
    selectedExperience,
    selectedLocations,
    selectedStatuses,
    selectedWorkModes,
  ]);

  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;

    if (!sentinel || !hasMoreJobs) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (!firstEntry?.isIntersecting) {
          return;
        }

        setVisibleJobsCount((currentCount) =>
          Math.min(currentCount + JOBS_PAGE_BATCH_SIZE, sortedJobs.length),
        );
      },
      {
        rootMargin: "240px 0px",
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMoreJobs, sortedJobs.length, visibleJobsCount]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#edf7ff_0%,#f9fbff_26%,#ffffff_100%)] text-[#1d223f]">
      <NavigationHeaderSection />

      <section className="relative overflow-hidden border-b border-[#deebf6] bg-[linear-gradient(180deg,#eff8ff_0%,#ffffff_100%)]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle at top left, rgba(0,173,239,0.16), transparent 26%), radial-gradient(circle at right center, rgba(29,34,63,0.08), transparent 26%)",
          }}
        />

        <div className="relative mx-auto max-w-[1440px] px-4 pb-10 pt-10 sm:px-6 lg:px-8 lg:pb-14">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#00adef]">
                Job Search
              </p>
              {/* <h1 className="mt-3 text-[36px] font-bold leading-[1.05] text-[#1d223f] sm:text-[48px] lg:text-[60px]">
                Explore live jobs
                <br />
                sharper filters
              </h1>
              <p className="mt-4 max-w-[640px] text-[16px] leading-[1.8] text-[#62708c] sm:text-[18px]">
                Browse every role currently available from Supabase, refine the
                results with relevant filters, and open complete job details from
                the listing itself.
              </p> */}
            </div>

            {/* <div className="flex flex-wrap gap-3">
              <div className="rounded-[22px] border border-[#d7e7f4] bg-white px-4 py-3 shadow-[0_12px_32px_rgba(29,34,63,0.06)]">
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#7a87a3]">
                  Live Results
                </p>
                <p className="mt-2 text-[28px] font-bold text-[#1d223f]">{sortedJobs.length}</p>
              </div>
              <div className="rounded-[22px] border border-[#d7e7f4] bg-white px-4 py-3 shadow-[0_12px_32px_rgba(29,34,63,0.06)]">
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#7a87a3]">
                  Departments
                </p>
                <p className="mt-2 text-[28px] font-bold text-[#1d223f]">
                  {departments.length}
                </p>
              </div>
            </div> */}
          </div>

          <div className="mt-8 rounded-[34px] border border-[#dce8f3] bg-white/92 p-4 shadow-[0_22px_60px_rgba(29,34,63,0.08)] backdrop-blur-sm sm:p-5 lg:p-6">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_auto]">
              <label className="flex h-[64px] items-center gap-3 rounded-[24px] border border-[#dce8f3] bg-[#f8fbff] px-4">
                <Search className="h-5 w-5 text-[#00adef]" />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Search by role, skill, department, or status"
                  className="w-full bg-transparent text-[16px] font-medium text-[#1d223f] outline-none placeholder:text-[#8b97b2]"
                />
              </label>

              <label className="flex h-[64px] items-center gap-3 rounded-[24px] border border-[#dce8f3] bg-[#f8fbff] px-4">
                <MapPin className="h-5 w-5 text-[#00adef]" />
                <input
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  placeholder="Search by city"
                  className="w-full bg-transparent text-[16px] font-medium text-[#1d223f] outline-none placeholder:text-[#8b97b2]"
                />
              </label>

              <div className="flex gap-3 lg:justify-end">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex h-[64px] items-center justify-center rounded-[24px] border border-[#dce8f3] px-5 text-[15px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setIsFiltersPanelOpen((currentOpen) => !currentOpen)}
                  className="group inline-flex h-[64px] items-center gap-3 rounded-[24px] bg-[#1d223f] pl-6 pr-2 text-[16px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {isFiltersPanelOpen ? "Hide filters" : "Show filters"}
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/10">
                    <SlidersHorizontal className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div
          className={cn(
            "grid gap-6 lg:items-start",
            isFiltersPanelOpen
              ? "lg:grid-cols-[368px_minmax(0,1fr)]"
              : "lg:grid-cols-1",
          )}
        >
          {isFiltersPanelOpen ? (
            <aside className="lg:sticky lg:top-6">
              <div
                className={cn(
                  sidebarSectionClassName,
                  "lg:max-h-[calc(100vh-48px)] lg:overflow-hidden",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
                      Filters
                    </p>
                    <h2 className="mt-2 text-[28px] font-bold leading-[1.1] text-[#1d223f]">
                      Narrow the search
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d6e4f0] text-[#64708c] transition-colors duration-200 hover:bg-[#f4f8fc]"
                    aria-label="Reset filters"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAllSections(!areAllSectionsOpen)}
                    className="inline-flex h-10 items-center rounded-full border border-[#d6e4f0] px-4 text-[13px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
                  >
                    {areAllSectionsOpen ? "Collapse all" : "Expand all"}
                  </button>
                  <span className="rounded-full bg-[#eef3ff] px-3 py-1.5 text-[12px] font-bold text-[#4f6ed7]">
                    {activeFilterCount} active
                  </span>
                </div>

                <div
                  className="jobs-filter-scrollbar mt-6 space-y-4 lg:max-h-[calc(100vh-210px)] lg:overflow-y-auto lg:pr-4"
                  style={{ scrollbarGutter: "stable" }}
                >
                  <FilterSection
                    title="Department"
                    isOpen={openSections.department}
                    onToggle={() => toggleSection("department")}
                  >
                    {departments.map((department) => (
                      <FilterCheckbox
                        key={department}
                        checked={selectedDepartments.includes(department)}
                        count={countMatches("department", department)}
                        label={department}
                        onToggle={() =>
                          toggleOption(
                            selectedDepartments,
                            department,
                            setSelectedDepartments,
                          )
                        }
                      />
                    ))}
                  </FilterSection>

                  <FilterSection
                    title="Employment Type"
                    isOpen={openSections.employmentType}
                    onToggle={() => toggleSection("employmentType")}
                  >
                    {employmentTypes.map((employmentType) => (
                      <FilterCheckbox
                        key={employmentType}
                        checked={selectedEmploymentTypes.includes(employmentType)}
                        count={countMatches("employmentType", employmentType)}
                        label={employmentType}
                        onToggle={() =>
                          toggleOption(
                            selectedEmploymentTypes,
                            employmentType,
                            setSelectedEmploymentTypes,
                          )
                        }
                      />
                    ))}
                  </FilterSection>

                  <FilterSection
                    title="Work Mode"
                    isOpen={openSections.workMode}
                    onToggle={() => toggleSection("workMode")}
                  >
                    {workModes.map((workMode) => (
                      <FilterCheckbox
                        key={workMode}
                        checked={selectedWorkModes.includes(workMode)}
                        count={countMatches("workMode", workMode)}
                        label={workMode}
                        onToggle={() =>
                          toggleOption(selectedWorkModes, workMode, setSelectedWorkModes)
                        }
                      />
                    ))}
                  </FilterSection>

                  <FilterSection
                    title="Experience"
                    isOpen={openSections.experience}
                    onToggle={() => toggleSection("experience")}
                  >
                    {availableExperienceBuckets.map((bucket) => (
                      <FilterCheckbox
                        key={bucket.id}
                        checked={selectedExperience.includes(bucket.id)}
                        count={countMatches("experience", bucket.id)}
                        label={bucket.label}
                        onToggle={() =>
                          toggleOption(selectedExperience, bucket.id, setSelectedExperience)
                        }
                      />
                    ))}
                  </FilterSection>

                  <FilterSection
                    title="Location"
                    isOpen={openSections.location}
                    onToggle={() => toggleSection("location")}
                  >
                    {locations.map((location) => (
                      <FilterCheckbox
                        key={location}
                        checked={selectedLocations.includes(location)}
                        count={countMatches("location", location)}
                        label={location}
                        onToggle={() =>
                          toggleOption(selectedLocations, location, setSelectedLocations)
                        }
                      />
                    ))}
                  </FilterSection>

                  <FilterSection
                    title="Status"
                    isOpen={openSections.status}
                    onToggle={() => toggleSection("status")}
                  >
                    {statuses.map((status) => (
                      <FilterCheckbox
                        key={status}
                        checked={selectedStatuses.includes(status)}
                        count={countMatches("status", status)}
                        label={status}
                        onToggle={() =>
                          toggleOption(selectedStatuses, status, setSelectedStatuses)
                        }
                      />
                    ))}
                  </FilterSection>
                </div>
              </div>
            </aside>
          ) : null}

          <section className="min-w-0">
            <div className="rounded-[30px] border border-[#dce7f2] bg-white/88 p-5 shadow-[0_16px_40px_rgba(29,34,63,0.06)] backdrop-blur-sm sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
                    Search Results
                  </p>
                  <h2 className="mt-2 text-[30px] font-bold leading-[1.1] text-[#1d223f]">
                    {sortedJobs.length} jobs ready to review
                  </h2>
                  <p className="mt-2 text-[15px] leading-[1.7] text-[#68748f]">
                    Review every role from Supabase, compare details quickly, and
                    open the full job information when you need the complete view.
                  </p>
                  {sortedJobs.length > 0 ? (
                    <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7a87a3]">
                      Showing {visibleJobs.length} of {sortedJobs.length}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {/* <div className="rounded-[18px] border border-[#d9e5f1] bg-[#f8fbff] px-4 py-3 text-[14px] font-semibold text-[#61708b]">
                    {activeFilterCount} active filters
                  </div> */}
                  <label className="flex h-[52px] items-center gap-3 rounded-[18px] border border-[#d9e5f1] bg-white px-4">
                    <span className="text-[14px] font-semibold text-[#68748f]">
                      Sort by
                    </span>
                    <select
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(event.target.value as JobsSortOption)
                      }
                      className="bg-transparent text-[15px] font-semibold text-[#1d223f] outline-none"
                    >
                      <option value="latest">Latest</option>
                      <option value="relevance">Relevance</option>
                      <option value="salary">Highest salary</option>
                    </select>
                  </label>
                </div>
              </div>

              {errorMessage ? (
                <div className="mt-5 rounded-[20px] border border-[#fde3b0] bg-[#fff9eb] px-4 py-3 text-[14px] font-medium text-[#9a6700]">
                  {errorMessage}
                </div>
              ) : null}
              {applicationStatus ? (
                <div
                  className={cn(
                    "mt-5 rounded-[20px] px-4 py-3 text-[14px] font-medium",
                    applicationStatus.type === "success" &&
                      "border border-[#ccefd9] bg-[#f1fcf5] text-[#157347]",
                    applicationStatus.type === "info" &&
                      "border border-[#d8e9ff] bg-[#f4f9ff] text-[#1f5c99]",
                    applicationStatus.type === "error" &&
                      "border border-[#ffd8d8] bg-[#fff5f5] text-[#b53c3c]",
                  )}
                >
                  {applicationStatus.message}
                </div>
              ) : null}
            </div>

            {sortedJobs.length === 0 ? (
              <div className="mt-6 rounded-[30px] border border-dashed border-[#c8d8e7] bg-white p-10 text-center shadow-[0_16px_40px_rgba(29,34,63,0.04)]">
                <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
                  No matches
                </p>
                <h3 className="mt-3 text-[30px] font-bold text-[#1d223f]">
                  Try widening the filters
                </h3>
                <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-[1.7] text-[#67748f]">
                  The current search is too narrow. Clear a few filters or use a
                  broader keyword to bring more roles back into view.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-6 inline-flex h-[52px] items-center justify-center rounded-full bg-[#1d223f] px-6 text-[15px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Reset search
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {visibleJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    hasApplied={appliedJobIds.includes(job.id)}
                    isApplying={applyingJobId === job.id}
                    job={job}
                    onApply={() => void applyToJob(job)}
                    onViewDetails={() => setSelectedJob(job)}
                  />
                ))}
                {hasMoreJobs ? (
                  <div
                    ref={loadMoreSentinelRef}
                    className="flex min-h-[88px] items-center justify-center rounded-[26px] border border-dashed border-[#d5e3ef] bg-[#f8fbff] px-6 text-center"
                  >
                    <p className="text-[14px] font-medium text-[#6c7893]">
                      Loading more jobs as you scroll...
                    </p>
                  </div>
                ) : sortedJobs.length > JOBS_PAGE_BATCH_SIZE ? (
                  <div className="flex min-h-[72px] items-center justify-center rounded-[24px] border border-[#e3edf6] bg-white px-6 text-center">
                    <p className="text-[14px] font-medium text-[#6c7893]">
                      You&apos;ve reached the end of the current job list.
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </div>
      </main>

      <JobDetailsModal
        hasApplied={selectedJob ? appliedJobIds.includes(selectedJob.id) : false}
        isApplying={selectedJob ? applyingJobId === selectedJob.id : false}
        isOpen={selectedJob !== null}
        job={selectedJob}
        onApply={() => {
          if (selectedJob) {
            void applyToJob(selectedJob);
          }
        }}
        onClose={() => setSelectedJob(null)}
      />

      <FooterSection />
    </div>
  );
};
