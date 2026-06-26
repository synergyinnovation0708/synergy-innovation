"use client";

import Image from "next/image";
import { ChevronDown, X } from "lucide-react";
import {
  useEffect,
  useState,
  type ReactNode,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  itServiceInquiryInitialValues,
  itServiceOptions,
  validateITServiceInquiryValues,
  type ITServiceInquiryFieldName,
  type ITServiceInquiryFormValues,
  type ITServiceInquiryValidationErrors,
} from "@/lib/it-service-inquiries";

const triggerClassName =
  "group inline-flex h-[50px] w-[200px] cursor-pointer items-center justify-between rounded-[25px] bg-[#1d223f] pl-[26px] pr-[4px] text-[20px] font-semibold leading-[1.2] text-white transition-transform duration-200 hover:-translate-y-0.5";

const inputClassName =
  "h-[60px] w-full rounded-[8px] border border-[#ececec] bg-white px-6 text-[18px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#9c9c9c] focus:border-[#00adef]";

const getFieldClassName = (hasError: boolean) =>
  `${inputClassName} ${hasError ? "border-[#dc2626] focus:border-[#dc2626]" : ""}`;

type ITServicesInquiryTriggerProps = {
  children?: ReactNode;
  className?: string;
};

type FormStatus = {
  message: string;
  type: "error" | "success";
};

type TextFieldProps = {
  autoComplete?: string;
  error?: string;
  inputMode?: "email" | "tel" | "text";
  label: string;
  name: ITServiceInquiryFieldName;
  onBlur: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: "email" | "tel" | "text";
  value: string;
};

