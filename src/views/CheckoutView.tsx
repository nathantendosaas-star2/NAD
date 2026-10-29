import React, { useState } from 'react';
import { CartItem, ShippingMethod, Order } from '../types';
import { SHIPPING_METHODS, COUNTRY_DISTRICTS } from '../data/products';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { CheckCircle2, ArrowLeft, Phone, CreditCard, Banknote, MessageCircle, Loader2 } from 'lucide-react';
import { useCurrency, formatPrice as globalFormatPrice } from '../contexts/CurrencyContext';

interface CheckoutViewProps {
  items: CartItem[];
  discountCode: string;
  discountRate: number;
  onClearCart: () => void;
  onNavigate: (view: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  discountCode,
  discountRate,
  onClearCart,
  onNavigate,
}) => {
  const { symbol, exchangeRate } = useCurrency();
  const formatPrice = (amount: number) => globalFormatPrice(amount, symbol, exchangeRate);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [district, setDistrict] = useState('Nairobi County');
  const [town, setTown] = useState('Kilimani');
  const [phone, setPhone] = useState('+254 700 000 000');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(SHIPPING_METHODS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'cod' | 'whatsapp'>('mpesa');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * discountRate;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const shippingFee = shippingMethod.price;
  const total = subtotalAfterDiscount + shippingFee;

  const handleCountryChange = (c: string) => {
    setCountry(c);
    const districts = COUNTRY_DISTRICTS[c] || [];
    setDistrict(districts[0] || '');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsProcessing(true);
    setProcessingMessage('Processing secure transaction...');
    
    setTimeout(() => {
      const newOrder: Order = {
        id: `NAD-${Math.floor(100000 + Math.random() * 900000)}`,
        customer: { email, fullName, streetAddress, city: town, district, country, phone },
        items: [...items],
        shippingMethod,
        subtotal,
        discount: discountAmount,
        tax: total * 0.16,
        shippingFee,
        total,
        paymentMethod,
        createdAt: new Date().toLocaleDateString(),
        status: 'confirmed',
      };
      setCompletedOrder(newOrder);
      setIsProcessing(false);
      onClearCart();
    }, 2000);
  };

  if (completedOrder) {
    return (
      <main className="flex-1 pt-32 pb-32 px-6 max-w-3xl mx-auto bg-[#EFEBE3]">
        <div className="bg-white border border-[#DCD5C9] p-12 rounded-3xl shadow-lg text-center space-y-6">
          <CheckCircle2 className="w-16 h-16 text-[#C9473B] mx-auto" />
          <h1 className="font-serif-heavy text-4xl uppercase">Order Confirmed</h1>
          <p className="text-sm text-[#5E5950]">Thank you, your order {completedOrder.id} has been placed.</p>
          <div className="pt-6 border-t border-[#DCD5C9] flex justify-between items-baseline font-serif-heavy">
            <span>Total Paid</span>
            <span className="text-2xl text-[#C9473B]">{formatPrice(completedOrder.total)}</span>
          </div>
          <button onClick={() => onNavigate('shop')} className="w-full py-4 bg-[#C9473B] text-white rounded-full font-bold uppercase tracking-widest">Return to Drops</button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-24 pb-28 px-4 sm:px-8 max-w-[1920px] mx-auto bg-[#EFEBE3]">
      <div className="mb-10">
        <button onClick={() => onNavigate('cart')} className="inline-flex items-center gap-2 text-[11px] font-bold uppercase text-[#C9473B] mb-4"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
        <h1 className="font-serif-heavy text-4xl sm:text-6xl text-[#C9473B] uppercase">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        <form onSubmit={handleSubmitOrder} className="flex-1 max-w-2xl space-y-10">
          <div className="space-y-4">
            <span className="font-serif-heavy text-sm uppercase text-[#C9473B] block">01. Details</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-white border border-[#DCD5C9] p-3 text-xs rounded-xl" />
            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="w-full bg-white border border-[#DCD5C9] p-3 text-xs rounded-xl" />
          </div>

          <div className="space-y-4">
            <span className="font-serif-heavy text-sm uppercase text-[#C9473B] block">02. Shipping</span>
            <select value={country} onChange={(e) => handleCountryChange(e.target.value)} className="w-full bg-white border border-[#DCD5C9] p-3 text-xs rounded-xl">
              {Object.keys(COUNTRY_DISTRICTS).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="text" required value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="Address" className="w-full bg-white border border-[#DCD5C9] p-3 text-xs rounded-xl" />
          </div>

          <div className="space-y-4">
            <span className="font-serif-heavy text-sm uppercase text-[#C9473B] block">03. Method</span>
            {SHIPPING_METHODS.map((method) => (
              <label key={method.id} className="flex items-center justify-between p-4 border border-[#DCD5C9] rounded-2xl cursor-pointer bg-white">
                <div className="flex items-center gap-3">
                  <input type="radio" checked={shippingMethod.id === method.id} onChange={() => setShippingMethod(method)} />
                  <span className="text-xs font-bold">{method.name}</span>
                </div>
                <span className="text-xs font-bold text-[#C9473B]">{method.price === 0 ? 'FREE' : formatPrice(method.price)}</span>
              </label>
            ))}
          </div>

          <button type="submit" disabled={isProcessing} className="w-full py-4 bg-[#C9473B] text-white font-bold uppercase tracking-[0.2em] rounded-full shadow-lg">
            {isProcessing ? 'Processing...' : `Complete Order — ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="lg:w-[420px]">
          <div className="sticky top-28 bg-white border border-[#DCD5C9] p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-serif-heavy text-2xl uppercase">Summary</h3>
            <div className="space-y-3 divide-y divide-[#DCD5C9]">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex justify-between text-xs font-satoshi">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span className="font-bold">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-[#DCD5C9] space-y-2 text-xs font-satoshi">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-bold">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between items-baseline pt-3 border-t border-[#DCD5C9] font-serif-heavy text-xl">
                <span>Total</span>
                <span className="text-2xl text-[#C9473B]">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};
