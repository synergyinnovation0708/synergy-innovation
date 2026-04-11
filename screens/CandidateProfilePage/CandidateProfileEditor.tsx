"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  GraduationCap,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import {
  calculateCandidateProfileStrength,
  candidateCertificationItemInitialValue,
  candidateEducationHistoryItemInitialValue,
  candidateEducationLevelOptions,
  candidateEmploymentHistoryItemInitialValue,
  candidateEmploymentTypeOptions,
  candidateGenderOptions,
  candidateItSkillItemInitialValue,
  candidateLanguageItemInitialValue,
  candidateLanguageProficiencyOptions,
  candidateNoticePeriodOptions,
  candidateProfessionalQualificationItemInitialValue,
  candidateProfileStringArrayToText,
  candidateProfileTextToStringArray,
  candidateProjectItemInitialValue,
  candidateWorkModeOptions,
  formatCandidateProfileBytes,
  inferCandidateWorkStatus,
  validateCandidateProfileValues,
  type CandidateCertificationItem,
  type CandidateEducationHistoryItem,
  type CandidateEmploymentHistoryItem,
  type CandidateItSkillItem,
  type CandidateLanguageItem,
  type CandidateProfessionalQualificationItem,
  type CandidateProfileFieldName,
  type CandidateProfileFormValues,
  type CandidateProfileValidationErrors,
  type CandidateProjectItem,
} from "@/lib/candidate-profile-shared";
import type { CandidateProfileMeta } from "@/lib/candidate-profile";
import {
  jobSeekerResumeHelpText,
  resumeFileAcceptAttribute,
  validateResumeFileBytes,
  validateResumeMetadata,
} from "@/lib/job-seeker-inquiries";

type CandidateProfileEditorProps = {
  initialValues: CandidateProfileFormValues;
  meta: CandidateProfileMeta;
};

type FormStatus = {
  message: string;
  type: "error" | "success";
};

type SectionId =
  | "career"
  | "credentials"
  | "education"
  | "employment"
  | "personal"
  | "projects"
  | "skills";

type StringArrayFieldName =
  | "keySkills"
  | "preferredJobTitles"
  | "preferredLocations";

const inputClassName =
  "mt-2 h-[54px] w-full rounded-[16px] border border-[#dbe5f1] bg-[#f8fbff] px-4 text-[15px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8a96b2] focus:border-[#00adef] focus:bg-white";

const textareaClassName =
  "mt-2 min-h-[120px] w-full rounded-[16px] border border-[#dbe5f1] bg-[#f8fbff] px-4 py-3 text-[15px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8a96b2] focus:border-[#00adef] focus:bg-white";

const getFieldClassName = (hasError: boolean, isTextarea = false) =>
  `${isTextarea ? textareaClassName : inputClassName} ${
    hasError ? "border-[#dc2626] focus:border-[#dc2626]" : ""
  }`;

const createInitialExpandedSections = (): Record<SectionId, boolean> => ({
  career: true,
  credentials: false,
  education: false,
  employment: false,
  personal: true,
  projects: false,
  skills: false,
});

const createStringArrayFieldTexts = (
  values: Pick<CandidateProfileFormValues, StringArrayFieldName>,
) => ({
  keySkills: candidateProfileStringArrayToText(values.keySkills),
  preferredJobTitles: candidateProfileStringArrayToText(
    values.preferredJobTitles,
  ),
  preferredLocations: candidateProfileStringArrayToText(
    values.preferredLocations,
  ),
});

const SectionCard = ({
  children,
  icon,
  isOpen,
  onToggle,
  subtitle,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  subtitle: string;
  title: string;
}) => (
  <section className="rounded-[30px] border border-[#dbe6f2] bg-white shadow-[0_20px_50px_rgba(29,34,63,0.06)]">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-7"
    >
      <div className="flex items-center gap-4">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#eef8ff] text-[#00adef]">
          {icon}
        </span>
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
            {subtitle}
          </p>
          <h2 className="mt-1 text-[24px] font-bold leading-[1.15] text-[#1d223f]">
            {title}
          </h2>
        </div>
      </div>
      <ChevronDown
        className={`h-5 w-5 shrink-0 text-[#1d223f] transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {isOpen ? <div className="border-t border-[#edf2f8] px-6 py-6 sm:px-7">{children}</div> : null}
  </section>
);

const Field = ({
  children,
  error,
  label,
}: {
  children: ReactNode;
  error?: string;
  label: string;
}) => (
  <div>
    <label className="text-[14px] font-semibold text-[#1d223f]">{label}</label>
    {children}
    {error ? <p className="mt-2 text-sm text-[#dc2626]">{error}</p> : null}
  </div>
);

const ChipToggle = ({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors duration-200 ${
      checked
        ? "border-[#1d223f] bg-[#1d223f] text-white"
        : "border-[#dbe5f1] bg-[#f8fbff] text-[#1d223f] hover:bg-white"
    }`}
  >
    {label}
  </button>
);

