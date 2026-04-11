import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

const ADMIN_ROLE = "admin";
const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const requireEnv = (name) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const adminEmail = requireEnv("SUPABASE_ADMIN_EMAIL").toLowerCase();
const adminPassword = requireEnv("SUPABASE_ADMIN_PASSWORD");
const adminName = process.env.SUPABASE_ADMIN_NAME?.trim() || "System Admin";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const findAdminUserByEmail = async (email) => {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    const matchedUser = data.users.find(
      (user) => user.email?.toLowerCase() === email,
    );

    if (matchedUser) {
      return matchedUser;
    }

    const isLastPage = data.lastPage ? page >= data.lastPage : data.users.length < perPage;

    if (isLastPage) {
      return null;
    }

    page += 1;
  }
};

const adminAttributes = {
  app_metadata: {
    role: ADMIN_ROLE,
  },
  email: adminEmail,
  email_confirm: true,
  password: adminPassword,
  user_metadata: {
    name: adminName,
  },
};

const existingUser = await findAdminUserByEmail(adminEmail);

if (existingUser) {
  const { data, error } = await supabase.auth.admin.updateUserById(
    existingUser.id,
    adminAttributes,
  );

  if (error) {
    throw error;
  }

  console.log(
    `Updated admin user ${data.user?.email ?? adminEmail} with role "${ADMIN_ROLE}".`,
  );
} else {
  const { data, error } = await supabase.auth.admin.createUser(adminAttributes);

  if (error) {
    throw error;
  }

  console.log(
    `Created admin user ${data.user?.email ?? adminEmail} with role "${ADMIN_ROLE}".`,
  );
}
