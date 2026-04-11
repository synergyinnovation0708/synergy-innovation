import type { ReactNode } from "react";

type Testimonial = {
  name: string;
  position: string;
  content: ReactNode;
  contentWidthClass: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Raghu Radhakrishnan",
    position: "CEO & MD TmaxSoft India",
    contentWidthClass: "w-[252px]",
    content: (
      <>
        <span className="font-light">Synergy Innovation </span>
        <span className="font-medium">in-depth understanding of the industry </span>
        <span className="font-light">
          is definitely a big advantage.
          <br />
          Sharp and fast candidate search.
        </span>
      </>
    ),
  },
  {
    name: "Navreuban Sandhu",
    position: "AVP- HR Kotak Mahindra Bank",
    contentWidthClass: "w-[252px]",
    content:
      "Overall, I am very happy and satisfied with Synergy Innovation recruitment, understanding of requirement and quality of profile shared.",
  },
  {
    name: "Neha Tikko",
    position: "HR Lead BirlaSoft India",
    contentWidthClass: "w-[189px]",
    content:
      "Synergy has been showing good number of churn outs in the short span of time.",
  },
  {
    name: "Mohit Marwah",
    position: "Talent Acquisition Head Apollo Munich",
    contentWidthClass: "w-[258px]",
    content:
      "I am particularly impressed by team Synergy, not swamping me with CVs but only forwarding those of people who were likely to be a good fit.",
  },
];

export const ClientTestimonialsSection = () => {
  return (
    <section className="relative w-full py-20 md:py-[96px]">
      <div className="absolute left-1/2 top-[178px] h-[400px] w-full max-w-[1440px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(0,173,239,0)_0%,rgba(0,173,239,0.04)_51%,rgba(0,173,239,0)_100%)]" />

      <div className="relative mx-auto flex w-full max-w-[1240px] flex-col items-center px-4 text-center md:px-0">
        <h2 className="text-[30px] leading-[1.2] font-medium text-[#1d223f] md:text-[32px]">
          Testimonials
        </h2>
        <p className="mt-[13px] max-w-[889px] text-[34px] leading-[1.2] font-bold text-[#1d223f] md:text-[46px]">
          Rated <span className="text-[#00adef]">4.8 &#9733;</span> by 100+
          clients worldwide.
        </p>
        <div className="mt-[24px] h-[6px] w-[200px] rounded-[3px] bg-[#00adef]" />
      </div>

      <div className="relative mx-auto mt-[73px] max-w-[1240px] px-4 lg:px-0">
        <div className="grid grid-cols-1 justify-center gap-5 md:grid-cols-2 xl:grid-cols-[repeat(4,295px)] xl:gap-5">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="relative h-[295px] w-full xl:w-[295px]">
              <div className="relative h-full rounded-[8px] bg-white shadow-[0_0_58px_rgba(0,173,239,0.14)]">
                <span className="pointer-events-none absolute left-[14px] top-[-6px] text-[168px] leading-[0.74] font-semibold text-[#00adef]">
                  &ldquo;
                </span>

                <p
                  className={`absolute left-[25px] top-[60px] text-[18px] leading-[1.2] font-light text-[#1d223f] ${testimonial.contentWidthClass}`}
                >
                  {testimonial.content}
                </p>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/Group 1000004947.svg"
                  alt="5 star rating"
                  className="absolute left-[25px] top-[191px] h-[23.355px] w-[114.746px]"
                />

                <div className="absolute left-[25px] top-[241px] leading-[1.1]">
                  <p className="text-[16.349px] leading-[1.1] font-semibold text-black">
                    {testimonial.name}
                  </p>
                  <p className="mt-[6px] text-[12.456px] leading-[1.1] font-normal text-[#545454]">
                    {testimonial.position}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
