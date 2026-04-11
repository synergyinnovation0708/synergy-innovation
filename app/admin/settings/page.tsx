import { requireAdminUser } from "@/lib/admin-auth";
import { AdminSettingsPage } from "@/screens/AdminDashboardPage/AdminSettingsPage";

export default async function AdminSettings() {
  const admin = await requireAdminUser();

  return (
    <AdminSettingsPage
      email={admin.email}
      name={admin.name}
    />
  );
}
