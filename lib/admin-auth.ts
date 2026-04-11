import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import {
  ADMIN_NOTIFICATIONS_LAST_READ_AT_KEY,
  ADMIN_ROLE,
  type AdminIdentity,
} from "./admin-auth-shared";
import { createClient } from "./supabase/server";
import { hasSupabaseEnv } from "./supabase/public-env";

const loginPath = "/admin/login";
const dashboardPath = "/admin/dashboard";

const toAdminIdentity = (user: User): AdminIdentity => ({
  email: user.email ?? process.env.SUPABASE_ADMIN_EMAIL ?? "admin@synergyinnovation.com",
  name:
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    "System Admin",
});

export const isAdminUser = (user: Pick<User, "app_metadata"> | null | undefined) =>
  user?.app_metadata?.role === ADMIN_ROLE;

export const getAdminNotificationsLastReadAt = (
  user: Pick<User, "user_metadata"> | null | undefined,
) => {
  const value = user?.user_metadata?.[ADMIN_NOTIFICATIONS_LAST_READ_AT_KEY];

  if (typeof value !== "string") {
    return null;
  }

  return Number.isNaN(new Date(value).getTime()) ? null : value;
};

export const requireAdminUser = async () => {
  if (!hasSupabaseEnv()) {
    redirect(`${loginPath}?error=supabase-not-configured`);
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(loginPath);
  }

  if (!isAdminUser(user)) {
    await supabase.auth.signOut();
    redirect(`${loginPath}?error=not-authorized`);
  }

  return toAdminIdentity(user);
};

export const markAdminNotificationsRead = async (
  readAt: string = new Date().toISOString(),
) => {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isAdminUser(user)) {
    return null;
  }

  const existingMetadata =
    typeof user.user_metadata === "object" && user.user_metadata !== null
      ? user.user_metadata
      : {};
  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      ...existingMetadata,
      [ADMIN_NOTIFICATIONS_LAST_READ_AT_KEY]: readAt,
    },
  });

  if (updateError) {
    return null;
  }

  return readAt;
};

export const redirectIfAuthenticatedAdmin = async () => {
  if (!hasSupabaseEnv()) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  if (isAdminUser(user)) {
    redirect(dashboardPath);
  }

  await supabase.auth.signOut();
};
