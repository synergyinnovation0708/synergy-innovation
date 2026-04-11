import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./public-env";

export const createClient = () => {
  const { supabasePublishableKey, supabaseUrl } = getSupabasePublicEnv();

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
};
