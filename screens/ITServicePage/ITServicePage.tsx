import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Code2,
  Cpu,
  Globe,
  Mail,
  Menu,
  MapPin,
  MessageSquareCode,
  Phone,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Workflow,
} from "lucide-react";
import type { ReactNode } from "react";
import { ITServicesInquiryTrigger } from "./ITServicesTopCta";

type ServiceCard = {
  bullets: string[];
  description: string;
  icon: ReactNode;
  title: string;
};

type ProductCard = {
  badge: string;
  description: string;
  icon: ReactNode;
  title: string;
};

type ProjectCard = {
  category: string;
  description?: string;
  descriptionClassName?: string;
  image: string;
  imageClassName?: string;
  location: string;
  titleClassName?: string;
  title: string;
};

type TestimonialCard = {
  attribution: string;
  body: string;
  company: string;
};

const navItems = [
  { href: "#services", label: "IT Services" },
  { href: "#products", label: "AI Products" },
  { href: "#projects", label: "Projects" },
  { href: "#process", label: "Process" },
  { href: "#testimonials", label: "Why Us" },
];

const heroMetrics = [
  { label: "Years Since 2011", value: "15+" },
  { label: "Faster Delivery", value: "3x" },
  { label: "Manual Work Saved", value: "80%" },
  { label: "Industries Served", value: "15+" },
];

const services: ServiceCard[] = [
  {
    title: "Website Development",
    description:
      "Custom corporate websites and portals engineered for speed, search visibility, security, and conversion.",
    bullets: ["Custom build", "SEO ready", "High performance"],
    icon: <Globe className="h-5 w-5" />,
  },
  {
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile apps built to feel polished, reliable, and enterprise ready from day one.",
    bullets: ["iOS + Android", "API integrated", "Scalable release flow"],
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    title: "Custom Software Development",
    description:
      "Purpose-built internal platforms, dashboards, and business tools aligned to your exact workflows and growth model.",
    bullets: ["Bespoke logic", "Secure architecture", "Long-term support"],
    icon: <Code2 className="h-5 w-5" />,
  },
  {
    title: "AI Integration & Automation",
    description:
      "Practical automation systems that reduce manual effort, unify data, and make operations respond in real time.",
    bullets: ["Agent workflows", "Chatbots", "Operational automation"],
    icon: <Bot className="h-5 w-5" />,
  },
  {
    title: "UI/UX Design",
    description:
      "Clarity-first product design with research, flows, wireframes, and interface systems that support adoption at scale.",
    bullets: ["User journeys", "Design systems", "Prototype validation"],
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "ERP & CRM Development",
    description:
      "Connected operations platforms that centralize sales, finance, inventory, attendance, and reporting in one place.",
    bullets: ["ERP modules", "CRM logic", "Role-based access"],
    icon: <BriefcaseBusiness className="h-5 w-5" />,
  },
  {
    title: "SEO & Digital Marketing",
    description:
      "Data-driven visibility programs that connect technical SEO, high-intent content, and conversion-first landing flows.",
    bullets: ["SEO strategy", "Performance content", "Lead funnels"],
    icon: <Search className="h-5 w-5" />,
  },
  {
    title: "PPC & Growth Campaigns",
    description:
      "Paid acquisition and performance loops optimized around measurable ROI, better lead quality, and shorter sales cycles.",
    bullets: ["Paid media", "Tracking setup", "ROI optimization"],
    icon: <MessageSquareCode className="h-5 w-5" />,
  },
];

const products: ProductCard[] = [
  {
    title: "AI Attendance System",
    description:
      "Face-recognition attendance with live reporting, absentee alerts, and staff admin automation.",
    badge: "Automation product",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "WhatsApp Automation Engine",
    description:
      "Lead capture, qualification, reminders, and follow-up flows triggered directly inside business conversations.",
    badge: "Growth product",
    icon: <Workflow className="h-5 w-5" />,
  },
  {
    title: "AI Invoice & Billing Assistant",
    description:
      "Create, validate, and route invoices faster with approval paths, reminders, and finance visibility built in.",
    badge: "Finance workflow",
    icon: <Cpu className="h-5 w-5" />,
  },
  {
    title: "HRMS + Payroll Suite",
    description:
      "Attendance, leave, payroll, employee lifecycle, and reporting tools designed for distributed operations.",
    badge: "Operations system",
    icon: <BriefcaseBusiness className="h-5 w-5" />,
  },
  {
    title: "School Bus Tracking System",
    description:
      "Route intelligence, parent alerts, driver coordination, and student safety workflows in one dashboard.",
    badge: "Mobility product",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "POS Solution",
    description:
      "Retail-ready point-of-sale software with inventory sync, payment flow support, and analytics for daily decisions.",
    badge: "Retail platform",
    icon: <Globe className="h-5 w-5" />,
  },
];

