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
  strategyCallInitialValues,
  strategyCallTimeSlots,
  validateStrategyCallValues,
  type StrategyCallFieldName,
  type StrategyCallFormValues,
  type StrategyCallValidationErrors,
} from "@/lib/strategy-calls";

type ScheduleCallTriggerProps = {
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
  name: StrategyCallFieldName;
  onBlur: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: "email" | "tel" | "text" | "date";
  value: string;
};

const inputClassName =
  "h-[60px] w-full rounded-[8px] border border-[#ececec] bg-white px-6 text-[18px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#9c9c9c] focus:border-[#00adef]";

const getFieldClassName = (hasError: boolean) =>
  `${inputClassName} ${hasError ? "border-[#dc2626] focus:border-[#dc2626]" : ""}`;

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

export const ScheduleCallTrigger = ({
  children,
  className = "inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/6 hover:bg-white/10 px-8 py-4 text-[14.5px] font-semibold text-white transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5",
}: ScheduleCallTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus | null>(null);
  const [formValues, setFormValues] = useState<StrategyCallFormValues>(
    strategyCallInitialValues,
  );
  const [errors, setErrors] = useState<StrategyCallValidationErrors>({});

  useEffect(() => {
    if (!isOpen) return;

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

  const openModal = () => {
    setIsOpen(true);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as StrategyCallFieldName;

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
      preferredTimeSlot: value,
    }));

    if (errors.preferredTimeSlot) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        preferredTimeSlot: undefined,
      }));
    }

    if (status) {
      setStatus(null);
    }
  };

  const validateSingleField = (fieldName: StrategyCallFieldName) => {
    const validationResult = validateStrategyCallValues(formValues);
    if (validationResult.errors[fieldName]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [fieldName]: validationResult.errors[fieldName],
      }));
    } else {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [fieldName]: undefined,
      }));
    }
  };

  const sendEmailJSNotification = async (values: StrategyCallFormValues) => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_default";
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_default";
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!publicKey) {
      console.warn("EmailJS Public Key is not configured in environment variables.");
      return;
    }

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            name: values.fullName,
            email: values.businessEmail,
            phone: values.contactNumber,
            call_type: values.subject,
            date: values.preferredDate,
            time_slot: values.preferredTimeSlot,
            message: values.notes || "None",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      console.log("EmailJS notification sent successfully.");
    } catch (err) {
      console.error("Failed to send EmailJS notification:", err);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = validateStrategyCallValues(formValues);

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
      const response = await fetch("/api/strategy-calls", {
        body: JSON.stringify(validationResult.normalized),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const responseData = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus({
          message: responseData.message || "Failed to schedule strategy call.",
          type: "error",
        });
        return;
      }

      // Trigger EmailJS Notification
      await sendEmailJSNotification(validationResult.normalized);

      setStatus({
        message: "Your strategy call has been scheduled successfully!",
        type: "success",
      });
      setFormValues(strategyCallInitialValues);
    } catch {
      setStatus({
        message: "Unable to schedule strategy call right now.",
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
            className="fixed inset-0 z-[100] flex overflow-y-auto bg-[#1d223f]/58 p-4 backdrop-blur-[5px] items-center justify-center"
            onClick={closeModal}
          >
            <div className="flex min-h-full items-center justify-center w-full">
              <div
                className="relative my-4 w-full max-w-[980px] max-h-[calc(100vh-32px)] overflow-y-auto rounded-[28px] bg-white px-5 py-14 shadow-[0_32px_90px_rgba(29,34,63,0.3)] sm:my-6 sm:max-h-[calc(100vh-48px)] sm:px-8 lg:px-[56px] lg:py-[64px]"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="strategy-call-modal-title"
              >
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close strategy call scheduler"
                  className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e6ebf2] bg-white text-[#1d223f] transition-colors duration-200 hover:bg-[#f5f7fa] sm:right-5 sm:top-5"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="max-w-[820px]">
                  <p className="text-[24px] font-medium leading-[1.2] text-black sm:text-[28px] lg:text-[32px]">
                    Schedule a Strategy Call
                  </p>
                  <h2
                    id="strategy-call-modal-title"
                    className="mt-3 text-[34px] font-bold leading-[1.12] text-black sm:text-[40px] lg:text-[46px]"
                  >
                    Let&apos;s Plan Your Website
                  </h2>

                  <form className="mt-9" onSubmit={handleSubmit}>
                    <div className="grid gap-4 md:grid-cols-2 md:gap-x-5 md:gap-y-4">
                      <TextField
                        autoComplete="name"
                        error={errors.fullName}
                        label="Name*"
                        name="fullName"
                        onBlur={() => validateSingleField("fullName")}
                        onChange={handleInputChange}
                        value={formValues.fullName}
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
                        error={errors.contactNumber}
                        inputMode="tel"
                        label="Contact Number*"
                        name="contactNumber"
                        onBlur={() => validateSingleField("contactNumber")}
                        onChange={handleInputChange}
                        type="tel"
                        value={formValues.contactNumber}
                      />
                      <TextField
                        error={errors.subject}
                        label="Subject*"
                        name="subject"
                        onBlur={() => validateSingleField("subject")}
                        onChange={handleInputChange}
                        value={formValues.subject}
                      />
                      <TextField
                        error={errors.preferredDate}
                        label="Preferred Date*"
                        name="preferredDate"
                        onBlur={() => validateSingleField("preferredDate")}
                        onChange={handleInputChange}
                        type="date"
                        value={formValues.preferredDate}
                      />

                      <div className="relative">
                        <label htmlFor="preferredTimeSlot" className="sr-only">
                          Preferred Time Slot*
                        </label>
                        <select
                          id="preferredTimeSlot"
                          name="preferredTimeSlot"
                          value={formValues.preferredTimeSlot}
                          onChange={handleSelectChange}
                          aria-invalid={Boolean(errors.preferredTimeSlot)}
                          aria-describedby={
                            errors.preferredTimeSlot ? "preferredTimeSlot-error" : undefined
                          }
                          className={`${getFieldClassName(
                            Boolean(errors.preferredTimeSlot),
                          )} appearance-none pr-10`}
                        >
                          <option value="">Select Preferred Time Slot*</option>
                          {strategyCallTimeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9c9c9c]" />
                        {errors.preferredTimeSlot ? (
                          <p id="preferredTimeSlot-error" className="mt-2 text-sm text-[#dc2626]">
                            {errors.preferredTimeSlot}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="notes" className="sr-only">
                        Brief Project Description / Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        placeholder="Brief project details, questions, or specific agenda items..."
                        value={formValues.notes}
                        onChange={(e) =>
                          setFormValues((prev) => ({ ...prev, notes: e.target.value }))
                        }
                        className="w-full rounded-[8px] border border-[#ececec] bg-white p-6 text-[18px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#9c9c9c] focus:border-[#00adef]"
                      />
                    </div>

                    <p className="mt-4 text-[14.5px] leading-[1.65] text-[#868686]">
                      Share your details and our team will confirm your scheduled slot within 24 hours.
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
                      className="group mt-8 inline-flex h-[50px] w-full max-w-[290px] items-center justify-between rounded-[100px] bg-[#1d223f] pl-[24px] pr-[4px] text-[18px] font-semibold leading-[1.2] text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 sm:text-[20px]"
                    >
                      <span>
                        {isSubmitting ? "Scheduling..." : "Schedule Strategy Call"}
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
        onClick={openModal}
        className={`${className} cursor-pointer`}
      >
        {children ?? (
          <>
            <span>Schedule Strategy Call</span>
          </>
        )}
      </button>
      {modal}
    </>
  );
};
