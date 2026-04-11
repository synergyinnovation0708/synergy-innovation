export const serviceKnowledgeItems = [
  {
    keywords: [
      "recruitment",
      "rpo",
      "staffing",
      "executive search",
      "talent hiring",
      "contract hiring",
      "cxo",
      "bfsi",
    ],
    sourceDocument: "SI Recruitment Profile (1).pdf",
    summary:
      "Synergy's recruitment practice covers executive search, global recruitment, contractual staffing, recruitment process outsourcing, and talent hiring services. The profile highlights BFSI as a core strength while also covering IT, engineering services, pharmaceuticals, manufacturing, telecom, and consumer sectors. It emphasizes PAN-India delivery, regional coverage, leadership and mid-senior hiring, cultural-fit screening, ready talent pipelines, dedicated account teams, and data-driven governance.",
    title: "Recruitment & Talent Solutions",
  },
  {
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
    ],
    sourceDocument: "SI IT Services Profile (1).pdf",
    summary:
      "Synergy's IT services profile covers web and app development, native mobile solutions, enterprise cloud and API development, custom web platforms, ERP development, POS development, ATS development, HRM and employee lifecycle platforms, AI automation tools, custom enterprise software, generative AI use cases, chatbots and assistants, document automation, internal productivity tools, predictive analytics, and digital marketing support.",
    title: "AI-Driven IT Services",
  },
  {
    keywords: [
      "branding",
      "brand",
      "identity",
      "logo",
      "guidelines",
      "landing page",
      "social media ads",
      "website design",
    ],
    sourceDocument: "SI Branding Profile (1).pdf",
    summary:
      "Synergy's branding services focus on building trust, recognition, and consistency. The branding profile lists logo design and visual identity, brand guidelines, website design, visual identity for digital platforms, social media ads, and landing pages. The documented process is discover, define, design, and deliver, with an emphasis on strategy-led design and long-term brand clarity.",
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
    keywords: [
      "school bus",
      "student security",
      "tracking",
      "transport",
      "school safety",
      "bus platform",
    ],
    sourceDocument: "AI-Powered School Bus Tracking & Student Security Platform.pdf",
    summary:
      "The school transport document introduces an AI-powered school bus tracking and student security platform. From the title and visible positioning lines, the product is framed around smart, secure, transparent, and automated student transport operations.",
    title: "AI School Bus Tracking & Student Security Platform",
  },
] as const;

export const serviceKnowledgeTitles = serviceKnowledgeItems.map(
  (item) => item.title,
);

export const buildServiceKnowledgePrompt = () =>
  serviceKnowledgeItems
    .map(
      (item) =>
        `- ${item.title} [source: ${item.sourceDocument}]\n  Summary: ${item.summary}\n  Keywords: ${item.keywords.join(", ")}`,
    )
    .join("\n");
