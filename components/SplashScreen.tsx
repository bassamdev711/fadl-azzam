"use client";

import { startTransition, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SplashScreenProps {
  storeName?: string;
  storeNameLatin?: string;
}

export default function SplashScreen({
  storeName = "فضل عزام",
  storeNameLatin = "FADL AZZAM",
}: SplashScreenProps) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const splashKey = `brand_splash_seen:${storeNameLatin || storeName}`;
    const hasSeenSplash = sessionStorage.getItem(splashKey);

    if (!hasSeenSplash) {
      startTransition(() => setShowSplash(true));
      sessionStorage.setItem(splashKey, "true");
      const timer = setTimeout(() => setShowSplash(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [storeName, storeNameLatin]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[#061536]"
          dir="rtl"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(24,70,180,0.22),transparent_42%),linear-gradient(135deg,#061536_0%,#0a225d_52%,#061536_100%)]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-28 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-28 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.6em" }}
              animate={{ opacity: 1, letterSpacing: "0.34em" }}
              transition={{ delay: 0.12, duration: 0.7, ease: "easeOut" }}
              dir="ltr"
              className="text-[10px] font-semibold text-accent sm:text-xs"
            >
              {storeNameLatin}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.22, duration: 0.65, ease: "easeOut" }}
              className="mt-4 text-4xl font-black tracking-tight text-surface sm:text-6xl"
            >
              {storeName}
            </motion.h1>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "5rem", opacity: 1 }}
              transition={{ delay: 0.48, duration: 0.55, ease: "easeOut" }}
              className="mt-4 h-[2px] bg-accent"
            />

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.5 }}
              className="mt-4 text-xs font-medium tracking-[0.16em] text-surface/65 sm:text-sm"
            >
              للتجارة العامة والحلول العملية
            </motion.p>
          </motion.div>

          <button
            type="button"
            onClick={() => setShowSplash(false)}
            className="absolute bottom-8 z-10 rounded-full border border-accent/35 px-4 py-2 text-xs text-surface/65 transition-colors hover:border-accent hover:text-accent"
          >
            تخطي
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
