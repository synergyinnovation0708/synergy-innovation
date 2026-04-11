import { requireAdminUser } from "@/lib/admin-auth";
import { getAdminJobSeekersData } from "@/lib/admin-job-seekers";
import { AdminJobSeekersPage } from "@/screens/AdminDashboardPage/AdminJobSeekersPage";

export default async function AdminJobSeekers() {
  const [admin, jobSeekerData] = await Promise.all([
    requireAdminUser(),
    getAdminJobSeekersData(),
  ]);

  return (
    <AdminJobSeekersPage
      email={admin.email}
      errorMessage={jobSeekerData.errorMessage}
      jobSeekers={jobSeekerData.jobSeekers}
      name={admin.name}
      summary={jobSeekerData.summary}
    />
  );
}
