"use client";

import Image from "next/image";
import Link from "next/link";
import { NavigationHeaderSection } from "@/screens/HomePage/sections/NavigationHeaderSection";
import { FooterSection } from "@/screens/HomePage/sections/FooterSection";
import { FadeInView } from "@/components/FadeInView";
import {
  ArrowRight, Play, CheckCircle2, TrendingUp, Zap, Sparkles,
  Brain, BarChart3, Construction, Users2, ChevronDown, HelpCircle,
  ArrowUpRight, AlertCircle, Quote, Star
} from "lucide-react";
import { useState, useEffect } from "react";
import { ITServicesInquiryTrigger } from "@/screens/ITServicePage/ITServicesTopCta";
import { ScheduleCallTrigger } from "./sections/ScheduleCallTrigger";

export const WebDevelopmentPage = () => {
  // Hero Stats State
  const [leadsCount, setLeadsCount] = useState(312);
  const [revenue, setRevenue] = useState(18.4);

  // ROI Calculator States
  const [visitors, setVisitors] = useState(5000);
  const [convRate, setConvRate] = useState(2); // in %
  const [dealValue, setDealValue] = useState(25000); // in ₹

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLeadsCount(prev => prev + (Math.random() > 0.5 ? 1 : 0));
      setRevenue(prev => parseFloat((prev + (Math.random() > 0.8 ? 0.1 : 0)).toFixed(1)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // ROI Calculations
  const currentMonthlyRev = Math.round(visitors * (convRate / 100) * dealValue);
  const aiConvRate = parseFloat((convRate * 2.3).toFixed(2)); // typical 2.3x uplift from figma
  const aiMonthlyRev = Math.round(visitors * (aiConvRate / 100) * dealValue);
  const monthlyGrowth = aiMonthlyRev - currentMonthlyRev;
  const annualOpportunity = monthlyGrowth * 12;

  // Format Currency in INR
  const formatINR = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const faqData = [
    {
      q: "How long does it take to launch an AI Revenue Website™?",
      a: "A typical implementation takes between 6 to 8 weeks from initial discovery and strategy mapping to final QA, testing, and deployment. This includes custom UX design, AI integration, CRM setup, and copy engineering."
    },
    {
      q: "How is pricing structured?",
      a: "We structure pricing based on the complexity of your funnel integrations, database architecture, and custom AI agents required. We offer clear, fixed-price project quotes alongside long-term growth support agreements."
    },
    {
      q: "What AI is actually powering the chatbot and automation?",
      a: "Our systems run on leading models including OpenAI's GPT-4o and Google's Gemini, combined with semantic search (RAG) and custom rule-based business logic to ensure high accuracy, zero hallucinations, and safe customer engagement."
    },
    {
      q: "Will this actually help our SEO, or just add AI features?",
      a: "Yes, it fundamentally improves SEO. Every platform is built using React / Next.js with complete server-side rendering (SSR), optimized metadata, structured schema markup, and high-performance loading speeds that Google prioritizes."
    },
    {
      q: "What kind of support do we get after launch?",
      a: "We provide dedicated post-launch support including conversion rate optimization (CRO) audits, system maintenance, model fine-tuning, and direct support SLA options to ensure continuous lead flow and CRM stability."
    }
  ];

  return (
    <div className="w-full bg-[#030303] text-white font-[family:var(--font-manrope)] overflow-hidden">
      {/* Custom Sticky Page Header matching Figma node 80:178 & 80:179 */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#030303]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          {/* Brand lockup — Figma node 80:180 */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/logo1-white 1.png"
              alt="Synergy Innovation"
              width={151}
              height={44}
              className="h-auto w-[128px] sm:w-[151px]"
              priority
            />
            <span className="inline-flex items-center rounded-full border-[0.8px] border-[#10b981]/30 bg-[#10b981]/[0.14] px-2 py-[3px] font-[family:var(--font-jetbrains)] text-[9.5px] leading-[14px] text-[#34d399]">
              AI-FIRST
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-6">
            {[
              { label: "Outcomes", href: "#outcomes" },
              { label: "Capabilities", href: "#capabilities" },
              { label: "Industries", href: "#industries" },
              { label: "Process", href: "#process" },
              { label: "Case Studies", href: "#case-studies" },
              { label: "ROI Calculator", href: "#roi-calculator" },
              { label: "FAQ", href: "#faq" }
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13.5px] font-medium text-slate-400 hover:text-white transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#roi-calculator"
              className="hidden sm:inline-flex text-[13px] font-bold text-slate-300 hover:text-white transition-colors duration-300 px-4 py-2 border border-white/10 rounded-full bg-white/5"
            >
              ROI Calculator
            </a>
            <a
              href="#contact"
              className="text-[13px] font-bold text-white bg-[#00adef] hover:bg-[#00adef]/90 transition-all duration-300 px-5 py-2.5 rounded-full shadow-[0_4px_15px_rgba(0,173,239,0.3)]"
            >
              Book Free Audit
            </a>
          </div>
        </div>
      </header>

      <main className="w-full">
        {/* SECTION 1: Figma Hero Banner Section (80:177 & 80:205) */}
        <section className="relative w-full overflow-hidden border-b border-white/5 py-20 lg:py-[110px]">
          <div className="pointer-events-none absolute top-1/4 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00adef]/10 blur-[120px]" />
          <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[600px] w-[600px] translate-x-1/2 translate-y-1/2 rounded-full bg-[#2563eb]/10 blur-[140px]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

          <div className="relative mx-auto w-full max-w-[1264px] px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,572px)_minmax(0,518px)] lg:justify-between lg:gap-x-[110px]">
              {/* Left column — 572px */}
              <div className="flex flex-col">
                {/* Eyebrow pill */}
                <FadeInView delay={0.1}>
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border-[0.8px] border-white/10 bg-white/[0.06] px-3.5 py-[7px]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#10b981] shadow-[0_0_0_6px_rgba(16,185,129,0.07)]" />
                    <span className="font-[family:var(--font-jetbrains)] text-[12px] leading-[18px] text-[#00adef]">
                      AI Revenue Website™ · Built for B2B Growth
                    </span>
                  </div>
                </FadeInView>

                {/* Heading */}
                <FadeInView delay={0.2}>
                  <h1 className="mt-6 max-w-[600px] text-[38px] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[48px] lg:text-[60px] lg:tracking-[-1.2px]">
                    Your Website Should Be{" "}
                    <span className="text-[#00adef]">Your Best Salesperson.</span>
                  </h1>
                </FadeInView>

                {/* Paragraph */}
                <FadeInView delay={0.3}>
                  <p className="mt-[22px] max-w-[540px] font-[family:var(--font-inter)] text-[17px] leading-[29px] text-[#cbd5e1] sm:text-[18px]">
                    We build AI-powered websites that generate leads, automate customer engagement, qualify prospects, integrate with your CRM, and drive measurable business growth 24×7.
                  </p>
                </FadeInView>

                {/* CTAs */}
                <FadeInView delay={0.4}>
                  <div className="mt-9 flex flex-wrap items-center gap-3.5">
                    <a
                      href="#contact"
                      className="group inline-flex items-center gap-2 rounded-full bg-[#00adef] px-7 py-[15px] font-[family:var(--font-inter)] text-[14.5px] leading-[22px] font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00adef]/90"
                    >
                      Book Free AI Website Growth Audit
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>

                    <a
                      href="#case-studies"
                      className="inline-flex items-center gap-2 rounded-full border-[0.8px] border-white/[0.18] bg-white/[0.06] px-7 py-[15px] font-[family:var(--font-inter)] text-[14.5px] leading-[22px] font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Watch Demo
                    </a>
                  </div>
                </FadeInView>

                {/* Stats row */}
                <FadeInView delay={0.5}>
                  <div className="mt-14 flex flex-wrap gap-x-9 gap-y-7">
                    {[
                      { value: "+14+", label: "Years Experience" },
                      { value: "+100+", label: "Projects Delivered" },
                      { value: "AI-First", label: "Company" },
                      { value: "+100%", label: "Custom Solutions" }
                    ].map((stat) => (
                      <div key={stat.label}>
                        <span className="block bg-gradient-to-r from-[#93c5fd] to-[#c4b5fd] bg-clip-text font-[family:var(--font-jetbrains)] text-[26px] leading-[39px] font-bold text-transparent">
                          {stat.value}
                        </span>
                        <span className="block font-[family:var(--font-inter)] text-[12.5px] leading-[19px] text-[#94a3b8]">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </FadeInView>
              </div>

              {/* Right column — 518px dashboard mock */}
              <FadeInView delay={0.3} className="w-full">
                <div className="relative mx-auto w-full max-w-[518px]">
                  <div className="rounded-[28px] border-[0.8px] border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[0_20px_60px_rgba(37,99,235,0.18),0_0_0_1px_rgba(37,99,235,0.12)] backdrop-blur-xl">
                    {/* Window dots */}
                    <div className="flex items-center gap-1.5">
                      <span className="h-[9px] w-[9px] rounded-full bg-white/15" />
                      <span className="h-[9px] w-[9px] rounded-full bg-white/15" />
                      <span className="h-[9px] w-[9px] rounded-full bg-white/15" />
                    </div>

                    {/* KPI tiles */}
                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl border-[0.8px] border-white/10 bg-white/[0.04] p-3">
                        <span className="block font-[family:var(--font-inter)] text-[10.5px] leading-4 text-[#94a3b8]">
                          Leads This Week
                        </span>
                        <span className="mt-1.5 block font-[family:var(--font-jetbrains)] text-[18px] leading-[27px] font-semibold text-white">
                          {leadsCount}
                        </span>
                        <span className="block font-[family:var(--font-jetbrains)] text-[10.5px] leading-4 text-[#34d399]">
                          ↑ 27%
                        </span>
                      </div>

                      <div className="rounded-xl border-[0.8px] border-white/10 bg-white/[0.04] p-3">
                        <span className="block font-[family:var(--font-inter)] text-[10.5px] leading-4 text-[#94a3b8]">
                          Revenue Pipeline
                        </span>
                        <span className="mt-1.5 block font-[family:var(--font-jetbrains)] text-[18px] leading-[27px] font-semibold text-white">
                          ₹{revenue}L
                        </span>
                        <span className="block font-[family:var(--font-jetbrains)] text-[10.5px] leading-4 text-[#34d399]">
                          ↑ 42%
                        </span>
                      </div>
                    </div>

                    {/* Trend chart */}
                    <div className="mt-3.5 rounded-xl border-[0.8px] border-white/10 bg-white/[0.04] p-3.5">
                      <div className="relative h-[90px] w-full">
                        <Image
                          src="/images/Vector.png"
                          alt="Revenue growth trend"
                          fill
                          sizes="(max-width: 1024px) 90vw, 447px"
                          className="object-contain object-bottom"
                          priority
                        />
                      </div>
                    </div>

                    {/* AI chatbot activity */}
                    <div className="mt-3 flex items-center gap-2.5 rounded-xl border-[0.8px] border-white/10 bg-white/[0.04] p-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#2563eb_0%,#7c3aed_100%)] text-[13px] leading-5">
                        🤖
                      </span>
                      <div className="min-w-0">
                        <span className="block pb-0.5 font-[family:var(--font-inter)] text-[11px] leading-[17px] font-bold text-white">
                          AI Chatbot
                        </span>
                        <p className="font-[family:var(--font-inter)] text-[11.5px] leading-[17px] text-[#cbd5e1]">
                          Qualified a new enterprise lead and booked a demo — automatically.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating badges */}
                  <div className="absolute -top-3.5 right-2 inline-flex items-center gap-2 rounded-[14px] border-[0.8px] border-white/10 bg-[#0d1424]/90 px-3.5 py-2.5 font-[family:var(--font-inter)] text-[12px] leading-[18px] text-white shadow-[0_24px_64px_rgba(15,23,42,0.16)] backdrop-blur-md sm:-right-6">
                    <span>📈</span>
                    <span>Conversion +180%</span>
                  </div>

                  <div className="absolute bottom-[5px] left-2 inline-flex items-center gap-2 rounded-[14px] border-[0.8px] border-white/10 bg-[#0d1424]/90 px-3.5 py-2.5 font-[family:var(--font-inter)] text-[12px] leading-[18px] text-white shadow-[0_24px_64px_rgba(15,23,42,0.16)] backdrop-blur-md sm:-left-8">
                    <span>⚡</span>
                    <span>Response time 5 sec</span>
                  </div>
                </div>
              </FadeInView>
            </div>
          </div>
        </section>

        {/* SECTION 2: TrustedBy (80:289 & 80:290) */}
        <section className="py-20 bg-[#f8fafc] border-b border-slate-200/60">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">Trusted By Leaders</p>
              <h2 className="mt-3 text-[12.5px] font-normal text-[#64748b]">
                Trusted by ambitious businesses across industries
              </h2>
            </div>

            {/* Client logos grid */}
            <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-6 items-center justify-items-center opacity-80">
              {["Nordwell Health", "Vantage Realty", "Bluepeak Retail", "Crestline Hotels", "Orbit Manufacturing", "Alden Finance"].map(client => (
                <div key={client} className="text-[#334155]/80 font-bold tracking-tight text-[17px] hover:text-[#2563eb] transition-colors duration-300">
                  {client}
                </div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <h3 className="text-[24px] font-bold tracking-tight text-[#0a0a0a]">
                Why Businesses Trust Synergy Innovation
              </h3>
            </div>

            {/* Core Trust Pillars */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { emoji: "🧠", title: "AI-First Approach", desc: "Every build starts with AI at the core, not bolted on as an afterthought." },
                { emoji: "📊", title: "Business Consulting Mindset", desc: "We think in revenue, retention and ROI — not just pages and pixels." },
                { emoji: "🏗️", title: "Enterprise Architecture", desc: "Built to scale with your business — secure, fast, and CRM-ready from day one." },
                { emoji: "🤝", title: "Long-Term Growth Partner", desc: "We stay on after launch to keep improving conversion, month over month." }
              ].map((pillar, i) => (
                <div key={i} className="flex flex-col items-start bg-transparent p-2 transition-all duration-300 hover:-translate-y-1">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb]/12 to-[#7c3aed]/10 text-xl">
                    {pillar.emoji}
                  </div>
                  <h4 className="mt-5 text-[14.5px] font-semibold text-[#0a0a0a]">{pillar.title}</h4>
                  <p className="mt-2.5 text-[#475569] text-[13px] leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: PainPoints (80:350) */}
        <section id="outcomes" className="py-20 bg-[#f8fafc] border-b border-slate-200/60">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-[800px] mx-auto mb-14">
              <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">The Hidden Cost</p>
              <h2 className="mt-3 text-[36px] sm:text-[48px] font-bold text-[#0a0a0a] tracking-tight leading-[1.1]">
                The Hidden Cost Of An Outdated Website
              </h2>
              <p className="mt-4 text-[#475569] text-[17px] leading-relaxed">
                While you read this, an outdated website is quietly costing you leads, time, and revenue — every single day.
              </p>
            </div>

            {/* 9 Pain Points 3-Column Grid */}
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { emoji: "📉", title: "Low Conversion Rate", desc: "Traffic arrives, but most visitors leave without ever becoming a lead." },
                { emoji: "🚪", title: "Visitors Leaving", desc: "No engagement layer means no reason for prospects to stay or act." },
                { emoji: "✋", title: "Manual Follow-Up", desc: "Your sales team chases leads by hand instead of closing ready buyers." },
                { emoji: "🗂️", title: "No CRM", desc: "Leads land in an inbox and quietly disappear before anyone acts." },
                { emoji: "🔍", title: "Poor SEO", desc: "Competitors are found first, simply because they were built to be found." },
                { emoji: "🐢", title: "Slow Loading", desc: "Every extra second of load time pushes serious buyers away." },
                { emoji: "🤖", title: "No AI", desc: "No one is working your website while your team is offline." },
                { emoji: "🎯", title: "No Personalization", desc: "Every visitor sees the same page, regardless of who they are." },
                { emoji: "📝", title: "Static Enquiry Forms", desc: "A form that just sits there is not a conversion strategy." }
              ].map((pain, i) => (
                <div key={i} className="rounded-[18px] border border-[#ef4444]/10 bg-[#ef4444]/[0.04] p-6 hover:border-[#ef4444]/20 transition-all duration-300">
                  <span className="text-[18px] block">{pain.emoji}</span>
                  <h4 className="mt-4 text-[15.5px] font-semibold text-[#0a0a0a]">{pain.title}</h4>
                  <p className="mt-2 text-[#475569] text-[13.5px] leading-relaxed">{pain.desc}</p>
                </div>
              ))}
            </div>

            {/* Bottom Loss Banner Card */}
            <div className="mt-12 rounded-[18px] border border-[#fecaca] bg-gradient-to-r from-[#f9f2f2] to-[#fffbeb] p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-[0_4px_15px_rgba(239,68,68,0.02)]">
              <div>
                <div className="text-[30px] font-bold text-[#dc2626] font-mono tracking-tight">₹10L–₹50L+</div>
                <p className="mt-1 text-[#475569] text-[13.5px] leading-relaxed max-w-[620px]">
                  Estimated annual revenue lost to an underperforming website, for a typical growing business.
                </p>
              </div>
              <a
                href="#roi-calculator"
                className="inline-flex items-center justify-center rounded-full border border-[#0f172a] bg-transparent hover:bg-[#0f172a]/5 px-7 py-3.5 text-[14.5px] font-semibold text-[#0f172a] transition-all duration-300 shrink-0"
              >
                Calculate Your Loss &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 3.5: Traditional vs AI Revenue Website Comparison (80:436) */}
        <section className="py-20 bg-[#f8fafc] border-b border-slate-200/60">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-[800px] mx-auto mb-14">
              <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">The Difference</p>
              <h2 className="mt-3 text-[36px] sm:text-[48px] font-bold text-[#0a0a0a] tracking-tight leading-[1.1]">
                Traditional Website vs AI Revenue Website
              </h2>
              <p className="mt-4 text-[#475569] text-[17px] leading-relaxed">
                Same visitors. Completely different business outcome.
              </p>
            </div>

            {/* Split Comparison Card */}
            <div className="max-w-[1140px] mx-auto rounded-[28px] overflow-hidden bg-white border border-slate-200 shadow-xl shadow-slate-200/40 grid md:grid-cols-2">

              {/* Left Column: Traditional Website */}
              <div className="p-8 sm:p-10 flex flex-col justify-between bg-white border-b md:border-b-0 md:border-r border-slate-100">
                <div>
                  <h3 className="text-[20px] font-bold text-[#1e293b] flex items-center gap-2">
                    <span>🐌</span> Traditional Website
                  </h3>

                  <ul className="mt-8 space-y-5">
                    {[
                      "Static, one-size-fits-all pages",
                      "Manual lead handling",
                      "Basic contact form",
                      "No AI, no intelligence",
                      "No automation",
                      "Poor analytics visibility",
                      "Low, unpredictable conversion"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3.5">
                        <span className="text-slate-400 font-bold mt-0.5 select-none">&#10005;</span>
                        <span className="text-[#475569] text-[14.5px] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Synergy AI Revenue Website */}
              <div className="p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-[#0b1220] to-[#160f33] text-white relative">
                <div className="absolute top-0 right-0 h-48 w-48 bg-[#00adef]/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="text-[20px] font-bold text-white flex items-center gap-2">
                    <span className="text-[#00ffc8]">⚡</span> Synergy AI Revenue Website
                  </h3>

                  <ul className="mt-8 space-y-5">
                    {[
                      "AI chatbot engaging every visitor",
                      "Automated lead qualification",
                      "Native CRM integration",
                      "WhatsApp automation built-in",
                      "End-to-end workflow automation",
                      "Real-time revenue analytics",
                      "Personalized, high-converting journeys",
                      "Live revenue dashboard"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3.5">
                        <span className="text-[#34d399] font-bold mt-0.5 select-none">&#10003;</span>
                        <span className="text-white text-[14.5px] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 4: IntroSection (80:517) */}
        <section className="py-20 bg-[#f8fafc] border-b border-slate-200/60 relative">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">Introducing</p>
            <h2 className="mt-4 text-[36px] sm:text-[48px] font-bold tracking-tight text-[#0a0a0a] leading-tight">
              AI Revenue Website&trade;
            </h2>
            <h3 className="mt-3 text-xl sm:text-2xl font-semibold text-emerald-600">
              We don&apos;t build websites.
            </h3>
            <p className="mx-auto mt-6 max-w-[780px] text-lg sm:text-[19px] leading-relaxed text-[#475569] font-light">
              We build AI-powered B2B growth engines that qualify traffic, automate scheduling, and drive revenue 24/7.
            </p>
            <p className="mx-auto mt-4 max-w-[740px] text-[15px] leading-relaxed text-slate-500">
              Every visitor is greeted, qualified, and routed to the right outcome: a booked meeting, a warm lead in your CRM, or a WhatsApp conversation already in motion.
            </p>
            <div className="mt-10">
              <a
                href="#capabilities"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 px-6 py-3.5 text-[14px] font-semibold text-[#0f172a] transition-all duration-300 shadow-sm"
              >
                Explore Capabilities
                <ArrowRight className="h-4 w-4 text-[#0f172a]" />
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 4.5: Outcomes, Not Features (80:550) */}
        <section id="outcomes" className="py-20 bg-[#f8fafc] border-b border-slate-200/60">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-[800px] mx-auto mb-14">
              <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">Outcomes, Not Features</p>
              <h2 className="mt-3 text-[36px] sm:text-[48px] font-bold text-[#0a0a0a] tracking-tight leading-[1.1]">
                What Actually Changes For Your Business
              </h2>
              <p className="mt-4 text-[#475569] text-[17px] leading-relaxed">
                Every capability we build exists to move one of these numbers.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { num: "01", emoji: "🧲", title: "Generate More Qualified Leads", desc: "AI engages and filters visitors so your team only talks to real buyers." },
                { num: "02", emoji: "📈", title: "Increase Conversion Rate", desc: "Personalized journeys turn more visitors into pipeline, automatically." },
                { num: "03", emoji: "⏱️", title: "Reduce Manual Work", desc: "Automation handles follow-up, scheduling, and data entry for you." },
                { num: "04", emoji: "💰", title: "Increase Sales", desc: "Faster response and better qualification close more deals, faster." },
                { num: "05", emoji: "🌟", title: "Improve Customer Experience", desc: "Instant, helpful answers — any time, on any channel." },
                { num: "06", emoji: "🔁", title: "Automate Follow-Up", desc: "No lead goes cold waiting for someone to remember to reply." },
                { num: "07", emoji: "🧯", title: "Reduce Lead Leakage", desc: "Every enquiry is captured, tracked, and routed — nothing slips through." },
                { num: "08", emoji: "📐", title: "Better ROI", desc: "One platform replaces a stack of disconnected tools and manual effort." }
              ].map((out, i) => (
                <div key={i} className="rounded-[18px] border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-[#2563eb]/20 hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300">
                  <div>
                    <div className="flex justify-between items-center">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb]/12 to-[#10b981]/12 text-xl select-none">
                        {out.emoji}
                      </div>
                      <span className="text-[12px] font-medium text-slate-400 font-mono">{out.num}</span>
                    </div>
                    <h3 className="mt-5 text-[15.5px] font-bold text-[#0a0a0a] tracking-tight">{out.title}</h3>
                    <p className="mt-2.5 text-[#475569] text-[13px] leading-relaxed">{out.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: Capabilities (80:643) */}
        <section id="capabilities" className="py-20 bg-[#030303] border-b border-white/5">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-[700px] mx-auto">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-emerald-400">Under The Hood</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                AI Capabilities Built To Sell
              </h2>
              <p className="mt-3 text-slate-400 text-[15px] leading-relaxed">
                Each capability exists for a single reason: to move a visitor closer to becoming revenue.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { emoji: "💬", title: "AI Chatbot", desc: "Engages every visitor instantly, answers questions, and never sleeps.", bullet: "→ Captures leads 24×7" },
                { emoji: "🎯", title: "AI Lead Qualification", desc: "Scores and filters enquiries so your team spends time only on real buyers.", bullet: "→ Higher close rate" },
                { emoji: "🧭", title: "AI Recommendations", desc: "Guides each visitor to the right product, plan, or next step.", bullet: "→ Bigger average deal size" },
                { emoji: "📱", title: "WhatsApp Automation", desc: "Moves conversations to the channel your customers already use.", bullet: "→ Faster response & reply rate" },
                { emoji: "🗂️", title: "CRM Integration", desc: "Every lead, note, and conversation lands exactly where sales works.", bullet: "→ Zero lead leakage" },
                { emoji: "📊", title: "Analytics Dashboard", desc: "See revenue, conversion, and pipeline in real time — not next month.", bullet: "→ Decisions backed by data" },
                { emoji: "🔁", title: "Marketing Automation", desc: "Nurtures leads automatically until they're ready to talk to sales.", bullet: "→ Lower cost per lead" },
                { emoji: "🔍", title: "SEO Intelligence", desc: "Built-in optimization keeps you visible where buyers are searching.", bullet: "→ More qualified organic traffic" }
              ].map((cap, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-white/2 p-6.5 flex flex-col justify-between hover:border-[#00adef]/20 transition-all duration-300">
                  <div>
                    <span className="text-2xl block">{cap.emoji}</span>
                    <h3 className="mt-4 text-[17px] font-bold text-white">{cap.title}</h3>
                    <p className="mt-2 text-slate-400 text-[13.5px] leading-relaxed">{cap.desc}</p>
                  </div>
                  <span className="mt-4 text-[12.5px] font-semibold text-[#00adef] block">{cap.bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5.5: Industries We Help Grow (80:745) */}
        <section id="industries" className="py-20 bg-[#f8fafc] border-b border-slate-200/60">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-[700px] mx-auto">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">Built For Your Business</p>
              <h2 className="mt-3 text-[42px] font-bold text-[#0a0a0a] tracking-tight sm:text-4xl">
                Industries We Help Grow
              </h2>
              <p className="mt-4 text-[#475569] text-[17px] leading-relaxed">
                Same AI Revenue Website™ engine — tuned to the pain points of your industry.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { emoji: "🏠", industry: "Real Estate", pain: "Missed site-visit enquiries at midnight.", fix: "Fix: AI qualifies & books visits instantly" },
                { emoji: "🏥", industry: "Healthcare", pain: "Patients can't easily book or get answers.", fix: "Fix: AI-assisted appointment booking" },
                { emoji: "🏭", industry: "Manufacturing", pain: "Long, manual RFQ and quote cycles.", fix: "Fix: Automated quote qualification" },
                { emoji: "🎓", industry: "Education", pain: "Admission enquiries go unanswered after hours.", fix: "Fix: 24×7 AI counselling chatbot" },
                { emoji: "🧑‍💼", industry: "Recruitment", pain: "Manual screening slows down every hire.", fix: "Fix: AI pre-screens every applicant" },
                { emoji: "🏨", industry: "Hospitality", pain: "Direct bookings lost to OTA commissions.", fix: "Fix: AI-driven direct booking funnel" },
                { emoji: "💻", industry: "SaaS", pain: "Free-trial signups that never activate.", fix: "Fix: AI-guided onboarding nudges" },
                { emoji: "💳", industry: "Finance", pain: "Compliance-heavy forms scare prospects off.", fix: "Fix: Conversational, guided applications" }
              ].map((ind, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-[#2563eb]/30 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
                  <div>
                    <span className="text-[22px] block">{ind.emoji}</span>
                    <h3 className="mt-4 text-[15px] font-bold text-[#0a0a0a]">{ind.industry}</h3>
                    <p className="mt-2 text-[#475569] text-[12.5px] leading-relaxed">{ind.pain}</p>
                  </div>
                  <span className="mt-4 text-[11px] font-medium text-emerald-500 block">{ind.fix}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: TechStack (80:832) */}
        <section className="py-[110px] bg-[#070b14] border-b border-white/5">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-[#7cb3ff]">Under The Bonnet</p>
            <h2 className="mt-4 text-[36px] sm:text-[48px] font-bold text-white tracking-tight">Enterprise-Grade Technology</h2>
            <p className="mt-4 text-[#94a3b8] text-[17px] max-w-[680px] mx-auto">The same stack trusted by category-leading SaaS companies.</p>

            {/* Tech stack chips grid */}
            <div className="mt-14 flex flex-wrap justify-center gap-3.5 max-w-[900px] mx-auto">
              {["OpenAI", "Gemini", "React", "Next.js", "Node.js", "Python", "WhatsApp Cloud API", "Google Analytics", "Meta", "AWS", "Azure", "Vercel"].map(tech => (
                <span key={tech} className="rounded-full border border-white/10 bg-white/[0.04] px-[20px] py-[12px] text-[13.5px] font-medium text-[#cbd5e1] hover:border-[#7cb3ff]/30 hover:bg-[#7cb3ff]/5 transition-all duration-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: Our Process (80:882 & 80:894) */}
        <section id="process" className="py-20 bg-[#f8fafc] border-b border-slate-200/60">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-[700px] mx-auto">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2563eb]">How We Work</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0a0a0a] sm:text-4xl">Our Process</h2>
              <p className="mt-3 text-[#475569] text-[15px] leading-relaxed">
                A proven, enterprise-grade sequence — because your website is too important to wing it.
              </p>
            </div>

            {/* Vertical Timeline Wrapper */}
            <div className="mt-16 max-w-[760px] mx-auto relative pl-16">

              {/* Vertical Gradient Timeline Line (80:896) */}
              <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#2563eb] via-[#7c3aed] to-[#10b981] pointer-events-none" />

              {/* Timeline Items */}
              <div className="space-y-12">
                {[
                  { step: "01", title: "Business Discovery", desc: "We learn your business, buyers, and revenue goals before touching design." },
                  { step: "02", title: "Research", desc: "Competitor, market, and customer-behaviour research shapes the strategy." },
                  { step: "03", title: "Business Strategy", desc: "We define the funnel, messaging, and growth levers unique to you." },
                  { step: "04", title: "UX Design", desc: "Every screen is designed around one goal: moving visitors toward action." },
                  { step: "05", title: "AI Architecture", desc: "Chatbot, qualification logic, and CRM flows are engineered end-to-end." },
                  { step: "06", title: "Development", desc: "Enterprise-grade build on a fast, secure, scalable stack." },
                  { step: "07", title: "Testing", desc: "Rigorous QA across devices, browsers, and real conversion scenarios." },
                  { step: "08", title: "Launch", desc: "A controlled, zero-downtime go-live with full monitoring in place." },
                  { step: "09", title: "Continuous Growth", desc: "We keep optimizing conversion and revenue long after launch." }
                ].map((proc, i) => (
                  <div key={i} className="relative flex flex-col justify-center">

                    {/* Circle Step Number Badge */}
                    <div className="absolute left-[-64px] flex h-12 w-12 items-center justify-center rounded-full bg-white border-[1.6px] border-[#2563eb] text-[#2563eb] font-bold font-mono text-[13px] shadow-[0_2px_8px_rgba(15,23,42,0.06)] z-10 hover:scale-110 transition-transform duration-300">
                      {proc.step}
                    </div>

                    {/* Step Title & Description */}
                    <div>
                      <h3 className="text-[17px] font-bold text-[#0a0a0a] tracking-tight">{proc.title}</h3>
                      <p className="mt-1.5 text-[#475569] text-[13.5px] leading-relaxed max-w-[696px]">
                        {proc.desc}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 8: CaseStudies (80:960 & 80:961) */}
        <section id="case-studies" className="py-20 bg-[#f8fafc] border-b border-slate-200/60">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-[800px] mx-auto mb-14">
              <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">Proof, Not Promises</p>
              <h2 className="mt-3 text-[36px] sm:text-[48px] font-bold text-[#0a0a0a] tracking-tight leading-[1.1]">Case Studies</h2>
              <p className="mt-4 text-[#475569] text-[17px] leading-relaxed">Real business outcomes from AI Revenue Website&trade; implementations.</p>
            </div>

            {/* Case Studies list */}
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {[
                {
                  industry: "Healthcare",
                  client: "Regional Hospital Chain",
                  problem: "Enquiries went unanswered after hours; front desk was overwhelmed with basic questions.",
                  solution: "AI chatbot + WhatsApp automation handling appointment booking and FAQs 24×7.",
                  stats: [
                    { val: "+240%", lbl: "Leads" },
                    { val: "+180%", lbl: "Conversions" },
                    { val: "-45%", lbl: "Manual Work" }
                  ]
                },
                {
                  industry: "Real Estate",
                  client: "Vantage Realty Group",
                  problem: "High ad spend, but most site-visit requests were unqualified and never converted.",
                  solution: "AI lead qualification and CRM routing sent only serious buyers to sales.",
                  stats: [
                    { val: "+210%", lbl: "Leads" },
                    { val: "+165%", lbl: "Conversions" },
                    { val: "-38%", lbl: "Manual Work" }
                  ]
                },
                {
                  industry: "Manufacturing",
                  client: "Orbit Manufacturing Co.",
                  problem: "RFQs took days to reach the right person, losing deals to faster competitors.",
                  solution: "Automated RFQ intake, scoring, and instant CRM assignment.",
                  stats: [
                    { val: "+190%", lbl: "Leads" },
                    { val: "+150%", lbl: "Conversions" },
                    { val: "-52%", lbl: "Manual Work" }
                  ]
                }
              ].map((study, i) => (
                <div key={i} className="rounded-[18px] border border-slate-200 bg-white overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300">

                  {/* Card Header Portion: Dark Blue Gradient */}
                  <div className="bg-gradient-to-br from-[#0f172a] to-[#1b2440] p-6 relative">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#93c5fd]">{study.industry}</span>
                    <h3 className="mt-2 text-[17px] font-bold text-white">{study.client}</h3>
                  </div>

                  {/* Card Body Portion: Light Background */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Problem</span>
                        <p className="mt-1 text-[13.5px] text-[#475569] leading-relaxed">{study.problem}</p>
                      </div>
                      <div>
                        <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Solution</span>
                        <p className="mt-1 text-[13.5px] text-[#475569] leading-relaxed">{study.solution}</p>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                      {study.stats.map((st, j) => (
                        <div key={j}>
                          <span className="block text-[19px] font-bold text-[#10b981] font-mono">{st.val}</span>
                          <span className="block text-[10.5px] font-normal text-[#64748b] tracking-wide mt-0.5">{st.lbl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9: ROI Calculator (80:1070) */}
        <section id="roi-calculator" className="py-20 bg-[#f8fafc] border-b border-slate-200/60">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-[800px] mx-auto mb-14">
              <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">See The Numbers</p>
              <h2 className="mt-3 text-[36px] sm:text-[48px] font-bold text-[#0a0a0a] tracking-tight leading-[1.1]">
                What Could Your Website Be Earning?
              </h2>
              <p className="mt-4 text-[#475569] text-[17px] leading-relaxed">
                Move the sliders to see your current revenue versus an AI Revenue Website&trade;.
              </p>
            </div>

            {/* Dark Gradient Main Calculator Panel Container (80:1072) */}
            <div className="mt-12 max-w-[1140px] mx-auto rounded-[28px] bg-gradient-to-br from-[#0b1220] to-[#160f33] p-8 md:p-12 shadow-xl grid gap-10 lg:grid-cols-12 items-start relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00adef]/5 to-[#7c3aed]/5 opacity-40 pointer-events-none" />

              {/* Sliders Control Panel (Left Column) */}
              <div className="lg:col-span-7 space-y-8 relative z-10">
                {/* Slider 1: Website Visitors */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[13.5px] font-semibold text-[#94a3b8]">Monthly Website Visitors</span>
                    <span className="text-[16px] font-bold text-[#7cb3ff]">{visitors.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={visitors}
                    onChange={(e) => setVisitors(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7cb3ff]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                    <span>1,000</span>
                    <span>1,00,000</span>
                  </div>
                </div>

                {/* Slider 2: Current Conversion Rate */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[13.5px] font-semibold text-[#94a3b8]">Current Conversion Rate</span>
                    <span className="text-[16px] font-bold text-[#7cb3ff]">{convRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={convRate}
                    onChange={(e) => setConvRate(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7cb3ff]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                    <span>0.5%</span>
                    <span>10%</span>
                  </div>
                </div>

                {/* Slider 3: Average Deal Value */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[13.5px] font-semibold text-[#94a3b8]">Average Deal Value (₹)</span>
                    <span className="text-[16px] font-bold text-[#7cb3ff]">₹{dealValue.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={dealValue}
                    onChange={(e) => setDealValue(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7cb3ff]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                    <span>₹5,000</span>
                    <span>₹5,00,000</span>
                  </div>
                </div>

                <div className="pt-4 flex gap-3.5 items-start border-t border-white/5">
                  <AlertCircle className="h-5 w-5 text-[#7cb3ff] shrink-0 mt-0.5" />
                  <p className="text-[12.5px] leading-relaxed text-slate-400">
                    Based on a typical <strong className="text-white font-semibold">2.3&times; conversion rate uplift</strong> observed across AI Revenue Website&trade; implementations.
                  </p>
                </div>
              </div>

              {/* Calculations Result Panel (Right Column, node 80:1082) */}
              <div className="lg:col-span-5 rounded-[18px] border border-white/10 bg-white/[0.04] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 h-48 w-48 bg-[#00adef]/5 rounded-full blur-[80px] pointer-events-none" />
                <h3 className="text-[18px] font-bold text-white border-b border-white/10 pb-4 relative z-10">Estimated Revenue</h3>

                <div className="mt-6 space-y-6 relative z-10">
                  <div>
                    <span className="text-[13.5px] text-[#94a3b8] font-normal block">Current Monthly Revenue</span>
                    <span className="text-[19px] font-bold text-white mt-1 block font-mono">{formatINR(currentMonthlyRev)}</span>
                  </div>

                  <div>
                    <span className="text-[13.5px] text-[#94a3b8] font-normal block">AI Revenue Website&trade; Monthly Revenue</span>
                    <span className="text-[19px] font-bold text-white mt-1 block font-mono">{formatINR(aiMonthlyRev)}</span>
                  </div>

                  <div>
                    <span className="text-[13.5px] text-[#94a3b8] font-normal block">Monthly Growth</span>
                    <span className="text-[24px] font-bold text-[#34d399] mt-1 block font-mono">+{formatINR(monthlyGrowth)}</span>
                  </div>

                  <div className="pt-5 border-t border-white/10">
                    <span className="text-[12px] text-[#cbd5e1] font-normal block">Annual Revenue Opportunity</span>
                    <span className="text-[28px] font-bold text-[#6ee7b7] mt-1 block font-mono">{formatINR(annualOpportunity)}</span>
                  </div>
                </div>

                <a
                  href="#contact"
                  className="mt-8 block w-full rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] py-4 text-center text-[14.5px] font-bold text-white transition-all duration-300 shadow-md relative z-10"
                >
                  Claim Your Revenue Increase &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: WhyChoose (80:1133) */}
        <section className="py-20 bg-[#f8fafc] border-b border-slate-200/60">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-[800px] mx-auto mb-14">
              <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">Why Synergy</p>
              <h2 className="mt-3 text-[36px] sm:text-[48px] font-bold text-[#0a0a0a] tracking-tight leading-[1.1]">
                Why Choose Synergy Innovation
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { bold: "14+", label: "Years of enterprise delivery experience" },
                { bold: "AI", label: "Engineers building on real production models" },
                { bold: "Ent.", label: "Developers who build for scale, not just launch" },
                { bold: "Auto", label: "Automation experts across CRM, WhatsApp & ERP" },
                { bold: "Ads", label: "Performance marketing that feeds the AI engine" },
                { bold: "Biz", label: "Business consultants, not just technologists" },
                { bold: "24×7", label: "Dedicated support when you need us" },
                { bold: "LTV", label: "Built for long-term partnership, not one-off projects" }
              ].map((diff, i) => (
                <div key={i} className="rounded-[18px] border border-slate-200 bg-white p-6 hover:border-[#2563eb]/20 hover:shadow-md transition-all duration-300">
                  <span className="block text-[24px] font-bold text-[#2563eb] font-mono">{diff.bold}</span>
                  <span className="mt-2.5 block text-[13.5px] text-[#475569] leading-relaxed">{diff.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 11: Client Stories (80:1185) */}
        <section className="py-20 bg-[#f8fafc] border-b border-slate-200/60">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-[800px] mx-auto mb-14">
              <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">In Their Words</p>
              <h2 className="mt-3 text-[36px] sm:text-[48px] font-bold text-[#0a0a0a] tracking-tight leading-[1.1]">What Business Leaders Say</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  quote: "\"Within eight weeks our website went from a digital brochure to our highest-performing sales channel. The AI chatbot alone pays for the platform.\"",
                  name: "Rohan Vora",
                  role: "CEO, Regional Hospital Chain",
                  initials: "RV"
                },
                {
                  quote: "\"We stopped losing leads to slow follow-up the day this went live. Our sales team now only speaks to buyers who are actually ready.\"",
                  name: "Anjali Mehra",
                  role: "Founder, Vantage Realty Group",
                  initials: "AM"
                },
                {
                  quote: "\"Synergy didn't just redesign our site — they rebuilt how we generate and manage demand. The revenue dashboard is now part of our weekly leadership review.\"",
                  name: "Karan Shah",
                  role: "Marketing Head, Orbit Manufacturing",
                  initials: "KS"
                }
              ].map((test, i) => (
                <div key={i} className="rounded-[18px] border border-slate-200 bg-white p-7 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative">
                  <div>
                    <div className="flex gap-1 text-[#f59e0b]">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="mt-5 text-[14.5px] leading-relaxed text-[#334155] italic">{test.quote}</p>
                  </div>

                  <div className="mt-8 flex items-center gap-3.5">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#2563eb] to-[#7c3aed] text-[13px] font-bold text-white">
                      {test.initials}
                    </div>
                    <div>
                      <span className="block text-[13.5px] font-bold text-[#0a0a0a]">{test.name}</span>
                      <span className="block text-[12px] text-[#64748b] mt-0.5">{test.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 12: FAQ Accordion (80:1238) */}
        <section id="faq" className="py-20 bg-[#f8fafc] border-b border-slate-200/60">
          <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-[600px] mx-auto mb-14">
              <p className="text-[16px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">Questions</p>
              <h2 className="mt-3 text-[36px] sm:text-[48px] font-bold text-[#0a0a0a] tracking-tight leading-[1.1]">Frequently Asked Questions</h2>
            </div>

            <div className="mt-12 space-y-4">
              {faqData.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="rounded-[18px] border border-slate-200 bg-white overflow-hidden transition-all duration-300 shadow-sm">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-[#050910] hover:text-[#2563eb] transition-colors duration-300"
                    >
                      <span className="text-[15.5px]">{faq.q}</span>
                      <ChevronDown className={`h-4.5 w-4.5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#2563eb]" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-[13.5px] leading-relaxed text-[#475569] border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 13: FinalCTA (80:1280) */}
        <section id="contact" className="py-24 relative overflow-hidden bg-gradient-to-br from-[#0b1220] via-[#1b1447] to-[#2a1650]">

          <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 text-center z-10">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4.5 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#7cb3ff]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7cb3ff]">
                Let&apos;s Talk Revenue
              </span>
            </div>

            <h2 className="mt-8 max-w-[850px] mx-auto text-[36px] sm:text-[48px] lg:text-[48px] font-bold leading-[1.1] tracking-tight text-white">
              Ready To Transform Your Website Into A Revenue Machine?
            </h2>

            <p className="mx-auto mt-6 max-w-[650px] text-[#cbd5e1] text-[16.5px] leading-relaxed">
              Book a free AI Website Growth Audit — no obligation, just a clear plan to turn your traffic into revenue.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <ITServicesInquiryTrigger
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#00adef] hover:bg-[#00adef]/90 px-8 py-4 text-[14.5px] font-semibold text-white transition-all duration-300 shadow-[0_4px_20px_rgba(0,173,239,0.3)] hover:-translate-y-0.5"
              >
                Book Free AI Website Growth Audit &rarr;
              </ITServicesInquiryTrigger>

              <ScheduleCallTrigger
                className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/6 hover:bg-white/10 px-8 py-4 text-[14.5px] font-semibold text-white transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5"
              >
                Schedule Strategy Call
              </ScheduleCallTrigger>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      {/* <FooterSection /> */}
    </div>
  );
};