const projects: ProjectCard[] = [
  {
    title: "Synergy Innovation",
    category: "Website revamp",
    location: "India",
    image: "/images/sy.png",
    imageClassName: "object-cover",
    titleClassName: "text-[#00adef] text-[24px] font-bold leading-[1.2]",
  },
  {
    title: "Singh Agro Agencies",
    category: "B2B platform",
    location: "India",
    image: "/images/agro.png",
    titleClassName: "text-[#00adef] text-[23.904px] font-bold leading-[1.2]",
  },
  {
    title: "Night Owl Pizza",
    category: "Food ordering",
    location: "USA",
    image: "/images/owl.png",
    titleClassName: "text-[#00adef] text-[24px] font-bold leading-[1.2]",
  },
  {
    title: "The Switchwords",
    category: "Website Design",
    location: "India",
    image: "/images/switchword.png",
    titleClassName: "text-[#00adef] text-[24px] font-bold leading-[1.2]",
  },
  {
    title: "Hey Hungry",
    category: "App Design",
    location: "India",
    image: "/images/hey.png",
    imageClassName: "object-contain p-5",
    titleClassName: "text-[#00adef] text-[23.904px] font-bold leading-[1.2]",
  },
  {
    title: "Damanhur Temples",
    category: "Website Revamp",
    location: "India",
    image: "/images/damanhur.png",
    titleClassName: "text-[#00adef] text-[23.904px] font-bold leading-[1.2]",
  },
  {
    title: "Ficus e-Logic",
    category: "Website Revamp",
    location: "India",
    image: "/images/ficus.png",
    titleClassName: "text-[#00adef] text-[23.904px] font-bold leading-[1.2]",
  },
  {
    title: "Santosh University",
    category: "Website Revamp",
    location: "India",
    image: "/images/santosh.png",
    titleClassName: "text-[#00adef] text-[23.904px] font-bold leading-[1.2]",
  },
  {
    title: "PGA Metropolitan Section",
    category: "Website Design",
    location: "USA",
    image: "/images/pga.png",
    titleClassName: "text-[#00adef] text-[23.904px] font-bold leading-[1.2]",
  },
  {
    title: "ASN Advances Sports Nutrition",
    category: "Website Design",
    location: "Australia",
    image: "/images/asn.png",
    titleClassName: "text-[#00adef] text-[23.904px] font-bold leading-[1.2]",
  },
  {
    title: "Brownie Butter.",
    category: "Website Revamp",
    location: "UK",
    image: "/images/ggb.png",
    titleClassName: "text-[#00adef] text-[23.904px] font-bold leading-[1.2]",
  },
  {
    title: "Okanagan CBD",
    category: "Website Design",
    location: "Canada",
    image: "/images/cbd.png",
    titleClassName: "text-[#00adef] text-[23.904px] font-bold leading-[1.2]",
  },
  {
    title: "Thikedaar App & Website",
    category: "Website + App",
    description:
      "Construction platform generating 3D home models and enabling service booking.",
    location: "India",
    image: "/images/thikedar (2).png",
    titleClassName: "text-[#00adef] text-[27.287px] font-bold leading-[1.2]",
    descriptionClassName: "text-[15px] font-normal leading-[1.45] text-[#4d4d4d]",
  },
  {
    title: "Need To Assist App & Website",
    category: "Website + App",
    description:
      "Service platform (like UrbanClap) for laptop repair with online booking and tracking.",
    location: "India",
    image: "/images/web.png",
    titleClassName: "text-[#00adef] text-[27.287px] font-bold leading-[1.2]",
    descriptionClassName: "text-[15px] font-normal leading-[1.45] text-[#4d4d4d]",
  },
  {
    title: "Lisofy App",
    category: "Mobile App",
    description:
      "Logistics/warehouse app with features for listing, truck booking, manpower, and land services.",
    location: "India",
    image: "/images/lisofy.png",
    titleClassName: "text-[#00adef] text-[27.287px] font-bold leading-[1.2]",
    descriptionClassName: "text-[15px] font-normal leading-[1.45] text-[#4d4d4d]",
  },
  {
    title: "GVision AI Attendance",
    category: "AI Product",
    description:
      "AI-based system with IP cameras for automated attendance and activity tracking.",
    location: "India",
    image: "/images/b2b.png",
    titleClassName: "text-[#00adef] text-[27.287px] font-bold leading-[1.2]",
    descriptionClassName: "text-[15px] font-normal leading-[1.45] text-[#4d4d4d]",
  },
  {
    title: "eBuggs B2B Platform",
    category: "B2B Platform",
    description:
      "E-commerce solution for refurbished laptops and digital products.",
    location: "India",
    image: "/images/b2.png",
    titleClassName: "text-[#00adef] text-[27.287px] font-bold leading-[1.2]",
    descriptionClassName: "text-[15px] font-normal leading-[1.45] text-[#4d4d4d]",
  },
  {
    title: "3 Patti Gaming App",
    category: "Gaming App",
    description: "Ongoing maintenance and release management.",
    location: "India",
    image: "/images/3patti.png",
    titleClassName: "text-[#00adef] text-[27.287px] font-bold leading-[1.2]",
    descriptionClassName: "text-[15px] font-normal leading-[1.45] text-[#4d4d4d]",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Deep dive into your challenges, goals, and technical requirements. No assumptions, no templates.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Architecture, UI/UX wireframes, and technical blueprint. Approved by you before a single line of code.",
  },
  {
    number: "03",
    title: "Deploy",
    description:
      "Agile sprints, weekly demos, full transparency. 3x faster than industry average delivery timeline.",
  },
  {
    number: "04",
    title: "Scale",
    description:
      "Continuous optimisation, 24/7 support, and growth partnerships. We're here after launch — not just before.",
  },
];

