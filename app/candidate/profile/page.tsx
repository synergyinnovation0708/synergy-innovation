import { requireCandidateUser } from "@/lib/candidate-auth";
import { getCandidateProfileData } from "@/lib/candidate-profile";
import { CandidateProfilePage } from "@/screens/CandidateProfilePage/CandidateProfilePage";

export default async function CandidateProfile() {
  const identity = await requireCandidateUser();
  const { errorMessage, initialValues, meta } =
    await getCandidateProfileData(identity);

  return (
    <CandidateProfilePage
      errorMessage={errorMessage}
      identity={identity}
      initialValues={initialValues}
      meta={meta}
    />
  );
}