export const CandidateProfileEditor = ({
  initialValues,
  meta,
}: CandidateProfileEditorProps) => {
  const router = useRouter();
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState<CandidateProfileValidationErrors>({});
  const [formStatus, setFormStatus] = useState<FormStatus | null>(null);
  const [resumeStatus, setResumeStatus] = useState<FormStatus | null>(null);
  const [isReplacingResume, setIsReplacingResume] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState(
    createInitialExpandedSections(),
  );
  const [stringArrayFieldTexts, setStringArrayFieldTexts] = useState(() =>
    createStringArrayFieldTexts(initialValues),
  );

  const profileStrength = calculateCandidateProfileStrength(formValues);
  const workStatusLabel = inferCandidateWorkStatus(formValues);

  const toggleSection = (sectionId: SectionId) => {
    setExpandedSections((currentSections) => ({
      ...currentSections,
      [sectionId]: !currentSections[sectionId],
    }));
  };

  const updateField = <K extends CandidateProfileFieldName>(
    fieldName: K,
    value: CandidateProfileFormValues[K],
  ) => {
    const nextValues = {
      ...formValues,
      [fieldName]: value,
    };

    setFormValues(nextValues);
    setFormStatus(null);

    if (errors[fieldName]) {
      const nextError = validateCandidateProfileValues(nextValues).errors[fieldName];

      setErrors((currentErrors) => {
        const updatedErrors = { ...currentErrors };

        if (nextError) {
          updatedErrors[fieldName] = nextError;
        } else {
          delete updatedErrors[fieldName];
        }

        return updatedErrors;
      });
    }
  };

  const updateStringArrayField = (
    fieldName: StringArrayFieldName,
    value: string,
  ) => {
    setStringArrayFieldTexts((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
    updateField(fieldName, candidateProfileTextToStringArray(value));
  };

  const toggleArraySelection = (
    fieldName: "preferredEmploymentTypes" | "preferredWorkModes",
    value: string,
  ) => {
    const currentValues = formValues[fieldName];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    updateField(fieldName, nextValues);
  };

  const updateEmploymentHistoryItem = (
    index: number,
    fieldName: keyof CandidateEmploymentHistoryItem,
    value: CandidateEmploymentHistoryItem[keyof CandidateEmploymentHistoryItem],
  ) => {
    const nextValues = formValues.employmentHistory.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [fieldName]: value } : item,
    );

    updateField("employmentHistory", nextValues);
  };

  const updateEducationHistoryItem = (
    index: number,
    fieldName: keyof CandidateEducationHistoryItem,
    value: CandidateEducationHistoryItem[keyof CandidateEducationHistoryItem],
  ) => {
    const nextValues = formValues.educationHistory.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [fieldName]: value } : item,
    );

    updateField("educationHistory", nextValues);
  };

  const updateItSkillItem = (
    index: number,
    fieldName: keyof CandidateItSkillItem,
    value: CandidateItSkillItem[keyof CandidateItSkillItem],
  ) => {
    const nextValues = formValues.itSkills.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [fieldName]: value } : item,
    );

    updateField("itSkills", nextValues);
  };

  const updateProjectItem = (
    index: number,
    fieldName: keyof CandidateProjectItem,
    value: CandidateProjectItem[keyof CandidateProjectItem],
  ) => {
    const nextValues = formValues.projects.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [fieldName]: value } : item,
    );

    updateField("projects", nextValues);
  };

  const updateCertificationItem = (
    index: number,
    fieldName: keyof CandidateCertificationItem,
    value: CandidateCertificationItem[keyof CandidateCertificationItem],
  ) => {
    const nextValues = formValues.certifications.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [fieldName]: value } : item,
    );

    updateField("certifications", nextValues);
  };

  const updateProfessionalQualificationItem = (
    index: number,
    fieldName: keyof CandidateProfessionalQualificationItem,
    value:
      CandidateProfessionalQualificationItem[keyof CandidateProfessionalQualificationItem],
  ) => {
    const nextValues = formValues.professionalQualifications.map(
      (item, itemIndex) =>
        itemIndex === index ? { ...item, [fieldName]: value } : item,
    );

    updateField("professionalQualifications", nextValues);
  };

  const updateLanguageItem = (
    index: number,
    fieldName: keyof CandidateLanguageItem,
    value: CandidateLanguageItem[keyof CandidateLanguageItem],
  ) => {
    const nextValues = formValues.languages.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [fieldName]: value } : item,
    );

    updateField("languages", nextValues);
  };

  const addEmploymentHistoryItem = () =>
    updateField("employmentHistory", [
      ...formValues.employmentHistory,
      candidateEmploymentHistoryItemInitialValue(),
    ]);

  const addEducationHistoryItem = () =>
    updateField("educationHistory", [
      ...formValues.educationHistory,
      candidateEducationHistoryItemInitialValue(),
    ]);

  const addItSkillItem = () =>
    updateField("itSkills", [
      ...formValues.itSkills,
      candidateItSkillItemInitialValue(),
    ]);

  const addProjectItem = () =>
    updateField("projects", [
      ...formValues.projects,
      candidateProjectItemInitialValue(),
    ]);

  const addCertificationItem = () =>
    updateField("certifications", [
      ...formValues.certifications,
      candidateCertificationItemInitialValue(),
    ]);

  const addProfessionalQualificationItem = () =>
    updateField("professionalQualifications", [
      ...formValues.professionalQualifications,
      candidateProfessionalQualificationItemInitialValue(),
    ]);

  const addLanguageItem = () =>
    updateField("languages", [
      ...formValues.languages,
      candidateLanguageItemInitialValue(),
    ]);

  const removeEmploymentHistoryItem = (index: number) =>
    updateField(
      "employmentHistory",
      formValues.employmentHistory.filter((_, itemIndex) => itemIndex !== index),
    );

  const removeEducationHistoryItem = (index: number) =>
    updateField(
      "educationHistory",
      formValues.educationHistory.filter((_, itemIndex) => itemIndex !== index),
    );

  const removeItSkillItem = (index: number) =>
    updateField(
      "itSkills",
      formValues.itSkills.filter((_, itemIndex) => itemIndex !== index),
    );

  const removeProjectItem = (index: number) =>
    updateField(
      "projects",
      formValues.projects.filter((_, itemIndex) => itemIndex !== index),
    );

  const removeCertificationItem = (index: number) =>
    updateField(
      "certifications",
      formValues.certifications.filter((_, itemIndex) => itemIndex !== index),
    );

  const removeProfessionalQualificationItem = (index: number) =>
    updateField(
      "professionalQualifications",
      formValues.professionalQualifications.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );

  const removeLanguageItem = (index: number) =>
    updateField(
      "languages",
      formValues.languages.filter((_, itemIndex) => itemIndex !== index),
    );

  const handleSaveProfile = async () => {
    const validationResult = validateCandidateProfileValues(formValues);

    setFormValues(validationResult.normalized);
    setStringArrayFieldTexts(
      createStringArrayFieldTexts(validationResult.normalized),
    );

    if (!validationResult.isValid || !validationResult.record) {
      setErrors(validationResult.errors);
      setFormStatus({
        message: "Please fix the highlighted profile fields and try again.",
        type: "error",
      });
      return;
    }

    setErrors({});
    setFormStatus(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/candidate/profile", {
        body: JSON.stringify(validationResult.record),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
      const data = (await response.json().catch(() => null)) as
        | {
            errors?: CandidateProfileValidationErrors;
            message?: string;
          }
        | null;

      if (!response.ok) {
        setErrors(data?.errors ?? {});
        setFormStatus({
          message: data?.message ?? "Unable to save your profile right now.",
          type: "error",
        });
        return;
      }

      setFormStatus({
        message: data?.message ?? "Your candidate profile has been updated.",
        type: "success",
      });
      router.refresh();
    } catch {
      setFormStatus({
        message: "Network error. Please try again in a moment.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReplaceResumeClick = () => {
    setResumeStatus(null);
    resumeInputRef.current?.click();
  };

  const handleResumeFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;

    if (!selectedFile) {
      return;
    }

    setResumeStatus(null);

    const metadataValidation = validateResumeMetadata({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
    });

    if (metadataValidation.error) {
      setResumeStatus({
        message: metadataValidation.error,
        type: "error",
      });
      event.target.value = "";
      return;
    }

    const fileBytes = new Uint8Array(await selectedFile.arrayBuffer());
    const fileValidation = validateResumeFileBytes(fileBytes, selectedFile.name);

    if (fileValidation.error) {
      setResumeStatus({
        message: fileValidation.error,
        type: "error",
      });
      event.target.value = "";
      return;
    }

    setIsReplacingResume(true);

    try {
      const payload = new FormData();

      payload.set("resume", selectedFile);

      const response = await fetch("/api/candidate/resume", {
        body: payload,
        method: "POST",
      });
      const data = (await response.json().catch(() => null)) as
        | {
            message?: string;
            resumeBytes?: number;
            resumeExtension?: string;
            resumeOriginalName?: string;
            resumeUrl?: string;
          }
        | null;

      if (!response.ok) {
        setResumeStatus({
          message: data?.message ?? "Unable to replace your resume right now.",
          type: "error",
        });
        event.target.value = "";
        return;
      }

      setFormValues((currentValues) => ({
        ...currentValues,
        resumeBytes:
          typeof data?.resumeBytes === "number"
            ? data.resumeBytes
            : currentValues.resumeBytes,
        resumeExtension:
          typeof data?.resumeExtension === "string"
            ? data.resumeExtension
            : currentValues.resumeExtension,
        resumeOriginalName:
          typeof data?.resumeOriginalName === "string"
            ? data.resumeOriginalName
            : currentValues.resumeOriginalName,
        resumeUrl:
          typeof data?.resumeUrl === "string"
            ? data.resumeUrl
            : currentValues.resumeUrl,
      }));
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };

        delete nextErrors.resumeUrl;

        return nextErrors;
      });
      setResumeStatus({
        message: data?.message ?? "Your resume has been replaced successfully.",
        type: "success",
      });
      router.refresh();
    } catch {
      setResumeStatus({
        message: "Network error. Please try again in a moment.",
        type: "error",
      });
    } finally {
      setIsReplacingResume(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[30px] border border-[#dbe6f2] bg-white p-6 shadow-[0_20px_50px_rgba(29,34,63,0.06)] sm:p-7">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
            Profile Overview
          </p>
          <h2 className="mt-3 text-[32px] font-bold leading-[1.08] text-[#1d223f]">
            Add the complete candidate information recruiters expect
          </h2>
          <p className="mt-3 max-w-[760px] text-[15px] leading-[1.8] text-[#67728f]">
            This profile layout is based on the categories Foundit publicly lists
            for registered candidate profiles: basic information, education
            details, employment history, personal summary, skills, salary, and
            preferred job classifications and locations. The section set here is an
            implementation inferred from those official categories.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-[#eef8ff] px-4 py-2 text-[13px] font-semibold text-[#1d223f]">
              Profile strength {profileStrength}%
            </span>
            <span className="rounded-full bg-[#eef8ff] px-4 py-2 text-[13px] font-semibold text-[#1d223f]">
              {workStatusLabel}
            </span>
            <span className="rounded-full bg-[#eef8ff] px-4 py-2 text-[13px] font-semibold text-[#1d223f]">
              {meta.submittedLabel}
            </span>
            <span className="rounded-full bg-[#eef8ff] px-4 py-2 text-[13px] font-semibold text-[#1d223f]">
              {meta.joinedLabel}
            </span>
          </div>
        </div>

        <aside className="rounded-[30px] border border-[#dbe6f2] bg-white p-6 shadow-[0_20px_50px_rgba(29,34,63,0.06)] sm:p-7">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#eef8ff] text-[#00adef]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
                Save Changes
              </p>
              <h3 className="mt-1 text-[22px] font-bold text-[#1d223f]">
                Candidate profile
              </h3>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-[14px] text-[#67728f]">
            <p>
              Current saved profile:
              {" "}
              <span className="font-semibold text-[#1d223f]">
                {meta.hasSavedProfile ? "Available" : "Not saved yet"}
              </span>
            </p>
            <p>
              Resume:
              {" "}
              <span className="font-semibold text-[#1d223f]">
                {formValues.resumeOriginalName || "No resume linked"}
              </span>
            </p>
            <p>
              Resume size:
              {" "}
              <span className="font-semibold text-[#1d223f]">
                {formatCandidateProfileBytes(formValues.resumeBytes)}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#1d223f] px-6 py-3.5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#2a3158] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving profile..." : "Save profile"}
          </button>

          {formStatus ? (
            <p
              className={`mt-4 text-[14px] font-medium ${
                formStatus.type === "success"
                  ? "text-[#15803d]"
                  : "text-[#dc2626]"
              }`}
            >
              {formStatus.message}
            </p>
          ) : null}
        </aside>
      </section>

      <SectionCard
        icon={<UserRound className="h-5 w-5" />}
        isOpen={expandedSections.personal}
        onToggle={() => toggleSection("personal")}
        subtitle="Basic Information"
        title="Personal details"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field error={errors.fullName} label="Full Name*">
            <input
              type="text"
              value={formValues.fullName}
              className={getFieldClassName(Boolean(errors.fullName))}
              onChange={(event) => updateField("fullName", event.target.value)}
            />
          </Field>

          <Field error={errors.email} label="Email ID*">
            <input
              type="email"
              value={formValues.email}
              readOnly
              className={`${getFieldClassName(Boolean(errors.email))} cursor-not-allowed bg-[#eef3fb] text-[#67728f]`}
            />
          </Field>

          <Field error={errors.contactNumber} label="Mobile Number*">
            <input
              type="tel"
              value={formValues.contactNumber}
              className={getFieldClassName(Boolean(errors.contactNumber))}
              onChange={(event) =>
                updateField("contactNumber", event.target.value.replace(/\D/g, ""))
              }
            />
          </Field>

          <Field error={errors.currentLocation} label="Current Location*">
            <input
              type="text"
              value={formValues.currentLocation}
              className={getFieldClassName(Boolean(errors.currentLocation))}
              onChange={(event) =>
                updateField("currentLocation", event.target.value)
              }
            />
          </Field>

          <Field error={errors.gender} label="Gender">
            <select
              value={formValues.gender}
              className={getFieldClassName(Boolean(errors.gender))}
              onChange={(event) => updateField("gender", event.target.value)}
            >
              <option value="">Select gender</option>
              {candidateGenderOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field error={errors.dateOfBirth} label="Date of Birth">
            <input
              type="date"
              value={formValues.dateOfBirth}
              className={getFieldClassName(Boolean(errors.dateOfBirth))}
              onChange={(event) => updateField("dateOfBirth", event.target.value)}
            />
          </Field>

          <Field error={errors.linkedinUrl} label="LinkedIn URL">
            <input
              type="url"
              value={formValues.linkedinUrl}
              placeholder="https://www.linkedin.com/in/your-profile"
              className={getFieldClassName(Boolean(errors.linkedinUrl))}
              onChange={(event) => updateField("linkedinUrl", event.target.value)}
            />
          </Field>

          <Field error={errors.portfolioUrl} label="Portfolio / Website URL">
            <input
              type="url"
              value={formValues.portfolioUrl}
              placeholder="https://yourportfolio.com"
              className={getFieldClassName(Boolean(errors.portfolioUrl))}
              onChange={(event) => updateField("portfolioUrl", event.target.value)}
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field error={errors.homeAddress} label="Home Address">
            <textarea
              value={formValues.homeAddress}
              className={getFieldClassName(Boolean(errors.homeAddress), true)}
              onChange={(event) => updateField("homeAddress", event.target.value)}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        icon={<BriefcaseBusiness className="h-5 w-5" />}
        isOpen={expandedSections.career}
        onToggle={() => toggleSection("career")}
        subtitle="Career Profile"
        title="Headline, preferences, and current role"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field error={errors.profileHeadline} label="Profile Headline">
            <input
              type="text"
              value={formValues.profileHeadline}
              placeholder="Example: Senior Frontend Engineer | React | Next.js"
              className={getFieldClassName(Boolean(errors.profileHeadline))}
              onChange={(event) =>
                updateField("profileHeadline", event.target.value)
              }
            />
          </Field>

          <Field error={errors.noticePeriod} label="Notice Period">
            <select
              value={formValues.noticePeriod}
              className={getFieldClassName(Boolean(errors.noticePeriod))}
              onChange={(event) => updateField("noticePeriod", event.target.value)}
            >
              <option value="">Select notice period</option>
              {candidateNoticePeriodOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field error={errors.currentPosition} label="Current Position">
            <input
              type="text"
              value={formValues.currentPosition}
              className={getFieldClassName(Boolean(errors.currentPosition))}
              onChange={(event) => updateField("currentPosition", event.target.value)}
            />
          </Field>

          <Field error={errors.currentCompany} label="Current Company / Institute">
            <input
              type="text"
              value={formValues.currentCompany}
              className={getFieldClassName(Boolean(errors.currentCompany))}
              onChange={(event) => updateField("currentCompany", event.target.value)}
            />
          </Field>

          <Field
            error={errors.totalExperienceYears}
            label="Total Experience (Years)"
          >
            <input
              type="text"
              value={formValues.totalExperienceYears}
              className={getFieldClassName(Boolean(errors.totalExperienceYears))}
              onChange={(event) =>
                updateField(
                  "totalExperienceYears",
                  event.target.value.replace(/\D/g, ""),
                )
              }
            />
          </Field>

          <Field
            error={errors.totalExperienceMonths}
            label="Total Experience (Months)"
          >
            <input
              type="text"
              value={formValues.totalExperienceMonths}
              className={getFieldClassName(Boolean(errors.totalExperienceMonths))}
              onChange={(event) =>
                updateField(
                  "totalExperienceMonths",
                  event.target.value.replace(/\D/g, ""),
                )
              }
            />
          </Field>

          <Field error={errors.currentAnnualCtc} label="Current Annual CTC">
            <input
              type="text"
              value={formValues.currentAnnualCtc}
              placeholder="Example: 8 LPA"
              className={getFieldClassName(Boolean(errors.currentAnnualCtc))}
              onChange={(event) =>
                updateField("currentAnnualCtc", event.target.value)
              }
            />
          </Field>

          <Field error={errors.expectedAnnualCtc} label="Expected Annual CTC">
            <input
              type="text"
              value={formValues.expectedAnnualCtc}
              placeholder="Example: 12 LPA"
              className={getFieldClassName(Boolean(errors.expectedAnnualCtc))}
              onChange={(event) =>
                updateField("expectedAnnualCtc", event.target.value)
              }
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field error={errors.profileSummary} label="Profile Summary">
            <textarea
              value={formValues.profileSummary}
              placeholder="Add a concise summary about your experience, strengths, and preferred roles."
              className={getFieldClassName(Boolean(errors.profileSummary), true)}
              onChange={(event) => updateField("profileSummary", event.target.value)}
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Field error={errors.preferredJobTitles} label="Preferred Job Titles">
            <textarea
              value={stringArrayFieldTexts.preferredJobTitles}
              placeholder="Example: Frontend Engineer, UI Developer, Product Designer"
              className={getFieldClassName(
                Boolean(errors.preferredJobTitles),
                true,
              )}
              onChange={(event) =>
                updateStringArrayField("preferredJobTitles", event.target.value)
              }
            />
          </Field>

          <Field error={errors.preferredLocations} label="Preferred Locations">
            <textarea
              value={stringArrayFieldTexts.preferredLocations}
              placeholder="Example: Bangalore, Remote, Hyderabad"
              className={getFieldClassName(
                Boolean(errors.preferredLocations),
                true,
              )}
              onChange={(event) =>
                updateStringArrayField("preferredLocations", event.target.value)
              }
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Field
            error={errors.preferredEmploymentTypes}
            label="Preferred Employment Types"
          >
            <div className="mt-3 flex flex-wrap gap-3">
              {candidateEmploymentTypeOptions.map((option) => (
                <ChipToggle
                  key={option}
                  checked={formValues.preferredEmploymentTypes.includes(option)}
                  label={option}
                  onClick={() =>
                    toggleArraySelection("preferredEmploymentTypes", option)
                  }
                />
              ))}
            </div>
          </Field>

          <Field error={errors.preferredWorkModes} label="Preferred Work Modes">
            <div className="mt-3 flex flex-wrap gap-3">
              {candidateWorkModeOptions.map((option) => (
                <ChipToggle
                  key={option}
                  checked={formValues.preferredWorkModes.includes(option)}
                  label={option}
                  onClick={() => toggleArraySelection("preferredWorkModes", option)}
                />
              ))}
            </div>
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        icon={<Sparkles className="h-5 w-5" />}
        isOpen={expandedSections.skills}
        onToggle={() => toggleSection("skills")}
        subtitle="Skills"
        title="Key skills, IT skills, and languages"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <Field error={errors.keySkills} label="Key Skills">
            <textarea
              value={stringArrayFieldTexts.keySkills}
              placeholder="Example: React, TypeScript, Node.js, Product Strategy"
              className={getFieldClassName(Boolean(errors.keySkills), true)}
              onChange={(event) =>
                updateStringArrayField("keySkills", event.target.value)
              }
            />
          </Field>

          <div className="rounded-[24px] border border-[#dbe6f2] bg-[#f7fbff] p-5">
            <p className="text-[14px] font-semibold text-[#1d223f]">
              Language Skills
            </p>
            <div className="mt-4 space-y-4">
              {formValues.languages.map((language, index) => (
                <div
                  key={`language-${index + 1}`}
                  className="rounded-[20px] border border-[#dbe5f1] bg-white p-4"
                >
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto]">
                    <input
                      type="text"
                      value={language.language}
                      placeholder="Language"
                      className={getFieldClassName(Boolean(errors.languages))}
                      onChange={(event) =>
                        updateLanguageItem(index, "language", event.target.value)
                      }
                    />
                    <select
                      value={language.proficiency}
                      className={getFieldClassName(Boolean(errors.languages))}
                      onChange={(event) =>
                        updateLanguageItem(
                          index,
                          "proficiency",
                          event.target.value,
                        )
                      }
                    >
                      <option value="">Proficiency</option>
                      {candidateLanguageProficiencyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeLanguageItem(index)}
                      className="inline-flex h-[54px] items-center justify-center rounded-[16px] border border-[#f1c7c7] px-4 text-[#dc2626] transition-colors duration-200 hover:bg-[#fff5f5]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addLanguageItem}
                className="inline-flex items-center gap-2 rounded-full border border-[#dbe5f1] px-4 py-2 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                Add language
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-[#dbe6f2] bg-[#f7fbff] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-[#1d223f]">IT Skills</p>
              <p className="mt-1 text-[14px] text-[#67728f]">
                Add tools, technologies, versions, and the last used year.
              </p>
            </div>
            <button
              type="button"
              onClick={addItSkillItem}
              className="inline-flex items-center gap-2 rounded-full border border-[#dbe5f1] px-4 py-2 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-white"
            >
              <Plus className="h-4 w-4" />
              Add IT skill
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {formValues.itSkills.map((skill, index) => (
              <div
                key={`it-skill-${index + 1}`}
                className="rounded-[20px] border border-[#dbe5f1] bg-white p-4"
              >
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_180px_140px_120px_120px_auto]">
                  <input
                    type="text"
                    value={skill.skill}
                    placeholder="Skill"
                    className={getFieldClassName(Boolean(errors.itSkills))}
                    onChange={(event) =>
                      updateItSkillItem(index, "skill", event.target.value)
                    }
                  />
                  <input
                    type="text"
                    value={skill.version}
                    placeholder="Version"
                    className={getFieldClassName(Boolean(errors.itSkills))}
                    onChange={(event) =>
                      updateItSkillItem(index, "version", event.target.value)
                    }
                  />
                  <input
                    type="text"
                    value={skill.lastUsedYear}
                    placeholder="Last used year"
                    className={getFieldClassName(Boolean(errors.itSkills))}
                    onChange={(event) =>
                      updateItSkillItem(
                        index,
                        "lastUsedYear",
                        event.target.value.replace(/\D/g, ""),
                      )
                    }
                  />
                  <input
                    type="text"
                    value={skill.experienceYears}
                    placeholder="Years"
                    className={getFieldClassName(Boolean(errors.itSkills))}
                    onChange={(event) =>
                      updateItSkillItem(
                        index,
                        "experienceYears",
                        event.target.value.replace(/\D/g, ""),
                      )
                    }
                  />
                  <input
                    type="text"
                    value={skill.experienceMonths}
                    placeholder="Months"
                    className={getFieldClassName(Boolean(errors.itSkills))}
                    onChange={(event) =>
                      updateItSkillItem(
                        index,
                        "experienceMonths",
                        event.target.value.replace(/\D/g, ""),
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeItSkillItem(index)}
                    className="inline-flex h-[54px] items-center justify-center rounded-[16px] border border-[#f1c7c7] px-4 text-[#dc2626] transition-colors duration-200 hover:bg-[#fff5f5]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={<BriefcaseBusiness className="h-5 w-5" />}
        isOpen={expandedSections.employment}
        onToggle={() => toggleSection("employment")}
        subtitle="Work History"
        title="Employment history"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-[15px] leading-[1.7] text-[#67728f]">
            Add your company history, designation, dates, and responsibilities.
          </p>
          <button
            type="button"
            onClick={addEmploymentHistoryItem}
            className="inline-flex items-center gap-2 rounded-full border border-[#dbe5f1] px-4 py-2 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f8fbff]"
          >
            <Plus className="h-4 w-4" />
            Add employment
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {formValues.employmentHistory.map((item, index) => (
            <div
              key={`employment-${index + 1}`}
              className="rounded-[24px] border border-[#dbe6f2] bg-[#f7fbff] p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-[17px] font-semibold text-[#1d223f]">
                  Employment {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeEmploymentHistoryItem(index)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#f1c7c7] px-4 py-2 text-[14px] font-semibold text-[#dc2626] transition-colors duration-200 hover:bg-[#fff5f5]"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <input
                  type="text"
                  value={item.companyName}
                  placeholder="Company Name"
                  className={getFieldClassName(Boolean(errors.employmentHistory))}
                  onChange={(event) =>
                    updateEmploymentHistoryItem(
                      index,
                      "companyName",
                      event.target.value,
                    )
                  }
                />
                <input
                  type="text"
                  value={item.designation}
                  placeholder="Designation"
                  className={getFieldClassName(Boolean(errors.employmentHistory))}
                  onChange={(event) =>
                    updateEmploymentHistoryItem(
                      index,
                      "designation",
                      event.target.value,
                    )
                  }
                />
                <select
                  value={item.employmentType}
                  className={getFieldClassName(Boolean(errors.employmentHistory))}
                  onChange={(event) =>
                    updateEmploymentHistoryItem(
                      index,
                      "employmentType",
                      event.target.value,
                    )
                  }
                >
                  <option value="">Employment Type</option>
                  {candidateEmploymentTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={item.location}
                  placeholder="Location"
                  className={getFieldClassName(Boolean(errors.employmentHistory))}
                  onChange={(event) =>
                    updateEmploymentHistoryItem(index, "location", event.target.value)
                  }
                />
                <input
                  type="date"
                  value={item.startDate}
                  className={getFieldClassName(Boolean(errors.employmentHistory))}
                  onChange={(event) =>
                    updateEmploymentHistoryItem(index, "startDate", event.target.value)
                  }
                />
                <input
                  type="date"
                  value={item.endDate}
                  disabled={item.currentlyWorking}
                  className={`${getFieldClassName(Boolean(errors.employmentHistory))} ${
                    item.currentlyWorking ? "cursor-not-allowed bg-[#eef3fb]" : ""
                  }`}
                  onChange={(event) =>
                    updateEmploymentHistoryItem(index, "endDate", event.target.value)
                  }
                />
              </div>

              <label className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-[#1d223f]">
                <input
                  type="checkbox"
                  checked={item.currentlyWorking}
                  className="h-4 w-4 rounded border border-[#bcc8dd] accent-[#1d223f]"
                  onChange={(event) =>
                    updateEmploymentHistoryItem(
                      index,
                      "currentlyWorking",
                      event.target.checked,
                    )
                  }
                />
                I currently work here
              </label>

              <textarea
                value={item.description}
                placeholder="Describe responsibilities, impact, and achievements"
                className={`${getFieldClassName(
                  Boolean(errors.employmentHistory),
                  true,
                )} mt-4`}
                onChange={(event) =>
                  updateEmploymentHistoryItem(index, "description", event.target.value)
                }
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        icon={<GraduationCap className="h-5 w-5" />}
        isOpen={expandedSections.education}
        onToggle={() => toggleSection("education")}
        subtitle="Education"
        title="Education details"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-[15px] leading-[1.7] text-[#67728f]">
            Add academic history including degrees, institution, years, and scores.
          </p>
          <button
            type="button"
            onClick={addEducationHistoryItem}
            className="inline-flex items-center gap-2 rounded-full border border-[#dbe5f1] px-4 py-2 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f8fbff]"
          >
            <Plus className="h-4 w-4" />
            Add education
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {formValues.educationHistory.map((item, index) => (
            <div
              key={`education-${index + 1}`}
              className="rounded-[24px] border border-[#dbe6f2] bg-[#f7fbff] p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-[17px] font-semibold text-[#1d223f]">
                  Education {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeEducationHistoryItem(index)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#f1c7c7] px-4 py-2 text-[14px] font-semibold text-[#dc2626] transition-colors duration-200 hover:bg-[#fff5f5]"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <select
                  value={item.educationLevel}
                  className={getFieldClassName(Boolean(errors.educationHistory))}
                  onChange={(event) =>
                    updateEducationHistoryItem(
                      index,
                      "educationLevel",
                      event.target.value,
                    )
                  }
                >
                  <option value="">Education Level</option>
                  {candidateEducationLevelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={item.degree}
                  placeholder="Degree"
                  className={getFieldClassName(Boolean(errors.educationHistory))}
                  onChange={(event) =>
                    updateEducationHistoryItem(index, "degree", event.target.value)
                  }
                />
                <input
                  type="text"
                  value={item.specialization}
                  placeholder="Specialization"
                  className={getFieldClassName(Boolean(errors.educationHistory))}
                  onChange={(event) =>
                    updateEducationHistoryItem(
                      index,
                      "specialization",
                      event.target.value,
                    )
                  }
                />
                <input
                  type="text"
                  value={item.institution}
                  placeholder="Institution"
                  className={getFieldClassName(Boolean(errors.educationHistory))}
                  onChange={(event) =>
                    updateEducationHistoryItem(
                      index,
                      "institution",
                      event.target.value,
                    )
                  }
                />
                <input
                  type="text"
                  value={item.startYear}
                  placeholder="Start Year"
                  className={getFieldClassName(Boolean(errors.educationHistory))}
                  onChange={(event) =>
                    updateEducationHistoryItem(
                      index,
                      "startYear",
                      event.target.value.replace(/\D/g, ""),
                    )
                  }
                />
                <input
                  type="text"
                  value={item.endYear}
                  placeholder="End Year"
                  className={getFieldClassName(Boolean(errors.educationHistory))}
                  onChange={(event) =>
                    updateEducationHistoryItem(
                      index,
                      "endYear",
                      event.target.value.replace(/\D/g, ""),
                    )
                  }
                />
                <input
                  type="text"
                  value={item.gradingType}
                  placeholder="Grading Type"
                  className={getFieldClassName(Boolean(errors.educationHistory))}
                  onChange={(event) =>
                    updateEducationHistoryItem(
                      index,
                      "gradingType",
                      event.target.value,
                    )
                  }
                />
                <input
                  type="text"
                  value={item.score}
                  placeholder="Score / Percentage / CGPA"
                  className={getFieldClassName(Boolean(errors.educationHistory))}
                  onChange={(event) =>
                    updateEducationHistoryItem(index, "score", event.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        icon={<FileText className="h-5 w-5" />}
        isOpen={expandedSections.projects}
        onToggle={() => toggleSection("projects")}
        subtitle="Projects"
        title="Projects and portfolio work"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-[15px] leading-[1.7] text-[#67728f]">
            Share project name, role, tech stack, dates, and contribution summary.
          </p>
          <button
            type="button"
            onClick={addProjectItem}
            className="inline-flex items-center gap-2 rounded-full border border-[#dbe5f1] px-4 py-2 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f8fbff]"
          >
            <Plus className="h-4 w-4" />
            Add project
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {formValues.projects.map((item, index) => (
            <div
              key={`project-${index + 1}`}
              className="rounded-[24px] border border-[#dbe6f2] bg-[#f7fbff] p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-[17px] font-semibold text-[#1d223f]">
                  Project {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeProjectItem(index)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#f1c7c7] px-4 py-2 text-[14px] font-semibold text-[#dc2626] transition-colors duration-200 hover:bg-[#fff5f5]"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <input
                  type="text"
                  value={item.title}
                  placeholder="Project Title"
                  className={getFieldClassName(Boolean(errors.projects))}
                  onChange={(event) =>
                    updateProjectItem(index, "title", event.target.value)
                  }
                />
                <input
                  type="text"
                  value={item.role}
                  placeholder="Your Role"
                  className={getFieldClassName(Boolean(errors.projects))}
                  onChange={(event) =>
                    updateProjectItem(index, "role", event.target.value)
                  }
                />
                <input
                  type="text"
                  value={item.technologies}
                  placeholder="Technologies Used"
                  className={getFieldClassName(Boolean(errors.projects))}
                  onChange={(event) =>
                    updateProjectItem(index, "technologies", event.target.value)
                  }
                />
                <input
                  type="date"
                  value={item.startDate}
                  className={getFieldClassName(Boolean(errors.projects))}
                  onChange={(event) =>
                    updateProjectItem(index, "startDate", event.target.value)
                  }
                />
                <input
                  type="date"
                  value={item.endDate}
                  className={getFieldClassName(Boolean(errors.projects))}
                  onChange={(event) =>
                    updateProjectItem(index, "endDate", event.target.value)
                  }
                />
              </div>

              <textarea
                value={item.description}
                placeholder="Describe the project scope and your contribution"
                className={`${getFieldClassName(Boolean(errors.projects), true)} mt-4`}
                onChange={(event) =>
                  updateProjectItem(index, "description", event.target.value)
                }
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        icon={<CheckCircle2 className="h-5 w-5" />}
        isOpen={expandedSections.credentials}
        onToggle={() => toggleSection("credentials")}
        subtitle="Qualifications"
        title="Professional qualifications, certifications, and resume"
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-[24px] border border-[#dbe6f2] bg-[#f7fbff] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#1d223f]">
                  Professional Qualifications
                </p>
                <p className="mt-1 text-[14px] text-[#67728f]">
                  Add workshops, diplomas, or special credentials.
                </p>
              </div>
              <button
                type="button"
                onClick={addProfessionalQualificationItem}
                className="inline-flex items-center gap-2 rounded-full border border-[#dbe5f1] px-4 py-2 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {formValues.professionalQualifications.map((item, index) => (
                <div
                  key={`qualification-${index + 1}`}
                  className="rounded-[20px] border border-[#dbe5f1] bg-white p-4"
                >
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_140px_auto]">
                    <input
                      type="text"
                      value={item.title}
                      placeholder="Qualification Title"
                      className={getFieldClassName(
                        Boolean(errors.professionalQualifications),
                      )}
                      onChange={(event) =>
                        updateProfessionalQualificationItem(
                          index,
                          "title",
                          event.target.value,
                        )
                      }
                    />
                    <input
                      type="text"
                      value={item.institution}
                      placeholder="Institution"
                      className={getFieldClassName(
                        Boolean(errors.professionalQualifications),
                      )}
                      onChange={(event) =>
                        updateProfessionalQualificationItem(
                          index,
                          "institution",
                          event.target.value,
                        )
                      }
                    />
                    <input
                      type="text"
                      value={item.year}
                      placeholder="Year"
                      className={getFieldClassName(
                        Boolean(errors.professionalQualifications),
                      )}
                      onChange={(event) =>
                        updateProfessionalQualificationItem(
                          index,
                          "year",
                          event.target.value.replace(/\D/g, ""),
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeProfessionalQualificationItem(index)}
                      className="inline-flex h-[54px] items-center justify-center rounded-[16px] border border-[#f1c7c7] px-4 text-[#dc2626] transition-colors duration-200 hover:bg-[#fff5f5]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#dbe6f2] bg-[#f7fbff] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#1d223f]">
                  Certifications
                </p>
                <p className="mt-1 text-[14px] text-[#67728f]">
                  Add certification name, issuer, credential ID, and year.
                </p>
              </div>
              <button
                type="button"
                onClick={addCertificationItem}
                className="inline-flex items-center gap-2 rounded-full border border-[#dbe5f1] px-4 py-2 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {formValues.certifications.map((item, index) => (
                <div
                  key={`certification-${index + 1}`}
                  className="rounded-[20px] border border-[#dbe5f1] bg-white p-4"
                >
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_140px_180px_auto]">
                    <input
                      type="text"
                      value={item.name}
                      placeholder="Certification Name"
                      className={getFieldClassName(Boolean(errors.certifications))}
                      onChange={(event) =>
                        updateCertificationItem(index, "name", event.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={item.issuer}
                      placeholder="Issuer"
                      className={getFieldClassName(Boolean(errors.certifications))}
                      onChange={(event) =>
                        updateCertificationItem(index, "issuer", event.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={item.year}
                      placeholder="Year"
                      className={getFieldClassName(Boolean(errors.certifications))}
                      onChange={(event) =>
                        updateCertificationItem(
                          index,
                          "year",
                          event.target.value.replace(/\D/g, ""),
                        )
                      }
                    />
                    <input
                      type="text"
                      value={item.credentialId}
                      placeholder="Credential ID"
                      className={getFieldClassName(Boolean(errors.certifications))}
                      onChange={(event) =>
                        updateCertificationItem(
                          index,
                          "credentialId",
                          event.target.value,
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeCertificationItem(index)}
                      className="inline-flex h-[54px] items-center justify-center rounded-[16px] border border-[#f1c7c7] px-4 text-[#dc2626] transition-colors duration-200 hover:bg-[#fff5f5]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-[#dbe6f2] bg-[#f7fbff] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-[#1d223f]">Resume</p>
              <p className="mt-1 text-[14px] text-[#67728f]">
                Your resume stays visible here for recruiter review. You can also
                replace it with an updated PDF or Word file.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {formValues.resumeUrl ? (
                <a
                  href="/api/candidate/resume"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1d223f] px-4 py-2 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-[#2a3158]"
                >
                  <Download className="h-4 w-4" />
                  View resume
                </a>
              ) : null}
              <button
                type="button"
                onClick={handleReplaceResumeClick}
                disabled={isReplacingResume}
                className="inline-flex items-center gap-2 rounded-full border border-[#dbe5f1] bg-white px-4 py-2 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#eef8ff] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Upload className="h-4 w-4" />
                {isReplacingResume ? "Replacing..." : "Replace resume"}
              </button>
              <input
                ref={resumeInputRef}
                type="file"
                accept={resumeFileAcceptAttribute}
                className="hidden"
                onChange={handleResumeFileChange}
              />
            </div>
          </div>

          <p className="mt-4 text-[13px] text-[#7b87a4]">{jobSeekerResumeHelpText}</p>
          {resumeStatus ? (
            <p
              className={`mt-3 text-[14px] font-medium ${
                resumeStatus.type === "success"
                  ? "text-[#15803d]"
                  : "text-[#dc2626]"
              }`}
            >
              {resumeStatus.message}
            </p>
          ) : null}

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-[20px] bg-white p-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7b87a4]">
                File Name
              </p>
              <p className="mt-2 text-[15px] font-semibold text-[#1d223f]">
                {formValues.resumeOriginalName || "No resume linked"}
              </p>
            </div>
            <div className="rounded-[20px] bg-white p-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7b87a4]">
                Extension
              </p>
              <p className="mt-2 text-[15px] font-semibold text-[#1d223f]">
                {formValues.resumeExtension || "N/A"}
              </p>
            </div>
            <div className="rounded-[20px] bg-white p-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7b87a4]">
                Size
              </p>
              <p className="mt-2 text-[15px] font-semibold text-[#1d223f]">
                {formatCandidateProfileBytes(formValues.resumeBytes)}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-[#dbe6f2] bg-white px-6 py-5 shadow-[0_20px_50px_rgba(29,34,63,0.06)]">
        <div>
          <p className="text-[18px] font-semibold text-[#1d223f]">
            Candidate profile save
          </p>
          <p className="mt-1 text-[14px] text-[#67728f]">
            Save after updating all the sections you want recruiters to see.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="inline-flex items-center gap-3 rounded-full bg-[#1d223f] px-6 py-3.5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#2a3158] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving profile..." : "Save profile"}
        </button>
      </div>
    </div>
  );
};
