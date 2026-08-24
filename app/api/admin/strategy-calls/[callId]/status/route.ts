import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api";
import { isStrategyCallStatus, type StrategyCallStatus } from "@/lib/strategy-calls";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    callId: string;
  }>;
};

export const PATCH = async (request: Request, context: RouteContext) => {
  const adminAccessError = await requireAdminApiAccess();

  if (adminAccessError) {
    return adminAccessError;
  }

  const { callId } = await context.params;

  if (!callId?.trim()) {
    return NextResponse.json(
      {
        message: "Call id is required.",
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

  if (!isStrategyCallStatus(nextStatus)) {
    return NextResponse.json(
      {
        message: "Please select a valid status.",
      },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("strategy_calls")
    .update({
      status: nextStatus as StrategyCallStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", callId);

  if (error) {
    return NextResponse.json(
      {
        message: error.message.includes("does not exist")
          ? "Run the latest strategy_calls SQL migration in Supabase before updating status."
          : "Unable to update strategy call status right now.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Strategy call status updated successfully.",
  });
};
