"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type CaseStudy = {
  id: string;
  name: string;
  logo: { src: string; width: number; height: number };
  screen: { src: string; width: number; height: number };
  description: string;
  challenge: string;
  whatWeBuild: string;
  keyFeatures: string;
  results: string;
};

const caseStudies: CaseStudy[] = [
  {
    id: "switchwords",
    name: "theswitchwords",
    logo: { src: "/images/case-studies/switchwords-logo.png", width: 265, height: 45 },
    screen: { src: "/images/case-studies/switchwords-screen.png", width: 1536, height: 4096 },
    description:
      "the switchwords is a modern mindfulness and self-practice platform that combines mindfulness, intentional language, and simple daily practices to help people navigate everyday emotions and moments with a quieter, more practical approach.",
    challenge:
      "Leverage AI to simplify the switchwords by intelligently guiding users to personalized Switchwords based on their intentions, goals, and needs.",
    whatWeBuild:
      "Designed & developed the website from scratch, combining a calm visual identity with an intuitive user experience and integrated AI Chat Bot.",
    keyFeatures:
      "Clean, modern UI/UX, Interactive experience, Easy content discovery, Responsive design across devices, Smooth navigation and engaging interactions",
    results:
      "A distinctive, user-friendly digital platform that transforms a unique wellness concept into an accessible and engaging online experience.",
  },
  {
    id: "fyp-impact",
    name: "FYP Impact",
    logo: { src: "/images/case-studies/fyp-impact-logo.png", width: 173, height: 38 },
    screen: { src: "/images/case-studies/fyp-impact-screen.png", width: 1573, height: 4096 },
    description:
      "FYP Impact is a creator-first digital agency that helps brands connect with culture through creators, social platforms, and data-driven campaigns. It combines creator intuition with performance-focused strategy to turn attention into measurable brand and business impact.",
    challenge:
      "Create a digital experience that reflects FYP Impact’s creator-first, fast-moving, culture-driven approach rather than a traditional agency website.",
    whatWeBuild:
      "Designed and developed the website from scratch, translating its bold brand personality into a dynamic digital experience.",
    keyFeatures:
      "Bold, modern UI/UX, Video-led visual experience, Creator-focused storytelling, Smooth navigation & interactions.",
    results:
      "A high-impact, creator-first website that brings FYP Impact’s personality, work, and approach to life while creating a stronger digital presence for the brand.",
  },
  {
    id: "sonali-thread",
    name: "Sonali Thread",
    logo: { src: "/images/case-studies/sonali-thread-logo.png", width: 132, height: 45 },
    screen: { src: "/images/case-studies/sonali-thread-screen.png", width: 1920, height: 3048 },
    description:
      "Sonali Thread is a textile manufacturing and trading company based in Noida, serving the textile industry with a focus on streamlined operations and business growth. The company manages processes across sales, customers, challans, billing, inventory, and reporting.",
    challenge:
      "Disconnected tools and manual workflows were creating data silos, duplicate work, and limited visibility across business operations.",
    whatWeBuild:
      "Built a custom AI-powered ERP from scratch, bringing the entire business workflow into one integrated platform—from sales and challans to billing, customers, inventory, and reporting.",
    keyFeatures:
      "One platform for AI-powered billing, sales, inventory, customer management, and real-time reporting—reducing manual work and duplicate data entry.",
    results:
      "A single, AI-integrated system that streamlined operations, automated critical workflows, improved visibility, and made the entire process faster, smarter, and more scalable.",
  },
  {
    id: "lalita-textiles",
    name: "Lalita Textiles",
    logo: { src: "/images/case-studies/lalita-textiles-logo.png", width: 252, height: 38 },
    screen: { src: "/images/case-studies/lalita-textiles-screen.png", width: 940, height: 1672 },
    description:
      "Lalita Textiles is a trusted wholesale textile business in Sitamarhi, Bihar, with 20+ years of experience. We offer quality sarees, suits, fabrics, lehengas, and more at competitive wholesale prices, serving retailers across Bihar and Nepal.",
    challenge:
      "Managing products, suppliers, customers, orders, inventory, payments, and dispatches across Bihar and Nepal was complex and time-consuming.",
    whatWeBuild:
      "An AI-powered centralized ERP to manage the complete textile business workflow in one platform.",
    keyFeatures:
      "Integrated chatbot, challan-to-billing, sales, purchases, inventory, orders, payments, dispatches, customer management, and real-time business insights.",
    results:
      "Reduced manual work, improved operational visibility, streamlined workflows, and enabled faster business decisions.",
  },
  {
    id: "synergy-innovation",
    name: "Synergy Innovation",
    logo: { src: "/images/case-studies/synergy-innovation-logo.png", width: 155, height: 45 },
    screen: { src: "/images/case-studies/synergy-innovation-screen.png", width: 671, height: 4096 },
    description:
      "Synergy Innovation is a technology and talent solutions company helping businesses grow through IT services, AI, ERP, cloud, cybersecurity, recruitment, and digital transformation. The company focuses on delivering innovative, customized solutions that improve efficiency and support business growth.",
    challenge:
      "The existing website needed a modern experience, better service visibility, and an easier way for recruiters to discover talent.",
    whatWeBuild:
      "We revamped the website into a modern AI-driven platform, introducing a dedicated Talent Network, AI chatbot, and a new range of AI-powered IT products and services.",
    keyFeatures:
      "Talent profiles, recruiter talent discovery, AI chatbot, service exploration, and AI/IT product showcase.",
    results:
      "Improved user engagement, simplified talent discovery, and strengthened Synergy Innovation’s digital presence as an AI & technology solutions provider.",
  },
  {
    id: "singh-agro",
    name: "Singh Agro Agencies",
    logo: { src: "/images/case-studies/singh-agro-logo.png", width: 164, height: 38 },
    screen: { src: "/images/case-studies/singh-agro-screen.png", width: 1026, height: 4096 },
    description:
      "Singh Agro Agencies is a trusted power and home-appliance retailer based in Gopalganj, Bihar, serving customers since 1995. The business offers batteries, inverters, UPS systems, RO purifiers, ACs, coolers, and automotive batteries, along with installation, delivery, and after-sales service.",
    challenge:
      "The business needed a stronger digital presence to reach more customers, build trust online, and create new opportunities for sales growth.",
    whatWeBuild:
      "Designed and developed a conversion-focused website from scratch, creating a strong digital foundation while actively working on the brand’s social media growth.",
    keyFeatures:
      "Product-focused presence, seamless customer enquiries, stronger branding, organic social growth, and improved reputation.",
    results:
      "A stronger digital presence designed to support sales and revenue growth, with 50+ organic customer reviews gained in just one week and ongoing efforts to expand the brand’s social media reach.",
  },
];

