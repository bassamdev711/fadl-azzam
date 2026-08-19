'use server'

import { cookies, headers } from 'next/headers'
import { SignJWT } from 'jose'
import prisma from '@/lib/prisma'
import { verifyPassword } from '@/lib/hash'
import { checkRateLimit } from '@/lib/rate-limit'
import { ADMIN_COOKIE_NAME, ADMIN_JWT_CONFIG, getAdminJwtSecret } from '@/lib/auth'
import { getAdminBootstrapEmail, normalizeEmail } from '@/lib/email'

const LOGIN_DELAY_MS = 750

async function delay() {
  await new Promise((resolve) => setTimeout(resolve, LOGIN_DELAY_MS))
}

export async function login(email: string, password: string) {
  const candidateEmail = normalizeEmail(email)
  const candidatePassword = typeof password === 'string' ? password : ''
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (!checkRateLimit(`login_${ip}`, 5, 15 * 60 * 1000)) {
    await delay()
    return { success: false, error: 'تم تجاوز الحد المسموح به لمحاولات تسجيل الدخول. يرجى الانتظار 15 دقيقة والمحاولة مجدداً.' }
  }

  let secret: Uint8Array
  try {
    secret = getAdminJwtSecret()
  } catch (error) {
    console.error('Admin login configuration error:', error)
    return { success: false, error: 'تسجيل الدخول غير متاح حالياً' }
  }

  if (!candidateEmail || !candidatePassword) {
    await delay()
    return { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }
  }

  let isPasswordValid = false

  try {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: { id: 'singleton' },
      select: { email: true, isSetupComplete: true, passwordHash: true },
    })

    if (adminProfile?.isSetupComplete && adminProfile.email && adminProfile.passwordHash) {
      isPasswordValid = candidateEmail === normalizeEmail(adminProfile.email) && verifyPassword(candidatePassword, adminProfile.passwordHash)
    } else if (process.env.ADMIN_SETUP_ENABLED === 'true') {
      const bootstrapEmail = getAdminBootstrapEmail()
      const bootstrapPassword = process.env.ADMIN_PASSWORD || ''
      isPasswordValid = Boolean(bootstrapEmail && bootstrapPassword) && candidateEmail === bootstrapEmail && candidatePassword === bootstrapPassword
    }
  } catch (error) {
    console.error('Admin profile lookup failed:', error)
    await delay()
    return { success: false, error: 'تعذر التحقق من تسجيل الدخول حالياً' }
  }

  if (!isPasswordValid) {
    await delay()
    return { success: false, error: 'بيانات الدخول غير صحيحة' }
  }

  try {
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setSubject('admin')
      .setIssuer(ADMIN_JWT_CONFIG.issuer)
      .setAudience(ADMIN_JWT_CONFIG.audience)
      .setIssuedAt()
      .setJti(crypto.randomUUID())
      .setExpirationTime('8h')
      .sign(secret)

    const cookieStore = await cookies()
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8,
    })

    return { success: true }
  } catch (error) {
    console.error('Admin session creation failed:', error)
    return { success: false, error: 'تعذر إنشاء جلسة الإدارة حالياً' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}
