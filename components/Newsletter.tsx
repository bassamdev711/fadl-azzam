"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

export default function Newsletter({ storeName = 'فضل عزام' }: { storeName?: string }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const result = await subscribeToNewsletter(email);
    setIsSubmitting(false);

    if (result.success) {
      showToast("success", result.message || "تم الاشتراك بنجاح!");
      setEmail("");
    } else {
      showToast("error", result.error || "حدث خطأ ما");
    }
  };

  return (
    <section className="py-24 bg-[#071A4D] relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-16 h-16 bg-[#D4AF37]/15 rounded-full flex items-center justify-center mx-auto mb-8 text-[#D4AF37]">
            <Mail className="w-8 h-8" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-surface mb-6">
            ابقَ قريبًا من {storeName}
          </h2>
          <p className="text-white/80 text-lg mb-10 font-light">
            اشترك لتصلك أخبار المجالات الجديدة، وفرص التوريد، والمحتوى العملي الذي يهم أعمالك ومنزلك.
          </p>

          <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="flex-1 bg-white/10 border border-white/20 text-white px-6 py-4 rounded-sm focus:outline-none focus:border-[#D4AF37]/70 transition-colors placeholder:text-white/55 text-right"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#D4AF37] text-[#071A4D] font-bold px-10 py-4 rounded-sm hover:bg-[#E2C458] transition-colors shadow-lg shadow-black/20 border border-[#E2C458]/70 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "جاري الاشتراك..." : "اشتراك"}
            </button>
          </form>
          <p className="text-white/65 text-xs mt-6 font-light">
            نحترم خصوصيتك. لن نقوم بإرسال رسائل مزعجة.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
