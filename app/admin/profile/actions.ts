'use server'

import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { verifyAdmin, ADMIN_COOKIE_NAME } from '@/lib/auth'
import { hashPassword, verifyPassword } from '@/lib/hash'
import { validateAdminPassword } from '@/lib/password-policy'
import { isValidEmail, normalizeEmail } from '@/lib/email'
import { revalidatePath } from 'next/cache'

function getText(formData: FormData, key: string, maxLength: number): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function setupAdminProfile(formData: FormData) {
  await verifyAdmin()

  const name = getText(formData, 'name', 100)
  const email = normalizeEmail(formData.get('email'))
  const avatarUrl = getText(formData, 'avatarUrl', 2048)
  const password = typeof formData.get('password') === 'string' ? String(formData.get('password')) : ''

  if (!name || name.length < 2 || !email || !password) {
    return { success: false, error: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة' }
  }

  if (!isValidEmail(email)) {
    return { success: false, error: 'يرجى إدخال بريد إلكتروني صحيح' }
  }

  const passwordError = validateAdminPassword(password)
  if (passwordError) {
    return { success: false, error: passwordError }
  }

  const existingProfile = await prisma.adminProfile.findUnique({
    where: { id: 'singleton' },
    select: { isSetupComplete: true },
  })

  if (existingProfile?.isSetupComplete) {
    return { success: false, error: 'تم إعداد حساب الإدارة مسبقاً' }
  }

  const hashedPassword = hashPassword(password)

  try {
    await prisma.adminProfile.upsert({
      where: { id: 'singleton' },
      update: {
        name,
        email,
        avatarUrl: avatarUrl || null,
        passwordHash: hashedPassword,
        isSetupComplete: true,
      },
      create: {
        id: 'singleton',
        name,
        email,
        avatarUrl: avatarUrl || null,
        passwordHash: hashedPassword,
        isSetupComplete: true,
      },
    })
  } catch (error) {
    console.error('Admin profile setup failed:', error)
    return { success: false, error: 'تعذر حفظ حساب الإدارة. قد يكون البريد مستخدمًا بالفعل.' }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function updateAdminProfile(formData: FormData) {
  await verifyAdmin()

  const name = getText(formData, 'name', 100)
  const email = normalizeEmail(formData.get('email'))
  const avatarUrl = getText(formData, 'avatarUrl', 2048)
  const themeBackground = getText(formData, 'themeBackground', 100)
  const currentPassword = typeof formData.get('currentPassword') === 'string' ? String(formData.get('currentPassword')) : ''
  const newPassword = typeof formData.get('newPassword') === 'string' ? String(formData.get('newPassword')) : ''

  const profile = await prisma.adminProfile.findUnique({
    where: { id: 'singleton' },
  })

  if (!profile || !profile.passwordHash || !profile.isSetupComplete || !profile.email) {
    return { success: false, error: 'ملف الإدارة غير مهيأ بشكل صحيح' }
  }

  const normalizedCurrentEmail = normalizeEmail(profile.email)
  const emailChanged = email !== normalizedCurrentEmail

  if (!email || !isValidEmail(email)) {
    return { success: false, error: 'يرجى إدخال بريد إلكتروني صحيح' }
  }

  if ((emailChanged || newPassword) && (!currentPassword || !verifyPassword(currentPassword, profile.passwordHash))) {
    return { success: false, error: 'كلمة المرور الحالية مطلوبة لتغيير البريد أو كلمة المرور' }
  }

  let updatedPasswordHash = profile.passwordHash
  let passwordChanged = false

  if (newPassword) {
    const passwordError = validateAdminPassword(newPassword)
    if (passwordError) {
      return { success: false, error: passwordError }
    }

    updatedPasswordHash = hashPassword(newPassword)
    passwordChanged = true
  }

  try {
    await prisma.adminProfile.update({
      where: { id: 'singleton' },
      data: {
        name: name || profile.name,
        email,
        avatarUrl: avatarUrl || profile.avatarUrl,
        themeBackground: themeBackground || profile.themeBackground,
        passwordHash: updatedPasswordHash,
      },
    })
  } catch (error) {
    console.error('Admin profile update failed:', error)
    return { success: false, error: 'تعذر حفظ التعديلات. قد يكون البريد مستخدمًا بالفعل.' }
  }

  if (passwordChanged || emailChanged) {
    const cookieStore = await cookies()
    cookieStore.delete(ADMIN_COOKIE_NAME)
  }

  revalidatePath('/admin')
  return { success: true, passwordChanged, emailChanged }
}
