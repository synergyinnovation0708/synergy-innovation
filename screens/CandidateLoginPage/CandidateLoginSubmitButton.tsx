"use client";

import { LoaderCircle, LockKeyhole } from "lucide-react";
import { useFormStatus } from "react-dom";

type CandidateLoginSubmitButtonProps = {
  disabled?: boolean;
};

export const CandidateLoginSubmitButton = ({
  disabled = false,
}: CandidateLoginSubmitButtonProps) => {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="group mx-auto inline-flex h-[54px] items-center justify-center gap-2 rounded-full bg-[#1d223f] px-4 text-[17px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <span>Submitting...</span>
        </>
      ) : (
        <>
          <span>Sign In</span>
           <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/10">
            <LockKeyhole className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
          </span>
        </>
      )}
    </button>
  );
};
