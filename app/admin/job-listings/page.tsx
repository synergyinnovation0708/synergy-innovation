import { requireAdminUser } from "@/lib/admin-auth";
import { getAdminJobsData } from "@/lib/admin-jobs";
import { AdminJobListingsPage } from "@/screens/AdminDashboardPage/AdminJobListingsPage";

export default async function AdminJobListings() {
  const [admin, jobData] = await Promise.all([
    requireAdminUser(),
    getAdminJobsData(),
  ]);

  return (
    <AdminJobListingsPage
      email={admin.email}
      errorMessage={jobData.errorMessage}
      jobs={jobData.jobs}
      name={admin.name}
      summary={jobData.summary}
    />
  );
}
