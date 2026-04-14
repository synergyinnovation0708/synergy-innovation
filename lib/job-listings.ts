export const jobEmploymentTypes = [
  "Full Time",
  "Part Time",
  "Contract",
  "Contract-to-Hire",
  "Internship",
] as const;

export const jobDepartments = [
  "Engineering / IT",
  "Data Science / AI",
  "Product Management",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "Human Resources",
  "Operations",
  "Customer Support",
  "Legal",
  "Healthcare",
  "Education",
  "Logistics / Supply Chain",
] as const;

export const jobWorkModes = ["On-site", "Hybrid", "Remote"] as const;

export const jobListingStatuses = [
  "Active",
  "Draft",
  "Urgent Requirement",
  "Upcoming Requirement",
  "Archived",
] as const;

export const jobListingLocations = [
  "Bengaluru",
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

export type JobListingEmploymentType = (typeof jobEmploymentTypes)[number];
export type JobListingDepartment = (typeof jobDepartments)[number];
export type JobListingWorkMode = (typeof jobWorkModes)[number];
export type JobListingStatus = (typeof jobListingStatuses)[number];

export const jobDepartmentSkills: Partial<
  Record<JobListingDepartment, readonly string[]>
> = {
  "Customer Support": [
    "Customer Handling",
    "Technical Support",
    "CRM Tools",
    "Ticketing Tools",
    "Customer Success",
    "Issue Resolution",
  ],
  Design: [
    "Figma",
    "Adobe XD",
    "Photoshop",
    "Illustrator",
    "UI Design",
    "UX Design",
    "Wireframing",
    "Prototyping",
    "Interaction Design",
    "Visual Design",
  ],
  "Data Science / AI": [
    "Python",
    "R",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "Data Analysis",
    "Data Visualization",
    "Power BI",
    "Tableau",
    "SQL",
  ],
  Education: [
    "Teaching",
    "Curriculum Development",
    "Classroom Management",
    "E-learning",
    "Content Creation",
    "Training",
  ],
  "Engineering / IT": [
    "JavaScript",
    "TypeScript",
    "React.js",
    "Next.js",
    "Angular",
    "Vue.js",
    "Node.js",
    "Express.js",
    "NestJS",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Redis",
    "GraphQL",
    "REST API",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Jenkins",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Bootstrap",
    "Microservices",
    "System Design",
  ],
  Finance: [
    "Accounting",
    "Taxation",
    "Auditing",
    "Financial Modeling",
    "Financial Analysis",
    "Excel",
    "Tally",
    "SAP",
    "Budgeting",
  ],
  Healthcare: [
    "Patient Care",
    "Clinical Research",
    "Medical Coding",
    "Healthcare Management",
    "Nursing",
    "Pharmacy",
  ],
  "Human Resources": [
    "Recruitment",
    "Talent Acquisition",
    "HR Operations",
    "Payroll",
    "Employee Engagement",
    "Compliance",
    "Performance Management",
  ],
  Legal: [
    "Contract Management",
    "Legal Research",
    "Compliance",
    "Corporate Law",
    "Intellectual Property",
    "Litigation",
  ],
  "Logistics / Supply Chain": [
    "Supply Chain Management",
    "Logistics",
    "Procurement",
    "Inventory Management",
    "Warehouse Management",
    "Distribution",
  ],
  Marketing: [
    "SEO",
    "SEM",
    "Google Ads",
    "Facebook Ads",
    "Content Marketing",
    "Social Media Marketing",
    "Email Marketing",
    "Marketing Automation",
    "Analytics",
    "Brand Management",
  ],
  Operations: [
    "Process Management",
    "Operations Strategy",
    "Project Coordination",
    "Vendor Management",
    "Supply Planning",
    "Business Operations",
  ],
  "Product Management": [
    "Product Strategy",
    "Roadmapping",
    "Agile",
    "Scrum",
    "User Research",
    "Market Research",
    "Wireframing",
    "Prototyping",
    "JIRA",
    "Confluence",
    "Stakeholder Management",
  ],
  Sales: [
    "Lead Generation",
    "B2B Sales",
    "B2C Sales",
    "CRM",
    "Salesforce",
    "Negotiation",
    "Client Handling",
    "Cold Calling",
    "Account Management",
  ],
};

export type JobListingFormValues = {
  applicationDeadline: string;
  companyName: string;
  department: string;
  employmentType: string;
  experienceMax: string;
  experienceMin: string;
  jobStatus: string;
  jobSummary: string;
  jobTitle: string;
  location: string;
  openings: string;
  requiredSkills: string;
  responsibilities: string;
  salaryMax: string;
  salaryMin: string;
  workMode: string;
};

export type JobListingFieldName = keyof JobListingFormValues;

export type JobListingValidationErrors = Partial<
  Record<JobListingFieldName, string>
>;

export type JobListingInsertRecord = {
  annual_ctc: string;
  applicants_count: number;
  application_deadline: string;
  company_name: string;
  department: string;
  employment_type: JobListingEmploymentType;
  experience_max_years: number;
  experience_min_years: number;
  experience_range: string;
  job_summary_html: string;
  job_title: string;
  location: string;
  openings: number;
  required_skills: string;
  responsibilities_html: string;
  salary_max_lpa: number;
  salary_min_lpa: number;
  status: JobListingStatus;
  work_mode: JobListingWorkMode;
};

export const jobListingInitialValues: JobListingFormValues = {
  applicationDeadline: "",
  companyName: "",
  department: "",
  employmentType: "",
  experienceMax: "",
  experienceMin: "",
  jobStatus: "",
  jobSummary: "",
  jobTitle: "",
  location: "",
  openings: "",
  requiredSkills: "",
  responsibilities: "",
  salaryMax: "",
  salaryMin: "",
  workMode: "",
};

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const jobLocationMap = new Map(
  jobListingLocations.map((location) => [location.toLowerCase(), location]),
);

const normalizeRichText = (value: string) => value.trim();

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

export const normalizeJobListingLocations = (value: string) => {
  const selectedLocations = new Set<string>();

  for (const part of value.split(",")) {
    const normalizedLocation = jobLocationMap.get(
      normalizeText(part).toLowerCase(),
    );

    if (normalizedLocation) {
      selectedLocations.add(normalizedLocation);
    }
  }

  return jobListingLocations.filter((location) => selectedLocations.has(location));
};

export const formatJobListingLocations = (locations: string[]) =>
  locations.join(", ");

export const parseJobListingSkills = (value: string) => {
  const uniqueSkills = new Set<string>();

  for (const skill of value.split(",")) {
    const normalizedSkill = normalizeText(skill);

    if (normalizedSkill) {
      uniqueSkills.add(normalizedSkill);
    }
  }

  return Array.from(uniqueSkills);
};

export const formatJobListingSkills = (skills: string[]) =>
  parseJobListingSkills(skills.join(", ")).join(", ");

const isValidDateInput = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  return !Number.isNaN(parsedDate.getTime());
};

