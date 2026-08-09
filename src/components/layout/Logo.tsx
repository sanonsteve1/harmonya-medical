import Image from "next/image";
import { Link } from "@/i18n/navigation";

const sizes = {
  md: {
    width: 220,
    height: 176,
    className: "h-[52px] w-auto sm:h-[72px] lg:h-[80px]",
  },
  lg: {
    width: 240,
    height: 192,
    className: "h-[64px] w-auto sm:h-[84px] lg:h-[96px]",
  },
} as const;

export function Logo({
  variant = "default",
  size = "md",
  className = "",
}: {
  variant?: "default" | "light" | "onDark";
  size?: keyof typeof sizes;
  className?: string;
}) {
  const dimensions = sizes[size];

  if (variant === "light") {
    return (
      <Link
        href="/"
        className={`inline-flex shrink-0 items-center rounded-xl bg-white p-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.2)] sm:rounded-2xl sm:p-2 ${className}`}
        aria-label="HARMONYA MEDICAL — Accueil"
      >
        <Image
          src="/logo.png"
          alt="HARMONYA MEDICAL"
          width={dimensions.width}
          height={dimensions.height}
          className={`${dimensions.className} object-contain`}
          priority
        />
      </Link>
    );
  }

  if (variant === "onDark") {
    return (
      <Link
        href="/"
        className={`inline-flex shrink-0 items-center rounded-xl bg-white/95 px-1.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.2)] sm:px-2.5 sm:py-2 ${className}`}
        aria-label="HARMONYA MEDICAL — Accueil"
      >
        <Image
          src="/logo.png"
          alt="HARMONYA MEDICAL"
          width={dimensions.width}
          height={dimensions.height}
          className={`${dimensions.className} object-contain`}
          priority
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center rounded-xl bg-white px-1.5 py-1.5 sm:px-2.5 sm:py-2 ${className}`}
      aria-label="HARMONYA MEDICAL — Accueil"
    >
      <Image
        src="/logo.png"
        alt="HARMONYA MEDICAL"
        width={dimensions.width}
        height={dimensions.height}
        className={`${dimensions.className} object-contain object-left`}
        priority
      />
    </Link>
  );
}
