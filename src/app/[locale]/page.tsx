import { setRequestLocale } from "next-intl/server";
import { About } from "@/components/sections/About";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { CTA } from "@/components/sections/CTA";
import { Domains } from "@/components/sections/Domains";
import { Hero } from "@/components/sections/Hero";
import { News } from "@/components/sections/News";
import { Products } from "@/components/sections/Products";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyUs } from "@/components/sections/WhyUs";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Domains />
      <Products />
      <Approach />
      <WhyUs />
      <News />
      <Testimonials />
      <CTA />
      <Contact />
    </>
  );
}
