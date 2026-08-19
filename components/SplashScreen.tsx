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
      const timer = setTimeout(() => setShowSplash(false), 1600);
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
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-brand"
          dir="ltr"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1, 1.15], opacity: [0, 0.7, 0] }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute h-72 w-72 rounded-full border border-blue-300/60 shadow-[0_0_80px_rgba(63,124,255,0.45)]"
          />
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="relative z-10 flex flex-col items-center justify-center text-center"
          >
            <div className="border border-white/25 bg-blue-950/30 px-8 py-7 shadow-2xl backdrop-blur-sm sm:px-12">
              <span className="block text-2xl font-black tracking-[0.18em] text-white sm:text-4xl">{storeNameLatin}</span>
              <div className="mx-auto my-3 h-1 w-12 bg-blue-300" />
              <span className="block text-lg font-bold text-blue-100 sm:text-2xl">{storeName}</span>
            </div>
            <span className="mt-6 text-xs font-bold tracking-[0.28em] text-blue-200">GENERAL TRADING</span>
          </motion.div>
          <button
            type="button"
            onClick={() => setShowSplash(false)}
            className="absolute bottom-8 z-10 rounded-full border border-white/30 px-4 py-2 text-xs text-white/80 transition-colors hover:border-blue-200 hover:text-white"
          >
            تخطي
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
