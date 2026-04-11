import { Card, CardContent } from "../../../../components/ui/card";

const talentSolutionsData = [
  {
    title: "Executive Search & Leadership Hiring",
    description:
      "Identifying, evaluating, and placing leaders who drive growth and transformation.",
    icon: "/icons/office-chair.svg",
    alt: "Executive search",
  },
  {
    title: "Contract, C2H Staffing & Hiring Solutions",
    description:
      "Flexible workforce models that enable rapid scaling and cost efficiency.",
    icon: "/icons/contract.svg",
    alt: "Contract staffing",
  },
  {
    title: "Permanent Recruitment & RPO Hiring Services",
    description:
      "Customized recruitment models built for enterprise-scale delivery.",
    icon: "/icons/hr.svg",
    alt: "Permanent recruitment",
  },
  {
    title: "Global Recruitment & Talent Solutions",
    description:
      "Scalable and compliant recruitment solutions for global workforce expansion",
    icon: "/icons/hr.svg",
    alt: "Global Recruitment & Talent Solutions",
  },
];

const itServicesData = [
  {
    title: "Custom Software Development",
    description:
      "End-to-end product engineering across web, mobile, and cloud ecosystems.",
    icon: "/icons/software-development.svg",
    alt: "Custom software",
  },
  {
    title: "Cloud & Azure Services",
    description:
      "Building secure, scalable cloud environments for global enterprises.",
    icon: "/icons/api-cloud.svg",
    alt: "Cloud and azure",
  },
  {
    title: "AI & Analytics",
    description:
      "Empowering business decisions through data-driven intelligence.",
    icon: "/icons/artificial-intelligence.svg",
    alt: "AI analytics",
  },
  {
    title: "ERP & Digital Transformation",
    description:
      "Streamlining operations with advanced ERP and workflow automation.",
    icon: "/icons/laptop.svg",
    alt: "ERP digital transformation",
  },
  {
    title: "Cybersecurity & Managed Services",
    description:
      "Safeguarding enterprise data with cutting-edge security solutions.",
    icon: "/icons/shield-check.svg",
    alt: "Cybersecurity",
  },
];

export const ExpertiseOverviewSection = () => {
  return (
    <section id="our-expertise" className="relative scroll-mt-[120px] w-full bg-white">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <header className="mb-16 flex flex-col items-center">
          <h2 className="mb-4 text-center text-[34px] leading-[1.2] font-bold text-[#1d223f] md:text-[46px]">
            Our Expertise
          </h2>
          <div className="h-1.5 w-[200px] rounded-[3px] bg-[#00adef]" />
        </header>

        <div className="mb-16">
          <h3 className="mb-8 text-[30px] leading-[1.2] font-semibold text-[#1d223f] md:text-[36px]">
            Executive Search &amp; Talent Solutions
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {talentSolutionsData.map((item) => (
              <Card
                key={item.title}
                className="rounded-[16px] border-0 bg-white shadow-[0_2px_36px_rgba(0,173,239,0.08)]"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h4 className="max-w-[271px] text-[20px] leading-[1.2] font-semibold text-[#1d223f]">
                      {item.title}
                    </h4>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.icon}
                      alt={item.alt}
                      className="h-12 w-12 shrink-0 object-contain"
                    />
                  </div>
                  <p className="mb-3 max-w-[245px] text-[16px] leading-[1.35] text-[#1d223f]/80">
                    {item.description}
                  </p>
                  {/* <a
                    href="#"
                    className="inline-flex items-center gap-1 text-[16px] leading-[1.2] font-medium text-[#00adef] hover:text-[#008fcc]"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </a> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-8 text-[30px] leading-[1.2] font-semibold text-[#1d223f] md:text-[36px]">
            IT Products &amp; Services
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {itServicesData.map((item) => (
              <Card
                key={item.title}
                className="rounded-[16px] border-0 bg-white shadow-[0_2px_36px_rgba(0,173,239,0.08)]"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h4 className="max-w-[222px] text-[20px] leading-[1.2] font-semibold text-[#1d223f]">
                      {item.title}
                    </h4>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.icon}
                      alt={item.alt}
                      className="h-12 w-12 shrink-0 object-contain"
                    />
                  </div>
                  <p className="mb-3 max-w-[300px] text-[16px] leading-[1.35] text-[#1d223f]/80">
                    {item.description}
                  </p>
                  {/* <a
                    href="#"
                    className="inline-flex items-center gap-1 text-[16px] leading-[1.2] font-medium text-[#00adef] hover:text-[#008fcc]"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </a> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

