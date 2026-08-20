import fs from 'fs';
import path from 'path';
import { Product, Order, CustomerReview, Coupon, SiteSettings } from '../src/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
} from '../src/data/initialData';

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  reviews: CustomerReview[];
  coupons: Coupon[];
  settings: SiteSettings;
  subscribers: string[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'vayza_db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbState: DatabaseSchema;

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      // Filter out legacy demo product IDs (prod-1 to prod-12)
      const cleanedProducts = Array.isArray(parsed.products)
        ? parsed.products.filter((p: Product) => !p.id?.match(/^prod-([1-9]|1[0-2])$/))
        : [];

      return {
        products: cleanedProducts,
        orders: parsed.orders?.length ? parsed.orders : INITIAL_ORDERS,
        reviews: parsed.reviews?.length ? parsed.reviews : INITIAL_REVIEWS,
        coupons: parsed.coupons?.length ? parsed.coupons : INITIAL_COUPONS,
        settings: parsed.settings ? parsed.settings : INITIAL_SETTINGS,
        subscribers: parsed.subscribers || ['client1@example.com', '+221771234567'],
      };
    }
  } catch (error) {
    console.error('Error reading vayza_db.json, falling back to initial data:', error);
  }

  const initialData: DatabaseSchema = {
    products: [],
    orders: INITIAL_ORDERS,
    reviews: INITIAL_REVIEWS,
    coupons: INITIAL_COUPONS,
    settings: INITIAL_SETTINGS,
    subscribers: ['client1@example.com', '+221771234567'],
  };

  saveDatabase(initialData);
  return initialData;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving database to file:', error);
  }
}

dbState = loadDatabase();

