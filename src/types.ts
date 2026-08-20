export type CategoryType = 'sneakers' | 'homme' | 'femme' | 'enfant';

export type SubCategoryType = string;

export type GenderType = 'homme' | 'femme' | 'enfant' | 'unisex';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  sku: string;
  brand: string;
  category: CategoryType;
  subcategory: string;
  gender: GenderType;
  price: number; // in FCFA
  originalPrice?: number; // in FCFA (strikethrough)
  discountPercent?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isPromotion?: boolean;
  isPremium?: boolean;
  images: string[];
  primaryImageIndex?: number;
  description: string;
  material: string;
  colors: ProductColor[];
  sizeStock: { [size: number]: number }; // Size (36..45) -> Quantity in stock
  totalStock: number;
  status: 'disponible' | 'rupture' | 'brouillon';
  rating: number;
  reviewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  size: number;
  color: string;
  quantity: number;
}

export type OrderStatus = 
  | 'recue'
  | 'nouvelle'
  | 'confirmee'
  | 'preparee'
  | 'en_preparation'
  | 'expediee'
  | 'en_livraison'
  | 'livree'
  | 'annulee'
  | 'payee'
  | 'retour';

export type PaymentMethod = 'wave' | 'orange_money' | 'yas' | 'free_money' | 'card' | 'cod';
export type PaymentStatus = 'en_attente' | 'paye' | 'echoue';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: number;
  color: string;
  price: number;
  quantity: number;
}

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  region?: string;
  email?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  title: string;
  description: string;
}

export interface Order {
  id: string; // e.g. #VZ-10254
  customer: OrderCustomer;
  deliveryZone: string;
  deliveryFee: number;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  discountAmount?: number;
  total: number;
  promoCodeUsed?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  transactionRef?: string;
  paidAt?: string;
  timeline?: OrderTimelineEvent[];
  notes?: string;
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  location: string;
  status: 'approuvé' | 'en_attente' | 'rejeté';
}

export interface Coupon {
  id?: string;
  code: string;
  discountType: 'percent' | 'fixed';
  value: number; // percentage (e.g. 15 for 15%) or FCFA amount
  minSpend?: number;
  minOrder?: number;
  usageLimit?: number;
  maxUses?: number;
  usedCount?: number;
  currentUses?: number;
  expiresAt: string;
  isActive: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedTime: string;
}

export type HomeSectionId = 
  | 'hero' 
  | 'categories' 
  | 'new_arrivals' 
  | 'best_sellers' 
  | 'trending_banner' 
  | 'promotions' 
  | 'why_vayza' 
  | 'packaging' 
  | 'reviews' 
  | 'social_feed';

export interface HomeSectionConfig {
  id: HomeSectionId;
  title: string;
  order: number;
  isEnabled: boolean;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroImage: string;
  heroBadge: string;
  trendingBannerTitle: string;
  trendingBannerSubtitle: string;
  trendingBannerImage: string;
  trendingBannerTag: string;
  promoBannerText: string;
  promoBannerDiscount?: string;
  promoBannerActive: boolean;
  announcementText?: string;
  announcementActive?: boolean;
  contactWhatsApp: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  contactAddress?: string;
  instagramHandle: string;
  tiktokHandle: string;
  deliveryZones: DeliveryZone[];
  homeSections?: HomeSectionConfig[];
}

export type AdminRole = 'super_admin' | 'gestionnaire' | 'service_client' | 'contenu';

export interface CustomerUser {
  uid?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  deliveryZone: string;
  preferredSize: number;
  createdAt?: string;
  isAuthenticated: boolean;
}

export type AuthModalMode = 'login' | 'register' | 'admin';

export interface AdminUser {
  id: string;
  name: string;
  role: AdminRole;
  email: string;
  avatar?: string;
  lastLogin?: string;
}
