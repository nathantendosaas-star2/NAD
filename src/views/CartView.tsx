import React, { useState } from 'react';
import { CartItem } from '../types';
import { COUNTRY_DISTRICTS } from '../data/products';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Plus, Minus, ArrowRight, ShoppingBag, Check, RefreshCw } from 'lucide-react';
import { useCurrency, formatPrice as globalFormatPrice } from '../contexts/CurrencyContext';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onNavigate: (view: string, productId?: string) => void;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  discountRate: number;
  setDiscountRate: (rate: number) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
  discountCode,
  setDiscountCode,
  discountRate,
  setDiscountRate,
}) => {
  const { symbol, exchangeRate, currency } = useCurrency();
  const [shippingCountry, setShippingCountry] = useState<string>('Kenya');
  const [shippingDistrict, setShippingDistrict] = useState<string>('Nairobi County');
  const [shippingTown, setShippingTown] = useState<string>('Kilimani');
  const [isCalculatingShipping, setIsCalculatingShipping] = useState<boolean>(false);
  const [shippingCalculated, setShippingCalculated] = useState<boolean>(true);

  // Local helper for consistency
  const formatPrice = (amount: number) => globalFormatPrice(amount, symbol, exchangeRate);

  const [inputCode, setInputCode] = useState(discountCode);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * discountRate;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);

  const getComputedShippingFee = () => {
    if (subtotalAfterDiscount === 0) return 0;
    if (shippingCountry === 'Kenya') {
      return 500;
    }
    if (shippingCountry === 'Uganda' || shippingCountry === 'Tanzania' || shippingCountry === 'Rwanda') {
      return 2500; // Regional Delivery
    }
    return 4500;
  };

  const shippingFee = getComputedShippingFee();
  const grandTotal = subtotalAfterDiscount + shippingFee;

  const handleUpdateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculatingShipping(true);
    setTimeout(() => {
      setIsCalculatingShipping(false);
      setShippingCalculated(true);
    }, 400);
  };

  const handleCountryChange = (c: string) => {
    setShippingCountry(c);
    const districts = COUNTRY_DISTRICTS[c] || [];
    setShippingDistrict(districts[0] || '');
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCode.trim().toUpperCase();
    if (clean === 'NAD10' || clean === 'ARTCYCLE') {
      setDiscountCode(clean);
      setDiscountRate(0.1);
      setPromoMessage('10% Atelier discount applied!');
    } else if (clean === 'DISPOSABLE0') {
      setDiscountCode(clean);
      setDiscountRate(0.15);
      setPromoMessage('15% Sustainable advocate discount applied!');
    } else {
      setPromoMessage('Invalid voucher code.');
    }
  };

  if (items.length === 0) {
    return (
      <main className="flex-1 pt-32 pb-32 px-4 text-center bg-[#EFEBE3]">
        <div className="max-w-md mx-auto bg-white border border-[#DCD5C9] p-12 rounded-3xl shadow-sm">
          <ShoppingBag className="w-12 h-12 text-[#C9473B] mx-auto mb-6" />
          <h1 className="font-serif-heavy text-3xl uppercase mb-3">Your Bag is Empty</h1>
          <button onClick={() => onNavigate('shop')} className="px-8 py-4 bg-[#C9473B] text-white text-xs font-bold uppercase tracking-widest rounded-full">
            Explore Drops
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-24 sm:pt-28 pb-28 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1920px] mx-auto w-full bg-[#EFEBE3] text-[#141414]">
      <div className="flex flex-col sm:flex-row justify-between items-baseline border-b border-[#DCD5C9] pb-6 mb-10">
        <h1 className="font-serif-heavy text-4xl md:text-5xl uppercase tracking-tight">Shopping Bag</h1>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6E685E]">
          Detected Currency: <span className="text-[#C9473B] bg-white px-3 py-1 rounded-full border border-[#C9473B]/20">{currency}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        <div className="lg:w-[62%]">
          <div className="flex justify-between py-3 border-b border-[#DCD5C9] mb-4 font-satoshi text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9473B]">
            <span>Product</span>
            <div className="hidden md:flex space-x-20">
              <span>Quantity</span>
              <span>Total</span>
            </div>
          </div>

          <div className="divide-y divide-[#DCD5C9]">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row items-center justify-between py-6 gap-6">
                <div className="flex items-start w-full md:w-auto">
                  <div onClick={() => onNavigate('product', item.product.id)} className="w-24 h-28 bg-white border border-[#DCD5C9] rounded-2xl overflow-hidden cursor-pointer">
                    <ImageWithFallback src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-6 flex-1 font-satoshi">
                    <button onClick={() => onNavigate('product', item.product.id)} className="block text-base font-bold text-left hover:text-[#C9473B]">{item.product.name}</button>
                    <div className="text-xs text-[#6E685E] mt-1 uppercase tracking-widest">Size: {item.size} · {item.color.name}</div>
                    <p className="text-xs font-bold md:hidden mt-2 text-[#C9473B]">{formatPrice(item.product.price * item.quantity)}</p>
                    <button onClick={() => onRemoveItem(item.id)} className="text-[10px] text-[#C9473B] uppercase font-bold tracking-widest mt-3">Remove</button>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto md:space-x-16">
                  <div className="flex items-center border border-[#DCD5C9] bg-white rounded-full overflow-hidden">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-2"><Minus className="w-3.5 h-3.5 text-[#C9473B]" /></button>
                    <span className="w-8 text-center font-bold text-xs tabular-nums">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-2"><Plus className="w-3.5 h-3.5 text-[#C9473B]" /></button>
                  </div>
                  <span className="hidden md:block font-bold text-sm tabular-nums text-right text-[#C9473B] min-w-[110px]">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-[38%]">
          <div className="sticky top-28 bg-white border border-[#DCD5C9] p-8 rounded-3xl shadow-sm">
            <h2 className="font-serif-heavy text-2xl uppercase border-b border-[#DCD5C9] pb-4 mb-6">Cart totals</h2>
            <div className="divide-y divide-[#DCD5C9] font-satoshi text-sm mb-6">
              <div className="py-3 flex justify-between items-center">
                <span className="font-bold text-[#6E685E]">Subtotal</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              {discountRate > 0 && (
                <div className="py-3 flex justify-between items-center text-emerald-700">
                  <span className="font-medium flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Coupon ({discountCode})</span>
                  <span className="font-bold">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="py-4 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[#6E685E]">Shipment</span>
                  <div className="text-right">
                    <span className="font-bold text-[#141414]">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                    <p className="text-[10px] text-[#6E685E] mt-0.5">{shippingCountry === 'Kenya' ? 'Regional Courier (3–5 Days)' : 'DHL Express International (4–7 Days)'}</p>
                  </div>
                </div>
                <div className="p-4 bg-[#FAF7F2] border border-[#DCD5C9] rounded-2xl space-y-3">
                  <form onSubmit={handleUpdateShipping} className="space-y-3">
                    <select value={shippingCountry} onChange={(e) => handleCountryChange(e.target.value)} className="w-full bg-white border border-[#DCD5C9] p-2 text-xs rounded-xl">
                      {Object.keys(COUNTRY_DISTRICTS).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button type="submit" className="w-full py-2.5 bg-[#C9473B] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xs">Update Totals</button>
                  </form>
                </div>
              </div>
              <div className="py-4 flex justify-between items-baseline border-t border-[#DCD5C9]">
                <span className="font-serif-heavy text-lg uppercase">Total</span>
                <span className="font-serif-heavy text-2xl md:text-3xl text-[#C9473B] font-bold">{formatPrice(grandTotal)}</span>
              </div>
            </div>
            <button onClick={() => onNavigate('checkout')} className="w-full bg-[#C9473B] text-white py-4 font-bold uppercase tracking-[0.2em] rounded-full shadow-lg flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
