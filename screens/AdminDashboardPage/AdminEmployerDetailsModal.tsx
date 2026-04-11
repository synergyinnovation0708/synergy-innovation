"use client";

import { Building2, Phone, UserRound, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { AdminEmployerRecord } from "@/lib/admin-employers-shared";
import {
  employerHiringTypes,
  employerLocations,
  validateEmployerInquiryValues,
  type EmployerInquiryFieldName,
  type EmployerInquiryFormValues,
  type EmployerInquiryValidationErrors,
} from "@/lib/employer-inquiries";

type AdminEmployerDetailsModalProps = {
  employer: AdminEmployerRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
};

type SaveState = {
  message: string;
  type: "error" | "success";
};

const inputClassName =
  "mt-2 h-[54px] w-full rounded-[18px] border border-[#dbe5f1] bg-[#f8fbff] px-4 text-[15px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8794b1] focus:border-[#00adef] focus:bg-white";

const fieldClassName = (hasError: boolean) =>
  `${inputClassName} ${hasError ? "border-[#dc2626] focus:border-[#dc2626]" : ""}`;

const toFormValues = (
  employer: AdminEmployerRecord | null,
): EmployerInquiryFormValues => ({
  companyName: employer?.company ?? "",
  contact: employer?.contactNumber ?? "",
  hiringLocations: employer?.hiringLocations ?? [],
  hiringRequirement: employer?.hiringRequirement ?? "",
  hiringType: employer?.hiringType ?? "",
  numberOfPositions: employer ? String(employer.openRoles) : "",
  workEmail: employer?.contactEmail ?? "",
  yourName: employer?.contactName ?? "",
});

export const AdminEmployerDetailsModal = ({
  employer,
  isOpen,
  onClose,
  onSaved,
}: AdminEmployerDetailsModalProps) => {
  const [formValues, setFormValues] = useState<EmployerInquiryFormValues>(
    toFormValues(employer),
  );
  const [errors, setErrors] = useState<EmployerInquiryValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveState, setSaveState] = useState<SaveState | null>(null);

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
    setFormValues(toFormValues(employer));
    setErrors({});
    setIsSubmitting(false);
    setSaveState(null);
  }, [employer, isOpen]);

  if (!isOpen || !employer) {
    return null;
  }

  const updateField = (
    fieldName: EmployerInquiryFieldName,
    value: string | string[],
  ) => {
    const nextValues =
      fieldName === "hiringLocations"
        ? {
            ...formValues,
            hiringLocations: value as string[],
          }
        : {
            ...formValues,
            [fieldName]:
              fieldName === "contact" || fieldName === "numberOfPositions"
                ? String(value).replace(/\D/g, "")
                : String(value),
          };

    setFormValues(nextValues);
    setSaveState(null);

    if (errors[fieldName]) {
      const nextError = validateEmployerInquiryValues(nextValues).errors[fieldName];

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = validateEmployerInquiryValues(formValues);

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      setSaveState({
        message: "Please fix the highlighted fields and try again.",
        type: "error",
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSaveState(null);

    try {
      const response = await fetch(`/api/admin/employers/${employer.id}`, {
        body: JSON.stringify(validationResult.normalized),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });
      const data = (await response.json().catch(() => null)) as
        | {
            errors?: EmployerInquiryValidationErrors;
            message?: string;
          }
        | null;

      if (!response.ok) {
        setErrors(data?.errors ?? {});
        setSaveState({
          message: data?.message ?? "Unable to update employer details right now.",
          type: "error",
        });
        return;
      }

      setSaveState({
        message: data?.message ?? "Employer details updated successfully.",
        type: "success",
      });
      onSaved();
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

  const renderError = (fieldName: EmployerInquiryFieldName) =>
    errors[fieldName] ? (
      <p className="mt-2 text-sm text-[#dc2626]">{errors[fieldName]}</p>
    ) : null;

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
          aria-label="Close employer details modal"
          className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe5f1] bg-white text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto">
          <div className="bg-[linear-gradient(180deg,#eef9ff_0%,#ffffff_100%)] px-6 pb-7 pt-7 sm:px-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eaf8ff] text-[#00adef]">
              <Building2 className="h-6 w-6" />
            </div>
            <p className="mt-6 text-[14px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
              Update Employer
            </p>
            <h2 className="mt-2 text-[32px] font-bold leading-[1.1] text-[#1d223f] sm:text-[38px]">
              Edit employer details
            </h2>
            <p className="mt-3 max-w-[720px] text-[15px] leading-[1.7] text-[#6b7894] sm:text-[16px]">
              Update the hiring contact, requirements, locations, and open role
              count stored in Supabase for this employer request.
            </p>
          </div>

          <form className="px-6 pb-8 pt-2 sm:px-8 sm:pb-10" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-[15px] font-semibold text-[#1d223f]">
                  Company Name*
                </label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7d89a4]" />
                  <input
                    type="text"
                    value={formValues.companyName}
                    placeholder="Company Name"
                    className={`${fieldClassName(Boolean(errors.companyName))} pl-11`}
                    onChange={(event) =>
                      updateField("companyName", event.target.value)
                    }
                  />
                </div>
                {renderError("companyName")}
              </div>

              <div>
                <label className="text-[15px] font-semibold text-[#1d223f]">
                  Contact Person*
                </label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7d89a4]" />
                  <input
                    type="text"
                    value={formValues.yourName}
                    placeholder="Contact Person"
                    className={`${fieldClassName(Boolean(errors.yourName))} pl-11`}
                    onChange={(event) => updateField("yourName", event.target.value)}
                  />
                </div>
                {renderError("yourName")}
              </div>

              <div>
                <label className="text-[15px] font-semibold text-[#1d223f]">
                  Work Email*
                </label>
                <input
                  type="email"
                  value={formValues.workEmail}
                  placeholder="Work Email"
                  className={fieldClassName(Boolean(errors.workEmail))}
                  onChange={(event) => updateField("workEmail", event.target.value)}
                />
                {renderError("workEmail")}
              </div>

              <div>
                <label className="text-[15px] font-semibold text-[#1d223f]">
                  Contact Number*
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7d89a4]" />
                  <input
                    type="tel"
                    value={formValues.contact}
                    placeholder="Contact Number"
                    className={`${fieldClassName(Boolean(errors.contact))} pl-11`}
                    onChange={(event) => updateField("contact", event.target.value)}
                  />
                </div>
                {renderError("contact")}
              </div>

              <div>
                <label className="text-[15px] font-semibold text-[#1d223f]">
                  Hiring Requirement*
                </label>
                <input
                  type="text"
                  value={formValues.hiringRequirement}
                  placeholder="Role / skills needed"
                  className={fieldClassName(Boolean(errors.hiringRequirement))}
                  onChange={(event) =>
                    updateField("hiringRequirement", event.target.value)
                  }
                />
                {renderError("hiringRequirement")}
              </div>

              <div>
                <label className="text-[15px] font-semibold text-[#1d223f]">
                  Hiring Type*
                </label>
                <select
                  value={formValues.hiringType}
                  className={fieldClassName(Boolean(errors.hiringType))}
                  onChange={(event) => updateField("hiringType", event.target.value)}
                >
                  <option value="">Select hiring type</option>
                  {employerHiringTypes.map((hiringType) => (
                    <option key={hiringType} value={hiringType}>
                      {hiringType}
                    </option>
                  ))}
                </select>
                {renderError("hiringType")}
              </div>

              <div>
                <label className="text-[15px] font-semibold text-[#1d223f]">
                  Open Roles*
                </label>
                <input
                  type="text"
                  value={formValues.numberOfPositions}
                  placeholder="Number of open roles"
                  className={fieldClassName(Boolean(errors.numberOfPositions))}
                  onChange={(event) =>
                    updateField("numberOfPositions", event.target.value)
                  }
                />
                {renderError("numberOfPositions")}
              </div>

              <div className="md:col-span-2">
                <label className="text-[15px] font-semibold text-[#1d223f]">
                  Hiring Locations*
                </label>
                <div
                  className={`mt-2 rounded-[18px] border bg-[#f8fbff] p-4 ${
                    errors.hiringLocations
                      ? "border-[#dc2626]"
                      : "border-[#dbe5f1]"
                  }`}
                >
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {employerLocations.map((location) => {
                      const isSelected = formValues.hiringLocations.includes(location);

                      return (
                        <label
                          key={location}
                          className={`flex cursor-pointer items-center gap-3 rounded-[14px] border px-3 py-2 text-[14px] font-medium transition-colors duration-200 ${
                            isSelected
                              ? "border-[#1d223f] bg-[#1d223f] text-white"
                              : "border-[#dbe5f1] bg-white text-[#1d223f]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            className="h-4 w-4 shrink-0 rounded border-current"
                            onChange={() => {
                              const nextLocations = isSelected
                                ? formValues.hiringLocations.filter(
                                    (selectedLocation) =>
                                      selectedLocation !== location,
                                  )
                                : [...formValues.hiringLocations, location];

                              updateField("hiringLocations", nextLocations);
                            }}
                          />
                          <span>{location}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                {renderError("hiringLocations")}
              </div>
            </div>

            {saveState ? (
              <p
                className={`mt-6 text-[14px] font-medium ${
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
                className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#1d223f] px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#2b3561] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save Details"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
