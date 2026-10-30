import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { ImageReveal } from '../components/ImageReveal';
import {
  ArrowRight,
  MapPin,
  Phone,
  MessageSquare,
  Compass,
  Plus,
  RotateCcw,
  Scissors,
  Infinity,
  Truck,
  ShieldCheck,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { useCurrency, formatPrice } from '../contexts/CurrencyContext';

interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  productId: string;
  productName: string;
  price: number;
  description: string;
  category: 'jackets' | 'shirts' | 'exclusive';
  tag: string;
  badge?: string;
}

interface BorderlessCollectionCardProps {
  item: CollectionItem;
  idx: number;
  symbol: string;
  exchangeRate: number;
  onSelectProduct: (productId: string) => void;
}

const BorderlessCollectionCard: React.FC<BorderlessCollectionCardProps> = ({
  item,
  idx,
  symbol,
  exchangeRate,
  onSelectProduct,
}) => {
  return (
    <div
      onClick={() => onSelectProduct(item.productId)}
      className="shrink-0 w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] flex flex-col justify-between group select-none cursor-pointer"
    >
      {/* Frameless, Borderless Image Frame */}
      <div className="aspect-[3/4] overflow-hidden bg-[#FAF7F2] rounded-3xl relative mb-4 transition-transform duration-500 group-hover:-translate-y-1.5">
        <ImageReveal
          src={item.image}
          alt={item.title}
          direction="up"
          delay={idx * 0.03}
          containerClassName="w-full h-full"
          className="group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Floating Kicker Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#C9473B] px-3 py-1 rounded-full text-[9px] font-mono font-bold shadow-xs">
          {item.subtitle}
        </div>
      </div>

      {/* Unboxed Metadata & Title */}
      <div className="space-y-2 flex-1 flex flex-col justify-between px-1">
        <div>
          <h3 className="font-serif-heavy text-lg sm:text-2xl uppercase text-[#141414] leading-tight group-hover:text-[#C9473B] transition-colors">
            {item.title}
          </h3>
          <p className="font-satoshi text-xs sm:text-sm text-[#6E685E] mt-1.5 leading-relaxed font-medium line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="pt-3 border-t border-[#DCD5C9]/60 flex items-center justify-between mt-3">
          <div>
            <span className="font-satoshi text-[9px] font-bold text-[#6E685E] uppercase block">
              Featured Garment
            </span>
            <span className="font-satoshi text-xs sm:text-sm font-bold text-[#C9473B] tabular-nums">
              {formatPrice(item.price, symbol, exchangeRate)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(item.productId);
            }}
            className="px-4 py-2 bg-[#C9473B] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-[#b03c31] transition-all flex items-center gap-1.5 rounded-full shadow-xs shrink-0"
          >
            <span>Shop Look</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface CollectionViewProps {
  onSelectProduct: (productId: string) => void;
  onNavigate: (view: string) => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  onSelectProduct,
  onNavigate,
}) => {
  const { symbol, exchangeRate } = useCurrency();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'exclusive' | 'jackets' | 'shirts'>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Initialize Lenis Smooth Horizontal Kinetic Scroll Engine for Editorial Runway
  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      orientation: 'horizontal',
      gestureOrientation: 'both',
      smoothWheel: true,
      wheelMultiplier: 1.8,
      touchMultiplier: 2.2,
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    lenis.on('scroll', ({ progress }: { progress: number }) => {
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSuccess(false);
    }, 4000);
  };

  // Full Catalog items matching both designs
  const matrixProducts: CollectionItem[] = [
    {
      id: 'prod-1',
      title: 'NAD & Friends ft. Trauphe Crop Jacket',
      subtitle: 'LOOK 01 · COUTURE ARCHIVE',
      image: 'https://images.unsplash.com/photo-1547069687-b01db9659136?auto=format&fit=crop&q=85&w=1200',
      productId: 'nad-friends-ft-trauphe-crop-jacket',
      productName: 'NAD & FRIENDS FT. TRAUPHE CROP JACKET',
      price: 25000,
      category: 'jackets',
      tag: 'Collab Capsule',
      badge: '1 OF 20 HANDMADE',
      description: 'Collaborative art piece featuring Trauphe graphic embroidery on a tailored raw denim cropped canvas.',
    },
    {
      id: 'prod-2',
      title: 'NAD Monogram Military Crop Jacket',
      subtitle: 'LOOK 02 · KILIMANI ATELIER',
      image: 'https://images.unsplash.com/photo-1580644228275-2b826dbec5bf?auto=format&fit=crop&q=85&w=1200',
      productId: 'nad-monogram-military-crop-jacket',
      productName: 'NAD MONOGRAM MILITARY CROP JACKET',
      price: 20000,
      category: 'jackets',
      tag: 'Tactical Monogram',
      description: 'Womens cropped iteration of our signature Monogram Military Jacket with elasticated hem.',
    },
    {
      id: 'prod-3',
      title: 'NAD Monogram Military Jacket',
      subtitle: 'LOOK 08 · NUMBERED DROP',
      image: 'https://images.unsplash.com/photo-1580644228275-2b826dbec5bf?auto=format&fit=crop&q=85&w=1200',
      productId: 'monogram-military-jacket',
      productName: 'NAD MONOGRAM MILITARY JACKET',
      price: 20000,
      category: 'exclusive',
      tag: 'Unisex Icon',
      description: 'Flagship military silhouette cut from East African organic cotton drills and reclaimed raw denim seams.',
    },
    {
      id: 'prod-4',
      title: 'NAD & Friends Black Crop Jacket',
      subtitle: 'LOOK 04 · TACTICAL CAPSULE',
      image: 'https://images.unsplash.com/photo-1567934859879-9addfb1e07f8?auto=format&fit=crop&q=85&w=1200',
      productId: 'nad-friends-black-crop-jacket',
      productName: 'NAD & FRIENDS BLACK CROP JACKET',
      price: 25000,
      category: 'jackets',
      tag: 'Exclusive Edit',
      description: 'Structured boxy fit with dropped shoulders and raw hem detailing crafted from black selvedge denim.',
    },
    {
      id: 'prod-5',
      title: 'NAD & Friends Black Sleeveless Jacket',
      subtitle: 'LOOK 06 · STUDIO 18 VEST',
      image: 'https://images.unsplash.com/photo-1580644228275-2b826dbec5bf?auto=format&fit=crop&q=85&w=1200',
      productId: 'nad-friends-black-sleeveless-jacket',
      productName: 'NAD & FRIENDS BLACK SLEEVELESS JACKET',
      price: 8500,
      category: 'exclusive',
      tag: 'Modular Vest',
      description: 'Tactical raw denim vest with utility cargo pockets, D-ring accents, and signature NAD embroidery.',
    },
    {
      id: 'prod-6',
      title: 'NAD Swahili Embroidered Crop Shirt',
      subtitle: 'LOOK 03 · COASTAL EMBROIDERED',
      image: 'https://images.unsplash.com/photo-1608147152875-b0eb0c53d491?auto=format&fit=crop&q=85&w=1200',
      productId: 'embroidered-swahili-shirt',
      productName: 'NAD SWAHILI EMBROIDERED CROP SHIRT',
      price: 7500,
      category: 'shirts',
      tag: 'Cultural Script',
      description: 'Heavyweight organic linen shirt adorned with Swahili geometric border stitching.',
    },
  ];

  const filteredProducts = matrixProducts.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'exclusive') return item.category === 'exclusive' || item.badge !== undefined;
    return item.category === activeFilter;
  });

  return (
    <div className="pt-24 sm:pt-28 pb-28 bg-[#EFEBE3] text-[#141414] min-h-screen">
      {/* ========================================================================= */}
      {/* SECTION 1: MINIMAL AMBIENT HERO SECTION                                   */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#EFEBE3] py-12 lg:py-24 border-b border-[#DCD5C9]">
        {/* Atmospheric Ambient Glows */}
        <div className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-[#C9473B]/10 blur-[130px]" />
        <div className="pointer-events-none absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-[#F7C2E8]/20 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
          {/* Minimalist Ticker Pill */}
          <div className="inline-flex items-center gap-2 bg-[#FFFFFF]/90 backdrop-blur-xl px-4 py-1.5 rounded-full mb-6 border border-[#DCD5C9] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#C9473B] animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs uppercase text-[#C9473B] tracking-widest font-bold">
              Worldwide Shipping · Sustainable Handcrafted Fashion
            </span>
          </div>

          {/* Hero Typography & Editorial Stance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#C9473B] block">
                [ ARCHIVAL REVISION 2025 ]
              </span>
              <h1 className="font-serif-heavy text-4xl sm:text-6xl lg:text-7xl uppercase text-[#141414] tracking-tighter leading-none">
                NOT ANOTHER<br />
                <span className="text-[#C9473B]">DISPOSABLE.</span>
              </h1>
              <p className="font-satoshi text-sm sm:text-base md:text-lg text-[#5E5950] max-w-xl font-normal leading-relaxed pt-2">
                Art-cycled Kenyan streetwear. Built to outlive trends through conscious tailoring, upcycled military canvas, and refined metropolitan utility.
              </p>
            </div>

            {/* Technical Spec Pill & CTA Trigger */}
            <div className="lg:col-span-4 flex flex-col gap-4 lg:items-end">
              <div className="w-full sm:w-80 bg-[#FFFFFF] p-5 rounded-2xl border border-[#DCD5C9] shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 border-b border-[#DCD5C9] pb-2">
                  <span className="font-serif-heavy text-lg text-[#141414] uppercase">Edition 04</span>
                  <span className="font-mono text-[9px] uppercase bg-[#C9473B]/10 text-[#C9473B] px-2.5 py-0.5 rounded-full font-bold">
                    RAW RUN
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-[#5E5950]">
                  <div>
                    <span className="block text-[#6E685E] text-[9px]">CMYK</span>
                    <span className="font-bold text-[#141414]">27, 14, 0, 14</span>
                  </div>
                  <div>
                    <span className="block text-[#6E685E] text-[9px]">RGB</span>
                    <span className="font-bold text-[#141414]">160, 189, 219</span>
                  </div>
                  <div>
                    <span className="block text-[#6E685E] text-[9px]">HEX</span>
                    <span className="font-bold text-[#C9473B]">#A0BDDB</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href="#curated-matrix"
                  className="flex-1 sm:flex-none text-center bg-[#C9473B] hover:bg-[#b03c31] text-white font-mono text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-full transition-all shadow-md"
                >
                  Shop Matrix
                </a>
                <a
                  href="#editorial-runway"
                  className="flex-1 sm:flex-none text-center bg-[#FFFFFF] border border-[#DCD5C9] hover:border-[#C9473B] hover:text-[#C9473B] text-[#141414] font-mono text-xs font-bold uppercase tracking-widest px-5 py-3.5 rounded-full transition-all shadow-xs"
                >
                  Runway
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: CURATED GARMENT MATRIX & FILTER PILLS                         */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#FAF7F2] py-16 sm:py-24 border-b border-[#DCD5C9]" id="curated-matrix">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
          {/* Section Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#C9473B] block mb-1 font-bold">
                01 / CATALOGUE RELEASE
              </span>
              <h2 className="font-serif-heavy text-2xl sm:text-4xl uppercase text-[#141414]">
                Curated Garment Matrix
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`font-mono text-xs uppercase px-4 py-2 rounded-full transition-all font-bold ${
                  activeFilter === 'all'
                    ? 'bg-[#C9473B] text-white shadow-md border border-[#C9473B]'
                    : 'bg-[#FFFFFF] border border-[#DCD5C9] text-[#141414] hover:text-[#C9473B] hover:border-[#C9473B]'
                }`}
              >
                All Works
              </button>
              <button
                onClick={() => setActiveFilter('exclusive')}
                className={`font-mono text-xs uppercase px-4 py-2 rounded-full transition-all font-bold ${
                  activeFilter === 'exclusive'
                    ? 'bg-[#C9473B] text-white shadow-md border border-[#C9473B]'
                    : 'bg-[#FFFFFF] border border-[#DCD5C9] text-[#141414] hover:text-[#C9473B] hover:border-[#C9473B]'
                }`}
              >
                Exclusive
              </button>
              <button
                onClick={() => setActiveFilter('jackets')}
                className={`font-mono text-xs uppercase px-4 py-2 rounded-full transition-all font-bold ${
                  activeFilter === 'jackets'
                    ? 'bg-[#C9473B] text-white shadow-md border border-[#C9473B]'
                    : 'bg-[#FFFFFF] border border-[#DCD5C9] text-[#141414] hover:text-[#C9473B] hover:border-[#C9473B]'
                }`}
              >
                Jackets
              </button>
              <button
                onClick={() => setActiveFilter('shirts')}
                className={`font-mono text-xs uppercase px-4 py-2 rounded-full transition-all font-bold ${
                  activeFilter === 'shirts'
                    ? 'bg-[#C9473B] text-white shadow-md border border-[#C9473B]'
                    : 'bg-[#FFFFFF] border border-[#DCD5C9] text-[#141414] hover:text-[#C9473B] hover:border-[#C9473B]'
                }`}
              >
                Shirts
              </button>
            </div>
          </div>

          {/* 6-Product Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((prod) => (
                <motion.article
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => onSelectProduct(prod.productId)}
                  className="group flex flex-col bg-[#FFFFFF] border border-[#DCD5C9] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF7F2]">
                    <ImageReveal
                      src={prod.image}
                      alt={prod.title}
                      direction="up"
                      containerClassName="w-full h-full"
                      className="group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#FFFFFF]/90 backdrop-blur-md font-mono text-[9px] uppercase text-[#C9473B] border border-[#DCD5C9] px-3 py-1 rounded-full font-bold shadow-xs">
                        {prod.tag}
                      </span>
                    </div>
                    {prod.badge && (
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-[#C9473B] font-mono text-[9px] text-white px-2.5 py-1 rounded font-bold shadow-xs">
                          {prod.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                    <div>
                      <h3 className="font-serif-heavy text-lg uppercase text-[#141414] leading-snug group-hover:text-[#C9473B] transition-colors">
                        {prod.title}
                      </h3>
                      <p className="font-mono text-[10px] uppercase text-[#6E685E] mt-1 tracking-wider">
                        {prod.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#DCD5C9] bg-[#FAF7F2]/50 -mx-5 -mb-5 p-5">
                      <span className="font-satoshi text-base font-bold text-[#C9473B] tabular-nums">
                        {formatPrice(prod.price, symbol, exchangeRate)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(prod.productId);
                        }}
                        className="bg-[#C9473B] text-white hover:bg-[#b03c31] font-mono text-xs font-bold uppercase px-4 py-2 rounded-lg transition-all flex items-center gap-1 shrink-0 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Reserve</span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: EDITORIAL SPLIT MANIFESTO BLOCK                                */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#EFEBE3] py-16 sm:py-28 overflow-hidden border-b border-[#DCD5C9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Visual Framing Plinth */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-[#FFFFFF] border border-[#DCD5C9]">
                <ImageReveal
                  src="https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=1000"
                  alt="Kenyan garment artisans hand-stitching raw denim"
                  containerClassName="w-full h-full"
                  className="brightness-95 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#EFEBE3]/80 via-transparent to-transparent pointer-events-none" />

                {/* Frosted Technical Overlay Chip */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#FFFFFF]/90 backdrop-blur-xl p-4 rounded-xl border border-[#DCD5C9] shadow-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-serif-heavy text-base uppercase text-[#141414]">Atelier Crimson</span>
                    <span className="font-mono text-xs text-[#C9473B] font-bold">#C9473B</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[9px] text-[#6E685E] uppercase tracking-wider font-bold">
                    <span>CIRCULAR SYSTEM V.2</span>
                    <span>NAIROBI ATELIER</span>
                  </div>
                </div>
              </div>

              {/* Asymmetric Accent Plinth */}
              <div className="hidden sm:block absolute -bottom-6 -right-6 bg-[#FAF7F2] text-[#141414] p-5 rounded-2xl shadow-xl max-w-xs border border-[#DCD5C9]">
                <p className="font-mono text-xs uppercase tracking-wider font-bold mb-1 text-[#C9473B]">
                  ZERO DEADSTOCK DISCARD
                </p>
                <p className="font-satoshi text-xs leading-relaxed font-medium text-[#5E5950]">
                  100% of scrap leather and vintage military surplus repurposed into functional capsule garments.
                </p>
              </div>
            </div>

            {/* Right Content Block */}
            <div className="lg:col-span-7 lg:pl-6 space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#C9473B] block mb-1 font-bold">
                  02 / THE MANIFESTO
                </span>
                <h2 className="font-serif-heavy text-3xl sm:text-5xl uppercase text-[#141414] tracking-tight leading-tight">
                  The Heart of Art & Upcycling.
                </h2>
                <p className="font-satoshi text-sm sm:text-base md:text-lg text-[#5E5950] leading-relaxed font-normal mt-4">
                  Nairobi Apparel District is a Kenyan streetwear house built to challenge disposable hyper-consumerism. We intercept discarded textiles, post-consumer leathers, and military surplus—transforming them into collectible, customer-tailored armor for the modern metropolis.
                </p>
              </div>

              {/* 3 Minimalist Value Pillars Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#FFFFFF] border border-[#DCD5C9] p-4 rounded-2xl space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#DCD5C9] flex items-center justify-center text-[#C9473B] mb-2">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif-heavy text-sm uppercase text-[#141414]">Upcycled Materials</h3>
                  <p className="font-satoshi text-xs text-[#5E5950] leading-relaxed">
                    Repurposing local vintage leather, military canvas, and organic off-cuts into structured streetwear.
                  </p>
                </div>

                <div className="bg-[#FFFFFF] border border-[#DCD5C9] p-4 rounded-2xl space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#DCD5C9] flex items-center justify-center text-[#C9473B] mb-2">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif-heavy text-sm uppercase text-[#141414]">Artisan Tailored</h3>
                  <p className="font-satoshi text-xs text-[#5E5950] leading-relaxed">
                    Hand-cut and precision assembled by master tailors in Nairobi with numbered run certifications.
                  </p>
                </div>

                <div className="bg-[#FFFFFF] border border-[#DCD5C9] p-4 rounded-2xl space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#DCD5C9] flex items-center justify-center text-[#C9473B] mb-2">
                    <Infinity className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif-heavy text-sm uppercase text-[#141414]">Zero Waste Mindset</h3>
                  <p className="font-satoshi text-xs text-[#5E5950] leading-relaxed">
                    Designed to age gracefully with lifelong repair protocols, actively combatting fast-fashion landfill dumps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: EDITORIAL RUNWAY GALLERY                                       */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#EFEBE3] text-[#141414] border-b border-[#DCD5C9]" id="editorial-runway">
        <div className="px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1920px] mx-auto w-full mb-8">
          <div className="flex items-center gap-2 text-xs font-satoshi uppercase tracking-widest text-[#6E685E] border-b border-[#DCD5C9] pb-3 mb-6">
            <button onClick={() => onNavigate('home')} className="hover:text-[#C9473B] transition-colors">
              Home
            </button>
            <span className="text-[#C9473B] font-bold">/</span>
            <span className="text-[#141414] font-bold">Editorial Runway</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DCD5C9] pb-6">
            <div>
              <span className="font-mono text-[10px] sm:text-xs text-[#C9473B] tracking-[0.3em] uppercase block mb-1 font-bold">
                + EDITORIAL RUNWAY · LOOKBOOK 2025/2026
              </span>
              <h2 className="font-serif-heavy text-[clamp(1.8rem,4.5vw,3.5rem)] uppercase tracking-tighter text-[#141414] leading-[0.95] break-words">
                The Lookbook Runway
              </h2>
            </div>

            {/* Rotating SCROLL Stamp Badge */}
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center">
                <div
                  className="absolute inset-0 transition-transform duration-75"
                  style={{ transform: `rotate(${scrollProgress * 540}deg)` }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      id="circlePathCollectionRunway"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="none"
                    />
                    <text className="text-[9px] uppercase font-bold tracking-[0.28em] fill-[#C9473B]">
                      <textPath xlinkHref="#circlePathCollectionRunway">
                        · SCROLL · SCROLL · SCROLL ·
                      </textPath>
                    </text>
                  </svg>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#C9473B] text-white flex items-center justify-center shadow-md">
                  <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lenis Smooth Horizontal Runway Wrapper (Borderless Cards) */}
        <div
          ref={wrapperRef}
          className="w-full overflow-x-auto overflow-y-hidden my-auto py-2 relative z-10 no-scrollbar px-4 sm:px-8 md:px-12"
        >
          <div
            ref={contentRef}
            className="flex gap-6 sm:gap-10 items-stretch w-max pr-12 sm:pr-24"
          >
            {matrixProducts.map((item, idx) => (
              <BorderlessCollectionCard
                key={item.id}
                item={item}
                idx={idx}
                symbol={symbol}
                exchangeRate={exchangeRate}
                onSelectProduct={onSelectProduct}
              />
            ))}

            {/* Final Slide: Studio 18 Invitation Card */}
            <div className="shrink-0 w-[290px] sm:w-[380px] md:w-[420px] bg-[#FFFFFF] text-[#141414] rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden border border-[#DCD5C9] select-none">
              <div className="space-y-4 relative z-10">
                <span className="font-mono text-xs text-[#C9473B] tracking-[0.25em] uppercase block font-bold">
                  + STUDIO 18 · NAIROBI
                </span>

                <h3 className="font-serif-heavy text-2xl sm:text-4xl uppercase leading-none text-[#141414]">
                  Come & say hello to us
                </h3>

                <div className="space-y-3 pt-2 font-satoshi text-xs text-[#5E5950]">
                  <div className="flex items-center gap-2.5 bg-[#FAF7F2] p-3 rounded-2xl border border-[#DCD5C9]">
                    <MapPin className="w-4 h-4 text-[#C9473B] shrink-0" />
                    <span>Kuona Trust Studio 18, Kilimani, Kenya</span>
                  </div>

                  <a
                    href="tel:+254794417210"
                    className="flex items-center gap-2.5 bg-[#FAF7F2] p-3 rounded-2xl border border-[#DCD5C9] hover:border-[#C9473B] transition-colors block"
                  >
                    <Phone className="w-4 h-4 text-[#C9473B] shrink-0" />
                    <span className="font-mono font-bold text-[#141414]">+254 794 417210</span>
                  </a>
                </div>
              </div>

              <div className="pt-6 relative z-10">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-3.5 bg-[#C9473B] text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#b03c31] transition-colors rounded-full shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Us A Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: NEWSLETTER & BRAND BENEFITS STRIP                             */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#FAF7F2] py-16 sm:py-24 border-t border-[#DCD5C9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 space-y-16">
          {/* Minimalist Newsletter Box */}
          <div className="bg-[#FFFFFF] p-8 lg:p-12 rounded-3xl relative overflow-hidden border border-[#DCD5C9] shadow-xs">
            <div className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#C9473B]/5 blur-[100px]" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#C9473B] block font-bold">
                  ATELIER INSIDER ACCESS
                </span>
                <h2 className="font-serif-heavy text-2xl sm:text-4xl uppercase text-[#141414] leading-tight">
                  Subscribe and receive 10% off your next purchase.
                </h2>
                <p className="font-satoshi text-sm text-[#5E5950] max-w-lg">
                  Receive secret archive invitations, drop coordinates, and custom fitting reservations before global releases.
                </p>
              </div>

              <div className="lg:col-span-5">
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="YOUR EMAIL PROTOCOL"
                    required
                    className="flex-1 bg-[#FAF7F2] text-[#141414] placeholder:text-[#6E685E] font-mono text-xs px-4 py-3.5 rounded-xl border border-[#DCD5C9] focus:outline-none focus:border-[#C9473B] transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#C9473B] hover:bg-[#b03c31] text-white font-mono text-xs font-bold uppercase px-6 py-3.5 rounded-xl transition-all shadow-md whitespace-nowrap"
                  >
                    Join District
                  </button>
                </form>

                {newsletterSuccess && (
                  <p className="font-mono text-xs text-[#C9473B] mt-2 font-bold">
                    ✓ Address logged into Atelier protocol. Check your signal.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Minimalist Benefits Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-[#DCD5C9]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#C9473B] border border-[#DCD5C9]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-mono text-xs font-bold uppercase text-[#141414]">Free Delivery</h4>
                <p className="font-satoshi text-[11px] text-[#5E5950]">Orders over $100 worldwide</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#C9473B] border border-[#DCD5C9]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-mono text-xs font-bold uppercase text-[#141414]">7 Month Warranty</h4>
                <p className="font-satoshi text-[11px] text-[#5E5950]">Complimentary seam repairs</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#C9473B] border border-[#DCD5C9]">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-mono text-xs font-bold uppercase text-[#141414]">Worldwide Tracked</h4>
                <p className="font-satoshi text-[11px] text-[#5E5950]">DHL Express priority logistics</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#C9473B] border border-[#DCD5C9]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-mono text-xs font-bold uppercase text-[#141414]">Effortless Exchange</h4>
                <p className="font-satoshi text-[11px] text-[#5E5950]">14-day archival exchange</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
