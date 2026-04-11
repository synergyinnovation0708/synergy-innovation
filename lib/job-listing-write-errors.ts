type JobListingWriteAction = "create" | "update";

const fallbackMessages = {
  create: "Unable to create the job listing right now.",
  update: "Unable to update the job listing right now.",
} as const;

const jobListingSchemaPattern =
  /job_listings|company_name|job_title|department|employment_type|work_mode|location|experience_min_years|experience_max_years|experience_range|openings|salary_min_lpa|salary_max_lpa|annual_ctc|application_deadline|required_skills|job_summary_html|responsibilities_html|applicants_count|created_at|updated_at|status/i;

const schemaFailurePattern =
  /column .* does not exist|could not find the .* column|relation .* does not exist|schema cache/i;

export const getJobListingWriteFailureMessage = (
  action: JobListingWriteAction,
  errorMessage?: string,
) => {
  if (errorMessage && /SUPABASE_SERVICE_ROLE_KEY/i.test(errorMessage)) {
    return "Server is missing SUPABASE_SERVICE_ROLE_KEY. Add it to the environment and try again.";
  }

  if (
    errorMessage &&
    schemaFailurePattern.test(errorMessage) &&
    jobListingSchemaPattern.test(errorMessage)
  ) {
    return "Job listings table schema is out of date. Run supabase/job_listings.sql in Supabase and try again.";
  }

  return fallbackMessages[action];
};

export const logJobListingWriteError = (
  action: JobListingWriteAction,
  error: unknown,
) => {
  console.error(`Job listing ${action} failed:`, error);
};
