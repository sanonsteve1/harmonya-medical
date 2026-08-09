import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "white" | "glow";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-white hover:bg-navy-soft shadow-[0_10px_28px_rgba(7,26,61,0.25)]",
  secondary:
    "bg-teal text-navy-deep hover:bg-teal-dark hover:text-white shadow-[0_10px_28px_rgba(0,194,204,0.3)]",
  outline:
    "border border-[color:var(--inverse-border)] text-[color:var(--inverse-fg)] bg-[color:var(--inverse-soft)] hover:border-teal hover:bg-teal/10",
  ghost: "bg-transparent text-navy hover:text-teal",
  white:
    "bg-white text-navy hover:bg-mist shadow-[0_10px_28px_rgba(0,0,0,0.12)]",
  glow: "bg-teal text-navy-deep glow-teal hover:bg-white",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.96] ${variants[variant]} ${className}`;

  if (href) {
    // Hash links must use <a> — Next.js Link does not scroll to in-page anchors reliably
    if (href.startsWith("#")) {
      return (
        <a href={href} className={classes} onClick={onClick}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
