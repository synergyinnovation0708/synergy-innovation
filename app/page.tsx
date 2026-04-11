import { getPublicJobsData } from "@/lib/public-jobs";
import { HomePage } from "@/screens/HomePage/HomePage";

export default async function Home() {
  const jobData = await getPublicJobsData();

  return <HomePage jobs={jobData.jobs} jobsErrorMessage={jobData.errorMessage} />;
}
