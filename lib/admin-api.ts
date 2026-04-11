import { NextResponse } from "next/server";
import { isAdminUser } from "./admin-auth";
import { createClient } from "./supabase/server";
import { hasSupabaseEnv } from "./supabase/public-env";

export const requireAdminApiAccess = async () => {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      {
        message: "Supabase is not configured.",
      },
      { status: 500 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      {
        message: "Authentication required.",
      },
      { status: 401 },
    );
  }

  if (!isAdminUser(user)) {
    await supabase.auth.signOut();

    return NextResponse.json(
      {
        message: "Admin access only.",
      },
      { status: 403 },
    );
  }

  return null;
};
