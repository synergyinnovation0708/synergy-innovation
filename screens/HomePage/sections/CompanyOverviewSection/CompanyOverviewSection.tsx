import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const companyOverviewImage = "/images/Image.png";

const pointers = [
  "Executive Search & Leadership Hiring",
  "Global & Pan-India Recruitment Solutions",
  "Training & Capability Development",
  "Recruitment Process Outsourcing (RPO)",
  "Specialized Talent Hiring Services",
];

export const CompanyOverviewSection = () => {
  return (
    <section className="relative w-full bg-white py-20 md:py-[96px]">
      <div className="mx-auto max-w-[1240px] px-4 md:px-0">
        <div className="flex flex-col items-center">
          <h2 className="text-center text-[34px] font-bold leading-[1.2] text-[#1d223f] md:text-[46px]">
            About Us
          </h2>
          <div className="mt-[12px] h-[6px] w-[100px] rounded-[3px] bg-[#00adef]" />
        </div>

        <div className="mt-[48px] grid grid-cols-1 items-start gap-10 lg:grid-cols-[734px_434.993px] lg:justify-between lg:gap-8">
          <div>
            <h3 className="text-[34px] font-bold leading-[1.2] text-[#1d223f] md:text-[46px]">
              The Synergy Way
            </h3>

            <div className="mt-[32px] max-w-[734.146px] text-[20px] font-normal leading-[1.4] text-[#1d223f]">
              <p>
                For over a decade, Synergy Innovation has been a trusted partner
                at the intersection of talent, leadership, and technology.
              </p>
              <p>
                We specialize in identifying, engaging, and delivering
                high-impact professionals-from senior leadership and C-suite
                roles to critical niche and digital talent.
              </p>
              <p>
                With deep domain expertise and a relationship-driven approach,
                we help organizations build future-ready teams that drive
                sustainable growth.
              </p>
            </div>

            <ul className="mt-[32px] space-y-[2px]">
              {pointers.map((pointer) => (
                <li
                  key={pointer}
                  className="flex items-start gap-3 text-[20px] font-medium leading-[1.4] text-[#1d223f]"
                >
                  <span className="mt-[11px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#00adef]" />
                  <span>{pointer}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="group mt-[46px] inline-flex h-[50px] w-[199px] items-center justify-between rounded-[25px] bg-[#1d223f] pl-[30px] pr-[5px] text-white transition-colors hover:bg-[#15192e]"
            >
              <span className="text-[20px] font-semibold leading-[1.2]">
                Learn More
              </span>
              <span className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white text-[#1d223f]">
                <ArrowUpRight
                  className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45"
                  strokeWidth={2.6}
                />
              </span>
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-[435px] overflow-hidden rounded-[16px] lg:mx-0 lg:h-[517px] lg:w-[434.993px] lg:max-w-none">
            <Image
              src={companyOverviewImage}
              alt="Synergy team"
              fill
              sizes="(max-width: 1023px) 100vw, 435px"
              quality={74}
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
