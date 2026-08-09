import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ChartIcon, ShieldIcon, UsersIcon } from "@/components/ui/Icons";

export async function About() {
  const t = await getTranslations("About");

  const pillars = [
    {
      icon: ShieldIcon,
      title: t("pillars.quality.title"),
      text: t("pillars.quality.text"),
    },
    {
      icon: UsersIcon,
      title: t("pillars.support.title"),
      text: t("pillars.support.text"),
    },
    {
      icon: ChartIcon,
      title: t("pillars.impact.title"),
      text: t("pillars.impact.text"),
    },
  ];

  return (
    <section id="a-propos" className="mesh-light py-12 sm:py-14 lg:py-20">
      <Container className="grid items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="relative mx-auto w-full max-w-md lg:col-span-5 lg:mx-0 lg:max-w-none" direction="left">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] outline outline-1 outline-black/10 sm:rounded-[2rem]">
            <Image
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80"
              alt={t("alt")}
              fill
              className="object-cover transition-transform duration-[1.2s] ease-out hover:scale-105"
              sizes="(max-width: 1024px) 90vw, 420px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="font-display text-lg font-bold text-white">
                {t("missionTitle")}
              </p>
              <p className="mt-1 text-sm text-white/80">{t("missionText")}</p>
            </div>
          </div>
          <div
            className="animate-float absolute -right-3 top-8 hidden h-24 w-24 rounded-full border border-teal/40 bg-teal/10 backdrop-blur sm:block"
            aria-hidden
          />
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal direction="right">
            <SectionLabel>{t("label")}</SectionLabel>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-navy sm:text-3xl md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
              {t("text")}
            </p>
          </Reveal>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {pillars.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={120 + index * 100} direction="up">
                <li className="rounded-2xl border border-line bg-white/80 p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(7,26,61,0.08)]">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-teal">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-navy">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate">{text}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
