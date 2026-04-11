import { AnimatedCounter } from "@/components/AnimatedCounter";

const impactWavePattern = "/images/homepage-wave.svg";

const statisticsData = [
  { value: 10, suffix: "k+", label: "Onboard Candidates" },
  { value: 30, suffix: "+", label: "Employees" },
  { value: 40, suffix: "+", label: "Global Clients" },
  { value: 14, suffix: "+", label: "Years of Experience" },
];

export const ImpactStatisticsSection = () => {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-[104px] h-[360px]" aria-hidden>
        <div className="absolute inset-x-0 top-1/2 h-[280px] -translate-y-1/2 bg-[linear-gradient(180deg,rgba(0,173,239,0)_0%,rgba(0,173,239,0.09)_49%,rgba(0,173,239,0)_100%)]" />
        <div className="absolute left-1/2 top-1/2 h-[240px] w-[min(1120px,82vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,173,239,0.12)_0%,rgba(0,173,239,0.05)_42%,rgba(0,173,239,0)_74%)] blur-[8px]" />
        <div
          className="absolute -left-[210px] bottom-[-28px] hidden h-[360px] w-[520px] opacity-[0.16] lg:block"
          style={{
            backgroundImage: `url(${impactWavePattern})`,
            backgroundPosition: "left bottom",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
          }}
        />
        <div
          className="absolute -right-[210px] bottom-[-48px] hidden h-[360px] w-[520px] scale-x-[-1] opacity-[0.16] lg:block"
          style={{
            backgroundImage: `url(${impactWavePattern})`,
            backgroundPosition: "right bottom",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-0">
        <div className="flex flex-col items-center">
          <h2 className="text-center text-[34px] font-bold leading-[1.2] text-[#1d223f] md:text-[46px]">
            Creating Impact
          </h2>
          <div className="mt-[24px] h-[6px] w-[200px] rounded-[3px] bg-[#00adef]" />
        </div>

        {/* <div className="mt-[6px] min-h-[300px] bg-[linear-gradient(180deg,rgba(0,173,239,0)_0%,rgba(0,173,239,0.12)_51.442%,rgba(0,173,239,0)_100%)]">
          <div className="mx-auto mt-[50px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.98)_18%,#ffffff_50%,rgba(255,255,255,0.98)_82%,rgba(255,255,255,0)_100%)] px-2 py-6 md:px-0 md:py-0">
            <div className="mx-auto grid w-full max-w-[1180px] grid-cols-2 gap-y-8 md:min-h-[200px] md:grid-cols-4">
              {statisticsData.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center justify-center text-center ${
                    index < statisticsData.length - 1
                      ? "md:relative md:after:absolute md:after:right-0 md:after:top-1/2 md:after:h-[102px] md:after:w-px md:after:-translate-y-1/2 md:after:bg-black/20 md:after:content-['']"
                      : ""
                  } px-2 sm:px-4 md:px-8 lg:px-10`}
                >
                  <div className="w-full max-w-none md:max-w-[220px]">
                    <AnimatedCounter
                      className="text-[56px] font-extrabold leading-[1.2] text-[#00adef] md:text-[72px]"
                      suffix={stat.suffix}
                      value={stat.value}
                    />
                    <p className="mt-2 whitespace-nowrap text-[16px] font-normal leading-[1.2] text-[#1d223f] sm:text-[18px] md:text-[24px]">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

         <div className="mt-[14px] w-full bg-[linear-gradient(180deg,rgba(0,173,239,0)_0%,rgba(0,173,239,0.06)_52%,rgba(0,173,239,0)_100%)] py-[50px]">
                    <div className="mx-auto flex max-w-[1320px] flex-col gap-7 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,#fff_20%,#fff_80%,rgba(255,255,255,0)_100%)] px-4 py-[42px] sm:px-6 md:flex-row md:justify-between lg:px-12 xl:px-16">
                      {statisticsData.map((stat, index) => (
                        <div key={stat.label} className="contents">
                          <div className="text-center">
                            <AnimatedCounter
                              className="text-[58px] font-extrabold leading-[1.2] text-[#00adef] md:text-[72px]"
                              suffix={stat.suffix}
                              value={stat.value}
                            />
                            <p className="text-[24px] leading-[1.2] text-[#1d223f]">{stat.label}</p>
                          </div>
                          {index < statisticsData.length - 1 ? (
                            <div className="hidden w-px bg-black/20 md:block" />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
      </div>
    </section>
  );
};
