/**
 * Nairobi Apparel District (NAD) - Core Data Types
 */

export interface ProductColor {
  name: string;
  hex: string;
  code: string;
}

export type ProductCategory =
  | 'men'
  | 'women'
  | 'uncategorized'
  | 'accessories'
  | 'exclusive'
  | 'unisex';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  category: ProductCategory;
  categoryLabel: string;
  tag?: string;
  inStock: boolean;
  stockCount: number;
  images: string[];
  description: string;
  longDescription: string[];
  materials: string;
  care: string;
  provenance: string;
  sizes: string[];
  colors: ProductColor[];
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique item line id (product id + size + color)
  product: Product;
  size: string;
  color: ProductColor;
  quantity: number;
}

export interface ShippingMethod {
  id: 'standard' | 'economy' | 'express';
  name: string;
  estimatedDays: string;
  price: number;
}

export interface OrderCustomer {
  email: string;
  fullName: string;
  streetAddress: string;
  city: string;
  country: string;
  district?: string;
  town?: string;
  postalCode?: string;
  phone?: string;
}

export interface Order {
  id: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  tax: number; // 16% VAT
  discount: number;
  total: number;
  shippingMethod: ShippingMethod;
  paymentMethod: 'mpesa' | 'card' | 'cod' | 'whatsapp';
  paymentDetails?: {
    mpesaNumber?: string;
    cardLast4?: string;
  };
  createdAt: string;
  status: 'confirmed' | 'processing' | 'shipped';
}