export const normalizeJobListingValues = (
  values: JobListingFormValues,
): JobListingFormValues => ({
  applicationDeadline: normalizeText(values.applicationDeadline),
  companyName: normalizeText(values.companyName),
  department: normalizeText(values.department),
  employmentType: normalizeText(values.employmentType),
  experienceMax: values.experienceMax.replace(/\D/g, ""),
  experienceMin: values.experienceMin.replace(/\D/g, ""),
  jobStatus: normalizeText(values.jobStatus),
  jobSummary: normalizeRichText(values.jobSummary),
  jobTitle: normalizeText(values.jobTitle),
  location: formatJobListingLocations(normalizeJobListingLocations(values.location)),
  openings: values.openings.replace(/\D/g, ""),
  requiredSkills: formatJobListingSkills(parseJobListingSkills(values.requiredSkills)),
  responsibilities: normalizeRichText(values.responsibilities),
  salaryMax: values.salaryMax.replace(/\D/g, ""),
  salaryMin: values.salaryMin.replace(/\D/g, ""),
  workMode: normalizeText(values.workMode),
});

export const validateJobListingValues = (values: JobListingFormValues) => {
  const normalized = normalizeJobListingValues(values);
  const errors: JobListingValidationErrors = {};
  const parsedExperienceMax = Number.parseInt(normalized.experienceMax, 10);
  const parsedExperienceMin = Number.parseInt(normalized.experienceMin, 10);
  const parsedOpenings = Number.parseInt(normalized.openings, 10);
  const parsedSalaryMax = Number.parseInt(normalized.salaryMax, 10);
  const parsedSalaryMin = Number.parseInt(normalized.salaryMin, 10);

  if (!normalized.companyName) {
    errors.companyName = "Company name is required.";
  }

  if (!normalized.jobTitle) {
    errors.jobTitle = "Job title is required.";
  }

  if (!normalized.department) {
    errors.department = "Department is required.";
  } else if (
    !jobDepartments.includes(normalized.department as JobListingDepartment)
  ) {
    errors.department = "Select a valid department.";
  }

  if (!normalized.employmentType) {
    errors.employmentType = "Employment type is required.";
  } else if (
    !jobEmploymentTypes.includes(
      normalized.employmentType as JobListingEmploymentType,
    )
  ) {
    errors.employmentType = "Select a valid employment type.";
  }

  if (!normalized.workMode) {
    errors.workMode = "Work mode is required.";
  } else if (
    !jobWorkModes.includes(normalized.workMode as JobListingWorkMode)
  ) {
    errors.workMode = "Select a valid work mode.";
  }

  if (!normalized.location) {
    errors.location = "Location is required.";
  }

  if (!normalized.experienceMin) {
    errors.experienceMin = "Minimum experience is required.";
  } else if (
    !Number.isFinite(parsedExperienceMin) ||
    parsedExperienceMin < 0
  ) {
    errors.experienceMin = "Enter a valid minimum experience.";
  }

  if (!normalized.experienceMax) {
    errors.experienceMax = "Maximum experience is required.";
  } else if (
    !Number.isFinite(parsedExperienceMax) ||
    parsedExperienceMax < 0
  ) {
    errors.experienceMax = "Enter a valid maximum experience.";
  } else if (
    Number.isFinite(parsedExperienceMin) &&
    parsedExperienceMax < parsedExperienceMin
  ) {
    errors.experienceMax = "Maximum experience must be greater than or equal to minimum experience.";
  }

  if (!normalized.openings) {
    errors.openings = "Number of openings is required.";
  } else if (!Number.isFinite(parsedOpenings) || parsedOpenings < 1) {
    errors.openings = "Enter a valid number of openings.";
  }

  if (!normalized.salaryMin) {
    errors.salaryMin = "Minimum salary is required.";
  } else if (!Number.isFinite(parsedSalaryMin) || parsedSalaryMin < 0) {
    errors.salaryMin = "Enter a valid minimum salary.";
  }

  if (!normalized.salaryMax) {
    errors.salaryMax = "Maximum salary is required.";
  } else if (!Number.isFinite(parsedSalaryMax) || parsedSalaryMax < 0) {
    errors.salaryMax = "Enter a valid maximum salary.";
  } else if (
    Number.isFinite(parsedSalaryMin) &&
    parsedSalaryMax < parsedSalaryMin
  ) {
    errors.salaryMax = "Maximum salary must be greater than or equal to minimum salary.";
  }

  if (!normalized.applicationDeadline) {
    errors.applicationDeadline = "Application deadline is required.";
  } else if (!isValidDateInput(normalized.applicationDeadline)) {
    errors.applicationDeadline = "Select a valid application deadline.";
  }

  if (!normalized.jobStatus) {
    errors.jobStatus = "Job status is required.";
  } else if (
    !jobListingStatuses.includes(normalized.jobStatus as JobListingStatus)
  ) {
    errors.jobStatus = "Select a valid job status.";
  }

  if (!normalized.requiredSkills) {
    errors.requiredSkills = "Required skills are required.";
  }

  if (!stripHtml(normalized.jobSummary)) {
    errors.jobSummary = "Job summary is required.";
  }

  if (!stripHtml(normalized.responsibilities)) {
    errors.responsibilities = "Key responsibilities are required.";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    isValid,
    normalized,
    record: isValid
      ? {
          annual_ctc: `${parsedSalaryMin}-${parsedSalaryMax} LPA`,
          applicants_count: 0,
          application_deadline: normalized.applicationDeadline,
          company_name: normalized.companyName,
          department: normalized.department,
          employment_type: normalized.employmentType as JobListingEmploymentType,
          experience_max_years: parsedExperienceMax,
          experience_min_years: parsedExperienceMin,
          experience_range: `${parsedExperienceMin}-${parsedExperienceMax} Years`,
          job_summary_html: normalized.jobSummary,
          job_title: normalized.jobTitle,
          location: normalized.location,
          openings: parsedOpenings,
          required_skills: normalized.requiredSkills,
          responsibilities_html: normalized.responsibilities,
          salary_max_lpa: parsedSalaryMax,
          salary_min_lpa: parsedSalaryMin,
          status: normalized.jobStatus as JobListingStatus,
          work_mode: normalized.workMode as JobListingWorkMode,
        }
      : null,
  };
};
