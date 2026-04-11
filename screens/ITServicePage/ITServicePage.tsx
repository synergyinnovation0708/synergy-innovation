import Image from "next/image";
import type { ReactNode } from "react";
import { FadeInView } from "@/components/FadeInView";
import { NavigationHeaderSection } from "@/screens/HomePage/sections/NavigationHeaderSection";
import { ITServicesExpertiseSection } from "./ITServicesExpertiseSection";
import { ITServicesInquiryTrigger, ITServicesTopCta } from "./ITServicesTopCta";

const stories = [
  {
    title: "Global BFSI Firm",
    description: "Scaled operations by 40% with a custom ERP solution.",
    image: "/images/it-story-bfsi.jpg",
    imageClassName: "object-[50%_54%]",
  },
  {
    title: "E-commerce Giant",
    description: "Boosted conversions by 65% with SEO + PPC campaigns.",
    image: "/images/it-story-ecommerce.jpg",
    imageClassName: "object-[50%_50%]",
  },
  {
    title: "Healthcare Innovator",
    description: "Reduced costs by 30% using AI-driven automation.",
    image: "/images/it-story-healthcare.jpg",
    imageClassName: "object-[68%_50%]",
  },
];

const sidePattern01 = "/images/it-services-side-01.svg";
const sidePattern02 = "/images/it-services-side-02.svg";
const sidePattern03 = "/images/it-services-side-03.svg";
const sidePattern04 = "/images/it-services-side-04.svg";
const sidePattern05 = "/images/it-services-side-05.svg";
const sidePattern06 = "/images/it-services-side-06.svg";
const sidePattern07 = "/images/it-services-side-07.svg";
const sidePattern08 = "/images/it-services-side-08.svg";

