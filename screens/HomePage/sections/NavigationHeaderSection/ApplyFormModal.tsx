"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  Upload,
  Users,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  employerHiringTypes,
  employerInquiryInitialValues,
  employerLocations,
  normalizeEmployerInquiryValues,
  validateEmployerInquiryValues,
  type EmployerInquiryFieldName,
  type EmployerInquiryFormValues,
  type EmployerInquiryValidationErrors,
} from "@/lib/employer-inquiries";
import {
  jobSeekerInquiryInitialValues,
  jobSeekerResumeHelpText,
  resumeFileAcceptAttribute,
  validateJobSeekerInquiryValues,
  validateResumeMetadata,
  type JobSeekerFieldName,
  type JobSeekerFormValues,
  type JobSeekerValidationErrors,
} from "@/lib/job-seeker-inquiries";

export type ApplyFormTab = "employer" | "jobSeeker";

type ApplyFormModalProps = {
  activeTab: ApplyFormTab;
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: ApplyFormTab) => void;
};

type FormField = {
  autoComplete?: string;
  inputMode?: "email" | "numeric" | "tel" | "text";
  label: string;
  name: string;
  type?: "email" | "file" | "number" | "tel" | "text";
};

const inputClassName =
  "h-[58px] w-full rounded-[16px] border border-[#e7ebf3] bg-white px-4 text-[15px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8f97ad] focus:border-[#1d223f]/60";

const formCopy = {
  employer: {
    description:
      "Share your details and our recruitment team will reach out within 24 hours.",
    eyebrow: "Need Talent Fast?",
    submitLabel: "Request Talent Support",
    title: "We Help You Hire Smarter",
  },
  jobSeeker: {
    description:
      "Share your details and our recruitment team will reach out within 24 hours.",
    eyebrow: "Looking for the Right Job?",
    submitLabel: "Request Job Assistance",
    title: "We Help You Get Hired Faster",
  },
} satisfies Record<
  ApplyFormTab,
  {
    description: string;
    eyebrow: string;
    submitLabel: string;
    title: string;
  }
>;

const tabButtonClassName =
  "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-5 text-[14px] font-semibold uppercase tracking-[0.02em] transition-all duration-200 sm:px-6";

const hiringLocationsPlaceholder = `Hiring Locations* (${employerLocations.join(", ")})`;

const getFieldClassName = (hasError: boolean) =>
  `${inputClassName} ${
    hasError ? "border-[#dc2626] focus:border-[#dc2626]" : ""
  }`;

type ApplyTabButtonProps = {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
};

const ApplyTabButton = ({
  children,
  isActive,
  onClick,
}: ApplyTabButtonProps) => {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={`${tabButtonClassName} ${
        isActive
          ? "bg-white text-[#1d223f] shadow-[0_12px_24px_rgba(29,34,63,0.16)]"
          : "text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
};

type TextInputProps = {
  disabled?: boolean;
  error?: string;
  field: FormField;
  onBlur?: () => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};

const TextInput = ({
  disabled,
  error,
  field,
  onBlur,
  onChange,
  value,
}: TextInputProps) => {
  const inputValue = value !== undefined ? { value } : {};

  return (
    <div>
      <label htmlFor={field.name} className="sr-only">
        {field.label}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={field.type ?? "text"}
        placeholder={field.label}
        inputMode={field.inputMode}
        autoComplete={field.autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${field.name}-error` : undefined}
        className={getFieldClassName(Boolean(error))}
        disabled={disabled}
        onBlur={onBlur}
        onChange={onChange}
        {...inputValue}
      />
      {error ? (
        <p id={`${field.name}-error`} className="mt-2 text-sm text-[#dc2626]">
          {error}
        </p>
      ) : null}
    </div>
  );
};

