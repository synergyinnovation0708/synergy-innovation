import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api";
import {
  adminCandidateAccountStatuses,
  type AdminCandidateAccountStatus,
} from "@/lib/admin-candidates-shared";
import { isAdminUser } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    candidateId: string;
  }>;
};

const indefiniteSuspensionDuration = "876000h";

const isCandidateAccountStatus = (
  value: string,
): value is AdminCandidateAccountStatus =>
  adminCandidateAccountStatuses.includes(
    value as AdminCandidateAccountStatus,
  );

export const PATCH = async (request: Request, context: RouteContext) => {
  const accessErrorResponse = await requireAdminApiAccess();

  if (accessErrorResponse) {
    return accessErrorResponse;
  }

  const { candidateId } = await context.params;

  if (!candidateId?.trim()) {
    return NextResponse.json(
      {
        message: "Candidate id is required.",
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
      ? String(payload.status).trim()
      : "";

  if (!isCandidateAccountStatus(nextStatus)) {
    return NextResponse.json(
      {
        message: "Please choose a valid account status.",
      },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { data: existingUserData, error: existingUserError } =
      await supabase.auth.admin.getUserById(candidateId);

    if (existingUserError || !existingUserData.user) {
      return NextResponse.json(
        {
          message: "Candidate account not found.",
        },
        { status: 404 },
      );
    }

    if (isAdminUser(existingUserData.user)) {
      return NextResponse.json(
        {
          message: "Admin accounts cannot be updated from candidate actions.",
        },
        { status: 400 },
      );
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      candidateId,
      {
        ban_duration:
          nextStatus === "suspended"
            ? indefiniteSuspensionDuration
            : "none",
      },
    );

    if (updateError) {
      return NextResponse.json(
        {
          message: "Unable to update candidate account status right now.",
        },
        { status: 500 },
      );
    }

    revalidatePath("/admin/candidates");

    return NextResponse.json({
      message:
        nextStatus === "suspended"
          ? "Candidate account suspended successfully."
          : "Candidate account reactivated successfully.",
      status: nextStatus,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Unable to update candidate account status right now.",
      },
      { status: 500 },
    );
  }
};
