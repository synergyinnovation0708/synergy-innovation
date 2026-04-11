import { getAdminAiUsageData } from "@/lib/admin-ai-usage";
import { getAdminJobSeekersData } from "@/lib/admin-job-seekers";
import { requireAdminUser } from "@/lib/admin-auth";
import { AdminDashboardPage } from "@/screens/AdminDashboardPage/AdminDashboardPage";

export default async function AdminDashboard() {
  const [admin, aiUsageData, jobSeekerData] = await Promise.all([
    requireAdminUser(),
    getAdminAiUsageData(),
    getAdminJobSeekersData(),
  ]);

  return (
    <AdminDashboardPage
      aiUsage={aiUsageData.records}
      aiUsageErrorMessage={aiUsageData.errorMessage}
      aiUsageSummary={aiUsageData.summary}
      email={admin.email}
      jobSeekers={jobSeekerData.jobSeekers}
      jobSeekersErrorMessage={jobSeekerData.errorMessage}
      jobSeekersSummary={jobSeekerData.summary}
      name={admin.name}
    />
  );
}
