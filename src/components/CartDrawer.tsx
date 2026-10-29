import React from 'react';
import { X, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { useCurrency, formatPrice } from '../contexts/CurrencyContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onNavigate: (view: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
}) => {
  const { symbol, exchangeRate } = useCurrency();
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckoutClick = () => {
    onClose();
    onNavigate('checkout');
  };

  const handleViewBagClick = () => {
    onClose();
    onNavigate('cart');
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] text-[#141414] shadow-2xl flex flex-col justify-between border-l border-[#DCD5C9] rounded-l-3xl animate-in slide-in-from-right duration-300 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-6 border-b border-[#DCD5C9] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-serif-heavy text-2xl uppercase tracking-tight text-[#141414]">
                Shopping Bag
              </span>
              <span className="font-satoshi text-xs font-bold bg-[#C9473B] text-white px-2.5 py-0.5 rounded-full tabular-nums">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#6E685E] hover:text-[#C9473B] transition-colors focus:outline-none rounded-full hover:bg-[#FAF7F2]"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Info Ribbon */}
          <div className="bg-[#FAF7F2] px-6 py-3 border-b border-[#DCD5C9]">
            <div className="flex justify-between items-center text-[10px] font-satoshi uppercase tracking-widest text-[#6E685E]">
              <span>Worldwide Tracked Dispatch</span>
              <span className="font-bold text-[#C9473B]">Studio 18</span>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#DCD5C9]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 stroke-[1.25] opacity-25 text-[#C9473B]" />
                <p className="font-serif-heavy text-xl uppercase opacity-70 text-[#141414]">Your bag is empty</p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('shop');
                  }}
                  className="mt-4 px-6 py-3 bg-[#C9473B] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#b03c31] transition-colors rounded-full shadow-md"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="w-20 h-24 bg-[#FAF7F2] shrink-0 overflow-hidden border border-[#DCD5C9] rounded-xl">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between font-satoshi">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm leading-snug text-[#141414]">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[10px] text-[#C9473B] uppercase font-bold tracking-widest hover:opacity-70 transition-opacity ml-2"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="text-[11px] text-[#6E685E] mt-1 uppercase tracking-wider">
                        Size: {item.size} · {item.color.name}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#DCD5C9] bg-[#FAF7F2] rounded-full overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-[#C9473B]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold tabular-nums text-[#141414]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-[#C9473B]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-xs tabular-nums text-[#C9473B]">
                        {formatPrice(item.product.price * item.quantity, symbol, exchangeRate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-6 py-6 border-t border-[#DCD5C9] bg-[#FAF7F2] space-y-4">
              <div className="flex justify-between items-baseline font-satoshi">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6E685E]">
                  Subtotal
                </span>
                <span className="font-serif-heavy text-2xl font-bold tabular-nums text-[#C9473B]">
                  {formatPrice(subtotal, symbol, exchangeRate)}
                </span>
              </div>
              <p className="text-[10px] text-[#6E685E] font-satoshi">
                Shipping rates calculated live via regional courier calculator.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-4 bg-[#C9473B] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#b03c31] transition-colors flex items-center justify-center gap-2 rounded-full shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleViewBagClick}
                  className="w-full py-3 border border-[#DCD5C9] bg-[#FFFFFF] text-[#141414] text-xs font-bold uppercase tracking-widest hover:bg-[#FAF7F2] transition-colors rounded-full"
                >
                  View Cart Totals & Shipping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
