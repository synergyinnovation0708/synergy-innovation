import { NextResponse } from "next/server";
import { isAdminUser } from "./admin-auth";
import { toCandidateIdentity } from "./candidate-auth";
import { hasCandidateAccessRecord } from "./candidate-profile";
import { createClient } from "./supabase/server";
import { hasSupabaseEnv } from "./supabase/public-env";

type CandidateApiAccessMessages = {
  adminForbidden?: string;
  nonCandidateForbidden?: string;
  unauthenticated?: string;
};

export const requireCandidateApiAccess = async (
  messages?: CandidateApiAccessMessages,
) => {
  if (!hasSupabaseEnv()) {
    return {
      errorResponse: NextResponse.json(
        {
          message: "Supabase is not configured.",
        },
        { status: 500 },
      ),
      identity: null,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      errorResponse: NextResponse.json(
        {
          message: messages?.unauthenticated ?? "Authentication required.",
        },
        { status: 401 },
      ),
      identity: null,
    };
  }

  if (isAdminUser(user)) {
    return {
      errorResponse: NextResponse.json(
        {
          message: messages?.adminForbidden ?? "Admin accounts cannot use candidate actions.",
        },
        { status: 403 },
      ),
      identity: null,
    };
  }

  const identity = toCandidateIdentity(user);
  const hasCandidateAccess = await hasCandidateAccessRecord(identity);

  if (!hasCandidateAccess) {
    return {
      errorResponse: NextResponse.json(
        {
          message:
            messages?.nonCandidateForbidden ??
            "Only candidate accounts can use candidate actions.",
        },
        { status: 403 },
      ),
      identity: null,
    };
  }

  return {
    errorResponse: null,
    identity,
  };
};
