import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Product } from '../types';
import { useParallax } from '../hooks/useParallax';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { VerticalPinnedGallery } from '../components/VerticalPinnedGallery';
import { StaggeredTimelineGallery } from '../components/StaggeredTimelineGallery';
import { ImageReveal } from '../components/ImageReveal';
import { ArrowUpRight, ArrowRight, Check } from 'lucide-react';

interface ScrollLetterProps {
  char: string;
  charIndex: number;
  totalChars: number;
  progress: MotionValue<number>;
}

const ScrollLetter: React.FC<ScrollLetterProps> = ({
  char,
  charIndex,
  totalChars,
  progress,
}) => {
  // Map scroll progress across top 35% of hero scroll
  const start = (charIndex / totalChars) * 0.25;
  const end = Math.min(start + (1.5 / totalChars) * 0.25, 0.4);
  const scrollOpacity = useTransform(progress, [0, start, end], [0.35, 0.7, 1]);
  const scrollY = useTransform(progress, [0, start, end], [10, 4, 0]);

  return (
    <motion.span
      style={{ opacity: scrollOpacity, y: scrollY }}
      initial={{ opacity: 0, y: 22, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.55,
        delay: 0.12 + charIndex * 0.032,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      className="inline-block"
    >
      {char}
    </motion.span>
  );
};

interface ScrollHeadlineRevealProps {
  progress: MotionValue<number>;
}

export const ScrollHeadlineReveal: React.FC<ScrollHeadlineRevealProps> = ({ progress }) => {
  const words = ['NOT', 'ANOTHER', 'DISPOSABLE.'];
  let runningIndex = 0;
  const totalLetters = 21;

  return (
    <h1 className="font-serif-heavy text-[clamp(1.25rem,5.2vw,4.8rem)] text-[#C9473B] uppercase leading-[0.96] sm:leading-[0.92] tracking-tighter drop-shadow-xs break-words max-w-full flex flex-wrap gap-x-[0.22em]">
      {words.map((word, wIdx) => {
        const letters = word.split('');
        return (
          <span key={wIdx} className="inline-block whitespace-nowrap">
            {letters.map((char, lIdx) => {
              const charIndex = runningIndex++;
              return (
                <ScrollLetter
                  key={lIdx}
                  char={char}
                  charIndex={charIndex}
                  totalChars={totalLetters}
                  progress={progress}
                />
              );
            })}
          </span>
        );
      })}
    </h1>
  );
};

interface HomeViewProps {
  onSelectProduct: (productId: string) => void;
  onNavigate: (view: string, subSection?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectProduct,
  onNavigate,
}) => {
  // Activate controlled high-velocity immersive parallax
  useParallax({ maxTravel: 42, intensity: 1.0, scale: 1.08 });

  const heroSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end start'],
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSuccess(false);
    }, 3500);
  };

  const categories = [
    { id: 'men', label: 'MEN', count: 'Tailored Shirts & Outerwear', img: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&q=80&w=600' },
    { id: 'women', label: 'WOMEN', count: 'Kimono Silhouettes & Bodices', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600' },
    { id: 'exclusive', label: 'EXCLUSIVE', count: 'One-of-One Atelier Drops', img: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=600' },
    { id: 'unisex', label: 'UNISEX', count: 'Raw Selvedge Denim Cargos', img: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&q=80&w=600' },
    { id: 'accessories', label: 'ACCESSORIES', count: 'Canvas Totes & Distressed Hats', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600' },
    { id: 'uncategorized', label: 'UNCATEGORIZED', count: 'Studio Experimental Archives', img: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=600' },
  ];

  return (
    <div className="w-full bg-[#EFEBE3] text-[#141414] overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO PARALLAX SECTION                                                 */}
      {/* ========================================================================= */}
      <section
        ref={heroSectionRef}
        className="parallax-zone hero-zone relative w-full border-b border-[#DCD5C9]"
        data-parallax-scene
      >
        <div className="sticky-stage">
          {/* Layer 1: Atmospheric full-bleed photography with soft warm gradient scrim */}
          <div className="parallax-layer z-0" data-depth="-0.35">
            <ImageReveal
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=2000"
              alt="NAD Model in art-cycled pieces"
              containerClassName="w-full h-full"
              className="brightness-90 contrast-105"
            />
            {/* Scrim overlay softly blending to cream */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#EFEBE3] via-[#EFEBE3]/45 to-black/35 pointer-events-none" />
          </div>

          {/* Layer 2: Editorial Split Typography with fluid CSS clamp() */}
          <div
            className="parallax-layer z-20 flex flex-col justify-between p-4 sm:p-8 md:p-12 pb-6 sm:pb-8 max-w-[1920px] mx-auto w-full"
            data-depth="0.55"
          >
            {/* Top Subtitle tag & technical crosshair coordinates */}
            <div className="pt-16 sm:pt-20 md:pt-24 flex justify-between items-start">
              <span className="font-mono text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#C9473B] bg-white/90 px-3.5 py-1.5 inline-block backdrop-blur-xs border border-[#C9473B]/30 rounded-full shadow-xs">
                + STUDIO 18 · KILIMANI ATELIER · DROP 04
              </span>
            </div>

            {/* Main Center Headline: Scroll-triggered letter-by-letter reveal */}
            <div className="my-auto py-4 sm:py-6 max-w-full">
              <ScrollHeadlineReveal progress={scrollYProgress} />
              <p className="font-satoshi text-xs sm:text-sm md:text-base tracking-[0.16em] text-[#141414]/90 uppercase max-w-xl mt-3 sm:mt-4 font-semibold drop-shadow-xs leading-relaxed">
                Art-cycled Kenyan streetwear redefining sustainability.
              </p>
            </div>

            {/* Bottom Row inside Hero: Responsive Mobile & Tablet layout */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 w-full">
              {/* Rounded CTA Button */}
              <button
                onClick={() => onNavigate('shop')}
                data-cursor="EXPLORE"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#C9473B] text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#b03c31] transition-all rounded-full flex items-center justify-center gap-2 shadow-lg shrink-0"
              >
                <span>Explore Collection</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {/* Bottom Right: Rounded Boxed Panel + Dots + Rotating Badge */}
              <div className="flex items-center sm:items-end justify-between sm:justify-end gap-3 w-full sm:w-auto">
                {/* Decorative dots */}
                <div className="hidden sm:flex flex-col gap-1.5 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F7C2E8] shadow-xs" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C9473B] shadow-xs" />
                </div>

                {/* Boxed Info Panel with rounded corners */}
                <div className="border border-[#C9473B]/40 bg-[#FFFFFF]/90 backdrop-blur-xs text-[#141414] text-xs font-satoshi shadow-md rounded-2xl overflow-hidden flex-1 sm:flex-none sm:min-w-[240px]">
                  <div className="grid grid-cols-2 divide-x divide-[#C9473B]/30 border-b border-[#C9473B]/30">
                    <button
                      onClick={() => onNavigate('shop', 'women')}
                      className="p-2 sm:p-2.5 text-center hover:bg-[#C9473B]/10 transition-colors font-bold uppercase text-[9px] sm:text-[10px] tracking-wider text-[#C9473B]"
                    >
                      For her new in
                    </button>
                    <button
                      onClick={() => onNavigate('shop', 'exclusive')}
                      className="p-2 sm:p-2.5 text-center hover:bg-[#C9473B]/10 transition-colors font-bold uppercase text-[9px] sm:text-[10px] tracking-wider text-[#C9473B]"
                    >
                      Arrivals
                    </button>
                  </div>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="w-full py-2 px-3 text-center text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.16em] text-[#C9473B] hover:bg-[#C9473B] hover:text-[#FFFFFF] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View all products</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Rotating circular SCROLL badge */}
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 animate-spin-slow">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path
                        id="circlePathHeroLight"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        fill="none"
                      />
                      <text className="text-[10px] uppercase font-bold tracking-[0.28em] fill-[#C9473B]">
                        <textPath xlinkHref="#circlePathHeroLight">
                          · SCROLL · SCROLL ·
                        </textPath>
                      </text>
                    </svg>
                  </div>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#C9473B] text-white flex items-center justify-center shadow-md">
                    <ArrowRight className="w-3 h-3 rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Marquee strip directly attached below hero */}
      <div className="w-full overflow-hidden bg-[#FAF7F2] border-b border-[#DCD5C9] py-3 text-[#C9473B] select-none">
        <div className="animate-marquee font-serif-heavy text-xs sm:text-sm uppercase tracking-[0.25em] flex gap-8 whitespace-nowrap">
          <span>NAIROBI APPAREL DISTRICT · THE HEART OF ART AND UPCYCLING · STUDIO 18 KILIMANI · NOT ANOTHER DISPOSABLE</span>
          <span>NAIROBI APPAREL DISTRICT · THE HEART OF ART AND UPCYCLING · STUDIO 18 KILIMANI · NOT ANOTHER DISPOSABLE</span>
          <span>NAIROBI APPAREL DISTRICT · THE HEART OF ART AND UPCYCLING · STUDIO 18 KILIMANI · NOT ANOTHER DISPOSABLE</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ABOUT US BLOCK (VERBATIM PROSE WITH ARCHITECTURAL CROSSHAIRS)          */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 bg-[#FAF7F2] border-b border-[#DCD5C9] relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#C9473B] block mb-3"
          >
            + A BRAND DEFINED AS THE HEART OF ART AND UP-CYCLING +
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif-heavy text-3xl sm:text-5xl md:text-6xl text-[#141414] uppercase mb-6 sm:mb-8 leading-[1.05]"
          >
            The Heart of Art and Upcycling
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-satoshi text-sm sm:text-base md:text-lg text-[#5E5950] leading-[1.8] max-w-3xl mx-auto font-normal"
          >
            Nairobi Apparel District is a Kenyan streetwear brand known as ‘The Heart of Art and Upcycling.’ We emphasize art, upcycling, recycling, and the use of sustainable fabrics. We take pride in our exclusive Kenyan designs and customer-tailored products, while also committing to reducing the environmental impact of the fast fashion industry by promoting sustainable practices in fashion. Our vision is to be a leading voice in advocacy, cultural influence, and awareness creation through art and fashion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 sm:mt-10"
          >
            <button
              onClick={() => onNavigate('about')}
              data-cursor="MANIFESTO"
              className="border border-[#C9473B] bg-[#FFFFFF] px-8 py-3 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#C9473B] hover:bg-[#C9473B] hover:text-white transition-all rounded-full shadow-sm"
            >
              [ Read Our Full Story → ]
            </button>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. VERTICAL PINNED RUNWAY (VERTICAL-ONLY MOTION ARCHIVE)                  */}
      {/* ========================================================================= */}
      <VerticalPinnedGallery
        onSelectProduct={onSelectProduct}
        onNavigate={onNavigate}
      />

      {/* ========================================================================= */}
      {/* 4. STAGGERED MULTI-SPEED TIMELINE GALLERY (DIRECT VIDEO REPLICATION)     */}
      {/* ========================================================================= */}
      <StaggeredTimelineGallery
        onSelectProduct={onSelectProduct}
      />

      {/* ========================================================================= */}
      {/* 5. SHOP-BY-SECTION TILES                                                 */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1920px] mx-auto bg-[#EFEBE3] border-b border-[#DCD5C9]">
        <div className="mb-10 sm:mb-12 flex justify-between items-end border-b border-[#DCD5C9] pb-4">
          <div>
            <span className="font-mono text-xs text-[#C9473B] tracking-[0.25em] uppercase block mb-1">
              + 03 / TAXONOMY SECTIONS
            </span>
            <h2 className="font-serif-heavy text-3xl sm:text-5xl uppercase tracking-tight text-[#141414]">
              Shop by Section
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-mono uppercase text-[#C9473B] hover:underline transition-colors"
          >
            [ View All Drops → ]
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                delay: idx * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              onClick={() => onNavigate('shop', cat.id)}
              data-preview-img={cat.img}
              data-cursor-text={cat.label}
              className="bg-[#FFFFFF] border border-[#DCD5C9] p-4 text-left group flex flex-col justify-between h-56 hover:border-[#C9473B] hover:shadow-2xl transition-all relative rounded-[2rem] overflow-hidden"
            >
              <div className="w-full h-28 overflow-hidden bg-[#FAF7F2] rounded-2xl mb-2">
                <ImageReveal
                  src={cat.img}
                  alt={cat.label}
                  direction="up"
                  containerClassName="w-full h-full"
                />
              </div>
              <div className="flex flex-col justify-end flex-1">
                <div className="relative overflow-hidden h-10 sm:h-12 flex items-end">
                  <span
                    className={`font-serif-heavy uppercase text-[#C9473B] leading-none tracking-tighter group-hover:-translate-y-1 transition-transform duration-500 break-words max-w-full ${
                      cat.label.length > 10
                        ? 'text-[clamp(0.6rem,1.8vw,1.1rem)]'
                        : cat.label.length > 8
                        ? 'text-[clamp(0.7rem,2.2vw,1.3rem)]'
                        : 'text-[clamp(0.9rem,3vw,1.8rem)]'
                    }`}
                  >
                    {cat.label}
                  </span>
                </div>
                <span className="font-satoshi text-[9px] text-[#6E685E] uppercase tracking-widest mt-1 opacity-80 group-hover:text-[#141414] transition-colors">
                  {cat.count.split(' & ')[0]}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 7. NEWSLETTER CTA BAND (ROUNDED LUXURY CONTAINER)                        */}
      {/* ========================================================================= */}
    </div>
  );
};
