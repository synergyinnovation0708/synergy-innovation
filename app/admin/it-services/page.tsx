import { requireAdminUser } from "@/lib/admin-auth";
import { getAdminITServicesData } from "@/lib/admin-it-services";
import { AdminITServicesPage } from "@/screens/AdminDashboardPage/AdminITServicesPage";

export default async function AdminITServices() {
  const [admin, itServicesData] = await Promise.all([
    requireAdminUser(),
    getAdminITServicesData(),
  ]);

  return (
    <AdminITServicesPage
      email={admin.email}
      errorMessage={itServicesData.errorMessage}
      inquiries={itServicesData.inquiries}
      name={admin.name}
      summary={itServicesData.summary}
    />
  );
}