const testimonials: TestimonialCard[] = [
  {
    body:
      "Synergy scaled our operations by 40% with a custom ERP. The team understood BFSI compliance requirements perfectly - delivered without a single delay.",
    attribution: "AVP, Kotak Mahindra Bank",
    company: "BFSI · Enterprise ERP",
  },
  {
    body:
      "The AI attendance system eliminated 3 hours of daily admin work. Our 800 students are marked automatically - parents get alerts before we even check.",
    attribution: "Director, Delhi NCR School",
    company: "Education · AI Attendance",
  },
  {
    body:
      "Went from chasing 50 leads manually every day to closing deals while we slept. The WhatsApp automation changed our entire sales operation in 2 weeks.",
    attribution: "Founder, E-commerce Brand",
    company: "Retail · AI Automation",
  },
];

const contactItems = [
  { label: "www.synergyinnovation.org", icon: Globe },
  { label: "bd@synergyinnovation.org", icon: Mail },
  { label: "+91 70173 86311", icon: Phone },
  { label: "G Noida · Noida · Delhi · Bangalore", icon: MapPin },
];

const trustMetrics = [
  { value: "< 24 hrs", label: "Response Time" },
  { value: "Free", label: "Discovery Call" },
  { value: "100%", label: "Custom-Coded" },
];

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#00b4ff] sm:text-[12px]">
      {children}
    </p>
  );
}

function PrimaryInquiryButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ITServicesInquiryTrigger
      className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#18aef5] px-7 py-3 text-[15px] font-bold text-white shadow-[0_14px_30px_rgba(24,174,245,0.2)] transition-transform duration-300 hover:-translate-y-0.5 ${className ?? ""}`}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4" />
    </ITServicesInquiryTrigger>
  );
}

