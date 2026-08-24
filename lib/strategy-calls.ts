export const strategyCallTimeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
] as const;

export const strategyCallStatuses = [
  "pending",
  "scheduled",
  "completed",
  "cancelled",
] as const;

export type StrategyCallFormValues = {
  fullName: string;
  businessEmail: string;
  contactNumber: string;
  subject: string;
  preferredDate: string;
  preferredTimeSlot: string;
  notes: string;
};

export type StrategyCallFieldName = keyof StrategyCallFormValues;
export type StrategyCallStatus = (typeof strategyCallStatuses)[number];

export type StrategyCallValidationErrors = Partial<
  Record<StrategyCallFieldName, string>
>;

export const strategyCallInitialValues: StrategyCallFormValues = {
  fullName: "",
  businessEmail: "",
  contactNumber: "",
  subject: "Strategy Call",
  preferredDate: "",
  preferredTimeSlot: "",
  notes: "",
};

export const validateStrategyCallValues = (
  values: StrategyCallFormValues,
): {
  isValid: boolean;
  errors: StrategyCallValidationErrors;
  normalized: StrategyCallFormValues;
} => {
  const errors: StrategyCallValidationErrors = {};
  const normalized = { ...values };

  // Full Name
  normalized.fullName = values.fullName.trim();
  if (!normalized.fullName) {
    errors.fullName = "Full Name is required.";
  }

  // Business Email
  normalized.businessEmail = values.businessEmail.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!normalized.businessEmail) {
    errors.businessEmail = "Business Email is required.";
  } else if (!emailPattern.test(normalized.businessEmail)) {
    errors.businessEmail = "Please enter a valid email address.";
  }

  // Contact Number
  normalized.contactNumber = values.contactNumber.trim();
  if (!normalized.contactNumber) {
    errors.contactNumber = "Contact Number is required.";
  } else if (!/^\d{10,12}$/.test(normalized.contactNumber)) {
    errors.contactNumber = "Contact Number must be between 10 and 12 digits.";
  }

  // Subject
  normalized.subject = values.subject.trim();
  if (!normalized.subject) {
    errors.subject = "Subject is required.";
  }

  // Preferred Date
  normalized.preferredDate = values.preferredDate.trim();
  if (!normalized.preferredDate) {
    errors.preferredDate = "Preferred Date is required.";
  } else {
    const selectedDate = new Date(normalized.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.preferredDate = "Preferred Date cannot be in the past.";
    }
  }

  // Preferred Time Slot
  normalized.preferredTimeSlot = values.preferredTimeSlot.trim();
  if (!normalized.preferredTimeSlot) {
    errors.preferredTimeSlot = "Preferred Time Slot is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    normalized,
  };
};

export const isStrategyCallStatus = (value: unknown): value is StrategyCallStatus =>
  typeof value === "string" && strategyCallStatuses.includes(value as StrategyCallStatus);
