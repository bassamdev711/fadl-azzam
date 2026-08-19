"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingCart, Package, Heart } from "lucide-react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import SearchModal from "./SearchModal";
import { useCartAnimation } from "./CartAnimationProvider";

export default function Navbar({
  storeName = 'فضل عزام',
  storeNameLatin = 'FADL AZZAM',
}: {
  storeName?: string
  storeNameLatin?: string
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount } = useCart();
  const { cartIconRef, triggerBounce, onBounceComplete } = useCartAnimation();
  const localRef = useRef<HTMLDivElement>(null);
  const [topOffset, setTopOffset] = useState(0);

  // sync local ref into context ref
  useEffect(() => {
    if (localRef.current) {
      cartIconRef.current = localRef.current;
    }
  }, [cartIconRef]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    const checkOffset = () => {
      const bar = document.getElementById("announcement-bar");
      setTopOffset(bar ? bar.offsetHeight : 0);
    };

    // Initial check
    checkOffset();
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkOffset);
    
    // Also check after a short delay to ensure DOM is fully rendered
    const timeout = setTimeout(checkOffset, 100);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkOffset);
      clearTimeout(timeout);
    };
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "مجالاتنا", href: "/products" },
    { name: "من نحن", href: "/#about" },
    { name: "كيف نعمل", href: "/#experience" },
    { name: "تواصل معنا", href: "/#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ top: topOffset }}
      className={`fixed w-full z-50 border-b transition-all duration-500 ${
        isScrolled
          ? "border-accent/30 bg-[#071a4d]/95 py-1.5 shadow-[0_12px_30px_rgba(3,12,45,0.28)] backdrop-blur-xl md:py-2"
          : "border-accent/25 bg-gradient-to-l from-[#071a4d] via-[#123bb7] to-[#071a4d] py-2.5 shadow-[0_8px_24px_rgba(3,12,45,0.18)] md:py-3.5"
      }`}
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-accent/80 to-transparent" />
      <div className="relative mx-auto flex h-12 max-w-7xl items-center justify-between px-4 md:h-14 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          aria-label={`${storeName} - ${storeNameLatin}`}
          className="group relative z-50 flex items-center"
        >
          <span className="flex flex-col items-end leading-none" dir="rtl">
            <span className="text-xl font-black tracking-tight text-surface transition-colors duration-300 md:text-[1.55rem]">
              {storeName}
            </span>
            <span className="mt-1 h-[2px] w-10 bg-accent transition-all duration-300 group-hover:w-full" />
            <span dir="ltr" className="mt-1 text-[9px] font-semibold tracking-[0.34em] text-accent/95 transition-colors duration-300 md:text-[10px]">
              {storeNameLatin}
            </span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 md:flex" dir="rtl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative rounded-full px-4 py-2 text-sm font-medium tracking-wide text-surface/80 transition-all duration-300 hover:bg-white/[0.08] hover:text-surface"
            >
              {link.name}
              <span className="absolute bottom-1 right-4 h-px w-0 bg-accent transition-all duration-300 group-hover:w-[calc(100%-2rem)]"></span>
            </Link>
          ))}
        </div>

        {/* Actions & Mobile Menu Toggle */}
        <div className="relative z-50 flex items-center gap-1.5 md:gap-2">
          <Link 
            href="/track" 
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 text-accent transition-all duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent sm:flex"
            aria-label="تتبع الطلب"
          >
            <Package className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={1.5} />
          </Link>
          <Link 
            href="/favorites" 
            className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 text-accent transition-all duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent md:flex"
            aria-label="المفضلة"
          >
            <Heart className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={1.5} />
          </Link>
          <button 
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-accent transition-all duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent"
            aria-label="البحث"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={1.5} />
          </button>
          <div ref={localRef} className="relative hidden md:block">
            <Link href="/cart" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-accent transition-all duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent" aria-label="سلة المشتريات">
              <motion.div
                animate={triggerBounce ? { scale: [1, 1.4, 0.9, 1.15, 1], rotate: [0, -8, 8, -4, 0] } : {}}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onAnimationComplete={onBounceComplete}
              >
                <ShoppingCart className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={1.5} />
              </motion.div>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -top-1.5 -right-2 bg-accent text-brand text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-accent transition-all duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? "auto" : "none",
        }}
        className="fixed inset-0 z-40 flex min-h-screen flex-col items-center justify-center bg-[#061536]/[0.98] backdrop-blur-2xl"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-5">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ y: 20, opacity: 0 }}
              animate={isMobileMenuOpen ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link
                href={link.href}
                className="border-b border-transparent px-5 py-2 text-lg font-medium tracking-wider text-surface transition-colors hover:border-accent hover:text-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </motion.nav>
  );
}
