type Industry = {
  label: string;
  lines: string[];
  textWidthClass: string;
  icon: string;
  alt: string;
};

const topRowIndustries: Industry[] = [
  {
    label: "Banking, Insurance & Financial Services (BFSI)",
    lines: ["Banking, Insurance", "& Financial", "Services (BFSI)"],
    textWidthClass: "w-[136px] lg:w-[142px]",
    icon: "/icons/bank.svg",
    alt: "Banking",
  },
  {
    label: "IT & Technology",
    lines: ["IT &", "Technology"],
    textWidthClass: "w-[108px] lg:w-[114px]",
    icon: "/icons/it.svg",
    alt: "IT and technology",
  },
  {
    label: "SAP & Enterprise Applications",
    lines: ["SAP & Enterprise", "Applications"],
    textWidthClass: "w-[128px] lg:w-[137px]",
    icon: "/icons/window-alt 1.svg",
    alt: "Enterprise applications",
  },
  {
    label: "Software Development & Engineering",
    lines: ["Software", "Development &", "Engineering"],
    textWidthClass: "w-[118px] lg:w-[116px]",
    icon: "/icons/engine-algorithm.svg",
    alt: "Software engineering",
  },
  {
    label: "Tech Sales & APAC Hiring",
    lines: ["Tech Sales &", "APAC Hiring"],
    textWidthClass: "w-[112px] lg:w-[114px]",
    icon: "/icons/office-chair 1.svg",
    alt: "Tech sales",
  },
  {
    label: "Niche & Emerging Skill Sets",
    lines: ["Niche & Emerging", "Skill Sets"],
    textWidthClass: "w-[138px] lg:w-[146px]",
    icon: "/icons/trophy-achievement-skill 1.svg",
    alt: "Emerging skill sets",
  },
];

const bottomRowIndustries: Industry[] = [
  {
    label: "Manufacturing",
    lines: ["Manufacturing"],
    textWidthClass: "w-[114px]",
    icon: "/icons/industrial-pollution.svg",
    alt: "Manufacturing",
  },
  {
    label: "Engineering & Infrastructure",
    lines: ["Engineering &", "Infrastructure"],
    textWidthClass: "w-[132px] lg:w-[138px]",
    icon: "/icons/bridge-water 1.svg",
    alt: "Engineering and infrastructure",
  },
  {
    label: "Healthcare & Pharma",
    lines: ["Healthcare &", "Pharma"],
    textWidthClass: "w-[138px] lg:w-[146px]",
    icon: "/icons/health-podcast.svg",
    alt: "Healthcare and pharma",
  },
  {
    label: "Consumer Goods (FMCG / FMCD)",
    lines: ["Consumer Goods", "(FMCG / FMCD)"],
    textWidthClass: "w-[132px] lg:w-[131px]",
    icon: "/icons/dolly-flatbed.svg",
    alt: "Consumer goods",
  },
  {
    label: "Project Management & Core Technical Roles",
    lines: ["Project", "Management & Core", "Technical Roles"],
    textWidthClass: "w-[144px] lg:w-[153px]",
    icon: "/icons/user-skill-gear 1.svg",
    alt: "Project management",
  },
];

const HexIndustryCard = ({ industry }: { industry: Industry }) => (
  <article className="relative h-[168px] w-[160px] shrink-0 sm:h-[176px] sm:w-[170px] lg:h-[190px] lg:w-[190px]">
    <div className="absolute inset-0 [clip-path:polygon(50%_0%,98%_25%,98%_75%,50%_100%,2%_75%,2%_25%)] border border-[#ebf5fb] bg-white shadow-[0_16px_44px_rgba(0,173,239,0.07)]" />

    <div className="absolute inset-x-0 top-[34px] flex justify-center sm:top-[38px] lg:top-[40px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={industry.icon}
        alt={industry.alt}
        className="h-9 w-9 object-contain sm:h-10 sm:w-10"
        loading="eager"
      />
    </div>

    <p
      className={`absolute left-1/2 top-[82px] -translate-x-1/2 text-center text-[14px] font-normal leading-[16px] text-[#1d223f] sm:top-[88px] sm:text-[15px] sm:leading-[18px] lg:top-[100px] lg:text-[16px] lg:leading-[19px] ${industry.textWidthClass}`}
    >
      {industry.lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>
  </article>
);

export const ClientIndustriesSection = () => {
  return (
    <section
      id="recruitment-practice-areas"
      className="relative scroll-mt-[120px] w-full py-16"
    >
      <div className="relative mx-auto max-w-[1440px] px-4">
        <div className="absolute top-[191px] left-1/2 h-[460px] w-full max-w-[1440px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(0,173,239,0.01)_0%,rgba(0,173,239,0.04)_51%,rgba(0,173,239,0.01)_100%)]" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <h2 className="[font-family:'Manrope',Helvetica] font-bold text-[#1d223f] text-[46px] text-center tracking-[0] leading-[55.2px]">
            Our Recruitment Practice Areas
          </h2>

          <p className="max-w-[1140px] [font-family:'Manrope',Helvetica] font-light text-[#1d223f] text-2xl text-center tracking-[0] leading-[28.8px]">
            Extensive industry expertise delivering specialized resources in top
            technologies and domains.
          </p>

          <div className="w-[200px] h-1.5 bg-[#00adef] rounded-[3px]" />
        </div>

        <div className="relative z-10 mt-[90px] mx-auto max-w-[1200px]">
          <div className="hidden lg:flex flex-col items-center">
            <div className="flex justify-center gap-[12px]">
              {topRowIndustries.map((industry) => (
                <HexIndustryCard key={industry.label} industry={industry} />
              ))}
            </div>

            <div className="-mt-[25px] flex justify-center gap-[12px]">
              {bottomRowIndustries.map((industry) => (
                <HexIndustryCard key={industry.label} industry={industry} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:hidden">
            {[...topRowIndustries, ...bottomRowIndustries].map((industry) => (
              <div key={industry.label} className="flex justify-center">
                <HexIndustryCard industry={industry} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
