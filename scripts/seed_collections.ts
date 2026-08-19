import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const collections = [
    {
      name: 'الأجهزة المنزلية',
      slug: 'home-appliances',
      description: 'أجهزة منزلية عملية للاستخدام اليومي، مع خيارات مناسبة للمنازل والأعمال.',
      imageUrl: '/brand/home-appliances-category.jpg',
      isActive: true,
    },
    {
      name: 'الطاقة الشمسية',
      slug: 'solar-solutions',
      description: 'حلول ومستلزمات الطاقة الشمسية للاحتياجات المنزلية والتجارية.',
      imageUrl: '/brand/solar-category.jpg',
      isActive: true,
    },
    {
      name: 'التجهيزات التجارية',
      slug: 'business-equipment',
      description: 'تجهيزات وخيارات عملية تساعدك على تشغيل مشروعك بثقة ووضوح.',
      imageUrl: '/brand/general-trade-category.jpg',
      isActive: true,
    },
    {
      name: 'التجارة العامة',
      slug: 'general-trading',
      description: 'توريد وخيارات متنوعة تُبنى على احتياجك الفعلي وميزانيتك.',
      imageUrl: '/brand/hero-facade.jpg',
      isActive: true,
    },
  ]

  for (const collection of collections) {
    await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: {
        name: collection.name,
        description: collection.description,
        imageUrl: collection.imageUrl,
        isActive: collection.isActive,
      },
      create: collection,
    })
  }

  console.log('Fadl Azzam business areas seeded successfully!')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
