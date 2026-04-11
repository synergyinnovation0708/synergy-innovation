import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { validateITServiceInquiryValues } from "@/lib/it-service-inquiries";

const itServiceInquiriesTableName =
  process.env.SUPABASE_IT_SERVICE_INQUIRIES_TABLE?.trim() ||
  "it_service_inquiries";

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

  const validationResult = validateITServiceInquiryValues({
    businessEmail:
      typeof payload === "object" &&
      payload !== null &&
      "businessEmail" in payload
        ? String(payload.businessEmail)
        : "",
    companyName:
      typeof payload === "object" && payload !== null && "companyName" in payload
        ? String(payload.companyName)
        : "",
    contact:
      typeof payload === "object" && payload !== null && "contact" in payload
        ? String(payload.contact)
        : "",
    name:
      typeof payload === "object" && payload !== null && "name" in payload
        ? String(payload.name)
        : "",
    projectBrief:
      typeof payload === "object" &&
      payload !== null &&
      "projectBrief" in payload
        ? String(payload.projectBrief)
        : "",
    serviceRequired:
      typeof payload === "object" &&
      payload !== null &&
      "serviceRequired" in payload
        ? String(payload.serviceRequired)
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
    const { error } = await supabase
      .from(itServiceInquiriesTableName)
      .insert(validationResult.record);

    if (error) {
      console.error("IT service inquiry insert failed:", error);

      return NextResponse.json(
        {
          message: "Unable to submit your request right now.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Your request has been shared with our IT experts.",
    });
  } catch (error) {
    console.error("IT service inquiry submission failed:", error);

    return NextResponse.json(
      {
        message: "Unable to submit your request right now.",
      },
      { status: 500 },
    );
  }
};
