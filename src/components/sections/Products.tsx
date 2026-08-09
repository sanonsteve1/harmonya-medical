import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Icons";

export async function Products() {
  const t = await getTranslations("Products");

  const products = [
    {
      key: "anti",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=80",
    },
    {
      key: "neuro",
      image:
        "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=900&q=80",
    },
    {
      key: "cardio",
      image:
        "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=900&q=80",
    },
    {
      key: "general",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    },
  ] as const;

  return (
    <section id="produits" className="mesh-light py-14 lg:py-20">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <SectionLabel>{t("label")}</SectionLabel>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                {t("title")}
              </h2>
            </div>
            <Button href="#contact" variant="primary">
              {t("cta")}
              <ArrowRight className="h-4 w-4 text-teal" />
            </Button>
          </div>
        </Reveal>

        <ul className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <Reveal key={product.key} delay={index * 110} direction="scale">
              <li className="group relative aspect-[3/4] overflow-hidden rounded-2xl outline outline-1 outline-black/10 sm:rounded-[1.75rem]">
                <Image
                  src={product.image}
                  alt={t(`items.${product.key}.title`)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:translate-y-1 sm:p-5 sm:transition-transform sm:duration-300 sm:group-hover:translate-y-0">
                  <p className="font-display text-sm font-bold text-white sm:text-lg">
                    {t(`items.${product.key}.title`)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/70 sm:mt-1 sm:text-sm">
                    {t(`items.${product.key}.description`)}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
