import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Icons";

export async function News() {
  const t = await getTranslations("News");

  const articles = [
    {
      key: "1",
      image:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
    },
    {
      key: "2",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
    },
    {
      key: "3",
      image:
        "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=80",
    },
  ] as const;

  return (
    <section id="actualites" className="bg-white py-14 lg:py-20">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel className="justify-center">{t("label")}</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              {t("title")}
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {articles.map((article, index) => (
            <Reveal key={article.key} delay={index * 100} direction="up">
              <article className="group overflow-hidden rounded-[1.5rem] border border-line bg-mist/40 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(7,26,61,0.1)]">
                <div className="relative aspect-[16/10] overflow-hidden outline outline-1 outline-black/10">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 90vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-semibold text-teal-dark">
                      {t(`articles.${article.key}.category`)}
                    </span>
                    <span className="text-slate/70">
                      {t(`articles.${article.key}.date`)}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold leading-snug text-navy">
                    {t(`articles.${article.key}.title`)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">
                    {t(`articles.${article.key}.excerpt`)}
                  </p>
                  <a
                    href="#"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors hover:text-teal"
                  >
                    {t("readMore")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal delay={320} direction="scale">
            <aside className="flex h-full flex-col justify-between rounded-[1.5rem] bg-navy-deep p-5 text-white">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
                  {t("newsletterLabel")}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold">
                  {t("newsletterTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {t("newsletterText")}
                </p>
              </div>
              <form className="mt-6 space-y-3" action="#">
                <label htmlFor="newsletter-email" className="sr-only">
                  {t("emailPlaceholder")}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder={t("emailPlaceholder")}
                  className="w-full rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-teal"
                />
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal px-4 py-3 text-sm font-semibold text-navy-deep transition-[transform,background-color] hover:bg-white active:scale-[0.96]"
                >
                  {t("subscribe")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </aside>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
