"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

const menuItems = [
  { label: "Home", href: "/#page-top" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/#recruitment-solutions" },
  { label: "IT Services", href: "/it-services" },
  { label: "Jobs", href: "/jobs" },
  { label: "Industries", href: "/#recruitment-practice-areas" },
  { label: "Contact Us", href: "#" },
];

const serviceItems = [
  { label: "Executive Search", href: "/#recruitment-solutions" },
  { label: "Global Recruitment", href: "/#recruitment-solutions" },
  { label: "Training & Development", href: "/#recruitment-solutions" },
  { label: "Recruitment Process Outsourcing", href: "/#recruitment-solutions" },
  { label: "Talent Hiring", href: "/#recruitment-solutions" },
];

const HexIcon = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`relative flex h-[60px] w-[60px] items-center justify-center ${className}`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/icons/Polygon 3-1.svg"
      alt=""
      className="absolute inset-0 h-full w-full object-contain"
    />
    <div className="relative z-10 text-white">{children}</div>
  </div>
);

export const FooterSection = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const handleHashNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (pathname !== "/" || !href.startsWith("/#")) {
      return;
    }

    const targetId = href.slice(2);

    if (!targetId) {
      return;
    }

    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
      return;
    }

    event.preventDefault();
    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
  };

  return (
    <footer className="w-full bg-[#1d223f] py-12">
      <div className="mx-auto w-full max-w-[1240px] px-4 md:px-0">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-[295px_84px_191px_335px] xl:justify-between">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo1-white 1.png"
              alt="Synergy Innovation"
              className="h-[55px] w-[190px] object-contain"
            />
            <p className="mt-9 text-[16px] leading-[1.35] text-white/60">
              Synergy Innovation was set up with a vision to provide result
              oriented HR Solutions. The Company focus areas are on providing
              Executive Search, Recruitment &amp; Staffing to our client.
            </p>

            <div className="mt-10 flex items-center gap-2">
              <a
                href="https://www.facebook.com/brandsynergyinnovation"
                aria-label="Facebook"
                className="transition-opacity hover:opacity-80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/Facebook.svg" alt="" className="h-[60px] w-[60px]" />
              </a>
              <a
                href="https://www.instagram.com/brandsynergyinnovation/"
                aria-label="Instagram"
                className="transition-opacity hover:opacity-80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/Instagram.svg" alt="" className="h-[60px] w-[60px]" />
              </a>
              <a
                href="https://www.linkedin.com/company/synergy-innovation-hr-consulting-firm/?viewAsMember=true"
                aria-label="LinkedIn"
                className="transition-opacity hover:opacity-80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/LinkedIn.svg" alt="" className="h-[60px] w-[60px]" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[20px] leading-[1.35] font-bold text-white">Menu</h3>
            <div className="mt-3 h-[2px] w-[30px] bg-[#00adef]" />
            <ul className="mt-4 space-y-2.5">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={(event) => handleHashNavigation(event, item.href)}
                    className="text-[16px] leading-[1.35] text-white hover:text-[#00adef]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[20px] leading-[1.35] font-bold text-white">
              Services
            </h3>
            <div className="mt-3 h-[2px] w-[30px] bg-[#00adef]" />
            <ul className="mt-4 space-y-2.5">
              {serviceItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={(event) => handleHashNavigation(event, item.href)}
                    className="text-[16px] leading-[1.35] text-white hover:text-[#00adef]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[20px] leading-[1.35] font-bold text-white">
              Contact Us
            </h3>
            <div className="mt-3 h-[2px] w-[30px] bg-[#00adef]" />

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-4">
                <HexIcon className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/Group 1000004980.svg" alt="" className="h-[26px] w-[22px]" />
                </HexIcon>
                <p className="pt-2 text-[16px] leading-[1.35] text-white">
                  Tower C, Level 5, Green Boulevard,
                  <br />
                  Sector 62, Noida 201309
                </p>
              </div>

              <div className="flex items-start gap-4">
                <HexIcon className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/Vector.svg" alt="" className="h-[22px] w-[22px]" />
                </HexIcon>
                <div className="pt-2 text-[16px] leading-[1.35] text-white">
                  <p>+91 92124 31747</p>
                  <p>+91 120 516 2962</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <HexIcon className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/Group 1000005001.svg" alt="" className="h-[18px] w-[22px]" />
                </HexIcon>
                <p className="text-[16px] leading-[1.35] text-white">
                  info@synergyinnovation.org
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/20 pt-4">
          <p className="text-center text-[16px] leading-[1.4] tracking-[0.16px] text-white/60">
            Copyright &copy; {currentYear} Synergy Innovation. All rights reserved. | Terms
            of use | Privacy Policy
          </p>
        </div>
      </div>
    </footer>
  );
};
