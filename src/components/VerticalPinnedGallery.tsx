import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ImageReveal } from './ImageReveal';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCurrency, formatPrice } from '../contexts/CurrencyContext';

interface VerticalPinnedGalleryProps {
  onSelectProduct: (productId: string) => void;
  onNavigate: (view: string) => void;
}

export const VerticalPinnedGallery: React.FC<VerticalPinnedGalleryProps> = ({
  onSelectProduct,
  onNavigate,
}) => {
  const { symbol, exchangeRate } = useCurrency();
  const containerRef = useRef<HTMLDivElement>(null);
  const curatedPieces = PRODUCTS.slice(0, 5);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [percentage, setPercentage] = useState(0);
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => setPercentage(Math.round(v * 100)));
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#EFEBE3] border-y border-[#DCD5C9]"
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-24">
        {/* Header Ribbon */}
        <div className="sticky top-24 z-30 flex items-center justify-between border-b border-[#DCD5C9] pb-8 mb-16 bg-[#EFEBE3]/80 backdrop-blur-md pt-4">
          <div className="flex flex-col gap-1">
            <span className="text-[#C9473B] font-mono text-[10px] tracking-[0.3em] font-bold uppercase">+ 01 / VERTICAL ARCHIVE</span>
            <h2 className="font-serif-heavy text-3xl sm:text-5xl uppercase tracking-tight text-[#141414]">
              Editorial Runway
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="font-satoshi text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E685E] block">
                ATELIER PROGRESS
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 sm:w-24 h-1 bg-[#DCD5C9] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#C9473B] transition-all duration-150"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="font-mono text-xl text-[#C9473B] font-bold tabular-nums">
                  {percentage}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Stacking Track */}
        <div className="space-y-32 sm:space-y-48 mt-24">
          {curatedPieces.map((product, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={product.id}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 lg:gap-24`}
              >
                <div className="w-full md:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => onSelectProduct(product.id)}
                    className="group cursor-pointer relative bg-white border border-[#DCD5C9] p-4 sm:p-6 transition-all duration-500 hover:border-[#C9473B] rounded-[2.5rem] shadow-xs hover:shadow-2xl overflow-hidden"
                  >
                    <div className="aspect-3/4 overflow-hidden bg-[#FAF7F2] relative rounded-3xl">
                      <ImageReveal 
                        src={product.images[0]} 
                        alt={product.name}
                        direction={isEven ? 'left' : 'right'}
                        containerClassName="w-full h-full"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full md:w-1/2 space-y-6"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-[#C9473B] block font-bold">
                      {product.categoryLabel}
                    </span>
                    <h3 className="font-serif-heavy text-[clamp(1.4rem,4vw,3.2rem)] uppercase leading-[0.95] text-[#141414] tracking-tighter break-words max-w-full">
                      {product.name}
                    </h3>
                  </div>
                  <p className="font-satoshi text-xs sm:text-sm md:text-base text-[#6E685E] leading-relaxed max-w-md font-medium">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-8 pt-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#C9473B]/60">Price</span>
                      <span className="font-serif-heavy text-xl sm:text-2xl text-[#C9473B] tabular-nums font-bold">
                        {formatPrice(product.price, symbol, exchangeRate, false)}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectProduct(product.id)}
                      className="flex items-center gap-2 text-xs font-satoshi font-bold uppercase tracking-[0.2em] text-[#141414] hover:text-[#C9473B] transition-colors"
                    >
                      <span>Inspect Piece</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
