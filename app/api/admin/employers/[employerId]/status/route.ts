import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isEmployerInquiryStatus,
  type EmployerInquiryStatus,
} from "@/lib/employer-inquiries";

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

  const nextStatus =
    typeof payload === "object" && payload !== null && "status" in payload
      ? String(payload.status)
      : "";

  if (!isEmployerInquiryStatus(nextStatus)) {
    return NextResponse.json(
      {
        message: "Please select a valid status.",
      },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from(employerInquiriesTableName)
    .update({
      status: nextStatus as EmployerInquiryStatus,
    })
    .eq("id", employerId);

  if (error) {
    return NextResponse.json(
      {
        message: error.message.includes("status")
          ? "Run the latest employer_inquiries SQL migration in Supabase before updating status."
          : "Unable to update employer status right now.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Employer status updated successfully.",
  });
};
