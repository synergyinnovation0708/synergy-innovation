import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabasePublicEnv } from "./public-env";

export const createRouteClient = (request: NextRequest) => {
  const response = NextResponse.next({
    request,
  });
  const { supabasePublishableKey, supabaseUrl } = getSupabasePublicEnv();
  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        cookiesToSet.forEach((cookie) => {
          response.cookies.set(cookie);
        });
      },
    },
  });

  const applySupabaseCookies = (nextResponse: NextResponse) => {
    response.cookies.getAll().forEach((cookie) => {
      nextResponse.cookies.set(cookie);
    });

    return nextResponse;
  };

  return {
    applySupabaseCookies,
    supabase,
  };
};
