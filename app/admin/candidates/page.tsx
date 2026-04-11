import { getAdminCandidatesData } from "@/lib/admin-candidates";
import { requireAdminUser } from "@/lib/admin-auth";
import { AdminCandidatesPage } from "@/screens/AdminDashboardPage/AdminCandidatesPage";

export default async function AdminCandidates() {
  const [admin, candidateData] = await Promise.all([
    requireAdminUser(),
    getAdminCandidatesData(),
  ]);

  return (
    <AdminCandidatesPage
      candidates={candidateData.candidates}
      email={admin.email}
      errorMessage={candidateData.errorMessage}
      name={admin.name}
      summary={candidateData.summary}
    />
  );
}
