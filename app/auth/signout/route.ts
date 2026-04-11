import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";

const getRedirectPath = (request: NextRequest) => {
  const redirectTo = new URL(request.url).searchParams.get("redirectTo");

  if (redirectTo?.startsWith("/")) {
    return redirectTo;
  }

  return "/admin/login";
};

export const POST = async (request: NextRequest) => {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
  }

  return NextResponse.redirect(new URL(getRedirectPath(request), request.url), {
    status: 303,
  });
};
