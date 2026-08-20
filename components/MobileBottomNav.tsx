"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Home, LayoutGrid, Heart, ShoppingCart, Package } from "lucide-react";
import { useCart } from "./CartProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useCartAnimation } from "./CartAnimationProvider";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { triggerBounce, onBounceComplete } = useCartAnimation();

  const navItems = [
    {
      name: "الرئيسية",
      href: "/",
      icon: Home,
    },
    {
      name: "التصنيفات",
      href: "/products",
      icon: LayoutGrid,
    },
    {
      name: "المفضلة",
      href: "/favorites",
      icon: Heart,
    },
    {
      name: "السلة",
      href: "/cart",
      icon: ShoppingCart,
      badge: cartCount,
      isCart: true,
    },
    {
      name: "الطلبات",
      href: "/track",
      icon: Package,
    },
  ];

  const showsBottomNav = Boolean(pathname) && pathname !== "/login" && !pathname.startsWith("/admin") && !pathname.startsWith("/checkout");

  useEffect(() => {
    document.body.classList.toggle("has-mobile-bottom-nav", showsBottomNav);

    return () => {
      document.body.classList.remove("has-mobile-bottom-nav");
    };
  }, [showsBottomNav]);

  // Don't render the bottom nav on login, admin pages, or checkout
  if (!showsBottomNav) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] h-[var(--mobile-bottom-nav-height)] border-t border-[#E1E7F5] bg-[#F7F9FF] pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_15px_rgba(7,26,77,0.08)] md:hidden">
      <div className="flex h-full items-center justify-around px-2" dir="rtl">
        {navItems.map((item) => {
          const isActive = 
            item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
          
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="touch-target relative flex h-full min-h-[var(--touch-target)] w-full flex-col items-center justify-center gap-1"
            >
              <div className="relative">
                {item.isCart ? (
                  <motion.div
                    animate={triggerBounce ? { scale: [1, 1.4, 0.9, 1.15, 1], rotate: [0, -8, 8, -4, 0] } : {}}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    onAnimationComplete={onBounceComplete}
                  >
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      className={`transition-colors duration-200 ${
                        isActive ? "text-[#123CDE]" : "text-[#71809D]"
                      }`}
                    />
                  </motion.div>
                ) : (
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-[#123CDE]" : "text-[#71809D]"
                    }`}
                  />
                )}
                
                <AnimatePresence>
                  {item.badge && item.badge > 0 ? (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className={`absolute -top-1.5 -right-2 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${
                        isActive ? "bg-[#071A4D] text-white" : "bg-[#123CDE] text-white"
                      }`}
                    >
                      {item.badge}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>
              
              <span
                className={`text-[10px] font-bold transition-colors duration-200 ${
                  isActive ? "text-[#123CDE]" : "text-[#71809D]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
