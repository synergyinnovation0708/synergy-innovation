"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  isJobSeekerPasswordValid,
  jobSeekerInquiryInitialValues,
  jobSeekerPasswordRequirementText,
  jobSeekerResumeHelpText,
  resumeFileAcceptAttribute,
  validateJobSeekerInquiryValues,
  validateResumeMetadata,
  type JobSeekerFieldName,
  type JobSeekerFormValues,
  type JobSeekerValidationErrors,
} from "@/lib/job-seeker-inquiries";
import { FooterSection } from "../HomePage/sections/FooterSection";

type CandidateRegistrationPageProps = {
  initialJobTitle?: string;
};

type WorkStatus = "experienced" | "fresher";

type FormStatus = {
  message: string;
  type: "error" | "success";
};

const inputClassName =
  "mt-2 h-[58px] w-full rounded-[18px] border border-[#dbe5f1] bg-[#f8fbff] px-4 text-[15px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8a96b2] focus:border-[#00adef] focus:bg-white";

const getFieldClassName = (hasError: boolean) =>
  `${inputClassName} ${hasError ? "border-[#dc2626] focus:border-[#dc2626]" : ""}`;

const statusCards: Array<{
  description: string;
  id: WorkStatus;
  title: string;
}> = [
  {
    description: "I have work experience after graduation.",
    id: "experienced",
    title: "I'm experienced",
  },
  {
    description: "I am a student or starting my first full-time role.",
    id: "fresher",
    title: "I'm a fresher",
  },
];

const benefitPoints = [
  "Build one complete candidate profile for recruiter review",
  "Upload your resume once and share it across multiple opportunities",
  "Let the Synergy hiring team contact you faster for matching roles",
];

