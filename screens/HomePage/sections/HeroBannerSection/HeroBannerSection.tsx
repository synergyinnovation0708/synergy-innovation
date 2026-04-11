"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ApplyFormTab } from "../NavigationHeaderSection/ApplyFormModal";

const ApplyFormModal = dynamic(
  () =>
    import("../NavigationHeaderSection/ApplyFormModal").then((module) => ({
      default: module.ApplyFormModal,
    })),
  {
    ssr: false,
  },
);

const HERO_SLIDES = [
  {
    button: "Request Talent",
    buttonAction: "employer",
    buttonClassName: "h-[46px] min-w-[205px] pl-4 md:h-[50px] md:min-w-[231px] md:pl-5",
    buttonTextClassName: "text-[17px] md:text-[20px]",
    contentMaxWidthClassName: "max-w-[655px]",
    description:
      "Connecting talent with future-focused, innovative organizations.",
    descriptionMaxWidthClassName: "max-w-[505px]",
    imageAlt: "Business professionals collaborating",
    imageSrc:
      "/images/you-have-any-suggestions-full-length-shot-group-diverse-businesspeople-having-meeting-boardroom 1.png",
    title: "Your Strategic Partner in Leadership & Technology Hiring",
    titleClassName:
      "text-[38px] leading-[1.15] sm:text-[44px] md:text-[60px] md:leading-[1.2]",
  },
  {
    button: "Find Your Perfect Role",
    buttonAction: "jobSeeker",
    buttonClassName: "h-[52px] pl-5 md:h-[56px] md:pl-6",
    buttonTextClassName: "text-[16px] md:text-[18px]",
    contentMaxWidthClassName: "max-w-[610px]",
    description:
      "Discover roles that match your skills, ambition, and career goals.",
    descriptionMaxWidthClassName: "max-w-[420px]",
    imageAlt: "Your Future Starts with the Right Opportunity",
    imageSrc: "/images/people.jpg",
    title: "Your Future Starts\nwith the Right\nOpportunity",
    titleWhitespaceClassName: "md:whitespace-pre",
    titleClassName:
      "text-[36px] leading-[1.04] sm:text-[44px] md:text-[52px] md:leading-[1.04] lg:text-[56px]",
  },
  {
    button: "Explore AI Services",
    buttonAction: "itServices",
    buttonClassName: "h-[46px] min-w-[220px] pl-4 md:h-[50px] md:min-w-[252px] md:pl-5",
    buttonTextClassName: "text-[17px] md:text-[20px]",
    contentMaxWidthClassName: "max-w-[655px]",
    description:
      "Delivering scalable, innovative IT services to power your digital transformation.",
    descriptionMaxWidthClassName: "max-w-[505px]",
    imageAlt: "AI IT Solutions That Drive Business Growth",
    imageSrc: "/images/ai.jpg",
    title: "AI IT Solutions That Drive Business Growth",
    titleClassName:
      "text-[38px] leading-[1.15] sm:text-[44px] md:text-[60px] md:leading-[1.2]",
  },
] as const;

const HERO_AUTOPLAY_INTERVAL_MS = 6000;

export const HeroBannerSection = () => {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeApplyTab, setActiveApplyTab] = useState<ApplyFormTab>("employer");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const openApplyModal = (tab: ApplyFormTab = "employer") => {
    setActiveApplyTab(tab);
    setIsApplyModalOpen(true);
  };

  const goToPreviousSlide = () => {
    setActiveSlide((currentSlide) =>
      currentSlide === 0 ? HERO_SLIDES.length - 1 : currentSlide - 1,
    );
  };

  const goToNextSlide = () => {
    setActiveSlide((currentSlide) =>
      currentSlide === HERO_SLIDES.length - 1 ? 0 : currentSlide + 1,
    );
  };

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) =>
        currentSlide === HERO_SLIDES.length - 1 ? 0 : currentSlide + 1,
      );
    }, HERO_AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const currentSlide = HERO_SLIDES[activeSlide];

  const handleSlideAction = () => {
    if (currentSlide.buttonAction === "employer") {
      openApplyModal("employer");
      return;
    }

    if (currentSlide.buttonAction === "jobSeeker") {
      openApplyModal("jobSeeker");
      return;
    }

    router.push("/it-services");
  };

  return (
    <>
      <section className="relative mx-auto mt-[10px] h-[500px] w-full max-w-[1320px] overflow-hidden rounded-[16px] bg-[#1d223f] md:h-[600px]">
        <div className="absolute inset-0">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === activeSlide;

            return (
              <div
                key={slide.title}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${isActive ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
              >
                <div className="absolute inset-0 md:inset-y-0 md:right-0 md:left-auto md:w-[899px]">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    fill
                    sizes="(max-width: 767px) 100vw, 899px"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1d223f]/95 via-[#1d223f]/85 to-[#1d223f]/20 md:inset-y-0 md:right-[338px] md:left-auto md:w-[562px] md:from-[#1d223f] md:to-transparent" />
              </div>
            );
          })}
        </div>

        {HERO_SLIDES.length > 1 ? (
          <div className="absolute bottom-4 right-4 z-20 flex gap-2 md:bottom-8 md:right-8 md:gap-3">
            <button
              type="button"
              onClick={goToPreviousSlide}
              aria-label="Show previous hero slide"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#1d223f]/70 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-[#1d223f]/90 md:h-12 md:w-12"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={goToNextSlide}
              aria-label="Show next hero slide"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#1d223f]/70 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-[#1d223f]/90 md:h-12 md:w-12"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : null}

        <div
          className={`relative z-10 flex h-full flex-col justify-center px-6 md:px-[40px] ${currentSlide.contentMaxWidthClassName}`}
        >
          <h1
            className={`mb-6 whitespace-pre-line font-bold text-white md:mb-8 ${"titleWhitespaceClassName" in currentSlide ? currentSlide.titleWhitespaceClassName : ""} ${currentSlide.titleClassName}`}
          >
            {currentSlide.title}
          </h1>

          <p
            className={`mb-8 text-[18px] leading-[1.25] font-normal text-white sm:text-[20px] md:mb-10 md:text-[22px] md:leading-[1.2] ${currentSlide.descriptionMaxWidthClassName}`}
          >
            {currentSlide.description}
          </p>

          <button
            type="button"
            onClick={handleSlideAction}
            className={`group inline-flex min-w-fit self-start items-center gap-3 rounded-[25px] border border-white/70 pr-1.5 text-white ${currentSlide.buttonClassName}`}
          >
            <span
              className={`whitespace-nowrap leading-[1.2] font-semibold ${currentSlide.buttonTextClassName}`}
            >
              {currentSlide.button}
            </span>
            <span className="rounded-full bg-white p-2 text-[#1d223f]">
              <ArrowUpRight
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45"
                strokeWidth={2.5}
              />
            </span>
          </button>
        </div>
      </section>

      {isApplyModalOpen ? (
        <ApplyFormModal
          activeTab={activeApplyTab}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onTabChange={setActiveApplyTab}
        />
      ) : null}
    </>
  );
};
