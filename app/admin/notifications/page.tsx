import { markAdminNotificationsRead, requireAdminUser } from "@/lib/admin-auth";
import { getAdminEmployersData } from "@/lib/admin-employers";
import { AdminNotificationsPage } from "@/screens/AdminDashboardPage/AdminNotificationsPage";

export default async function AdminNotifications() {
  const admin = await requireAdminUser();

  await markAdminNotificationsRead();

  const employerData = await getAdminEmployersData();

  return (
    <AdminNotificationsPage
      email={admin.email}
      employers={employerData.employers}
      errorMessage={employerData.errorMessage}
      name={admin.name}
      summary={employerData.summary}
    />
  );
}
