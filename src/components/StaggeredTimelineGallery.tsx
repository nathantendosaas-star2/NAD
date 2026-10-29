import React, { useRef, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { ImageWithFallback } from './ImageWithFallback';
import { ImageReveal } from './ImageReveal';
import { useCurrency, formatPrice } from '../contexts/CurrencyContext';

interface StaggeredTimelineGalleryProps {
  onSelectProduct: (productId: string) => void;
}

export const StaggeredTimelineGallery: React.FC<StaggeredTimelineGalleryProps> = ({
  onSelectProduct,
}) => {
  const { symbol, exchangeRate } = useCurrency();
  const sectionRef = useRef<HTMLDivElement>(null);
  const colLeftRef = useRef<HTMLDivElement>(null);
  const colCenterRef = useRef<HTMLDivElement>(null);
  const colRightRef = useRef<HTMLDivElement>(null);

  // Group products into 3 staggered columns
  const colLeftProducts = [PRODUCTS[0], PRODUCTS[3]];
  const colCenterProducts = [PRODUCTS[1], PRODUCTS[4]];
  const colRightProducts = [PRODUCTS[2], PRODUCTS[5]];

  const timelineYears = [
    { year: '2021', label: 'Inception & Studio 18 Foundation' },
    { year: '2022', label: 'Selvedge Upcycling Experiments' },
    { year: '2023', label: 'British Council Creative DNA' },
    { year: '2024', label: 'Museum at FIT NYC Exhibition' },
    { year: '2025', label: 'Drop 04 · Not Another Disposable' },
    { year: '2026', label: 'Global Atelier Release' },
  ];

  useEffect(() => {
    let frameId: number;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewportHeight) return;

      const totalDist = viewportHeight + rect.height;
      const progress = (viewportHeight - rect.top) / totalDist - 0.5;

      if (colLeftRef.current) colLeftRef.current.style.transform = `translate3d(0, ${(-progress * 220).toFixed(2)}px, 0)`;
      if (colCenterRef.current) colCenterRef.current.style.transform = `translate3d(0, ${(progress * 80).toFixed(2)}px, 0)`;
      if (colRightRef.current) colRightRef.current.style.transform = `translate3d(0, ${(progress * 280).toFixed(2)}px, 0)`;
    };

    const scheduleScroll = () => { frameId = requestAnimationFrame(handleScroll); };
    window.addEventListener('scroll', scheduleScroll, { passive: true });
    scheduleScroll();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#EFEBE3] py-24 sm:py-32 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden border-b border-[#DCD5C9]">
      <div className="max-w-[1920px] mx-auto mb-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between border-b border-[#DCD5C9] pb-8 gap-6">
        <div>
          <span className="font-mono text-[10px] sm:text-xs text-[#C9473B] tracking-[0.3em] uppercase block mb-2 font-bold">+ 02 / ATELIER ARCHIVES</span>
          <h2 className="font-serif-heavy text-[clamp(1.5rem,4vw,3.2rem)] uppercase tracking-tight text-[#141414] break-words">Atelier Archives</h2>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto relative z-10 mb-12 flex justify-between items-center overflow-x-auto pb-4 no-scrollbar border-b border-[#DCD5C9]">
        {timelineYears.map((item) => (
          <div key={item.year} className="flex flex-col items-center px-4 shrink-0 group">
            <span className="font-serif-heavy text-xl sm:text-2xl text-[#141414] group-hover:text-[#C9473B] transition-colors">{item.year}</span>
            <span className="font-satoshi text-[9px] text-[#6E685E] tracking-wider uppercase mt-1 max-w-[120px] text-center line-clamp-1">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10 pt-8 pb-16">
        {[colLeftRef, colCenterRef, colRightRef].map((ref, colIdx) => {
          const products = [colLeftProducts, colCenterProducts, colRightProducts][colIdx];
          return (
            <div key={colIdx} ref={ref} className={`space-y-16 will-change-transform ${colIdx === 1 ? 'md:pt-16' : colIdx === 2 ? 'md:pt-32' : ''}`}>
              {products.map((product) => (
                <div key={product.id} onClick={() => onSelectProduct(product.id)} className="group cursor-pointer bg-white border border-[#DCD5C9] p-5 transition-all duration-500 hover:border-[#C9473B] relative rounded-3xl shadow-xs hover:shadow-lg">
                  <div className="aspect-3/4 overflow-hidden bg-[#FAF7F2] mb-4 relative rounded-2xl">
                    <ImageReveal 
                      src={product.images[0]} 
                      alt={product.name} 
                      direction="up"
                      containerClassName="w-full h-full"
                      className="transition-transform duration-700 group-hover:scale-105" 
                    />
                  </div>
                  <h3 className="font-serif-heavy text-xl uppercase text-[#141414] group-hover:text-[#C9473B] transition-colors">{product.name}</h3>
                  <div className="flex justify-between items-baseline mt-2 text-xs font-satoshi">
                    <span className="text-[#6E685E] uppercase font-medium">{product.categoryLabel}</span>
                    <span className="font-bold text-[#C9473B] tabular-nums">{formatPrice(product.price, symbol, exchangeRate)}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
};
