"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import { useCart } from './CartProvider';
import { useToast } from './ToastProvider';
import { getImageSizes } from '@/lib/image-utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    imageUrl: string;
    engName?: string;
    brand?: string;
  };
  currency: string;
  priority?: boolean;
}

export default function ProductCard({ product, currency, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      maxStock: 99, // default max stock if not provided
    });
    showToast('success', 'تمت الإضافة إلى السلة بنجاح');
  };

  return (
    <div className="relative h-full min-w-0 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition-all duration-300 group cursor-pointer hover:shadow-xl">
      <div className="relative aspect-[3/2] w-full shrink-0 bg-surface/50 transition-colors duration-300 group-hover:bg-surface flex items-center justify-center">
        <FavoriteButton 
          product={product}
          className="z-20 m-2 md:m-3"
        />
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10" />
        
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes={getImageSizes('card')}
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            className="z-0 object-contain p-2 mix-blend-multiply transition-transform duration-500 ease-out hover:scale-105 md:p-4"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-accent/20 text-6xl z-0">
            متجرنا
          </div>
        )}
      </div>
      
      <div className="relative z-20 flex flex-1 flex-col items-center justify-start bg-white p-2.5 text-center md:p-3">
        <h3 className="mb-0.5 line-clamp-2 text-sm font-black text-foreground md:text-base">{product.name}</h3>
        <p className="mb-1.5 line-clamp-1 text-[9px] uppercase tracking-[0.15em] text-accent md:mb-2 md:text-[10px]">
          {product.engName || product.brand || 'Featured product'}
        </p>
        
        <div className="mb-2 flex items-center gap-1.5 md:mb-3 md:gap-2">
          <p className="text-brand font-bold text-xs md:text-base">{Number(product.price).toLocaleString('ar-SA')} {currency}</p>
          {product.compareAtPrice && (
            <p className="text-foreground/40 line-through text-[10px] md:text-sm">
              {Number(product.compareAtPrice).toLocaleString('ar-SA')}
            </p>
          )}
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="flex h-8 w-full max-w-full items-center justify-center gap-1.5 rounded-lg border border-brand text-[11px] font-bold text-brand transition-colors hover:bg-brand hover:text-surface md:h-9 md:max-w-[160px] md:rounded-xl"
        >
          <ShoppingBag size={13} className="md:w-4 md:h-4" />
          أضف للسلة
        </button>
      </div>
    </div>
  );
}