function ServiceCard({ bullets, description, icon, title }: ServiceCard) {
  return (
    <article className="rounded-[18px] border border-[#dff0f7] bg-[#f9fdff] p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(20,34,56,0.08)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#e7f7ff] text-[#00b4ff]">
        {icon}
      </div>
      <h3 className="mt-5 text-[21px] font-extrabold leading-[1.15] text-[#142238]">{title}</h3>
      <p className="mt-3 text-[15px] leading-[1.65] text-[#4d4d4d]">{description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {bullets.map((bullet) => (
          <span
            key={bullet}
            className="rounded-full border border-[#cfe8f3] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#4d4d4d]"
          >
            {bullet}
          </span>
        ))}
      </div>
    </article>
  );
}

function ProductCard({ badge, description, icon, title }: ProductCard) {
  return (
    <article className="rounded-[18px] border border-[#dcf2f5] bg-white p-6 shadow-[0_18px_38px_rgba(20,34,56,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#eaf8ff] text-[#00b4ff]">
          {icon}
        </div>
        <span className="rounded-full bg-[#e9fff5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4ade80]">
          {badge}
        </span>
      </div>
      <h3 className="mt-5 text-[22px] font-extrabold leading-[1.15] text-[#142238]">{title}</h3>
      <p className="mt-3 text-[15px] leading-[1.65] text-[#4d4d4d]">{description}</p>
    </article>
  );
}

function ProjectCard({
  category,
  description,
  descriptionClassName,
  image,
  imageClassName,
  location,
  title,
  titleClassName,
}: ProjectCard) {
  return (
    <article className="overflow-hidden rounded-[18px] border border-[#ebf2f5] bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_46px_rgba(20,34,56,0.1)]">
      <div className="relative aspect-[1.18/1] overflow-hidden bg-[#eef8fc]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className={`${imageClassName ?? "object-cover object-top"} transition-transform duration-500 hover:scale-[1.03]`}
        />
      </div>
      <div className="space-y-2 p-5">
        <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#4d4d4d]">
          <span>{category}</span>
          <span>{location}</span>
        </div>
        <h3 className={titleClassName ?? "text-[20px] font-extrabold leading-[1.2] text-[#142238]"}>{title}</h3>
        {description ? (
          <p className={descriptionClassName ?? "text-[15px] leading-[1.6] text-[#4d4d4d]"}>{description}</p>
        ) : null}
      </div>
    </article>
  );
}

function TestimonialCard({ attribution, body, company }: TestimonialCard) {
  return (
    <article className="rounded-[14px] border border-[rgba(0,173,239,0.1)] bg-[rgba(0,173,239,0.02)] px-8 pb-8 pt-8">
      <div className="flex gap-1 text-[#28c0eb]">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-5 w-5 fill-current stroke-0" />
        ))}
      </div>
      <p className="mt-8 min-h-[104px] max-w-[304px] text-[16px] font-normal leading-[1.625] text-[#4d4d4d]">
        {body}
      </p>
      <div className="mt-6 border-t border-[rgba(20,34,56,0.08)] pt-4">
        <p className="text-[16px] font-normal leading-6 text-[#142238]">{attribution}</p>
        <p className="mt-1 text-[14px] font-normal leading-5 text-[#4d4d4d]">{company}</p>
      </div>
    </article>
  );
}

