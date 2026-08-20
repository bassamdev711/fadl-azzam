'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from './actions'
import { Lock, ArrowRight, ShieldCheck, Mail } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await login(email, password)

    if (res.success) {
      router.push('/admin')
    } else {
      setError(res.error || 'حدث خطأ غير متوقع')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#071a4d] flex flex-col justify-center items-center px-4 py-20 font-sans text-white" dir="rtl">
      <Link href="/" className="btn btn-ghost btn-sm absolute right-4 top-4 gap-2 text-white/70 hover:text-[#E2C458] sm:right-8 sm:top-8">
        <ArrowRight size={20} />
        العودة للموقع
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-[#D4AF37]/35 bg-white p-5 shadow-xl sm:p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#D4AF37]/12 rounded-full flex items-center justify-center border border-[#D4AF37]/35">
            <ShieldCheck className="w-8 h-8 text-brand" />
          </div>
        </div>

        <h1 className="text-center text-2xl font-black text-[#071a4d] mb-2 sm:text-3xl">لوحة تحكم فضل عزام</h1>
        <p className="text-center text-[#071a4d]/65 font-medium mb-8">
          سجّل الدخول بالبريد الإلكتروني وكلمة المرور
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#071a4d] mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-xl border border-foreground/10 bg-surface/50 pl-4 pr-12 text-foreground transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent ltr"
                placeholder="admin@example.com"
                autoComplete="username"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#071a4d] mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-xl border border-foreground/10 bg-surface/50 pl-4 pr-12 text-foreground transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent ltr"
                placeholder="أدخل كلمة المرور"
                autoComplete="current-password"
                dir="ltr"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm font-bold rounded-lg border border-red-100 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full btn-lg !bg-brand !text-white hover:!bg-brand-hover border border-[#D4AF37]/60 disabled:opacity-50 disabled:cursor-not-allowed h-14 text-lg"
          >
            {loading ? 'جاري التحقق...' : 'دخول إلى لوحة التحكم'}
          </button>
        </form>
      </div>

      <p className="mt-8 text-sm text-white/65 font-medium">
        هذه الصفحة مخصصة لمدير الموقع فقط.
      </p>
    </div>
  )
}
