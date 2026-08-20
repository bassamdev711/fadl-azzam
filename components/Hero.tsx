"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowLeft, CookingPot, Laptop, Sofa, SunMedium } from "lucide-react";

type HeroData = {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroDescription?: string | null;
  heroPrimaryButton?: string | null;
  heroSecondaryButton?: string | null;
};

export default function Hero({
  data = {},
  brandName = "فضل عزام",
  brandNameLatin = "FADL AZZAM",
}: {
  data?: HeroData;
  brandName?: string;
  brandNameLatin?: string;
}) {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const serviceMarkers = [
    { icon: Laptop, label: "إلكترونيات" },
    { icon: SunMedium, label: "منظومات شمسية" },
    { icon: CookingPot, label: "مطابخ ألمنيوم" },
    { icon: Sofa, label: "مجالس عربية" },
  ];

  return (
    <section id="hero" className="relative min-h-[100dvh] overflow-hidden bg-brand text-surface lg:h-[min(100dvh,56.25vw)] lg:min-h-0" dir="rtl">
      {/* Desktop artwork remains unchanged on large screens. */}
      <Image
        src="/brand/hero-store-promo-text-right.webp"
        alt="واجهة متجر فضل عزام للتجارة العامة والأجهزة المنزلية"
        fill
        priority
        sizes="100vw"
        className="hidden object-cover object-right lg:block"
      />

      {/* A dedicated 9:16 composition is used only on phones. */}
      <Image
        src="/brand/hero-mobile-storefront.png"
        alt="معرض فضل عزام للتجارة العامة والتجهيزات المنزلية"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center lg:hidden"
      />

      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(3,12,45,0.06),rgba(4,20,72,0.04)_46%,rgba(5,18,62,0.3))] lg:block" />
      <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_12%_75%,rgba(63,124,255,0.18),transparent_34%)] lg:block" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,31,0.16),rgba(2,9,31,0.02)_38%,rgba(2,9,31,0.06)_70%,rgba(2,9,31,0.28))] lg:hidden" />

      {/* Phone layout: the image reserves the top and bottom negative space; content stays live HTML. */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-between px-5 pb-[calc(var(--mobile-bottom-nav-height)+1rem)] pt-28 sm:px-8 lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto w-full max-w-md text-center text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.42)]"
        >
          <div className="font-sans text-base font-extrabold tracking-[0.2em] text-[#f4d36d]" dir="ltr">
            {brandNameLatin}
          </div>
          <h1 className="mt-1 text-4xl font-black leading-tight">{data.heroTitle || brandName}</h1>
          <p className="mt-1 text-lg font-bold leading-relaxed text-white">
            {data.heroSubtitle || "للتجارة العامة والحلول العملية"}
          </p>
          <p className="mx-auto mt-3 max-w-sm whitespace-pre-line text-sm font-medium leading-7 text-white/95">
            {data.heroDescription || "توريد موثوق ومنتجات عملية للأعمال والمنازل، بخدمة واضحة تبدأ من احتياجك."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="grid grid-cols-2 gap-3"
        >
          <button onClick={scrollToProducts} className="btn btn-primary min-h-12 w-full rounded-2xl px-3 text-sm font-extrabold shadow-lg shadow-black/20">
            {data.heroPrimaryButton || "اكتشف منتجاتنا"}
          </button>
          <button onClick={scrollToAbout} className="btn min-h-12 w-full rounded-2xl border border-white/35 bg-brand/90 px-3 text-sm font-extrabold text-white shadow-lg shadow-black/20 hover:bg-brand">
            {data.heroSecondaryButton || "تعرف علينا"}
          </button>
        </motion.div>
      </div>

      {/* Existing desktop layout remains isolated from the phone composition. */}
      <div className="relative z-10 mx-auto hidden h-full min-h-[100dvh] max-w-7xl flex-col justify-between px-5 pb-8 pt-28 sm:px-8 lg:flex lg:min-h-0 lg:px-12 lg:pb-12 lg:pt-36">
        <div className="flex items-start justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl lg:max-w-[46%]"
          >
            <div className="mb-7 flex items-center gap-3 text-xs font-bold tracking-[0.26em] text-blue-200 sm:text-sm">
              <span className="h-px w-12 bg-blue-300" />
              <span>{brandNameLatin}</span>
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-8xl">
              {data.heroTitle || brandName}
            </h1>
            <p className="mt-5 max-w-2xl text-2xl font-bold leading-tight text-blue-100 sm:text-4xl">
              {data.heroSubtitle || "للتجارة العامة والحلول العملية"}
            </p>
            <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-8 text-blue-50/80 sm:text-lg">
              {data.heroDescription || "توريد موثوق ومنتجات عملية للأعمال والمنازل، بخدمة واضحة تبدأ من احتياجك."}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button onClick={scrollToProducts} className="btn btn-primary group min-w-44">
                {data.heroPrimaryButton || "استكشف مجالاتنا"}
                <ArrowLeft className="transition-transform group-hover:-translate-x-1" size={18} />
              </button>
              <button onClick={scrollToAbout} className="btn btn-outline min-w-36 border-white/50 text-white hover:bg-white hover:text-brand">
                {data.heroSecondaryButton || "تعرّف علينا"}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="hidden border border-white/20 bg-blue-950/35 p-3 backdrop-blur-sm lg:block"
          >
            <div className="flex max-w-40 flex-col gap-2">
              {serviceMarkers.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs text-blue-50 last:border-0 last:pb-0">
                  <Icon size={15} className="text-blue-300" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-end justify-between gap-6 border-t border-white/20 pt-5"
        >
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-blue-100/75 sm:text-sm">
            <span>تجارة عامة</span>
            <span>توريد وتجهيز</span>
            <span>خدمة ومتابعة</span>
          </div>
          <button onClick={scrollToProducts} className="group flex items-center gap-2 text-xs font-bold text-white sm:text-sm">
            اكتشف المزيد
            <ArrowDownLeft size={17} className="transition-transform group-hover:translate-y-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
