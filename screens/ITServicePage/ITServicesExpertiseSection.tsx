"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type ExpertiseItem = {
  bullets: string[];
  description: string;
  id: string;
  lead: string;
  title: string;
};

const expertiseColumns: ExpertiseItem[][] = [
  [
    {
      bullets: [
        "Custom enterprise & corporate websites",
        "CMS-driven, cloud-ready architecture",
        "SEO, performance & security optimization",
        "Scalable and future-proof development",
      ],
      description:
        "We build high-impact websites that go beyond aesthetics. Our websites are engineered for speed, security, SEO, and scalability, delivering seamless user experiences while driving measurable business outcomes. From corporate websites to complex enterprise portals, we create platforms that grow with your business.",
      id: "website-development",
      lead: "Digital experiences that perform, scale, and convert.",
      title: "Website Development",
    },
    {
      bullets: [
        "iOS, Android & cross-platform apps",
        "API-driven & cloud-integrated solutions",
        "Enterprise-grade security & performance",
        "End-to-end deployment & support",
      ],
      description:
        "We design and develop secure, scalable mobile applications that deliver exceptional performance across devices and platforms. Our mobile solutions are engineered to support rapid growth, seamless integrations, and long-term reliability.",
      id: "mobile-app-development",
      lead: "High-performance mobile apps built for scale and adoption.",
      title: "Mobile App Development",
    },
    {
      bullets: [
        "Bespoke enterprise applications",
        "API & system integrations",
        "Cloud-native & microservices architecture",
        "Long-term scalability & support",
      ],
      description:
        "We develop custom software that aligns perfectly with your workflows, objectives, and growth strategy. Our solutions are secure, scalable, and seamlessly integrated into your existing systems, enabling efficiency and innovation at every level.",
      id: "custom-software-development",
      lead: "Software solutions built precisely around your business needs.",
      title: "Custom Software Development",
    },
    {
      bullets: [
        "Custom ERP design & implementation",
        "Finance, HR, inventory & operations modules",
        "Real-time dashboards & analytics",
        "Secure, scalable enterprise architecture",
      ],
      description:
        "Our ERP solutions centralize data, automate processes, and deliver real-time insights across departments. Designed for scalability and performance, our ERP systems help organizations gain control, visibility, and operational efficiency.",
      id: "erp-development",
      lead: "Unified ERP platforms for smarter operations.",
      title: "ERP Development",
    },
    {
      bullets: [
        "Custom CRM development & customization",
        "Sales, marketing & support automation",
        "Third-party system integrations",
        "Actionable customer insights & analytics",
      ],
      description:
        "We design and customize CRM platforms that streamline sales, automate marketing, and enhance customer relationships. Our CRM solutions provide a single source of truth, enabling teams to engage customers more effectively.",
      id: "crm-development",
      lead: "Smarter CRM systems that power customer engagement.",
      title: "CRM Development",
    },
  ],
  [
    {
      bullets: [
        "User research & experience strategy",
        "Wireframes, prototypes & design systems",
        "Conversion-focused UI design",
        "Accessibility & enterprise design standards",
      ],
      description:
        "Our UI/UX designs are rooted in research, data, and user behavior. We craft intuitive, elegant, and engaging digital experiences that increase adoption, improve usability, and strengthen brand identity across every touchpoint.",
      id: "ui-ux-designing",
      lead: "Where strategy meets human-centered design.",
      title: "UI/UX Designing",
    },
    {
      bullets: [
        "2D & 3D game development",
        "Multiplayer & real-time gaming",
        "Cross-platform compatibility",
        "Performance optimization & monetization",
      ],
      description:
        "We create high-quality gaming experiences that combine creativity with advanced technology. From casual games to complex multiplayer platforms, our solutions are optimized for performance, scalability, and user engagement.",
      id: "game-development",
      lead: "Immersive, engaging, and performance-driven gaming solutions.",
      title: "Game Development",
    },
    {
      bullets: [
        "Data-driven SEO strategies for higher search rankings",
        "Keyword research aligned with user intent",
        "On-page, technical, and content optimization",
        "Sustainable organic traffic growth",
      ],
      description:
        "We help your brand rank higher and reach the right audience through data-driven SEO and high-performance SEM. From keyword research and technical optimization to high-conversion campaigns on Google, Bing, and Yahoo, we drive visibility, quality traffic, qualified leads, and measurable business growth.",
      id: "seo-sem",
      lead: "We help your brand rank higher and reach the right audience with data-driven SEO and SEM strategies.",
      title: "SEO & SEM",
    },
    {
      bullets: [
        "Google Ads & paid media management",
        "Conversion-optimized landing strategies",
        "Advanced tracking & reporting",
        "ROI-focused growth campaigns",
      ],
      description:
        "We deliver data-driven PPC and performance marketing strategies focused on growth, conversions, and revenue. Our campaigns are continuously optimized using analytics, automation, and AI insights to maximize return on investment.",
      id: "ppc-performance-marketing",
      lead: "Performance marketing engineered for ROI.",
      title: "PPC & Performance Marketing",
    },
    {
      bullets: [
        "AI & machine learning solutions",
        "Intelligent automation & chatbots",
        "Predictive analytics & data intelligence",
        "Enterprise-ready AI deployment",
      ],
      description:
        "We help organizations harness the power of AI to automate processes, enhance decision-making, and unlock new efficiencies. Our AI solutions are practical, secure, and designed for real-world business impact, not experimentation.",
      id: "ai-integration-development",
      lead: "Intelligence embedded into your business operations.",
      title: "AI Integration & Development",
    },
  ],
];

