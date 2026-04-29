"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Palette, PenTool, Sparkles, UserCircle2 } from "lucide-react";

const skills = [
  {
    title: "Resin Jewellery",
    description:
      "Delicate, wearable art capturing real dried flowers, gold leaf, and vibrant pigments in crystal-clear resin.",
    icon: Sparkles,
    color: "bg-blush/40 text-[#a85066]"
  },
  {
    title: "Resin Art Frames",
    description:
      "Preserving memories like wedding garlands and baby milestones in timeless, glossy resin displays.",
    icon: Palette,
    color: "bg-lavender/40 text-[#7a6b9a]"
  },
  {
    title: "Portraits & Drawings",
    description:
      "Hand-drawn portraits with incredible detail, bringing photographs to life with graphite and charcoal.",
    icon: UserCircle2,
    color: "bg-mint/40 text-[#5a8c80]"
  },
  {
    title: "Custom Creations",
    description:
      "Personalized gifts ranging from ring platters to rakhi and diwali specials, crafted specifically for your occasions.",
    icon: PenTool,
    color: "bg-peach/40 text-[#c27c65]"
  }
];

const processSteps = [
  {
    title: "Ideation",
    description: "Understanding your vision and the emotion behind the piece."
  },
  {
    title: "Design",
    description:
      "Sketching the concept and selecting colors, materials, or reference photos."
  },
  {
    title: "Crafting",
    description: "The careful, patient work of pouring resin or drawing line by line."
  },
  {
    title: "Finishing",
    description:
      "Sanding, polishing, framing, or adding those final protective layers."
  },
  {
    title: "Delivered with Love",
    description: "Beautifully packaged and shipped directly to your door."
  }
];

function SectionReveal({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function AboutPage() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="art-hero-gradient relative isolate flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-4 pt-24 text-center">
        <div className="absolute left-[15%] top-[20%] h-64 w-64 rounded-full bg-blush/50 blur-[60px]" />
        <div className="absolute right-[15%] top-[40%] h-72 w-72 rounded-full bg-lavender/45 blur-[70px]" />

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto max-w-4xl"
        >
          <h1 className="font-display text-5xl font-semibold leading-tight text-soft-black sm:text-7xl">
            About Dhruvangi
          </h1>
          <p className="mt-6 text-xl font-medium tracking-wide text-charcoal/75">
            Resin Artist · Drawing Artist · Creator
          </p>
        </motion.div>
      </section>

      {/* Artist Story Section */}
      <SectionReveal className="bg-cream px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="absolute -left-6 -top-6 h-full w-full rounded-[40px] bg-gold/30" />
            <div className="relative aspect-[5/6] overflow-hidden rounded-[40px] bg-white p-4 shadow-soft">
              <Image
                src="https://picsum.photos/seed/artist/500/600"
                alt="Dhruvangi in her studio"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="rounded-[32px] object-cover p-3"
              />
            </div>
          </div>
          <div>
            <h2 className="font-display text-4xl font-semibold text-soft-black sm:text-5xl">
              The Artist Behind the Art
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-charcoal/80">
              <p>
                Hi, I&apos;m Dhruvangi. My journey as an artist began with a simple
                love for capturing the world&apos;s beauty, whether through the stroke
                of a pencil or the glossy finish of resin. What started as a
                passionate hobby quickly blossomed into a dedicated practice, allowing
                me to share my creations with people looking for something truly
                special and handmade.
              </p>
              <p>
                As a resin artist, I am fascinated by the medium&apos;s ability to
                freeze time. By suspending real flowers, delicate gold flakes, and
                vibrant pigments in clear resin, I create pieces that are not only
                beautiful but also deeply personal. From preserving wedding garlands
                to crafting unique jewellery, every resin piece is a unique
                encapsulation of a memory.
              </p>
              <p>
                My work as a drawing artist complements this perfectly. Using
                graphite and charcoal, I strive to bring photographs to life,
                focusing on the subtle expressions and tiny details that make a
                portrait feel alive. Whether I am pouring resin or shading a
                portrait, my goal is always the same: to create heartfelt,
                meticulously crafted art that brings joy and beauty into your life.
              </p>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* Skills / What I Create Section */}
      <SectionReveal className="bg-gradient-to-br from-lavender/30 via-cream to-peach/20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-display text-4xl font-semibold text-soft-black sm:text-5xl">
            What I Create
          </h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <div
                  key={skill.title}
                  className="rounded-[32px] bg-white/60 p-8 text-left shadow-soft backdrop-blur-sm transition hover:-translate-y-1"
                >
                  <div
                    className={`mb-6 grid h-14 w-14 place-items-center rounded-2xl ${skill.color}`}
                  >
                    <Icon size={28} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-soft-black">
                    {skill.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-charcoal/70">
                    {skill.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      {/* Process Section */}
      <SectionReveal className="bg-cream px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="font-display text-4xl font-semibold text-soft-black sm:text-5xl">
              My Creative Process
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal/70">
              Every handmade piece takes time, patience, and a lot of love. Here is
              how your art comes to life.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[10%] right-[10%] top-8 hidden h-[2px] border-t-2 border-dashed border-gold/40 lg:block" />
            <div className="grid gap-10 lg:grid-cols-5 lg:gap-6">
              {processSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 grid h-16 w-16 place-items-center rounded-full bg-gold text-xl font-bold text-white shadow-soft">
                    {index + 1}
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-soft-black">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-charcoal/70">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* CTA Section */}
      <SectionReveal className="bg-blush/40 px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl font-semibold text-soft-black sm:text-5xl">
            Want something made just for you?
          </h2>
          <p className="mt-6 text-lg text-charcoal/80">
            Whether you are looking for a unique piece of jewellery, a lifelike
            portrait, or a custom resin keepsake, I am here to bring your vision to
            life.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center rounded-full bg-soft-black px-8 text-sm font-bold text-white shadow-art transition hover:-translate-y-0.5 hover:bg-soft-black/90"
            >
              Shop Collections
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-soft-black/10 bg-white/50 px-8 text-sm font-bold text-soft-black backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/80"
            >
              Request Custom Order
            </Link>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
