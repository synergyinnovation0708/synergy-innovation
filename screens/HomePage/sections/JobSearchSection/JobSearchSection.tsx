"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type TouchEvent,
} from "react";
import type { PublicJobListing } from "@/lib/public-jobs-shared";
import { cn } from "@/lib/utils";

type JobSearchSectionProps = {
  errorMessage: string | null;
  jobs: PublicJobListing[];
};

type CarouselItem = {
  job: PublicJobListing;
  type: "job";
};

type InlineIconProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type SearchFieldId = "keyword" | "location";

const DESKTOP_JOBS_PER_SLIDE = 3;
const MOBILE_JOBS_PER_SLIDE = 1;
const DESKTOP_BREAKPOINT_QUERY = "(min-width: 1024px)";
const MAX_SLIDES = 3;
const MAX_TOTAL_CARDS = DESKTOP_JOBS_PER_SLIDE * MAX_SLIDES;
const MAX_SEARCH_SUGGESTIONS = 16;
const AUTO_CAROUSEL_INTERVAL_MS = 5000;

const InlineIcon = ({ src, alt, width, height }: InlineIconProps) => {
  return (
    // Small local SVGs don't benefit from next/image optimization.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="h-auto w-auto shrink-0"
      loading="lazy"
      decoding="async"
    />
  );
};

