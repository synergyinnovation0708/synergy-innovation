"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  MapPinned,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  formatJobListingSkills,
  jobDepartments,
  jobDepartmentSkills,
  formatJobListingLocations,
  jobEmploymentTypes,
  jobListingInitialValues,
  jobListingLocations,
  jobListingStatuses,
  jobWorkModes,
  normalizeJobListingValues,
  normalizeJobListingLocations,
  parseJobListingSkills,
  validateJobListingValues,
  type JobListingFieldName,
  type JobListingFormValues,
  type JobListingValidationErrors,
} from "@/lib/job-listings";
import type { AdminJobListingRecord } from "@/lib/admin-jobs-shared";
import { TiptapEditorField } from "./TiptapEditorField";

type AdminNewJobModalProps = {
  job?: AdminJobListingRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

type SaveState = {
  message: string;
  type: "error" | "success";
};

const inputClassName =
  "mt-2 h-[54px] w-full rounded-[18px] border border-[#dbe5f1] bg-[#f8fbff] px-4 text-[15px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8794b1] focus:border-[#00adef] focus:bg-white";

const textareaClassName =
  "mt-2 min-h-[120px] w-full rounded-[18px] border border-[#dbe5f1] bg-[#f8fbff] px-4 py-4 text-[15px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8794b1] focus:border-[#00adef] focus:bg-white";

const getFieldClassName = (hasError: boolean, className = inputClassName) =>
  `${className} ${hasError ? "border-[#dc2626] focus:border-[#dc2626]" : ""}`;

const getJobFormValues = (
  currentJob: AdminJobListingRecord | null | undefined,
): JobListingFormValues =>
  currentJob
    ? {
        applicationDeadline: currentJob.applicationDeadline,
        companyName: currentJob.companyName,
        department: currentJob.department,
        employmentType: currentJob.employmentType,
        experienceMax: String(currentJob.experienceMaxYears),
        experienceMin: String(currentJob.experienceMinYears),
        jobStatus: currentJob.status,
        jobSummary: currentJob.jobSummaryHtml,
        jobTitle: currentJob.jobTitle,
        location: currentJob.location,
        openings: String(currentJob.openings),
        requiredSkills: currentJob.requiredSkills,
        responsibilities: currentJob.responsibilitiesHtml,
        salaryMax: String(currentJob.salaryMaxLpa),
        salaryMin: String(currentJob.salaryMinLpa),
        workMode: currentJob.workMode,
      }
    : jobListingInitialValues;

export const AdminNewJobModal = ({
  job,
  isOpen,
  onClose,
  onSaved,
}: AdminNewJobModalProps) => {
  const isEditing = Boolean(job);
  const [formValues, setFormValues] = useState<JobListingFormValues>(
    () => getJobFormValues(job),
  );
  const [errors, setErrors] = useState<JobListingValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [saveState, setSaveState] = useState<SaveState | null>(null);
  const locationDropdownRef = useRef<HTMLDivElement | null>(null);

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
    setFormValues(isOpen ? getJobFormValues(job) : jobListingInitialValues);
    setErrors({});
    setIsSubmitting(false);
    setIsLocationDropdownOpen(false);
    setSaveState(null);
  }, [isOpen, job]);

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

  const selectedLocations = normalizeJobListingLocations(formValues.location);
  const selectedSkills = parseJobListingSkills(formValues.requiredSkills);
  const departmentSkillOptions =
    jobDepartmentSkills[formValues.department as keyof typeof jobDepartmentSkills] ??
    [];

  const syncFieldError = (
    fieldName: JobListingFieldName,
    nextValues: JobListingFormValues,
  ) => {
    const nextError = validateJobListingValues(nextValues).errors[fieldName];

    setErrors((currentErrors) => {
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

  const updateFieldValue = (fieldName: JobListingFieldName, value: string) => {
    const nextValues = {
      ...formValues,
      requiredSkills:
        fieldName === "department" && formValues.department !== value
          ? ""
          : formValues.requiredSkills,
      [fieldName]:
        fieldName === "openings" ||
        fieldName === "experienceMin" ||
        fieldName === "experienceMax" ||
        fieldName === "salaryMin" ||
        fieldName === "salaryMax"
          ? value.replace(/\D/g, "")
          : value,
    };

    setFormValues(nextValues);
    setSaveState(null);

    if (errors[fieldName]) {
      syncFieldError(fieldName, nextValues);
    }
  };

  const handleFieldBlur = (fieldName: JobListingFieldName) => {
    const normalizedValues = normalizeJobListingValues(formValues);

    setFormValues(normalizedValues);
    syncFieldError(fieldName, normalizedValues);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = validateJobListingValues(formValues);

    setFormValues(validationResult.normalized);

    if (!validationResult.isValid || !validationResult.record) {
      setErrors(validationResult.errors);
      setSaveState({
        message: "Please fix the highlighted fields and try again.",
        type: "error",
      });
      return;
    }

    setErrors({});
    setSaveState(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        isEditing && job
          ? `/api/admin/job-listings/${job.id}`
          : "/api/admin/job-listings",
        {
        body: JSON.stringify(validationResult.normalized),
        headers: {
          "Content-Type": "application/json",
        },
          method: isEditing ? "PATCH" : "POST",
        },
      );
      const data = (await response.json().catch(() => null)) as
        | {
            errors?: JobListingValidationErrors;
            message?: string;
          }
        | null;

      if (!response.ok) {
        setErrors(data?.errors ?? {});
        setSaveState({
          message:
            data?.message ??
            (isEditing
              ? "Unable to update the job listing right now."
              : "Unable to create the job listing right now."),
          type: "error",
        });
        return;
      }

      setFormValues(jobListingInitialValues);
      setErrors({});
      setSaveState({
        message:
          data?.message ??
          (isEditing
            ? "Job listing updated successfully."
            : "Job listing created successfully."),
        type: "success",
      });
      onSaved?.();
      onClose();
    } catch {
      setSaveState({
        message: "Network error. Please try again in a moment.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldError = (fieldName: JobListingFieldName) =>
    errors[fieldName] ? (
      <p className="mt-2 text-sm text-[#dc2626]">{errors[fieldName]}</p>
    ) : null;

  const toggleSkillSelection = (skill: string) => {
    const nextSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((selectedSkill) => selectedSkill !== skill)
      : [...selectedSkills, skill];

    updateFieldValue("requiredSkills", formatJobListingSkills(nextSkills));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d223f]/58 px-4 py-6 backdrop-blur-[5px] sm:px-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-[980px] flex-col overflow-hidden rounded-[34px] bg-white shadow-[0_32px_90px_rgba(29,34,63,0.3)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close new job modal"
          className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe5f1] bg-white text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto">
          <div className="bg-[linear-gradient(180deg,#eef9ff_0%,#ffffff_100%)] px-6 pb-7 pt-7 sm:px-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eaf8ff] text-[#00adef]">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <p className="mt-6 text-[14px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
              {isEditing ? "Update Job" : "Create Job"}
            </p>
            <h2 className="mt-2 text-[32px] font-bold leading-[1.1] text-[#1d223f] sm:text-[38px]">
              {isEditing ? "Edit job opening" : "Add a new job opening"}
            </h2>
            <p className="mt-3 max-w-[720px] text-[15px] leading-[1.7] text-[#6b7894] sm:text-[16px]">
              {isEditing
                ? "Update the role details below and save your changes to Supabase."
                : "Fill in the core details below to prepare a new role for publishing in the admin dashboard."}
            </p>
          </div>

          <form className="px-6 pb-8 pt-2 sm:px-8 sm:pb-10" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="job-title"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Job Title*
                </label>
                <input
                  id="job-title"
                  type="text"
                  placeholder="Senior Product Designer"
                  className={getFieldClassName(Boolean(errors.jobTitle))}
                  disabled={isSubmitting}
                  value={formValues.jobTitle}
                  onBlur={() => handleFieldBlur("jobTitle")}
                  onChange={(event) =>
                    updateFieldValue("jobTitle", event.target.value)
                  }
                />
                {renderFieldError("jobTitle")}
              </div>

              <div>
                <label
                  htmlFor="company-name"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Company Name*
                </label>
                <input
                  id="company-name"
                  type="text"
                  placeholder="Synergy Innovation"
                  className={getFieldClassName(Boolean(errors.companyName))}
                  disabled={isSubmitting}
                  value={formValues.companyName}
                  onBlur={() => handleFieldBlur("companyName")}
                  onChange={(event) =>
                    updateFieldValue("companyName", event.target.value)
                  }
                />
                {renderFieldError("companyName")}
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Department*
                </label>
                <select
                  id="department"
                  className={getFieldClassName(Boolean(errors.department))}
                  disabled={isSubmitting}
                  value={formValues.department}
                  onBlur={() => handleFieldBlur("department")}
                  onChange={(event) =>
                    updateFieldValue("department", event.target.value)
                  }
                >
                  <option value="">Select department</option>
                  {jobDepartments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
                {renderFieldError("department")}
              </div>

              <div>
                <label
                  htmlFor="employment-type"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Employment Type*
                </label>
                <select
                  id="employment-type"
                  className={getFieldClassName(
                    Boolean(errors.employmentType),
                  )}
                  disabled={isSubmitting}
                  value={formValues.employmentType}
                  onBlur={() => handleFieldBlur("employmentType")}
                  onChange={(event) =>
                    updateFieldValue("employmentType", event.target.value)
                  }
                >
                  <option value="">Select employment type</option>
                  {jobEmploymentTypes.map((employmentType) => (
                    <option key={employmentType} value={employmentType}>
                      {employmentType}
                    </option>
                  ))}
                </select>
                {renderFieldError("employmentType")}
              </div>

              <div>
                <label
                  htmlFor="work-mode"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Work Mode*
                </label>
                <select
                  id="work-mode"
                  className={getFieldClassName(Boolean(errors.workMode))}
                  disabled={isSubmitting}
                  value={formValues.workMode}
                  onBlur={() => handleFieldBlur("workMode")}
                  onChange={(event) =>
                    updateFieldValue("workMode", event.target.value)
                  }
                >
                  <option value="">Select work mode</option>
                  {jobWorkModes.map((workMode) => (
                    <option key={workMode} value={workMode}>
                      {workMode}
                    </option>
                  ))}
                </select>
                {renderFieldError("workMode")}
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Location*
                </label>
                <div className="relative mt-2" ref={locationDropdownRef}>
                  <button
                    id="location"
                    type="button"
                    disabled={isSubmitting}
                    aria-expanded={isLocationDropdownOpen}
                    aria-haspopup="listbox"
                    className={getFieldClassName(
                      Boolean(errors.location),
                      "flex h-[54px] w-full items-center gap-3 rounded-[18px] border border-[#dbe5f1] bg-[#f8fbff] px-4 text-left text-[15px] font-medium text-[#1d223f] outline-none transition-colors duration-200 focus:border-[#00adef] focus:bg-white disabled:cursor-not-allowed disabled:opacity-70",
                    )}
                    onBlur={() => {
                      window.requestAnimationFrame(() => {
                        if (
                          !locationDropdownRef.current?.contains(
                            document.activeElement,
                          )
                        ) {
                          setIsLocationDropdownOpen(false);
                          handleFieldBlur("location");
                        }
                      });
                    }}
                    onClick={() =>
                      setIsLocationDropdownOpen((currentOpen) => !currentOpen)
                    }
                  >
                    <MapPinned className="h-4 w-4 shrink-0 text-[#7d89a4]" />
                    <span
                      className={`min-w-0 flex-1 truncate ${
                        selectedLocations.length > 0
                          ? "text-[#1d223f]"
                          : "text-[#8794b1]"
                      }`}
                      title={
                        selectedLocations.length > 0
                          ? formatJobListingLocations(selectedLocations)
                          : "Select locations"
                      }
                    >
                      {selectedLocations.length > 0
                        ? formatJobListingLocations(selectedLocations)
                        : "Select locations"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#7d89a4] transition-transform duration-200 ${
                        isLocationDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isLocationDropdownOpen ? (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-[260px] overflow-y-auto rounded-[18px] border border-[#dbe5f1] bg-white p-3 shadow-[0_18px_36px_rgba(29,34,63,0.12)]">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {jobListingLocations.map((location) => {
                          const isSelected = selectedLocations.includes(location);

                          return (
                            <label
                              key={location}
                              className={`flex cursor-pointer items-center gap-3 rounded-[14px] border px-3 py-2 text-[14px] font-medium transition-colors duration-200 ${
                                isSelected
                                  ? "border-[#1d223f] bg-[#1d223f] text-white"
                                  : "border-[#dbe5f1] bg-white text-[#1d223f] hover:bg-[#f8fbff]"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                className="h-4 w-4 shrink-0 rounded border-current"
                                onChange={() => {
                                  const nextLocations = isSelected
                                    ? selectedLocations.filter(
                                        (selectedLocation) =>
                                          selectedLocation !== location,
                                      )
                                    : [...selectedLocations, location];

                                  updateFieldValue(
                                    "location",
                                    formatJobListingLocations(nextLocations),
                                  );
                                }}
                              />
                              <span>{location}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
                {renderFieldError("location")}
              </div>

              <div>
                <label
                  htmlFor="experience-range"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Experience (Years)*
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    id="experience-range"
                    type="text"
                    inputMode="numeric"
                    placeholder="Min"
                    className={getFieldClassName(Boolean(errors.experienceMin), inputClassName)}
                    disabled={isSubmitting}
                    value={formValues.experienceMin}
                    onBlur={() => handleFieldBlur("experienceMin")}
                    onChange={(event) =>
                      updateFieldValue("experienceMin", event.target.value)
                    }
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Max"
                    className={getFieldClassName(Boolean(errors.experienceMax), inputClassName)}
                    disabled={isSubmitting}
                    value={formValues.experienceMax}
                    onBlur={() => handleFieldBlur("experienceMax")}
                    onChange={(event) =>
                      updateFieldValue("experienceMax", event.target.value)
                    }
                  />
                </div>
                {renderFieldError("experienceMin")}
                {renderFieldError("experienceMax")}
              </div>

              <div>
                <label
                  htmlFor="openings"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Number of Openings*
                </label>
                <input
                  id="openings"
                  type="text"
                  inputMode="numeric"
                  placeholder="3"
                  className={getFieldClassName(Boolean(errors.openings))}
                  disabled={isSubmitting}
                  value={formValues.openings}
                  onBlur={() => handleFieldBlur("openings")}
                  onChange={(event) => updateFieldValue("openings", event.target.value)}
                />
                {renderFieldError("openings")}
              </div>

              <div>
                <label
                  htmlFor="ctc"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Salary (LPA)*
                </label>
                <div className=" grid grid-cols-2 gap-3">
                  <div className="relative">
                    {/* <WalletCards className="pointer-events-none absolute left-4 top-[19px] h-4 w-4 text-[#7d89a4]" /> */}
                    <input
                      id="ctc"
                      type="text"
                      inputMode="numeric"
                      placeholder="Min"
                      className={getFieldClassName(Boolean(errors.salaryMin), `${inputClassName} `)}
                      disabled={isSubmitting}
                      value={formValues.salaryMin}
                      onBlur={() => handleFieldBlur("salaryMin")}
                      onChange={(event) =>
                        updateFieldValue("salaryMin", event.target.value)
                      }
                    />
                  </div>
                  <div className="relative">
                    {/* <WalletCards className="pointer-events-none absolute left-4 top-[19px] h-4 w-4 text-[#7d89a4]" /> */}
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Max"
                      className={getFieldClassName(Boolean(errors.salaryMax), `${inputClassName} `)}
                      disabled={isSubmitting}
                      value={formValues.salaryMax}
                      onBlur={() => handleFieldBlur("salaryMax")}
                      onChange={(event) =>
                        updateFieldValue("salaryMax", event.target.value)
                      }
                    />
                  </div>
                </div>
                {renderFieldError("salaryMin")}
                {renderFieldError("salaryMax")}
              </div>

              <div>
                <label
                  htmlFor="deadline"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Application Deadline*
                </label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7d89a4]" />
                  <input
                    id="deadline"
                    type="date"
                    className={getFieldClassName(
                      Boolean(errors.applicationDeadline),
                      `${inputClassName} pl-11`,
                    )}
                    disabled={isSubmitting}
                    value={formValues.applicationDeadline}
                    onBlur={() => handleFieldBlur("applicationDeadline")}
                    onChange={(event) =>
                      updateFieldValue("applicationDeadline", event.target.value)
                    }
                  />
                </div>
                {renderFieldError("applicationDeadline")}
              </div>

              <div>
                <label
                  htmlFor="job-status"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Job Status*
                </label>
                <select
                  id="job-status"
                  className={getFieldClassName(Boolean(errors.jobStatus))}
                  disabled={isSubmitting}
                  value={formValues.jobStatus}
                  onBlur={() => handleFieldBlur("jobStatus")}
                  onChange={(event) =>
                    updateFieldValue("jobStatus", event.target.value)
                  }
                >
                  <option value="">Select job status</option>
                  {jobListingStatuses.map((jobStatus) => (
                    <option key={jobStatus} value={jobStatus}>
                      {jobStatus}
                    </option>
                  ))}
                </select>
                {renderFieldError("jobStatus")}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="skills"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Required Skills*
                </label>
                <textarea
                  id="skills"
                  placeholder="Figma, Design Systems, UX Research, Prototyping"
                  className={getFieldClassName(
                    Boolean(errors.requiredSkills),
                    textareaClassName,
                  )}
                  disabled={isSubmitting}
                  value={formValues.requiredSkills}
                  onBlur={() => handleFieldBlur("requiredSkills")}
                  onChange={(event) =>
                    updateFieldValue("requiredSkills", event.target.value)
                  }
                />
                {formValues.department ? (
                  <div className="mt-3 rounded-[18px] border border-[#dbe5f1] bg-[#f8fbff] p-4">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#00adef]">
                      Department Skills
                    </p>
                    {departmentSkillOptions.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {departmentSkillOptions.map((skill) => {
                          const isSelected = selectedSkills.includes(skill);

                          return (
                            <button
                              key={skill}
                              type="button"
                              className={`inline-flex items-center rounded-full border px-3 py-2 text-[13px] font-semibold transition-colors duration-200 ${
                                isSelected
                                  ? "border-[#1d223f] bg-[#1d223f] text-white"
                                  : "border-[#dbe5f1] bg-white text-[#1d223f] hover:bg-[#f4f8fc]"
                              }`}
                              onClick={() => toggleSkillSelection(skill)}
                            >
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-3 text-[14px] text-[#6b7894]">
                        No preset skills available for this department yet.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-[14px] text-[#6b7894]">
                    Select a department to see matching skill suggestions.
                  </p>
                )}
                {renderFieldError("requiredSkills")}
              </div>

              <div className="md:col-span-2">
                <TiptapEditorField
                  id="job-summary"
                  disabled={isSubmitting}
                  error={errors.jobSummary}
                  label="Job Summary"
                  onBlur={() => handleFieldBlur("jobSummary")}
                  onChange={(value) => updateFieldValue("jobSummary", value)}
                  placeholder="Write a short overview of the role, team, and business impact."
                  required
                  value={formValues.jobSummary}
                />
              </div>

              <div className="md:col-span-2">
                <TiptapEditorField
                  id="responsibilities"
                  disabled={isSubmitting}
                  error={errors.responsibilities}
                  label="Key Responsibilities"
                  onBlur={() => handleFieldBlur("responsibilities")}
                  onChange={(value) =>
                    updateFieldValue("responsibilities", value)
                  }
                  placeholder="List the primary responsibilities and expectations for this role."
                  required
                  value={formValues.responsibilities}
                />
              </div>
            </div>

            {saveState ? (
              <p
                className={`mt-6 text-[15px] font-medium ${
                  saveState.type === "success" ? "text-[#15803d]" : "text-[#dc2626]"
                }`}
              >
                {saveState.message}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 border-t border-[#e5edf6] pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-[52px] items-center justify-center rounded-full border border-[#dbe5f1] px-6 text-[15px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#1d223f] px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#2b3561] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update Job"
                    : "Create Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
