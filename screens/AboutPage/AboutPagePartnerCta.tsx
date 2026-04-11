"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { ApplyFormTab } from "@/screens/HomePage/sections/NavigationHeaderSection/ApplyFormModal";

const ApplyFormModal = dynamic(
  () =>
    import("@/screens/HomePage/sections/NavigationHeaderSection/ApplyFormModal").then((module) => ({
      default: module.ApplyFormModal,
    })),
  {
    ssr: false,
  },
);

export const AboutPagePartnerCta = () => {
  const [activeApplyTab, setActiveApplyTab] = useState<ApplyFormTab>("employer");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const openApplyModal = (tab: ApplyFormTab = "employer") => {
    setActiveApplyTab(tab);
    setIsApplyModalOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => openApplyModal("employer")}
        className="group mt-[34px] inline-flex h-[50px] items-center gap-[14px] overflow-hidden rounded-[25px] border border-white/80 pl-[19px] pr-[4px] text-[20px] font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:border-white"
      >
        <span>Partner With Us</span>
        <span className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white text-[#1d234f] transition-transform duration-300">
          <ArrowUpRight
            className="h-6 w-6 transition-transform duration-300 group-hover:rotate-45"
            strokeWidth={2.5}
          />
        </span>
      </button>

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
