import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  LockKeyhole,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { loginAdmin } from "@/app/admin/login/actions";
import { AdminLoginSubmitButton } from "./AdminLoginSubmitButton";

const adminHighlights = [
  {
    icon: ShieldCheck,
    title: "Protected Entry",
    description: "Reserved for authorized internal administrators only.",
  },
  {
    icon: BadgeCheck,
    title: "Central Control",
    description: "Access hiring, platform, and account management tools.",
  },
  {
    icon: LockKeyhole,
    title: "Secure Ready",
    description: "Prepared for credential validation and session controls.",
  },
];

const inputClassName =
  "mt-2 h-[56px] w-full rounded-[20px] border border-[#dbe3f1] bg-[#f8fbff] px-4 text-[16px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8b96b3] focus:border-[#00adef] focus:bg-white";

type AdminLoginPageProps = {
  emailHint?: string;
  errorMessage?: string;
  isSupabaseConfigured: boolean;
};

export const AdminLoginPage = ({
  emailHint,
  errorMessage,
  isSupabaseConfigured,
}: AdminLoginPageProps) => {
  const loginDisabled = !isSupabaseConfigured;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#edf7ff_0%,#ffffff_50%,#f7f8fc_100%)]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at top left, rgba(0,173,239,0.18), transparent 26%), radial-gradient(circle at bottom right, rgba(29,34,63,0.12), transparent 30%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] items-center justify-center px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="w-full max-w-[640px] gap-8 lg:grid lg:max-w-none lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden overflow-hidden rounded-[36px] bg-[#1d223f] px-6 py-8 text-white shadow-[0_32px_90px_rgba(29,34,63,0.24)] sm:px-10 sm:py-12 lg:block">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 42%), radial-gradient(circle at bottom left, rgba(0,173,239,0.35), transparent 35%)",
              }}
            />

            <div className="relative">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-white/14"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Website
              </Link>

              <div className="mt-8">
                <Image
                  src="/images/logo1 3.png"
                  alt="Synergy Innovation"
                  width={190}
                  height={56}
                  className="h-[52px] w-auto object-contain brightness-0 invert"
                  priority
                />
              </div>

              <div className="mt-12 max-w-[560px]">
                <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#a6e4ff]">
                  Admin Access
                </p>
                <h1 className="mt-5 text-[40px] font-bold leading-[1.05] sm:text-[54px]">
                  Login to the
                  <br />
                  control center
                </h1>
                <p className="mt-5 max-w-[520px] text-[18px] leading-[1.7] text-white/78 sm:text-[20px]">
                  Manage internal operations, platform activity, and hiring workflows
                  from one secure admin entry point.
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {adminHighlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="rounded-[24px] border border-white/12 bg-white/8 p-5 backdrop-blur-sm"
                    >
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 text-[#86ddff]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h2 className="mt-4 text-[18px] font-semibold leading-[1.2]">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-[14px] leading-[1.6] text-white/72">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>

              <div className="mt-10 rounded-[28px] border border-white/12 bg-white/6 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-[#86ddff]">
                    <UserCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[18px] font-semibold leading-[1.2]">
                      Internal sign-in experience
                    </p>
                    <p className="mt-2 max-w-[480px] text-[15px] leading-[1.7] text-white/72">
                      Admin access now runs through Supabase email and password
                      authentication with a protected dashboard session.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center">
            <div className="w-full rounded-[36px] border border-[#dce6f4] bg-white p-6 shadow-[0_30px_80px_rgba(29,34,63,0.12)] sm:p-8 lg:p-10">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eaf8ff] text-[#00adef]">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div className="mt-6">
                <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-[#00adef]">
                  Welcome Back
                </p>
                <h2 className="mt-3 text-[34px] font-bold leading-[1.1] text-[#1d223f] sm:text-[40px]">
                  Admin Login
                </h2>
                <p className="mt-3 text-[16px] leading-[1.7] text-[#67728f]">
                  Enter your admin credentials to continue to the dashboard.
                </p>
              </div>

              {errorMessage ? (
                <div className="mt-8 rounded-[22px] border border-[#ffd8d8] bg-[#fff5f5] px-4 py-3 text-[14px] font-medium text-[#b53c3c]">
                  {errorMessage}
                </div>
              ) : null}

              <form action={loginAdmin} className="mt-10 space-y-6">
                <div>
                  <label
                    htmlFor="admin-email"
                    className="text-[15px] font-semibold text-[#1d223f]"
                  >
                    Admin Email or ID
                  </label>
                  <input
                    id="admin-email"
                    name="email"
                    type="text"
                    autoComplete="username"
                    placeholder={emailHint}
                    className={inputClassName}
                    defaultValue={emailHint}
                    disabled={loginDisabled}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="text-[15px] font-semibold text-[#1d223f]"
                  >
                    Password
                  </label>
                  <input
                    id="admin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={inputClassName}
                    disabled={loginDisabled}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 text-[14px] sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex items-center gap-2 text-[#55627f]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border border-[#bcc8dd] accent-[#1d223f]"
                    />
                    Remember this device
                  </label>
                  <Link
                    href="/admin/forgot-password"
                    className="font-semibold text-[#00adef] transition-colors duration-200 hover:text-[#008fc7]"
                  >
                    Forgot password?
                  </Link>
                </div>

                <AdminLoginSubmitButton disabled={loginDisabled} />
              </form>

              <div className="mt-8 rounded-[28px] bg-[#f5f9ff] p-5">
                <p className="text-[15px] font-semibold text-[#1d223f]">
                  Admin access note
                </p>
                <p className="mt-2 text-[14px] leading-[1.7] text-[#67728f]">
                  {isSupabaseConfigured
                    ? "Only users with the seeded admin role can pass through to the dashboard."
                    : "Add your Supabase URL, publishable key, service role key, and admin seed credentials before signing in."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
