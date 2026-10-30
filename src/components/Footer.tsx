import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="bg-[#E8E2D8] text-[#141414] pt-14 sm:pt-20 pb-12 px-4 sm:px-8 md:px-12 lg:px-16 border-t border-[#DCD5C9]">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Col 1 & 2: Logo, Address, and Email Capture */}
          <div className="lg:col-span-2 space-y-6">
            <button
              onClick={() => onNavigate('home')}
              data-cursor="HOME"
              className="flex flex-col text-left group focus:outline-none"
            >
              <span className="font-serif-heavy text-2xl md:text-3xl tracking-tighter text-[#C9473B] uppercase leading-none">
                Nairobi Apparel District
              </span>
              <span className="font-satoshi text-[9px] tracking-[0.35em] text-[#C9473B] uppercase font-bold mt-1 opacity-90">
                Worldwide
              </span>
            </button>

            <p className="font-satoshi text-xs text-[#6E685E] leading-relaxed max-w-sm">
              The Heart of Art and Upcycling.<br />
              Studio 18 · Nairobi · Kenya<br />
              info@nairobiappareldistrict.com
            </p>

            <div className="max-w-sm pt-2">
              <span className="font-satoshi text-[10px] font-bold uppercase tracking-widest text-[#C9473B] block mb-2">
                Join the Atelier Dispatch
              </span>
              {subscribed ? (
                <div className="p-3 bg-[#FFFFFF] border border-[#C9473B] text-[#141414] text-xs font-satoshi flex items-center gap-2 rounded-full shadow-xs">
                  <Check className="w-3.5 h-3.5 text-[#C9473B]" />
                  <span>Subscribed to numbered drops.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="flex-1 bg-[#FFFFFF] border border-[#DCD5C9] px-4 py-2.5 text-xs font-satoshi text-[#141414] placeholder:text-[#6E685E]/70 focus:outline-none focus:border-[#C9473B] rounded-full shadow-xs"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#C9473B] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#b03c31] transition-colors rounded-full shadow-xs"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 3: Main Pages */}
          <div>
            <h5 className="font-satoshi font-bold text-[10px] tracking-[0.2em] uppercase mb-4 text-[#C9473B]">
              Main Pages
            </h5>
            <ul className="space-y-2.5 font-satoshi text-xs text-[#6E685E]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#C9473B] transition-colors focus:outline-none"
                >
                  Home Flagship
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#C9473B] transition-colors focus:outline-none"
                >
                  About Us & Upcycling
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-[#C9473B] transition-colors focus:outline-none"
                >
                  Shop Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collection')}
                  className="hover:text-[#C9473B] transition-colors focus:outline-none"
                >
                  Editorial Lookbook
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#C9473B] transition-colors focus:outline-none"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care */}
          <div>
            <h5 className="font-satoshi font-bold text-[10px] tracking-[0.2em] uppercase mb-4 text-[#C9473B]">
              Customer Care
            </h5>
            <ul className="space-y-2.5 font-satoshi text-xs text-[#6E685E]">
              <li>
                <button
                  onClick={() => onNavigate('cart')}
                  className="hover:text-[#C9473B] transition-colors focus:outline-none"
                >
                  Shopping Bag & Shipping Calculator
                </button>
              </li>
              <li>
                <span className="block opacity-80">
                  Local & Regional Delivery
                </span>
              </li>
              <li>
                <span className="block opacity-80">
                  International Duties & Customs
                </span>
              </li>
              <li>
                <span className="block opacity-80">
                  Custom Bespoke Tailoring
                </span>
              </li>
              <li>
                <span className="block opacity-80">
                  Care Guide: Raw Selvedge Denim
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Social */}
          <div>
            <h5 className="font-satoshi font-bold text-[10px] tracking-[0.2em] uppercase mb-4 text-[#C9473B]">
              Connect & Social
            </h5>
            <ul className="space-y-2.5 font-satoshi text-xs text-[#6E685E]">
              <li>
                <a
                  href="https://wa.me/254700000000"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#C9473B] transition-colors"
                >
                  WhatsApp: +254 700 000 000
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#C9473B] transition-colors"
                >
                  Instagram: @nairobiappareldistrict
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#C9473B] transition-colors"
                >
                  TikTok: @nad_worldwide
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@nairobiappareldistrict.com"
                  className="hover:text-[#C9473B] transition-colors"
                >
                  info@nairobiappareldistrict.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-6 font-satoshi text-[10px] uppercase tracking-widest text-[#8A8277]">Photography via Unsplash</p>

        {/* Legal Row */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#DCD5C9] gap-4 font-satoshi text-[11px] text-[#6E685E]">
          <p>© 2025 Nairobi Apparel District Worldwide. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <span className="hover:text-[#C9473B] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#C9473B] cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-[#C9473B] cursor-pointer">Shipping & Returns</span>
            <span className="hover:text-[#C9473B] cursor-pointer">Circular Upcycling Promise</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
