import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { MODELS, ModelItem } from '../data/models';
import {
  MapPin,
  Phone,
  MessageSquare,
  ArrowRight,
  Compass,
} from 'lucide-react';

interface CollectionViewProps {
  onSelectModel: (modelSlug: string) => void;
  onNavigate: (view: string) => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  onSelectModel,
  onNavigate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Motion scroll hook for smooth horizontal parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Transform scroll progress to horizontal translation percentage
  const rawXTransform = useTransform(smoothProgress, [0, 1], ['0%', '-80%']);
  const xTransform = shouldReduceMotion ? '0%' : rawXTransform;

  // Parallax transform speeds for different image layers
  const imageYParallax = useTransform(smoothProgress, [0, 1], ['0%', '-8%']);

  // Dynamic active model index tracking based on scroll
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (v) => {
      const idx = Math.min(MODELS.length - 1, Math.floor(v * MODELS.length));
      setActiveModelIndex(idx);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  const activeModel = MODELS[activeModelIndex] || MODELS[0];

  return (
    <div className="bg-[#FFFFFF] text-[#141414] min-h-screen selection:bg-[#C9473B] selection:text-white">
      {/* Scrollable Container Pinning Section */}
      <div ref={containerRef} className="relative h-[250vh] sm:h-[280vh] w-full">
        {/* Sticky Viewport Frame */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-20 pb-6 px-4 sm:px-8 md:px-12 bg-[#FFFFFF]">
          {/* Top Brand & Section Title Bar */}
          <div className="flex items-center justify-between border-b border-[#141414]/10 pb-4 mb-2 z-20">
            <div>
              <span className="font-mono text-[10px] sm:text-xs text-[#C9473B] tracking-[0.25em] uppercase font-bold block">
                + NAIROBI APPAREL DISTRICT
              </span>
              <h1 className="font-serif-heavy text-2xl sm:text-4xl uppercase text-[#141414] tracking-tighter">
                Collection
              </h1>
            </div>

            {/* Rotating Circular SCROLL Stamp Widget (From Reference 1) */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
              <motion.div
                className="absolute inset-0"
                style={{ rotate: useTransform(smoothProgress, [0, 1], [0, 720]) }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    id="collectionStampPath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9px] uppercase font-bold tracking-[0.28em] fill-[#7B7836]">
                    <textPath xlinkHref="#collectionStampPath">
                      · SCROLL · SCROLL · SCROLL ·
                    </textPath>
                  </text>
                </svg>
              </motion.div>
              <div className="w-8 h-8 rounded-full bg-[#7B7836] text-white flex items-center justify-center shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Horizontal Gallery Track */}
          <div className="flex-1 relative flex items-center overflow-hidden my-auto z-10">
            <motion.div
              ref={scrollTrackRef}
              style={{ x: xTransform }}
              className="flex items-center gap-8 sm:gap-12 md:gap-16 pr-24"
            >
              {MODELS.map((model, idx) => {
                // Different height ratios from Reference 1
                const heightRatios = ['53vh', '45vh', '48vh', '52vh', '44vh', '50vh', '46vh', '52vh', '48vh'];
                const cardHeight = heightRatios[idx % heightRatios.length];

                return (
                  <article
                    key={model.id}
                    onClick={() => onSelectModel(model.slug)}
                    className="shrink-0 w-[280px] sm:w-[340px] md:w-[380px] lg:w-[410px] flex flex-col justify-end group cursor-pointer select-none"
                    style={{ '--qode-bg-color': '#DADDD1' } as React.CSSProperties}
                  >
                    <div
                      className="w-full relative overflow-hidden rounded-lg bg-[#DADDD1] mb-3 transition-transform duration-500 group-hover:-translate-y-2 shadow-xs"
                      style={{ height: cardHeight }}
                    >
                      <motion.img
                        style={{ y: imageYParallax }}
                        src={model.mainImage}
                        alt={model.title}
                        loading={idx < 2 ? 'eager' : 'lazy'}
                        className="w-full h-[120%] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                  </article>
                );
              })}

            </motion.div>
          </div>

          {/* Active Model Title Display Box (Reference 1 Bottom Info Holder) */}
          <div className="py-2 border-t border-[#141414]/10 flex items-center justify-between z-20">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#6E685E] block font-bold">
                Active Selection ({activeModelIndex + 1} / {MODELS.length})
              </span>
              <h2 className="font-serif-heavy text-xl sm:text-2xl uppercase text-[#141414] leading-none mt-1">
                <button
                  onClick={() => onSelectModel(activeModel.slug)}
                  className="hover:text-[#C9473B] transition-colors flex items-center gap-2 text-left"
                >
                  <span>{activeModel.title}</span>
                  <ArrowRight className="w-4 h-4 text-[#C9473B]" />
                </button>
              </h2>
            </div>

            <button
              onClick={() => onSelectModel(activeModel.slug)}
              className="px-5 py-2.5 bg-[#C9473B] text-white hover:bg-[#b03c31] font-mono text-xs font-bold uppercase tracking-widest rounded-full transition-colors shadow-xs"
            >
              View Model Portfolio
            </button>
          </div>

          {/* Radio Tuner Graphic & Numeric Scale (Reference 1 SVG & Numeric Holder) */}
          <div className="w-full pt-2 z-20">
            {/* SVG Radio Tuner Lines */}
            <div className="w-full overflow-hidden opacity-40 mb-1">
              <svg className="w-full h-3 text-[#141414] fill-current" viewBox="0 0 1705 15 preserveAspectRatio='none'">
                <path d="M1705.7929,1V0H.7928V1H16.6464V7H.7928V8H43.6464v6H0v1H1705V14H1604.6464V8h101.1465V7H1567.6464V1ZM1511.6464,1V7h-81V1Zm-82,0V7h-217V1Zm-218,0V7h-51V1Zm-52,0V7h-61V1Zm-62,0V7h-116V1Zm-117,0V7h-44V1Zm-45,0V7h-61V1Zm-62,0V7h-91V1Zm-92,0V7h-50V1Zm-51,0V7h-127V1Zm-128,0V7h-67V1Zm-68,0V7h-11V1Zm-12,0V7h-48V1Zm-49,0V7h-143V1Zm-144,0V7h-64V1Zm-65,0V7h-4V1Zm-5,0V7h-46V1Zm-47,0V7h-144V1Zm-195,6V1h50V7h-50Zm27,7V8h51v6Zm52,0V8h189v6Zm190,0V8h71v6Zm72,0V8h212v6Zm213,0V8h63v6Zm64,0V8h36v6Zm37,0V8h33v6Zm34,0V8h46v6Zm47,0V8h55v6Zm56,0V8h95v6Zm96,0V8h49v6Zm50,0V8h50v6Zm51,0V8h171v6Zm172,0V8h59v6Zm60,0V8h300v6Zm365-6v6h-64V8Zm-37-1h-54V1h54Z" />
              </svg>
            </div>

            {/* Numeric Scale Bar (350 to 1050) */}
            <div className="flex justify-between items-center font-mono text-[9px] sm:text-[10px] text-[#6E685E] font-bold border-t border-[#141414]/20 pt-1">
              <span>350</span>
              <span>400</span>
              <span>450</span>
              <span>500</span>
              <span className="hidden sm:inline">550</span>
              <span className="hidden sm:inline">600</span>
              <span className="hidden sm:inline">650</span>
              <span className="hidden md:inline">700</span>
              <span className="hidden md:inline">750</span>
              <span className="hidden md:inline">800</span>
              <span className="hidden lg:inline">850</span>
              <span className="hidden lg:inline">900</span>
              <span className="hidden lg:inline">950</span>
              <span>1000</span>
              <span>1050</span>
            </div>

            {/* Scroll Indicator Marker */}
            <div className="relative w-full h-1 bg-[#DCD5C9] mt-2 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 bottom-0 bg-[#C9473B] rounded-full"
                style={{
                  left: useTransform(smoothProgress, [0, 1], ['0%', '90%']),
                  width: '10%',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
