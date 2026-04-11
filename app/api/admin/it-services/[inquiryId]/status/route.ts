import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api";
import {
  isITServiceInquiryStatus,
  type ITServiceInquiryStatus,
} from "@/lib/it-service-inquiries";
import { createAdminClient } from "@/lib/supabase/admin";

const itServiceInquiriesTableName =
  process.env.SUPABASE_IT_SERVICE_INQUIRIES_TABLE?.trim() ||
  "it_service_inquiries";

type RouteContext = {
  params: Promise<{
    inquiryId: string;
  }>;
};

export const PATCH = async (request: Request, context: RouteContext) => {
  const adminAccessError = await requireAdminApiAccess();

  if (adminAccessError) {
    return adminAccessError;
  }

  const { inquiryId } = await context.params;

  if (!inquiryId?.trim()) {
    return NextResponse.json(
      {
        message: "Inquiry id is required.",
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

  const nextStatus =
    typeof payload === "object" && payload !== null && "status" in payload
      ? String(payload.status)
      : "";

  if (!isITServiceInquiryStatus(nextStatus)) {
    return NextResponse.json(
      {
        message: "Please select a valid status.",
      },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from(itServiceInquiriesTableName)
    .update({
      status: nextStatus as ITServiceInquiryStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", inquiryId);

  if (error) {
    return NextResponse.json(
      {
        message: error.message.includes("does not exist")
          ? "Run the latest it_service_inquiries SQL migration in Supabase before updating status."
          : "Unable to update IT services inquiry status right now.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "IT services inquiry status updated successfully.",
  });
};
