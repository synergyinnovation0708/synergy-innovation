import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { CandidateIdentity } from "@/lib/candidate-auth";
import type { CandidateProfileMeta } from "@/lib/candidate-profile";
import type { CandidateProfileFormValues } from "@/lib/candidate-profile-shared";
import { FooterSection } from "../HomePage/sections/FooterSection";
import { CandidateProfileEditor } from "./CandidateProfileEditor";
import { CandidateSignOutButton } from "./CandidateSignOutButton";

type CandidateProfilePageProps = {
  errorMessage?: string | null;
  identity: CandidateIdentity;
  initialValues: CandidateProfileFormValues;
  meta: CandidateProfileMeta;
};

export const CandidateProfilePage = ({
  errorMessage,
  identity,
  initialValues,
  meta,
}: CandidateProfilePageProps) => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef7ff_0%,#ffffff_45%,#f7f9fc_100%)] text-[#1d223f]">
      <header className="border-b border-[#dbe6f1] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-full border border-[#dbe5f1] bg-white px-4 py-2 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f5f9ff]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to jobs
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eef8ff] px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#00adef]">
              Candidate Profile
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* <Link
              href="/candidate/login"
              className="inline-flex items-center gap-2 rounded-full border border-[#dbe5f1] px-4 py-2 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f5f9ff]"
            >
              Switch account
            </Link> */}
            <CandidateSignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1380px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="overflow-hidden rounded-[36px] bg-[#1d223f] px-6 py-8 text-white shadow-[0_28px_70px_rgba(29,34,63,0.22)] sm:px-8 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.16em] text-[#86ddff]">
                Complete Candidate Profile
              </span>
              <h1 className="mt-5 text-[34px] font-bold leading-[1.05] sm:text-[48px]">
                {initialValues.fullName || identity.name}
              </h1>
              <p className="mt-4 max-w-[680px] text-[16px] leading-[1.8] text-white/74 sm:text-[17px]">
                Add the complete information recruiters usually expect across
                modern job platforms: profile summary, skills, education, work
                history, preferences, certifications, projects, and resume details.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white">
                  {identity.email}
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white">
                  {meta.joinedLabel}
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white">
                  {meta.submittedLabel}
                </span>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/12 bg-white/8 p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-white/12 text-[#86ddff]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#86ddff]">
                    Candidate Workspace
                  </p>
                  <h2 className="mt-1 text-[24px] font-bold text-white">
                    Full profile editor
                  </h2>
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-[1.8] text-white/72">
                This page is intentionally sectioned like a recruiter-facing profile
                builder so you can keep all important information in one place.
              </p>
            </div>
          </div>
        </section>

        {errorMessage ? (
          <div className="mt-6 rounded-[22px] border border-[#ffd8d8] bg-[#fff5f5] px-5 py-4 text-[14px] font-medium text-[#b53c3c]">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-8">
          <CandidateProfileEditor initialValues={initialValues} meta={meta} />
        </div>
      </main>

      <FooterSection />
    </div>
  );
};
