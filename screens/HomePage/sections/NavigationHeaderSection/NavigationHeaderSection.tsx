"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { type User } from "@supabase/supabase-js";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  LoaderCircle,
  LogIn,
  LogOut,
  ShieldCheck,
  UserCircle2,
  UserPlus,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ADMIN_ROLE } from "@/lib/admin-auth-shared";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { cn } from "@/lib/utils";
import type { ApplyFormTab } from "./ApplyFormModal";

const ApplyFormModal = dynamic(
  () =>
    import("./ApplyFormModal").then((module) => ({
      default: module.ApplyFormModal,
    })),
  {
    ssr: false,
  },
);

const primaryNavItems = [
  { label: "Home", href: "/" },
  { label: "The Synergy Way", href: "/about" },
];

const expertiseItems = [
  { activeKey: "it-services", href: "/it-services", label: "IT Services" },
  { activeKey: "our-expertise", href: "/#our-expertise", label: "Executive Search" },
  { activeKey: "permanent-hiring", href: "/#permanent-hiring", label: "Permanent Hiring" },
  {
    activeKey: "contract-to-hire",
    href: "/#contract-to-hire",
    label: "Contract-to-Hire (C2H)",
  },
  { activeKey: "global-hiring-support", href: "/#global-hiring-support", label: "Global Hiring Support" },
] as const;

const secondaryNavItems: Array<{ href: string; label: string }> = [];
const MENU_HIGHLIGHT_RESET_DELAY_MS = 2500;

const navLinkClassName =
  "inline-flex items-center whitespace-nowrap text-[15px] font-medium leading-[18px] text-[#1d223f] transition-colors duration-200 hover:text-[#00adef]";
const accountMenuItemClassName =
  "flex w-full cursor-pointer items-start gap-3 rounded-[18px] px-4 py-3 text-left transition-colors duration-200 hover:bg-[#f5f9ff]";

type HeaderViewer =
  | {
      role: "admin";
      avatarLabel: string;
      email: string;
      name: string;
    }
  | {
      role: "candidate";
      avatarLabel: string;
      email: string;
      name: string;
    }
  | {
      role: "guest";
    }
  | {
      role: "loading";
    };

type ApplySelectorButtonProps = {
  icon: React.ComponentType<{ className?: string }>;
  isPrimary?: boolean;
  label: string;
  onClick: () => void;
};

const ApplySelectorButton = ({
  icon: Icon,
  isPrimary = false,
  label,
  onClick,
}: ApplySelectorButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-full flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 text-[12px] font-semibold uppercase tracking-[0.02em] transition-all duration-200 sm:px-4 sm:text-[13px] ${
        isPrimary
          ? "bg-white text-[#1d223f] shadow-[0_10px_22px_rgba(29,34,63,0.16)]"
          : "text-white hover:bg-white/10"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
};

const getUserDisplayName = (user: User, fallbackName: string) => {
  if (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()) {
    return user.user_metadata.full_name.trim();
  }

  if (typeof user.user_metadata?.name === "string" && user.user_metadata.name.trim()) {
    return user.user_metadata.name.trim();
  }

  if (user.email?.trim()) {
    return user.email.split("@")[0] ?? fallbackName;
  }

  return fallbackName;
};

const getAvatarLabel = (value: string) => {
  const words = value
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0]?.charAt(0) ?? ""}${words[1]?.charAt(0) ?? ""}`.toUpperCase();
  }

  return value.slice(0, 2).toUpperCase();
};

const toHeaderViewer = (user: User | null | undefined): HeaderViewer => {
  if (!user) {
    return { role: "guest" };
  }

  const isAdmin = user.app_metadata?.role === ADMIN_ROLE;
  const fallbackName = isAdmin ? "Admin" : "Candidate";
  const name = getUserDisplayName(user, fallbackName);

  return {
    role: isAdmin ? "admin" : "candidate",
    avatarLabel: getAvatarLabel(name || fallbackName),
    email: user.email?.trim() ?? "",
    name,
  };
};

const AccountMenuLink = ({
  description,
  href,
  icon: Icon,
  label,
  onClick,
}: {
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) => {
  return (
    <Link href={href} onClick={onClick} className={accountMenuItemClassName}>
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eef7ff] text-[#00adef]">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-[#1d223f]">{label}</span>
        <span className="mt-1 block text-[12px] leading-[1.5] text-[#7a859f]">{description}</span>
      </span>
    </Link>
  );
};

const AccountMenuSignOutButton = ({
  description,
  isSubmitting,
  label,
  onClick,
}: {
  description: string;
  isSubmitting: boolean;
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isSubmitting}
      className={`${accountMenuItemClassName} ${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff4f4] text-[#c05a5a]">
        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-[#1d223f]">
          {isSubmitting ? "Signing out..." : label}
        </span>
        <span className="mt-1 block text-[12px] leading-[1.5] text-[#7a859f]">{description}</span>
      </span>
    </button>
  );
};

