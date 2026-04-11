type ServiceItem = {
  title: string;
  description: string;
  descriptionClassName?: string;
};

const developmentServices: ServiceItem[] = [
  {
    title: "Full Stack Development",
    description: "MERN, MEAN, Java, .NET, PHP",
  },
  {
    title: "Frontend Development",
    description: "React.js, Angular, Vue.js",
  },
  {
    title: "Backend Development",
    description: "Node.js, Java, Python, .NET",
  },
  {
    title: "Mobile App Development",
    description: "Android, iOS, React Native, Flutter",
  },
  {
    title: "UI/UX Design & Prototyping",
    description: "Figma, Adobe XD, User Testing",
  },
  {
    title: "Cloud & DevOps Engineering",
    description: "AWS, Azure, GCP, Docker, Kubernetes",
  },
  {
    title: "ERP & CRM Development",
    description: "SAP, Odoo, Salesforce, Custom CRM",
  },
  {
    title: "Custom Software Development",
    description: "Business Automation, SaaS Solutions",
  },
  {
    title: "QA & Testing Services",
    description: "Manual, Automation, Performance, Security Testing",
    descriptionClassName: "xl:whitespace-nowrap xl:text-[15px]",
  },
];

const aiDataServices: ServiceItem[] = [
  {
    title: "AI Integration & Automation",
    description: "Workflow automation, AI assistants",
  },
  {
    title: "Machine Learning Solutions",
    description: "Predictive models, Recommendation engines",
  },
  {
    title: "Natural Language Processing (NLP)",
    description: "Chatbots, Voicebots, Text analytics",
  },
  {
    title: "Computer Vision Solutions",
    description: "Image recognition, Object detection, OCR",
  },
  {
    title: "Generative AI Development",
    description: "Custom LLMs, AI-powered content generation",
  },
  {
    title: "Data Science & Analytics",
    description: "ETL pipelines, Predictive analytics, BI dashboards",
    descriptionClassName: "xl:whitespace-nowrap xl:text-[15px]",
  },
  {
    title: "Robotic Process Automation (RPA)",
    description: "UiPath, Automation Anywhere, Blue Prism",
  },
  {
    title: "AI for CRM/ERP",
    description: "AI-driven insights, Customer behavior analysis",
  },
];

const digitalMarketingServices: ServiceItem[] = [
  {
    title: "Search Engine Optimization",
    description: "SEO",
  },
  {
    title: "Search Engine Marketing",
    description: "SEM",
  },
  {
    title: "Pay-Per-Click",
    description: "PPC Ads",
  },
  {
    title: "Meta Ads",
    description: "Facebook and Instagram campaigns",
  },
  {
    title: "LinkedIn Ads",
    description: "B2B lead generation campaigns",
  },
  {
    title: "Google Ads",
    description: "Search, display, and remarketing campaigns",
  },
  {
    title: "YouTube Ads",
    description: "Video reach and conversion campaigns",
  },
];

const serviceGroups: Array<{
  heading: string;
  items: ServiceItem[];
}> = [
  {
    heading: "Development Services",
    items: developmentServices,
  },
  {
    heading: "AI & Data Services",
    items: aiDataServices,
  },
  {
    heading: "Digital Marketing Services",
    items: digitalMarketingServices,
  },
];

const ServiceFeature = ({
  title,
  description,
  descriptionClassName,
}: {
  title: string;
  description?: string;
  descriptionClassName?: string;
}) => {
  return (
    <article className="border-l-[4px] border-[#00adef] pl-[12px] md:pl-[14px]">
      <h4 className="text-[18px] leading-[1.2] font-semibold text-[#1d223f] md:text-[20px]">
        {title}
      </h4>
      {description ? (
        <p
          className={`mt-[8px] text-[15px] leading-[1.35] text-[#1d223f]/85 md:text-[16px] ${descriptionClassName ?? ""}`}
        >
          {description}
        </p>
      ) : null}
    </article>
  );
};

export const ContractToHireServicesSection = () => {
  return (
    <section
      id="contract-to-hire"
      className="relative scroll-mt-[120px] w-full bg-white py-16 md:py-[88px]"
    >
      <div className="mx-auto w-full max-w-[1240px] px-4 md:px-0">
        <div className="mb-[54px] flex flex-col items-center">
          <h2 className="text-center text-[34px] leading-[1.2] font-bold text-[#1d223f] md:text-[52px]">
            Contract to Hire
          </h2>
          <div className="mt-[16px] h-[6px] w-[200px] rounded-[3px] bg-[#00adef]" />
        </div>

        <div className="relative mx-auto w-full rounded-[20px] border border-[#edf2f8] bg-white px-[22px] py-[28px] shadow-[0_20px_60px_rgba(0,173,239,0.10)] md:px-[40px] md:py-[44px]">
          <div className="absolute left-1/2 top-0 h-[28px] w-[28px] -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t border-[#edf2f8] bg-white" />

          <div className="space-y-[34px] md:space-y-[44px]">
            {serviceGroups.map((group, index) => (
              <div
                key={group.heading}
                className={index > 0 ? "border-t border-[#e9eef5] pt-[34px] md:pt-[42px]" : ""}
              >
                <h3 className="text-[18px] leading-[1.2] font-bold text-[#1d223f] uppercase md:text-[22px]">
                  {group.heading}
                </h3>

                <div className="mt-[28px] grid grid-cols-1 gap-x-[26px] gap-y-[24px] md:grid-cols-2 xl:grid-cols-3 xl:gap-y-[30px]">
                  {group.items.map((service) => (
                    <ServiceFeature
                      key={service.title}
                      title={service.title}
                      description={service.description}
                      descriptionClassName={service.descriptionClassName}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
