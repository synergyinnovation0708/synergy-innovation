import { NextResponse } from "next/server";
import { requireCandidateApiAccess } from "@/lib/candidate-api";
import { validateCandidateProfileValues } from "@/lib/candidate-profile-shared";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";

const candidateProfilesTableName =
  process.env.SUPABASE_CANDIDATE_PROFILES_TABLE?.trim() || "candidate_profiles";

const getCandidateProfileFailureMessage = (error: unknown) => {
  if (!(error instanceof Error) || !error.message) {
    return "Unable to save your candidate profile right now.";
  }

  if (process.env.NODE_ENV !== "production") {
    return error.message;
  }

  return "Unable to save your candidate profile right now.";
};

export const PATCH = async (request: Request) => {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      {
        message: "Supabase is not configured.",
      },
      { status: 500 },
    );
  }

  const { errorResponse, identity } = await requireCandidateApiAccess();

  if (errorResponse || !identity) {
    return errorResponse;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        message: "Invalid profile payload.",
      },
      { status: 400 },
    );
  }

  const validationResult = validateCandidateProfileValues({
    certifications: Array.isArray((body as { certifications?: unknown }).certifications)
      ? ((body as { certifications?: unknown }).certifications as [])
      : [],
    contactNumber:
      typeof (body as { contactNumber?: unknown }).contactNumber === "string"
        ? (body as { contactNumber: string }).contactNumber
        : "",
    currentAnnualCtc:
      typeof (body as { currentAnnualCtc?: unknown }).currentAnnualCtc === "string"
        ? (body as { currentAnnualCtc: string }).currentAnnualCtc
        : "",
    currentCompany:
      typeof (body as { currentCompany?: unknown }).currentCompany === "string"
        ? (body as { currentCompany: string }).currentCompany
        : "",
    currentLocation:
      typeof (body as { currentLocation?: unknown }).currentLocation === "string"
        ? (body as { currentLocation: string }).currentLocation
        : "",
    currentPosition:
      typeof (body as { currentPosition?: unknown }).currentPosition === "string"
        ? (body as { currentPosition: string }).currentPosition
        : "",
    dateOfBirth:
      typeof (body as { dateOfBirth?: unknown }).dateOfBirth === "string"
        ? (body as { dateOfBirth: string }).dateOfBirth
        : "",
    educationHistory: Array.isArray((body as { educationHistory?: unknown }).educationHistory)
      ? ((body as { educationHistory?: unknown }).educationHistory as [])
      : [],
    email:
      typeof (body as { email?: unknown }).email === "string"
        ? (body as { email: string }).email
        : identity.email,
    employmentHistory: Array.isArray((body as { employmentHistory?: unknown }).employmentHistory)
      ? ((body as { employmentHistory?: unknown }).employmentHistory as [])
      : [],
    expectedAnnualCtc:
      typeof (body as { expectedAnnualCtc?: unknown }).expectedAnnualCtc === "string"
        ? (body as { expectedAnnualCtc: string }).expectedAnnualCtc
        : "",
    fullName:
      typeof (body as { fullName?: unknown }).fullName === "string"
        ? (body as { fullName: string }).fullName
        : identity.name,
    gender:
      typeof (body as { gender?: unknown }).gender === "string"
        ? (body as { gender: string }).gender
        : "",
    homeAddress:
      typeof (body as { homeAddress?: unknown }).homeAddress === "string"
        ? (body as { homeAddress: string }).homeAddress
        : "",
    itSkills: Array.isArray((body as { itSkills?: unknown }).itSkills)
      ? ((body as { itSkills?: unknown }).itSkills as [])
      : [],
    keySkills: Array.isArray((body as { keySkills?: unknown }).keySkills)
      ? ((body as { keySkills?: unknown }).keySkills as string[])
      : [],
    languages: Array.isArray((body as { languages?: unknown }).languages)
      ? ((body as { languages?: unknown }).languages as [])
      : [],
    linkedinUrl:
      typeof (body as { linkedinUrl?: unknown }).linkedinUrl === "string"
        ? (body as { linkedinUrl: string }).linkedinUrl
        : "",
    noticePeriod:
      typeof (body as { noticePeriod?: unknown }).noticePeriod === "string"
        ? (body as { noticePeriod: string }).noticePeriod
        : "",
    portfolioUrl:
      typeof (body as { portfolioUrl?: unknown }).portfolioUrl === "string"
        ? (body as { portfolioUrl: string }).portfolioUrl
        : "",
    preferredEmploymentTypes: Array.isArray(
      (body as { preferredEmploymentTypes?: unknown }).preferredEmploymentTypes,
    )
      ? ((body as { preferredEmploymentTypes?: unknown }).preferredEmploymentTypes as string[])
      : [],
    preferredJobTitles: Array.isArray(
      (body as { preferredJobTitles?: unknown }).preferredJobTitles,
    )
      ? ((body as { preferredJobTitles?: unknown }).preferredJobTitles as string[])
      : [],
    preferredLocations: Array.isArray(
      (body as { preferredLocations?: unknown }).preferredLocations,
    )
      ? ((body as { preferredLocations?: unknown }).preferredLocations as string[])
      : [],
    preferredWorkModes: Array.isArray(
      (body as { preferredWorkModes?: unknown }).preferredWorkModes,
    )
      ? ((body as { preferredWorkModes?: unknown }).preferredWorkModes as string[])
      : [],
    professionalQualifications: Array.isArray(
      (body as { professionalQualifications?: unknown }).professionalQualifications,
    )
      ? ((body as { professionalQualifications?: unknown }).professionalQualifications as [])
      : [],
    profileHeadline:
      typeof (body as { profileHeadline?: unknown }).profileHeadline === "string"
        ? (body as { profileHeadline: string }).profileHeadline
        : "",
    profileSummary:
      typeof (body as { profileSummary?: unknown }).profileSummary === "string"
        ? (body as { profileSummary: string }).profileSummary
        : "",
    projects: Array.isArray((body as { projects?: unknown }).projects)
      ? ((body as { projects?: unknown }).projects as [])
      : [],
    resumeBytes:
      typeof (body as { resumeBytes?: unknown }).resumeBytes === "number"
        ? (body as { resumeBytes: number }).resumeBytes
        : 0,
    resumeExtension:
      typeof (body as { resumeExtension?: unknown }).resumeExtension === "string"
        ? (body as { resumeExtension: string }).resumeExtension
        : "",
    resumeOriginalName:
      typeof (body as { resumeOriginalName?: unknown }).resumeOriginalName === "string"
        ? (body as { resumeOriginalName: string }).resumeOriginalName
        : "",
    resumeUrl:
      typeof (body as { resumeUrl?: unknown }).resumeUrl === "string"
        ? (body as { resumeUrl: string }).resumeUrl
        : "",
    totalExperienceMonths:
      typeof (body as { totalExperienceMonths?: unknown }).totalExperienceMonths === "string"
        ? (body as { totalExperienceMonths: string }).totalExperienceMonths
        : "",
    totalExperienceYears:
      typeof (body as { totalExperienceYears?: unknown }).totalExperienceYears === "string"
        ? (body as { totalExperienceYears: string }).totalExperienceYears
        : "",
  });

  if (!validationResult.isValid || !validationResult.record) {
    return NextResponse.json(
      {
        errors: validationResult.errors,
        message: "Please correct the highlighted profile fields.",
      },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const normalized = validationResult.normalized;
    const { error } = await supabase.from(candidateProfilesTableName).upsert(
      {
        certifications: normalized.certifications,
        contact_number: normalized.contactNumber,
        current_annual_ctc: normalized.currentAnnualCtc,
        current_company: normalized.currentCompany,
        current_location: normalized.currentLocation,
        current_position: normalized.currentPosition,
        date_of_birth: normalized.dateOfBirth || null,
        education_history: normalized.educationHistory,
        email: identity.email,
        employment_history: normalized.employmentHistory,
        expected_annual_ctc: normalized.expectedAnnualCtc,
        full_name: normalized.fullName,
        gender: normalized.gender,
        home_address: normalized.homeAddress,
        it_skills: normalized.itSkills,
        key_skills: normalized.keySkills,
        languages: normalized.languages,
        linkedin_url: normalized.linkedinUrl,
        notice_period: normalized.noticePeriod,
        portfolio_url: normalized.portfolioUrl,
        preferred_employment_types: normalized.preferredEmploymentTypes,
        preferred_job_titles: normalized.preferredJobTitles,
        preferred_locations: normalized.preferredLocations,
        preferred_work_modes: normalized.preferredWorkModes,
        professional_qualifications: normalized.professionalQualifications,
        profile_headline: normalized.profileHeadline,
        profile_summary: normalized.profileSummary,
        projects: normalized.projects,
        resume_bytes: normalized.resumeBytes,
        resume_extension: normalized.resumeExtension,
        resume_original_name: normalized.resumeOriginalName,
        resume_url: normalized.resumeUrl,
        total_experience_months: Number(normalized.totalExperienceMonths || 0),
        total_experience_years: Number(normalized.totalExperienceYears || 0),
        updated_at: new Date().toISOString(),
        user_id: identity.id,
      },
      {
        onConflict: "user_id",
      },
    );

    if (error) {
      console.error("Candidate profile upsert failed:", error);

      return NextResponse.json(
        {
          message: getCandidateProfileFailureMessage(error),
        },
        { status: 500 },
      );
    }

    await supabase.auth.admin
      .updateUserById(identity.id, {
        user_metadata: {
          full_name: normalized.fullName,
          name: normalized.fullName,
        },
      })
      .catch(() => null);

    return NextResponse.json({
      message: "Your candidate profile has been updated successfully.",
    });
  } catch (error) {
    console.error("Candidate profile update failed:", error);

    return NextResponse.json(
      {
        message: getCandidateProfileFailureMessage(error),
      },
      { status: 500 },
    );
  }
};
