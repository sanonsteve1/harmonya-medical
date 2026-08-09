"use client";

import { useEffect } from "react";

type SuccessModalProps = {
  open: boolean;
  title: string;
  message: string;
  closeLabel: string;
  onClose: () => void;
};

export function SuccessModal({
  open,
  title,
  message,
  closeLabel,
  onClose,
}: SuccessModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-message"
    >
      <button
        type="button"
        aria-label={closeLabel}
        className="absolute inset-0 bg-navy-deep/55 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md animate-[fade-up_0.35s_cubic-bezier(0.2,0,0,1)] rounded-[1.75rem] border border-teal/30 bg-white p-6 shadow-[0_24px_70px_rgba(7,26,61,0.28)] sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-soft text-teal-dark outline outline-1 outline-teal/25">
          <CheckIcon />
        </div>

        <h2
          id="success-modal-title"
          className="mt-5 text-center font-display text-xl font-bold text-navy"
        >
          {title}
        </h2>

        <p
          id="success-modal-message"
          className="mt-3 rounded-xl border border-teal/30 bg-teal-soft px-4 py-3 text-center text-sm font-medium leading-relaxed text-navy"
        >
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition-[transform,background-color] hover:bg-navy-soft active:scale-[0.96]"
        >
          {closeLabel}
        </button>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
      <path
        d="M6.5 12.5l3.5 3.5 7.5-8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
