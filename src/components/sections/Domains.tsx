import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Icons";

const FEATURED_IMAGE =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80";

export async function Domains() {
  const t = await getTranslations("Domains");

  const domains = [
    {
      key: "promotion",
      span: "lg:col-span-2 lg:row-span-2",
      featured: true,
    },
    {
      key: "training",
      span: "",
      featured: false,
    },
    {
      key: "partnerships",
      span: "",
      featured: false,
    },
    {
      key: "distribution",
      span: "lg:col-span-2",
      featured: false,
    },
  ] as const;

  return (
    <section id="services" className="mesh-dark py-12 theme-fg sm:py-14 lg:py-20">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="max-w-xl">
              <SectionLabel tone="dark">{t("label")}</SectionLabel>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                {t("title")}
              </h2>
            </div>
            <p className="max-w-sm text-sm theme-muted">{t("subtitle")}</p>
          </div>
        </Reveal>

        <ul className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {domains.map((domain, index) => (
            <li key={domain.key} className={domain.span}>
              <Reveal
                delay={index * 100}
                direction={index % 2 ? "right" : "left"}
                className="h-full"
              >
                <a
                  href="#contact"
                  className={`group relative flex h-full overflow-hidden rounded-3xl border transition-[transform,background-color,border-color] duration-300 hover:-translate-y-1 ${
                    domain.featured
                      ? "min-h-[300px] flex-col justify-between border-teal/30 bg-gradient-to-br from-teal/15 via-[color:var(--inverse-soft)] to-transparent p-6 lg:flex-row lg:items-stretch lg:gap-6 lg:p-0"
                      : "flex-col justify-between border-[color:var(--inverse-border)] bg-[color:var(--inverse-soft)] p-6 hover:border-teal/40 hover:bg-teal/10"
                  }`}
                >
                  {domain.featured ? (
                    <>
                      <div className="relative z-10 flex flex-1 flex-col justify-between lg:max-w-[48%] lg:p-7">
                        <div>
                          <span className="inline-flex h-2 w-2 rounded-full bg-teal shadow-[0_0_12px_rgba(0,194,204,0.8)]" />
                          <h3 className="mt-4 text-2xl font-bold">
                            {t(`items.${domain.key}.title`)}
                          </h3>
                          <p className="mt-2 max-w-sm text-sm leading-relaxed theme-muted">
                            {t(`items.${domain.key}.description`)}
                          </p>
                        </div>
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal">
                          {t("learnMore")}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>

                      <div className="relative mt-5 h-44 overflow-hidden rounded-2xl outline outline-1 outline-[color:var(--inverse-border)] sm:h-52 lg:mt-0 lg:h-auto lg:min-h-full lg:flex-1 lg:rounded-none lg:rounded-r-[1.4rem]">
                        <Image
                          src={FEATURED_IMAGE}
                          alt={t(`items.${domain.key}.title`)}
                          fill
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.04]"
                          sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--inverse-bg)]/70 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-[color:var(--inverse-bg)]/15 lg:to-[color:var(--inverse-bg)]/55" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="inline-flex h-2 w-2 rounded-full bg-teal shadow-[0_0_12px_rgba(0,194,204,0.8)]" />
                        <h3 className="mt-4 text-lg font-bold">
                          {t(`items.${domain.key}.title`)}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed theme-muted">
                          {t(`items.${domain.key}.description`)}
                        </p>
                      </div>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal">
                        {t("learnMore")}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </>
                  )}
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