export const CandidateRegistrationPage = ({
  initialJobTitle = "",
}: CandidateRegistrationPageProps) => {
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const [workStatus, setWorkStatus] = useState<WorkStatus>("experienced");
  const [formValues, setFormValues] = useState<JobSeekerFormValues>({
    ...jobSeekerInquiryInitialValues,
    currentPosition: initialJobTitle || "",
  });
  const [errors, setErrors] = useState<JobSeekerValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<FormStatus | null>(null);
  const isPasswordRequirementMet = isJobSeekerPasswordValid(formValues.password);
  const companyLabel =
    workStatus === "experienced"
      ? "Current Company*"
      : "College / Institute*";

  const resetResume = () => {
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }

    setResumeFile(null);
    setResumeFileName(null);
  };

  const updateFieldValue = (
    fieldName: Exclude<JobSeekerFieldName, "resume">,
    value: string,
  ) => {
    const nextValues = {
      ...formValues,
      [fieldName]:
        fieldName === "contact" ? value.replace(/\D/g, "") : value,
    };

    setFormValues(nextValues);
    setFormStatus(null);

    if (errors[fieldName]) {
      const nextError = validateJobSeekerInquiryValues(nextValues, {
        requirePassword: true,
      }).errors[fieldName];

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

  const handleFieldBlur = (fieldName: Exclude<JobSeekerFieldName, "resume">) => {
    const validationResult = validateJobSeekerInquiryValues(formValues, {
      requirePassword: true,
    });

    setFormValues(validationResult.normalized);

    if (errors[fieldName]) {
      const nextError = validationResult.errors[fieldName];

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

  const handleResumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setFormStatus(null);

    const validationResult = validateResumeMetadata(
      file
        ? {
            name: file.name,
            size: file.size,
            type: file.type,
          }
        : null,
    );

    if (validationResult.error || !file) {
      resetResume();
      setErrors((currentErrors) => ({
        ...currentErrors,
        resume: validationResult.error ?? "Resume is required.",
      }));
      return;
    }

    setResumeFile(file);
    setResumeFileName(file.name);
    setErrors((currentErrors) => {
      if (!currentErrors.resume) {
        return currentErrors;
      }

      const updatedErrors = { ...currentErrors };
      delete updatedErrors.resume;
      return updatedErrors;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submissionValues =
      workStatus === "fresher"
        ? {
            ...formValues,
            currentPosition:
              formValues.currentPosition.trim() ||
              initialJobTitle ||
              "Fresher Candidate",
          }
        : formValues;
    const validationResult = validateJobSeekerInquiryValues(submissionValues, {
      requirePassword: true,
    });
    const resumeValidation = validateResumeMetadata(
      resumeFile
        ? {
            name: resumeFile.name,
            size: resumeFile.size,
            type: resumeFile.type,
          }
        : null,
    );
    const nextErrors: JobSeekerValidationErrors = {
      ...validationResult.errors,
    };

    setFormValues(validationResult.normalized);

    if (resumeValidation.error) {
      nextErrors.resume = resumeValidation.error;
    }

    if (Object.keys(nextErrors).length > 0 || !validationResult.record) {
      setErrors(nextErrors);
      setFormStatus({
        message: "Please fix the highlighted fields and try again.",
        type: "error",
      });
      return;
    }

    setErrors({});
    setFormStatus(null);
    setIsSubmitting(true);

    try {
      const selectedResumeFile = resumeFile;

      if (!selectedResumeFile) {
        setErrors({
          resume: "Resume is required.",
        });
        setFormStatus({
          message: "Please upload your resume and try again.",
          type: "error",
        });
        return;
      }

      const formData = new FormData();

      formData.append("name", validationResult.normalized.name);
      formData.append("email", validationResult.normalized.email);
      formData.append("contact", validationResult.normalized.contact);
      formData.append(
        "currentPosition",
        validationResult.normalized.currentPosition,
      );
      formData.append(
        "currentCompany",
        validationResult.normalized.currentCompany,
      );
      formData.append("password", validationResult.normalized.password);
      formData.append("resume", selectedResumeFile);

      const response = await fetch("/api/job-seeker-inquiries", {
        body: formData,
        method: "POST",
      });
      const data = (await response.json().catch(() => null)) as
        | {
            errors?: JobSeekerValidationErrors;
            message?: string;
          }
        | null;

      if (!response.ok) {
        setErrors(data?.errors ?? {});
        setFormStatus({
          message: data?.message ?? "Unable to create your profile right now.",
          type: "error",
        });
        return;
      }

      setFormValues(jobSeekerInquiryInitialValues);
      setErrors({});
      resetResume();
      setFormStatus({
        message:
          data?.message ??
          "Your candidate profile has been submitted successfully.",
        type: "success",
      });
    } catch {
      setFormStatus({
        message: "Network error. Please try again in a moment.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef7ff_0%,#f8fbff_32%,#ffffff_100%)] text-[#1d223f]">
      <header className="hidden border-b border-[#dbe6f1] bg-white/90 backdrop-blur-sm lg:block">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo1 3.png"
              alt="Synergy Innovation"
              width={190}
              height={56}
              className="h-[44px] w-auto object-contain"
              priority
            />
          </Link>

          <div className="text-right">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7a87a4]">
              Already exploring roles?
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
              <Link
                href="/candidate/login"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#1d223f] transition-colors duration-200 hover:text-[#00adef]"
              >
                Candidate login
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#00adef] transition-colors duration-200 hover:text-[#1d223f]"
              >
                Browse jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-6 sm:px-6 lg:max-w-[1380px] lg:px-8 lg:py-10">
        <div className="gap-6 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="hidden overflow-hidden rounded-[36px] bg-[linear-gradient(180deg,#1d223f_0%,#11162d_100%)] p-6 text-white shadow-[0_28px_70px_rgba(29,34,63,0.22)] sm:p-8 lg:block">
            <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.16em] text-[#86ddff]">
              Candidate Registration
            </span>
            <h1 className="mt-6 text-[30px] font-bold leading-[1.10] sm:text-[48px]">
Build Profile, Unlock Opportunities
            </h1>
            <p className="mt-4 max-w-[520px] text-[16px] leading-[1.8] text-white/72 sm:text-[17px]">
              Build one clean profile, upload your resume, and let the Synergy
              team connect you with roles that fit your experience and goals.
            </p>

            {initialJobTitle ? (
              <div className="mt-6 rounded-[24px] border border-white/12 bg-white/8 p-5">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#86ddff]">
                  Role of Interest
                </p>
                <p className="mt-2 text-[22px] font-semibold text-white">
                  {initialJobTitle}
                </p>
              </div>
            ) : null}

            <div className="mt-8 space-y-4">
              {benefitPoints.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/6 p-4"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-[#00adef]/18 text-[#86ddff]">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <p className="text-[15px] leading-[1.7] text-white/78">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <ShieldCheck className="h-6 w-6 text-[#86ddff]" />
                <p className="mt-4 text-[14px] font-semibold uppercase tracking-[0.12em] text-[#86ddff]">
                  Secure Resume Upload
                </p>
                <p className="mt-2 text-[14px] leading-[1.7] text-white/70">
                  PDF and Word resume upload with validation before submission.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <BriefcaseBusiness className="h-6 w-6 text-[#86ddff]" />
                <p className="mt-4 text-[14px] font-semibold uppercase tracking-[0.12em] text-[#86ddff]">
                  Faster Recruiter Reach
                </p>
                <p className="mt-2 text-[14px] leading-[1.7] text-white/70">
                  Your profile goes straight to the Synergy recruitment workflow.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[36px] border border-[#dde7f2] bg-white p-6 shadow-[0_24px_60px_rgba(29,34,63,0.08)] sm:p-8">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
              Create Profile
            </p>
            <h2 className="mt-3 text-[34px] font-bold leading-[1.08] text-[#1d223f] sm:text-[42px]">
              Register as a candidate
            </h2>
            <p className="mt-3 max-w-[620px] text-[15px] leading-[1.8] text-[#66728f]">
              Share your details, choose your work status, and upload your resume.
              Our team will review your profile and connect on matching roles.
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-[15px] font-semibold text-[#1d223f]">
                    Full Name*
                  </label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7a87a4]" />
                    <input
                      type="text"
                      value={formValues.name}
                      placeholder="What is your name?"
                      className={`${getFieldClassName(Boolean(errors.name))} pl-11`}
                      onBlur={() => handleFieldBlur("name")}
                      onChange={(event) => updateFieldValue("name", event.target.value)}
                    />
                  </div>
                  {errors.name ? (
                    <p className="mt-2 text-sm text-[#dc2626]">{errors.name}</p>
                  ) : null}
                </div>

                <div>
                  <label className="text-[15px] font-semibold text-[#1d223f]">
                    Email ID*
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7a87a4]" />
                    <input
                      type="email"
                      value={formValues.email}
                      placeholder="Tell us your Email ID"
                      className={`${getFieldClassName(Boolean(errors.email))} pl-11`}
                      onBlur={() => handleFieldBlur("email")}
                      onChange={(event) => updateFieldValue("email", event.target.value)}
                    />
                  </div>
                  {errors.email ? (
                    <p className="mt-2 text-sm text-[#dc2626]">{errors.email}</p>
                  ) : (
                    <p className="mt-2 text-sm text-[#8a96b2]">
                      We&apos;ll share relevant roles and updates on this email.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[15px] font-semibold text-[#1d223f]">
                    Mobile Number*
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7a87a4]" />
                    <input
                      type="tel"
                      value={formValues.contact}
                      placeholder="Enter your mobile number"
                      className={`${getFieldClassName(Boolean(errors.contact))} pl-11`}
                      onBlur={() => handleFieldBlur("contact")}
                      onChange={(event) => updateFieldValue("contact", event.target.value)}
                    />
                  </div>
                  {errors.contact ? (
                    <p className="mt-2 text-sm text-[#dc2626]">{errors.contact}</p>
                  ) : (
                    <p className="mt-2 text-sm text-[#8a96b2]">
                      Recruiters will contact you on this number.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[15px] font-semibold text-[#1d223f]">
                    Password*
                  </label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7a87a4]" />
                    <input
                      type="password"
                      value={formValues.password}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      className={`${getFieldClassName(Boolean(errors.password))} pl-11`}
                      onBlur={() => handleFieldBlur("password")}
                      onChange={(event) =>
                        updateFieldValue("password", event.target.value)
                      }
                    />
                  </div>
                  {errors.password ? (
                    <p className="mt-2 text-sm text-[#dc2626]">
                      {errors.password}
                    </p>
                  ) : formValues.password && isPasswordRequirementMet ? (
                    <p className="mt-2 text-sm text-[#15803d]">
                      Password requirements are met.
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-[#8a96b2]">
                      {jobSeekerPasswordRequirementText}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[15px] font-semibold text-[#1d223f]">
                  Work Status*
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {statusCards.map((statusCard) => {
                    const isSelected = workStatus === statusCard.id;
                    const Icon =
                      statusCard.id === "experienced"
                        ? BriefcaseBusiness
                        : GraduationCap;

                    return (
                      <button
                        key={statusCard.id}
                        type="button"
                        onClick={() => {
                          setWorkStatus(statusCard.id);

                          if (
                            statusCard.id === "fresher" &&
                            initialJobTitle &&
                            !formValues.currentPosition.trim()
                          ) {
                            updateFieldValue("currentPosition", initialJobTitle);
                          }
                        }}
                        className={`rounded-[24px] border p-5 text-left transition-colors duration-200 ${
                          isSelected
                            ? "border-[#1d223f] bg-[#f6f9ff]"
                            : "border-[#dbe5f1] bg-white hover:bg-[#f8fbff]"
                        }`}
                      >
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#eef8ff] text-[#00adef]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <p className="mt-4 text-[18px] font-semibold text-[#1d223f]">
                          {statusCard.title}
                        </p>
                        <p className="mt-2 text-[14px] leading-[1.7] text-[#66728f]">
                          {statusCard.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {workStatus === "experienced" ? (
                    <div>
                      <label className="text-[15px] font-semibold text-[#1d223f]">
                        Current Position*
                      </label>
                      <input
                        type="text"
                        value={formValues.currentPosition}
                        placeholder="Current Position"
                        className={getFieldClassName(Boolean(errors.currentPosition))}
                        onBlur={() => handleFieldBlur("currentPosition")}
                        onChange={(event) =>
                          updateFieldValue("currentPosition", event.target.value)
                        }
                      />
                      {errors.currentPosition ? (
                        <p className="mt-2 text-sm text-[#dc2626]">
                          {errors.currentPosition}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <div>
                    <label className="text-[15px] font-semibold text-[#1d223f]">
                      {companyLabel}
                    </label>
                    <input
                      type="text"
                      value={formValues.currentCompany}
                    placeholder={
                      workStatus === "experienced"
                        ? "Current Company"
                        : "College / Institute"
                    }
                    className={getFieldClassName(Boolean(errors.currentCompany))}
                    onBlur={() => handleFieldBlur("currentCompany")}
                    onChange={(event) =>
                      updateFieldValue("currentCompany", event.target.value)
                    }
                  />
                  {errors.currentCompany ? (
                    <p className="mt-2 text-sm text-[#dc2626]">
                      {errors.currentCompany}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <p className="text-[15px] font-semibold text-[#1d223f]">
                  Resume*
                </p>
                <label
                  htmlFor="candidate-resume"
                  className={`mt-3 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed px-6 py-8 text-center transition-colors duration-200 ${
                    errors.resume
                      ? "border-[#dc2626] bg-[#fff7f7]"
                      : "border-[#dbe5f1] bg-[#f8fbff] hover:border-[#00adef]"
                  }`}
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-[18px] bg-white text-[#00adef] shadow-[0_12px_24px_rgba(29,34,63,0.08)]">
                    <Upload className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-[17px] font-semibold text-[#1d223f]">
                    {resumeFileName ?? "Upload your resume"}
                  </p>
                  <p className="mt-2 max-w-[360px] text-[14px] leading-[1.7] text-[#66728f]">
                    Drag-free quick upload. PDF, DOC, or DOCX only.
                  </p>
                  <p
                    className={`mt-3 text-sm ${
                      errors.resume ? "text-[#dc2626]" : "text-[#8a96b2]"
                    }`}
                  >
                    {errors.resume ?? jobSeekerResumeHelpText}
                  </p>
                </label>
                <input
                  id="candidate-resume"
                  type="file"
                  ref={resumeInputRef}
                  accept={resumeFileAcceptAttribute}
                  className="sr-only"
                  onChange={handleResumeChange}
                />
              </div>

              <p className="text-[14px] leading-[1.7] text-[#66728f]">
                By submitting this form, you allow the Synergy team to contact you
                regarding relevant opportunities and profile updates.
              </p>

              {formStatus ? (
                <p
                  className={`text-[15px] font-medium ${
                    formStatus.type === "success"
                      ? "text-[#15803d]"
                      : "text-[#dc2626]"
                  }`}
                >
                  {formStatus.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex min-h-[56px] items-center gap-3 rounded-full bg-[#1d223f] pl-6 pr-2 text-[16px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Creating profile..." : "Register now"}
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/10">
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </button>

              <p className="text-[14px] leading-[1.7] text-[#66728f]">
                Already registered?
                {" "}
                <Link
                  href="/candidate/login"
                  className="font-semibold text-[#00adef] transition-colors duration-200 hover:text-[#1d223f]"
                >
                  Sign in to your candidate profile
                </Link>
              </p>
            </form>
          </section>
        </div>
      </main>

      <div className="hidden lg:block">
        <FooterSection />
      </div>
    </div>
  );
};
