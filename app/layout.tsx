import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

import prisma from "@/lib/prisma";
import { getSiteUrl, getStoreConfig } from "@/lib/store-config";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700"],
  variable: "--font-tajawal",
});

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStoreConfig()
  const title = store.nameLatin && store.name !== store.nameLatin
    ? `${store.name} | ${store.nameLatin}`
    : store.name

  return {
    metadataBase: getSiteUrl(store.storeUrl),
    title: {
      default: title,
      template: `%s | ${store.name}`,
    },
    description: store.description,
    applicationName: store.name,
    keywords: [
      'فضل عزام',
      'فضل عزام للتجارة العامة',
      'التجارة العامة',
      'الأجهزة المنزلية',
      'الطاقة الشمسية',
      'حلول وتجهيزات تجارية',
      'توريد منتجات',
    ],
    category: 'business',
    creator: store.name,
    publisher: store.name,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'ar_YE',
      siteName: store.name,
      title,
      description: store.description,
      images: [{
        url: store.ogImageUrl || '/brand/hero-facade.jpg',
        width: 1200,
        height: 630,
        alt: `${store.name} - ${store.tagline}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: store.description,
      images: [store.ogImageUrl || '/brand/hero-facade.jpg'],
    },
    verification: {
      google: 'NCVmwPE86l-HLKPT47EhXHhIKv0_Eb_tNh0bG6jtNEg',
    },
    icons: {
      icon: store.faviconUrl ?? '/brand/favicon-store.png',
      shortcut: store.faviconUrl ?? '/brand/favicon-store.png',
      apple: store.faviconUrl ?? '/brand/favicon-store.png',
    },
  }
}

import { CartProvider } from "@/components/CartProvider";
import { CheckoutProvider } from "@/components/CheckoutProvider";
import { CartAnimationProvider } from "@/components/CartAnimationProvider";
import { ToastProvider } from "@/components/ToastProvider";
import { ConfirmProvider } from "@/components/ConfirmProvider";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import AnnouncementBar from "@/components/AnnouncementBar";
import VisitorTracker from "@/components/VisitorTracker";
import SplashScreen from "@/components/SplashScreen";
import MobileBottomNav from "@/components/MobileBottomNav";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await getStoreConfig()
  let currency = "ر.س"
  let contactSettings: {
    phoneNumber: string | null
    showPhoneNumber: boolean
    emailAddress: string | null
    showEmailAddress: boolean
    address: string | null
    showAddress: boolean
    instagramUrl: string | null
    showInstagram: boolean
    facebookUrl: string | null
    showFacebook: boolean
    twitterUrl: string | null
    showTwitter: boolean
    telegramUrl: string | null
    showTelegram: boolean
    threadsUrl: string | null
    showThreads: boolean
  } | null = null

  try {
    const [paymentSettings, dbContactSettings] = await Promise.all([
      prisma.paymentSettings.findUnique({
        where: { id: 'singleton' },
        select: { currency: true },
      }),
      prisma.contactSettings.findUnique({
        where: { id: 'singleton' },
        select: {
          phoneNumber: true,
          showPhoneNumber: true,
          emailAddress: true,
          showEmailAddress: true,
          address: true,
          showAddress: true,
          instagramUrl: true,
          showInstagram: true,
          facebookUrl: true,
          showFacebook: true,
          twitterUrl: true,
          showTwitter: true,
          telegramUrl: true,
          showTelegram: true,
          threadsUrl: true,
          showThreads: true,
        },
      }),
    ])
    currency = paymentSettings?.currency || currency
    contactSettings = dbContactSettings
  } catch {}

  const sameAs = [
    contactSettings?.showInstagram !== false ? contactSettings?.instagramUrl : null,
    contactSettings?.showFacebook !== false ? contactSettings?.facebookUrl : null,
    contactSettings?.showTwitter !== false ? contactSettings?.twitterUrl : null,
    contactSettings?.showTelegram !== false ? contactSettings?.telegramUrl : null,
    contactSettings?.showThreads !== false ? contactSettings?.threadsUrl : null,
  ].filter(Boolean)

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Store", "LocalBusiness"],
    name: store.name,
    alternateName: store.nameLatin,
    description: store.description,
    url: getSiteUrl(store.storeUrl),
    image: store.ogImageUrl || new URL('brand/hero-facade.jpg', getSiteUrl(store.storeUrl)).toString(),
    ...(contactSettings?.showPhoneNumber !== false && contactSettings?.phoneNumber
      ? { telephone: contactSettings.phoneNumber }
      : {}),
    ...(contactSettings?.showEmailAddress !== false && contactSettings?.emailAddress
      ? { email: contactSettings.emailAddress }
      : {}),
    ...(contactSettings?.showAddress !== false && contactSettings?.address
      ? { address: { "@type": "PostalAddress", streetAddress: contactSettings.address } }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }

  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-surface text-foreground overflow-x-hidden pb-16 md:pb-0">
        <SplashScreen storeName={store.name} storeNameLatin={store.nameLatin} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <VisitorTracker />
        <CurrencyProvider currency={currency}>
          <ToastProvider>
            <ConfirmProvider>
              <CartAnimationProvider>
                <CheckoutProvider>
                  <CartProvider>
                    <FavoritesProvider>
                      <AnnouncementBar />
                      {children}
                      <MobileBottomNav />

                    </FavoritesProvider>
                  </CartProvider>
                </CheckoutProvider>
              </CartAnimationProvider>
            </ConfirmProvider>
          </ToastProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
