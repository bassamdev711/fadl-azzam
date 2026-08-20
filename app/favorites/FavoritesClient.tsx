"use client";

import React, { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/components/FavoritesProvider';
import { useCart } from '@/components/CartProvider';
import { useCurrency } from '@/components/CurrencyProvider';
import { useToast } from '@/components/ToastProvider';

const emptySubscribe = () => () => {}
const getClientHydrationSnapshot = () => true
const getServerHydrationSnapshot = () => false

export default function FavoritesClient() {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const currency = useCurrency();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  )

  if (!mounted) {
    return <div className="min-h-screen bg-surface-alt py-32"></div>;
  }

  return (
    <div className="min-h-screen bg-surface-alt pb-24 pt-24 md:py-32" dir="rtl">
      <div className="site-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-16"
        >
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4 text-brand">
            <Heart size={24} className="md:w-8 md:h-8" fill="currentColor" />
          </div>
          <h1 className="text-2xl md:text-5xl font-black text-foreground mb-3 md:mb-6">
            المفضلة
          </h1>
          <p className="text-sm md:text-lg text-foreground/60">
            منتجاتك المفضلة التي اخترتها بانتظارك
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-black/5 shadow-sm max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-surface-alt rounded-full flex items-center justify-center mx-auto mb-6 text-brand/30">
              <Heart size={48} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">قائمة المفضلة فارغة</h2>
            <p className="text-foreground/60 mb-8 max-w-md mx-auto">
              لم تقم بإضافة أي منتجات إلى المفضلة بعد. تصفح مجموعتنا واكتشف ما يناسب احتياجاتك.
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-brand text-surface h-12 px-8 rounded-xl font-bold hover:bg-foreground transition-colors"
            >
              استكشف المجموعة
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="responsive-grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex h-auto cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-500 group hover:shadow-xl md:h-[500px]"
              >
                <div className="relative flex h-52 w-full items-center justify-center bg-surface/50 p-4 transition-colors duration-500 group-hover:bg-surface sm:h-64 md:h-[65%] md:p-8">
                  <button 
                    className="touch-target absolute left-3 top-3 z-20 rounded-full text-red-500 transition-transform hover:bg-red-50 hover:scale-110 active:scale-95"
                    onClick={(e) => { 
                      e.preventDefault();
                      toggleFavorite(product);
                    }}
                    aria-label="إزالة من المفضلة"
                  >
                    <Heart size={24} fill="currentColor" />
                  </button>
                  <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10" />
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-8 mix-blend-multiply scale-95 group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-accent/20 text-6xl z-0">
                      متجرنا
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 text-center bg-white z-20 border-t border-black/5 relative">
                  <h3 className="text-base md:text-2xl font-black text-foreground mb-0.5 md:mb-1">{product.name}</h3>
                  <p className="text-accent text-[9px] md:text-[10px] tracking-[0.2em] uppercase mb-2 md:mb-4">{product.engName || 'Featured product'}</p>
                  
                  <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-6">
                    <p className="text-brand font-bold text-sm md:text-lg">{Number(product.price).toLocaleString('ar-SA')} {currency}</p>
                    {product.compareAtPrice && (
                      <p className="text-foreground/40 line-through text-[10px] md:text-sm">
                        {Number(product.compareAtPrice).toLocaleString('ar-SA')} {currency}
                      </p>
                    )}
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        imageUrl: product.imageUrl || '',
                        quantity: 1,
                        maxStock: 99
                      });
                      showToast('success', 'تمت الإضافة إلى السلة بنجاح');
                    }}
                    className="w-full max-w-full md:max-w-[200px] h-8 md:h-10 border border-brand text-brand hover:bg-brand hover:text-surface transition-colors rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs"
                  >
                    <ShoppingBag size={13} className="md:w-4 md:h-4" />
                    أضف للسلة
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
