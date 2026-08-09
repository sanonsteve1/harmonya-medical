import { getTranslations } from "next-intl/server";
import {
  FlaskIcon,
  LeafIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/ui/Icons";

function FuturisticCore() {
  return (
    <div
      className="relative mb-4 flex h-[120px] w-[120px] items-center justify-center sm:h-[140px] sm:w-[140px]"
      aria-hidden
    >
      <span className="hero-deco-ring animate-core-ripple absolute inset-[18%] rounded-full border-2 border-teal/60" />
      <span className="hero-deco-ring animate-core-ripple-delay absolute inset-[18%] rounded-full border border-teal/50" />

      <span className="hero-deco-ring animate-orbit absolute inset-[8%] rounded-full border-2 border-dashed border-teal/50" />
      <span className="hero-deco-orbit animate-orbit-reverse absolute inset-[22%] rounded-full border-2" />

      <span className="animate-core-pulse absolute inset-[34%] rounded-full bg-gradient-to-br from-teal via-teal/70 to-navy shadow-[0_0_40px_rgba(0,194,204,0.55)]" />
      <span className="absolute inset-[42%] rounded-full bg-white/90 blur-[1px]" />

      <span className="animate-orbit-fast absolute inset-[12%]">
        <span className="animate-node-pulse absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal shadow-[0_0_12px_rgba(0,194,204,1)]" />
        <span className="absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-teal/90" />
        <span className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal" />
      </span>

      <svg
        className="hero-deco-accent animate-helix absolute inset-[20%] h-auto w-auto"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M30 12 C55 28, 55 42, 30 58 C5 74, 5 88, 30 98"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.95"
        />
        <path
          d="M70 12 C45 28, 45 42, 70 58 C95 74, 95 88, 70 98"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.7"
        />
        <circle cx="30" cy="20" r="3.2" fill="currentColor" />
        <circle cx="70" cy="20" r="3.2" fill="currentColor" opacity="0.85" />
        <circle cx="50" cy="40" r="2.8" fill="currentColor" />
        <circle cx="30" cy="55" r="3.2" fill="currentColor" opacity="0.85" />
        <circle cx="70" cy="55" r="3.2" fill="currentColor" />
        <circle cx="50" cy="75" r="2.8" fill="currentColor" opacity="0.85" />
        <line
          x1="30"
          y1="20"
          x2="70"
          y2="20"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.55"
        />
        <line
          x1="30"
          y1="55"
          x2="70"
          y2="55"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.55"
        />
      </svg>

      <span className="animate-logo-scan pointer-events-none absolute inset-x-4 top-0 h-8 rounded-full bg-gradient-to-b from-transparent via-teal/50 to-transparent" />
    </div>
  );
}

export async function HeroVisual() {
  const t = await getTranslations("HeroVisual");

  const floatingCards = [
    {
      icon: ShieldIcon,
      label: t("quality"),
      className: "left-0 top-[6%] animate-float",
      delay: "0s",
    },
    {
      icon: FlaskIcon,
      label: t("expertise"),
      className: "right-0 top-[24%] animate-float-slow",
      delay: "0.4s",
    },
    {
      icon: LeafIcon,
      label: t("impact"),
      className: "left-[2%] bottom-[20%] animate-float",
      delay: "0.8s",
    },
    {
      icon: UsersIcon,
      label: t("network"),
      className: "right-[2%] bottom-[6%] animate-float-slow",
      delay: "1.2s",
    },
  ];

  return (
    <div className="hero-visual relative mx-auto aspect-square w-full max-w-[560px] lg:max-w-none">
      <div
        className="hero-deco-ring animate-orbit pointer-events-none absolute inset-[4%] rounded-full border-2 border-dashed"
        aria-hidden
      />
      <div
        className="hero-deco-orbit animate-orbit-reverse pointer-events-none absolute inset-[14%] rounded-full border-2"
        aria-hidden
      />
      <div
        className="hero-deco-ring animate-orbit-fast pointer-events-none absolute inset-[24%] rounded-full border-2"
        aria-hidden
      >
        <span className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--deco-line-strong)] shadow-[0_0_18px_rgba(0,194,204,1)]" />
        <span className="absolute bottom-[16%] right-0 h-3 w-3 translate-x-1/2 rounded-full bg-[color:var(--deco-line-strong)] shadow-[0_0_12px_rgba(0,194,204,0.7)]" />
        <span className="absolute bottom-1/3 left-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[color:var(--deco-line-strong)]" />
      </div>

      <div
        className="animate-pulse-soft pointer-events-none absolute inset-[28%] rounded-full bg-teal/30 blur-2xl"
        aria-hidden
      />

      <div className="animate-float absolute inset-[18%] overflow-hidden rounded-[2rem] border-2 border-teal/40 bg-gradient-to-br from-navy via-navy-soft to-teal/40 shadow-[0_24px_70px_rgba(7,26,61,0.35)] outline outline-1 outline-black/10">
        <div className="absolute inset-0 surface-grid opacity-40" />
        <div
          className="animate-pulse-soft absolute -right-8 -top-8 h-40 w-40 rounded-full bg-teal/30 blur-2xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-10 -left-6 h-36 w-36 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <FuturisticCore />
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal sm:text-xs">
            {t("innovation")}
          </p>
          <p className="mt-2 font-display text-xl font-bold text-white sm:text-2xl">
            {t("title")}
          </p>
          <p className="mt-2 max-w-[220px] text-xs leading-relaxed text-white/80 sm:text-sm">
            {t("text")}
          </p>
        </div>
      </div>

      <svg
        className="hero-molecule hero-deco-accent animate-float-slow pointer-events-none absolute -right-1 top-2 h-28 w-28 sm:h-36 sm:w-36"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden
      >
        <circle cx="28" cy="36" r="6.5" fill="currentColor" />
        <circle cx="72" cy="24" r="5.5" fill="currentColor" opacity="0.9" />
        <circle cx="90" cy="62" r="7.5" fill="currentColor" />
        <circle cx="48" cy="84" r="5.5" fill="currentColor" opacity="0.9" />
        <circle cx="60" cy="52" r="4" fill="currentColor" opacity="0.75" />
        <path
          d="M28 36L72 24L90 62L48 84L28 36M60 52L72 24M60 52L90 62M60 52L48 84"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeDasharray="5 5"
          opacity="0.95"
          style={{ animation: "dash-flow 2s linear infinite" }}
        />
      </svg>

      {floatingCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`hero-chip glass-dark absolute z-10 flex max-w-[46%] items-center gap-2 rounded-2xl px-2.5 py-2 shadow-[0_12px_30px_rgba(7,26,61,0.2)] backdrop-blur-md sm:max-w-none sm:gap-2.5 sm:px-3 sm:py-2.5 ${card.className}`}
            style={{ animationDelay: card.delay }}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-teal/30 text-[color:var(--deco-line-strong)]">
              <Icon className="h-4 w-4" />
            </span>
            <span className="hero-chip-label text-xs font-bold text-[color:var(--chip-fg)] sm:text-sm">
              {card.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