const TextField = ({
  autoComplete,
  error,
  inputMode,
  label,
  name,
  onBlur,
  onChange,
  type = "text",
  value,
}: TextFieldProps) => (
  <div>
    <label htmlFor={name} className="sr-only">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      inputMode={inputMode}
      autoComplete={autoComplete}
      placeholder={label}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name}-error` : undefined}
      className={getFieldClassName(Boolean(error))}
    />
    {error ? (
      <p id={`${name}-error`} className="mt-2 text-sm text-[#dc2626]">
        {error}
      </p>
    ) : null}
  </div>
);

export const ITServicesInquiryTrigger = ({
  children,
  className = triggerClassName,
}: ITServicesInquiryTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus | null>(null);
  const [formValues, setFormValues] = useState<ITServiceInquiryFormValues>(
    itServiceInquiryInitialValues,
  );
  const [errors, setErrors] = useState<ITServiceInquiryValidationErrors>({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as ITServiceInquiryFieldName;

    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));

    if (errors[fieldName]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [fieldName]: undefined,
      }));
    }

    if (status) {
      setStatus(null);
    }
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    setFormValues((currentValues) => ({
      ...currentValues,
      serviceRequired: value,
    }));

    if (errors.serviceRequired) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        serviceRequired: undefined,
      }));
    }

    if (status) {
      setStatus(null);
    }
  };

  const validateSingleField = (fieldName: ITServiceInquiryFieldName) => {
    const validationResult = validateITServiceInquiryValues(formValues);

    setErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: validationResult.errors[fieldName],
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = validateITServiceInquiryValues(formValues);

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      setStatus({
        message: "Please complete the required details.",
        type: "error",
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/it-service-inquiries", {
        body: JSON.stringify(validationResult.normalized),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const result = (await response.json().catch(() => null)) as
        | {
            errors?: ITServiceInquiryValidationErrors;
            message?: string;
          }
        | null;

      if (!response.ok) {
        if (result?.errors) {
          setErrors(result.errors);
        }

        setStatus({
          message:
            result?.message ?? "Unable to submit your request right now.",
          type: "error",
        });
        return;
      }

      setFormValues(itServiceInquiryInitialValues);
      setErrors({});
      setStatus({
        message:
          result?.message ??
          "Your request has been shared with our IT experts.",
        type: "success",
      });
    } catch {
      setStatus({
        message: "Unable to submit your request right now.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const modal =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[120] overflow-y-auto bg-[#1d223f]/58 px-4 py-6 backdrop-blur-[6px] sm:px-6"
            onClick={closeModal}
          >
            <div className="flex min-h-full items-center justify-center">
              <div
                className="relative my-4 w-full max-w-[980px] max-h-[calc(100vh-32px)] overflow-y-auto rounded-[28px] bg-white px-5 py-14 shadow-[0_32px_90px_rgba(29,34,63,0.3)] sm:my-6 sm:max-h-[calc(100vh-48px)] sm:px-8 lg:px-[56px] lg:py-[64px]"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="it-services-modal-title"
              >
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close IT services form"
                  className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e6ebf2] bg-white text-[#1d223f] transition-colors duration-200 hover:bg-[#f5f7fa] sm:right-5 sm:top-5"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="max-w-[820px]">
                  <p className="text-[24px] font-medium leading-[1.2] text-black sm:text-[28px] lg:text-[32px]">
                    Need Smart Tech Solutions?
                  </p>
                  <h2
                    id="it-services-modal-title"
                    className="mt-3 text-[34px] font-bold leading-[1.12] text-black sm:text-[40px] lg:text-[46px]"
                  >
                    Let&apos;s Build Your Next Digital Solution
                  </h2>

                  <form className="mt-9" onSubmit={handleSubmit}>
                    <div className="grid gap-4 md:grid-cols-2 md:gap-x-5 md:gap-y-4">
                      <TextField
                        autoComplete="name"
                        error={errors.name}
                        label="Name*"
                        name="name"
                        onBlur={() => validateSingleField("name")}
                        onChange={handleInputChange}
                        value={formValues.name}
                      />
                      <TextField
                        autoComplete="email"
                        error={errors.businessEmail}
                        inputMode="email"
                        label="Business Email*"
                        name="businessEmail"
                        onBlur={() => validateSingleField("businessEmail")}
                        onChange={handleInputChange}
                        type="email"
                        value={formValues.businessEmail}
                      />
                      <TextField
                        autoComplete="tel"
                        error={errors.contact}
                        inputMode="tel"
                        label="Contact*"
                        name="contact"
                        onBlur={() => validateSingleField("contact")}
                        onChange={handleInputChange}
                        type="tel"
                        value={formValues.contact}
                      />
                      <TextField
                        autoComplete="organization"
                        error={errors.companyName}
                        label="Company Name*"
                        name="companyName"
                        onBlur={() => validateSingleField("companyName")}
                        onChange={handleInputChange}
                        value={formValues.companyName}
                      />

                      <div className="relative">
                        <label htmlFor="serviceRequired" className="sr-only">
                          Service Required*
                        </label>
                        <select
                          id="serviceRequired"
                          name="serviceRequired"
                          value={formValues.serviceRequired}
                          onChange={handleSelectChange}
                          onBlur={() => validateSingleField("serviceRequired")}
                          aria-invalid={Boolean(errors.serviceRequired)}
                          aria-describedby={
                            errors.serviceRequired
                              ? "serviceRequired-error"
                              : undefined
                          }
                          className={`${getFieldClassName(Boolean(errors.serviceRequired))} appearance-none pr-14 text-[#1d223f] ${
                            formValues.serviceRequired ? "" : "text-[#9c9c9c]"
                          }`}
                        >
                          <option value="">Service Required*</option>
                          {itServiceOptions.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9c9c9c]" />
                        {errors.serviceRequired ? (
                          <p
                            id="serviceRequired-error"
                            className="mt-2 text-sm text-[#dc2626]"
                          >
                            {errors.serviceRequired}
                          </p>
                        ) : null}
                      </div>

                      <TextField
                        error={errors.projectBrief}
                        label="Project Brief / Requirement"
                        name="projectBrief"
                        onBlur={() => validateSingleField("projectBrief")}
                        onChange={handleInputChange}
                        value={formValues.projectBrief}
                      />
                    </div>

                    <p className="mt-4 text-[16px] font-medium leading-[1.4] text-[#9c9c9c] sm:text-[18px]">
                      Share your details and our IT team will reach out within
                      24 hours.
                    </p>

                    {status ? (
                      <div
                        className={`mt-5 rounded-[10px] border px-4 py-3 text-[14px] font-medium ${
                          status.type === "success"
                            ? "border-[#ccefd9] bg-[#f1fcf5] text-[#157347]"
                            : "border-[#ffd8d8] bg-[#fff5f5] text-[#b53c3c]"
                        }`}
                      >
                        {status.message}
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group mt-8 inline-flex h-[50px] w-full max-w-[269px] items-center justify-between rounded-[100px] bg-[#1d223f] pl-[24px] pr-[4px] text-[18px] font-semibold leading-[1.2] text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 sm:text-[20px]"
                    >
                      <span>
                        {isSubmitting ? "Submitting..." : "Talk to Our Experts"}
                      </span>
                      <Image
                        src="/icons/Group.svg"
                        alt=""
                        width={42}
                        height={42}
                        className="h-[42px] w-[42px] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45"
                      />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${className} cursor-pointer`}
      >
        {children ?? (
          <>
            <span>Get Started</span>
            <Image
              src="/icons/Group.svg"
              alt=""
              width={42}
              height={42}
              className="h-[42px] w-[42px] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-45"
            />
          </>
        )}
      </button>
      {modal}
    </>
  );
};

export const ITServicesTopCta = () => {
  return <ITServicesInquiryTrigger className={triggerClassName} />;
};
