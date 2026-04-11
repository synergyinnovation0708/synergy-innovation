import { getCurrentCandidateAppliedJobIds, getPublicJobsData } from "@/lib/public-jobs";
import { JobsPage } from "@/screens/JobsPage/JobsPage";

type JobsRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Jobs({ searchParams }: JobsRouteProps) {
  const [jobData, appliedJobIds] = await Promise.all([
    getPublicJobsData(),
    getCurrentCandidateAppliedJobIds(),
  ]);
  const params = searchParams ? await searchParams : undefined;
  const keywordValue = params?.q;
  const locationValue = params?.location;
  const initialKeyword = Array.isArray(keywordValue) ? keywordValue[0] : keywordValue;
  const initialLocation = Array.isArray(locationValue)
    ? locationValue[0]
    : locationValue;

  return (
    <JobsPage
      initialAppliedJobIds={appliedJobIds}
      errorMessage={jobData.errorMessage}
      initialKeyword={initialKeyword || ""}
      initialLocation={initialLocation || ""}
      jobs={jobData.jobs}
    />
  );
}
