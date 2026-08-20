'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Layers, CreditCard, ArrowRight, ShoppingCart, Truck, FileText, Megaphone, Search, Menu, X, Phone, Inbox, MessageSquare, Activity, Palette, Settings, User, Bell } from 'lucide-react'
import LogoutButton from './LogoutButton'
import type { StoreConfig } from '@/lib/store-config'

type AdminProfile = {
  name: string
  avatarUrl: string | null
}

export default function AdminSidebar({
  profile,
  store,
  children,
}: {
  profile?: AdminProfile
  store?: Pick<StoreConfig, 'name' | 'nameLatin' | 'logoUrl'>
  children: React.ReactNode
}) {
  const storeName = store?.name || 'متجرك'
  const storeNameLatin = store?.nameLatin || 'YOUR STORE'
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const closeSidebar = () => setIsOpen(false)

  // Toggle body class for admin layout
  useEffect(() => {
    document.body.classList.add('is-admin')
    return () => {
      document.body.classList.remove('is-admin')
    }
  }, [])

  const navLinks = [
    { href: '/admin', icon: LayoutDashboard, label: 'نظرة عامة', exact: true },
    { href: '/admin/analytics', icon: Activity, label: 'الإحصائيات' },
    { href: '/admin/products', icon: Package, label: 'إدارة المنتجات' },
    { href: '/admin/collections', icon: Layers, label: 'التصنيفات' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'الطلبات' },
    { href: '/admin/payment-settings', icon: CreditCard, label: 'إعدادات الدفع' },
    { href: '/admin/shipping-settings', icon: Truck, label: 'إعدادات الشحن' },
    { href: '/admin/contact-settings', icon: Phone, label: 'إعدادات التواصل' },
    { href: '/admin/inbox', icon: Inbox, label: 'صندوق الوارد' },
    { href: '/admin/reviews', icon: MessageSquare, label: 'المراجعات' },
    { href: '/admin/legal-pages', icon: FileText, label: 'الصفحات القانونية' },
    { href: '/admin/marketing', icon: Megaphone, label: 'التسويق' },
    { href: '/admin/store-visibility', icon: Search, label: 'تحسين ظهور المتجر' },
    { href: '/admin/homepage-content', icon: LayoutDashboard, label: 'محتوى الرئيسية' },
    { href: '/admin/branding', icon: Palette, label: 'الهوية البصرية' },
    { href: '/admin/notifications', icon: Bell, label: 'إعدادات الإشعارات' },
    { href: '/admin/profile', icon: User, label: 'الملف الشخصي' },
  ]

  return (
    <div dir="rtl" className="flex flex-col flex-1 overflow-hidden bg-ivory font-sans text-deep-green w-full h-full">
      {/* Mobile Header (Hamburger Menu) - Now a standard flex child, no sticky needed */}
      <div className="md:hidden bg-[linear-gradient(135deg,#123CDE_0%,#0B2B9F_58%,#071A4D_100%)] border-b border-[#5B86FF]/40 flex items-center justify-between p-4 text-white w-full flex-shrink-0 z-40 shadow-[0_8px_24px_rgba(7,26,77,0.35)]">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div>
            <h1 className="text-lg font-black tracking-widest text-[#D4AF37] leading-none drop-shadow-[0_2px_8px_rgba(212,175,55,0.2)]">{storeNameLatin} ADMIN</h1>
          </div>
        </div>
        {profile && (
          <Link href="/admin/profile">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border border-white/20">
              {profile.avatarUrl ? (
                <Image src={profile.avatarUrl} alt={profile.name} fill sizes="40px" className="object-cover" />
              ) : (
                <span className="text-sm text-ivory font-bold">{profile.name?.charAt(0)}</span>
              )}
            </div>
          </Link>
        )}
      </div>

      {/* Main Container below the mobile header */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay (Mobile) */}
        {isOpen && (
          <div
            className="md:hidden absolute inset-0 bg-black/50 z-40"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar Content */}
        <aside className={`
          absolute md:relative inset-y-0 right-0 z-50
          w-64 bg-[linear-gradient(180deg,#123CDE_0%,#0B2B9F_55%,#071A4D_100%)] border-l border-[#5B86FF]/35 shadow-[0_18px_50px_rgba(7,26,77,0.42)] flex-shrink-0 text-white
          transform transition-transform duration-300 ease-in-out h-full overflow-y-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6 hidden md:block">
            <Link href="/admin">
              <h1 className="text-2xl font-black tracking-widest text-[#D4AF37] mb-1 drop-shadow-[0_2px_10px_rgba(212,175,55,0.22)]">{storeNameLatin} ADMIN</h1>
              <p className="text-[10px] text-white/65 uppercase tracking-[0.2em]">لوحة تحكم {storeName}</p>
            </Link>

            {profile && (
              <div className="mt-8 flex items-center gap-3 bg-[#071A4D]/35 p-3 rounded-xl border border-[#5B86FF]/30 shadow-inner shadow-black/10">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0 flex items-center justify-center relative border border-white/20">
                  {profile.avatarUrl ? (
                    <Image src={profile.avatarUrl} alt={profile.name} fill sizes="40px" className="object-cover" />
                  ) : (
                    <span className="text-lg text-ivory font-bold">{profile.name?.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{profile.name}</p>
                  <p className="text-xs text-gold truncate">الإدارة العامة</p>
                </div>
                <Link href="/admin/profile" className="text-white/50 hover:text-white transition-colors" title="إعدادات الحساب">
                  <Settings size={18} />
                </Link>
              </div>
            )}
          </div>
          <nav className="px-4 pb-6 space-y-2 mt-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${
                    isActive
                    ? 'bg-[#5B86FF]/20 text-[#D4AF37] border-r-2 border-[#D4AF37] shadow-[inset_0_0_20px_rgba(91,134,255,0.18)]'
                    : 'text-white/85 hover:bg-white/10 hover:text-[#D4AF37] hover:border-r-2 hover:border-[#D4AF37]/70'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              )
            })}

            <div className="pt-8 mt-8 border-t border-white/10 px-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-xs font-medium text-white/55 hover:text-white transition-colors mb-4"
              >
                <ArrowRight className="w-4 h-4" />
                العودة للمتجر
              </Link>
              <LogoutButton />
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full relative pb-10">
          {children}
        </main>
      </div>
    </div>
  )
}
