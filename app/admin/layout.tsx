import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import AdminSidebar from './components/AdminSidebar'
import SetupRedirect from './components/SetupRedirect'
import prisma from '@/lib/prisma'
import { getStoreConfig } from '@/lib/store-config'
import { verifyAdmin } from '@/lib/auth'

async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) {
    redirect('/login')
  }

  try {
    await verifyAdmin(token)
  } catch {
    redirect('/login')
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  const [profile, store] = await Promise.all([
    prisma.adminProfile.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      isSetupComplete: false
    }
    }),
    getStoreConfig(),
  ])

  return (
    <AdminSidebar profile={profile} store={store}>
      <SetupRedirect isSetupComplete={profile.isSetupComplete} />
      <div className="max-w-6xl mx-auto md:px-10 mt-8">
        <div className="px-4 md:px-0">
          {children}
        </div>
      </div>
    </AdminSidebar>
  )
}
