import { CandidateRegistrationPage } from "@/screens/CandidateRegistrationPage/CandidateRegistrationPage";

type CandidateRegistrationRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CandidateRegistration({
  searchParams,
}: CandidateRegistrationRouteProps) {
  const params = searchParams ? await searchParams : undefined;
  const jobTitleValue = params?.jobTitle;
  const initialJobTitle = Array.isArray(jobTitleValue)
    ? jobTitleValue[0]
    : jobTitleValue;

  return (
    <CandidateRegistrationPage initialJobTitle={initialJobTitle || ""} />
  );
}
