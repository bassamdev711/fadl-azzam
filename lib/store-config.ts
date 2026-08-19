import { cache } from 'react'
import prisma from '@/lib/prisma'

export type StoreConfig = {
  name: string
  nameLatin: string
  tagline: string
  description: string
  logoUrl: string | null
  faviconUrl: string | null
  ogImageUrl: string | null
  storeUrl: string | null
  locale: string
  currencyCode: string
}

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  name: 'فضل عزام',
  nameLatin: 'FADL AZZAM',
  tagline: 'للتجارة العامة والحلول العملية.',
  description: 'فضل عزام للتجارة العامة: توريد منتجات وحلول عملية للأجهزة المنزلية والطاقة الشمسية والأعمال التجارية.',
  logoUrl: null,
  faviconUrl: null,
  ogImageUrl: null,
  storeUrl: null,
  locale: 'ar',
  currencyCode: 'USD',
}

type StoreSettingsRecord = {
  storeName: string | null
  storeNameLatin: string | null
  storeTagline: string | null
  storeDescription: string | null
  logoUrl: string | null
  faviconUrl: string | null
  ogImageUrl: string | null
  storeUrl: string | null
  locale: string
  currencyCode: string
}

function isLegacyBrandValue(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase() || ''
  return ['متجر طيف', 'طيف', 'tif', 'your store', 'متجرك', 'عطر', 'عطور', 'perfume', 'parfum'].some((term) => normalized.includes(term))
}

function normalizeStoreConfig(settings: StoreSettingsRecord | null | undefined): StoreConfig {
  return {
    ...DEFAULT_STORE_CONFIG,
    name: !isLegacyBrandValue(settings?.storeName) && settings?.storeName?.trim() ? settings.storeName.trim() : DEFAULT_STORE_CONFIG.name,
    nameLatin: !isLegacyBrandValue(settings?.storeNameLatin) && settings?.storeNameLatin?.trim() ? settings.storeNameLatin.trim() : DEFAULT_STORE_CONFIG.nameLatin,
    tagline: !isLegacyBrandValue(settings?.storeTagline) && settings?.storeTagline?.trim() ? settings.storeTagline.trim() : DEFAULT_STORE_CONFIG.tagline,
    description: !isLegacyBrandValue(settings?.storeDescription) && settings?.storeDescription?.trim() ? settings.storeDescription.trim() : DEFAULT_STORE_CONFIG.description,
    logoUrl: settings?.logoUrl || null,
    faviconUrl: settings?.faviconUrl || null,
    ogImageUrl: settings?.ogImageUrl || null,
    storeUrl: settings?.storeUrl || null,
    locale: settings?.locale || DEFAULT_STORE_CONFIG.locale,
    currencyCode: settings?.currencyCode || DEFAULT_STORE_CONFIG.currencyCode,
  }
}

export const getStoreConfig = cache(async (): Promise<StoreConfig> => {
  try {
    const settings = await prisma.storeSettings.findUnique({
      where: { id: 'singleton' },
      select: {
        storeName: true,
        storeNameLatin: true,
        storeTagline: true,
        storeDescription: true,
        logoUrl: true,
        faviconUrl: true,
        ogImageUrl: true,
        storeUrl: true,
        locale: true,
        currencyCode: true,
      },
    })

    return normalizeStoreConfig(settings)
  } catch {
    return DEFAULT_STORE_CONFIG
  }
})

export function getSiteUrl(storeUrl?: string | null): URL {
  const candidate = storeUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://fadl-azzam.vercel.app'
  try {
    return new URL(candidate)
  } catch {
    return new URL('https://fadl-azzam.vercel.app')
  }
}
