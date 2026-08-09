import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRight, PlayIcon } from "@/components/ui/Icons";
import { HeroVisual } from "@/components/sections/HeroVisual";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section
      id="accueil"
      className="relative min-h-[100svh] overflow-hidden mesh-dark theme-fg"
    >
      <Image
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2200&q=80"
        alt=""
        fill
        priority
        className="animate-kenburns object-cover"
        style={{ opacity: "var(--hero-image-opacity)" }}
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--hero-overlay)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--hero-overlay-v)" }}
      />
      <div className="absolute inset-0 surface-grid opacity-25 mix-blend-soft-light" />

      <div
        className="animate-pulse-soft pointer-events-none absolute -right-16 top-10 hidden h-80 w-80 rounded-full bg-teal/25 blur-3xl sm:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 hidden h-64 w-64 rounded-full bg-teal/15 blur-3xl sm:block"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden>
        {[
          "left-[12%] top-[22%]",
          "left-[28%] top-[58%]",
          "left-[48%] top-[18%]",
          "left-[62%] top-[70%]",
          "left-[78%] top-[34%]",
          "left-[88%] top-[62%]",
        ].map((pos, i) => (
          <span
            key={pos}
            className={`animate-particle absolute h-2 w-2 rounded-full bg-[color:var(--deco-line-strong)] shadow-[0_0_12px_rgba(0,122,130,0.7)] ${pos}`}
            style={{ animationDelay: `${i * 0.55}s` }}
          />
        ))}
      </div>

      <Container className="relative z-10 grid min-h-[100svh] items-center gap-8 py-24 sm:gap-10 sm:py-28 lg:grid-cols-2 lg:gap-10 lg:py-28 xl:gap-14">
        <div className="min-w-0 order-1">
          <p className="hero-eyebrow animate-fade-up text-[10px] font-bold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.22em] md:text-sm">
            {t("eyebrow")}
          </p>

          <h1 className="animate-fade-up delay-1 mt-3 font-display text-[clamp(2.35rem,9vw,5.75rem)] font-extrabold leading-[0.92] tracking-tight">
            <span className="theme-fg block">HARMONYA</span>
            <span className="mt-1 block text-gradient animate-shimmer">
              MEDICAL
            </span>
          </h1>

          <p className="animate-fade-up delay-2 mt-4 max-w-xl text-base font-medium leading-relaxed text-[color:var(--inverse-muted)] sm:mt-5 sm:text-lg md:text-xl">
            {t("subtitle")}
          </p>

          <div className="animate-fade-up delay-3 mt-6 flex w-full flex-col gap-3 sm:mt-7 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button
              href="#services"
              variant="glow"
              className="!w-full !px-5 !py-3 !text-sm sm:!w-auto sm:!px-6 sm:!text-base"
            >
              {t("ctaServices")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href="#produits"
              variant="outline"
              className="!w-full !px-5 !py-3 !text-sm sm:!w-auto sm:!px-6 sm:!text-base"
            >
              <PlayIcon className="text-teal" />
              {t("ctaProducts")}
            </Button>
          </div>

          <ul className="animate-fade-up delay-4 mt-7 grid grid-cols-3 gap-2 border-t border-[color:var(--inverse-border)] pt-4 sm:mt-8 sm:gap-4 sm:pt-5">
            <li className="min-w-0">
              <span className="theme-fg block font-display text-xl font-bold sm:text-2xl md:text-3xl">
                +150
              </span>
              <span className="theme-muted block text-[11px] leading-snug sm:text-sm">
                {t("statPros")}
              </span>
            </li>
            <li className="min-w-0">
              <span className="theme-fg block font-display text-xl font-bold sm:text-2xl md:text-3xl">
                +35
              </span>
              <span className="theme-muted block text-[11px] leading-snug sm:text-sm">
                {t("statLabs")}
              </span>
            </li>
            <li className="min-w-0">
              <span className="theme-fg block font-display text-xl font-bold sm:text-2xl md:text-3xl">
                +8
              </span>
              <span className="theme-muted block text-[11px] leading-snug sm:text-sm">
                {t("statCountries")}
              </span>
            </li>
          </ul>
        </div>

        <div className="animate-fade-up delay-5 relative order-2 mx-auto w-full max-w-[420px] min-w-0 lg:mx-0 lg:max-w-none">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
