"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  CloseIcon,
  MenuIcon,
} from "@/components/ui/Icons";
import { Container } from "@/components/ui/Container";

export function Header() {
  const t = useTranslations("Nav");
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { href: "#accueil", label: t("home") },
    { href: "#a-propos", label: t("about") },
    { href: "#services", label: t("services") },
    { href: "#produits", label: t("products") },
    { href: "#actualites", label: t("news") },
    { href: "#contact", label: t("contact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const logoVariant =
    theme === "light" || scrolled || open ? "default" : "onDark";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,padding] duration-300 ${
        scrolled
          ? "border-b border-[color:var(--header-border)] bg-[color:var(--header-scrolled-bg)] py-0 shadow-[0_10px_40px_rgba(7,26,61,0.12)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-0.5 sm:py-1"
      }`}
    >
      <Container className="flex h-[72px] items-center justify-between gap-2 sm:h-[88px] sm:gap-3 lg:h-[104px]">
        <Logo size="md" variant={logoVariant} />

        <nav
          className="hidden items-center gap-0.5 rounded-full border border-[color:var(--header-border)] bg-[color:var(--header-chip-bg)] px-1.5 py-1.5 backdrop-blur-md lg:flex xl:gap-1 xl:px-2.5 xl:py-2"
          aria-label={t("mainNav")}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-2 py-1.5 text-[12px] font-semibold text-[color:var(--header-muted)] transition-colors hover:bg-teal/10 hover:text-teal xl:px-3.5 xl:py-2 xl:text-[15px]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button
            href="#contact"
            variant="glow"
            className="!px-4 !py-2.5 !text-[13px] xl:!px-5 xl:!text-[14px]"
          >
            {t("contactUs")}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <LanguageSwitcher />
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
          <ThemeToggle className="!px-2 !py-2" />
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--header-border)] text-[color:var(--header-fg)]"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        className={`max-h-[calc(100svh-72px)] overflow-y-auto border-t border-[color:var(--header-border)] bg-[color:var(--header-menu-bg)] backdrop-blur-xl lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <Container className="flex flex-col gap-1 py-3 safe-bottom sm:py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base font-semibold text-[color:var(--header-fg)] hover:bg-teal/10 hover:text-teal"
            >
              {link.label}
            </a>
          ))}
          <Button
            href="#contact"
            variant="glow"
            className="mt-2 w-full"
            onClick={() => setOpen(false)}
          >
            {t("contactUs")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Container>
      </div>
    </header>
  );
}
