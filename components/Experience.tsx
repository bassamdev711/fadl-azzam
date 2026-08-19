"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

 type ExperienceData = {
  expTopTitle?: string | null;
  expMainTitle?: string | null;
  expBox1Title?: string | null;
  expBox1Desc?: string | null;
  expBox2Title?: string | null;
  expBox2Desc?: string | null;
};

export default function Experience({
  data = {},
  brandName = "فضل عزام",
}: {
  data?: ExperienceData;
  brandName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <section id="experience" className="relative overflow-hidden bg-white py-24 md:py-32" ref={containerRef} dir="rtl">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 max-w-2xl"
        >
          <span className="mb-4 block text-xs font-bold tracking-[0.25em] text-brand">{data.expTopTitle || "كيف نعمل"}</span>
          <h2 className="text-4xl font-black leading-tight text-foreground md:text-6xl">{data.expMainTitle || "من الاحتياج إلى الحل"}</h2>
          <div className="mt-6 h-1 w-20 bg-brand" />
        </motion.div>

        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <motion.div style={{ y: y1 }} className="space-y-5">
            <div className="border-r-4 border-brand bg-surface p-7 shadow-sm md:p-10">
              <span className="mb-5 block text-sm font-black text-brand">01</span>
              <h3 className="mb-4 text-2xl font-black text-foreground">{data.expBox1Title || "نستمع أولًا"}</h3>
              <p className="text-lg leading-8 text-foreground/70">
                {data.expBox1Desc || "نفهم احتياجك ونساعدك على مقارنة الخيارات المناسبة قبل اتخاذ القرار."}
              </p>
            </div>
            <div className="mr-8 border-l-4 border-accent bg-[#eef4ff] p-7 shadow-sm md:p-10">
              <span className="mb-5 block text-sm font-black text-brand">02</span>
              <h3 className="mb-4 text-2xl font-black text-foreground">{data.expBox2Title || "نلتزم بالتنفيذ"}</h3>
              <p className="text-lg leading-8 text-foreground/70">
                {data.expBox2Desc || "نحافظ على وضوح التواصل والمتابعة من الاستفسار حتى التسليم وخدمة ما بعد البيع."}
              </p>
            </div>
          </motion.div>

          <motion.div style={{ y: y2 }} className="relative min-h-[420px] lg:min-h-[560px]">
            <div className="absolute inset-0 translate-x-4 translate-y-4 border-2 border-brand/20" />
            <div className="relative h-full min-h-[420px] overflow-hidden bg-brand shadow-2xl lg:min-h-[560px]">
              <Image
                src="/brand/experience-showroom.jpg"
                alt={`أجهزة منزلية وحلول الطاقة الشمسية من ${brandName}`}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061333]/85 via-transparent to-brand/10" />
              <div className="absolute bottom-7 right-7 left-7 text-white">
                <p className="text-xs font-bold tracking-[0.25em] text-blue-200">حلول عملية</p>
                <p className="mt-2 text-2xl font-black">نبني الثقة من أول استفسار</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
