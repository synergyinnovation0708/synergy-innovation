"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
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

const recruitmentSolutions = [
  {
    id: "executive-search",
    title: "Executive Search",
    description: "Leadership driving niche expertise",
    image: "/images/image 49-1.png",
    icon: "/icons/RPO Icon.svg",
  },
  {
    id: "permanent-hiring",
    title: "Permanent Hiring",
    description: "Managerial to leadership roles.",
    image: "/images/image 50.png",
    icon: "/icons/RPO Icon-1.svg",
  },
  {
    id: "contract-to-hire-c2h",
    title: "Contract-to-Hire (C2H)",
    description: "Flexible, fast & reliable staffing.",
    image: "/images/image 51.png",
    icon: "/icons/RPO Icon-2.svg",
  },
  {
    id: "global-hiring-support",
    title: "Global Hiring Support",
    description: "Global end-to-end recruitment.",
    image: "/images/image 49.png",
    icon: "/icons/RPO Icon-3.svg",
  },
];

export const RecruitmentSolutionsSection = () => {
  const [activeApplyTab, setActiveApplyTab] = useState<ApplyFormTab>("employer");
  const [activeSolutionId, setActiveSolutionId] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const openApplyModal = (tab: ApplyFormTab = "employer") => {
    setActiveApplyTab(tab);
    setIsApplyModalOpen(true);
  };

  useEffect(() => {
    const syncActiveSolution = () => {
      const nextHash = window.location.hash.replace(/^#/, "");

      setActiveSolutionId(
        recruitmentSolutions.some((solution) => solution.id === nextHash)
          ? nextHash
          : null,
        );
    };

    const handleExpertiseNavSelect = (event: Event) => {
      const selectedId =
        event instanceof CustomEvent && typeof event.detail === "string"
          ? event.detail
          : "";

      setActiveSolutionId(
        recruitmentSolutions.some((solution) => solution.id === selectedId)
          ? selectedId
          : null,
      );
    };

    syncActiveSolution();
    window.addEventListener("hashchange", syncActiveSolution);
    window.addEventListener("synergy:expertise-nav-select", handleExpertiseNavSelect);

    return () => {
      window.removeEventListener("hashchange", syncActiveSolution);
      window.removeEventListener(
        "synergy:expertise-nav-select",
        handleExpertiseNavSelect,
      );
    };
  }, []);

  return (
    <>
      <section
        id="recruitment-solutions"
        className="relative scroll-mt-[120px] w-full bg-white py-20 md:py-24"
      >
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="mt-4 mb-5 text-[34px] leading-[1.2] font-bold text-[#1d223f] md:text-[46px]">
              Our Recruitment Solutions
            </h2>
            <p className="mb-6 max-w-[1029px] text-[18px] leading-[1.2] font-normal text-[#1d223f] md:text-[24px]">
              Building tomorrow&apos;s workforce today through innovative sourcing
              strategies and market intelligence for forward-thinking
              organizations and adaptive professionals.
            </p>
            <div className="mb-10 h-1.5 w-[200px] rounded-[3px] bg-[#00adef]" />
          </div>

          <div className="mb-10 rounded-[12px] bg-[linear-gradient(180deg,rgba(0,173,239,0)_0%,rgba(0,173,239,0.1)_40%,rgba(0,173,239,0.1)_60%,rgba(0,173,239,0)_100%)] px-2 py-6 md:px-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {recruitmentSolutions.map((solution) => (
                <Card
                  key={solution.title}
                  id={solution.id}
                  className={`scroll-mt-[120px] overflow-hidden rounded-[12px] border bg-white transition-all duration-300 ${
                    activeSolutionId === solution.id
                      ? "border-[#00adef]/35 bg-[#f8fdff] shadow-[0_20px_50px_rgba(0,173,239,0.18)] ring-2 ring-[#00adef]/18"
                      : "border-transparent shadow-none"
                  }`}
                >
                  <CardContent className="p-[17px]">
                    <div className="relative mb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="h-[260px] w-full rounded-[8px] object-cover"
                        alt={solution.title}
                        src={solution.image}
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="absolute bottom-0 left-0 h-[60px] w-[60px]"
                        alt="Icon"
                        src={solution.icon}
                      />
                    </div>

                    <h3 className="mb-3 text-[24px] leading-[1.2] font-bold text-[#00adef]">
                      {solution.title}
                    </h3>
                    <div className="mb-3 h-px w-[200px] bg-gradient-to-r from-[#1d223f] to-transparent" />
                    <p className="text-[18px] leading-[1.4] font-normal text-[#1d223f]">
                      {solution.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => openApplyModal("employer")}
              className="group flex h-[50px] w-full max-w-[300px] items-center justify-between rounded-[25px] bg-[#1d223f] pl-5 pr-1.5 text-white transition-colors hover:bg-[#15192e]"
            >
              <span className="text-[20px] font-semibold leading-[1.2]">
                Hire Exceptional Talent
              </span>
              <div className="rounded-full bg-white p-2 text-[#1d223f]">
                <ArrowUpRight
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45"
                  strokeWidth={2.5}
                />
              </div>
            </button>
          </div>
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

