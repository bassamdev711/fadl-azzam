import ProfileClient from './ProfileClient'
import prisma from '@/lib/prisma'

export const metadata = {
  title: 'إعدادات حساب المدير',
}

export default async function ProfilePage() {
  const profile = await prisma.adminProfile.findUnique({
    where: { id: 'singleton' }
  })

  return (
    <ProfileClient 
      initialName={profile?.name || 'مدير الموقع'}
      initialEmail={profile?.email || ''}
      initialAvatar={profile?.avatarUrl || null}
      initialTheme={profile?.themeBackground || null}
    />
  )
}