type FileInputProps = {
  disabled?: boolean;
  error?: string;
  fileName: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const FileInput = ({
  disabled,
  error,
  fileName,
  inputRef,
  onChange,
}: FileInputProps) => {
  return (
    <div>
      <label htmlFor="resume" className="sr-only">
        Upload Your CV*
      </label>
      <label
        htmlFor="resume"
        className={`${getFieldClassName(Boolean(error))} flex cursor-pointer items-center justify-between gap-4 ${
          disabled ? "cursor-not-allowed opacity-70" : ""
        }`}
      >
        <span className="truncate text-left text-[#8f97ad]">
          {fileName ?? "Upload Your CV*"}
        </span>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1d223f]/12 bg-[#f5f7fb] text-[#1d223f]">
          <Upload className="h-4 w-4" />
        </span>
      </label>
      <input
        id="resume"
        name="resume"
        type="file"
        ref={inputRef}
        accept={resumeFileAcceptAttribute}
        className="sr-only"
        disabled={disabled}
        onChange={onChange}
      />
      <p
        className={`mt-2 text-sm ${
          error ? "text-[#dc2626]" : "text-[#8f97ad]"
        }`}
      >
        {error ?? jobSeekerResumeHelpText}
      </p>
    </div>
  );
};

type FormStatus = {
  message: string;
  type: "error" | "success";
};

const jobSeekerInputFields: Record<
  Exclude<keyof JobSeekerFormValues, "password">,
  FormField
> = {
  contact: {
    autoComplete: "tel",
    inputMode: "tel",
    label: "Contact*",
    name: "contact",
    type: "tel",
  },
  currentCompany: {
    autoComplete: "organization",
    label: "Current Company*",
    name: "currentCompany",
  },
  currentPosition: {
    label: "Current Position*",
    name: "currentPosition",
  },
  email: {
    autoComplete: "email",
    inputMode: "email",
    label: "Email*",
    name: "email",
    type: "email",
  },
  name: {
    autoComplete: "name",
    label: "Name*",
    name: "name",
  },
};

const employerInputFields: Record<
  | "companyName"
  | "contact"
  | "hiringRequirement"
  | "numberOfPositions"
  | "workEmail"
  | "yourName",
  FormField
> = {
  companyName: {
    autoComplete: "organization",
    label: "Company Name*",
    name: "companyName",
  },
  contact: {
    autoComplete: "tel",
    inputMode: "tel",
    label: "Contact*",
    name: "contact",
    type: "tel",
  },
  hiringRequirement: {
    label: "Hiring Requirement (Role / Skills Needed)*",
    name: "hiringRequirement",
  },
  numberOfPositions: {
    inputMode: "numeric",
    label: "Number of Positions*",
    name: "numberOfPositions",
  },
  workEmail: {
    autoComplete: "email",
    inputMode: "email",
    label: "Work Email*",
    name: "workEmail",
    type: "email",
  },
  yourName: {
    autoComplete: "name",
    label: "Your Name*",
    name: "yourName",
  },
};

export const ApplyFormModal = ({
  activeTab,
  isOpen,
  onClose,
  onTabChange,
}: ApplyFormModalProps) => {
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [jobSeekerValues, setJobSeekerValues] = useState<JobSeekerFormValues>(
    jobSeekerInquiryInitialValues,
  );
  const [jobSeekerErrors, setJobSeekerErrors] =
    useState<JobSeekerValidationErrors>({});
  const [jobSeekerStatus, setJobSeekerStatus] = useState<FormStatus | null>(null);
  const [isJobSeekerSubmitting, setIsJobSeekerSubmitting] = useState(false);
  const [employerValues, setEmployerValues] = useState<EmployerInquiryFormValues>(
    employerInquiryInitialValues,
  );
  const [employerErrors, setEmployerErrors] =
    useState<EmployerInquiryValidationErrors>({});
  const [employerStatus, setEmployerStatus] = useState<FormStatus | null>(null);
  const [isEmployerSubmitting, setIsEmployerSubmitting] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const locationInputRef = useRef<HTMLInputElement | null>(null);
  const locationDropdownRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const copy = formCopy[activeTab];

  const resetJobSeekerResume = () => {
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }

    setResumeFile(null);
    setResumeFileName(null);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    resetJobSeekerResume();
    setJobSeekerValues(jobSeekerInquiryInitialValues);
    setJobSeekerErrors({});
    setJobSeekerStatus(null);
    setIsJobSeekerSubmitting(false);
    setEmployerValues(employerInquiryInitialValues);
    setEmployerErrors({});
    setEmployerStatus(null);
    setIsEmployerSubmitting(false);
    setIsLocationDropdownOpen(false);
    setLocationSearchTerm("");
  }, [isOpen]);

  useEffect(() => {
    setEmployerStatus(null);
    setJobSeekerStatus(null);
    setIsLocationDropdownOpen(false);
    setLocationSearchTerm("");

    if (activeTab !== "employer") {
      setEmployerErrors({});
    }

    if (activeTab !== "jobSeeker") {
      setJobSeekerErrors({});
    }
  }, [activeTab]);

  useEffect(() => {
    if (!isLocationDropdownOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!locationDropdownRef.current?.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isLocationDropdownOpen]);

  if (!isOpen) {
    return null;
  }

  const filteredEmployerLocations = employerLocations.filter((location) =>
    location.toLowerCase().includes(locationSearchTerm.trim().toLowerCase()),
  );

  const syncEmployerFieldError = (
    fieldName: EmployerInquiryFieldName,
    nextValues: EmployerInquiryFormValues,
  ) => {
    const nextError = validateEmployerInquiryValues(nextValues).errors[fieldName];

    setEmployerErrors((currentErrors) => {
      if (!currentErrors[fieldName] && !nextError) {
        return currentErrors;
      }

      const updatedErrors = { ...currentErrors };

      if (nextError) {
        updatedErrors[fieldName] = nextError;
      } else {
        delete updatedErrors[fieldName];
      }

      return updatedErrors;
    });
  };

  const syncJobSeekerFieldError = (
    fieldName: Exclude<JobSeekerFieldName, "resume" | "password">,
    nextValues: JobSeekerFormValues,
  ) => {
    const nextError = validateJobSeekerInquiryValues(nextValues).errors[fieldName];

    setJobSeekerErrors((currentErrors) => {
      if (!currentErrors[fieldName] && !nextError) {
        return currentErrors;
      }

      const updatedErrors = { ...currentErrors };

      if (nextError) {
        updatedErrors[fieldName] = nextError;
      } else {
        delete updatedErrors[fieldName];
      }

      return updatedErrors;
    });
  };

  const updateEmployerFieldValue = (
    fieldName: EmployerInquiryFieldName,
    value: string | string[],
  ) => {
    const nextValues =
      fieldName === "hiringLocations"
        ? {
            ...employerValues,
            hiringLocations: value as string[],
          }
        : {
            ...employerValues,
            [fieldName]:
              fieldName === "contact" || fieldName === "numberOfPositions"
                ? String(value).replace(/\D/g, "")
                : String(value),
          };

    setEmployerValues(nextValues);
    setEmployerStatus(null);

    if (employerErrors[fieldName]) {
      syncEmployerFieldError(fieldName, nextValues);
    }
  };

  const updateJobSeekerFieldValue = (
    fieldName: Exclude<JobSeekerFieldName, "resume" | "password">,
    value: string,
  ) => {
    const nextValues = {
      ...jobSeekerValues,
      [fieldName]:
        fieldName === "contact" ? String(value).replace(/\D/g, "") : String(value),
    };

    setJobSeekerValues(nextValues);
    setJobSeekerStatus(null);

    if (jobSeekerErrors[fieldName]) {
      syncJobSeekerFieldError(fieldName, nextValues);
    }
  };

  const handleEmployerFieldBlur = (fieldName: EmployerInquiryFieldName) => {
    const normalizedValues = normalizeEmployerInquiryValues(employerValues);

    setEmployerValues(normalizedValues);
    syncEmployerFieldError(fieldName, normalizedValues);
  };

  const handleJobSeekerFieldBlur = (
    fieldName: Exclude<JobSeekerFieldName, "resume" | "password">,
  ) => {
    const normalizedValues = validateJobSeekerInquiryValues(jobSeekerValues).normalized;

    setJobSeekerValues(normalizedValues);
    syncJobSeekerFieldError(fieldName, normalizedValues);
  };

  const handleEmployerSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = validateEmployerInquiryValues(employerValues);

    setEmployerValues(validationResult.normalized);

    if (!validationResult.isValid) {
      setEmployerErrors(validationResult.errors);
      setEmployerStatus({
        message: "Please fix the highlighted fields and try again.",
        type: "error",
      });
      return;
    }

    setEmployerErrors({});
    setEmployerStatus(null);
    setIsEmployerSubmitting(true);

    try {
      const response = await fetch("/api/employer-inquiries", {
        body: JSON.stringify(validationResult.normalized),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json().catch(() => null)) as
        | {
            errors?: EmployerInquiryValidationErrors;
            message?: string;
          }
        | null;

      if (!response.ok) {
        setEmployerErrors(data?.errors ?? {});
        setEmployerStatus({
          message:
            data?.message ?? "Unable to submit your hiring request right now.",
          type: "error",
        });
        return;
      }

      setEmployerValues(employerInquiryInitialValues);
      setEmployerErrors({});
      setEmployerStatus({
        message:
          data?.message ??
          "Your hiring request has been submitted successfully.",
        type: "success",
      });
    } catch {
      setEmployerStatus({
        message: "Network error. Please try again in a moment.",
        type: "error",
      });
    } finally {
      setIsEmployerSubmitting(false);
    }
  };

  const handleJobSeekerSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = validateJobSeekerInquiryValues(jobSeekerValues);
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

    setJobSeekerValues(validationResult.normalized);

    if (resumeValidation.error) {
      nextErrors.resume = resumeValidation.error;
    }

    if (Object.keys(nextErrors).length > 0 || !validationResult.record) {
      setJobSeekerErrors(nextErrors);
      setJobSeekerStatus({
        message: "Please fix the highlighted fields and try again.",
        type: "error",
      });
      return;
    }

    setJobSeekerErrors({});
    setJobSeekerStatus(null);
    setIsJobSeekerSubmitting(true);

    try {
      const selectedResumeFile = resumeFile;

      if (!selectedResumeFile) {
        setJobSeekerErrors({
          resume: "Resume is required.",
        });
        setJobSeekerStatus({
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
      formData.append("currentCompany", validationResult.normalized.currentCompany);
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
        setJobSeekerErrors(data?.errors ?? {});
        setJobSeekerStatus({
          message: data?.message ?? "Unable to submit your profile right now.",
          type: "error",
        });
        return;
      }

      setJobSeekerValues(jobSeekerInquiryInitialValues);
      setJobSeekerErrors({});
      resetJobSeekerResume();
      setJobSeekerStatus({
        message: data?.message ?? "Your profile has been submitted successfully.",
        type: "success",
      });
    } catch {
      setJobSeekerStatus({
        message: "Network error. Please try again in a moment.",
        type: "error",
      });
    } finally {
      setIsJobSeekerSubmitting(false);
    }
  };

  const handleResumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setJobSeekerStatus(null);

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
      resetJobSeekerResume();
      setJobSeekerErrors((currentErrors) => ({
        ...currentErrors,
        resume: validationResult.error ?? "Resume is required.",
      }));
      return;
    }

    setResumeFile(file);
    setResumeFileName(file.name);
    setJobSeekerErrors((currentErrors) => {
      if (!currentErrors.resume) {
        return currentErrors;
      }

      const updatedErrors = { ...currentErrors };
      delete updatedErrors.resume;
      return updatedErrors;
    });
  };

  const handleLocationInputBlur = () => {
    window.requestAnimationFrame(() => {
      if (!locationDropdownRef.current?.contains(document.activeElement)) {
        setIsLocationDropdownOpen(false);
      }
    });
    handleEmployerFieldBlur("hiringLocations");
  };

  const renderEmployerForm = () => (
    <>
      <TextInput
        disabled={isEmployerSubmitting}
        error={employerErrors.companyName}
        field={employerInputFields.companyName}
        onBlur={() => handleEmployerFieldBlur("companyName")}
        onChange={(event) =>
          updateEmployerFieldValue("companyName", event.target.value)
        }
        value={employerValues.companyName}
      />
      <TextInput
        disabled={isEmployerSubmitting}
        error={employerErrors.yourName}
        field={employerInputFields.yourName}
        onBlur={() => handleEmployerFieldBlur("yourName")}
        onChange={(event) => updateEmployerFieldValue("yourName", event.target.value)}
        value={employerValues.yourName}
      />
      <TextInput
        disabled={isEmployerSubmitting}
        error={employerErrors.workEmail}
        field={employerInputFields.workEmail}
        onBlur={() => handleEmployerFieldBlur("workEmail")}
        onChange={(event) =>
          updateEmployerFieldValue("workEmail", event.target.value)
        }
        value={employerValues.workEmail}
      />
      <TextInput
        disabled={isEmployerSubmitting}
        error={employerErrors.contact}
        field={employerInputFields.contact}
        onBlur={() => handleEmployerFieldBlur("contact")}
        onChange={(event) => updateEmployerFieldValue("contact", event.target.value)}
        value={employerValues.contact}
      />

      <TextInput
        disabled={isEmployerSubmitting}
        error={employerErrors.hiringRequirement}
        field={employerInputFields.hiringRequirement}
        onBlur={() => handleEmployerFieldBlur("hiringRequirement")}
        onChange={(event) =>
          updateEmployerFieldValue("hiringRequirement", event.target.value)
        }
        value={employerValues.hiringRequirement}
      />

      <div>
        <label htmlFor="hiringType" className="sr-only">
          Hiring Type*
        </label>
        <select
          id="hiringType"
          name="hiringType"
          aria-invalid={Boolean(employerErrors.hiringType)}
          aria-describedby={
            employerErrors.hiringType ? "hiringType-error" : undefined
          }
          className={`${getFieldClassName(Boolean(employerErrors.hiringType))} appearance-none`}
          disabled={isEmployerSubmitting}
          onBlur={() => handleEmployerFieldBlur("hiringType")}
          onChange={(event) =>
            updateEmployerFieldValue("hiringType", event.target.value)
          }
          value={employerValues.hiringType}
        > 
          <option value="" >Hiring Type</option>
          {employerHiringTypes.map((hiringType) => (
            <option key={hiringType} value={hiringType}>
              {hiringType}
            </option>
          ))}
        </select>
        {employerErrors.hiringType ? (
          <p id="hiringType-error" className="mt-2 text-sm text-[#dc2626]">
            {employerErrors.hiringType}
          </p>
        ) : null}
      </div>

      <div>
        <div className="relative" ref={locationDropdownRef}>
          <div
            aria-controls="hiringLocations-dropdown"
            aria-describedby={
              employerErrors.hiringLocations ? "hiringLocations-error" : undefined
            }
            aria-expanded={isLocationDropdownOpen}
            className={`${getFieldClassName(Boolean(employerErrors.hiringLocations))} flex items-center gap-4 pr-4`}
            role="combobox"
            onClick={() => {
              if (isEmployerSubmitting) {
                return;
              }

              setIsLocationDropdownOpen(true);
              locationInputRef.current?.focus();
            }}
          >
            <input
              ref={locationInputRef}
              type="text"
              value={locationSearchTerm}
              disabled={isEmployerSubmitting}
              placeholder={
                employerValues.hiringLocations.length > 0
                  ? employerValues.hiringLocations.join(", ")
                  : hiringLocationsPlaceholder
              }
              title={
                employerValues.hiringLocations.length > 0
                  ? employerValues.hiringLocations.join(", ")
                  : hiringLocationsPlaceholder
              }
              className={`h-full w-full border-0 bg-transparent px-0 text-[15px] font-medium text-[#1d223f] outline-none ${
                employerValues.hiringLocations.length > 0
                  ? "placeholder:text-[#1d223f]"
                  : "placeholder:text-[#8f97ad]"
              }`}
              onBlur={handleLocationInputBlur}
              onChange={(event) => {
                setLocationSearchTerm(event.target.value);
                setIsLocationDropdownOpen(true);
              }}
              onFocus={() => setIsLocationDropdownOpen(true)}
            />
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-[#1d223f]/50 transition-transform duration-200 ${
                isLocationDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {isLocationDropdownOpen ? (
            <div
              id="hiringLocations-dropdown"
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-[260px] overflow-y-auto rounded-[16px] border border-[#e7ebf3] bg-white p-2 shadow-[0_18px_36px_rgba(29,34,63,0.12)]"
            >
              {filteredEmployerLocations.length === 0 ? (
                <p className="px-3 py-2 text-[15px] font-medium text-[#8f97ad]">
                  No matching location found.
                </p>
              ) : null}
              {filteredEmployerLocations.map((location) => {
                const isSelected = employerValues.hiringLocations.includes(location);

                return (
                  <label
                    key={location}
                    className="flex cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2 text-[15px] font-medium text-[#1d223f] transition-colors duration-200 hover:bg-[#f6f8fc]"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#c8d0e0] text-[#1d223f] focus:ring-[#1d223f]/20"
                      checked={isSelected}
                      onChange={() => {
                        const nextLocations = isSelected
                          ? employerValues.hiringLocations.filter(
                              (selectedLocation) => selectedLocation !== location,
                            )
                          : [...employerValues.hiringLocations, location];

                        updateEmployerFieldValue("hiringLocations", nextLocations);
                        setLocationSearchTerm("");
                        setIsLocationDropdownOpen(true);
                      }}
                    />
                    <span>{location}</span>
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>
        {employerErrors.hiringLocations ? (
          <p id="hiringLocations-error" className="mt-2 text-sm text-[#dc2626]">
            {employerErrors.hiringLocations}
          </p>
        ) : null}
      </div>

      <TextInput
        disabled={isEmployerSubmitting}
        error={employerErrors.numberOfPositions}
        field={employerInputFields.numberOfPositions}
        onBlur={() => handleEmployerFieldBlur("numberOfPositions")}
        onChange={(event) =>
          updateEmployerFieldValue("numberOfPositions", event.target.value)
        }
        value={employerValues.numberOfPositions}
      />
    </>
  );

  const renderJobSeekerForm = () => (
    <>
      <TextInput
        disabled={isJobSeekerSubmitting}
        error={jobSeekerErrors.name}
        field={jobSeekerInputFields.name}
        onBlur={() => handleJobSeekerFieldBlur("name")}
        onChange={(event) => updateJobSeekerFieldValue("name", event.target.value)}
        value={jobSeekerValues.name}
      />
      <TextInput
        disabled={isJobSeekerSubmitting}
        error={jobSeekerErrors.email}
        field={jobSeekerInputFields.email}
        onBlur={() => handleJobSeekerFieldBlur("email")}
        onChange={(event) => updateJobSeekerFieldValue("email", event.target.value)}
        value={jobSeekerValues.email}
      />
      <TextInput
        disabled={isJobSeekerSubmitting}
        error={jobSeekerErrors.contact}
        field={jobSeekerInputFields.contact}
        onBlur={() => handleJobSeekerFieldBlur("contact")}
        onChange={(event) =>
          updateJobSeekerFieldValue("contact", event.target.value)
        }
        value={jobSeekerValues.contact}
      />
      <FileInput
        disabled={isJobSeekerSubmitting}
        error={jobSeekerErrors.resume}
        fileName={resumeFileName}
        inputRef={resumeInputRef}
        onChange={handleResumeChange}
      />
      <TextInput
        disabled={isJobSeekerSubmitting}
        error={jobSeekerErrors.currentPosition}
        field={jobSeekerInputFields.currentPosition}
        onBlur={() => handleJobSeekerFieldBlur("currentPosition")}
        onChange={(event) =>
          updateJobSeekerFieldValue("currentPosition", event.target.value)
        }
        value={jobSeekerValues.currentPosition}
      />
      <TextInput
        disabled={isJobSeekerSubmitting}
        error={jobSeekerErrors.currentCompany}
        field={jobSeekerInputFields.currentCompany}
        onBlur={() => handleJobSeekerFieldBlur("currentCompany")}
        onChange={(event) =>
          updateJobSeekerFieldValue("currentCompany", event.target.value)
        }
        value={jobSeekerValues.currentCompany}
      />
    </>
  );

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1d223f]/65 px-4 py-6 backdrop-blur-[6px] sm:px-6 sm:py-10"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92vh] w-full max-w-[980px] flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_32px_80px_rgba(29,34,63,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d9deea] bg-white text-[#1d223f] transition-colors duration-200 hover:border-[#1d223f] hover:bg-[#f6f8fc] sm:right-6 sm:top-6"
          aria-label="Close apply form"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto">
          <div className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
            <div
              role="tablist"
              aria-label="Application type"
              className="inline-flex rounded-full bg-[#1d223f] p-1.5"
            >
              <ApplyTabButton
                isActive={activeTab === "employer"}
                onClick={() => onTabChange("employer")}
              >
                <BriefcaseBusiness className="h-4 w-4" />
                Employer
              </ApplyTabButton>
              <ApplyTabButton
                isActive={activeTab === "jobSeeker"}
                onClick={() => onTabChange("jobSeeker")}
              >
                <Users className="h-4 w-4" />
                Job Seeker
              </ApplyTabButton>
            </div>

            <div className="mt-8 max-w-[620px]">
              <p className="text-[24px] font-medium leading-[1.2] text-[#1d223f] sm:text-[32px]">
                {copy.eyebrow}
              </p>
              <h2
                id={titleId}
                className="mt-2 text-[34px] font-bold leading-[1.15] text-[#111428] sm:text-[46px]"
              >
                {copy.title}
              </h2>
            </div>
          </div>

          <div className="px-5 pb-8 pt-1 sm:px-8 sm:pb-10">
            <form
              className="space-y-6"
              onSubmit={
                activeTab === "employer"
                  ? handleEmployerSubmit
                  : handleJobSeekerSubmit
              }
            >
              <div
                role="tabpanel"
                className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2"
              >
                {activeTab === "employer"
                  ? renderEmployerForm()
                  : renderJobSeekerForm()}
              </div>

              <p className="text-[15px] leading-[1.6] text-[#8f97ad]">
                {copy.description}
              </p>

              {(activeTab === "employer" ? employerStatus : jobSeekerStatus) ? (
                <p
                  className={`text-[15px] font-medium ${
                    (activeTab === "employer" ? employerStatus : jobSeekerStatus)
                      ?.type === "success"
                      ? "text-[#15803d]"
                      : "text-[#dc2626]"
                  }`}
                >
                  {(activeTab === "employer" ? employerStatus : jobSeekerStatus)
                    ?.message ?? ""}
                </p>
              ) : null}

              <button
                type="submit"
                className={`group inline-flex min-h-[54px] items-center gap-3 rounded-full bg-[#1d223f] pl-6 pr-1.5 text-white transition-transform duration-200 ${
                  (activeTab === "employer"
                    ? isEmployerSubmitting
                    : isJobSeekerSubmitting)
                    ? "cursor-not-allowed opacity-70"
                    : "hover:-translate-y-0.5"
                }`}
                disabled={
                  activeTab === "employer"
                    ? isEmployerSubmitting
                    : isJobSeekerSubmitting
                }
              >
                <span className="text-[16px] font-semibold leading-[1.2] sm:text-[18px]">
                  {(activeTab === "employer"
                    ? isEmployerSubmitting
                    : isJobSeekerSubmitting)
                    ? "Submitting..."
                    : copy.submitLabel}
                </span>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/10">
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45" />
                </span>
              </button>

              {activeTab === "jobSeeker" ? (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="text-[14px] font-medium text-[#6f7892]">
                    Already have an account?
                  </span>
                  <Link
                    href="/candidate/login"
                    onClick={onClose}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[#d9deea] px-4 text-[14px] font-semibold text-[#1d223f] transition-colors duration-200 hover:border-[#00adef] hover:bg-[#eef9ff] hover:text-[#008fc7]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/registration/create-account"
                    onClick={onClose}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#eef9ff] px-4 text-[14px] font-semibold text-[#008fc7] transition-colors duration-200 hover:bg-[#dff4ff]"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
