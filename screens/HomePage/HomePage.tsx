import Image from "next/image";
import { FadeInView } from "@/components/FadeInView";
import { ServiceChatbotCard } from "@/components/ServiceChatbotCard";
import type { PublicJobListing } from "@/lib/public-jobs-shared";
import { ClientIndustriesSection } from "./sections/ClientIndustriesSection/ClientIndustriesSection";
import { ClientTestimonialsSection } from "./sections/ClientTestimonialsSection/ClientTestimonialsSection";
import { CompanyOverviewSection } from "./sections/CompanyOverviewSection";
import { ContractToHireServicesSection } from "./sections/ContractToHireServicesSection/ContractToHireServicesSection";
import { ExpertiseOverviewSection } from "./sections/ExpertiseOverviewSection/ExpertiseOverviewSection";
import { FooterSection } from "./sections/FooterSection";
import { HeroBannerSection } from "./sections/HeroBannerSection";
import { ImpactStatisticsSection } from "./sections/ImpactStatisticsSection";
import { JobSearchSection } from "./sections/JobSearchSection";
import { NavigationHeaderSection } from "./sections/NavigationHeaderSection";
import { RecruitmentSolutionsSection } from "./sections/RecruitmentSolutionsSection/RecruitmentSolutionsSection";

const homeBackgroundWave = "/images/homepage-wave.svg";

const clientLogos = [
  {
    alt: "Kotak Mahindra Bank",
    height: 45.866214752197266,
    src: "/images/image 2.png",
    width: 155.3912353515625,
  },
  {
    alt: "IDFC FIRST Bank",
    height: 40.516456604003906,
    src: "/images/image 3.png",
    width: 115.76129150390625,
  },
  {
    alt: "HSBC",
    height: 40.194252014160156,
    src: "/images/image 4.png",
    width: 149.66876220703125,
  },
  {
    alt: "VEGA",
    height: 30.076749801635742,
    src: "/images/image 17.png",
    width: 107.707275390625,
  },
  {
    alt: "Godrej Consumer Products",
    height: 52,
    src: "/images/godrej1.png",
    width: 260,
  },
  {
    alt: "Bechtel",
    height: 55.94794845581055,
    src: "/images/image 23.png",
    width: 74.04875183105469,
  },
  {
    alt: "Enterprise Client Logo",
    height: 33.225677490234375,
    src: "/images/image 24.png",
    width: 249.0730438232422,
  },
  {
    alt: "Niva Client Logo",
    height: 55.298,
    src: "/images/niva.png",
    width: 100.134,
  },
  {
    alt: "KPMG Client Logo",
    height: 45.715,
    src: "/images/kpmg.png",
    width: 110.406,
  },
  {
    alt: "Wipro Client Logo",
    height: 43.504,
    src: "/images/wipro.png",
    width: 110.23,
  },
  {
    alt: "Tech Mahindra Client Logo",
    height: 37.878,
    src: "/images/tech.png",
    width: 133.749,
  },
  {
    alt: "KPIT Client Logo",
    height: 27.114,
    src: "/images/kpit.png",
    width:  94.245,
  },
  {
    alt: "orient Client Logo",
    height: 39.04,
    src: "/images/orient.png",
    width:  107.464,
  },
  {
    alt: "Havells Client Logo",
    height: 49.078,
    src: "/images/havells.png",
    width:  74.865,
  },
  {
    alt: "Mahle Client Logo",
    height: 28.268,
    src: "/images/mahle.png",
    width:  121.448,
  },
  {
    alt: "polycab Client Logo",
    height: 28.283,
    src: "/images/polycab.png",
    width:  124.776,
  },
  {
    alt: "ufelx Client Logo",
    height: 36.601,
    src: "/images/ufelx.png",
    width:  127.271,
  },
  {
    alt: "bosch Client Logo",
    height: 38.489,
    src: "/images/bosch.png",
    width:  171.658,
  },
  {
    alt: "yasodha Client Logo",
    height: 51.938,
    src: "/images/yasodha.png",
    width:  186.801,
  },
  {
    alt: "reckitt Client Logo",
    height: 48.779,
    src: "/images/reckitt.png",
    width:  86.717,
  },
  {
    alt: "fortis Client Logo",
    height: 43.072,
    src: "/images/fortis.png",
    width:  114.86,
  },
  {
    alt: "max Client Logo",
    height: 35.213,
    src: "/images/max.png",
    width:  106.025,
  },
  {
    alt: "gsk Client Logo",
    height: 30.774,
    src: "/images/gsk.png",
    width: 97.727,
  },
  {
    alt: "hcl Client Logo",
    height: 42.018,
    src: "/images/hcl.png",
    width: 147.358,
  },
 
  {
    alt: "tata Client Logo",
    height: 25.974,
    src: "/images/tata.png",
    width: 198.594,
  },
  {
    alt: "yes Client Logo",
    height: 35.508,
    src: "/images/yes.png",
    width: 169.931,
  },
  {
    alt: "aaditya Client Logo",
    height: 41.254,
    src: "/images/aaditya.png",
    width: 142.97,
  },
  {
    alt: "axis Client Logo",
    height: 42.302,
    src: "/images/axis.png",
    width: 153.161,
  },
  {
    alt: "reliance Client Logo",
    height: 44.977,
    src: "/images/reliance.png",
    width: 184.049
  },
  {
    alt: "canara Client Logo",
    height: 46.623,
    src: "/images/canara.png",
    width: 157.353
  },
  {
    alt: "r Client Logo",
    height: 40.928,
    src: "/images/r.png",
    width: 63.952
  },
  {
    alt: "birla Client Logo",
    height: 37.927,
    src: "/images/birla.png",
    width: 194.067
  },
];