export const db = {
  // Products
  getProducts: () => [...dbState.products],
  getProductById: (id: string) =>
    dbState.products.find((p) => p.id === id || p.slug === id || p.sku.toLowerCase() === id.toLowerCase()),
  createProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const id = `prod-${Date.now()}`;
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const createdAt = new Date().toISOString();
    
    // Compute total stock
    const totalStock = Object.values(productData.sizeStock || {}).reduce((a, b) => a + (Number(b) || 0), 0);

    const newProduct: Product = {
      ...productData,
      id,
      slug,
      totalStock,
      status: totalStock === 0 ? 'rupture' : (productData.status || 'disponible'),
      rating: productData.rating || 5.0,
      reviewCount: productData.reviewCount || 0,
      createdAt,
    };

    dbState.products.unshift(newProduct);
    saveDatabase(dbState);
    return newProduct;
  },
  updateProduct: (id: string, updates: Partial<Product>) => {
    const index = dbState.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = dbState.products[index];
    const sizeStock = updates.sizeStock ? { ...existing.sizeStock, ...updates.sizeStock } : existing.sizeStock;
    const totalStock = Object.values(sizeStock).reduce((a, b) => a + (Number(b) || 0), 0);

    const updated: Product = {
      ...existing,
      ...updates,
      sizeStock,
      totalStock,
      status: totalStock === 0 ? 'rupture' : (updates.status || existing.status),
    };

    dbState.products[index] = updated;
    saveDatabase(dbState);
    return updated;
  },
  deleteProduct: (id: string) => {
    const prevLen = dbState.products.length;
    dbState.products = dbState.products.filter((p) => p.id !== id);
    const deleted = dbState.products.length < prevLen;
    if (deleted) saveDatabase(dbState);
    return deleted;
  },

  // Orders
  getOrders: () => [...dbState.orders],
  getOrderById: (id: string) => {
    const term = id.trim().toLowerCase();
    return dbState.orders.find(
      (o) =>
        o.id.toLowerCase() === term ||
        o.id.toLowerCase().replace('#', '') === term.replace('#', '') ||
        o.customer.phone.replace(/\s+/g, '').includes(term.replace(/\s+/g, ''))
    );
  },
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const id = `#VZ-${orderNum}`;
    const createdAt = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      createdAt,
      timeline: [
        {
          status: 'recue',
          timestamp: createdAt,
          title: 'Commande reçue',
          description: 'Votre commande a été enregistrée avec succès.',
        },
      ],
    };

    // Deduct stock for ordered sizes
    orderData.items.forEach((it) => {
      const pIndex = dbState.products.findIndex((p) => p.id === it.productId);
      if (pIndex !== -1) {
        const prod = dbState.products[pIndex];
        const currentSizeQty = prod.sizeStock[it.size] || 0;
        const newSizeQty = Math.max(0, currentSizeQty - it.quantity);
        prod.sizeStock[it.size] = newSizeQty;
        prod.totalStock = Object.values(prod.sizeStock).reduce((a, b) => a + (Number(b) || 0), 0);
        if (prod.totalStock === 0) prod.status = 'rupture';
      }
    });

    dbState.orders.unshift(newOrder);
    saveDatabase(dbState);
    return newOrder;
  },
  updateOrderStatus: (id: string, status: any) => {
    const order = dbState.orders.find((o) => o.id === id);
    if (!order) return null;

    order.status = status;
    const titles: Record<string, string> = {
      recue: 'Commande reçue',
      confirmee: 'Commande confirmée',
      preparee: 'Colis préparé',
      expediee: 'Expédiée au transporteur',
      en_livraison: 'En cours de livraison',
      livree: 'Colis livré avec succès',
      annulee: 'Commande annulée',
    };

    if (!order.timeline) order.timeline = [];
    order.timeline.push({
      status,
      timestamp: new Date().toISOString(),
      title: titles[status] || `Statut : ${status}`,
      description: `Mise à jour automatique VAYZA logistique.`,
    });

    saveDatabase(dbState);
    return order;
  },
  updatePaymentStatus: (id: string, paymentStatus: any) => {
    const order = dbState.orders.find((o) => o.id === id);
    if (!order) return null;
    order.paymentStatus = paymentStatus;
    saveDatabase(dbState);
    return order;
  },

  // Coupons
  getCoupons: () => [...dbState.coupons],
  validateCoupon: (code: string, subtotal: number) => {
    const coupon = dbState.coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
    );
    if (!coupon) {
      return { valid: false, message: 'Code promo invalide ou expiré.' };
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        valid: false,
        message: `Montant minimum requis de ${coupon.minSpend.toLocaleString()} FCFA pour utiliser ce code.`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percent') {
      discount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discount = coupon.value;
    }

    return { valid: true, coupon, discountAmount: discount };
  },
  createCoupon: (coupon: Coupon) => {
    const newCoupon = {
      ...coupon,
      id: coupon.id || `cpn-${Date.now()}`,
      code: coupon.code.toUpperCase().trim(),
    };
    dbState.coupons.push(newCoupon);
    saveDatabase(dbState);
    return newCoupon;
  },
  deleteCoupon: (id: string) => {
    dbState.coupons = dbState.coupons.filter((c) => c.id !== id && c.code !== id);
    saveDatabase(dbState);
    return true;
  },

  // Reviews
  getReviews: () => [...dbState.reviews],
  createReview: (review: Omit<CustomerReview, 'id' | 'date'>) => {
    const newReview: CustomerReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: review.status || 'approuvé',
    };
    dbState.reviews.unshift(newReview);
    saveDatabase(dbState);
    return newReview;
  },
  updateReviewStatus: (id: string, status: 'approuvé' | 'en_attente' | 'rejeté') => {
    const rev = dbState.reviews.find((r) => r.id === id);
    if (!rev) return null;
    rev.status = status;
    saveDatabase(dbState);
    return rev;
  },

  // Settings
  getSettings: () => ({ ...dbState.settings }),
  updateSettings: (updates: Partial<SiteSettings>) => {
    dbState.settings = {
      ...dbState.settings,
      ...updates,
    };
    saveDatabase(dbState);
    return dbState.settings;
  },

  // Subscribers
  getSubscribers: () => [...dbState.subscribers],
  addSubscriber: (contact: string) => {
    if (!dbState.subscribers.includes(contact)) {
      dbState.subscribers.push(contact);
      saveDatabase(dbState);
    }
    return true;
  },

  // Stats
  getStats: () => {
    const totalOrders = dbState.orders.length;
    const paidOrders = dbState.orders.filter((o) => o.paymentStatus === 'paye' || o.status === 'livree');
    const revenue = dbState.orders
      .filter((o) => o.status !== 'annulee')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    
    const pendingOrders = dbState.orders.filter(
      (o) => o.status === 'recue' || o.status === 'confirmee' || o.status === 'preparee'
    ).length;

    const lowStockProducts = dbState.products.filter((p) => p.totalStock < 5);
    const outOfStockProducts = dbState.products.filter((p) => p.totalStock === 0);

    return {
      revenue,
      totalOrders,
      pendingOrders,
      paidOrdersCount: paidOrders.length,
      totalProducts: dbState.products.length,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      subscribersCount: dbState.subscribers.length,
      averageOrderValue: totalOrders > 0 ? Math.round(revenue / totalOrders) : 0,
    };
  },
};
