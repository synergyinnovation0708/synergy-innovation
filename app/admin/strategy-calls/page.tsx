import { requireAdminUser } from "@/lib/admin-auth";
import { getAdminStrategyCallsData } from "@/lib/admin-strategy-calls";
import { AdminStrategyCallsPage } from "@/screens/AdminDashboardPage/AdminStrategyCallsPage";

export default async function AdminStrategyCalls() {
  const [admin, strategyCallsData] = await Promise.all([
    requireAdminUser(),
    getAdminStrategyCallsData(),
  ]);

  return (
    <AdminStrategyCallsPage
      email={admin.email}
      errorMessage={strategyCallsData.errorMessage}
      calls={strategyCallsData.calls}
      name={admin.name}
      summary={strategyCallsData.summary}
    />
  );
}
