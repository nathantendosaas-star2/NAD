/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Product, CartItem, ProductColor } from './types';
import { PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CustomCursor } from './components/CustomCursor';

import { motion, AnimatePresence } from 'framer-motion';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ShopView } from './views/ShopView';
import { CollectionView } from './views/CollectionView';
import { ContactView } from './views/ContactView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { AdminView } from './views/AdminView';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { SmoothScroll } from './components/SmoothScroll';
import { getDeviceId } from './utils/deviceId';

type ViewMode =
  | 'home'
  | 'about'
  | 'shop'
  | 'collection'
  | 'contact'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'admin';

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>('home');
  const [activeShopCategory, setActiveShopCategory] = useState<string>('all');
  const [selectedProductId, setSelectedProductId] = useState<string>('monogram-military-jacket');

  // Slide-over cart drawer & modals
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);

  const deviceId = getDeviceId();

  // Cart state initialized from localStorage or initial prototype items
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nad_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }

    const jacket = PRODUCTS.find((p) => p.id === 'monogram-military-jacket');
    const shirt = PRODUCTS.find((p) => p.id === 'embroidered-swahili-shirt');
    const initialItems: CartItem[] = [];

    if (jacket) {
      initialItems.push({
        id: `${jacket.id}-L-${jacket.colors[0].code}`,
        product: jacket,
        size: 'L',
        color: jacket.colors[0],
        quantity: 1,
      });
    }
    if (shirt) {
      initialItems.push({
        id: `${shirt.id}-M-${shirt.colors[0].code}`,
        product: shirt,
        size: 'M',
        color: shirt.colors[0],
        quantity: 1,
      });
    }
    return initialItems;
  });

  // Fetch backend cart associated with deviceId / IP on initial mount
  useEffect(() => {
    const fetchBackendCart = async () => {
      try {
        const res = await fetch('/api/cart', {
          headers: { 'X-Device-Id': deviceId },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.items && Array.isArray(data.items) && data.items.length > 0) {
            setCartItems(data.items);
          }
        }
      } catch (err) {
        console.error('Failed to load backend cart:', err);
      }
    };

    fetchBackendCart();
  }, [deviceId]);

  // Sync cart changes to localStorage AND backend persistence API (/api/cart)
  useEffect(() => {
    try {
      localStorage.setItem('nad_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore write errors
    }

    // Sync to backend persistent store by deviceId / IP
    const syncBackendCart = async () => {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Device-Id': deviceId,
          },
          body: JSON.stringify({ items: cartItems }),
        });
      } catch (err) {
        console.error('Failed to sync backend cart:', err);
      }
    };

    syncBackendCart();
  }, [cartItems, deviceId]);

  // Handle URL hash routing and /admin
  useEffect(() => {
    const handleHashChange = () => {
      const pathname = window.location.pathname;
      if (pathname.includes('/admin')) {
        setActiveView('admin');
        return;
      }

      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('product-')) {
        const pId = hash.replace('product-', '');
        const found = PRODUCTS.find((p) => p.id === pId);
        if (found) {
          setSelectedProductId(pId);
          setActiveView('product');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      if (hash.startsWith('shop/')) {
        const sub = hash.replace('shop/', '');
        setActiveShopCategory(sub);
        setActiveView('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      switch (hash) {
        case 'about':
        case 'about-us':
          setActiveView('about');
          break;
        case 'shop':
          setActiveView('shop');
          setActiveShopCategory('all');
          break;
        case 'collection':
        case 'lookbook':
          setActiveView('collection');
          break;
        case 'contact':
        case 'contact-us':
          setActiveView('contact');
          break;
        case 'cart':
        case 'bag':
          setActiveView('cart');
          break;
        case 'checkout':
          setActiveView('checkout');
          break;
        case 'admin':
          setActiveView('admin');
          break;
        case 'home':
        default:
          setActiveView('home');
          break;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Programmatic navigation
  const navigateTo = (view: string, subParam?: string) => {
    if (view === 'product' && subParam) {
      setSelectedProductId(subParam);
      setActiveView('product');
      window.location.hash = `product-${subParam}`;
    } else if (view === 'shop' && subParam) {
      setActiveShopCategory(subParam);
      setActiveView('shop');
      window.location.hash = `shop/${subParam}`;
    } else {
      setActiveView(view as ViewMode);
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: string,
    color: ProductColor,
    quantity: number
  ) => {
    const lineId = `${product.id}-${size}-${color.code}`;
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === lineId);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { id: lineId, product, size, color, quantity }];
      }
    });

    // Open cart drawer for instant feedback
    setIsCartDrawerOpen(true);
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'X-Device-Id': deviceId },
    }).catch(() => {});
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const selectedProduct =
    PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  return (
    <CurrencyProvider>
      <SmoothScroll />
      <div className="min-h-screen flex flex-col bg-[#EFEBE3] text-[#141414] selection:bg-[#C9473B] selection:text-white">
        {/* Interactive Cursor */}
        <CustomCursor />

        {/* Boxed Red Header Navigation */}
        <Navbar
          activeView={activeView}
          onNavigate={navigateTo}
          cartCount={totalCartCount}
          onOpenCartDrawer={() => setIsCartDrawerOpen(true)}
        />

        {/* Main Page View with transitions */}
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView === 'product' ? `product-${selectedProductId}` : activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeView === 'home' && (
                <HomeView
                  onSelectProduct={(id) => navigateTo('product', id)}
                  onNavigate={navigateTo}
                />
              )}

              {activeView === 'about' && (
                <AboutView onNavigate={navigateTo} />
              )}

              {activeView === 'shop' && (
                <ShopView
                  initialCategory={activeShopCategory}
                  onSelectProduct={(id) => navigateTo('product', id)}
                />
              )}

              {activeView === 'collection' && (
                <CollectionView
                  onSelectProduct={(id) => navigateTo('product', id)}
                  onNavigate={navigateTo}
                />
              )}

              {activeView === 'contact' && (
                <ContactView />
              )}

              {activeView === 'admin' && (
                <AdminView />
              )}

              {activeView === 'product' && (
                <ProductDetailView
                  product={selectedProduct}
                  onAddToCart={handleAddToCart}
                  onBackToShop={() => navigateTo('shop')}
                />
              )}

              {activeView === 'cart' && (
                <CartView
                  items={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onNavigate={navigateTo}
                  discountCode={discountCode}
                  setDiscountCode={setDiscountCode}
                  discountRate={discountRate}
                  setDiscountRate={setDiscountRate}
                />
              )}

              {activeView === 'checkout' && (
                <CheckoutView
                  items={cartItems}
                  discountCode={discountCode}
                  discountRate={discountRate}
                  onClearCart={handleClearCart}
                  onNavigate={navigateTo}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Slide-over cart drawer */}
        <CartDrawer
          isOpen={isCartDrawerOpen}
          onClose={() => setIsCartDrawerOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onNavigate={navigateTo}
        />

        {/* Footer */}
        <Footer onNavigate={navigateTo} />
      </div>
    </CurrencyProvider>
  );
}