const marqueeLogos = [...clientLogos, ...clientLogos];

type HomePageProps = {
  jobs: PublicJobListing[];
  jobsErrorMessage: string | null;
};

export const HomePage = ({ jobs, jobsErrorMessage }: HomePageProps) => {
  return (
    <div
      id="page-top"
      className="relative w-full overflow-hidden bg-white"
      data-model-id="412:5"
    >
      <div
        className="page-wave-drift pointer-events-none absolute left-1/2 top-[31.5%] hidden h-[2172px] w-[2133px] -translate-x-[52%] lg:block"
        aria-hidden
      >
        <Image
          className="h-full w-full max-w-none"
          alt=""
          src={homeBackgroundWave}
          width={2133}
          height={2172}
        />
      </div>

      <NavigationHeaderSection />
      <FadeInView amount={0.08} delay={0.02}>
        <HeroBannerSection />
      </FadeInView>
      <FadeInView amount={0.12} delay={0.04}>
        <JobSearchSection jobs={jobs} errorMessage={jobsErrorMessage} />
      </FadeInView>
      <FadeInView amount={0.14}>
        <RecruitmentSolutionsSection />
      </FadeInView>
      <FadeInView amount={0.14}>
        <ExpertiseOverviewSection />
      </FadeInView>
      <FadeInView amount={0.14}>
        <CompanyOverviewSection />
      </FadeInView>
      <FadeInView amount={0.14}>
        <ClientTestimonialsSection />
      </FadeInView>
      <FadeInView amount={0.14}>
        <ClientIndustriesSection />
      </FadeInView>

      <FadeInView amount={0.16}>
        <section className="relative w-full py-12 bg-[linear-gradient(180deg,rgba(0,173,239,0)_0%,rgba(0,173,239,0.02)_100%)]">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-8 px-4 md:px-0">
          <FadeInView delay={0.04}>
            <h2 className="font-bold text-[#1d223f] text-[34px] md:text-[46px] text-center leading-[1.2]">
              Our Valued Clients
            </h2>
          </FadeInView>

          <div
            className="relative w-full overflow-hidden py-2"
            style={{
              maskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)",
            }}
          >
            <div className="flex w-max min-w-full items-center motion-safe:animate-[clients-marquee_28s_linear_infinite] hover:[animation-play-state:paused]">
              {marqueeLogos.map((logo, index) => (
                <div key={`${logo.src}-${index}`} className="flex shrink-0 items-center">
                  <div className="flex h-[56px] shrink-0 items-center justify-center px-[28px]">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={Math.round(logo.width)}
                      height={Math.round(logo.height)}
                      className="max-w-none object-contain opacity-90 transition-opacity duration-300 hover:opacity-100"
                      style={{
                        height: `${logo.height}px`,
                        maxWidth: `${logo.width}px`,
                        width: "auto",
                      }}
                    />
                  </div>
                  {index < marqueeLogos.length - 1 ? (
                    <span className="h-[50.5px] w-px shrink-0 bg-black/10" aria-hidden />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
        </section>
      </FadeInView>

      <FadeInView amount={0.14}>
        <ContractToHireServicesSection />
      </FadeInView>
      <FadeInView amount={0.14}>
        <ImpactStatisticsSection />
      </FadeInView>
      <FadeInView amount={0.08}>
        <FooterSection />
      </FadeInView>
      <ServiceChatbotCard />
    </div>
  );
};
