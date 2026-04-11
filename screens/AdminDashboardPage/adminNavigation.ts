import {
  Bell,
  BriefcaseBusiness,
  Building2,
  Code2,
  FileText,
  LayoutDashboard,
  Settings2,
  Users,
  type LucideIcon,
} from "lucide-react";

export type SidebarItem = {
  count?: string;
  href: string;
  icon: LucideIcon;
  label: string;
};

export const adminSidebarItems: SidebarItem[] = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/notifications", icon: Bell, label: "Notifications" },
  { href: "/admin/job-listings", icon: BriefcaseBusiness, label: "Job Listings" },
  { href: "/admin/job-seekers", icon: FileText, label: "Job Seekers" },
  { href: "/admin/employers", icon: Building2, label: "Employers" },
  { href: "/admin/it-services", icon: Code2, label: "IT Services" },
  { href: "/admin/candidates", icon: Users, label: "Candidates" },
  { href: "/admin/settings", icon: Settings2, label: "Settings" },
];
