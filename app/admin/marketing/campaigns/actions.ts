'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { verifyAdmin } from '@/lib/auth'

type CampaignInput = {
  title: string
  slug: string | null
  description: string | null
  imageUrl: string | null
  couponCode: string | null
  discountPercentage: number | null
  startDate: Date
  endDate: Date
  isActive: boolean
  productIds: string[]
}

type ActionFailure = { success: false; error: string }

function safeText(value: FormDataEntryValue | null, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function safeSlug(value: string, fallback: string): string | null {
  const source = value || fallback
  const normalized = source
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
  return normalized || null
}

function parseCampaignForm(formData: FormData): CampaignInput | ActionFailure {
  const title = safeText(formData.get('title'), 200)
  if (!title) return { success: false, error: 'عنوان الحملة مطلوب.' }

  const startDateValue = safeText(formData.get('startDate'), 80)
  const endDateValue = safeText(formData.get('endDate'), 80)
  const startDate = new Date(startDateValue)
  const endDate = new Date(endDateValue)
  if (!startDateValue || Number.isNaN(startDate.getTime())) {
    return { success: false, error: 'تاريخ بداية الحملة غير صالح.' }
  }
  if (!endDateValue || Number.isNaN(endDate.getTime())) {
    return { success: false, error: 'تاريخ نهاية الحملة غير صالح.' }
  }
  if (endDate < startDate) {
    return { success: false, error: 'يجب أن يكون تاريخ النهاية بعد تاريخ البداية.' }
  }

  const discountText = safeText(formData.get('discountPercentage'), 20)
  const discountPercentage = discountText ? Number(discountText) : null
  if (discountPercentage !== null && (!Number.isInteger(discountPercentage) || discountPercentage < 0 || discountPercentage > 100)) {
    return { success: false, error: 'نسبة الخصم يجب أن تكون بين 0 و100.' }
  }

  const productIds = Array.from(new Set(
    formData.getAll('productIds')
      .filter((id): id is string => typeof id === 'string')
      .map((id) => id.trim())
      .filter(Boolean)
  )).slice(0, 100)

  return {
    title,
    slug: safeSlug(safeText(formData.get('slug'), 120), title),
    description: safeText(formData.get('description'), 5000) || null,
    imageUrl: safeText(formData.get('imageUrl'), 2000) || null,
    couponCode: safeText(formData.get('couponCode'), 100).toUpperCase() || null,
    discountPercentage,
    startDate,
    endDate,
    isActive: formData.get('isActive') === 'on',
    productIds,
  }
}

// ── إنشاء حملة جديدة ──────────────────────────────────────
export async function createCampaign(formData: FormData) {
  await verifyAdmin()
  const parsed = parseCampaignForm(formData)
  if ('success' in parsed) return parsed

  try {
    await prisma.campaign.create({
      data: {
        title: parsed.title,
        slug: parsed.slug,
        description: parsed.description,
        imageUrl: parsed.imageUrl,
        couponCode: parsed.couponCode,
        discountPercentage: parsed.discountPercentage,
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        isActive: parsed.isActive,
        products: {
          connect: parsed.productIds.map((id) => ({ id })),
        },
      },
    })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return { success: false, error: 'تعذر إنشاء الحملة. تحقق من البيانات وحاول مجدداً.' }
  }

  revalidatePath('/admin/marketing/campaigns')
  redirect('/admin/marketing/campaigns')
}

// ── تحديث حملة ─────────────────────────────────────────────
export async function updateCampaign(formData: FormData) {
  await verifyAdmin()
  const id = safeText(formData.get('id'), 100)
  if (!id) return { success: false, error: 'معرّف الحملة غير صالح.' }

  const parsed = parseCampaignForm(formData)
  if ('success' in parsed) return parsed

  try {
    await prisma.campaign.update({
      where: { id },
      data: {
        title: parsed.title,
        slug: parsed.slug,
        description: parsed.description,
        imageUrl: parsed.imageUrl,
        couponCode: parsed.couponCode,
        discountPercentage: parsed.discountPercentage,
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        isActive: parsed.isActive,
        products: {
          set: parsed.productIds.map((productId) => ({ id: productId })),
        },
      },
    })
  } catch (error) {
    console.error('Error updating campaign:', error)
    return { success: false, error: 'تعذر تحديث الحملة. تحقق من البيانات وحاول مجدداً.' }
  }

  revalidatePath('/admin/marketing/campaigns')
  redirect('/admin/marketing/campaigns')
}

// ── حذف حملة ───────────────────────────────────────────────
export async function deleteCampaign(id: string) {
  await verifyAdmin()
  if (!id?.trim()) return { success: false, error: 'معرّف الحملة غير صالح.' }

  try {
    await prisma.campaign.delete({ where: { id } })
    revalidatePath('/admin/marketing/campaigns')
    return { success: true }
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return { success: false, error: 'تعذر حذف الحملة حالياً.' }
  }
}

// ── تفعيل/تعطيل حملة ──────────────────────────────────────
export async function toggleCampaign(id: string, isActive: boolean) {
  await verifyAdmin()
  if (!id?.trim()) return { success: false, error: 'معرّف الحملة غير صالح.' }

  try {
    await prisma.campaign.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
    })
    revalidatePath('/admin/marketing/campaigns')
    return { success: true }
  } catch (error) {
    console.error('Error toggling campaign:', error)
    return { success: false, error: 'تعذر تغيير حالة الحملة حالياً.' }
  }
}
