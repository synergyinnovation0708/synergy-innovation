export const employerLocations = [
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Gurgaon",
  "Noida",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Meerut",
  "Saharanpur",
  "Ghaziabad",
  "Moradabad",
  "Jhansi",
  "Punjab",
  "Jammu",
  "Chandigarh",
  "Panchkula",
  "Baddi",
  "Uttarakhand",
  "Indore",
  "Bhopal",
  "Nagpur",
  "Surat",
  "Vadodara",
  "Coimbatore",
  "Kochi",
  "Visakhapatnam",
  "Patna",
  "Remote",
] as const;

export const employerHiringTypes = [
  "Permanent",
  "Contract",
  "Internship",
  "Freelance",
  "Part-time",
] as const;

export const employerInquiryStatuses = [
  "pending",
  "in_progress",
  "onboarded",
  "cancelled",
] as const;

export type EmployerInquiryFormValues = {
  companyName: string;
  yourName: string;
  workEmail: string;
  contact: string;
  hiringRequirement: string;
  hiringType: string;
  hiringLocations: string[];
  numberOfPositions: string;
};

export type EmployerInquiryFieldName = keyof EmployerInquiryFormValues;

export type EmployerInquiryStatus = (typeof employerInquiryStatuses)[number];

export type EmployerInquiryValidationErrors = Partial<
  Record<EmployerInquiryFieldName, string>
>;

export type EmployerInquiryRecord = {
  company_name: string;
  contact_name: string;
  work_email: string;
  contact_number: string;
  hiring_requirement: string;
  hiring_type: string;
  hiring_locations: string[];
  number_of_positions: number;
  status: EmployerInquiryStatus;
};

export const employerInquiryInitialValues: EmployerInquiryFormValues = {
  companyName: "",
  yourName: "",
  workEmail: "",
  contact: "",
  hiringRequirement: "",
  hiringType: "",
  hiringLocations: [],
  numberOfPositions: "",
};

const professionalEmailBlockedDomains = new Set([
  "aol.com",
  "gmail.com",
  "gmx.com",
  "googlemail.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "mail.com",
  "msn.com",
  "outlook.com",
  "pm.me",
  "protonmail.com",
  "rediffmail.com",
  "yahoo.com",
  "ymail.com",
]);

const employerLocationMap = new Map(
  employerLocations.map((location) => [location.toLowerCase(), location]),
);

const employerHiringTypeMap = new Map(
  employerHiringTypes.map((hiringType) => [hiringType.toLowerCase(), hiringType]),
);

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const normalizeLocations = (locations: string[]) => {
  const selectedLocations = new Set<string>();

  for (const location of locations) {
    const normalizedLocation = employerLocationMap.get(
      normalizeText(location).toLowerCase(),
    );

    if (normalizedLocation) {
      selectedLocations.add(normalizedLocation);
    }
  }

  return employerLocations.filter((location) => selectedLocations.has(location));
};

const normalizeHiringType = (hiringType: string) =>
  employerHiringTypeMap.get(normalizeText(hiringType).toLowerCase()) ??
  normalizeText(hiringType);

const isProfessionalEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return false;
  }

  const [, domain = ""] = email.split("@");

  return !professionalEmailBlockedDomains.has(domain.toLowerCase());
};

export const normalizeEmployerInquiryValues = (
  values: EmployerInquiryFormValues,
): EmployerInquiryFormValues => ({
  companyName: normalizeText(values.companyName),
  yourName: normalizeText(values.yourName),
  workEmail: normalizeText(values.workEmail).toLowerCase(),
  contact: values.contact.replace(/\D/g, ""),
  hiringRequirement: normalizeText(values.hiringRequirement),
  hiringType: normalizeHiringType(values.hiringType),
  hiringLocations: normalizeLocations(values.hiringLocations),
  numberOfPositions: values.numberOfPositions.replace(/\D/g, ""),
});

export const validateEmployerInquiryValues = (
  values: EmployerInquiryFormValues,
) => {
  const normalized = normalizeEmployerInquiryValues(values);
  const errors: EmployerInquiryValidationErrors = {};
  const parsedPositionCount = Number.parseInt(normalized.numberOfPositions, 10);

  if (!normalized.companyName) {
    errors.companyName = "Company name is required.";
  }

  if (!normalized.yourName) {
    errors.yourName = "Your name is required.";
  }

  if (!normalized.workEmail) {
    errors.workEmail = "Work email is required.";
  } else if (!isProfessionalEmail(normalized.workEmail)) {
    errors.workEmail = "Enter a valid professional work email.";
  }

  if (!normalized.contact) {
    errors.contact = "Contact number is required.";
  } else if (
    normalized.contact.length < 10 ||
    normalized.contact.length > 12
  ) {
    errors.contact = "Contact number must be between 10 and 12 digits.";
  }

  if (!normalized.hiringRequirement) {
    errors.hiringRequirement = "Hiring requirement is required.";
  }

  if (!normalized.hiringType) {
    errors.hiringType = "Select a hiring type.";
  } else if (
    !employerHiringTypes.includes(
      normalized.hiringType as (typeof employerHiringTypes)[number],
    )
  ) {
    errors.hiringType = "Select a valid hiring type.";
  }

  if (normalized.hiringLocations.length === 0) {
    errors.hiringLocations = "Select at least one hiring location.";
  }

  if (!normalized.numberOfPositions) {
    errors.numberOfPositions = "Number of positions is required.";
  } else if (!Number.isFinite(parsedPositionCount) || parsedPositionCount < 1) {
    errors.numberOfPositions = "Enter a valid number of positions.";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    isValid,
    normalized,
    record: isValid
      ? {
          company_name: normalized.companyName,
          contact_name: normalized.yourName,
          work_email: normalized.workEmail,
          contact_number: normalized.contact,
          hiring_requirement: normalized.hiringRequirement,
          hiring_type: normalized.hiringType,
          hiring_locations: normalized.hiringLocations,
          number_of_positions: parsedPositionCount,
          status: "pending",
        }
      : null,
  };
};

export const isEmployerInquiryStatus = (
  status: string,
): status is EmployerInquiryStatus =>
  employerInquiryStatuses.includes(status as EmployerInquiryStatus);
