import { Product, Order, CustomerReview, Coupon, SiteSettings } from '../types';

const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(params?: { category?: string; gender?: string; search?: string; sort?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getProduct(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return res.json();
  },

  async createProduct(product: Omit<Product, 'id' | 'createdAt'>) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async updateProductStock(id: string, sizeStock: Record<number, number>, status?: string) {
    const res = await fetch(`${API_BASE}/products/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sizeStock, status }),
    });
    return res.json();
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Orders
  async getOrders(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${API_BASE}/orders${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getOrder(id: string) {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    return res.json();
  },

  async createOrder(order: Omit<Order, 'id' | 'createdAt'>) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return res.json();
  },

  async updateOrderStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async updateOrderPayment(id: string, paymentStatus: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus }),
    });
    return res.json();
  },

  // Coupons
  async getCoupons() {
    const res = await fetch(`${API_BASE}/coupons`);
    return res.json();
  },

  async validateCoupon(code: string, subtotal: number) {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });
    return res.json();
  },

  async createCoupon(coupon: Coupon) {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon),
    });
    return res.json();
  },

  async deleteCoupon(id: string) {
    const res = await fetch(`${API_BASE}/coupons/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Reviews
  async getReviews(productId?: string) {
    const res = await fetch(`${API_BASE}/reviews${productId ? `?productId=${productId}` : ''}`);
    return res.json();
  },

  async createReview(review: Omit<CustomerReview, 'id' | 'date'>) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    return res.json();
  },

  async updateReviewStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/reviews/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async updateSettings(settings: Partial<SiteSettings>) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  // Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },

  // Newsletter
  async subscribeNewsletter(contact: string) {
    const res = await fetch(`${API_BASE}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact }),
    });
    return res.json();
  },

  // AI Style Advice
  async getStyleAdvice(preference?: string, occasion?: string, gender?: string) {
    const res = await fetch(`${API_BASE}/ai/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userPreference: preference, occasion, gender }),
    });
    return res.json();
  },

  // Admin Authentication
  async adminLogin(email: string, password?: string) {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async verifyAdmin(email: string, token?: string) {
    const res = await fetch(`${API_BASE}/auth/verify-admin`, {
      headers: {
        'x-admin-email': email,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res.json();
  },
};

