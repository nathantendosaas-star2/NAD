import React, { useState } from 'react';
import { Product, ProductColor } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ImageReveal } from '../components/ImageReveal';
import { ArrowLeft, Check, ChevronDown, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCurrency, formatPrice } from '../contexts/CurrencyContext';

interface ProductDetailViewProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: ProductColor, quantity: number) => void;
  onBackToShop: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onAddToCart,
  onBackToShop,
}) => {
  const { symbol, exchangeRate } = useCurrency();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [notifyStock, setNotifyStock] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'materials' | 'provenance' | 'shipping' | null>(null);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleNotifyToggle = () => {
    setNotifyStock(!notifyStock);
    if (!notifyStock) {
      setNotifySuccess(true);
      setTimeout(() => setNotifySuccess(false), 3000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#EFEBE3] text-[#141414] pt-24 sm:pt-32">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          
          {/* Left Side: Product Imagery */}
          <div className="w-full lg:w-[55%] lg:sticky lg:top-32 space-y-6">
            <div className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[2/3] bg-white rounded-[2.5rem] overflow-hidden border border-[#DCD5C9] shadow-sm">
              <ImageReveal
                src={selectedImage}
                alt={product.name}
                direction="up"
                containerClassName="w-full h-full"
                className="object-contain p-4"
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 border overflow-hidden transition-all bg-[#FFFFFF] rounded-2xl ${
                      selectedImage === img
                        ? 'border-[#C9473B] scale-105 shadow-md'
                        : 'border-[#DCD5C9] opacity-70 hover:opacity-100 hover:border-[#C9473B]'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      wrapperClassName="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Product Details */}
          <div className="w-full lg:w-[45%] space-y-10 pb-24">
            <div className="space-y-6">
              <button
                onClick={onBackToShop}
                className="inline-flex items-center space-x-2 text-[11px] font-bold tracking-widest uppercase text-[#C9473B] hover:text-[#141414] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Shop</span>
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#C9473B] bg-white/80 px-3 py-1 rounded-full border border-[#C9473B]/30">
                    + IN STOCK / {product.stockCount} UNITS
                  </span>
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#6E685E]">
                    {product.categoryLabel}
                  </span>
                </div>
                <h1 className="font-serif-heavy text-[clamp(1.5rem,4.5vw,3.5rem)] uppercase leading-[0.95] text-[#141414] tracking-tighter break-words max-w-full">
                  {product.name}
                </h1>
                <p className="font-satoshi text-2xl md:text-3xl font-bold tabular-nums text-[#C9473B]">
                  {formatPrice(product.price, symbol, exchangeRate)}
                </p>
              </div>

              <div className="space-y-6 font-satoshi text-base sm:text-lg leading-relaxed text-[#5E5950] font-medium max-w-xl">
                {product.longDescription.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Selectors Module */}
            <div className="space-y-8 bg-white border border-[#DCD5C9] p-6 sm:p-8 rounded-[2.5rem] shadow-sm">
              <div className="space-y-4">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#6E685E]">
                  Select Silhouette Size
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 text-[12px] font-bold rounded-full border transition-all ${
                        selectedSize === size
                          ? 'bg-[#C9473B] text-white border-[#C9473B] shadow-md'
                          : 'bg-[#FAF7F2] border-[#DCD5C9] text-[#141414] hover:border-[#C9473B]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#6E685E] block">
                  Colorway: <span className="text-[#141414]">{selectedColor.name}</span>
                </span>
                <div className="flex gap-4">
                  {product.colors.map((color) => (
                    <button
                      key={color.code}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor.code === color.code
                          ? 'border-[#C9473B] scale-110 shadow-md'
                          : 'border-[#DCD5C9] hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#DCD5C9] bg-[#FAF7F2] px-5 py-3 rounded-full space-x-6">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-xl font-bold text-[#C9473B]">-</button>
                    <span className="font-bold text-sm tabular-nums">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-xl font-bold text-[#C9473B]">+</button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#C9473B] text-white font-bold text-sm uppercase tracking-widest py-4.5 rounded-full shadow-lg hover:bg-[#b03c31] transition-all flex items-center justify-center gap-2"
                  >
                    {addedToast ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <span>Add to Bag</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-4 pt-6">
              <AccordionItem
                title="Garment Specs & Care"
                isOpen={openAccordion === 'materials'}
                onClick={() => setOpenAccordion(openAccordion === 'materials' ? null : 'materials')}
              >
                <div className="space-y-3 font-satoshi text-sm text-[#5E5950] leading-relaxed">
                  <p><strong>Art-cycled:</strong> {product.materials}</p>
                  <p><strong>Care:</strong> {product.care}</p>
                  <p><strong>Dispatch:</strong> Tracked shipping from Kilimani, Nairobi.</p>
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccordionItem = ({ title, children, isOpen, onClick }: { title: string, children: React.ReactNode, isOpen: boolean, onClick: () => void }) => (
  <div className="border-b border-[#DCD5C9]">
    <button
      onClick={onClick}
      className="w-full py-5 flex justify-between items-center text-left font-serif-heavy text-lg uppercase tracking-tight text-[#141414] hover:text-[#C9473B] transition-colors"
    >
      <span>{title}</span>
      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
      {children}
    </div>
  </div>
);