const AUTOPLAY_MS = 7000;
const SWIPE_THRESHOLD = 60;

function DetailBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-l-4 border-[#00adef] pl-4">
      <h4 className="text-[18px] font-medium leading-[28px] text-[#142238]">{title}</h4>
      <p className="mt-2 text-[14px] leading-[19px] text-[#4d4d4d]">{body}</p>
    </div>
  );
}

// Screenshots have very different aspect ratios, so always scale by width (never cover-crop)
// to keep the same zoom on every slide; hover scrolls through whatever overflows the frame.
function ScreenPreview({ study }: { study: CaseStudy }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scroll, setScroll] = useState(0);

  const startScroll = () => {
    const frame = frameRef.current;
    const image = imageRef.current;
    if (!frame || !image) return;
    setScroll(Math.max(0, image.offsetHeight - frame.clientHeight));
  };

  return (
    <div
      ref={frameRef}
      onMouseEnter={startScroll}
      onMouseLeave={() => setScroll(0)}
      className="relative mx-auto h-full w-full max-w-[320px] overflow-hidden lg:max-w-none"
    >
      <Image
        ref={imageRef}
        src={study.screen.src}
        alt={`${study.name} website preview`}
        width={study.screen.width}
        height={study.screen.height}
        sizes="(max-width: 1023px) 320px, 260px"
        className="absolute inset-x-0 top-0 h-auto min-h-full w-full rounded-t-[6px] object-cover object-top shadow-[0_8px_24px_rgba(20,34,56,0.08)] ease-linear"
        style={{
          transform: `translateY(-${scroll}px)`,
          transitionProperty: "transform",
          transitionDuration: `${scroll ? Math.max(1500, scroll * 6) : 600}ms`,
        }}
      />
    </div>
  );
}

