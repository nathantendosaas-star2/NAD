import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Sparkles, ShieldCheck } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ImageReveal } from '../components/ImageReveal';

interface AboutViewProps {
  onNavigate: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 sm:pt-28 pb-28 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1920px] mx-auto min-h-screen bg-[#EFEBE3] text-[#141414]">
      {/* Eyebrow and Headline */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <span className="font-satoshi text-xs font-bold tracking-[0.25em] uppercase text-[#C9473B] block mb-3">
          + A BRAND DEFINED AS THE HEART OF ART AND UP-CYCLING
        </span>
        <h1 className="font-serif-heavy text-[clamp(1.5rem,4.5vw,3.5rem)] uppercase tracking-tighter text-[#141414] leading-[0.95] mb-8 break-words">
          The Heart of Art and Upcycling
        </h1>
        <p className="font-satoshi text-lg sm:text-xl text-[#5E5950] leading-[1.8] text-balance font-normal">
          Nairobi Apparel District is a Kenyan streetwear brand known as ‘The Heart of Art and Upcycling.’ We emphasize art, upcycling, recycling, and the use of sustainable fabrics. We take pride in our exclusive Kenyan designs and customer-tailored products, while also committing to reducing the environmental impact of the fast fashion industry by promoting sustainable practices in fashion. Our vision is to be a leading voice in advocacy, cultural influence, and awareness creation through art and fashion.
        </p>
      </div>

      {/* Hero Visual Imagery */}
      <div className="max-w-5xl mx-auto aspect-16/9 overflow-hidden border border-[#DCD5C9] mb-20 relative bg-[#FFFFFF] rounded-3xl shadow-md">
        <ImageReveal
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=2000"
          alt="Studio 18 Kilimani Atelier"
          direction="up"
          containerClassName="w-full h-full"
          className="rounded-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#EFEBE3]/60 via-transparent to-transparent pointer-events-none rounded-3xl" />
        <span className="absolute top-3 left-3 text-[10px] font-mono text-[#C9473B] leading-none">+</span>
        <span className="absolute bottom-3 right-3 text-[10px] font-mono text-[#C9473B] leading-none">+</span>
      </div>

      {/* 3 Pillars of Craft */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#FFFFFF] border border-[#DCD5C9] p-8 space-y-4 relative rounded-3xl shadow-xs hover:shadow-lg transition-all"
        >
          <span className="absolute top-3 left-3 text-[8px] font-mono text-[#C9473B] leading-none">+</span>
          <div className="w-10 h-10 rounded-full bg-[#C9473B] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif-heavy text-2xl uppercase text-[#141414]">Art-Cycling</h3>
          <p className="font-satoshi text-sm text-[#5E5950] leading-relaxed">
            Discarded selvedge rolls, vintage military drills, and surplus fabrics are reimagined into limited-run streetwear canvases. No two pieces possess identical stitch markings.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="bg-[#FFFFFF] border border-[#DCD5C9] p-8 space-y-4 relative rounded-3xl shadow-xs hover:shadow-lg transition-all"
        >
          <span className="absolute top-3 left-3 text-[8px] font-mono text-[#C9473B] leading-none">+</span>
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#141414] border border-[#DCD5C9] flex items-center justify-center shadow-xs">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-serif-heavy text-2xl uppercase text-[#141414]">East African Origin</h3>
          <p className="font-satoshi text-sm text-[#5E5950] leading-relaxed">
            All design, cutting, hand embroidery, and finishing happens at Studio 18 in Kilimani, Nairobi, in proud collaboration with local artisans and craftspeople.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-[#FFFFFF] border border-[#DCD5C9] p-8 space-y-4 relative rounded-3xl shadow-xs hover:shadow-lg transition-all"
        >
          <span className="absolute top-3 left-3 text-[8px] font-mono text-[#C9473B] leading-none">+</span>
          <div className="w-10 h-10 rounded-full bg-[#C9473B]/10 text-[#C9473B] border border-[#C9473B]/30 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif-heavy text-2xl uppercase text-[#141414]">Cultural Voice</h3>
          <p className="font-satoshi text-sm text-[#5E5950] leading-relaxed">
            Advancing sustainable fashion advocacy across the African diaspora. Exhibited at the Museum at FIT in NYC and selected for British Council Creative DNA.
          </p>
        </motion.div>
      </div>

      {/* Sustainable Stance & Studio 18 Callout */}
      <div className="max-w-4xl mx-auto border-t border-[#DCD5C9] pt-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div>
          <span className="font-serif-heavy text-3xl uppercase text-[#C9473B] block">
            NOT ANOTHER DISPOSABLE.
          </span>
          <p className="font-satoshi text-sm text-[#5E5950] mt-2">
            Visit our physical atelier at Studio 18, Kilimani, Nairobi or browse current drops online.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => onNavigate('shop')}
            data-cursor="SHOP"
            className="px-7 py-3.5 bg-[#C9473B] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#b03c31] transition-colors rounded-full shadow-lg"
          >
            Explore Drops
          </button>
          <button
            onClick={() => onNavigate('locator')}
            data-cursor="VISIT"
            className="border border-[#DCD5C9] bg-[#FFFFFF] px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#141414] hover:border-[#C9473B] hover:text-[#C9473B] transition-colors rounded-full shadow-xs"
          >
            Store Locator
          </button>
        </div>
      </div>
    </div>
  );
};
