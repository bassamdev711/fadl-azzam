"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpLeft, Check } from "lucide-react";

type AboutData = {
  aboutTopTitle?: string | null;
  aboutMainTitle?: string | null;
  aboutQuote?: string | null;
  aboutDescription?: string | null;
};

export default function About({
  data = {},
  brandName = "فضل عزام",
}: {
  data?: AboutData;
  brandName?: string;
}) {
  const commitments = ["خيارات عملية", "وضوح في التعامل", "خدمة متميزة"];

  return (
    <section id="about" className="relative overflow-hidden bg-surface py-24 md:py-32" dir="rtl">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative min-h-[420px] overflow-hidden bg-brand shadow-2xl lg:min-h-[560px]"
        >
          <Image
            src="/brand/general-trade-category.jpg"
            alt="تجهيزات تجارية بخطوط هندسية زرقاء وبيضاء"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061333]/90 via-[#0c35b8]/15 to-transparent" />
          <div className="absolute bottom-7 right-7 left-7 flex items-end justify-between gap-4 text-white">
            <div>
              <span className="text-xs font-bold tracking-[0.22em] text-blue-200">{brandName.toUpperCase()}</span>
              <p className="mt-2 text-lg font-bold">تجارة تتحرك مع احتياجك</p>
            </div>
            <ArrowUpLeft className="text-blue-200" size={30} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col justify-center py-4 lg:py-10"
        >
          <span className="mb-5 block text-xs font-bold tracking-[0.25em] text-brand">{data.aboutTopTitle || "فضل عزام للتجارة العامة"}</span>
          <h2 className="max-w-xl text-4xl font-black leading-tight text-foreground md:text-6xl">
            {data.aboutMainTitle || "حلول عملية بثقة"}
          </h2>
          <div className="my-8 h-1 w-20 bg-brand" />
          <blockquote className="max-w-2xl border-r-4 border-brand pr-5 text-2xl font-bold leading-relaxed text-foreground md:text-3xl">
            {data.aboutQuote || "نربط احتياجك بالحل المناسب، ونبني كل تعامل على الوضوح والالتزام."}
          </blockquote>
          <p className="mt-7 max-w-2xl text-base leading-8 text-foreground/70 md:text-lg">
            {data.aboutDescription || "نعمل على توفير خيارات عملية في الأجهزة المنزلية والطاقة الشمسية والتجهيزات التجارية، مع خدمة متميزة تفهم احتياجك بوضوح."}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {commitments.map((commitment) => (
              <div key={commitment} className="flex items-center gap-2 border-t border-brand/20 pt-3 text-sm font-bold text-brand">
                <Check size={16} />
                <span>{commitment}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