const SearchDropdownField = ({
  inputPlaceholder,
  isOpen,
  onSelectSuggestion,
  onToggle,
  suggestions,
  value,
  onValueChange,
}: {
  inputPlaceholder: string;
  isOpen: boolean;
  onSelectSuggestion: (value: string) => void;
  onToggle: () => void;
  onValueChange: (value: string) => void;
  suggestions: string[];
  value: string;
}) => {
  const normalizedValue = value.trim().toLowerCase();
  const filteredSuggestions = normalizedValue
    ? suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(normalizedValue),
    )
    : suggestions;

  return (
    <div className="relative lg:w-[295px]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex min-h-[46px] w-full items-center justify-between gap-6 text-left text-[16px] leading-[1.2] font-light text-[#1d223f] sm:text-[18px] md:text-[20px]"
      >
        <span className="truncate">{value.trim() || inputPlaceholder}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#1d223f]/50 transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          )}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-[calc(100%+14px)] z-20 w-full rounded-[24px] border border-[#dbe5f1] bg-white p-3 shadow-[0_20px_40px_rgba(29,34,63,0.12)]">
          <input
            type="text"
            autoFocus
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            placeholder={inputPlaceholder}
            className="h-11 w-full rounded-[16px] border border-[#dbe5f1] bg-[#f8fbff] px-4 text-[14px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8a97b3] focus:border-[#00adef]"
          />

          <div className="mt-3 max-h-[220px] space-y-1 overflow-y-auto">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSelectSuggestion(suggestion)}
                  className="flex w-full items-center rounded-[16px] px-3 py-2 text-left text-[14px] font-medium text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
                >
                  {suggestion}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-[14px] text-[#7f8aa5]">
                No matching options
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const getFeaturedJobs = (jobs: PublicJobListing[]) =>
  jobs
    .filter((job) => job.status !== "Draft" && job.status !== "Archived")
    .sort((firstJob, secondJob) => {
      const statusPriority = {
        "Urgent Requirement": 0,
        Active: 1,
        "Upcoming Requirement": 2,
      } as const;

      const firstPriority =
        statusPriority[firstJob.status as keyof typeof statusPriority] ?? 3;
      const secondPriority =
        statusPriority[secondJob.status as keyof typeof statusPriority] ?? 3;

      if (firstPriority !== secondPriority) {
        return firstPriority - secondPriority;
      }

      const createdAtDifference =
        new Date(secondJob.createdAt).getTime() -
        new Date(firstJob.createdAt).getTime();

      if (createdAtDifference !== 0) {
        return createdAtDifference;
      }

      return secondJob.openings - firstJob.openings;
    });

const buildCarouselItems = (jobs: PublicJobListing[]): CarouselItem[] => {
  if (jobs.length === 0) {
    return [];
  }

  return jobs.slice(0, MAX_TOTAL_CARDS).map(
    (job) =>
      ({
        job,
        type: "job",
      }) satisfies CarouselItem,
  );
};

const buildSlides = (items: CarouselItem[], cardsPerSlide: number) => {
  if (items.length <= cardsPerSlide) {
    return items.length > 0 ? [items] : [];
  }

  const slides: CarouselItem[][] = [];

  for (
    let index = 0;
    index <= items.length - cardsPerSlide;
    index += 1
  ) {
    slides.push(items.slice(index, index + cardsPerSlide));
  }

  return slides;
};

const formatSalary = (job: PublicJobListing) =>
  job.salaryMinLpa === 0 && job.salaryMaxLpa === 0 ? "Competitive" : job.salaryLabel;

const getStatusText = (job: PublicJobListing) =>
  job.status === "Active" ? "Active Hiring" : job.status;

export const JobSearchSection = ({
  errorMessage,
  jobs,
}: JobSearchSectionProps) => {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(DESKTOP_JOBS_PER_SLIDE);
  const [openField, setOpenField] = useState<SearchFieldId | null>(null);
  const [keywordQuery, setKeywordQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const searchFormRef = useRef<HTMLFormElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const featuredJobs = useMemo(() => getFeaturedJobs(jobs), [jobs]);
  const keywordSuggestions = useMemo(() => {
    const values = new Set<string>();

    for (const job of featuredJobs) {
      if (job.jobTitle.trim()) {
        values.add(job.jobTitle.trim());
      }

      if (job.department.trim()) {
        values.add(job.department.trim());
      }

      if (values.size >= MAX_SEARCH_SUGGESTIONS) {
        break;
      }
    }

    return Array.from(values).slice(0, MAX_SEARCH_SUGGESTIONS);
  }, [featuredJobs]);
  const locationSuggestions = useMemo(() => {
    const values = new Set<string>();

    for (const job of featuredJobs) {
      for (const location of job.locations) {
        if (location.trim()) {
          values.add(location.trim());
        }
      }

      if (values.size >= MAX_SEARCH_SUGGESTIONS) {
        break;
      }
    }

    return Array.from(values).slice(0, MAX_SEARCH_SUGGESTIONS);
  }, [featuredJobs]);
  const carouselItems = useMemo(
    () => buildCarouselItems(featuredJobs),
    [featuredJobs],
  );
  const jobSlides = useMemo(
    () => buildSlides(carouselItems, cardsPerSlide),
    [cardsPerSlide, carouselItems],
  );
  const currentSlide = Math.min(activeSlide, Math.max(jobSlides.length - 1, 0));

  const goToPreviousSlide = () => {
    setActiveSlide((current) =>
      Math.max(0, Math.min(current, Math.max(jobSlides.length - 1, 0))) <= 0
        ? Math.max(jobSlides.length - 1, 0)
        : Math.max(0, Math.min(current, Math.max(jobSlides.length - 1, 0))) -
        1,
    );
  };

  const goToNextSlide = () => {
    setActiveSlide((current) =>
      Math.max(0, Math.min(current, Math.max(jobSlides.length - 1, 0))) >=
        jobSlides.length - 1
        ? 0
        : Math.max(0, Math.min(current, Math.max(jobSlides.length - 1, 0))) +
        1,
    );
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || jobSlides.length <= 1) {
      touchStartXRef.current = null;
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = touchStartXRef.current - touchEndX;
    const swipeThreshold = 48;

    if (deltaX > swipeThreshold) {
      goToNextSlide();
    } else if (deltaX < -swipeThreshold) {
      goToPreviousSlide();
    }

    touchStartXRef.current = null;
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT_QUERY);

    const syncCardsPerSlide = (matchesDesktop: boolean) => {
      setCardsPerSlide(
        matchesDesktop ? DESKTOP_JOBS_PER_SLIDE : MOBILE_JOBS_PER_SLIDE,
      );
    };

    syncCardsPerSlide(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      syncCardsPerSlide(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (openField === null) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        searchFormRef.current &&
        event.target instanceof Node &&
        !searchFormRef.current.contains(event.target)
      ) {
        setOpenField(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenField(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openField]);

  useEffect(() => {
    if (jobSlides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) =>
        current >= jobSlides.length - 1 ? 0 : current + 1,
      );
    }, AUTO_CAROUSEL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [jobSlides.length]);

  const handleSearch = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setOpenField(null);

    const params = new URLSearchParams();
    const normalizedKeyword = keywordQuery.trim();
    const normalizedLocation = locationQuery.trim();

    if (normalizedKeyword) {
      params.set("q", normalizedKeyword);
    }

    if (normalizedLocation) {
      params.set("location", normalizedLocation);
    }

    const queryString = params.toString();
    router.push(queryString ? `/jobs?${queryString}` : "/jobs");
  };

  const handleClear = () => {
    setKeywordQuery("");
    setLocationQuery("");
    setOpenField(null);
    setActiveSlide(0);
  };

  return (
    <section className="relative w-full bg-white pb-16 pt-20 md:pb-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <header className="flex flex-col items-center text-center">
          <h2 className="text-[28px] leading-[1.2] font-medium text-[#1d223f] md:text-[32px]">
            Find where you belong
          </h2>
          <p className="mt-2 text-[30px] leading-[1.2] font-bold text-[#1d223f] sm:text-[36px] md:text-[46px]">
            <span className="text-[#00adef]">2000+ Openings</span>{" "}
            Just a Click Away
          </p>
          <div className="mt-6 h-1.5 w-[200px] rounded-[3px] bg-[#00adef]" />
        </header>

        <div className="relative mt-6">
          <div className="absolute inset-x-0 top-[105px] h-[300px] bg-[linear-gradient(180deg,rgba(0,173,239,0)_0%,rgba(0,173,239,0.06)_51%,rgba(0,173,239,0)_100%)]" />

          <div className="relative mx-auto max-w-[1240px] rounded-[16px] bg-white px-5 py-8 md:px-8">
            <h3 className="text-center text-[24px] leading-[1.2] font-medium text-[#1d223f]">
              Find Your Dream Job
            </h3>

            <form
              ref={searchFormRef}
              className="mt-6 rounded-[43px] bg-[#00adef]/[0.02] px-4 py-[18px] md:px-8"
              onSubmit={handleSearch}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <SearchDropdownField
                    inputPlaceholder="Job Title/Keyword"
                    isOpen={openField === "keyword"}
                    onSelectSuggestion={(value) => {
                      setKeywordQuery(value);
                      setOpenField(null);
                    }}
                    onToggle={() =>
                      setOpenField((currentField) =>
                        currentField === "keyword" ? null : "keyword",
                      )
                    }
                    onValueChange={setKeywordQuery}
                    suggestions={keywordSuggestions}
                    value={keywordQuery}
                  />
                  <div className="hidden h-[46px] w-px bg-black/10 lg:block" />
                  <SearchDropdownField
                    inputPlaceholder="Location"
                    isOpen={openField === "location"}
                    onSelectSuggestion={(value) => {
                      setLocationQuery(value);
                      setOpenField(null);
                    }}
                    onToggle={() =>
                      setOpenField((currentField) =>
                        currentField === "location" ? null : "location",
                      )
                    }
                    onValueChange={setLocationQuery}
                    suggestions={locationSuggestions}
                    value={locationQuery}
                  />
                  <div className="hidden h-[46px] w-px bg-black/10 lg:block" />
                </div>

                <div className="flex items-center justify-end gap-4">
                  <button
                    type="submit"
                    className="group inline-flex h-[46px] items-center gap-3 rounded-[25px] bg-[#1d223f] pl-6 pr-1.5 text-white md:h-[50px] md:pl-8"
                  >
                    <span className="text-[16px] leading-[1.2] font-semibold md:text-[20px]">
                      Search
                    </span>
                    <span className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/70 bg-white/10">
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45" />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-[16px] leading-[1.2] font-light text-[#1d223f] hover:text-[#00adef] md:text-[20px]"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="relative mx-auto mt-10 max-w-[1240px] md:max-w-[1368px] md:px-14 lg:px-16">
            {jobSlides.length > 0 ? (
              <div
                className="overflow-hidden"
                aria-label="Featured jobs carousel"
                aria-roledescription="carousel"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {jobSlides.map((slide, slideIndex) => (
                    <div key={slideIndex} className="min-w-full">
                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        {slide.map((item) => {
                          const { job } = item;
                          const isUrgent = job.status === "Urgent Requirement";

                          return (
                            <article
                              key={job.id}
                              className="relative h-full overflow-hidden rounded-[8px] bg-white shadow-[0_0_48px_rgba(0,0,0,0.12)]"
                            >
                              <div
                                className={`absolute right-0 top-[30px] h-[40px] w-[190px] opacity-60 ${isUrgent
                                    ? "bg-gradient-to-r from-transparent to-red-500/20"
                                    : "bg-gradient-to-r from-transparent to-[#00adef]/20"
                                  }`}
                              />

                              <div className="relative flex h-full flex-col p-7">
                                <div className="mb-5 flex items-center justify-between gap-3">
                                  <span className="inline-flex h-[36px] min-w-[110px] items-center justify-center rounded-[20px] border border-[#00adef] px-4 text-[16px] leading-[1.2] font-semibold text-[#1d223f]/50">
                                    {job.employmentType}
                                  </span>
                                  <span
                                    className={`text-right text-[16px] leading-[1.2] font-light ${isUrgent ? "text-red-500" : "text-[#00adef]"
                                      }`}
                                  >
                                    {getStatusText(job)}
                                  </span>
                                </div>

                                <h4 className="text-[20px] leading-[1.2] font-bold text-[#1d223f]">
                                  {job.jobTitle}
                                </h4>

                                <div className="mb-6 mt-5 h-px w-[200px] bg-gradient-to-r from-[#1d223f] to-transparent" />

                                <div className="space-y-3 text-[16px] leading-[1.2]">
                                  <p className="flex items-center gap-3">
                                    <InlineIcon
                                      src="/icons/Group 1000004985.svg"
                                      alt=""
                                      width={25}
                                      height={24}
                                    />
                                    <span className="text-[#1d223f]/50">Experience:</span>
                                    <span className="font-semibold text-[#1d223f]/80">
                                      {job.experienceLabel}
                                    </span>
                                  </p>
                                  <p className="flex items-center gap-3">
                                    <InlineIcon
                                      src="/icons/Group 1000004980-1.svg"
                                      alt=""
                                      width={20}
                                      height={24}
                                    />
                                    <span className="text-[#1d223f]/50">Location:</span>
                                    <span className="font-semibold text-[#1d223f]/80">
                                      {job.location}
                                    </span>
                                  </p>
                                  <p className="flex items-center gap-3">
                                    <InlineIcon
                                      src="/icons/THR (money in envelope).svg"
                                      alt=""
                                      width={24}
                                      height={24}
                                    />
                                    <span className="text-[#1d223f]/50">Annual CTC:</span>
                                    <span className="font-semibold text-[#1d223f]/80">
                                      {formatSalary(job)}
                                    </span>
                                  </p>
                                </div>

                                <div className="mt-10 flex items-center justify-between gap-3">
                                  <Link
                                    href={`/jobs?q=${encodeURIComponent(job.jobTitle)}`}
                                    className="text-[16px] leading-[1.2] font-normal text-[#00adef] hover:text-[#008fcc]"
                                  >
                                    Job Description
                                  </Link>
                                  <Link
                                    href={`/jobs?applyJobId=${encodeURIComponent(job.id)}`}
                                    className="group inline-flex h-[39px] min-w-[152px] items-center justify-between rounded-[20px] border border-[#1d223f]/60 bg-white pl-4 pr-1.5"
                                  >
                                    <span className="text-[16px] leading-[1.2] font-semibold text-[#1d223f]">
                                      Apply Now
                                    </span>
                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1d223f] text-white">
                                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45" />
                                    </span>
                                  </Link>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[16px] border border-dashed border-[#cfe1ef] bg-white px-6 py-12 text-center shadow-[0_0_48px_rgba(0,0,0,0.06)]">
                <h4 className="text-[24px] font-semibold leading-[1.2] text-[#1d223f]">
                  No live jobs to show right now
                </h4>
                <p className="mx-auto mt-3 max-w-[640px] text-[16px] leading-[1.7] text-[#5f6c88]">
                  {errorMessage ||
                    "We could not find any public jobs for the homepage cards just now. You can still browse the jobs page for the latest updates."}
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/jobs")}
                  className="group mt-6 inline-flex h-[46px] items-center gap-3 rounded-[25px] bg-[#1d223f] pl-6 pr-1.5 text-white"
                >
                  <span className="text-[16px] leading-[1.2] font-semibold">
                    Browse Jobs
                  </span>
                  <span className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white/70 bg-white/10">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45" />
                  </span>
                </button>
              </div>
            )}

            {jobSlides.length > 1 ? (
              <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 hidden items-center justify-between md:flex">
                <button
                  type="button"
                  onClick={goToPreviousSlide}
                  aria-label="Show previous job cards"
                  className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#1d223f] bg-[#1d223f] text-white shadow-[0_14px_34px_rgba(29,34,63,0.18)] transition-all duration-200 hover:-translate-x-0.5 hover:bg-[#15192e]"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goToNextSlide}
                  aria-label="Show next job cards"
                  className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#1d223f] bg-[#1d223f] text-white shadow-[0_14px_34px_rgba(29,34,63,0.18)] transition-all duration-200 hover:translate-x-0.5 hover:bg-[#15192e]"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            ) : null}

            {/* {jobSlides.length > 1 ? (
              <div className="mt-8 flex justify-center gap-3">
                {jobSlides.map((_, index) => {
                  const isActive = currentSlide === index;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goToSlide(index)}
                      aria-label={`Show job cards page ${index + 1}`}
                      aria-pressed={isActive}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        isActive
                          ? "w-8 bg-[#1d223f]"
                          : "w-3 bg-[#1d223f]/20 hover:bg-[#1d223f]/40"
                      }`}
                    />
                  );
                })}
              </div>
            ) : null} */}

            <div className="mt-8 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/jobs")}
                className="group inline-flex h-[46px] items-center gap-3 rounded-[25px] bg-[#1d223f] pl-6 pr-1.5 text-white"
              >
                <span className="text-[16px] leading-[1.2] font-semibold">
                  View All Jobs
                </span>
                <span className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/70 bg-white/10">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