type AccordionCardProps = {
  animationDelay: number;
  isOpen: boolean;
  item: ExpertiseItem;
  onClose: () => void;
  onToggle: () => void;
};

function AccordionCard({
  animationDelay,
  isOpen,
  item,
  onClose,
  onToggle,
}: AccordionCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      transition={{
        delay: animationDelay,
        duration: 0.56,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ amount: 0.18, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
      onMouseLeave={() => {
        if (isOpen) {
          onClose();
        }
      }}
      className={`relative overflow-hidden rounded-[8px] bg-white transition-shadow duration-200 ${
        isOpen
          ? "shadow-[0_20px_46px_rgba(29,34,63,0.12)]"
          : "shadow-[0_8px_24px_rgba(29,34,63,0.06)] hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(29,34,63,0.1)]"
      }`}
    >
      <span className="absolute left-0 top-0 h-full w-[10px] bg-[#00adef]" aria-hidden />

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex min-h-[72px] w-full items-center justify-between gap-4 pl-[32px] pr-[26px] text-left"
      >
        <span className="text-[20px] font-semibold leading-[1.2] text-[#1d223f] md:text-[24px]">
          {item.title}
        </span>
        <span
          className={`inline-flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full text-[#1d223f] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <ChevronDown className="h-5 w-5" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="px-[32px] pb-[28px] pt-1 text-[15px] leading-[1.65] text-[#1d223f] md:text-[16px]">
              <p className="font-bold leading-[1.45]">{item.lead}</p>
              <p className="mt-4">{item.description}</p>
              <p className="mt-4 font-bold leading-[1.45]">Key capabilities:</p>
              <ul className="mt-3 space-y-1.5">
                {item.bullets.map((bullet, bulletIndex) => (
                  <motion.li
                    key={bullet}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: bulletIndex * 0.035,
                      duration: 0.22,
                    }}
                    className="flex items-start gap-2.5"
                  >
                    <span className="mt-[1px] text-[#00adef]">&gt;</span>
                    <span>{bullet}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}

export const ITServicesExpertiseSection = () => {
  const [openItems, setOpenItems] = useState<Record<number, string | null>>({
    0: null,
    1: null,
  });

  const toggleItem = (columnIndex: number, itemId: string) => {
    setOpenItems((current) => ({
      ...current,
      [columnIndex]: current[columnIndex] === itemId ? null : itemId,
    }));
  };

  const closeItem = (columnIndex: number) => {
    setOpenItems((current) => ({
      ...current,
      [columnIndex]: null,
    }));
  };

  return (
    <div
      className="mx-auto mt-[38px] w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 xl:px-10"
      style={{
        background:
          "linear-gradient(90deg, rgba(0,173,239,0) 0%, rgba(0,173,239,0.06) 29.808%, rgba(0,173,239,0.06) 70%, rgba(0,173,239,0) 100%)",
      }}
    >
      <div className="grid grid-cols-1 items-start gap-x-[20px] gap-y-[20px] md:grid-cols-2">
        {expertiseColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex w-full flex-col gap-[20px]">
            {column.map((item, itemIndex) => (
              <AccordionCard
                key={item.id}
                animationDelay={columnIndex * 0.08 + itemIndex * 0.05}
                item={item}
                isOpen={openItems[columnIndex] === item.id}
                onClose={() => closeItem(columnIndex)}
                onToggle={() => toggleItem(columnIndex, item.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
