import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductDetailClient from './ProductDetailClient'
import ProductReviews from '@/components/ProductReviews'
import { getCurrency } from '@/lib/currency'
import { getStoreConfig } from '@/lib/store-config'
import ProductCard from '@/components/ProductCard'
import { isLegacyCatalogRecord } from '@/lib/catalog-utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const [product, store] = await Promise.all([
    prisma.product.findUnique({ where: { slug: decodedSlug } }),
    getStoreConfig(),
  ])
  if (!product || isLegacyCatalogRecord(product)) return {}
  return {
    title: `${product.name} | ${store.name}`,
    description: product.description || `اكتشف ${product.name} من ${store.name}`,
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const currency = await getCurrency()

  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const product = await prisma.product.findUnique({ 
    where: { slug: decodedSlug, isActive: true },
    include: { variants: true }
  })
  if (!product || isLegacyCatalogRecord(product)) notFound()

  // المنتجات المرتبطة — حقول أساسية فقط (لا حاجة للوصف أو المخزون)
  let related = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      OR: [
        { gender: product.gender ?? undefined },
        { category: product.category ?? undefined },
      ],
    },
    take: 4,
    orderBy: { featured: 'desc' },
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      imageUrl: true,
    },
  })

  related = related.filter((item) => !isLegacyCatalogRecord(item))

  return (
    <main className="min-h-screen bg-surface text-foreground font-sans">
      <Navbar storeName="فضل عزام" storeNameLatin="FADL AZZAM" />

      {/* Breadcrumb */}
      <div className="site-container pt-24 pb-4" dir="rtl">
        <div className="w-full">
          <nav className="flex items-center gap-2 text-xs text-foreground/50 font-medium">
            <Link href="/" className="hover:text-brand transition-colors">الرئيسية</Link>
            <ChevronRight className="w-3 h-3 rotate-180" />
            <Link href="/products" className="hover:text-brand transition-colors">مجالاتنا</Link>
            <ChevronRight className="w-3 h-3 rotate-180" />
            <span className="text-brand font-bold">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="pb-10 pt-2">
        <div className="w-full">
          <ProductDetailClient
            product={{
              ...product,
              price: Number(product.price),
              compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
              variants: product.variants.map(v => ({
                ...v,
                price: Number(v.price),
                compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
              }))
            }}
          />
        </div>
      </section>

      {/* Product Reviews */}
      <ProductReviews productId={product.id} />

      {/* Related Products */}
      {related.length > 0 && (
        <section className="border-t border-black/5 bg-white py-16 md:py-20" dir="rtl">
          <div className="site-container">
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 md:mb-10 text-center">قد يعجبك أيضاً</h2>
            <div className="responsive-grid grid-cols-2 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard 
                  key={p.id}
                  product={{
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: Number(p.price),
                    compareAtPrice: null,
                    imageUrl: p.imageUrl || '',
                  }}
                  currency={currency}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer storeName="فضل عزام" storeNameLatin="FADL AZZAM" />
    </main>
  )
}
