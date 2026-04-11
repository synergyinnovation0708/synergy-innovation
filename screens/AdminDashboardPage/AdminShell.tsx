"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { adminSidebarItems } from "./adminNavigation";

type AdminShellProps = {
  activePath: string;
  adminEmail?: string;
  adminName?: string;
  breadcrumbLabel: string;
  children: ReactNode;
  description: string;
  headerActions?: ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  title: string;
};

export const AdminShell = ({
  activePath,
  adminEmail = "admin@synergyinnovation.com",
  adminName = "System Admin",
  breadcrumbLabel,
  children,
  description,
  headerActions,
  showSearch = true,
  searchPlaceholder = "Search jobs, employers, or admins",
  title,
}: AdminShellProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const desktopSidebarWidth = isSidebarCollapsed ? "96px" : "288px";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f3f8fd_0%,#f9fbfd_100%)] text-[#1d223f]">
      <div
        className="min-h-screen"
        style={{ ["--admin-sidebar-width" as string]: desktopSidebarWidth }}
      >
        {isMobileSidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 bg-[#1d223f]/45 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-[288px] flex-col overflow-hidden bg-[#1d223f] text-white shadow-[0_24px_70px_rgba(29,34,63,0.28)] transition-all duration-300 lg:translate-x-0",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
            isSidebarCollapsed ? "lg:w-[96px]" : "lg:w-[288px]",
          )}
        >
          <div className="flex h-full min-h-0 flex-col overflow-y-auto overflow-x-hidden px-4 py-5">
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/"
                className={cn(
                  "flex min-w-0 items-center gap-3 rounded-[22px] border border-white/10 bg-white/8 px-3 py-3",
                  isSidebarCollapsed ? "lg:justify-center lg:px-2" : "",
                )}
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <Image
                  src="/images/logo1 3.png"
                  alt="Synergy Innovation"
                  width={150}
                  height={44}
                  className={cn(
                    "h-[38px] w-auto object-contain brightness-0 invert",
                    isSidebarCollapsed ? "lg:hidden" : "",
                  )}
                  priority
                />
                {isSidebarCollapsed ? (
                  <ShieldCheck className="hidden h-6 w-6 text-[#86ddff] lg:block" />
                ) : null}
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed((current) => !current)}
                  className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-colors duration-200 hover:bg-white/14 lg:inline-flex"
                  aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isSidebarCollapsed ? (
                    <PanelLeftOpen className="h-5 w-5" />
                  ) : (
                    <PanelLeftClose className="h-5 w-5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white lg:hidden"
                  aria-label="Close mobile sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/6 p-4">
              <div
                className={cn(
                  "flex items-start gap-3",
                  isSidebarCollapsed ? "lg:justify-center" : "",
                )}
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#00adef]/18 text-[#86ddff]">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className={cn(isSidebarCollapsed ? "lg:hidden" : "")}>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#86ddff]">
                    Admin Space
                  </p>
                  <p className="mt-1 text-[15px] leading-[1.5] text-white/72">
                    Manage operations, jobs, and system updates from one place.
                  </p>
                </div>
              </div>
            </div>

            <nav className="mt-8 flex-1 space-y-2">
              {adminSidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === activePath;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-[20px] px-3 py-3 text-[15px] font-semibold transition-colors duration-200",
                      isActive
                        ? "bg-white text-[#1d223f]"
                        : "text-white/78 hover:bg-white/10 hover:text-white",
                      isSidebarCollapsed ? "lg:justify-center lg:px-2" : "",
                    )}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <span
                      className={cn(
                        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                        isActive ? "bg-[#eaf8ff] text-[#00adef]" : "bg-white/8",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span
                      className={cn("min-w-0 flex-1", isSidebarCollapsed ? "lg:hidden" : "")}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div
              className={cn(
                "rounded-[24px] border border-white/10 bg-white/6 p-4",
                isSidebarCollapsed ? "lg:px-2 lg:py-3" : "",
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-3",
                  isSidebarCollapsed ? "lg:justify-center" : "",
                )}
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-[#86ddff]">
                  <UserCircle2 className="h-5 w-5" />
                </span>
                <div className={cn("min-w-0", isSidebarCollapsed ? "lg:hidden" : "")}>
                  <p className="truncate text-[15px] font-semibold">{adminName}</p>
                  <p className="truncate text-[13px] text-white/68">{adminEmail}</p>
                </div>
              </div>

              <form action="/auth/signout" className={cn("mt-4", isSidebarCollapsed ? "lg:hidden" : "")} method="post">
                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center rounded-[18px] border border-white/12 bg-white/8 px-4 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-white/12"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col transition-[padding] duration-300 lg:pl-[var(--admin-sidebar-width)]">
          <header className="sticky top-0 z-20 border-b border-[#dbe5f1] bg-[#f7fbff]/85 backdrop-blur-md">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dbe5f1] bg-white text-[#1d223f] lg:hidden"
                    aria-label="Open sidebar"
                  >
                    <Menu className="h-5 w-5" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
                      <span>Admin Dashboard</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span className="text-[#7e8aa8]">{breadcrumbLabel}</span>
                    </div>
                    <h1 className="mt-2 text-[30px] font-bold leading-[1.1] text-[#1d223f] sm:text-[36px]">
                      {title}
                    </h1>
                    <p className="mt-2 max-w-[760px] text-[15px] leading-[1.7] text-[#66728f]">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {showSearch ? (
                    <div className="flex h-[52px] min-w-[260px] items-center gap-3 rounded-[18px] border border-[#dbe5f1] bg-white px-4">
                      <Search className="h-4 w-4 text-[#6c7896]" />
                      <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full bg-transparent text-[15px] text-[#1d223f] outline-none placeholder:text-[#8a96b2]"
                      />
                    </div>
                  ) : null}
                  {headerActions}
                  <Link
                    href="/admin/notifications"
                    className={cn(
                      "relative inline-flex h-[52px] w-[52px] items-center justify-center rounded-[18px] border border-[#dbe5f1] text-[#1d223f] transition-colors duration-200",
                      activePath === "/admin/notifications"
                        ? "bg-[#1d223f] text-white"
                        : "bg-white hover:bg-[#f4f8fc]",
                    )}
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </div>
      </div>
    </main>
  );
};
