import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeView: string;
  onNavigate: (view: string, subSection?: string) => void;
  cartCount: number;
  onOpenCartDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  cartCount,
  onOpenCartDrawer,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT US' },
    { id: 'shop', label: 'SHOP' },
    { id: 'collection', label: 'COLLECTION' },
    { id: 'contact', label: 'CONTACT US' },
  ];

  const handleLinkClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 bg-[#EFEBE3]/95 backdrop-blur-md border-b border-[#DCD5C9] ${
          isScrolled ? 'py-2 sm:py-2.5 shadow-md' : 'py-3 sm:py-4'
        }`}
      >
        <div className="px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1920px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo at top-left: Red hand-lettered Nairobi Apparel District Worldwide wordmark */}
          <button
            onClick={() => handleLinkClick('home')}
            data-cursor="HOME"
            className="flex flex-col text-left group focus:outline-none shrink max-w-[65vw] sm:max-w-none overflow-hidden"
            aria-label="Nairobi Apparel District Worldwide"
          >
            <span className="font-serif-heavy text-[clamp(0.68rem,2.2vw,1.6rem)] tracking-tighter text-[#C9473B] uppercase leading-[0.88] group-hover:opacity-90 transition-opacity truncate sm:whitespace-normal">
              Nairobi Apparel District
            </span>
            <span className="font-satoshi text-[8px] sm:text-[9px] tracking-[0.35em] text-[#C9473B] uppercase font-bold mt-0.5 opacity-90">
              Worldwide
            </span>
          </button>

          {/* Center: A softly rounded boxed bar with red borders and off-white fill (Responsive for Tablet & Desktop) */}
          <nav className="hidden md:flex items-center border border-[#C9473B]/40 bg-[#FFFFFF]/90 backdrop-blur-xs rounded-full px-4 lg:px-7 py-2 space-x-3.5 lg:space-x-6 text-[10px] lg:text-[11px] font-bold tracking-[0.14em] lg:tracking-[0.18em] uppercase font-satoshi text-[#141414] shadow-xs">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`flex items-center gap-1.5 transition-colors whitespace-nowrap focus:outline-none ${
                    isActive ? 'text-[#C9473B]' : 'hover:text-[#C9473B] text-[#141414]/90'
                  }`}
                >
                  {isActive && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9473B]" />
                  )}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Divided by vertical rules: Cart Bag with count, and hamburger menu */}
          <div className="flex items-center border border-[#C9473B]/40 bg-[#FFFFFF]/90 backdrop-blur-xs rounded-full shadow-xs overflow-hidden shrink-0">
            {/* Bag Button */}
            <button
              onClick={onOpenCartDrawer}
              data-cursor="CART"
              aria-label={`Shopping Bag with ${cartCount} items`}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-[#C9473B] hover:bg-[#C9473B]/10 transition-colors focus:outline-none"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
              <span className="font-satoshi text-xs font-bold tabular-nums">
                ({cartCount})
              </span>
            </button>

            {/* Vertical Rule */}
            <div className="h-5 sm:h-6 w-[1px] bg-[#C9473B]/30" />

            {/* Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 text-[#C9473B] hover:bg-[#C9473B]/10 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 stroke-[2.5]" /> : <Menu className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#EFEBE3]/98 backdrop-blur-xl pt-24 sm:pt-28 px-6 sm:px-8 flex flex-col justify-between pb-10 overflow-y-auto animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-4 sm:space-y-5">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left font-serif-heavy text-2xl sm:text-4xl uppercase flex items-center gap-2.5 tracking-tight transition-colors ${
                    isActive ? 'text-[#C9473B]' : 'text-[#141414] hover:text-[#C9473B]'
                  }`}
                >
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#C9473B]" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => handleLinkClick('cart')}
              className="text-left font-serif-heavy text-2xl sm:text-4xl uppercase text-[#C9473B] flex items-center gap-2.5 tracking-tight pt-3 border-t border-[#DCD5C9]"
            >
              <span>SHOPPING BAG ({cartCount})</span>
            </button>
          </nav>

          <div className="border-t border-[#DCD5C9] pt-6 space-y-1 font-satoshi mt-8">
            <p className="text-xs uppercase tracking-widest text-[#C9473B] font-bold">
              The Heart of Art & Upcycling
            </p>
            <p className="text-xs text-[#6E685E]">
              Studio 18 · Nairobi · Kenya · info@nairobiappareldistrict.com
            </p>
          </div>
        </div>
      )}
    </>
  );
};
