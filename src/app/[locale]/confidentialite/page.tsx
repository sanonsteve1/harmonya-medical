import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Privacy");

  const sections = ["data", "analytics", "emails", "rights", "contact"] as const;

  return (
    <section className="mesh-light pb-16 pt-28 lg:pb-24 lg:pt-32">
      <Container className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-dark">
          {t("label")}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate">{t("intro")}</p>

        <div className="mt-10 space-y-8">
          {sections.map((key) => (
            <div key={key}>
              <h2 className="text-xl font-bold text-navy">{t(`${key}.title`)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {t(`${key}.text`)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
