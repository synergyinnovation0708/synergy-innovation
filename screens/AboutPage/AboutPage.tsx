import Image from "next/image";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { FadeInView } from "@/components/FadeInView";
import { NavigationHeaderSection } from "@/screens/HomePage/sections/NavigationHeaderSection";
import { AboutPagePartnerCta } from "./AboutPagePartnerCta";

const whoArtFigure = "/images/about-assets/synergy-way-figure.png";

const certificationBadge = "/images/about-assets/certification-badge.png";
const globalImpactUnderline = "/images/about-assets/global-impact-underline.svg";

const benefitIconBg = "/icons/why-check-badge.svg";
const benefitArtBg = "/images/about-assets/why-choose-bg.svg";
const benefitArtQuestion = "/images/about-assets/why-choose-question.svg";
const benefitArtPerson = "/images/about-assets/why-choose-person.svg";

const caseArtBg = "/images/about-assets/case-0.svg";
const caseArtLayer = "/images/about-assets/case-1.svg";
const caseArtShadow = "/images/about-assets/case-2.svg";
const caseArtArrows = "/images/about-assets/case-3.svg";
const caseArtRock = "/images/about-assets/case-4.svg";
const caseArtBubble = "/images/about-assets/case-5.svg";
const caseArtCharacter = "/images/about-assets/case-6.svg";
const caseArtFlipClassName = "[transform:scaleX(-1)]";

const mapImage = "/images/about-assets/global-presence-map-figma.svg";
const mapMarkerMain = "/images/about-assets/global-presence-marker-main.svg";
const mapMarkerOne = "/images/about-assets/global-presence-marker-one.svg";
const mapMarkerTwo = "/images/about-assets/global-presence-marker-two.svg";
type TimelineItem = {
  title: string;
  year: string;
  align: "top" | "bottom";
};

const aboutFooterArrowImage = "/images/footer_about.png";

const timeline: TimelineItem[] = [
  { title: "Expansion", year: "2011 -> 2015", align: "top" },
  { title: "Global Projects", year: "2018", align: "bottom" },
  { title: "Tech Division Launch", year: "2022", align: "top" },
  { title: "Global Presence", year: "2025", align: "bottom" },
];

const benefits = [
  "Global Expertise",
  "Proven Track Record",
  "Dual Strength: Talent + Tech",
  "Confidentiality & Speed",
  "Innovation Driven Delivery",
  "AI Driven Talent Solutions",
];

const caseStudies = [
  "Hired Global CTO for Fintech in 14 Days",
  "Delivered AI powered Analytics Platform for Retail Client",
  "Scaled BFSI Workforce by 150 Engineers in 3 Months.",
];

const globalImpactStats = [
  { value: 10, suffix: "k+", label: "Onboard Candidates" },
  { value: 30, suffix: "+", label: "Employees" },
  { value: 40, suffix: "+", label: "Global Clients" },
  { value: 15, suffix: "+", label: "Years of Experience" },
];

const headingClassName = "text-[34px] font-bold leading-[1.2] text-[#1d223f] md:text-[46px]";

function TickIcon() {
  return (
    <span className="relative inline-flex h-[34px] w-[34px] items-center justify-center">
      <img src={benefitIconBg} alt="" className="absolute inset-0 h-full w-full" />
      <svg viewBox="0 0 15.8073 11.3736" aria-hidden className="relative z-[1] h-[16px] w-[16px]">
        <path
          d="M15.44 0.367157C14.9509 -0.12254 14.1567 -0.122231 13.667 0.367157L5.68726 8.34664L2.14061 4.80027C1.65088 4.31058 0.857031 4.31058 0.367299 4.80027C-0.122433 5.28997 -0.122433 6.08376 0.367299 6.57346L4.80042 11.0063C5.04513 11.251 5.36601 11.3736 5.68692 11.3736C6.00783 11.3736 6.32902 11.2513 6.57373 11.0063L15.44 2.14031C15.9297 1.65095 15.9297 0.856824 15.44 0.367157Z"
          fill="#fff"
        />
      </svg>
    </span>
  );
}

