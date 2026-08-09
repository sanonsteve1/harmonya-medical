import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import {
  TestimonialsCarousel,
  type TestimonialCard,
} from "@/components/sections/TestimonialsCarousel";

export async function Testimonials() {
  const t = await getTranslations("Testimonials");

  const sources = [
    {
      key: "1",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    },
    {
      key: "2",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80",
    },
    {
      key: "3",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    },
  ] as const;

  const items: TestimonialCard[] = sources.map((item) => ({
    key: item.key,
    image: item.image,
    name: t(`items.${item.key}.name`),
    role: t(`items.${item.key}.role`),
    quote: t(`items.${item.key}.quote`),
  }));

  return (
    <section className="mesh-light overflow-hidden py-14 lg:py-20">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel className="justify-center">{t("label")}</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              {t("title")}
            </h2>
          </div>
        </Reveal>
      </Container>

      <div className="container-site">
        <TestimonialsCarousel items={items} />
      </div>
    </section>
  );
}
