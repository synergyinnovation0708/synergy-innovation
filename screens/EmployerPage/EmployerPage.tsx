import { FadeInView } from "@/components/FadeInView";
import { FooterSection } from "@/screens/HomePage/sections/FooterSection";
import { NavigationHeaderSection } from "@/screens/HomePage/sections/NavigationHeaderSection";

const heroImage = "/images/employer-hero.png";
const overviewImage = "/images/employer-overview.png";
const outreachImage = "/images/employer-outreach.png";
const strengthImage = "/images/employer-strength.png";
const whyImage = "/images/employer-why.png";
const topWavePattern = "/images/employer-wave-top.svg";
const bottomWavePattern = "/images/employer-wave-bottom.svg";

const heroServices = [
  "Executive Search",
  "Global Recruitment",
  "Training & Development",
  "Recruitment Process Outsourcing",
  "Talent Hiring Services",
];

const overviewPoints = [
  "Synergy Innovation is a Growth Stage Talent Engagement, Management, Development & Consulting (TEMD&C) company incepted in December 2011 with a comprehensive service offering in the Technology Space that includes RPO, Contingency Recruitment, Cross Border Recruitment, and Executive Searches.",
  "Thorough research and accurate mapping of the interests of both, our clients, as well as, our candidates, is what sets us apart.",
  "As a corporate partner to clients, we source professionals with high intellectual capabilities to help enhance the client's human capital on one hand, and on the other, we help individuals optimize their career choices.",
  "Our processes are built to maintain the highest ethical standards with complete confidentiality thus a solid performance, consistent delivery, & enabling high-quality Specialties.",
];

const outreachPrimary = [
  "Experience in End-to-end Recruitment Solutions",
  "Expertise in Middle to Leadership Hiring",
];

const outreachIndustries = [
  "IT / ITes",
  "Engineering & Technology",
  "Manufacturing",
  "FMCG & Consumer Durables",
  "Retail",
  "Automotive",
  "Pharmaceuticals & Healthcare",
  "Supply Chain & Logistics",
];

const roiPoints = [
  "Talent Mapping",
  "Organization Mapping",
  "Compensation Mapping",
  "Reduced hiring response time (backfills or back offs)",
  "One partner for all recruitment needs",
  "Growth capitalization",
];

const qualityPoints = [
  "Our widespread geographic coverage & diversified portfolio of services",
  "Automated Workflow Management System that allows online & real-time matching of profiles with clients' needs",
  "One shop for all Talent Management, Background checks & Payroll Management at Zero Cost",
  "Consistency in robust selection process",
  "Recruitment at all levels in a client organization",
];

const headingClassName = "text-[34px] font-bold leading-[1.1] text-black md:text-[46px]";
const bodyClassName = "break-words text-[16px] leading-[1.35] text-[#1d223f] md:text-[24px]";

function Dot() {
  return <span className="mt-[0.5em] inline-flex h-2 w-2 shrink-0 rounded-full bg-[#00adef]" aria-hidden />;
}

function BulletText({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Dot />
      <span className={bodyClassName}>{children}</span>
    </li>
  );
}

function PunctuatedBullets({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map((item) => (
        <p key={item} className={`${bodyClassName} inline-flex items-start gap-2.5 md:whitespace-nowrap`}>
          <span className="mt-[0.5em] inline-flex h-2 w-2 shrink-0 rounded-full bg-[#00adef]" aria-hidden />
          <span>{item}</span>
        </p>
      ))}
    </div>
  );
}

function ImageCard({
  src,
  alt,
  className,
  imageClassName = "",
}: {
  src: string;
  alt: string;
  className: string;
  imageClassName?: string;
}) {
  return (
    <div className={`group overflow-hidden rounded-[16px] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(29,34,63,0.12)] ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageClassName}`}
      />
    </div>
  );
}

