import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { validateStrategyCallValues } from "@/lib/strategy-calls";

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

  const values = {
    fullName:
      typeof payload === "object" && payload !== null && "fullName" in payload
        ? String(payload.fullName)
        : "",
    businessEmail:
      typeof payload === "object" && payload !== null && "businessEmail" in payload
        ? String(payload.businessEmail)
        : "",
    contactNumber:
      typeof payload === "object" && payload !== null && "contactNumber" in payload
        ? String(payload.contactNumber)
        : "",
    subject:
      typeof payload === "object" && payload !== null && "subject" in payload
        ? String(payload.subject)
        : "Strategy Call",
    preferredDate:
      typeof payload === "object" && payload !== null && "preferredDate" in payload
        ? String(payload.preferredDate)
        : "",
    preferredTimeSlot:
      typeof payload === "object" && payload !== null && "preferredTimeSlot" in payload
        ? String(payload.preferredTimeSlot)
        : "",
    notes:
      typeof payload === "object" && payload !== null && "notes" in payload
        ? String(payload.notes)
        : "",
  };

  const validationResult = validateStrategyCallValues(values);

  if (!validationResult.isValid) {
    return NextResponse.json(
      {
        errors: validationResult.errors,
        message: "Please correct the highlighted fields.",
      },
      { status: 400 },
    );
  }

  const { normalized } = validationResult;
  const dbRecord = {
    full_name: normalized.fullName,
    business_email: normalized.businessEmail,
    contact_number: normalized.contactNumber,
    subject: normalized.subject,
    preferred_date: normalized.preferredDate,
    preferred_time_slot: normalized.preferredTimeSlot,
    notes: normalized.notes,
    status: "pending",
  };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("strategy_calls")
      .insert(dbRecord);

    if (error) {
      console.error("Strategy call schedule insert failed:", error);

      return NextResponse.json(
        {
          message: "Unable to schedule your call right now.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Your strategy call has been scheduled successfully.",
    });
  } catch (error) {
    console.error("Strategy call scheduling failed:", error);

    return NextResponse.json(
      {
        message: "Unable to schedule your call right now.",
      },
      { status: 500 },
    );
  }
};
