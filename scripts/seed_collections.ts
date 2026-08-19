import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const collections = [
    {
      name: 'المجموعة الشرقية',
      slug: 'oriental-collection',
      description: 'تشكيلة فاخرة من العطور الشرقية الأصيلة التي تجسد عبق التاريخ والأصالة.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtc55VAqNEoU-RBm2CPHGiUP7doppwtmUgJLOV-1uhHCHAsxd68gzVqMxV5okFHrTkT-Ayj-osfUf4Kmj3vJ4BAtvGEOnhKCFPgKirgCxAsiQT5sAwwqKYlv-Ex-IbRSgFd1P3LHs3BXP1vzRgEMGJRz8z9t9hISKcrQ2Sgve6rTwF_5ukU3xvP_ZUMu-a0zoH6pb1u77_NaQJPOD-tpn3o8rydrJXX38eADpIbmtnCabbWSLnQcntsQ',
      isActive: true
    },
    {
      name: 'الزهور الناعمة',
      slug: 'soft-flowers',
      description: 'باقة من أرق العطور الزهرية التي تمنحك إحساساً بالانتعاش والأنوثة.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmlllId7TW02eUcacWvdlZpQlOg5i2wfFmFIP7qLzbM-WwSfR94R8b62zx99udgYuKk3M6a-BxZpTC_rxwyTZCHY5UrIbFuKPmxQcUgf3iKb_nK11bNJkmEYtDwbwcLnaxXl_pnWiLavyEpGpPWVL-AUSdwQ5WVSnfbplH5C7QhWSlw0Uzj0UkMdXmp4sZnjyFomiEoR76lQMjMgF4aMREQLikFhqSpOuT1SD0g-jMLNRSXtkTNKDSqQ',
      isActive: true
    },
    {
      name: 'مجموعة العود',
      slug: 'oud-collection',
      description: 'تشكيلة حصرية من أندر أنواع العود الفاخر المستخلص بعناية فائقة.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5LimJQPVgwF6csHzwgvG86H-jwtEH51Oe8KRvyZDDM8HrMsSy220FYYculiOnzwcq-rOFIN3rqaylNpkaF7QfjgV4Hyfu48iGlR9tgyWUWZ1ZEkciVFnegDernT_0lFytpiLPI6TrxHf_488HuJaRHtyN8EpoBOFSnG0URGDMv-CzsVYjwekijWFUxWqoZVYcIA_mWAwUicHuc4bIKVF4wQgK49nZ43jyj20EuzzXDalAPhfPY9h9Yw',
      isActive: true
    }
  ]

  for (const c of collections) {
    await prisma.collection.upsert({
      where: { slug: c.slug },
      update: {},
      create: c
    })
  }
  console.log('Collections seeded successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
