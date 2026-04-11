"use client";

import {
  Building2,
  Globe,
  Mail,
  MapPinned,
  Phone,
  UserRound,
  X,
} from "lucide-react";
import { useEffect } from "react";

type AdminNewEmployerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const inputClassName =
  "mt-2 h-[54px] w-full rounded-[18px] border border-[#dbe5f1] bg-[#f8fbff] px-4 text-[15px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8794b1] focus:border-[#00adef] focus:bg-white";

const textareaClassName =
  "mt-2 min-h-[120px] w-full rounded-[18px] border border-[#dbe5f1] bg-[#f8fbff] px-4 py-4 text-[15px] font-medium text-[#1d223f] outline-none transition-colors duration-200 placeholder:text-[#8794b1] focus:border-[#00adef] focus:bg-white";

export const AdminNewEmployerModal = ({
  isOpen,
  onClose,
}: AdminNewEmployerModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d223f]/58 px-4 py-6 backdrop-blur-[5px] sm:px-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-[980px] flex-col overflow-hidden rounded-[34px] bg-white shadow-[0_32px_90px_rgba(29,34,63,0.3)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close new employer modal"
          className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe5f1] bg-white text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto">
          <div className="bg-[linear-gradient(180deg,#eef9ff_0%,#ffffff_100%)] px-6 pb-7 pt-7 sm:px-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eaf8ff] text-[#00adef]">
              <Building2 className="h-6 w-6" />
            </div>
            <p className="mt-6 text-[14px] font-semibold uppercase tracking-[0.16em] text-[#00adef]">
              Create Employer
            </p>
            <h2 className="mt-2 text-[32px] font-bold leading-[1.1] text-[#1d223f] sm:text-[38px]">
              Add a new employer account
            </h2>
            <p className="mt-3 max-w-[720px] text-[15px] leading-[1.7] text-[#6b7894] sm:text-[16px]">
              Capture the company profile, point of contact, and account details
              needed to onboard a new employer into the admin directory.
            </p>
          </div>

          <form
            className="px-6 pb-8 pt-2 sm:px-8 sm:pb-10"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="company-name"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Company Name*
                </label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7d89a4]" />
                  <input
                    id="company-name"
                    type="text"
                    required
                    placeholder="BluePeak Systems"
                    className={`${inputClassName} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="industry"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Industry*
                </label>
                <input
                  id="industry"
                  type="text"
                  required
                  placeholder="Cloud Infrastructure"
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-name"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Contact Person*
                </label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7d89a4]" />
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Rachel Green"
                    className={`${inputClassName} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Contact Email*
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7d89a4]" />
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="rachel@bluepeak.io"
                    className={`${inputClassName} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Contact Number*
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7d89a4]" />
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className={`${inputClassName} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Company Website*
                </label>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7d89a4]" />
                  <input
                    id="website"
                    type="url"
                    required
                    placeholder="https://bluepeak.io"
                    className={`${inputClassName} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Location*
                </label>
                <div className="relative">
                  <MapPinned className="pointer-events-none absolute left-4 top-[31px] h-4 w-4 text-[#7d89a4]" />
                  <input
                    id="location"
                    type="text"
                    required
                    placeholder="Bengaluru, India"
                    className={`${inputClassName} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="company-size"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Company Size*
                </label>
                <select
                  id="company-size"
                  required
                  defaultValue=""
                  className={inputClassName}
                >
                  <option value="" disabled>
                    Select team size
                  </option>
                  <option>1-10</option>
                  <option>11-50</option>
                  <option>51-200</option>
                  <option>201-500</option>
                  <option>500+</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="open-roles"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Open Roles*
                </label>
                <input
                  id="open-roles"
                  type="number"
                  min="0"
                  required
                  placeholder="6"
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="account-status"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Account Status*
                </label>
                <select
                  id="account-status"
                  required
                  defaultValue=""
                  className={inputClassName}
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  <option>Active</option>
                  <option>Pending Review</option>
                  <option>On Hold</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="services-hiring-for"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Roles Hiring For*
                </label>
                <textarea
                  id="services-hiring-for"
                  required
                  placeholder="Cloud Engineer, DevOps Lead, Product Designer"
                  className={textareaClassName}
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="company-overview"
                  className="text-[15px] font-semibold text-[#1d223f]"
                >
                  Company Overview*
                </label>
                <textarea
                  id="company-overview"
                  required
                  placeholder="Write a short employer summary, team background, and hiring focus."
                  className={textareaClassName}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-[#e5edf6] pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-[52px] items-center justify-center rounded-full border border-[#dbe5f1] px-6 text-[15px] font-semibold text-[#1d223f] transition-colors duration-200 hover:bg-[#f4f8fc]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#1d223f] px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#2b3561]"
              >
                Create Employer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
