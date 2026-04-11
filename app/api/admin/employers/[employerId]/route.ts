import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateEmployerInquiryValues } from "@/lib/employer-inquiries";

const employerInquiriesTableName =
  process.env.SUPABASE_EMPLOYER_INQUIRIES_TABLE?.trim() || "employer_inquiries";

type RouteContext = {
  params: Promise<{
    employerId: string;
  }>;
};

export const PATCH = async (request: Request, context: RouteContext) => {
  const adminAccessError = await requireAdminApiAccess();

  if (adminAccessError) {
    return adminAccessError;
  }

  const { employerId } = await context.params;

  if (!employerId?.trim()) {
    return NextResponse.json(
      {
        message: "Employer id is required.",
      },
      { status: 400 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        message: "Invalid request payload.",
      },
      { status: 400 },
    );
  }

  const validationResult = validateEmployerInquiryValues({
    companyName:
      typeof payload === "object" && payload !== null && "companyName" in payload
        ? String(payload.companyName)
        : "",
    contact:
      typeof payload === "object" && payload !== null && "contact" in payload
        ? String(payload.contact)
        : "",
    hiringLocations:
      typeof payload === "object" &&
      payload !== null &&
      "hiringLocations" in payload &&
      Array.isArray(payload.hiringLocations)
        ? payload.hiringLocations.map((location) => String(location))
        : [],
    hiringRequirement:
      typeof payload === "object" &&
      payload !== null &&
      "hiringRequirement" in payload
        ? String(payload.hiringRequirement)
        : "",
    hiringType:
      typeof payload === "object" && payload !== null && "hiringType" in payload
        ? String(payload.hiringType)
        : "",
    numberOfPositions:
      typeof payload === "object" &&
      payload !== null &&
      "numberOfPositions" in payload
        ? String(payload.numberOfPositions)
        : "",
    workEmail:
      typeof payload === "object" && payload !== null && "workEmail" in payload
        ? String(payload.workEmail)
        : "",
    yourName:
      typeof payload === "object" && payload !== null && "yourName" in payload
        ? String(payload.yourName)
        : "",
  });

  if (!validationResult.isValid) {
    return NextResponse.json(
      {
        errors: validationResult.errors,
        message: "Please correct the highlighted fields.",
      },
      { status: 400 },
    );
  }

  const normalized = validationResult.normalized;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from(employerInquiriesTableName)
    .update({
      company_name: normalized.companyName,
      contact_name: normalized.yourName,
      work_email: normalized.workEmail,
      contact_number: normalized.contact,
      hiring_requirement: normalized.hiringRequirement,
      hiring_type: normalized.hiringType,
      hiring_locations: normalized.hiringLocations,
      number_of_positions: Number.parseInt(normalized.numberOfPositions, 10),
    })
    .eq("id", employerId);

  if (error) {
    return NextResponse.json(
      {
        message: "Unable to update employer details right now.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Employer details updated successfully.",
  });
};
