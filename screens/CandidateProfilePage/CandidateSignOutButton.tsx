"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export const CandidateSignOutButton = () => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setErrorMessage("Unable to sign out right now. Please try again.");
        return;
      }

      router.replace("/candidate/login");
      router.refresh();
    } catch {
      setErrorMessage("Unable to sign out right now. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="inline-flex items-center gap-2 rounded-full bg-[#1d223f] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-[#2a3158] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSigningOut ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Signing out
          </>
        ) : (
          "Sign out"
        )}
      </button>

      {errorMessage ? (
        <p className="text-[13px] font-medium text-[#c05a5a]">{errorMessage}</p>
      ) : null}
    </div>
  );
};