function CaseStudySlide({ study, imageFirst }: { study: CaseStudy; imageFirst: boolean }) {
  return (
    <div
      className={`grid gap-5 ${
        imageFirst
          ? "lg:grid-cols-[minmax(0,295fr)_minmax(0,925fr)]"
          : "lg:grid-cols-[minmax(0,925fr)_minmax(0,295fr)]"
      }`}
    >
      <div
        className={`rounded-[24px] bg-[rgba(0,173,239,0.02)] p-6 ring-1 ring-[rgba(0,173,239,0.06)] sm:p-8 lg:min-h-[502px] ${
          imageFirst ? "lg:order-2" : ""
        }`}
      >
        <Image
          src={study.logo.src}
          alt={`${study.name} logo`}
          width={study.logo.width}
          height={study.logo.height}
          className="h-[38px] w-auto sm:h-auto"
          style={{ maxHeight: study.logo.height }}
        />

        <p className="mt-8 max-w-[710px] text-[16px] font-light leading-[22px] text-[#4d4d4d]">
          {study.description}
        </p>

        <div className="mt-8 h-px max-w-[800px] bg-[linear-gradient(90deg,#00b4ff_0%,rgba(0,180,255,0)_100%)]" />

        <div className="mt-8 grid gap-8 sm:grid-cols-2 sm:gap-x-10">
          <DetailBlock title="Challenge" body={study.challenge} />
          <DetailBlock title="What We Build" body={study.whatWeBuild} />
          <DetailBlock title="Key Features" body={study.keyFeatures} />
          <DetailBlock title="Results" body={study.results} />
        </div>
      </div>

      <div
        className={`group relative h-[420px] overflow-hidden rounded-[24px] bg-[rgba(0,173,239,0.02)] px-[18px] pt-8 ring-1 ring-[rgba(0,173,239,0.06)] lg:h-auto lg:min-h-[502px] ${
          imageFirst ? "lg:order-1" : ""
        }`}
      >
        <ScreenPreview study={study} />
      </div>
    </div>
  );
}

function SliderDots({
  active,
  count,
  onSelect,
}: {
  active: number;
  count: number;
  onSelect: (index: number) => void;
}) {
  const isLast = active === count - 1;

  return (
    <div className="relative mx-auto mt-12 flex w-full max-w-[420px] items-center justify-between">
      <span className="absolute inset-x-[10px] top-1/2 h-[2px] -translate-y-1/2 bg-[#e3f5fd]" aria-hidden />
      <span
        aria-hidden
        className="absolute top-1/2 h-[2px] w-[60px] -translate-y-1/2 transition-[left] duration-400 ease-out"
        style={{
          background: isLast
            ? "linear-gradient(270deg,#00adef 0%,rgba(0,173,239,0) 100%)"
            : "linear-gradient(90deg,#00adef 0%,rgba(0,173,239,0) 100%)",
          left: `calc(${(active / (count - 1)) * 100}% ${isLast ? "- 60px" : "+ 0px"})`,
        }}
      />
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Show case study ${index + 1}`}
          aria-current={index === active}
          className={`relative z-10 h-5 w-5 rounded-full transition-all duration-300 ${
            index === active
              ? "bg-[#00adef] shadow-[0_0_0_4px_rgba(0,173,239,0.15)]"
              : "bg-[#cceffc] hover:bg-[#99dff9]"
          }`}
        />
      ))}
    </div>
  );
}

export const ITServicesCaseStudySlider = () => {
  const [[active, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const count = caseStudies.length;

  const goTo = useCallback(
    (index: number) => {
      setSlide(([current]) => {
        const next = (index + count) % count;
        return [next, next >= current ? 1 : -1];
      });
    },
    [count],
  );

  const step = useCallback(
    (delta: number) => {
      setSlide(([current]) => [(current + delta + count) % count, delta]);
    },
    [count],
  );

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setTimeout(() => step(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, reduceMotion, step]);

  const study = caseStudies[active];
  const offset = reduceMotion ? 0 : 60;

  return (
    <section
      id="case-studies"
      aria-roledescription="carousel"
      aria-label="Client case studies"
      className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-0 lg:py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
    >
      <p className="text-[16px] font-bold uppercase leading-[17px] tracking-[0.08em] text-[#00b4ff]">Case Study</p>
      <h2 className="mt-4 max-w-[640px] text-[34px] font-extrabold leading-[1.2] tracking-[-0.03em] text-[#142238] sm:text-[48px] lg:text-[56px]">
        The Brands That Chose to <span className="text-[#00b4ff]">Build Different</span>
      </h2>

      <div className="relative mt-10 lg:mt-14">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={study.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * offset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -offset }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) step(1);
              else if (info.offset.x > SWIPE_THRESHOLD) step(-1);
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${active + 1} of ${count}: ${study.name}`}
            className="touch-pan-y"
          >
            <CaseStudySlide study={study} imageFirst={active % 2 === 1} />
          </motion.div>
        </AnimatePresence>
      </div>

      <SliderDots active={active} count={count} onSelect={goTo} />
    </section>
  );
};