function SidePatternSegment({
  src,
  wrapperClassName,
  sizeClassName,
  opacityClassName,
  bleedClassName = "inset-0",
}: {
  src: string;
  wrapperClassName: string;
  sizeClassName: string;
  opacityClassName: string;
  bleedClassName?: string;
}) {
  return (
    <div
      className={`absolute flex items-center justify-center ${wrapperClassName}`}
      aria-hidden
    >
      <div className={`-rotate-90 -scale-y-100 flex-none ${sizeClassName}`}>
        <div className={`relative size-full ${opacityClassName}`}>
          <div
            className={`absolute bg-[length:100%_100%] bg-no-repeat ${bleedClassName}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        </div>
      </div>
    </div>
  );
}

function ITServicesSidePattern({ right = false }: { right?: boolean }) {
  return (
    <div
      className={`it-services-side-drift absolute top-0 hidden h-[2778.333px] w-[500px] lg:block ${right ? "right-0 -scale-x-100 it-services-side-drift-reverse" : "left-0"}`}
      aria-hidden
    >
      <div className="relative h-full w-full">
        <SidePatternSegment
          src={sidePattern07}
          wrapperClassName="inset-[0.24%_86.73%_74.17%_-19.44%]"
          sizeClassName="h-[471.068px] w-[726.588px]"
          opacityClassName="opacity-10"
          bleedClassName="inset-[0_-0.21%]"
        />
        <SidePatternSegment
          src={sidePattern08}
          wrapperClassName="inset-[0.35%_84.72%_74.34%_-0.22%]"
          sizeClassName="h-[223.136px] w-[718.76px]"
          opacityClassName="opacity-10"
        />
        <SidePatternSegment
          src={sidePattern05}
          wrapperClassName="inset-[0.17%_86.59%_74.52%_-2.08%]"
          sizeClassName="h-[223.136px] w-[718.76px]"
          opacityClassName="opacity-2"
        />
        <SidePatternSegment
          src={sidePattern06}
          wrapperClassName="inset-[0_84.87%_74.42%_-17.58%]"
          sizeClassName="h-[471.068px] w-[726.588px]"
          opacityClassName="opacity-2"
          bleedClassName="inset-[0_-0.21%]"
        />
        <SidePatternSegment
          src={sidePattern01}
          wrapperClassName="inset-[25.62%_85.05%_51.32%_-12.47%]"
          sizeClassName="h-[394.905px] w-[654.927px]"
          opacityClassName="opacity-10"
          bleedClassName="inset-[0_-0.23%]"
        />
        <SidePatternSegment
          src={sidePattern02}
          wrapperClassName="inset-[25.92%_84.92%_51.25%_-2.69%]"
          sizeClassName="h-[255.931px] w-[648.351px]"
          opacityClassName="opacity-10"
        />
        <SidePatternSegment
          src={sidePattern03}
          wrapperClassName="inset-[25.85%_89.13%_51.09%_-16.55%]"
          sizeClassName="h-[394.905px] w-[654.927px]"
          opacityClassName="opacity-2"
          bleedClassName="inset-[0_-0.23%]"
        />
        <SidePatternSegment
          src={sidePattern04}
          wrapperClassName="inset-[25.79%_89%_51.38%_-6.77%]"
          sizeClassName="h-[255.931px] w-[648.351px]"
          opacityClassName="opacity-2"
        />
        <SidePatternSegment
          src={sidePattern07}
          wrapperClassName="inset-[49.16%_86.73%_25.26%_-19.44%]"
          sizeClassName="h-[471.068px] w-[726.588px]"
          opacityClassName="opacity-10"
          bleedClassName="inset-[0_-0.21%]"
        />
        <SidePatternSegment
          src={sidePattern08}
          wrapperClassName="inset-[49.26%_84.72%_25.43%_-0.22%]"
          sizeClassName="h-[223.136px] w-[718.76px]"
          opacityClassName="opacity-10"
        />
        <SidePatternSegment
          src={sidePattern05}
          wrapperClassName="inset-[49.08%_86.59%_25.61%_-2.08%]"
          sizeClassName="h-[223.136px] w-[718.76px]"
          opacityClassName="opacity-2"
        />
        <SidePatternSegment
          src={sidePattern06}
          wrapperClassName="inset-[48.91%_84.87%_25.5%_-17.58%]"
          sizeClassName="h-[471.068px] w-[726.588px]"
          opacityClassName="opacity-2"
          bleedClassName="inset-[0_-0.21%]"
        />
        <SidePatternSegment
          src={sidePattern01}
          wrapperClassName="inset-[74.54%_85.05%_2.4%_-12.47%]"
          sizeClassName="h-[394.905px] w-[654.927px]"
          opacityClassName="opacity-10"
          bleedClassName="inset-[0_-0.23%]"
        />
        <SidePatternSegment
          src={sidePattern02}
          wrapperClassName="inset-[74.84%_84.92%_2.34%_-2.69%]"
          sizeClassName="h-[255.931px] w-[648.351px]"
          opacityClassName="opacity-10"
        />
        <SidePatternSegment
          src={sidePattern03}
          wrapperClassName="inset-[74.77%_89.13%_2.17%_-16.55%]"
          sizeClassName="h-[394.905px] w-[654.927px]"
          opacityClassName="opacity-2"
          bleedClassName="inset-[0_-0.23%]"
        />
        <SidePatternSegment
          src={sidePattern04}
          wrapperClassName="inset-[74.7%_89%_2.47%_-6.77%]"
          sizeClassName="h-[255.931px] w-[648.351px]"
          opacityClassName="opacity-2"
        />
      </div>
    </div>
  );
}

function FooterCta() {
  return (
    <ITServicesInquiryTrigger
      className="group inline-flex h-[50px] w-full items-center justify-between rounded-[25px] border-[0.5px] border-white pl-[24px] pr-[4px] text-[20px] font-semibold leading-[1.2] text-white transition-transform duration-300 hover:-translate-y-1 max-md:h-auto max-md:min-h-[58px] max-md:gap-4 max-md:pl-5 max-md:pr-2 max-md:text-[18px]"
    >
      <span className="max-md:text-left">Let&apos;s Begin Your Transformation Journey</span>
      <img
        src="/icons/Group.svg"
        alt=""
        className="h-[42px] w-[42px] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45"
      />
    </ITServicesInquiryTrigger>
  );
}

function WhyIcon() {
  return (
    <span className="relative inline-block h-[34.201px] w-[34.201px]">
      <img src="/icons/why-check-badge.svg" alt="" className="h-full w-full" />
      <img src="/icons/why-check-mark.svg" alt="" className="absolute left-[9.19px] top-[12.19px] h-[11.374px] w-[15.806px]" />
    </span>
  );
}

type WhyCardProps = {
  text: ReactNode;
  widthClassName: string;
};

function WhyCard({ text, widthClassName }: WhyCardProps) {
  return (
    <article
      className={`flex h-[104.2px] flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 ${widthClassName}`}
    >
      <WhyIcon />
      <p className="mt-[16px] text-[20px] font-normal leading-[1.35] text-[#1d223f]">{text}</p>
    </article>
  );
}

const whyTopTexts: ReactNode[] = [
  <>
    12+ years of excellence
    <br />
    in IT &amp; Digital Solutions
  </>,
  <>
    Expertise in BFSI, IT, Consulting,
    <br />
    Manufacturing, Healthcare &amp; Retail
  </>,
  <>
    Trusted by Tier-1 MNCs &amp;
    <br />
    Fortune 500 enterprises
  </>,
];

const whyBottomTexts: ReactNode[] = [
  <>
    Agile, scalable, and
    <br />
    technology-driven approach
  </>,
  <>
    Global delivery model with
    <br />
    presence across 12+ countries
  </>,
];

export const ITServicePage = () => {
  return (
    <div className="w-full overflow-hidden bg-[#f5f7fa]">
      <NavigationHeaderSection />
      <main className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[2368px] overflow-hidden lg:block" aria-hidden>
          <ITServicesSidePattern />
          <ITServicesSidePattern right />
        </div>

        <section className="relative h-[501px] px-4 pb-10 pt-10 sm:px-6 lg:px-8 xl:px-10 max-md:h-auto max-md:pb-16 max-md:pt-6">
          <div
            className="it-services-soft-glow absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,173,239,0.04) 0%, rgba(0,173,239,0) 100%)",
            }}
          />

          <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center pt-[48px] text-center max-md:px-2 max-md:pt-0">
            <FadeInView delay={0.04}>
              <p className="inline-flex h-[61px] items-center rounded-[16px] bg-[rgba(0,173,239,0.06)] px-[32px] text-[24px] font-normal leading-[1.2] text-[#1d223f] max-md:h-auto max-md:w-full max-md:justify-center max-md:px-5 max-md:py-3 max-md:text-[16px]">
                Enterprise-Grade Digital Solutions
              </p>
            </FadeInView>

            <FadeInView delay={0.12}>
              <h1 className="mt-[24px] w-[860px] max-w-full text-[60px] font-bold leading-[1.2] text-[#1d223f] max-md:w-full max-md:text-[clamp(2.35rem,11vw,3.15rem)] max-md:leading-[1.08]">
                Transforming Ideas into
                <br className="hidden md:block" />
                Scalable Digital Excellence
              </h1>
            </FadeInView>

            <FadeInView delay={0.2}>
              <p className="mt-[32px] w-[1180.785px] max-w-full text-[24px] font-normal leading-[1.35] text-[#1d223f] max-md:w-full max-md:max-w-[22rem] max-md:text-[16px] max-md:leading-[1.5]">
                We don&apos;t just build technology - we create future-ready solutions that empower businesses to grow,
                compete, and lead. With over a decade of expertise, we combine creativity, strategy, and innovation to
                deliver high-performance software and digital solutions tailored to modern enterprises.
              </p>
            </FadeInView>

            <FadeInView delay={0.28} className="mt-[46px]">
              <ITServicesTopCta />
            </FadeInView>
          </div>
        </section>

        <section className="mt-[120px] max-md:mt-16">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-4 sm:px-6 lg:px-8 xl:px-10">
            <FadeInView>
              <h2 className="text-center text-[46px] font-bold leading-[1.2] text-[#1d223f] max-md:text-[38px]">
                Our Expertise
              </h2>
            </FadeInView>
            <FadeInView delay={0.08}>
              <div className="mt-[24px] h-[6px] w-[200px] rounded-[3px] bg-[#00adef]" />
            </FadeInView>
          </div>

          <FadeInView delay={0.14}>
            <ITServicesExpertiseSection />
          </FadeInView>
        </section>

        <section className="mt-[120px] max-md:mt-16">
          <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
            <FadeInView>
              <h2 className="text-center text-[46px] font-bold leading-[1.2] text-[#1d223f] max-md:text-[38px] md:whitespace-nowrap">
                Why Synergy Innovation?
              </h2>
            </FadeInView>
            <FadeInView delay={0.08}>
              <div className="mx-auto mt-[24px] h-[6px] w-[200px] rounded-[3px] bg-[#00adef]" />
            </FadeInView>

            <div className="relative mt-[46px] hidden h-[104.201px] w-[983.855px] max-w-full lg:block">
              <FadeInView className="absolute left-0 top-0 w-[213.309px]" delay={0.06}>
                <WhyCard text={whyTopTexts[0]} widthClassName="w-[213.309px]" />
              </FadeInView>
              <span className="absolute left-[259.309px] top-[2.1px] h-[100px] w-px bg-black/20" aria-hidden />
              <FadeInView className="absolute left-[306.309px] top-0 w-[352.02px]" delay={0.14}>
                <WhyCard text={whyTopTexts[1]} widthClassName="w-[352.02px]" />
              </FadeInView>
              <span className="absolute left-[704.329px] top-[2.1px] h-[100px] w-px bg-black/20" aria-hidden />
              <FadeInView className="absolute left-[751.329px] top-0 w-[232.527px]" delay={0.22}>
                <WhyCard text={whyTopTexts[2]} widthClassName="w-[232.527px]" />
              </FadeInView>
            </div>

            <div className="mt-[46px] grid gap-y-8 lg:hidden">
              <FadeInView delay={0.06}>
                <WhyCard text={whyTopTexts[0]} widthClassName="w-full" />
              </FadeInView>
              <FadeInView delay={0.14}>
                <WhyCard text={whyTopTexts[1]} widthClassName="w-full" />
              </FadeInView>
              <FadeInView delay={0.22}>
                <WhyCard text={whyTopTexts[2]} widthClassName="w-full" />
              </FadeInView>
            </div>

            <div className="relative mx-auto mt-[46px] hidden h-[104.201px] w-[669.508px] max-w-full lg:block">
              <FadeInView className="absolute left-0 top-0 w-[280.625px]" delay={0.12}>
                <WhyCard text={whyBottomTexts[0]} widthClassName="w-[280.625px]" />
              </FadeInView>
              <span className="absolute left-[326.625px] top-[2.1px] h-[100px] w-px bg-black/20" aria-hidden />
              <FadeInView className="absolute left-[373.625px] top-0 w-[295.883px]" delay={0.2}>
                <WhyCard text={whyBottomTexts[1]} widthClassName="w-[295.883px]" />
              </FadeInView>
            </div>

            <div className="mx-auto mt-[46px] grid gap-y-8 lg:hidden">
              <FadeInView delay={0.12}>
                <WhyCard text={whyBottomTexts[0]} widthClassName="w-full" />
              </FadeInView>
              <FadeInView delay={0.2}>
                <WhyCard text={whyBottomTexts[1]} widthClassName="w-full" />
              </FadeInView>
            </div>
          </div>
        </section>

        <section className="mt-[120px] max-md:mt-16">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-4 sm:px-6 lg:px-8 xl:px-10">
            <FadeInView>
              <h2 className="text-center text-[46px] font-bold leading-[1.2] text-[#1d223f] max-md:text-[38px] md:whitespace-nowrap">
                Client Success Stories
              </h2>
            </FadeInView>
            <FadeInView delay={0.08}>
              <div className="mt-[24px] h-[6px] w-[200px] rounded-[3px] bg-[#00adef]" />
            </FadeInView>
          </div>

          <div
            className="mt-[46px] w-full px-4 py-0 sm:px-6 lg:px-8 xl:px-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,173,239,0) 0%, rgba(0,173,239,0.06) 40%, rgba(0,173,239,0.06) 60%, rgba(0,173,239,0) 100%)",
            }}
          >
            <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-[20px] lg:grid-cols-3">
              {stories.map((story, index) => (
                <FadeInView key={story.title} delay={0.08 * index}>
                  <article className="group h-[360px] w-full overflow-hidden rounded-[8px] bg-white transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(29,34,63,0.14)]">
                  <div className="relative h-[186px] w-full overflow-hidden rounded-t-[8px]">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      sizes="(max-width: 1023px) 100vw, 33vw"
                      quality={72}
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${story.imageClassName}`}
                    />
                  </div>
                  <div className="px-[17.5px] pt-[30.5px]">
                    <h3 className="text-[24px] font-semibold leading-[1.2] text-[#00adef]">{story.title}</h3>
                    <div className="mt-[16.5px] h-[0.5px] w-[200px] bg-[linear-gradient(90deg,#1d223f_0%,rgba(29,34,63,0)_100%)]" />
                    <p className="mt-[16px] text-[18px] font-normal leading-[1.4] text-[#1d223f]">
                      {story.description}
                    </p>
                  </div>
                  </article>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-[68px] min-h-[471.598px] overflow-hidden bg-[#1d223f]">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <Image
              src="/images/it-services-footer-bg.jpg"
              alt=""
              fill
              sizes="100vw"
              quality={68}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[rgba(29,34,63,0.86)]" />
          </div>

          <div className="relative mx-auto flex w-full max-w-[900px] flex-col items-center px-4 pb-[120px] pt-[120px] text-center sm:px-6 lg:px-8 max-md:py-16">
            <FadeInView>
              <h2 className="max-w-[760px] text-[46px] font-bold leading-[1.2] text-white max-md:max-w-[320px] max-md:text-[32px] max-md:leading-[1.15] md:whitespace-nowrap">
                Let&apos;s Build the Future Together
              </h2>
            </FadeInView>
            <FadeInView delay={0.08}>
              <p className="mx-auto mt-[24px] w-[683.141px] max-w-full text-[24px] font-normal leading-[1.35] text-white/80 max-md:w-full max-md:max-w-[340px] max-md:text-[17px] max-md:leading-[1.5]">
                Partner with Synergy Innovation to unlock next-gen software solutions that redefine business excellence.
              </p>
            </FadeInView>
            <FadeInView delay={0.16} className="mt-[38px] w-full max-w-[467.214px]">
              <FooterCta />
            </FadeInView>
          </div>
        </section>
      </main>
    </div>
  );
};
