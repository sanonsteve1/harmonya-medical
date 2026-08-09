import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

export async function Approach() {
  const t = await getTranslations("Approach");
  const steps = ["01", "02", "03", "04", "05"] as const;

  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel className="justify-center">{t("label")}</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              {t("title")}
            </h2>
          </div>
        </Reveal>

        <ol className="mt-10 grid gap-3 md:grid-cols-5">
          {steps.map((step, index) => (
            <Reveal key={step} delay={index * 100} direction="up">
              <li className="relative rounded-3xl border border-line bg-mist/70 p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_12px_30px_rgba(0,194,204,0.12)]">
                <span className="font-display text-3xl font-extrabold text-teal/40">
                  {step}
                </span>
                <h3 className="mt-3 text-base font-bold text-navy">
                  {t(`steps.${step}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  {t(`steps.${step}.text`)}
                </p>
                {index < steps.length - 1 && (
                  <span
                    className="absolute -right-2 top-1/2 hidden h-px w-4 bg-teal/50 md:block"
                    aria-hidden
                  />
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