export const ITServicePage = () => {
  return (
    <div className="bg-white font-[family:var(--font-manrope)] text-[#142238]">
      <header className="relative z-20 border-b border-[rgba(20,34,56,0.08)] bg-white">
        <div className="mx-auto flex max-w-[1251px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo1 3.png"
              alt="Synergy Innovation"
              width={188}
              height={44}
              className="h-auto w-[154px] sm:w-[176px]"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-[14px] font-medium transition-colors duration-300 hover:text-[#00b4ff] ${
                  item.href === "#services" ? "text-[#00b4ff]" : "text-[#4d4d4d]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <details className="group relative ml-auto lg:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-[#d8ebf5] bg-[#f8fcff] text-[#142238] transition-colors duration-300 hover:border-[#00b4ff] hover:text-[#00b4ff]">
              <Menu className="h-5 w-5" />
            </summary>

            <div className="absolute right-0 top-[calc(100%+12px)] z-30 w-[220px] rounded-[18px] border border-[#dfeef7] bg-white p-3 shadow-[0_18px_40px_rgba(20,34,56,0.12)]">
              <nav className="flex flex-col">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-[12px] px-4 py-3 text-[14px] font-semibold text-[#4d4d4d] transition-colors duration-300 hover:bg-[#f4fbff] hover:text-[#00b4ff]"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </details>

          <PrimaryInquiryButton className="max-lg:hidden lg:inline-flex">Get Free Audit</PrimaryInquiryButton>
        </div>
      </header>

      <main>
        <section className="overflow-hidden">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)] lg:px-0 lg:pb-16 lg:pt-[53px]">
            <div className="max-w-[650px] pt-2 lg:pt-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d7effa] bg-[#f5fbff] px-4 py-1.5 shadow-[0_4px_12px_rgba(0,173,239,0.05)]">
                <span className="h-2 w-2 rounded-full bg-[#00b4ff]" />
                <span className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#00b4ff]">
                  AI-Driven IT Services
                </span>
              </div>

              <h1 className="mt-7 max-w-[620px] text-[42px] font-extrabold leading-[0.98] tracking-[-0.045em] text-[#142238] sm:text-[58px] lg:text-[66px]">
                We Build Tech That
                <span className="mt-1 block bg-[linear-gradient(169deg,#00b4ff_0%,#00ffc8_100%)] bg-clip-text text-transparent">
                  Automates.
                </span>
              </h1>

              <p className="mt-5 max-w-[600px] text-[18px] leading-[1.55] text-[#4d4d4d] sm:text-[20px]">
                From custom websites to AI automation systems, Synergy Innovation delivers enterprise-grade digital
                solutions built for speed, scale, and results. 100% custom code. Zero templates.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#services"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-[6px] bg-[#00b4ff] px-6 text-[14px] font-bold text-white shadow-[0_10px_20px_rgba(0,180,255,0.22)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Explore Services
                </a>
                <ITServicesInquiryTrigger className="inline-flex min-h-[48px] items-center justify-center rounded-[6px] border border-[#e6edf3] bg-white px-6 text-[14px] font-bold text-[#142238] transition-colors duration-300 hover:border-[#00b4ff] hover:text-[#00b4ff]">
                  Get Free Audit
                </ITServicesInquiryTrigger>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#e8f0f4] pt-8 sm:grid-cols-4">
                {heroMetrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="text-[31px] font-extrabold tracking-[-0.04em] text-[#00b4ff] sm:text-[42px]">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#4d4d4d]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative mx-auto min-h-[420px] max-w-[520px] lg:min-h-[430px]">
                <div className="absolute right-[-72px] top-[0px] z-20 h-[100px] w-[209px] rounded-[14px] border border-[rgba(74,222,128,0.3)] bg-white shadow-[0_8px_16px_rgba(74,222,128,0.2)]">
                  <div className="flex items-center gap-2 pl-[16px] pt-[16px] text-[11px] font-semibold uppercase leading-[16.5px] text-[#4ade80]">
                    <span className="h-[8px] w-[8px] rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]" />
                    Live
                  </div>
                  <p className="pl-[16px] pt-[12px] text-[13px] font-normal leading-[19.5px] text-black">AI Systems Active</p>
                  <p className="pl-[16px] pt-[4px] text-[12px] font-normal leading-[18px] text-[#4d4d4d]">
                    Running 24/7 · 80% automated
                  </p>
                </div>

                <div className="absolute left-[22px] top-[262px] z-20 h-[123px] w-[151px] rounded-[14px] border border-[#00b4ff] bg-white shadow-[0_8px_16px_rgba(14,165,233,0.2)]">
                  <p className="pl-[16px] pt-[16px] text-[32px] font-bold leading-[48px] text-[#00b4ff]">100+</p>
                  <p className="pl-[16px] pt-[0px] text-[13px] font-normal leading-[19.5px] text-black">Projects Delivered</p>
                  <p className="pl-[16px] pt-[4px] text-[12px] font-normal leading-[18px] text-[#4d4d4d]">Across 15+ industries</p>
                </div>

                <div className="absolute right-[0px] top-[288px] z-20 h-[159px] w-[175px] rounded-[14px] border border-[rgba(129,140,248,0.3)] bg-white px-[16.8px] pt-[16.8px] shadow-[0_8px_16px_rgba(129,140,248,0.2)]">
                  <div className="relative h-[124px] w-[139px] overflow-hidden rounded-b-[36px]">
                    <Image
                      src="/images/iwc.png"
                      alt="Incredible Workplaces Certified India badge"
                      fill
                      sizes="139px"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="absolute left-[108px] top-[18px] h-[348px] w-[348px] rounded-[36px] bg-[radial-gradient(circle_at_center,rgba(0,173,239,0.12),rgba(255,255,255,0)_72%)]" />
                <div className="absolute left-[116px] top-[8px] z-10 h-[352px] w-[352px]">
                  <Image
                    src="/images/aichip.png"
                    alt="AI chip and automation illustration"
                    fill
                    sizes="(max-width: 1023px) 280px, 352px"
                    className="object-contain drop-shadow-[0_24px_42px_rgba(0,173,239,0.1)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <SectionEyebrow>IT Products & Services</SectionEyebrow>
          <h2 className="mt-4 max-w-[840px] text-[34px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#142238] sm:text-[48px] lg:text-[56px]">
            Full-Spectrum Digital Engineering.
            <span className="block">Every Service. Enterprise Grade.</span>
          </h2>
          <p className="mt-5 max-w-[620px] text-[18px] leading-[1.7] text-[#4d4d4d]">
            100% custom built. No templates, no page builders. Every solution is architected around your business
            logic and built to scale cleanly.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.title}>
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </section>

        <section id="products" className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <SectionEyebrow>AI Products</SectionEyebrow>
          <h2 className="mt-4 max-w-[900px] text-[34px] font-extrabold leading-[1.06] tracking-[-0.04em] text-[#142238] sm:text-[48px]">
            Intelligent Systems Built for Your Operations.
            <span className="block">Built Once. Runs Forever.</span>
          </h2>
          <p className="mt-5 max-w-[720px] text-[18px] leading-[1.7] text-[#4d4d4d]">
            No SaaS lock-in, no subscriptions, and no unnecessary complexity. We build durable systems your team can
            actually own.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div key={product.title}>
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <SectionEyebrow>Our Work</SectionEyebrow>
          <h2 className="mt-4 text-[34px] font-extrabold leading-[1.04] tracking-[-0.04em] text-[#142238] sm:text-[48px]">
            100+ Projects.
            <span className="block">Real Results.</span>
          </h2>
          <p className="mt-5 max-w-[620px] text-[20px] font-light leading-[1.36] text-[#4d4d4d]">
            From university platforms to gaming apps to global sports organisations — we&apos;ve built across every
            industry.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <div key={project.title}>
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </section>

        <section id="process" className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-0 lg:py-20">
          <div className="text-center">
            <SectionEyebrow>WHY WE WORK</SectionEyebrow>
          </div>
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="mt-4 text-[34px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#142238] sm:text-[48px]">
              From Brief to Live.
              <span className="block">In Weeks.</span>
            </h2>
            <p className="mt-5 text-[18px] leading-[1.7] text-[#4d4d4d]">
              Our stage-based process balances clarity and speed so execution never drifts away from business value.
            </p>
          </div>

          <div className="relative mt-14">
            <div className="absolute left-1/2 top-[31px] hidden h-px w-[73%] -translate-x-1/2 bg-[rgba(0,180,255,0.22)] xl:block" />
            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-[48px]">
              {processSteps.map((step) => (
                <article key={step.number} className="relative mx-auto max-w-[245px] text-center">
                  <div className="mx-auto flex h-[62px] w-[62px] items-center justify-center rounded-full border border-[rgba(0,180,255,0.22)] bg-[#00b4ff] text-[31px] font-extrabold leading-none text-white">
                    {step.number}
                  </div>
                  <h3 className="mt-6 text-[20px] font-bold leading-[1.5] text-[#142238]">{step.title}</h3>
                  <p className="mt-2 text-[14.4px] font-normal leading-[1.6] text-[#4d4d4d]">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-0 lg:py-16">
          <div className="text-center">
            <SectionEyebrow>Client Stories</SectionEyebrow>
            <h2 className="mt-4 text-[34px] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#142238] sm:text-[48px]">
              What Our Clients Say
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.attribution}>
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-[1240px] px-4 py-16 text-center sm:px-6 lg:px-0 lg:pb-[88px] lg:pt-[92px]">
            <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-[#bfe8fb] bg-[#f5fbff] px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#00b4ff]" />
              <span className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#00b4ff]">
                LET&apos;S BUILD THE FUTURE TOGETHER
              </span>
            </div>

            <h2 className="mt-8 text-[34px] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#142238] sm:text-[48px] lg:text-[56px]">
              Ready to Build
              <span className="block bg-[linear-gradient(169deg,#00b4ff_0%,#00ffc8_100%)] bg-clip-text text-transparent">
                Something That Lasts?
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-[1080px] text-[18px] font-light leading-[1.7] text-[#4d4d4d]">
              Free 30-minute digital audit. We&apos;ll map exactly which tech investments will drive the highest ROI
              for your business — no pitch, no commitment.
            </p>

            <div className="mt-10">
              <PrimaryInquiryButton>Start a Conversation</PrimaryInquiryButton>
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 text-[14px] text-[#4d4d4d]">
              {contactItems.map((item) => {
                const Icon = item.icon;

                return (
                  <span key={item.label} className="inline-flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#dfeaf0] bg-[#fbfdff]">
                      <Icon className="h-4 w-4 text-[#8aa1b4]" />
                    </span>
                    <span>{item.label}</span>
                  </span>
                );
              })}
            </div>

            <div className="mt-10 flex flex-wrap items-start justify-center gap-x-12 gap-y-6">
              {trustMetrics.map((metric) => (
                <div key={metric.label} className="min-w-[88px] text-center">
                  <p className="text-[18px] font-extrabold text-[#00a8ff]">{metric.value}</p>
                  <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#617891]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
