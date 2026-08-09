import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import {
  ChartIcon,
  FlaskIcon,
  GlobeIcon,
  UsersIcon,
} from "@/components/ui/Icons";

export async function Stats() {
  const t = await getTranslations("Stats");

  const stats = [
    { icon: UsersIcon, value: "+150", label: t("pros") },
    { icon: FlaskIcon, value: "+35", label: t("labs") },
    { icon: ChartIcon, value: "+120", label: t("products") },
    { icon: GlobeIcon, value: "+8", label: t("countries") },
  ];

  return (
    <section className="relative z-20 -mt-8 pb-6 sm:-mt-10 sm:pb-8 lg:-mt-12" aria-label="Stats">
      <Container>
        <Reveal direction="up">
          <div className="relative overflow-hidden rounded-2xl border border-teal/35 bg-gradient-to-r from-[color:var(--inverse-bg)] via-[color:var(--inverse-bg-mid)] to-[color:var(--inverse-bg-end)] px-3 py-4 shadow-[0_20px_50px_rgba(7,26,61,0.18)] sm:rounded-3xl sm:px-8 sm:py-7">
            <div className="absolute inset-0 surface-grid opacity-20" aria-hidden />
            <div
              className="animate-pulse-soft pointer-events-none absolute -right-10 top-0 h-32 w-32 rounded-full bg-teal/25 blur-2xl"
              aria-hidden
            />

            <ul className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4 lg:gap-4">
              {stats.map(({ icon: Icon, value, label }, index) => (
                <Reveal key={label} delay={index * 90} direction="up">
                  <li className="flex items-center gap-2.5 rounded-2xl border border-[color:var(--inverse-border)] bg-[color:var(--inverse-soft)] px-2.5 py-2.5 backdrop-blur-sm transition-[transform,background-color,border-color] duration-300 hover:-translate-y-1 hover:border-teal/40 hover:bg-teal/10 sm:gap-3.5 sm:px-3 sm:py-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal text-navy-deep shadow-[0_0_20px_rgba(0,194,204,0.35)] sm:h-12 sm:w-12 sm:rounded-2xl">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-xl font-bold tabular-nums theme-fg sm:text-2xl md:text-3xl">
                        {value}
                      </p>
                      <p className="truncate text-[11px] theme-muted sm:text-xs md:text-sm">
                        {label}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
