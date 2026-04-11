import "server-only";
import { unstable_cache } from "next/cache";
import { getAdminNotificationsLastReadAt, isAdminUser } from "./admin-auth";
import { createClient } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";

export type AdminSidebarCounts = Partial<Record<string, string>>;

const jobListingsTableName =
  process.env.SUPABASE_JOB_LISTINGS_TABLE?.trim() || "job_listings";
const jobSeekerInquiriesTableName =
  process.env.SUPABASE_JOB_SEEKER_INQUIRIES_TABLE?.trim() ||
  "job_seeker_inquiries";
const candidateProfilesTableName =
  process.env.SUPABASE_CANDIDATE_PROFILES_TABLE?.trim() || "candidate_profiles";
const employerInquiriesTableName =
  process.env.SUPABASE_EMPLOYER_INQUIRIES_TABLE?.trim() || "employer_inquiries";
const itServiceInquiriesTableName =
  process.env.SUPABASE_IT_SERVICE_INQUIRIES_TABLE?.trim() ||
  "it_service_inquiries";

const countRows = async (
  supabase: ReturnType<typeof createAdminClient>,
  tableName: string,
  countMode: "exact" | "planned" | "estimated" = "exact",
) => {
  const { count, error } = await supabase
    .from(tableName)
    .select("*", { count: countMode, head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
};

const countRowsAllowMissing = async (
  supabase: ReturnType<typeof createAdminClient>,
  tableName: string,
  countMode: "exact" | "planned" | "estimated" = "exact",
) => {
  try {
    return await countRows(supabase, tableName, countMode);
  } catch (error) {
    if (
      error instanceof Error &&
      /does not exist|relation/i.test(error.message)
    ) {
      return 0;
    }

    throw error;
  }
};

const countUnreadEmployerNotifications = async (
  supabase: ReturnType<typeof createAdminClient>,
  lastReadAt: string | null,
) => {
  let query = supabase
    .from(employerInquiriesTableName)
    .select("*", { count: "exact", head: true });

  if (lastReadAt) {
    query = query.gt("created_at", lastReadAt);
  }

  const { count, error } = await query;

  if (error) {
    if (error.message?.includes("created_at")) {
      return countRows(supabase, employerInquiriesTableName);
    }

    throw error;
  }

  return count ?? 0;
};

const getCachedGlobalAdminSidebarCounts = unstable_cache(
  async (): Promise<AdminSidebarCounts> => {
    try {
      const supabase = createAdminClient();
      const [
        candidatesCount,
        jobListingsCount,
        jobSeekersCount,
        employersCount,
        itServicesCount,
      ] = await Promise.all([
        countRowsAllowMissing(supabase, candidateProfilesTableName, "estimated"),
        countRows(supabase, jobListingsTableName, "estimated"),
        countRows(supabase, jobSeekerInquiriesTableName, "estimated"),
        countRows(supabase, employerInquiriesTableName, "estimated"),
        countRowsAllowMissing(supabase, itServiceInquiriesTableName, "estimated"),
      ]);

      return {
        "/admin/candidates": candidatesCount.toString(),
        "/admin/employers": employersCount.toString(),
        "/admin/it-services": itServicesCount.toString(),
        "/admin/job-listings": jobListingsCount.toString(),
        "/admin/job-seekers": jobSeekersCount.toString(),
      };
    } catch {
      return {};
    }
  },
  ["admin-global-sidebar-counts"],
  {
    revalidate: 60,
  },
);

export const getAdminSidebarCounts = async (): Promise<AdminSidebarCounts> => {
  try {
    const supabase = createAdminClient();
    const sessionSupabase = await createClient();
    const {
      data: { user: currentUser },
    } = await sessionSupabase.auth.getUser();
    const notificationsLastReadAt = isAdminUser(currentUser)
      ? getAdminNotificationsLastReadAt(currentUser)
      : null;
    const [globalCounts, employerNotificationsCount] = await Promise.all([
      getCachedGlobalAdminSidebarCounts(),
      countUnreadEmployerNotifications(supabase, notificationsLastReadAt),
    ]);

    return {
      ...globalCounts,
      "/admin/notifications": employerNotificationsCount.toString(),
    };
  } catch {
    return getCachedGlobalAdminSidebarCounts();
  }
};
