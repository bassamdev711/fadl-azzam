import dynamic from 'next/dynamic'
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";

// Server Components can be directly imported if they are lightweight, 
// but we want to stream them or lazy load client components.
import CollectionsSection from "@/components/CollectionsSection";
import ProductsServer from "@/components/ProductsServer";
import { getHomepageSettings } from "@/app/actions/homepage";
import prisma from "@/lib/prisma";
import CampaignBanner from "@/components/CampaignBanner";
import { getStoreConfig } from "@/lib/store-config";

// Dynamic Imports for components below the fold (Lazy Loading)
const Experience = dynamic(() => import("@/components/Experience"), { ssr: true })
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: true })
const Newsletter = dynamic(() => import("@/components/Newsletter"), { ssr: true })
const Contact = dynamic(() => import("@/components/Contact"), { ssr: true })
const Stats = dynamic(() => import("@/components/Stats"), { ssr: true })

export default async function Home() {
  const [store, { data: settings }] = await Promise.all([
    getStoreConfig(),
    getHomepageSettings(),
  ]);
  const safeSettings = settings || {};

  let activeCampaign: Awaited<ReturnType<typeof prisma.campaign.findFirst>> = null
  try {
    activeCampaign = await prisma.campaign.findFirst({
      where: {
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch {
    // Render the homepage without a campaign when the database is unavailable.
  }

  return (
    <main className="min-h-screen bg-surface text-foreground overflow-hidden font-sans">
      <Navbar storeName={store.name} storeNameLatin={store.nameLatin} />
      
      {/* 1. Store Identity */}
      <Hero data={safeSettings} brandName={store.name} brandNameLatin={store.nameLatin} />
      
      {/* Campaign Banner (if any) */}
      {activeCampaign && <CampaignBanner campaign={activeCampaign} />}
      
      {/* 2. About Fadl Azzam */}
      <About data={safeSettings} brandName={store.name} />
      
      {/* 3. Business Areas */}
      <CollectionsSection brandName={store.name} />
      
      {/* 4. Featured solutions */}
      <ProductsServer
        type="bestsellers"
        title="حلول مطلوبة"
        subtitle="خيارات عملية للأعمال والمنازل"
      />

      {/* 5. Offers */}
      <ProductsServer
        type="offers"
        title="فرص وتوريد"
        subtitle="خيارات مناسبة لاحتياجك"
      />

      {/* 6. Featured */}
      <ProductsServer
        type="featured"
        title="مختارات فضل عزام"
        subtitle={`حلول وتجهيزات من ${store.name}`}
      />
      
      {/* 7. Why trust us */}
      <Experience data={safeSettings} brandName={store.name} />
      
      {/* 8. Stats (Social Proof) */}
      <Stats data={safeSettings} />
      
      {/* 9. Testimonials */}
      <Testimonials />
      
      {/* 10. Call to action */}
      <Newsletter storeName={store.name} />
      <Contact />
      
      <Footer storeName={store.name} storeNameLatin={store.nameLatin} />
    </main>
  );
}
