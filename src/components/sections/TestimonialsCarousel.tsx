import Image from "next/image";
import { QuoteIcon } from "@/components/ui/Icons";

export type TestimonialCard = {
  key: string;
  name: string;
  role: string;
  quote: string;
  image: string;
};

type TestimonialsCarouselProps = {
  items: TestimonialCard[];
};

export function TestimonialsCarousel({ items }: TestimonialsCarouselProps) {
  // Two identical sequences for a seamless CSS loop
  const sequence = [...items, ...items];

  return (
    <div className="relative mt-10 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--background)] to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--background)] to-transparent sm:w-20" />

      <div className="testimonials-marquee" aria-label="Témoignages">
        <ul className="testimonials-marquee-track">
          {sequence.map((item, index) => (
            <li
              key={`${item.key}-${index}`}
              className="w-[min(85vw,22rem)] shrink-0 rounded-[1.75rem] border border-line bg-white p-6 sm:w-[22rem]"
            >
              <QuoteIcon className="h-6 w-6 text-teal" />
              <p className="mt-4 text-sm italic leading-relaxed text-slate">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                <div className="relative h-11 w-11 overflow-hidden rounded-full outline outline-1 outline-black/10">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy">{item.name}</p>
                  <p className="text-xs text-teal-dark">{item.role}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
