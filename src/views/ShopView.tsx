import React, { useState, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { ImageReveal } from '../components/ImageReveal';
import { ShoppingBag, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useCurrency, formatPrice } from '../contexts/CurrencyContext';

interface ShopViewProps {
  onSelectProduct: (productId: string) => void;
  initialCategory?: string;
}

const shopCardVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: (i % 8) * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const ShopView: React.FC<ShopViewProps> = ({
  onSelectProduct,
  initialCategory = 'all',
}) => {
  const { symbol, exchangeRate } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'menu_order' | 'price-asc' | 'price-desc' | 'latest'>('menu_order');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories = [
    { id: 'all', label: 'ALL PRODUCTS' },
    { id: 'men', label: 'MEN' },
    { id: 'women', label: 'WOMEN' },
    { id: 'unisex', label: 'UNISEX' },
    { id: 'accessories', label: 'ACCESSORIES' },
    { id: 'exclusive', label: 'EXCLUSIVE' },
    { id: 'uncategorized', label: 'UNCATEGORIZED' },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) =>
          p.category === selectedCategory ||
          p.categoryLabel.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, sortBy]);

  // Items per page
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="pt-24 sm:pt-28 pb-32 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1920px] mx-auto min-h-screen bg-[#EFEBE3] text-[#141414]">
      {/* Breadcrumbs Banner */}
      <div className="mb-6 flex items-center gap-2 text-xs font-satoshi uppercase tracking-widest text-[#6E685E] border-b border-[#DCD5C9] pb-4">
        <button
          onClick={() => window.location.hash = 'home'}
          className="hover:text-[#C9473B] transition-colors"
        >
          Home
        </button>
        <span className="text-[#C9473B] font-bold">/</span>
        <span className="text-[#141414] font-bold">Shop</span>
      </div>

      {/* Page Title & Category Bar */}
      <div className="mb-8 border-b border-[#DCD5C9] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <h1 className="font-serif-heavy text-[clamp(1.8rem,4.5vw,3.5rem)] uppercase tracking-tighter text-[#141414] leading-[0.95] break-words">
            Shop The Atelier
          </h1>
          <p className="font-satoshi text-xs sm:text-sm text-[#6E685E] max-w-md leading-relaxed font-medium">
            Browse Kenya's premier art-cycled streetwear drops, limited numbered garments, and custom atelier silhouettes.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar sm:flex-wrap">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 text-[11px] sm:text-xs font-satoshi font-bold tracking-[0.14em] uppercase transition-all whitespace-nowrap shrink-0 rounded-full shadow-xs ${
                  isActive
                    ? 'bg-[#C9473B] text-white shadow-md border border-[#C9473B]'
                    : 'bg-[#FFFFFF] border border-[#DCD5C9] text-[#141414] hover:text-[#C9473B] hover:border-[#C9473B]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Woo Results & Ordering Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-[#DCD5C9] pb-4">
        <span className="font-satoshi text-xs font-bold uppercase tracking-wider text-[#6E685E]">
          Showing 1–{paginatedProducts.length} of {filteredProducts.length} results
        </span>

        <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#DCD5C9] rounded-full px-4 py-1.5 shadow-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9473B]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-[#141414] text-[11px] sm:text-xs font-satoshi uppercase tracking-wider focus:outline-none cursor-pointer"
          >
            <option value="menu_order">Default sorting</option>
            <option value="latest">Sort by latest</option>
            <option value="price-asc">Sort by price: low to high</option>
            <option value="price-desc">Sort by price: high to low</option>
          </select>
        </div>
      </div>

      {/* 4-Column Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-3 border border-[#DCD5C9] bg-[#FFFFFF] p-8 rounded-3xl shadow-xs">
          <p className="font-serif-heavy text-2xl uppercase opacity-60 text-[#141414]">No silhouettes matched</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {paginatedProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              variants={shopCardVariants}
              className="group bg-[#FFFFFF] border border-[#DCD5C9] rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div
                onClick={() => onSelectProduct(product.id)}
                className="aspect-3/4 overflow-hidden bg-[#FAF7F2] mb-4 relative cursor-pointer rounded-2xl group/media"
              >
                <ImageReveal
                  src={product.images[0]}
                  alt={product.name}
                  direction="up"
                  delay={(idx % 4) * 0.05}
                  containerClassName="w-full h-full"
                  className="transition-transform duration-700 ease-out group-hover/media:scale-105"
                  priority={idx < 2}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />

                {/* Corner Crosshairs */}
                <span className="absolute top-2 left-2 text-[8px] font-mono text-[#C9473B] leading-none pointer-events-none">+</span>
                <span className="absolute bottom-2 right-2 text-[8px] font-mono text-[#C9473B] leading-none pointer-events-none">+</span>

                {/* Hover Add to Bag Quick Trigger */}
                <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover/media:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product.id);
                    }}
                    className="w-full py-2.5 bg-[#C9473B] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg hover:bg-[#b03c31] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Select Options</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between flex-1 pt-1 font-satoshi">
                <div>
                  <span className="text-[10px] font-bold text-[#C9473B] uppercase tracking-widest block mb-1">
                    {product.categoryLabel}
                  </span>
                  <button
                    onClick={() => onSelectProduct(product.id)}
                    className="font-serif-heavy text-sm sm:text-base text-left text-[#141414] group-hover:text-[#C9473B] transition-colors leading-tight uppercase block break-words max-w-full"
                  >
                    {product.name}
                  </button>
                </div>

                <div className="mt-3 pt-2 border-t border-[#DCD5C9] flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-[#C9473B] tabular-nums">
                    {formatPrice(product.price, symbol, exchangeRate)}
                  </span>
                  <button
                    onClick={() => onSelectProduct(product.id)}
                    className="text-[10px] font-bold uppercase tracking-widest text-[#141414] hover:text-[#C9473B] transition-colors"
                  >
                    Inspect →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination Navigation */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, pIdx) => {
            const pageNum = pIdx + 1;
            const isCurrent = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => {
                  setCurrentPage(pageNum);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className={`w-10 h-10 rounded-full font-serif-heavy text-sm flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-[#C9473B] text-white shadow-md'
                    : 'bg-[#FFFFFF] border border-[#DCD5C9] text-[#141414] hover:border-[#C9473B] hover:text-[#C9473B]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {currentPage < totalPages && (
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#DCD5C9] text-[#141414] hover:border-[#C9473B] hover:text-[#C9473B] flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
