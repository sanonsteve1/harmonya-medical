import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";

export async function Contact() {
  const t = await getTranslations("Contact");

  const infos = [
    { label: t("infoAddress"), value: "Ouagadougou, Burkina Faso" },
    { label: t("infoPhone"), value: "+226 78 33 75 25", href: "tel:+22678337525" },
    {
      label: t("infoEmail"),
      value: "harmonya.medical@gmail.com",
      href: "mailto:harmonya.medical@gmail.com",
    },
  ];

  return (
    <section id="contact" className="mesh-light py-14 lg:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5" direction="left">
            <SectionLabel>{t("label")}</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate">
              {t("text")}
            </p>

            <ul className="mt-8 space-y-4">
              {infos.map((info) => (
                <li
                  key={info.label}
                  className="rounded-2xl border border-line bg-white p-4 shadow-[0_8px_24px_rgba(7,26,61,0.04)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-dark">
                    {info.label}
                  </p>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="mt-1 block text-sm font-semibold text-navy transition-colors hover:text-teal"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-semibold text-navy">{info.value}</p>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-7" direction="right" delay={100}>
            <div className="rounded-[1.5rem] border border-line bg-white p-4 shadow-[0_16px_40px_rgba(7,26,61,0.08)] sm:rounded-[1.75rem] sm:p-6 md:p-8">
              <h3 className="font-display text-xl font-bold text-navy">
                {t("formTitle")}
              </h3>
              <p className="mt-1.5 text-sm text-slate">{t("formText")}</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