function BackgroundWave({
  className,
  innerClassName,
  src,
}: {
  className: string;
  innerClassName: string;
  src: string;
}) {
  return (
    <div className={`page-wave-drift pointer-events-none absolute flex w-[2156.28px] items-center justify-center ${className}`} aria-hidden>
      <div className={`relative h-[1830.586px] w-[1797.455px] flex-none ${innerClassName}`}>
        <div
          className="absolute inset-0 bg-[length:100%_100%] bg-no-repeat"
          style={{ backgroundImage: `url(${src})` }}
        />
      </div>
    </div>
  );
}

export const EmployerPage = () => {
  return (
    <div className="relative w-full overflow-hidden bg-white">
      <BackgroundWave
        className="-translate-x-1/2 left-[calc(54.17%-4.3px)] top-[0.73%] bottom-[37.13%]"
        innerClassName="rotate-[-167.29deg]"
        src={topWavePattern}
      />
      <BackgroundWave
        className="-translate-x-1/2 left-[calc(54.17%-4.3px)] top-[48.65%] bottom-[-10.8%]"
        innerClassName="-scale-y-100 rotate-[-12.71deg]"
        src={bottomWavePattern}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 flex h-[680px] w-[1440px] -translate-x-1/2 items-center justify-center" aria-hidden>
        <div className="-scale-y-100 h-[680px] w-[1440px] flex-none bg-gradient-to-b from-[rgba(0,173,239,0.01)] to-[rgba(0,173,239,0.06)]" />
      </div>

      <NavigationHeaderSection />

      <main className="relative z-10 mx-auto max-w-[1440px] px-4 pb-[120px] pt-[40px] md:px-[100px]">
        <section className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_707px] md:gap-[60px]">
          <FadeInView className="pt-1" amount={0.12}>
          <div className="pt-1">
            <h1 className={`${headingClassName} max-w-[505px]`}>Matching Talent with Leading Companies</h1>
            <ul className="mt-8 space-y-2.5">
              {heroServices.map((service) => (
                <BulletText key={service}>{service}</BulletText>
              ))}
            </ul>
          </div>
          </FadeInView>

          <FadeInView delay={0.14}>
            <ImageCard
              src={heroImage}
              alt="Business professionals discussing plans in office"
              className="h-auto w-full md:h-[520px] md:w-[707px]"
              imageClassName="page-art-float md:object-[15.86%_0%]"
            />
          </FadeInView>
        </section>

        <section className="mt-[96px] grid items-start gap-10 md:grid-cols-[400px_minmax(0,1fr)] md:gap-[80px]">
          <FadeInView delay={0.06}>
            <ImageCard
              src={overviewImage}
              alt="Client handshake meeting"
              className="order-2 h-auto w-full md:order-1 md:h-[583px] md:w-[400px]"
              imageClassName="page-art-float-delay md:object-[50%_3%]"
            />
          </FadeInView>

          <FadeInView className="order-1 md:order-2" delay={0.12}>
          <div className="order-1 md:order-2">
            <h2 className={headingClassName}>Overview</h2>
            <ul className="mt-7 space-y-4">
              {overviewPoints.map((point) => (
                <BulletText key={point}>{point}</BulletText>
              ))}
            </ul>
          </div>
          </FadeInView>
        </section>

        <section className="mt-[120px] grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_398px] md:gap-[80px]">
          <FadeInView delay={0.08}>
          <div>
            <h2 className={headingClassName}>Client Outreach</h2>

            <div className="mt-7 space-y-3">
              <p className={bodyClassName}>Currently, Serving Fortune 500 &amp; Forbes listed Clients</p>
              <ul className="space-y-2.5">
                {outreachPrimary.map((point) => (
                  <BulletText key={point}>{point}</BulletText>
                ))}
              </ul>

              <p className={`${bodyClassName} pt-2`}>Extended Presence across various industry verticals</p>
              <PunctuatedBullets items={outreachIndustries} />
            </div>
          </div>
          </FadeInView>

          <FadeInView delay={0.16}>
            <ImageCard
              src={outreachImage}
              alt="Team collaboration in modern office"
              className="h-auto w-full md:h-[537px] md:w-[398px]"
              imageClassName="page-art-float md:object-[50%_11%]"
            />
          </FadeInView>
        </section>

        <section className="mt-[120px] grid items-start gap-10 md:grid-cols-[399px_minmax(0,1fr)] md:gap-[80px]">
          <FadeInView delay={0.08}>
            <ImageCard
              src={strengthImage}
              alt="Confident candidate group in office hallway"
              className="order-2 h-auto w-full md:order-1 md:h-[553px] md:w-[399px]"
              imageClassName="page-art-float-delay scale-x-[-1]"
            />
          </FadeInView>

          <FadeInView className="order-1 md:order-2" delay={0.14}>
          <div className="order-1 md:order-2">
            <h2 className={headingClassName}>Our Strength</h2>
            <p className={`${bodyClassName} mt-7 max-w-[715px]`}>
              Dedicated Engagement Managers followed with specific Recruiting Managers with their respective teams
              depending on client business needs.
            </p>

            <dl className="mt-8 grid grid-cols-1 gap-y-4 text-[16px] leading-[1.35] text-[#1d223f] md:text-[24px]">
              <div className="grid grid-cols-1 gap-y-1 md:grid-cols-[170px_minmax(0,1fr)] md:gap-x-4">
                <dt>Team Size:</dt>
                <dd>30+ People PAN India</dd>
              </div>
              <div className="grid grid-cols-1 gap-y-1 md:grid-cols-[170px_minmax(0,1fr)] md:gap-x-4">
                <dt>Skill Set:</dt>
                <dd>Technical, Non-Technical, Research Analyst &amp; Data Analytics</dd>
              </div>
              <div className="grid grid-cols-1 gap-y-1 md:grid-cols-[170px_minmax(0,1fr)] md:gap-x-4">
                <dt>Experience:</dt>
                <dd>
                  Permanent Staffing, Executive Search, Contract Staffing, Talent Mapping, Recruitment Process
                  Outsourcing (RPO), Industry Mapping &amp; Market Intelligence
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-y-1 md:grid-cols-[170px_minmax(0,1fr)] md:gap-x-4">
                <dt>Client Handled:</dt>
                <dd>IT/Non IT, EPS, BFSI Aerospace</dd>
              </div>
              <div className="grid grid-cols-1 gap-y-1 md:grid-cols-[170px_minmax(0,1fr)] md:gap-x-4">
                <dt>Turn Around Time:</dt>
                <dd>0% Time Frame Delivery</dd>
              </div>
              <div className="grid grid-cols-1 gap-y-1 md:grid-cols-[170px_minmax(0,1fr)] md:gap-x-4">
                <dt>International Coverage:</dt>
                <dd>Joint Ventures across 12 Countries</dd>
              </div>
            </dl>
          </div>
          </FadeInView>
        </section>

        <section className="mt-[120px] grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_400px] md:gap-[80px]">
          <FadeInView delay={0.08}>
          <div>
            <h2 className={headingClassName}>Why Us?</h2>

            <div className="mt-7">
              <p className={bodyClassName}>To maximize your ROI with 0% TAT</p>
              <PunctuatedBullets items={roiPoints} />
            </div>

            <div className="mt-8">
              <p className={bodyClassName}>For High Quality Services</p>
              <ul className="mt-3 space-y-2.5">
                {qualityPoints.map((point) => (
                  <BulletText key={point}>{point}</BulletText>
                ))}
              </ul>
              <p className={`${bodyClassName} mt-4 max-w-[695px]`}>
                Effective information and Automation System: Zero Level People Dependency
              </p>
            </div>
          </div>
          </FadeInView>

          <FadeInView delay={0.16}>
            <ImageCard
              src={whyImage}
              alt="Professional woman portrait with crossed arms"
              className="h-auto w-full md:h-[600px] md:w-[400px]"
              imageClassName="page-art-float max-md:scale-100 max-md:object-center md:scale-[1.5] md:object-[100%_0%]"
            />
          </FadeInView>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};