function CaseIcon() {
  return (
    <span className="relative inline-flex h-[34px] w-[34px] items-center justify-center">
      <img src={benefitIconBg} alt="" className="absolute inset-0 h-full w-full" />
      <svg viewBox="0 0 15.8073 11.3736" aria-hidden className="relative z-[1] h-[16px] w-[16px]">
        <path
          d="M15.44 0.367157C14.9509 -0.12254 14.1567 -0.122231 13.667 0.367157L5.68726 8.34664L2.14061 4.80027C1.65088 4.31058 0.857031 4.31058 0.367299 4.80027C-0.122433 5.28997 -0.122433 6.08376 0.367299 6.57346L4.80042 11.0063C5.04513 11.251 5.36601 11.3736 5.68692 11.3736C6.00783 11.3736 6.32902 11.2513 6.57373 11.0063L15.44 2.14031C15.9297 1.65095 15.9297 0.856824 15.44 0.367157Z"
          fill="#fff"
        />
      </svg>
    </span>
  );
}

export const AboutPage = () => {
  return (
    <div className="relative w-full overflow-hidden bg-[#f2f2f2]">
      <NavigationHeaderSection />

      <main className="w-full pb-0">
        <section className="mx-auto flex w-full max-w-[1320px] flex-col gap-10 px-4 pt-[54px] sm:px-6 lg:px-8 xl:flex-row xl:items-start xl:justify-between xl:gap-8 xl:px-10">
          <FadeInView className="w-full max-w-[609px]" amount={0.12}>
          <div className="w-full max-w-[609px]">
            <p className="text-[26px] font-bold leading-[1.2] text-[#00adef] md:text-[32px]">The Synergy Way</p>
            <h1 className="mt-[16px] max-w-[533px] text-[34px] font-bold leading-[1.2] text-[#1d223f] md:text-[46px]">
              Redefining Talent &amp;
              <br />
              Technology Partnership
            </h1>
            <svg viewBox="0 0 432 24" className="mt-[-2px] h-[21px] w-[266px] md:ml-[266px]" fill="none" aria-hidden>
              <path d="M5 19C101.5 3 236 1 427 14" stroke="#00ADEF" strokeWidth="6" strokeLinecap="round" />
            </svg>

            <div className="mt-[48px] grid gap-[20px] md:grid-cols-2">
              <article className="h-[155px] rounded-[16px] bg-white px-[24px] pt-[24px] shadow-[0px_2px_36px_rgba(0,173,239,0.08)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0px_18px_44px_rgba(0,173,239,0.12)]">
                <h2 className="text-[24px] font-semibold leading-[1.2] text-[#00adef]">Mission</h2>
                <p className="mt-[12px] max-w-[205px] text-[16px] font-normal leading-[1.35] text-[#1d223f]">
                  To empower enterprises
                  <br />
                  with world-class leadership
                  <br />
                  and technology talent.
                </p>
              </article>
              <article className="h-[155px] rounded-[16px] bg-white px-[24px] pt-[24px] shadow-[0px_2px_36px_rgba(0,173,239,0.08)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0px_18px_44px_rgba(0,173,239,0.12)]">
                <h2 className="text-[24px] font-semibold leading-[1.2] text-[#00adef]">Vision</h2>
                <p className="mt-[12px] max-w-[242px] text-[16px] font-normal leading-[1.35] text-[#1d223f]">
                  To be the most trusted partner
                  <br />
                  uniting people, process, and
                  <br />
                  technology across the globe.
                </p>
              </article>
            </div>
          </div>
          </FadeInView>

          <FadeInView className="w-full max-w-[510px] xl:w-[510px]" delay={0.14}>
          <div className="w-full max-w-[510px] xl:w-[510px]">
            <Image
              src={whoArtFigure}
              alt="Synergy partnership illustration"
              width={510}
              height={457}
              sizes="(max-width: 1279px) 100vw, 510px"
              priority
              className="page-art-float h-auto w-full object-contain mix-blend-multiply"
            />
          </div>
          </FadeInView>
        </section>

        <FadeInView amount={0.12}>
        <section className="mx-auto mt-[74px] w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <h2 className="text-[34px] font-bold leading-[1.2] text-[#1d223f] md:text-[46px]">Our Journey</h2>

          <div className="mt-[60px] hidden xl:block">
            <div className="relative h-[252px] w-[1240px]">
              <div className="absolute left-0 top-[101px] flex gap-[20px]">
                <div className="relative h-[34px] w-[295px]">
                  <div className="absolute left-0 top-[14px] h-[20px] w-[295px] rounded-[10px] bg-[#00adef]" />
                  <div className="absolute left-1/2 top-0 flex h-[28.284px] w-[28.284px] -translate-x-1/2 items-center justify-center">
                    <div className="h-[20px] w-[20px] rotate-45 bg-[#00adef]" />
                  </div>
                </div>

                <div className="relative h-[34px] w-[295px]">
                  <div className="absolute left-0 top-[14px] h-[20px] w-[295px] rounded-[10px] bg-[#00adef]" />
                  <div className="absolute left-1/2 top-[20px] flex h-[28.284px] w-[28.284px] -translate-x-1/2 items-center justify-center">
                    <div className="h-[20px] w-[20px] rotate-45 bg-[#00adef]" />
                  </div>
                </div>

                <div className="relative h-[34px] w-[295px]">
                  <div className="absolute left-0 top-[14px] h-[20px] w-[295px] rounded-[10px] bg-[#00adef]" />
                  <div className="absolute left-1/2 top-0 flex h-[28.284px] w-[28.284px] -translate-x-1/2 items-center justify-center">
                    <div className="h-[20px] w-[20px] rotate-45 bg-[#00adef]" />
                  </div>
                </div>

                <div className="relative h-[34px] w-[295px]">
                  <div className="absolute left-0 top-[14px] h-[20px] w-[295px] rounded-[10px] bg-[#00adef]" />
                  <div className="absolute left-1/2 top-[20px] flex h-[28.284px] w-[28.284px] -translate-x-1/2 items-center justify-center">
                    <div className="h-[20px] w-[20px] rotate-45 bg-[#00adef]" />
                  </div>
                </div>
              </div>

              <div className="absolute left-[67px] top-0 w-[159px] text-center">
                <p className="text-[32px] font-semibold leading-[1.2] text-[#00adef]">Expansion</p>
                <p className="mt-[8px] text-[24px] font-normal leading-[1.35] text-[#1d223f]">2011 -&gt; 2015</p>
              </div>

              <div className="absolute left-[617px] top-0 w-[320px] text-center">
                <p className="text-[32px] font-semibold leading-[1.2] text-[#00adef]">Tech Division Launch</p>
                <p className="mt-[8px] text-[24px] font-normal leading-[1.35] text-[#1d223f]">2022</p>
              </div>

              <div className="absolute left-[346px] top-[174px] w-[233px] text-center">
                <p className="text-[32px] font-semibold leading-[1.2] text-[#00adef]">Global Projects</p>
                <p className="mt-[8px] text-[24px] font-normal leading-[1.35] text-[#1d223f]">2018</p>
              </div>

              <div className="absolute left-[969px] top-[174px] w-[247px] text-center">
                <p className="text-[32px] font-semibold leading-[1.2] text-[#00adef]">Global Presence</p>
                <p className="mt-[8px] text-[24px] font-normal leading-[1.35] text-[#1d223f]">2025</p>
              </div>
            </div>
          </div>

          <div className="mt-[48px] grid grid-cols-1 gap-10 sm:grid-cols-2 xl:hidden">
            {timeline.map((item) => (
              <div key={item.title} className="relative h-[200px]">
                <div
                  className={`absolute left-1/2 w-full -translate-x-1/2 text-center ${
                    item.align === "top" ? "top-0" : "bottom-0"
                  }`}
                >
                  <p className="text-[32px] font-semibold leading-[1.2] text-[#00adef]">{item.title}</p>
                  <p className="mt-[8px] text-[24px] font-normal leading-[1.35] text-[#1d223f]">{item.year}</p>
                </div>

                <div
                  className={`absolute left-0 h-[20px] w-full rounded-[10px] bg-[#00adef] ${
                    item.align === "top" ? "top-[116px]" : "bottom-[116px]"
                  }`}
                />
                <div
                  className={`absolute left-1/2 h-[20px] w-[20px] -translate-x-1/2 rotate-45 bg-[#00adef] ${
                    item.align === "top" ? "top-[106px]" : "bottom-[106px]"
                  }`}
                />
              </div>
            ))}
          </div>
        </section>
        </FadeInView>

        <FadeInView amount={0.14}>
        <section className="mx-auto mt-[100px] w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <h2 className={headingClassName}>Certifications</h2>

          <div className="mt-[36px] flex flex-col gap-8 md:flex-row md:items-center md:gap-[48px]">
            <img src={certificationBadge} alt="Incredible Workplaces Certified" className="page-art-float h-[150px] w-[168px] object-contain" />

            <div className="relative w-full pl-[22px] md:pl-[50px]">
              <span className="absolute left-0 top-1/2 h-[200px] w-[1.6px] -translate-y-1/2 bg-[#ff0000]" aria-hidden />
              <p className="font-[Inter] text-[28px] font-semibold leading-[1.08] text-black md:text-[64.082px] md:tracking-[-2.563px]">
                We are
              </p>
              <p className="mt-[8px] break-words font-[Inter] text-[26px] font-bold leading-[1.08] text-[#ff0000] md:mt-[12px] md:text-[64.082px] md:leading-[1.02] md:tracking-[-0.64px] xl:whitespace-nowrap">
                Incredible Workplaces<span className="text-[16px] align-top md:text-[41.333px]">TM</span> Certified
              </p>
            </div>
          </div>
        </section>
        </FadeInView>

        <FadeInView amount={0.14}>
        <section className="relative mt-[100px]">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 xl:px-10">
            <h2 className={headingClassName}>Global Impact</h2>
            <img src={globalImpactUnderline} alt="" className="mt-[-2px] h-[11px] w-[164px] md:ml-[151px]" />
          </div>

          <div className="mt-[14px] w-full bg-[linear-gradient(180deg,rgba(0,173,239,0)_0%,rgba(0,173,239,0.06)_52%,rgba(0,173,239,0)_100%)] py-[50px]">
            <div className="mx-auto flex max-w-[1320px] flex-col gap-7 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,#fff_20%,#fff_80%,rgba(255,255,255,0)_100%)] px-4 py-[42px] sm:px-6 md:flex-row md:justify-between lg:px-12 xl:px-16">
              {globalImpactStats.map((stat, index) => (
                <div key={stat.label} className="contents">
                  <div className="text-center">
                    <AnimatedCounter
                      className="text-[58px] font-extrabold leading-[1.2] text-[#00adef] md:text-[72px]"
                      suffix={stat.suffix}
                      value={stat.value}
                    />
                    <p className="text-[24px] leading-[1.2] text-[#1d223f]">{stat.label}</p>
                  </div>
                  {index < globalImpactStats.length - 1 ? (
                    <div className="hidden w-px bg-black/20 md:block" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
        </FadeInView>

        <FadeInView amount={0.14}>
        <section className="mx-auto mt-[100px] flex max-w-[1320px] flex-col justify-between gap-12 px-4 sm:px-6 lg:flex-row lg:gap-8 lg:px-8 xl:px-10">
          <div className="w-full max-w-[708px]">
            <h2 className={headingClassName}>Why Choose Us?</h2>
            <div className="mt-4 h-[6px] w-[200px] rounded-[3px] bg-[#00adef]" />

            <div className="mt-11 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <article
                  key={benefit}
                  className="flex h-[160px] flex-col items-center justify-center rounded-2xl bg-white px-6 text-center shadow-[0px_2px_36px_rgba(0,173,239,0.08)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0px_18px_44px_rgba(0,173,239,0.14)]"
                >
                  <TickIcon />
                  <p className="mt-3 text-[24px] leading-[1.35] text-[#1d223f]">{benefit}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="flex w-full max-w-[484px] items-center justify-center lg:justify-end">
            <div className="relative aspect-[483.684/315.1] w-full max-w-[484px]">
              <img src={benefitArtBg} alt="" className="absolute inset-0 h-full w-full" />
                <img
                  src={benefitArtQuestion}
                  alt=""
                  className="page-art-float absolute left-[36.8%] top-[1.95%] h-[41.6%] w-[18.77%]"
                />
                <img
                  src={benefitArtPerson}
                  alt="Why choose us illustration"
                  className="page-art-float-delay absolute left-[8.25%] top-[16.23%] h-[63.6%] w-[26.43%]"
                />
              </div>
            </div>
        </section>
        </FadeInView>

        <FadeInView amount={0.14}>
        <section className="mx-auto mt-[100px] w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="mx-auto w-full">
            <h2 className={headingClassName}>Case Studies</h2>
            <div className="mt-4 h-[6px] w-[200px] rounded-[3px] bg-[#00adef]" />

            <div className="mt-11 grid gap-5 md:grid-cols-2 xl:grid-cols-[399.898px_399.898px_472.917px] xl:grid-rows-[166.201px_166.201px] xl:gap-x-5 xl:gap-y-5">
              <article className="rounded-2xl bg-white p-7 shadow-[0px_2px_36px_rgba(0,173,239,0.08)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0px_18px_44px_rgba(0,173,239,0.12)] md:h-[166px] xl:col-start-1 xl:row-start-1">
                <CaseIcon />
                <p className="mt-3 max-w-[344px] text-[24px] font-medium leading-[1.35] text-[#1d223f]">{caseStudies[0]}</p>
              </article>

              <article className="rounded-2xl bg-white p-7 shadow-[0px_2px_36px_rgba(0,173,239,0.08)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0px_18px_44px_rgba(0,173,239,0.12)] md:h-[166px] xl:col-start-2 xl:row-start-1 xl:pt-[28px] xl:pr-[21.734px] xl:pb-[28px] xl:pl-[27.898px]">
                <CaseIcon />
                <p className="mt-3 max-w-[350.266px] text-[24px] font-medium leading-[1.35] text-[#1d223f] xl:w-[350.266px] xl:max-w-none">
                  Delivered AI powered Analytics
                  <br />
                  Platform for Retail Client
                </p>
              </article>

              <article className="rounded-2xl bg-white p-7 shadow-[0px_2px_36px_rgba(0,173,239,0.08)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0px_18px_44px_rgba(0,173,239,0.12)] md:h-[166px] xl:col-start-1 xl:row-start-2">
                <CaseIcon />
                <p className="mt-3 max-w-[344px] text-[24px] font-medium leading-[1.35] text-[#1d223f]">{caseStudies[2]}</p>
              </article>

              <div className="relative h-[352.402px] w-full max-w-[472.917px] overflow-hidden transition-transform duration-300 hover:-translate-y-2 md:col-span-2 xl:col-span-1 xl:col-start-3 xl:row-[1/span_2] xl:w-[472.917px] xl:max-w-none xl:justify-self-end">
                <img src={caseArtBg} alt="" className={`absolute left-0 top-0 h-[327.714px] w-[472.917px] ${caseArtFlipClassName}`} />
                <img
                  src={caseArtLayer}
                  alt=""
                  className={`absolute left-[51px] top-[48px] h-[261.541px] w-[361.376px] ${caseArtFlipClassName}`}
                />
                <img
                  src={caseArtArrows}
                  alt=""
                  className={`absolute left-[87px] top-[118px] h-[176.7px] w-[282.813px] ${caseArtFlipClassName}`}
                />
                <img
                  src={caseArtRock}
                  alt=""
                  className={`absolute left-[106px] top-[299px] h-[43.52px] w-[276.367px] ${caseArtFlipClassName}`}
                />
                <img
                  src={caseArtBubble}
                  alt=""
                  className={`absolute left-[178px] top-[41px] h-[70.278px] w-[59.101px] ${caseArtFlipClassName}`}
                />
                <img
                  src={caseArtCharacter}
                  alt=""
                  className={`absolute left-[160px] top-[109px] h-[231.89px] w-[195.492px] ${caseArtFlipClassName}`}
                />
                <img
                  src={caseArtShadow}
                  alt=""
                  className={`absolute left-[53px] top-[331px] h-[21.418px] w-[366.774px] ${caseArtFlipClassName}`}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-[100px] w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="mx-auto w-full max-w-[1030px]">
            <h2 className="text-center text-[34px] font-bold leading-[1.2] text-[#1d223f] md:text-[46px]">Global Presence</h2>
            <div className="mx-auto mt-6 h-[6px] w-[200px] rounded-[3px] bg-[#00adef]" />

            <div className="relative mx-auto mt-[46px] aspect-[1030.073/636.077] w-full max-w-[1030px] transition-transform duration-300 hover:-translate-y-2">
              <img src={mapImage} alt="Global footprint map" className="absolute inset-0 h-full w-full" />
              <img src={mapMarkerMain} alt="" className="absolute left-[68.45%] top-[53.84%] h-[44px] w-[37px]" />
              <img src={mapMarkerOne} alt="" className="absolute left-[72.59%] top-[31.58%] h-[44px] w-[37px]" />
              <img src={mapMarkerTwo} alt="" className="absolute left-[57.8%] top-[36.0%] h-[44px] w-[37px]" />
              <img src={mapMarkerTwo} alt="" className="absolute left-[18.34%] top-[45.91%] h-[44px] w-[37px]" />
            </div>

            <div className="mt-[42px] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[24px] font-medium leading-[1.35] text-[#1d223f]">
                <p className="inline-flex items-center gap-2.5 whitespace-nowrap">
                  <span className="inline-flex h-3 w-3 shrink-0 rounded-full border-[3px] border-[#00adef] bg-white box-border" />
                  India HQ
                </p>
                <p className="inline-flex items-center gap-2.5 whitespace-nowrap">
                  <span className="inline-flex h-3 w-3 shrink-0 rounded-full border-[3px] border-[#00adef] bg-white box-border" />
                  APAC
                </p>
                <p className="inline-flex items-center gap-2.5 whitespace-nowrap">
                  <span className="inline-flex h-3 w-3 shrink-0 rounded-full border-[3px] border-[#00adef] bg-white box-border" />
                  North America
                </p>
                <p className="inline-flex items-center gap-2.5 whitespace-nowrap">
                  <span className="inline-flex h-3 w-3 shrink-0 rounded-full border-[3px] border-[#00adef] bg-white box-border" />
                  Middle East
                </p>
              </div>

              <p className="text-[24px] font-bold leading-[1.35] text-[#1d223f] md:text-right">25+ Countries</p>
            </div>
          </div>
        </section>
        </FadeInView>

        <FadeInView amount={0.08}>
        <section className="mt-[114px] overflow-hidden bg-[#1d234f]">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-12 px-4 py-[48px] sm:px-6 md:py-[56px] lg:min-h-[381px] lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-0 xl:px-10">
            <div className="max-w-[652px] lg:pb-[58px] lg:pt-[54px]">
              <h2 className="max-w-[652px] text-[40px] font-bold leading-[1.08] text-white md:text-[34px] lg:text-[46px]">
                Let&apos;s Build Your Future Workforce and Digital Capability Together.
              </h2>

              <AboutPagePartnerCta />
            </div>

            <div className="relative flex h-[260px] w-full items-end justify-end self-end sm:h-[320px] lg:h-[381px] lg:w-[445.866px]">
              <div className="relative h-full w-[304px] sm:w-[370px] lg:w-[445.866px]" aria-hidden>
                <Image
                  src={aboutFooterArrowImage}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 304px, (max-width: 1023px) 370px, 446px"
                  className="absolute bottom-0 right-0 object-contain drop-shadow-[0_18px_30px_rgba(9,8,20,0.18)]"
                />
              </div>
            </div>
          </div>
        </section>
        </FadeInView>
      </main>
    </div>
  );
};