export const NavigationHeaderSection = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeApplyTab, setActiveApplyTab] = useState<ApplyFormTab>("employer");
  const [activeHash, setActiveHash] = useState("");
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);
  const [authViewer, setAuthViewer] = useState<HeaderViewer>({ role: "loading" });
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isExpertiseMenuSuppressed, setIsExpertiseMenuSuppressed] = useState(false);
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);
  const [isMobileExpertiseOpen, setIsMobileExpertiseOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  const openApplyModal = (tab: ApplyFormTab = "employer") => {
    setActiveApplyTab(tab);
    setIsAccountMenuOpen(false);
    setIsApplyModalOpen(true);
    mobileMenuRef.current?.removeAttribute("open");
  };

  useEffect(() => {
    const syncActiveHash = () => {
      setActiveHash(window.location.hash.replace(/^#/, ""));
    };

    syncActiveHash();
    window.addEventListener("hashchange", syncActiveHash);

    return () => {
      window.removeEventListener("hashchange", syncActiveHash);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/" || !activeHash) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setActiveHash((currentHash) => (currentHash === activeHash ? "" : currentHash));
    }, MENU_HIGHLIGHT_RESET_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeHash, pathname]);

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      setAuthViewer({ role: "guest" });
      return;
    }

    const supabase = createSupabaseClient();
    let isMounted = true;

    const syncViewer = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (isMounted) {
          setAuthViewer(toHeaderViewer(user));
        }
      } catch {
        if (isMounted) {
          setAuthViewer({ role: "guest" });
        }
      }
    };

    void syncViewer();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setAuthViewer(toHeaderViewer(session?.user ?? null));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAccountMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileAccountOpen(false);
    setIsMobileExpertiseOpen(false);
    mobileMenuRef.current?.removeAttribute("open");
  };

  const closeAccountMenu = () => {
    setIsAccountMenuOpen(false);
  };

  const handleExpertiseItemSelect = (activeKey: string) => {
    setActiveHash(activeKey);
    setIsExpertiseMenuSuppressed(true);

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

      window.dispatchEvent(
        new CustomEvent("synergy:expertise-nav-select", {
          detail: activeKey,
        }),
      );
    }
  };

  const handleSignOut = async () => {
    if (isSigningOut || authViewer.role === "guest" || authViewer.role === "loading") {
      return;
    }

    setIsSigningOut(true);
    setAuthErrorMessage(null);
    closeAccountMenu();
    closeMobileMenu();

    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setAuthErrorMessage("Unable to sign out right now. Please try again.");
        return;
      }

      const redirectPath = authViewer.role === "admin" ? "/admin/login" : "/candidate/login";

      setAuthViewer({ role: "guest" });
      router.replace(redirectPath);
      router.refresh();
    } catch {
      setAuthErrorMessage("Unable to sign out right now. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const accountLabel =
    authViewer.role === "candidate" || authViewer.role === "admin" ? authViewer.name : "Login as";
  const accountSubLabel =
    authViewer.role === "candidate"
      ? "Candidate Account"
      : authViewer.role === "admin"
        ? "Admin Account"
        : authViewer.role === "loading"
          ? "Checking session"
          : "Sign in / Sign up";
  const accountAvatarContent =
    authViewer.role === "candidate" || authViewer.role === "admin" ? (
      <span className="text-[13px] font-bold uppercase">{authViewer.avatarLabel}</span>
    ) : (
      <UserCircle2 className="h-5 w-5" />
    );
  const isExpertiseItemActive = (item: (typeof expertiseItems)[number]) => {
    if (item.activeKey === "it-services") {
      return pathname === "/it-services";
    }

    return pathname === "/" && activeHash === item.activeKey;
  };
  const isExpertiseMenuActive = expertiseItems.some(isExpertiseItemActive);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[90] w-full border-b border-[#e9edf3] bg-white/95 shadow-[0_10px_30px_rgba(29,34,63,0.06)] backdrop-blur-md">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[59px]">
          <div className="flex h-[78px] items-center justify-between md:h-[90px]">
            <Link href="/" className="shrink-0">
              <Image
                src="/images/logo1 3.png"
                alt="Synergy Innovation Logo"
                width={190}
                height={56}
                className="h-[40px] w-[136px] object-contain sm:h-[50px] sm:w-[170px] lg:h-[56px] lg:w-[190px]"
                priority
              />
            </Link>

            <nav className="hidden flex-1 items-center justify-center lg:flex">
              <ul className="flex items-center gap-8">
                {primaryNavItems.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={navLinkClassName}>
                      {item.label}
                    </Link>
                  </li>
                ))}

                <li
                  className="group relative"
                  onMouseLeave={() => setIsExpertiseMenuSuppressed(false)}
                >
                  <button
                    type="button"
                    className={cn(navLinkClassName, "cursor-pointer", isExpertiseMenuActive ? "text-[#00adef]" : "")}
                  >
                    <span>Our Expertise</span>
                    <Image
                      src="/icons/angle-small-down 1.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="ml-1 h-5 w-5"
                    />
                  </button>

                  <div
                    className={cn(
                      "absolute left-0 top-full z-40 mt-[18px] w-[265px] rounded-[16px] border border-[#e9edf3] bg-white p-2 shadow-[0_18px_48px_rgba(29,34,63,0.12)] transition-all duration-200",
                      isExpertiseMenuSuppressed
                        ? "invisible pointer-events-none opacity-0"
                        : "invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
                    )}
                  >
                    <ul className="space-y-1">
                      {expertiseItems.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => handleExpertiseItemSelect(item.activeKey)}
                            className={cn(
                              "block rounded-xl px-4 py-2.5 text-[14px] font-medium transition-colors duration-200",
                              isExpertiseItemActive(item)
                                ? "bg-[#f4f8ff] text-[#00adef]"
                                : "text-[#1d223f] hover:bg-[#f4f8ff] hover:text-[#00adef]",
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                {secondaryNavItems.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={navLinkClassName}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              <div className="inline-flex h-[50px] w-[286px] items-center rounded-full bg-[#1d223f] p-1 shadow-[0_16px_34px_rgba(29,34,63,0.12)]">
                <ApplySelectorButton
                  icon={BriefcaseBusiness}
                  isPrimary
                  label="Employer"
                  onClick={() => openApplyModal("employer")}
                />
                <ApplySelectorButton
                  icon={Users}
                  label="Job Seeker"
                  onClick={() => openApplyModal("jobSeeker")}
                />
              </div>
              <Link
                href="/it-services"
                className="group inline-flex h-[50px] min-w-fit items-center gap-3 rounded-[25px] bg-[#1d223f] pl-5 pr-1.5 text-white shadow-[0_16px_34px_rgba(29,34,63,0.12)] transition-transform duration-300 hover:-translate-y-0.5"
                aria-label="AI Driven IT Services"
              >
                <span className="whitespace-nowrap text-[15px] font-semibold leading-[1.2] text-white">
                  AI Driven IT Services
                </span>
                {/* <Image
                  src="/icons/Group.svg"
                  alt=""
                  width={42}
                  height={42}
                  className="h-[42px] w-[42px] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45"
                /> */}
                <div className="rounded-full bg-white p-2 text-[#1d223f]">
                <ArrowUpRight
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45"
                  strokeWidth={2.5}
                />
              </div>
              </Link>
              <div ref={accountMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setAuthErrorMessage(null);
                    setIsAccountMenuOpen((currentState) => !currentState);
                  }}
                  className="inline-flex h-[50px] items-center gap-3 rounded-full border border-[#dbe5f1] bg-white px-3 py-1.5 pr-4 text-left shadow-[0_14px_32px_rgba(29,34,63,0.08)] transition-colors duration-200 hover:border-[#cdd9ea]"
                  aria-expanded={isAccountMenuOpen}
                  aria-haspopup="menu"
                >
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      authViewer.role === "candidate" || authViewer.role === "admin"
                        ? "bg-[#1d223f] text-white"
                        : "bg-[#eef7ff] text-[#00adef]"
                    }`}
                  >
                    {accountAvatarContent}
                  </span>
                  {/* <span className="min-w-0">
                    <span className="block max-w-[140px] truncate text-[13px] font-semibold leading-[1.2] text-[#1d223f]">
                      {accountLabel}
                    </span>
                    <span className="mt-1 block text-[11px] font-medium leading-[1.2] text-[#7a859f]">
                      {accountSubLabel}
                    </span>
                  </span> */}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#7a859f] transition-transform duration-200 ${
                      isAccountMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isAccountMenuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+12px)] z-50 w-[280px] rounded-[24px] border border-[#e3ebf6] bg-white p-3 shadow-[0_24px_60px_rgba(29,34,63,0.14)]"
                  >
                    {authViewer.role === "loading" ? (
                      <div className="flex items-center gap-3 rounded-[18px] bg-[#f7faff] px-4 py-4 text-[14px] font-medium text-[#52627d]">
                        <LoaderCircle className="h-4 w-4 animate-spin text-[#00adef]" />
                        Checking your session...
                      </div>
                    ) : null}

                    {authViewer.role === "guest" ? (
                      <>
                        <div className="rounded-[20px] bg-[#f7faff] px-4 py-4">
                          <p className="text-[14px] font-semibold text-[#1d223f]">Login as</p>
                          <p className="mt-1 text-[12px] leading-[1.5] text-[#7a859f]">
                            Choose candidate access or jump directly to admin login.
                          </p>
                        </div>
                        <div className="mt-3 space-y-1.5">
                          <AccountMenuLink
                            description="Sign in to access your saved candidate profile."
                            href="/candidate/login"
                            icon={LogIn}
                            label="Candidate Sign In"
                            onClick={closeAccountMenu}
                          />
                          <AccountMenuLink
                            description="Create your candidate profile and start applying faster."
                            href="/registration/create-account"
                            icon={UserPlus}
                            label="Candidate Sign Up"
                            onClick={closeAccountMenu}
                          />
                          <AccountMenuLink
                            description="Use your internal credentials to open the admin dashboard."
                            href="/admin/login"
                            icon={ShieldCheck}
                            label="Admin Login"
                            onClick={closeAccountMenu}
                          />
                        </div>
                      </>
                    ) : null}

                    {authViewer.role === "candidate" || authViewer.role === "admin" ? (
                      <>
                        <div className="rounded-[20px] bg-[#f7faff] px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1d223f] text-[14px] font-bold uppercase text-white">
                              {authViewer.avatarLabel}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-[14px] font-semibold text-[#1d223f]">{authViewer.name}</p>
                              <p className="mt-1 truncate text-[12px] text-[#7a859f]">{authViewer.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1.5">
                          {authViewer.role === "candidate" ? (
                            <AccountMenuLink
                              description="Open your candidate profile and resume details."
                              href="/candidate/profile"
                              icon={UserCircle2}
                              label="Profile"
                              onClick={closeAccountMenu}
                            />
                          ) : (
                            <AccountMenuLink
                              description="Go straight to the secured admin dashboard."
                              href="/admin/dashboard"
                              icon={ShieldCheck}
                              label="Admin Dashboard"
                              onClick={closeAccountMenu}
                            />
                          )}
                          <AccountMenuSignOutButton
                            description={
                              authViewer.role === "admin"
                                ? "End the current admin session safely."
                                : "Sign out from your candidate account."
                            }
                            isSubmitting={isSigningOut}
                            label="Logout"
                            onClick={handleSignOut}
                          />
                        </div>
                      </>
                    ) : null}

                    {authErrorMessage ? (
                      <p className="mt-3 rounded-[16px] border border-[#ffd8d8] bg-[#fff5f5] px-4 py-3 text-[12px] font-medium text-[#b53c3c]">
                        {authErrorMessage}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            <details
              ref={mobileMenuRef}
              className="relative lg:hidden"
              onToggle={(event) => {
                if (!(event.currentTarget as HTMLDetailsElement).open) {
                  setIsMobileAccountOpen(false);
                  setIsMobileExpertiseOpen(false);
                }
              }}
            >
              <summary className="list-none cursor-pointer rounded-full border border-[#1d223f]/20 px-4 py-2 text-[14px] font-semibold text-[#1d223f] [&::-webkit-details-marker]:hidden">
                Menu
              </summary>
              <div className="absolute right-0 z-50 mt-2 w-[270px] rounded-[16px] border border-[#e9edf3] bg-white p-3 shadow-[0_18px_48px_rgba(29,34,63,0.12)]">
                <ul className="space-y-1">
                  {primaryNavItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="block rounded-xl px-3 py-2 text-[14px] font-medium text-[#1d223f] hover:bg-[#f4f8ff] hover:text-[#00adef]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={() => setIsMobileExpertiseOpen((currentState) => !currentState)}
                      className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-[14px] font-medium text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8ff] hover:text-[#00adef]"
                    >
                      <span>Our Expertise</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          isMobileExpertiseOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isMobileExpertiseOpen ? (
                      <div className="mt-1 space-y-1 pl-3">
                        {expertiseItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => {
                              handleExpertiseItemSelect(item.activeKey);
                              closeMobileMenu();
                            }}
                            className={cn(
                              "block rounded-xl px-3 py-2 text-[13px] font-medium transition-colors duration-200",
                              isExpertiseItemActive(item)
                                ? "bg-[#f4f8ff] text-[#00adef]"
                                : "text-[#52627d] hover:bg-[#f4f8ff] hover:text-[#00adef]",
                            )}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </li>
                  {secondaryNavItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="block rounded-xl px-3 py-2 text-[14px] font-medium text-[#1d223f] hover:bg-[#f4f8ff] hover:text-[#00adef]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 inline-flex h-[50px] w-full items-center rounded-full bg-[#1d223f] p-1">
                  <ApplySelectorButton
                    icon={BriefcaseBusiness}
                    isPrimary
                    label="Employer"
                    onClick={() => openApplyModal("employer")}
                  />
                  <ApplySelectorButton
                    icon={Users}
                    label="Job Seeker"
                    onClick={() => openApplyModal("jobSeeker")}
                  />
                </div>
                <Link
                  href="/it-services"
                  onClick={closeMobileMenu}
                  className="mt-3 inline-flex h-[42px] w-full items-center justify-center rounded-full bg-[#1d223f] px-4 text-[14px] font-semibold text-white"
                >
                  AI Driven IT Services
                </Link>
                <div className="mt-3 rounded-[22px] border border-[#e3ebf6] bg-[#f8fbff] p-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthErrorMessage(null);
                      setIsMobileAccountOpen((currentState) => !currentState);
                    }}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-[18px] bg-white px-3 py-3 text-left"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          authViewer.role === "candidate" || authViewer.role === "admin"
                            ? "bg-[#1d223f] text-white"
                            : "bg-[#eef7ff] text-[#00adef]"
                        }`}
                      >
                        {accountAvatarContent}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-semibold text-[#1d223f]">
                          {accountLabel}
                        </span>
                        <span className="mt-1 block text-[12px] text-[#7a859f]">{accountSubLabel}</span>
                      </span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#7a859f] transition-transform duration-200 ${
                        isMobileAccountOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isMobileAccountOpen ? (
                    authViewer.role === "guest" || authViewer.role === "loading" ? (
                      <>
                        <p className="mt-3 text-[12px] leading-[1.5] text-[#7a859f]">
                          {authViewer.role === "loading"
                            ? "Checking your session..."
                            : "Choose candidate access or admin login."}
                        </p>
                        {authViewer.role === "guest" ? (
                          <div className="mt-3 space-y-2">
                            <AccountMenuLink
                              description="Open your candidate account."
                              href="/candidate/login"
                              icon={LogIn}
                              label="Candidate Sign In"
                              onClick={closeMobileMenu}
                            />
                            <AccountMenuLink
                              description="Create a new candidate account."
                              href="/registration/create-account"
                              icon={UserPlus}
                              label="Candidate Sign Up"
                              onClick={closeMobileMenu}
                            />
                            <AccountMenuLink
                              description="Internal access only."
                              href="/admin/login"
                              icon={ShieldCheck}
                              label="Admin Login"
                              onClick={closeMobileMenu}
                            />
                          </div>
                        ) : (
                          <div className="mt-3 flex items-center gap-3 rounded-[16px] bg-white px-4 py-3 text-[13px] font-medium text-[#52627d]">
                            <LoaderCircle className="h-4 w-4 animate-spin text-[#00adef]" />
                            Checking your session...
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="mt-3 flex items-center gap-3 rounded-[18px] bg-white px-3 py-3">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1d223f] text-[13px] font-bold uppercase text-white">
                            {authViewer.avatarLabel}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-semibold text-[#1d223f]">{authViewer.name}</p>
                            <p className="mt-1 truncate text-[12px] text-[#7a859f]">{authViewer.email}</p>
                          </div>
                        </div>
                        <div className="mt-3 space-y-2">
                          {authViewer.role === "candidate" ? (
                            <AccountMenuLink
                              description="Open your candidate profile."
                              href="/candidate/profile"
                              icon={UserCircle2}
                              label="Profile"
                              onClick={closeMobileMenu}
                            />
                          ) : (
                            <AccountMenuLink
                              description="Open the admin dashboard."
                              href="/admin/dashboard"
                              icon={ShieldCheck}
                              label="Admin Dashboard"
                              onClick={closeMobileMenu}
                            />
                          )}
                          <AccountMenuSignOutButton
                            description={
                              authViewer.role === "admin"
                                ? "Sign out from the admin session."
                                : "Sign out from your candidate account."
                            }
                            isSubmitting={isSigningOut}
                            label="Logout"
                            onClick={handleSignOut}
                          />
                        </div>
                      </>
                    )
                  ) : null}

                  {authErrorMessage ? (
                    <p className="mt-3 rounded-[16px] border border-[#ffd8d8] bg-[#fff5f5] px-4 py-3 text-[12px] font-medium text-[#b53c3c]">
                      {authErrorMessage}
                    </p>
                  ) : null}
                </div>
              </div>
            </details>
          </div>
        </div>
      </header>
      <div aria-hidden className="h-[78px] md:h-[90px]" />

      {isApplyModalOpen ? (
        <ApplyFormModal
          activeTab={activeApplyTab}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onTabChange={setActiveApplyTab}
        />
      ) : null}
    </>
  );
};
