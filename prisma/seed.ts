import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  await prisma.storeSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      storeName: process.env.STORE_NAME?.trim() || 'فضل عزام',
      storeNameLatin: process.env.STORE_NAME_LATIN?.trim() || 'FADL AZZAM',
      storeTagline: process.env.STORE_TAGLINE?.trim() || 'للتجارة العامة والحلول العملية.',
      storeDescription: process.env.STORE_DESCRIPTION?.trim() || 'فضل عزام للتجارة العامة: توريد منتجات وحلول عملية للأجهزة المنزلية والطاقة الشمسية والأعمال التجارية.',
      locale: process.env.STORE_LOCALE?.trim() || 'ar',
      currencyCode: process.env.STORE_CURRENCY?.trim().toUpperCase() || 'USD',
      storeUrl: process.env.STORE_URL?.trim() || null,
    },
  })

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
      update: {},
      create: collection,
    })
  }
  console.log('Business areas initialized.')

  const shippingCityCount = await prisma.shippingCity.count()
  if (shippingCityCount === 0) {
    await prisma.shippingCity.create({
      data: { name: 'إب', shippingFee: 0, isActive: true },
    })
    console.log('Created default shipping city: إب')
  }

  if (process.env.SEED_DEMO_DATA !== 'true') {
    console.log('Demo catalog skipped. Set SEED_DEMO_DATA=true to add sample products.')
    return
  }

  const demoProducts = [
    {
      name: 'منتج تجريبي أساسي',
      slug: 'demo-product-basic',
      brand: 'فضل عزام',
      description: 'منتج تجريبي قابل للاستبدال من لوحة التحكم.',
      price: 10,
      stock: 25,
      isActive: true,
      category: 'General',
      gender: 'Unisex',
      size: 'Standard',
      featured: true,
      bestseller: false,
    },
    {
      name: 'منتج تجريبي مميز',
      slug: 'demo-product-featured',
      brand: 'فضل عزام',
      description: 'مثال عام لمنتج عملي قابل للاستبدال من لوحة التحكم.',
      price: 25,
      stock: 15,
      isActive: true,
      category: 'Featured',
      gender: 'Unisex',
      size: 'Standard',
      featured: true,
      bestseller: true,
    },
  ]

  for (const product of demoProducts) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
    console.log(`Created demo product: ${createdProduct.id}`)
  }

  console.log('Database seed finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
