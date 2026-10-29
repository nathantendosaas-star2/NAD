import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  RefreshCw,
  Sliders,
  DollarSign,
  ArrowUpRight,
  ShieldAlert,
  Save,
  X,
} from 'lucide-react';
import { useCurrency, formatPrice } from '../contexts/CurrencyContext';
import { getDeviceId } from '../utils/deviceId';

interface AdminMetrics {
  totalVisitors: number;
  uniqueDevices: number;
  totalPageviews: number;
  pageBreakdown: Record<string, number>;
  activeCartsCount: number;
  activeCartsTotalValue: number;
  inventoryCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  recentVisitors: Array<{
    ip: string;
    deviceId: string;
    path: string;
    timestamp: string;
    userAgent: string;
  }>;
  activeCarts: Array<{
    deviceId: string;
    ip: string;
    itemsCount: number;
    totalValue: number;
    items: Array<{
      id: string;
      productName: string;
      size: string;
      color: string;
      price: number;
      quantity: number;
    }>;
    updatedAt: string;
  }>;
}

interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  stockCount: number;
  inStock: boolean;
  images: string[];
  description: string;
}

export const AdminView: React.FC = () => {
  const { symbol, exchangeRate } = useCurrency();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'active_carts' | 'visitors'>('overview');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    category: 'exclusive',
    categoryLabel: 'EXCLUSIVE · UNISEX',
    price: 15000,
    stockCount: 10,
    images: ['https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1200'],
    description: 'Art-cycled tailored garment crafted at Studio 18, Kilimani.',
  });

  const deviceId = getDeviceId();

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/admin/metrics', {
        headers: { 'X-Device-Id': deviceId },
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Failed to fetch admin metrics:', err);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/admin/inventory', {
        headers: { 'X-Device-Id': deviceId },
      });
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchInventory();
    const interval = setInterval(() => {
      fetchMetrics();
    }, 8000); // Auto-refresh metrics every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStock = async (productId: string, newStock: number) => {
    const stock = Math.max(0, newStock);
    try {
      const res = await fetch(`/api/admin/inventory/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Id': deviceId,
        },
        body: JSON.stringify({
          stockCount: stock,
          inStock: stock > 0,
        }),
      });
      if (res.ok) {
        fetchInventory();
        fetchMetrics();
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await fetch(`/api/admin/inventory/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Id': deviceId,
        },
        body: JSON.stringify(editingProduct),
      });
      if (res.ok) {
        setEditingProduct(null);
        fetchInventory();
        fetchMetrics();
      }
    } catch (err) {
      console.error('Failed to save product edit:', err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;
    const generatedId = newProduct.id || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Id': deviceId,
        },
        body: JSON.stringify({
          ...newProduct,
          id: generatedId,
          inStock: newProduct.stockCount > 0,
        }),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setNewProduct({
          id: '',
          name: '',
          category: 'exclusive',
          categoryLabel: 'EXCLUSIVE · UNISEX',
          price: 15000,
          stockCount: 10,
          images: ['https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=1200'],
          description: 'Art-cycled tailored garment crafted at Studio 18, Kilimani.',
        });
        fetchInventory();
        fetchMetrics();
      }
    } catch (err) {
      console.error('Failed to add new product:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this garment from inventory?')) return;
    try {
      const res = await fetch(`/api/admin/inventory/${productId}`, {
        method: 'DELETE',
        headers: { 'X-Device-Id': deviceId },
      });
      if (res.ok) {
        fetchInventory();
        fetchMetrics();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#121317] text-[#e3e2e8] min-h-screen selection:bg-[#b9d070] selection:text-[#293500]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        {/* Admin Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#343439] pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#b9d070] animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#b9d070]">
                STUDIO ATELIER CONTROL PANEL
              </span>
            </div>
            <h1 className="font-serif-heavy text-3xl sm:text-5xl uppercase text-white tracking-tight">
              Atelier Administration
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchMetrics();
                fetchInventory();
              }}
              className="px-4 py-2.5 bg-[#292a2e] hover:bg-[#343439] text-[#c7c5d3] hover:text-white font-mono text-xs font-bold uppercase rounded-xl border border-[#464651]/40 flex items-center gap-2 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Live Sync</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-[#b9d070] hover:bg-[#d4ed89] text-[#293500] font-mono text-xs font-bold uppercase rounded-xl flex items-center gap-2 transition-all shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Garment</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#343439] pb-4 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#b9d070] text-[#293500] shadow-md'
                : 'bg-[#1a1b20] text-[#c7c5d3] hover:text-white border border-[#343439]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-[#b9d070] text-[#293500] shadow-md'
                : 'bg-[#1a1b20] text-[#c7c5d3] hover:text-white border border-[#343439]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory Management ({inventory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('active_carts')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'active_carts'
                ? 'bg-[#b9d070] text-[#293500] shadow-md'
                : 'bg-[#1a1b20] text-[#c7c5d3] hover:text-white border border-[#343439]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Active Saved Carts ({metrics?.activeCartsCount || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('visitors')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'visitors'
                ? 'bg-[#b9d070] text-[#293500] shadow-md'
                : 'bg-[#1a1b20] text-[#c7c5d3] hover:text-white border border-[#343439]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Visitor Logs ({metrics?.recentVisitors?.length || 0})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#1a1b20] border border-[#343439] p-6 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between text-[#c7c5d3]">
                  <span className="font-mono text-xs uppercase font-bold">Total Unique Visitors</span>
                  <Users className="w-5 h-5 text-[#b9d070]" />
                </div>
                <div className="font-serif-heavy text-3xl sm:text-4xl text-white">
                  {metrics?.uniqueDevices || 0}
                </div>
                <p className="font-satoshi text-xs text-[#c7c5d3]">
                  {metrics?.totalPageviews || 0} Total Page Interactions
                </p>
              </div>

              <div className="bg-[#1a1b20] border border-[#343439] p-6 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between text-[#c7c5d3]">
                  <span className="font-mono text-xs uppercase font-bold">Active Devices / Carts</span>
                  <ShoppingBag className="w-5 h-5 text-[#accae8]" />
                </div>
                <div className="font-serif-heavy text-3xl sm:text-4xl text-white">
                  {metrics?.activeCartsCount || 0}
                </div>
                <p className="font-satoshi text-xs text-[#accae8] font-bold">
                  {formatPrice(metrics?.activeCartsTotalValue || 0, symbol, exchangeRate)} Potential Pipeline
                </p>
              </div>

              <div className="bg-[#1a1b20] border border-[#343439] p-6 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between text-[#c7c5d3]">
                  <span className="font-mono text-xs uppercase font-bold">Total SKUs in Atelier</span>
                  <Package className="w-5 h-5 text-[#b9d070]" />
                </div>
                <div className="font-serif-heavy text-3xl sm:text-4xl text-white">
                  {metrics?.inventoryCount || inventory.length}
                </div>
                <p className="font-satoshi text-xs text-[#c7c5d3]">
                  {metrics?.lowStockCount || 0} Low Stock · {metrics?.outOfStockCount || 0} Out of Stock
                </p>
              </div>

              <div className="bg-[#1a1b20] border border-[#343439] p-6 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between text-[#c7c5d3]">
                  <span className="font-mono text-xs uppercase font-bold">Backend Protocol</span>
                  <ShieldAlert className="w-5 h-5 text-[#b9d070]" />
                </div>
                <div className="font-serif-heavy text-2xl text-white uppercase">
                  Device Persisted
                </div>
                <p className="font-mono text-[10px] text-[#b9d070] font-bold">
                  IP / Device ID Synced
                </p>
              </div>
            </div>

            {/* Page Navigation Breakdown Chart */}
            <div className="bg-[#1a1b20] border border-[#343439] p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#343439] pb-4">
                <div>
                  <span className="font-mono text-xs uppercase text-[#b9d070] font-bold block mb-1">
                    TRAFFIC DISTRIBUTION BY VIEW
                  </span>
                  <h3 className="font-serif-heavy text-xl uppercase text-white">Pageview Heatmap</h3>
                </div>
                <span className="font-mono text-xs text-[#c7c5d3]">Live Server Metrics</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {Object.entries(metrics?.pageBreakdown || { home: 12, shop: 24, collection: 18, product: 15, cart: 6, checkout: 2 }).map(
                  ([page, count]) => {
                    const total = metrics?.totalPageviews || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={page} className="bg-[#0d0e12] border border-[#343439] p-4 rounded-xl space-y-3">
                        <span className="font-mono text-xs uppercase text-[#accae8] font-bold block truncate">
                          /{page}
                        </span>
                        <div className="font-serif-heavy text-2xl text-white">{count}</div>
                        <div className="w-full bg-[#292a2e] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#b9d070] h-full rounded-full" style={{ width: `${Math.max(10, pct)}%` }} />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Search & Category Filter Toolbar */}
            <div className="bg-[#1a1b20] border border-[#343439] p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c7c5d3]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search SKU or Garment Title..."
                  className="w-full bg-[#0d0e12] text-white placeholder:text-[#918f9d] font-mono text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#343439] focus:outline-none focus:border-[#b9d070]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
                {['all', 'exclusive', 'men', 'women', 'unisex', 'accessories', 'uncategorized'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`font-mono text-[10px] uppercase px-3 py-1.5 rounded-lg transition-all font-bold whitespace-nowrap ${
                      categoryFilter === cat
                        ? 'bg-[#b9d070] text-[#293500]'
                        : 'bg-[#292a2e] text-[#c7c5d3] hover:text-white border border-[#464651]/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-[#1a1b20] border border-[#343439] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0d0e12] border-b border-[#343439] font-mono text-[10px] uppercase text-[#c7c5d3]">
                      <th className="p-4">Garment</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock Quantity</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#343439] font-satoshi text-xs text-[#e3e2e8]">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-[#292a2e]/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover bg-[#0d0e12] border border-[#343439] shrink-0"
                          />
                          <div>
                            <span className="font-serif-heavy text-sm uppercase text-white block">
                              {item.name}
                            </span>
                            <span className="font-mono text-[10px] text-[#918f9d]">ID: {item.id}</span>
                          </div>
                        </td>

                        <td className="p-4 font-mono text-[11px] text-[#accae8] uppercase font-bold">
                          {item.categoryLabel || item.category}
                        </td>

                        <td className="p-4 font-bold text-[#b9d070] tabular-nums">
                          {formatPrice(item.price, symbol, exchangeRate)}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateStock(item.id, item.stockCount - 1)}
                              className="w-7 h-7 rounded-lg bg-[#292a2e] hover:bg-[#343439] text-white flex items-center justify-center font-mono font-bold border border-[#464651]/40"
                            >
                              -
                            </button>
                            <span className="font-mono text-sm font-bold text-white w-8 text-center tabular-nums">
                              {item.stockCount}
                            </span>
                            <button
                              onClick={() => handleUpdateStock(item.id, item.stockCount + 1)}
                              className="w-7 h-7 rounded-lg bg-[#292a2e] hover:bg-[#343439] text-white flex items-center justify-center font-mono font-bold border border-[#464651]/40"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="p-4">
                          {item.stockCount > 5 ? (
                            <span className="bg-[#b9d070]/20 text-[#b9d070] font-mono text-[10px] uppercase px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>In Stock</span>
                            </span>
                          ) : item.stockCount > 0 ? (
                            <span className="bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Low Stock</span>
                            </span>
                          ) : (
                            <span className="bg-rose-500/20 text-rose-300 font-mono text-[10px] uppercase px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              <span>Out of Stock</span>
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingProduct(item)}
                              className="p-2 bg-[#292a2e] hover:bg-[#343439] text-[#accae8] rounded-lg border border-[#464651]/40 transition-colors"
                              title="Edit Garment"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(item.id)}
                              className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg border border-rose-500/30 transition-colors"
                              title="Delete Garment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE ACTIVE CARTS (SAVED BY IP / DEVICE ID) */}
        {activeTab === 'active_carts' && (
          <div className="space-y-6">
            <div className="bg-[#1a1b20] border border-[#343439] p-6 rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-mono text-xs uppercase text-[#b9d070] font-bold block mb-1">
                  BACKEND PERSISTENT SHOPPING BAGS
                </span>
                <h3 className="font-serif-heavy text-2xl uppercase text-white">Live Devices & Active Carts</h3>
              </div>
              <span className="font-mono text-xs text-[#c7c5d3]">
                Total Saved Carts: {metrics?.activeCartsCount || 0}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {metrics?.activeCarts && metrics.activeCarts.length > 0 ? (
                metrics.activeCarts.map((cart, idx) => (
                  <div key={cart.deviceId || idx} className="bg-[#1a1b20] border border-[#343439] p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-[#343439] pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#b9d070] uppercase block">
                          Device: {cart.deviceId}
                        </span>
                        <span className="font-mono text-[10px] text-[#918f9d]">IP: {cart.ip}</span>
                      </div>
                      <span className="font-serif-heavy text-lg text-[#b9d070]">
                        {formatPrice(cart.totalValue, symbol, exchangeRate)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="font-mono text-[10px] uppercase text-[#c7c5d3] font-bold block">
                        Saved Cart Items ({cart.itemsCount}):
                      </span>
                      <ul className="space-y-2">
                        {cart.items.map((item, i) => (
                          <li key={i} className="bg-[#0d0e12] p-3 rounded-xl flex items-center justify-between text-xs">
                            <div>
                              <span className="font-serif-heavy uppercase text-white block">
                                {item.productName}
                              </span>
                              <span className="font-mono text-[10px] text-[#918f9d]">
                                Size: {item.size} · Color: {item.color}
                              </span>
                            </div>
                            <div className="text-right font-mono font-bold text-[#accae8]">
                              x{item.quantity} · {formatPrice(item.price * item.quantity, symbol, exchangeRate)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 text-right font-mono text-[10px] text-[#918f9d]">
                      Last Synced: {new Date(cart.updatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-[#1a1b20] border border-[#343439] p-12 text-center rounded-2xl text-[#c7c5d3] font-mono text-sm">
                  No active saved carts in backend currently. Add garments to cart to test live persistence!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: VISITOR LOGS */}
        {activeTab === 'visitors' && (
          <div className="bg-[#1a1b20] border border-[#343439] rounded-2xl overflow-hidden shadow-sm space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-[#343439] pb-4">
              <div>
                <span className="font-mono text-xs uppercase text-[#b9d070] font-bold block mb-1">
                  REAL-TIME TELEMETRY LOGS
                </span>
                <h3 className="font-serif-heavy text-2xl uppercase text-white">Recent Requests & Visits</h3>
              </div>
              <span className="font-mono text-xs text-[#c7c5d3]">
                Total Requests Logged: {metrics?.recentVisitors?.length || 0}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0d0e12] border-b border-[#343439] font-mono text-[10px] uppercase text-[#c7c5d3]">
                    <th className="p-3">Time</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Device ID</th>
                    <th className="p-3">Path Visited</th>
                    <th className="p-3">User Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#343439] font-mono text-xs text-[#e3e2e8]">
                  {metrics?.recentVisitors && metrics.recentVisitors.length > 0 ? (
                    metrics.recentVisitors.map((vis, idx) => (
                      <tr key={idx} className="hover:bg-[#292a2e]/50 transition-colors">
                        <td className="p-3 text-[#c7c5d3] whitespace-nowrap">
                          {new Date(vis.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="p-3 font-bold text-[#accae8]">{vis.ip}</td>
                        <td className="p-3 text-[#b9d070] font-bold">{vis.deviceId}</td>
                        <td className="p-3">
                          <span className="bg-[#0d0e12] px-2 py-1 rounded text-[#b9d070] border border-[#343439]">
                            {vis.path}
                          </span>
                        </td>
                        <td className="p-3 text-[#918f9d] truncate max-w-xs">{vis.userAgent}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-[#c7c5d3]">
                        No visitor logs recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD NEW GARMENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1a1b20] border border-[#343439] rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-[#343439] pb-4">
              <h3 className="font-serif-heavy text-2xl uppercase text-white">Add New Garment to Atelier</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#c7c5d3] hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="font-mono text-xs uppercase text-[#c7c5d3] block mb-1 font-bold">
                  Garment Name
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. NAD MONOGRAM MILITARY CROP JACKET"
                  className="w-full bg-[#0d0e12] text-white font-mono text-xs p-3 rounded-xl border border-[#343439] focus:outline-none focus:border-[#b9d070]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-[#c7c5d3] block mb-1 font-bold">
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category: e.target.value,
                        categoryLabel: `${e.target.value.toUpperCase()} · ATELIER`,
                      })
                    }
                    className="w-full bg-[#0d0e12] text-white font-mono text-xs p-3 rounded-xl border border-[#343439] focus:outline-none focus:border-[#b9d070]"
                  >
                    <option value="exclusive">Exclusive</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                    <option value="accessories">Accessories</option>
                    <option value="uncategorized">Uncategorized</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-xs uppercase text-[#c7c5d3] block mb-1 font-bold">
                    Price (KShs)
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#0d0e12] text-white font-mono text-xs p-3 rounded-xl border border-[#343439] focus:outline-none focus:border-[#b9d070]"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-[#c7c5d3] block mb-1 font-bold">
                  Initial Stock Quantity
                </label>
                <input
                  type="number"
                  required
                  value={newProduct.stockCount}
                  onChange={(e) => setNewProduct({ ...newProduct, stockCount: Number(e.target.value) })}
                  className="w-full bg-[#0d0e12] text-white font-mono text-xs p-3 rounded-xl border border-[#343439] focus:outline-none focus:border-[#b9d070]"
                />
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-[#c7c5d3] block mb-1 font-bold">
                  Image URL
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.images[0]}
                  onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                  className="w-full bg-[#0d0e12] text-white font-mono text-xs p-3 rounded-xl border border-[#343439] focus:outline-none focus:border-[#b9d070]"
                />
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-[#c7c5d3] block mb-1 font-bold">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-[#0d0e12] text-white font-mono text-xs p-3 rounded-xl border border-[#343439] focus:outline-none focus:border-[#b9d070] h-20"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-[#292a2e] text-[#c7c5d3] font-mono text-xs font-bold uppercase rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#b9d070] text-[#293500] font-mono text-xs font-bold uppercase rounded-xl hover:bg-[#d4ed89]"
                >
                  Create Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT GARMENT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1a1b20] border border-[#343439] rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-[#343439] pb-4">
              <h3 className="font-serif-heavy text-2xl uppercase text-white">Edit Atelier Garment</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-[#c7c5d3] hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4">
              <div>
                <label className="font-mono text-xs uppercase text-[#c7c5d3] block mb-1 font-bold">
                  Garment Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#0d0e12] text-white font-mono text-xs p-3 rounded-xl border border-[#343439] focus:outline-none focus:border-[#b9d070]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-[#c7c5d3] block mb-1 font-bold">
                    Price (KShs)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#0d0e12] text-white font-mono text-xs p-3 rounded-xl border border-[#343439] focus:outline-none focus:border-[#b9d070]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase text-[#c7c5d3] block mb-1 font-bold">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stockCount}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stockCount: Number(e.target.value),
                        inStock: Number(e.target.value) > 0,
                      })
                    }
                    className="w-full bg-[#0d0e12] text-white font-mono text-xs p-3 rounded-xl border border-[#343439] focus:outline-none focus:border-[#b9d070]"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs uppercase text-[#c7c5d3] block mb-1 font-bold">
                  Description
                </label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-[#0d0e12] text-white font-mono text-xs p-3 rounded-xl border border-[#343439] focus:outline-none focus:border-[#b9d070] h-20"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 bg-[#292a2e] text-[#c7c5d3] font-mono text-xs font-bold uppercase rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#b9d070] text-[#293500] font-mono text-xs font-bold uppercase rounded-xl hover:bg-[#d4ed89]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
