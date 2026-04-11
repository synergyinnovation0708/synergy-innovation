import { getAdminEmployersData } from "@/lib/admin-employers";
import { requireAdminUser } from "@/lib/admin-auth";
import { AdminEmployersPage } from "@/screens/AdminDashboardPage/AdminEmployersPage";

export default async function AdminEmployers() {
  const [admin, employerData] = await Promise.all([
    requireAdminUser(),
    getAdminEmployersData(),
  ]);

  return (
    <AdminEmployersPage
      email={admin.email}
      employers={employerData.employers}
      errorMessage={employerData.errorMessage}
      name={admin.name}
      summary={employerData.summary}
    />
  );
}
