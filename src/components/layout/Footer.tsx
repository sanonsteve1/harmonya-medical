import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/ui/Icons";

export async function Footer() {
  const t = await getTranslations("Footer");
  const tn = await getTranslations("Newsletter");

  const columns = [
    {
      title: t("navigation"),
      links: [
        { href: "/#accueil", label: t("navHome") },
        { href: "/#a-propos", label: t("navAbout") },
        { href: "/#services", label: t("navServices") },
        { href: "/#produits", label: t("navProducts") },
        { href: "/#contact", label: t("navContact") },
      ],
    },
    {
      title: t("services"),
      links: [
        { href: "/#services", label: t("svcPromotion") },
        { href: "/#services", label: t("svcTraining") },
        { href: "/#services", label: t("svcPartnerships") },
        { href: "/#services", label: t("svcDistribution") },
      ],
    },
    {
      title: t("resources"),
      links: [
        { href: "/#actualites", label: t("resNews") },
        { href: "/confidentialite", label: t("privacy") },
      ],
    },
  ];

  return (
    <footer className="border-t border-[color:var(--inverse-border)] bg-[color:var(--inverse-bg)] theme-fg">
      <Container className="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-12">
        <Reveal className="lg:col-span-4" direction="up">
          <Logo variant="light" size="lg" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed theme-muted">
            {t("blurb")}
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            {[
              { icon: LinkedInIcon, label: "LinkedIn" },
              { icon: FacebookIcon, label: "Facebook" },
              { icon: InstagramIcon, label: "Instagram" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--inverse-border)] theme-muted transition-[color,border-color,background-color] hover:border-teal hover:bg-teal hover:text-navy-deep"
              >
                <Icon />
              </a>
            ))}
          </div>

          <div className="mt-6 max-w-md">
            <h3 className="text-sm font-semibold tracking-wide theme-fg">
              {tn("title")}
            </h3>
            <p className="mt-1 text-sm theme-muted">{tn("text")}</p>
            <NewsletterForm />
          </div>
        </Reveal>

        {columns.map((column, index) => (
          <Reveal
            key={column.title}
            className="lg:col-span-2"
            delay={80 + index * 80}
            direction="up"
          >
            <h3 className="text-sm font-semibold tracking-wide theme-fg">
              {column.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/#") || link.href.startsWith("#") ? (
                    <a
                      href={link.href.replace(/^\//, "")}
                      className="text-sm theme-muted transition-colors hover:text-teal"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm theme-muted transition-colors hover:text-teal"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal className="lg:col-span-2" delay={320} direction="up">
          <h3 className="text-sm font-semibold tracking-wide theme-fg">
            {t("contact")}
          </h3>
          <ul className="mt-3 space-y-2.5 text-sm theme-muted">
            <li>
              Ouagadougou,
              <br />
              Burkina Faso
            </li>
            <li>
              <a href="tel:+22678337525" className="hover:text-teal">
                +226 78 33 75 25
              </a>
            </li>
            <li>
              <a
                href="mailto:harmonya.medical@gmail.com"
                className="hover:text-teal"
              >
                harmonya.medical@gmail.com
              </a>
            </li>
          </ul>
        </Reveal>
      </Container>

      <div className="border-t border-[color:var(--inverse-border)]">
        <Container className="flex flex-col gap-3 py-4 text-xs theme-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} HARMONYA MEDICAL. {t("rights")}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/confidentialite" className="hover:text-teal">
              {t("legal")}
            </Link>
            <Link href="/confidentialite" className="hover:text-teal">
              {t("privacy")}
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
