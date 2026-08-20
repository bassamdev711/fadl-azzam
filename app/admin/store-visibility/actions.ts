'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { verifyAdmin } from '@/lib/auth'

function parseSearchPhrases(value: FormDataEntryValue | null): string[] {
  if (typeof value !== 'string' || !value.trim()) return []
  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((phrase): phrase is string => typeof phrase === 'string')
      .map((phrase) => phrase.trim())
      .filter(Boolean)
      .slice(0, 100)
  } catch {
    return []
  }
}

export async function updateStoreVisibility(formData: FormData) {
  await verifyAdmin()

  const storeName = String(formData.get('storeName') ?? '').trim().slice(0, 200)
  const storeDescription = String(formData.get('storeDescription') ?? '').trim().slice(0, 5000)
  const seoSearchPhrases = parseSearchPhrases(formData.get('seoSearchPhrases'))

  try {
    await prisma.storeSettings.upsert({
      where: { id: 'singleton' },
      update: {
        storeName,
        storeDescription,
        seoSearchPhrases,
      },
      create: {
        id: 'singleton',
        storeName,
        storeDescription,
        seoSearchPhrases,
      },
    })

    revalidatePath('/admin/store-visibility')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Error updating store visibility:', error)
    return { success: false, error: 'تعذر حفظ إعدادات ظهور المتجر حالياً.' }
  }
}
