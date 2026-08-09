import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Icons";

export async function CTA() {
  const t = await getTranslations("CTA");

  return (
    <section className="pb-12 sm:pb-14 lg:pb-20">
      <Container>
        <Reveal direction="scale">
          <div className="relative overflow-hidden rounded-[1.5rem] mesh-dark px-5 py-10 theme-fg sm:rounded-[2rem] sm:px-12 sm:py-14">
            <div className="absolute inset-0 surface-grid opacity-20" aria-hidden />
            <div
              className="animate-pulse-soft pointer-events-none absolute -right-10 top-0 h-56 w-56 rounded-full bg-teal/30 blur-3xl"
              aria-hidden
            />
            <div
              className="animate-float pointer-events-none absolute bottom-0 left-10 hidden h-32 w-32 rounded-full border border-teal/30 sm:block"
              aria-hidden
            />

            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal">
                {t("label")}
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                {t("title")}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed theme-muted sm:text-base">
                {t("text")}
              </p>
              <Button href="#contact" variant="glow" className="mt-7 w-full sm:w-auto">
                {t("button")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
