import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CheckIcon } from "@/components/ui/Icons";

const partners = ["Sanofi", "Pfizer", "Viatris", "GSK", "Bayer", "Abbott"];

export async function WhyUs() {
  const t = await getTranslations("WhyUs");
  const reasons = ["1", "2", "3", "4", "5"] as const;

  return (
    <section id="ressources" className="mesh-light py-14 lg:py-20">
      <Container className="grid gap-8 lg:grid-cols-2">
        <Reveal direction="left">
          <div className="rounded-[2rem] bg-navy-deep p-7 text-white sm:p-9">
            <SectionLabel tone="dark">{t("label")}</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              {t("title")}
            </h2>
            <ul className="mt-7 space-y-3">
              {reasons.map((key, index) => (
                <li
                  key={key}
                  className="flex items-start gap-3 transition-transform duration-300 hover:translate-x-1"
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal text-navy-deep">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm leading-relaxed text-white/80">
                    {t(`reasons.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal direction="right" delay={120}>
          <div className="rounded-[2rem] border border-line bg-white p-7 sm:p-9">
            <h3 className="font-display text-2xl font-bold text-navy">
              {t("partnersTitle")}
            </h3>
            <p className="mt-2 text-sm text-slate">{t("partnersText")}</p>
            <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {partners.map((partner) => (
                <li
                  key={partner}
                  className="flex h-16 items-center justify-center rounded-2xl border border-line bg-mist text-sm font-semibold tracking-wide text-navy/70 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-teal/40 hover:bg-teal-soft"
                >
                  {partner}
                </li>
              ))}
            </ul>
            <Button
              href="#contact"
              variant="outline"
              className="mt-6 !border-navy/15 !text-navy hover:!border-teal hover:!text-teal"
            >
              {t("partnersCta")}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
