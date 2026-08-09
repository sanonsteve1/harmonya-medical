export function SectionLabel({
  children,
  className = "",
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] ${
        tone === "dark" ? "text-teal" : "text-teal-dark"
      } ${className}`}
    >
      <span className="h-px w-5 bg-current opacity-70" aria-hidden />
      {children}
    </p>
  );
}
