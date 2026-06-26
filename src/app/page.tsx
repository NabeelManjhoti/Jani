import Link from "next/link";
import Image from "next/image";
import { MessageCircle, MapPin, Utensils, Car, Palette } from "lucide-react";
import { HeroCta } from "@/components/hero-cta";

const features = [
  {
    icon: MessageCircle,
    title: "Local Voice",
    description:
      "Speaks your language — Roman Urdu with authentic Karachi slang. 'Yar Jani', 'Kya Scene Hai?' — feels like a real friend.",
    image: "/images/clifton-beach.jpg",
  },
  {
    icon: Utensils,
    title: "Food King",
    description:
      "Knows every secret bun kabab spot on Burns Road, the best nihari joints, and hidden chai dhabbay across the city.",
    image: "/images/food-stall.png",
  },
  {
    icon: Car,
    title: "Traffic Expert",
    description:
      "Shortcuts, peak hour jams, best rickshaw routes — Jani navigates Karachi's chaos like a pro.",
    image: "/images/traffic.jpg",
  },
  {
    icon: Palette,
    title: "Culture Guru",
    description:
      "Markets, festivals, weekend spots, and safety tips — get the real Karachi experience.",
    image: "/images/chai-dhabba.png",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/hero-bg.jpg"
          alt="Karachi skyline"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Me hoon <span className="text-primary">Jani</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300 sm:text-xl">
            Karachi ka asli dost. Street-smart AI guide jo aapki zaban bolta
            hai. Pocho jo poochna hai — food, traffic, culture, sab set hai!
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <HeroCta />
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-gray-600 px-8 py-3 text-base font-semibold text-gray-200 transition-colors hover:bg-white/10"
            >
              Jano aur kya hai
            </Link>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <MapPin className="h-4 w-4" />
            Made in Karachi, for Karachi
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-foreground">
            Jani kya karta hai?
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Ek dost ki tarah — har sawal ka jawab, har masle ka hal
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="rounded-full bg-primary/90 p-2 backdrop-blur-sm">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-background py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Toh kya scene hai?
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Pocho jo poochna hai — biryani ki best jagah ho, traffic ka
            shortcut ho, ya shaam ghumne ka plan. Jani har cheez set kar dega.
          </p>
          <Link
            href="/auth"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <MessageCircle className="h-5 w-5" />
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-6">
        <p className="text-center text-sm text-muted-foreground">
          Built by{" "}
          <a
            href="https://nabeelmanjhoti.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
          >
            Nabeel Manjhoti
          </a>{" "}
          &middot; Karachi ka apna AI dost
        </p>
      </footer>
    </div>
  );
}
