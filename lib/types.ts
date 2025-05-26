export interface Product {
  id: string;
  project_id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  value: string;
  price?: number;
  sku?: string;
  inStock: boolean;
  stockQuantity: number;
}

export interface Order {
  id: string;
  project_id: string;
  product_id: string;
  quantity: number;
  customer_email: string;
  status: string;
  created_at: string;
}

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  country: string;
  province: string;
  postalCode: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  orders: Order[];
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
  sortBy?: "price" | "name" | "createdAt" | "popularity";
  sortOrder?: "asc" | "desc";
}
