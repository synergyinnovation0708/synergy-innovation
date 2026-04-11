import Image from "next/image";
import { cn } from "@/lib/utils";

type AppLoaderProps = {
  className?: string;
  fullScreen?: boolean;
  message?: string;
};

export const AppLoader = ({
  className,
  fullScreen = true,
  message = "Loading your application",
}: AppLoaderProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "relative isolate overflow-hidden bg-[linear-gradient(180deg,#edf7ff_0%,#ffffff_52%,#f7f8fc_100%)]",
        fullScreen
          ? "flex min-h-screen items-center justify-center px-4 py-10"
          : "flex min-h-[360px] items-center justify-center rounded-[32px] px-4 py-10",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at top left, rgba(0,173,239,0.16), transparent 24%), radial-gradient(circle at bottom right, rgba(29,34,63,0.12), transparent 28%)",
        }}
      />
      <div className="pointer-events-none absolute left-[8%] top-[14%] h-28 w-28 rounded-full bg-[#00adef]/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[16%] right-[10%] h-36 w-36 rounded-full bg-[#1d223f]/8 blur-3xl" />

      <div className="relative flex w-full max-w-[520px] flex-col items-center rounded-[36px] border border-[#dce6f4] bg-white/88 px-8 py-10 text-center shadow-[0_30px_90px_rgba(29,34,63,0.14)] backdrop-blur-md">
        <span className="rounded-full border border-[#cdefff] bg-[#eef9ff] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00adef]">
          Synergy Innovation
        </span>

        <div className="relative mt-8 flex h-[124px] w-[124px] items-center justify-center">
          <div className="synergy-loader-orbit absolute inset-[10px] rounded-[34px] border border-[#00adef]/30" />
          <div className="synergy-loader-orbit-delay absolute inset-0 rounded-[40px] border border-[#1d223f]/12" />
          <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-[28px] bg-white shadow-[0_18px_45px_rgba(29,34,63,0.12)] ring-1 ring-[#e8eef6]">
            <Image
              src="/images/logo1 3.png"
              alt="Synergy Innovation"
              width={150}
              height={44}
              className="h-auto w-[62px] object-contain"
              priority
            />
          </div>
        </div>

        <h2 className="mt-8 text-[28px] font-bold leading-[1.12] text-[#1d223f] sm:text-[34px]">
          {message}
        </h2>
        <p className="mt-3 max-w-[380px] text-[15px] leading-[1.7] text-[#68748f] sm:text-[16px]">
          Please wait while we prepare the next screen for you.
        </p>

        <div className="mt-8 flex items-center gap-3" aria-hidden>
          <span className="synergy-loader-dot h-3 w-3 rounded-full bg-[#1d223f]" />
          <span
            className="synergy-loader-dot h-3 w-3 rounded-full bg-[#00adef]"
            style={{ animationDelay: "0.15s" }}
          />
          <span
            className="synergy-loader-dot h-3 w-3 rounded-full bg-[#7ccff5]"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      </div>
    </div>
  );
};
