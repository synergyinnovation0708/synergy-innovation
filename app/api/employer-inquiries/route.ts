import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { validateEmployerInquiryValues } from "@/lib/employer-inquiries";

const employerInquiriesTableName =
  process.env.SUPABASE_EMPLOYER_INQUIRIES_TABLE?.trim() || "employer_inquiries";

export const POST = async (request: Request) => {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      {
        message: "Supabase is not configured.",
      },
      { status: 500 },
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

  if (!validationResult.isValid || !validationResult.record) {
    return NextResponse.json(
      {
        errors: validationResult.errors,
        message: "Please correct the highlighted fields.",
      },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const insertResult = await supabase
      .from(employerInquiriesTableName)
      .insert(validationResult.record);
    const retryResult =
      insertResult.error?.message?.includes("status") && validationResult.record
        ? await supabase.from(employerInquiriesTableName).insert({
            company_name: validationResult.record.company_name,
            contact_name: validationResult.record.contact_name,
            work_email: validationResult.record.work_email,
            contact_number: validationResult.record.contact_number,
            hiring_requirement: validationResult.record.hiring_requirement,
            hiring_type: validationResult.record.hiring_type,
            hiring_locations: validationResult.record.hiring_locations,
            number_of_positions: validationResult.record.number_of_positions,
          })
        : insertResult;
    const error = retryResult.error;

    if (error) {
      return NextResponse.json(
        {
          message: "Unable to submit your hiring request right now.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Your hiring request has been submitted successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        message: "Unable to submit your hiring request right now.",
      },
      { status: 500 },
    );
  }
};
