type ServiceKnowledgeFaqEntry = {
  answer: string;
  question: string;
};

type ServiceKnowledgeFaqSection = {
  entries: readonly ServiceKnowledgeFaqEntry[];
  title: string;
};

type ServiceKnowledgeItem = {
  faqSections?: readonly ServiceKnowledgeFaqSection[];
  keywords: readonly string[];
  sourceDocument: string;
  summary: string;
  title: string;
};

export const serviceKnowledgeItems: readonly ServiceKnowledgeItem[] = [
  {
    faqSections: [
      {
        entries: [
          {
            question: "What job opportunities are available right now?",
            answer:
              "We have multiple openings across IT and Non-IT domains. You can explore current roles on our careers section or share your profile, and I'll recommend suitable opportunities for you.",
          },
          {
            question: "Do you have openings in my preferred location?",
            answer:
              "Yes, we offer roles across multiple locations. Please share your preferred location, and I'll check the most relevant openings for you.",
          },
          {
            question: "Can you suggest jobs based on my experience?",
            answer:
              "Absolutely! Just tell me your experience, skills, and preferred role, and I'll match you with the most relevant opportunities.",
          },
          {
            question: "Are there any urgent or high-priority openings?",
            answer:
              "Yes, we regularly work on urgent requirements. Share your profile, and I'll connect you with the fastest-moving opportunities.",
          },
        ],
        title: "Job Seeker - Job Discovery",
      },
      {
        entries: [
          {
            question: "Do you offer IT or Non-IT jobs?",
            answer:
              "We offer both IT and Non-IT opportunities across various industries including BFSI, tech, sales, and operations.",
          },
          {
            question: "Are there work-from-home or remote opportunities?",
            answer:
              "Yes, we do have remote and hybrid roles depending on client requirements. Let me know your preference.",
          },
          {
            question:
              "Do you have roles for freshers / experienced professionals?",
            answer:
              "Yes, we have opportunities for both freshers and experienced candidates across different domains.",
          },
          {
            question: "What kind of companies do you hire for?",
            answer:
              "We work with startups, mid-sized companies, and large enterprises across multiple industries.",
          },
        ],
        title: "Job Seeker - Job Type & Fit",
      },
      {
        entries: [
          {
            question: "How can I apply for a job?",
            answer:
              "You can apply directly through our website or simply share your resume here, and our team will reach out to you.",
          },
          {
            question: "Can I upload my resume here?",
            answer:
              "Yes, please upload your resume and our recruitment team will review it and connect with you for suitable roles.",
          },
          {
            question: "What happens after I submit my application?",
            answer:
              "Once you apply, our team reviews your profile and connects you with relevant opportunities and next steps.",
          },
          {
            question: "How long does the hiring process usually take?",
            answer:
              "It depends on the role and company, but typically the process takes between a few days to a couple of weeks.",
          },
        ],
        title: "Job Seeker - Application Process",
      },
      {
        entries: [
          {
            question: "Can you help improve my resume?",
            answer:
              "Yes, we can guide you on improving your resume to align with industry standards and job requirements.",
          },
          {
            question: "What skills are currently in demand?",
            answer:
              "Skills in AI, data analytics, software development, sales, and customer management are currently in high demand.",
          },
          {
            question:
              "How can I increase my chances of getting shortlisted?",
            answer:
              "Keep your resume updated, highlight relevant skills, and apply for roles that closely match your experience.",
          },
          {
            question: "Do you provide interview preparation support?",
            answer:
              "Yes, we guide candidates on interview preparation including common questions and best practices.",
          },
        ],
        title: "Job Seeker - Career Support",
      },
      {
        entries: [
          {
            question:
              "Didn't find the right job? Want us to notify you?",
            answer:
              "No worries! Share your details, and we'll notify you as soon as a matching opportunity comes up.",
          },
          {
            question: "Looking for a quick job switch?",
            answer:
              "Great! Share your profile and preferences - we'll help you find the right opportunity faster.",
          },
        ],
        title: "Job Seeker - Engagement Hooks",
      },
      {
        entries: [
          {
            question:
              "I want to hire candidates - how can you help?",
            answer:
              "We provide end-to-end recruitment solutions. Share your hiring requirement, and we'll take care of sourcing, screening, and closing positions.",
          },
          {
            question: "Can you help me find candidates quickly?",
            answer:
              "Yes, we specialize in fast-track hiring using our strong candidate network and streamlined processes.",
          },
          {
            question: "Do you support bulk or urgent hiring?",
            answer:
              "Absolutely! We handle bulk and urgent hiring requirements efficiently across industries.",
          },
        ],
        title: "Employer / Hiring - Hiring Intent",
      },
      {
        entries: [
          {
            question: "What hiring services do you offer?",
            answer:
              "We offer permanent hiring, contract staffing, RPO, and leadership hiring solutions.",
          },
          {
            question:
              "Do you provide contract staffing or permanent hiring?",
            answer:
              "Yes, we offer both contract and permanent hiring based on your business needs.",
          },
          {
            question:
              "Can you help with mid-level and leadership hiring?",
            answer:
              "Yes, we specialize in mid-level to senior and leadership hiring across domains.",
          },
          {
            question: "Do you offer RPO?",
            answer:
              "Yes, our Recruitment Process Outsourcing solutions help you manage hiring efficiently at scale.",
          },
        ],
        title: "Employer / Hiring - Hiring Solutions",
      },
      {
        entries: [
          {
            question: "How do you shortlist candidates?",
            answer:
              "We use a combination of screening, skill evaluation, and experience matching to shortlist the best candidates.",
          },
          {
            question: "What is your screening process?",
            answer:
              "Our process includes resume screening, initial interviews, and skill assessments before presenting candidates.",
          },
          {
            question: "How fast can you close open positions?",
            answer:
              "Depending on the role, we can close positions within a few days to a few weeks.",
          },
          {
            question: "How do you ensure candidate quality?",
            answer:
              "We follow a strict screening and validation process to ensure only high-quality candidates are shared.",
          },
        ],
        title: "Employer / Hiring - Process Understanding",
      },
      {
        entries: [
          {
            question: "What are your pricing models?",
            answer:
              "Our pricing is flexible and depends on the hiring model and requirement. We can customize it as per your needs.",
          },
          {
            question: "Do you offer customized hiring solutions?",
            answer:
              "Yes, we tailor our hiring solutions based on your business goals and hiring scale.",
          },
          {
            question:
              "Can I scale hiring up or down as needed?",
            answer:
              "Absolutely! Our solutions are designed to be flexible and scalable.",
          },
        ],
        title: "Employer / Hiring - Commercials & Customization",
      },
      {
        entries: [
          {
            question: "Need to close positions faster?",
            answer:
              "Let's connect! Share your requirement, and we'll help you hire faster and smarter.",
          },
          {
            question: "Tell me your hiring need",
            answer:
              "Please share role, experience level, and location - I'll suggest the best hiring solution for you.",
          },
        ],
        title: "Employer / Hiring - Conversion Hooks",
      },
    ],
    keywords: [
      "recruitment",
      "rpo",
      "staffing",
      "executive search",
      "talent hiring",
      "contract hiring",
      "cxo",
      "bfsi",
      "job",
      "jobs",
      "career",
      "careers",
      "opening",
      "openings",
      "resume",
      "apply",
      "application",
      "fresher",
      "experienced",
      "remote job",
      "hybrid job",
      "urgent hiring",
      "bulk hiring",
      "permanent hiring",
      "leadership hiring",
      "shortlist",
      "interview prep",
      "employer hiring",
      "candidate screening",
    ],
    sourceDocument: "SI Recruitment Profile (1).pdf",
    summary:
      "Synergy's recruitment practice covers executive search, global recruitment, contractual staffing, recruitment process outsourcing, and talent hiring services. The profile highlights BFSI as a core strength while also covering IT, engineering services, pharmaceuticals, manufacturing, telecom, and consumer sectors. It emphasizes PAN-India delivery, regional coverage, leadership and mid-senior hiring, cultural-fit screening, ready talent pipelines, dedicated account teams, and data-driven governance. Approved chatbot answers also cover candidate job discovery, applications, resume sharing, remote roles, urgent openings, employer hiring support, pricing flexibility, and high-volume recruitment needs.",
    title: "Recruitment & Talent Solutions",
  },
  {
    faqSections: [
      {
        entries: [
          {
            question: "What IT services do you offer?",
            answer:
              "We provide custom software development, web and mobile app development, and technology consulting.",
          },
          {
            question: "Do you build custom software solutions?",
            answer:
              "Yes, we design and develop customized solutions tailored to your business needs.",
          },
          {
            question: "Can you help with web or app development?",
            answer:
              "Absolutely! We build scalable websites and mobile applications.",
          },
          {
            question: "What technologies do you specialize in?",
            answer:
              "We work across modern tech stacks including web, mobile, cloud, and AI technologies.",
          },
          {
            question:
              "Do you work with startups or enterprises?",
            answer:
              "We work with both startups and enterprises, offering scalable solutions for each.",
          },
          {
            question:
              "Can you handle end-to-end product development?",
            answer:
              "Yes, from idea to deployment and support - we handle the complete lifecycle.",
          },
          {
            question: "What is your development process?",
            answer:
              "We follow an agile approach with regular updates and client collaboration.",
          },
          {
            question:
              "How long does it take to complete a project?",
            answer:
              "Timelines depend on project complexity, but we ensure timely delivery.",
          },
          {
            question: "Do you provide post-launch support?",
            answer:
              "Yes, we offer ongoing maintenance and support.",
          },
          {
            question:
              "How can your IT solutions improve my business?",
            answer:
              "Our solutions help improve efficiency, scalability, and digital presence.",
          },
          {
            question:
              "Can you help scale my digital infrastructure?",
            answer:
              "Yes, we design systems that grow with your business.",
          },
        ],
        title: "IT Services - Approved FAQs",
      },
    ],
    keywords: [
      "it services",
      "software",
      "web",
      "mobile",
      "erp",
      "pos",
      "ats",
      "hrms",
      "genai",
      "chatbot",
      "assistant",
      "predictive analytics",
      "custom software",
      "technology consulting",
      "web development",
      "app development",
      "product development",
      "post-launch support",
      "digital infrastructure",
      "agile delivery",
    ],
    sourceDocument: "SI IT Services Profile (1).pdf",
    summary:
      "Synergy's IT services profile covers web and app development, native mobile solutions, enterprise cloud and API development, custom web platforms, ERP development, POS development, ATS development, HRM and employee lifecycle platforms, AI automation tools, custom enterprise software, generative AI use cases, chatbots and assistants, document automation, internal productivity tools, predictive analytics, and digital marketing support. Approved chatbot answers also cover custom software, end-to-end product delivery, agile development, startup and enterprise support, business scalability, and post-launch maintenance.",
    title: "AI-Driven IT Services",
  },
  {
    faqSections: [
      {
        entries: [
          {
            question:
              "Do you provide branding and marketing services?",
            answer:
              "Yes, we offer complete branding and digital marketing solutions.",
          },
          {
            question:
              "Can you help build my company's brand identity?",
            answer:
              "Absolutely! We help define and design your brand identity from scratch.",
          },
          {
            question: "Do you offer digital marketing solutions?",
            answer:
              "Yes, including social media, content marketing, and performance campaigns.",
          },
          {
            question:
              "Can you design logos, websites, and brand assets?",
            answer:
              "Yes, we create all essential brand assets tailored to your business.",
          },
          {
            question:
              "Do you manage social media and campaigns?",
            answer:
              "Yes, we handle end-to-end campaign management.",
          },
          {
            question: "Can you help with employer branding?",
            answer:
              "Yes, we help position your company as a great place to work.",
          },
          {
            question: "How do you approach brand strategy?",
            answer:
              "We focus on market positioning, audience targeting, and consistent messaging.",
          },
          {
            question:
              "Can you help generate leads through branding?",
            answer:
              "Yes, our strategies are designed to drive engagement and conversions.",
          },
          {
            question: "How do you measure branding success?",
            answer:
              "Through metrics like reach, engagement, leads, and ROI.",
          },
        ],
        title: "Branding - Approved FAQs",
      },
    ],
    keywords: [
      "branding",
      "brand",
      "identity",
      "logo",
      "guidelines",
      "landing page",
      "social media ads",
      "website design",
      "digital marketing",
      "campaign management",
      "employer branding",
      "brand strategy",
      "lead generation",
      "roi",
    ],
    sourceDocument: "SI Branding Profile (1).pdf",
    summary:
      "Synergy's branding services focus on building trust, recognition, and consistency. The branding profile lists logo design and visual identity, brand guidelines, website design, visual identity for digital platforms, social media ads, and landing pages. The documented process is discover, define, design, and deliver, with an emphasis on strategy-led design and long-term brand clarity. Approved chatbot answers also cover digital marketing, employer branding, campaign execution, lead generation, and ROI-oriented brand strategy.",
    title: "Branding & Visual Identity",
  },
  {
    keywords: [
      "ip camera",
      "attendance",
      "face recognition",
      "payroll",
      "visitor tracking",
      "blocked employee",
      "workforce automation",
      "camera",
    ],
    sourceDocument: "SI AI IP Camera Product Description (1).pdf",
    summary:
      "The AI IP Camera product is positioned as a workforce automation and attendance solution that uses existing IP camera infrastructure. The brochure describes face-recognition based attendance marking, real-time in/out logs, payroll automation, blocked employee alerts, visitor tracking, active premises detection, anti-spoofing and liveness detection, and local or cloud deployment options. The value proposition centers on zero new hardware, less manual HR dependency, and better transparency.",
    title: "AI IP Camera Attendance System",
  },
  {
    faqSections: [
      {
        entries: [
          {
            question: "What AI solutions do you offer?",
            answer:
              "We offer AI-powered recruitment tools, chatbots, and business automation solutions.",
          },
          {
            question: "Do you provide AI-based hiring tools?",
            answer:
              "Yes, we use AI to streamline candidate screening and hiring processes.",
          },
          {
            question: "Can you build a chatbot for my business?",
            answer:
              "Absolutely! We can design and deploy customized chatbots based on your needs.",
          },
          {
            question:
              "How can AI improve my hiring process?",
            answer:
              "AI can automate screening, reduce hiring time, and improve candidate matching.",
          },
          {
            question:
              "Can AI automate my business workflows?",
            answer:
              "Yes, AI can automate repetitive tasks and improve operational efficiency.",
          },
          {
            question:
              "Do you offer AI solutions for customer support?",
            answer:
              "Yes, we build AI chatbots and support automation tools.",
          },
          {
            question:
              "Do you have ready AI products or custom solutions?",
            answer:
              "We offer both ready-to-use products and fully customized solutions.",
          },
          {
            question:
              "Can you integrate AI into my existing system?",
            answer:
              "Yes, we can integrate AI into your current tools and workflows.",
          },
          {
            question:
              "What industries do your AI solutions support?",
            answer:
              "Our solutions are adaptable across multiple industries.",
          },
          {
            question:
              "How long does it take to implement AI solutions?",
            answer:
              "It depends on complexity, but typically ranges from a few weeks to a couple of months.",
          },
          {
            question:
              "What kind of ROI can I expect from AI?",
            answer:
              "AI helps reduce costs, improve efficiency, and increase productivity.",
          },
          {
            question: "Is AI implementation expensive?",
            answer:
              "We offer scalable solutions to fit different budgets.",
          },
        ],
        title: "AI Products & Services - Approved FAQs",
      },
    ],
    keywords: [
      "ai products",
      "ai services",
      "ai hiring",
      "business automation",
      "chatbot",
      "customer support automation",
      "workflow automation",
      "ai integration",
      "custom ai",
      "ready ai products",
      "ai roi",
      "ai implementation",
      "automation solutions",
    ],
    sourceDocument: "SI IT Services Profile (1).pdf",
    summary:
      "Synergy's AI product and automation positioning includes AI-powered recruitment tools, business automation, chatbots, workflow automation, customer-support automation, custom AI integrations, and scalable implementation models. Approved chatbot answers also cover AI ROI, implementation timelines, industry adaptability, ready-to-use products, and budget-friendly customization.",
    title: "AI Products & Automation Solutions",
  },
  {
    keywords: [
      "school bus",
      "student security",
      "tracking",
      "transport",
      "school safety",
      "bus platform",
    ],
    sourceDocument:
      "AI-Powered School Bus Tracking & Student Security Platform.pdf",
    summary:
      "The school transport document introduces an AI-powered school bus tracking and student security platform. From the title and visible positioning lines, the product is framed around smart, secure, transparent, and automated student transport operations.",
    title: "AI School Bus Tracking & Student Security Platform",
  },
];

const formatFaqSections = (sections: readonly ServiceKnowledgeFaqSection[]) =>
  sections
    .map(
      (section) =>
        `  ${section.title}:\n${section.entries
          .map(
            (entry) =>
              `    Q: ${entry.question}\n    A: ${entry.answer}`,
          )
          .join("\n")}`,
    )
    .join("\n");

export const serviceKnowledgeTitles = serviceKnowledgeItems.map(
  (item) => item.title,
);

export const buildServiceKnowledgePrompt = () =>
  serviceKnowledgeItems
    .map((item) => {
      const approvedFaqs =
        item.faqSections && item.faqSections.length > 0
          ? `\n  Approved FAQs:\n${formatFaqSections(item.faqSections)}`
          : "";

      return `- ${item.title} [source: ${item.sourceDocument}]\n  Summary: ${item.summary}\n  Keywords: ${item.keywords.join(", ")}${approvedFaqs}`;
    })
    .join("\n");
