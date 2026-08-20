import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  CustomerReview,
  Coupon,
  SiteSettings,
  AdminRole,
  AdminUser,
  CategoryType,
  GenderType,
  PaymentMethod,
  OrderCustomer,
  HomeSectionConfig,
  CustomerUser,
  AuthModalMode,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
} from '../data/initialData';
import { api } from '../utils/api';
import { db, auth, googleProvider, handleFirestoreError, OperationType, testFirestoreConnection } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  onSnapshot, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';

export type AppView = 
  | 'store' 
  | 'catalog' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'order-tracking' 
  | 'account' 
  | 'wishlist' 
  | 'about' 
  | 'contact' 
  | 'size-guide' 
  | 'admin';

export type AdminTab = 
  | 'dashboard' 
  | 'products' 
  | 'stock' 
  | 'orders' 
  | 'appearance' 
  | 'coupons' 
  | 'reviews' 
  | 'customers' 
  | 'security';

interface StoreContextType {
  // Navigation & Views
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  notification: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;

  // Products
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'slug' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateSizeStock: (productId: string, size: number, newStock: number) => void;
  toggleProductStatus: (productId: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: number, color: string, quantity?: number) => void;
  updateCartItemQty: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  selectedDeliveryZoneId: string;
  setSelectedDeliveryZoneId: (zoneId: string) => void;
  deliveryFee: number;
  appliedCoupon: Coupon | null;
  couponCodeInput: string;
  setCouponCodeInput: (code: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discountAmount: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (
    customer: OrderCustomer,
    paymentMethod: PaymentMethod,
    notes?: string,
    customTxnRef?: string
  ) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;

  // Reviews
  reviews: CustomerReview[];
  addReview: (productId: string, productName: string, author: string, rating: number, comment: string, location: string) => void;
  approveReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;

  // CMS Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;
  reorderHomeSections: (fromIndex: number, toIndex: number) => void;
  toggleHomeSection: (id: string, isEnabled: boolean) => void;

  // Customer Security & Authentication
  customer: CustomerUser;
  isCustomerAuthenticated: boolean;
  customerLogin: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  customerRegister: (data: Partial<CustomerUser>, password?: string) => Promise<{ success: boolean; message?: string }>;
  customerGoogleLogin: () => Promise<{ success: boolean; message?: string }>;
  customerLogout: () => void;
  updateCustomerProfile: (updates: Partial<CustomerUser>) => void;

  // Auth Modal (Connexion / Inscription)
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: AuthModalMode;
  setAuthModalMode: (mode: AuthModalMode) => void;
  openAuthModal: (mode?: AuthModalMode) => void;

  // Wishlist Drawer (Favoris on same page)
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Splash Screen
  isSplashScreenOpen: boolean;
  setIsSplashScreenOpen: (open: boolean) => void;
  triggerSplashScreen: () => void;

  // Admin Security & Authentication
  SUPER_ADMIN_EMAIL: string;
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  adminUser: AdminUser | null;
  adminLogin: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  adminLogout: () => void;
  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;
  isMobileAdminPreview: boolean;
  setIsMobileAdminPreview: (active: boolean) => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Storage loader with fallbacks (Demo products purged for user's own inventory)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const purgeKey = 'vayza_demo_purged_v2';
      if (!localStorage.getItem(purgeKey)) {
        localStorage.setItem(purgeKey, 'true');
        localStorage.removeItem('vayza_products');
        localStorage.removeItem('vayza_wishlist');
        localStorage.removeItem('vayza_cart');
        return [];
      }
      const saved = localStorage.getItem('vayza_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? parsed.filter((p: Product) => !p.id?.match(/^prod-([1-9]|1[0-2])$/))
          : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('vayza_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('vayza_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('vayza_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('vayza_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vayza_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vayza_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? parsed.filter((id: string) => !id?.match(/^prod-([1-9]|1[0-2])$/))
          : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  // UI state
  const [currentView, setCurrentView] = useState<AppView>('store');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isSplashScreenOpen, setIsSplashScreenOpen] = useState<boolean>(true);
  const [selectedDeliveryZoneId, setSelectedDeliveryZoneId] = useState<string>('zone-1');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const SUPER_ADMIN_EMAIL = 'senjaaba221@gmail.com';

  const triggerSplashScreen = () => {
    setIsSplashScreenOpen(true);
  };

  // Customer Authentication & Profile State
  const DEFAULT_CUSTOMER: CustomerUser = {
    email: '',
    firstName: 'Invité',
    lastName: 'VAYZA',
    phone: '+221 77 000 00 00',
    whatsapp: '+221 77 000 00 00',
    address: 'Dakar Plateau, Sénégal',
    city: 'Dakar',
    deliveryZone: 'Dakar Centre & Almadies',
    preferredSize: 42,
    isAuthenticated: false,
  };

  const [customer, setCustomer] = useState<CustomerUser>(() => {
    try {
      const saved = localStorage.getItem('vayza_customer_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_CUSTOMER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');

  const openAuthModal = (mode: AuthModalMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Admin authentication state (strictly for senjaaba221@gmail.com)
  const [adminAuth, setAdminAuth] = useState<{ isAuthenticated: boolean; email: string | null; role: AdminRole }>(() => {
    try {
      const saved = localStorage.getItem('vayza_admin_auth');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isAuthenticated && parsed.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
          return { isAuthenticated: true, email: SUPER_ADMIN_EMAIL, role: 'super_admin' };
        }
      }
      return { isAuthenticated: false, email: null, role: 'super_admin' };
    } catch {
      return { isAuthenticated: false, email: null, role: 'super_admin' };
    }
  });

  const [adminRole, setAdminRole] = useState<AdminRole>(adminAuth.role || 'super_admin');
  const [isMobileAdminPreview, setIsMobileAdminPreview] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  const adminUser = adminAuth.isAuthenticated
    ? {
        id: 'admin-super-1',
        name: 'Direction VAYZA',
        email: SUPER_ADMIN_EMAIL,
        role: adminRole,
        lastLogin: new Date().toISOString(),
      }
    : null;

  const customerLogin = async (emailInput: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const emailNorm = emailInput.trim().toLowerCase();
    if (!emailNorm || !emailNorm.includes('@')) {
      return { success: false, message: 'Veuillez saisir une adresse email valide.' };
    }

    // If it's super admin, connect admin too
    if (emailNorm === SUPER_ADMIN_EMAIL.toLowerCase()) {
      await adminLogin(emailNorm, password);
    }

    let existingProfile: Partial<CustomerUser> | null = null;
    try {
      const userDoc = await getDoc(doc(db, 'customers', emailNorm.replace(/[^a-zA-Z0-9]/g, '_')));
      if (userDoc.exists()) {
        existingProfile = userDoc.data() as Partial<CustomerUser>;
      }
    } catch (e) {
      console.warn('Firestore load customer profile:', e);
    }

    const defaultFirstName = emailNorm.split('@')[0];
    const capitalizedName = defaultFirstName.charAt(0).toUpperCase() + defaultFirstName.slice(1);

    const updatedUser: CustomerUser = {
      email: emailNorm,
      firstName: existingProfile?.firstName || (customer.firstName !== 'Invité' ? customer.firstName : capitalizedName),
      lastName: existingProfile?.lastName || (customer.lastName !== 'VAYZA' ? customer.lastName : 'Client'),
      phone: existingProfile?.phone || (customer.phone !== '+221 77 000 00 00' ? customer.phone : '+221 77 123 45 67'),
      whatsapp: existingProfile?.whatsapp || customer.whatsapp || '+221 77 123 45 67',
      address: existingProfile?.address || customer.address || 'Almadies, Dakar',
      city: existingProfile?.city || 'Dakar',
      deliveryZone: existingProfile?.deliveryZone || 'Dakar Centre & Almadies',
      preferredSize: existingProfile?.preferredSize || customer.preferredSize || 42,
      isAuthenticated: true,
      createdAt: existingProfile?.createdAt || new Date().toISOString(),
    };

    setCustomer(updatedUser);
    try {
      localStorage.setItem('vayza_customer_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn(e);
    }

    setDoc(doc(db, 'customers', emailNorm.replace(/[^a-zA-Z0-9]/g, '_')), updatedUser, { merge: true }).catch((err) => {
      console.warn('Firestore save customer error:', err);
    });

    setIsAuthModalOpen(false);
    showNotification(`Connexion réussie ! Heureux de vous revoir, ${updatedUser.firstName}.`, 'success');
    return { success: true };
  };

  const customerRegister = async (data: Partial<CustomerUser>, password?: string): Promise<{ success: boolean; message?: string }> => {
    const emailNorm = (data.email || '').trim().toLowerCase();
    if (!emailNorm || !emailNorm.includes('@')) {
      return { success: false, message: 'Veuillez indiquer une adresse email valide.' };
    }
    if (!data.firstName || !data.lastName) {
      return { success: false, message: 'Veuillez renseigner votre prénom et nom.' };
    }

    const newUser: CustomerUser = {
      email: emailNorm,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone?.trim() || '+221 77 845 12 90',
      whatsapp: data.whatsapp?.trim() || data.phone?.trim() || '+221 77 845 12 90',
      address: data.address?.trim() || 'Dakar, Sénégal',
      city: data.city?.trim() || 'Dakar',
      deliveryZone: data.deliveryZone || 'Dakar Centre & Almadies',
      preferredSize: data.preferredSize || 42,
      isAuthenticated: true,
      createdAt: new Date().toISOString(),
    };

    setCustomer(newUser);
    try {
      localStorage.setItem('vayza_customer_user', JSON.stringify(newUser));
    } catch (e) {
      console.warn(e);
    }

    setDoc(doc(db, 'customers', emailNorm.replace(/[^a-zA-Z0-9]/g, '_')), newUser, { merge: true }).catch((err) => {
      console.warn('Firestore save new customer error:', err);
    });

    if (emailNorm === SUPER_ADMIN_EMAIL.toLowerCase()) {
      await adminLogin(emailNorm, password);
    }

    setIsAuthModalOpen(false);
    showNotification(`Compte créé avec succès ! Bienvenue au VAYZA Club, ${newUser.firstName}.`, 'success');
    return { success: true };
  };

  const customerGoogleLogin = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const user = cred.user;
      const userEmail = (user.email || '').toLowerCase();
      const displayName = user.displayName || '';
      const parts = displayName.split(' ');
      const firstName = parts[0] || 'Client';
      const lastName = parts.slice(1).join(' ') || 'VAYZA';

      const googleUser: CustomerUser = {
        uid: user.uid,
        email: userEmail,
        firstName: customer.firstName && customer.firstName !== 'Invité' ? customer.firstName : firstName,
        lastName: customer.lastName && customer.lastName !== 'VAYZA' ? customer.lastName : lastName,
        phone: customer.phone !== '+221 77 000 00 00' ? customer.phone : '+221 77 845 12 90',
        whatsapp: customer.whatsapp || '+221 77 845 12 90',
        address: customer.address || 'Dakar, Sénégal',
        city: 'Dakar',
        deliveryZone: 'Dakar Centre & Almadies',
        preferredSize: customer.preferredSize || 42,
        isAuthenticated: true,
        createdAt: new Date().toISOString(),
      };

      setCustomer(googleUser);
      try {
        localStorage.setItem('vayza_customer_user', JSON.stringify(googleUser));
      } catch (e) {
        console.warn(e);
      }

      setDoc(doc(db, 'customers', userEmail.replace(/[^a-zA-Z0-9]/g, '_')), googleUser, { merge: true }).catch((err) => {
        console.warn('Firestore Google customer sync:', err);
      });

      if (userEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
        await adminLogin(SUPER_ADMIN_EMAIL);
      }

      setIsAuthModalOpen(false);
      showNotification(`Connexion Google réussie ! Bienvenue ${googleUser.firstName}.`, 'success');
      return { success: true };
    } catch (err: any) {
      console.warn('Google sign in error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Connexion Google annulée.' };
      }
      return { success: false, message: 'Erreur lors de la connexion Google.' };
    }
  };

  const customerLogout = () => {
    const unauthenticatedUser: CustomerUser = {
      ...DEFAULT_CUSTOMER,
      isAuthenticated: false,
    };
    setCustomer(unauthenticatedUser);
    try {
      localStorage.removeItem('vayza_customer_user');
    } catch (e) {
      console.warn(e);
    }
    signOut(auth).catch((e) => console.warn('Firebase sign out:', e));

    if (adminAuth.isAuthenticated) {
      setAdminAuth({ isAuthenticated: false, email: null, role: 'super_admin' });
      try {
        localStorage.removeItem('vayza_admin_auth');
      } catch (e) {
        console.warn(e);
      }
    }

    showNotification('Vous avez été déconnecté avec succès.', 'info');
  };

  const updateCustomerProfile = (updates: Partial<CustomerUser>) => {
    setCustomer((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('vayza_customer_user', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      if (updated.email) {
        setDoc(doc(db, 'customers', updated.email.replace(/[^a-zA-Z0-9]/g, '_')), updated, { merge: true }).catch((err) => {
          console.warn('Firestore update customer profile error:', err);
        });
      }
      return updated;
    });
    showNotification('Profil client mis à jour avec succès.', 'success');
  };

  const adminLogin = async (emailInput: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const normalized = emailInput.trim().toLowerCase();
    if (normalized !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      return {
        success: false,
        message: `Accès refusé. Seule l'adresse ${SUPER_ADMIN_EMAIL} est autorisée à accéder à l'administration du site.`,
      };
    }

    try {
      // Call backend auth if available
      await api.adminLogin(normalized, password);
    } catch (e) {
      console.warn('Backend admin auth fallback:', e);
    }

    const authData = { isAuthenticated: true, email: SUPER_ADMIN_EMAIL, role: 'super_admin' as AdminRole };
    setAdminAuth(authData);
    setAdminRole('super_admin');
    try {
      localStorage.setItem('vayza_admin_auth', JSON.stringify(authData));
    } catch (e) {
      console.warn(e);
    }

    setCurrentView('admin');
    return { success: true };
  };

  const adminLogout = () => {
    setAdminAuth({ isAuthenticated: false, email: null, role: 'super_admin' });
    try {
      localStorage.removeItem('vayza_admin_auth');
    } catch (e) {
      console.warn(e);
    }
    signOut(auth).catch((e) => console.warn('Firebase sign out:', e));
    if (currentView === 'admin') {
      setCurrentView('store');
    }
    showNotification('Session administrateur déconnectée avec succès.', 'info');
  };

  // Firebase Auth State Listener (Restricted strictly to senjaaba221@gmail.com)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const userEmail = user.email.toLowerCase();
        if (userEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
          const authData = { isAuthenticated: true, email: SUPER_ADMIN_EMAIL, role: 'super_admin' as AdminRole };
          setAdminAuth(authData);
          setAdminRole('super_admin');
          try {
            localStorage.setItem('vayza_admin_auth', JSON.stringify(authData));
          } catch (e) {
            console.warn(e);
          }
        } else {
          // If another non-admin account is signed in, reject admin permissions
          signOut(auth).catch(() => {});
          setAdminAuth({ isAuthenticated: false, email: null, role: 'super_admin' });
          if (currentView === 'admin') {
            setCurrentView('store');
          }
        }
      }
    });

    return () => unsubscribeAuth();
  }, [SUPER_ADMIN_EMAIL, currentView]);

  // Firestore Real-time Listeners and Initial Load
  useEffect(() => {
    testFirestoreConnection();

    // 1. Products Listener (Filter out any legacy demo products)
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedProducts: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Product;
            if (!data.id?.match(/^prod-([1-9]|1[0-2])$/)) {
              loadedProducts.push(data);
            }
          });
          setProducts(loadedProducts);
        } else {
          setProducts([]);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );

    // 2. Reviews Listener
    const unsubReviews = onSnapshot(
      collection(db, 'reviews'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedReviews: CustomerReview[] = [];
          snapshot.forEach((docSnap) => {
            loadedReviews.push(docSnap.data() as CustomerReview);
          });
          if (loadedReviews.length > 0) {
            setReviews(loadedReviews);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'reviews');
      }
    );

    // 3. Coupons Listener
    const unsubCoupons = onSnapshot(
      collection(db, 'coupons'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedCoupons: Coupon[] = [];
          snapshot.forEach((docSnap) => {
            loadedCoupons.push(docSnap.data() as Coupon);
          });
          if (loadedCoupons.length > 0) {
            setCoupons(loadedCoupons);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'coupons');
      }
    );

    // 4. Site Settings Listener
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'store_config'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSiteSettings(docSnap.data() as SiteSettings);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/store_config');
      }
    );

    // 5. Orders Listener (when admin is authenticated)
    let unsubOrders: (() => void) | undefined;
    if (adminAuth.isAuthenticated) {
      unsubOrders = onSnapshot(
        collection(db, 'orders'),
        (snapshot) => {
          if (!snapshot.empty) {
            const loadedOrders: Order[] = [];
            snapshot.forEach((docSnap) => {
              loadedOrders.push(docSnap.data() as Order);
            });
            if (loadedOrders.length > 0) {
              setOrders(loadedOrders);
            }
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'orders');
        }
      );
    }

    return () => {
      unsubProducts();
      unsubReviews();
      unsubCoupons();
      unsubSettings();
      if (unsubOrders) unsubOrders();
    };
  }, [adminAuth.isAuthenticated]);

  // Initial sync with backend API as secondary fallback
  useEffect(() => {
    async function syncBackendData() {
      try {
        const [prodRes, orderRes, setRes, cpnRes, revRes] = await Promise.allSettled([
          api.getProducts(),
          api.getOrders(),
          api.getSettings(),
          api.getCoupons(),
          api.getReviews(),
        ]);

        if (prodRes.status === 'fulfilled' && prodRes.value.success && prodRes.value.products?.length) {
          setProducts((prev) => (prev.length === 0 ? prodRes.value.products : prev));
        }
        if (orderRes.status === 'fulfilled' && orderRes.value.success && orderRes.value.orders?.length) {
          setOrders((prev) => (prev.length === 0 ? orderRes.value.orders : prev));
        }
        if (setRes.status === 'fulfilled' && setRes.value.success && setRes.value.settings) {
          setSiteSettings((prev) => prev || setRes.value.settings);
        }
      } catch (err) {
        console.warn('Backend sync secondary fallback note:', err);
      }
    }

    syncBackendData();
  }, []);

  // Auto-sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vayza_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('vayza_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('vayza_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('vayza_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('vayza_settings', JSON.stringify(siteSettings));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('vayza_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('vayza_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [wishlistIds]);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Product actions
  const addProduct = (productData: Omit<Product, 'id' | 'slug' | 'createdAt'>): Product => {
    const id = `prod-${Date.now()}`;
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const totalStock = Object.values(productData.sizeStock || {}).reduce((acc, qty) => acc + qty, 0);

    const newProduct: Product = {
      ...productData,
      id,
      slug,
      totalStock,
      status: totalStock > 0 ? 'disponible' : 'rupture',
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);
    showNotification(`Modèle "${newProduct.name}" publié avec succès !`, 'success');
    api.createProduct(newProduct).catch((err) => console.warn('API create product failed:', err));
    setDoc(doc(db, 'products', newProduct.id), newProduct).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `products/${newProduct.id}`);
    });
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    let updatedProd: Product | undefined;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates };
        if (updates.sizeStock) {
          const total = Object.values(updates.sizeStock).reduce((acc, q) => acc + q, 0);
          updated.totalStock = total;
          if (total === 0 && updated.status !== 'brouillon') {
            updated.status = 'rupture';
          } else if (total > 0 && updated.status === 'rupture') {
            updated.status = 'disponible';
          }
        }
        updatedProd = updated;
        return updated;
      })
    );
    showNotification('Produit mis à jour.', 'success');
    api.updateProduct(id, updates).catch((err) => console.warn('API update product failed:', err));
    if (updatedProd) {
      setDoc(doc(db, 'products', id), updatedProd, { merge: true }).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
      });
    }
  };

  const deleteProduct = (id: string) => {
    const p = products.find((x) => x.id === id);
    setProducts((prev) => prev.filter((item) => item.id !== id));
    showNotification(`Le produit ${p?.name || ''} a été supprimé.`, 'info');
    api.deleteProduct(id).catch((err) => console.warn('API delete product failed:', err));
    deleteDoc(doc(db, 'products', id)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    });
  };

  const updateSizeStock = (productId: string, size: number, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedSizeStock = { ...p.sizeStock, [size]: Math.max(0, newStock) };
        const total = Object.values(updatedSizeStock).reduce((acc: number, q: any) => acc + (Number(q) || 0), 0);
        return {
          ...p,
          sizeStock: updatedSizeStock,
          totalStock: total,
          status: (Number(total) > 0 ? (p.status === 'brouillon' ? 'brouillon' : 'disponible') : 'rupture') as 'disponible' | 'rupture' | 'brouillon',
        };
      })
    );
  };

  const toggleProductStatus = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const nextStatus = p.status === 'disponible' ? 'rupture' : 'disponible';
        return { ...p, status: nextStatus };
      })
    );
  };

  // Cart actions
  const addToCart = (product: Product, size: number, color: string, quantity = 1) => {
    // Check available stock
    const available = product.sizeStock[size] || 0;
    if (available <= 0) {
      showNotification(`Désolé, la pointure EU ${size} est actuellement en rupture de stock.`, 'warning');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        const newQty = Math.min(newCart[existingIndex].quantity + quantity, available);
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newQty,
        };
        return newCart;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            size,
            color,
            quantity: Math.min(quantity, available),
          },
        ];
      }
    });

    showNotification(`${product.name} (Taille ${size}) ajouté au panier !`, 'success');
  };

  const updateCartItemQty = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const newCart = [...prev];
      if (newCart[index]) {
        const item = newCart[index];
        const maxStock = item.product.sizeStock[item.size] || 99;
        newCart[index] = {
          ...item,
          quantity: Math.min(quantity, maxStock),
        };
      }
      return newCart;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showNotification('Article retiré du panier.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponCodeInput('');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const selectedZone = siteSettings.deliveryZones.find((z) => z.id === selectedDeliveryZoneId);
  const deliveryFee = cart.length > 0 ? (selectedZone ? selectedZone.fee : 2000) : 0;

  // Coupon handling
  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);

    if (!found) {
      showNotification('Code promo invalide ou expiré.', 'error');
      return false;
    }

    if (cartSubtotal < found.minOrder) {
      showNotification(`Ce code nécessite un minimum d'achat de ${found.minOrder} FCFA.`, 'warning');
      return false;
    }

    setAppliedCoupon(found);
    showNotification(`Code promo "${found.code}" appliqué avec succès !`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    showNotification('Code promo retiré.', 'info');
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percent'
      ? Math.round((cartSubtotal * appliedCoupon.value) / 100)
      : Math.min(appliedCoupon.value, cartSubtotal)
    : 0;

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        showNotification('Retiré des favoris.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showNotification('Ajouté à votre liste d\'envies ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  // Order placement & Automatic Stock Decrement
  const createOrder = (
    customer: OrderCustomer,
    paymentMethod: PaymentMethod,
    notes?: string,
    customTxnRef?: string
  ): Order => {
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const orderId = `#VZ-${orderNumber}`;
    const zone = siteSettings.deliveryZones.find((z) => z.id === selectedDeliveryZoneId);
    const zoneName = zone ? zone.name : 'Dakar Express';

    const orderItems = cart.map((c) => ({
      productId: c.productId,
      name: c.product.name,
      image: c.product.images[c.product.primaryImageIndex || 0] || c.product.images[0],
      size: c.size,
      color: c.color,
      price: c.product.price,
      quantity: c.quantity,
    }));

    const now = new Date();
    const formattedTimestamp = now.toISOString().slice(0, 16).replace('T', ' ');

    let generatedTxnRef = customTxnRef;
    if (!generatedTxnRef && paymentMethod !== 'cod') {
      const prefix = paymentMethod === 'wave' ? 'TXN-WAVE' : paymentMethod === 'orange_money' ? 'TXN-OM' : paymentMethod === 'yas' ? 'TXN-YAS' : 'TXN-PAY';
      generatedTxnRef = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    const newOrder: Order = {
      id: orderId,
      customer,
      deliveryZone: zoneName,
      deliveryFee,
      items: orderItems,
      subtotal: cartSubtotal,
      discountAmount,
      total: cartTotal,
      promoCodeUsed: appliedCoupon?.code,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'en_attente' : 'paye',
      status: paymentMethod === 'cod' ? 'nouvelle' : 'payee',
      transactionRef: generatedTxnRef,
      paidAt: paymentMethod !== 'cod' ? now.toISOString() : undefined,
      timeline: [
        {
          status: 'nouvelle',
          timestamp: formattedTimestamp,
          title: 'Commande enregistrée',
          description: `Commande ${orderId} créée avec succès par ${customer.firstName} ${customer.lastName}.`,
        },
        ...(paymentMethod !== 'cod'
          ? [
              {
                status: 'payee' as OrderStatus,
                timestamp: formattedTimestamp,
                title: `Paiement ${paymentMethod.toUpperCase().replace('_', ' ')} validé en ligne`,
                description: `Règlement direct de ${cartTotal} FCFA confirmé sur le site (${generatedTxnRef}).`,
              },
            ]
          : []),
      ],
      notes,
      createdAt: now.toISOString(),
    };

    // 1. Save new order
    setOrders((prev) => [newOrder, ...prev]);

    // 2. AUTOMATIC STOCK DECREMENT FOR EACH PRODUCT & SIZE!
    setProducts((prevProducts) => {
      return prevProducts.map((prod) => {
        const orderMatches = cart.filter((item) => item.productId === prod.id);
        if (orderMatches.length === 0) return prod;

        const newSizeStock = { ...prod.sizeStock };
        orderMatches.forEach((match) => {
          const currentQty = newSizeStock[match.size] || 0;
          newSizeStock[match.size] = Math.max(0, currentQty - match.quantity);
        });

        const total = Object.values(newSizeStock).reduce((acc: number, q: any) => acc + (Number(q) || 0), 0);

        return {
          ...prod,
          sizeStock: newSizeStock,
          totalStock: total,
          status: (Number(total) > 0 ? prod.status : 'rupture') as 'disponible' | 'rupture' | 'brouillon',
        };
      });
    });

    // 3. Increment coupon usage if used
    if (appliedCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.code === appliedCoupon.code ? { ...c, currentUses: c.currentUses + 1 } : c
        )
      );
    }

    setLastCreatedOrder(newOrder);
    clearCart();
    api.createOrder(newOrder).catch((err) => console.warn('API create order failed:', err));
    setDoc(doc(db, 'orders', newOrder.id.replace('#', '')), newOrder).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `orders/${newOrder.id}`);
    });
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const statusTitles: Record<OrderStatus, string> = {
      recue: 'Commande reçue',
      nouvelle: 'Commande enregistrée',
      confirmee: 'Commande confirmée',
      preparee: 'En cours de préparation',
      payee: 'Paiement validé',
      en_preparation: 'En cours de préparation',
      expediee: 'Expédiée du dépôt VAYZA',
      en_livraison: 'En cours de livraison avec le coursier',
      livree: 'Colis livré au client',
      annulee: 'Commande annulée',
      retour: 'Retour produit enregistré',
    };

    const statusDescriptions: Record<OrderStatus, string> = {
      recue: 'La commande a été reçue et mise en attente.',
      nouvelle: 'La commande a été reçue et mise en attente.',
      confirmee: 'La commande et les coordonnées ont été vérifiées.',
      preparee: 'Votre paire de chaussures est emballée dans la boîte signature VAYZA.',
      payee: 'Le paiement a été validé avec succès.',
      en_preparation: 'Votre paire de chaussures est emballée dans la boîte signature VAYZA.',
      expediee: 'Le colis a quitté notre entrepôt de Dakar.',
      en_livraison: 'Le livreur est en route pour votre adresse.',
      livree: 'Votre commande a été livrée avec succès.',
      annulee: 'La commande a été annulée.',
      retour: 'Le retour ou l\'échange de pointure a été réceptionné.',
    };

    const now = new Date();
    const formattedTimestamp = now.toISOString().slice(0, 16).replace('T', ' ');

    let updatedOrderObj: Order | undefined;
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const newTimelineEvent = {
          status: newStatus,
          timestamp: formattedTimestamp,
          title: statusTitles[newStatus],
          description: note || statusDescriptions[newStatus],
        };

        const updatedTimeline = [...order.timeline, newTimelineEvent];

        const updated: Order = {
          ...order,
          status: newStatus,
          paymentStatus: (newStatus === 'payee' || newStatus === 'livree') ? 'paye' : order.paymentStatus,
          timeline: updatedTimeline,
        };
        updatedOrderObj = updated;
        return updated;
      })
    );

    showNotification(`Statut de ${orderId} passé à "${statusTitles[newStatus]}".`, 'success');
    api.updateOrderStatus(orderId, newStatus).catch((err) => console.warn('API update order status failed:', err));
    if (updatedOrderObj) {
      setDoc(doc(db, 'orders', orderId.replace('#', '')), updatedOrderObj, { merge: true }).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      });
    }
  };

  const getOrderById = (orderId: string) => {
    const clean = orderId.trim().toUpperCase();
    return orders.find((o) => o.id.toUpperCase() === clean || o.id.replace('#', '').toUpperCase() === clean);
  };

  // Reviews
  const addReview = (
    productId: string,
    productName: string,
    author: string,
    rating: number,
    comment: string,
    location: string
  ) => {
    const newReview: CustomerReview = {
      id: `rev-${Date.now()}`,
      productId,
      productName,
      author,
      rating,
      comment,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      verifiedPurchase: true,
      location,
      status: 'approuvé',
    };
    setReviews((prev) => [newReview, ...prev]);
    showNotification('Merci pour votre avis ! Il a été publié.', 'success');
    api.createReview(newReview).catch((err) => console.warn('API create review failed:', err));
    setDoc(doc(db, 'reviews', newReview.id), newReview).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `reviews/${newReview.id}`);
    });
  };

  const approveReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: 'approuvé' } : r))
    );
    showNotification('Avis approuvé.', 'success');
    api.updateReviewStatus(reviewId, 'approuvé').catch((err) => console.warn('API approve review failed:', err));
    setDoc(doc(db, 'reviews', reviewId), { status: 'approuvé' }, { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `reviews/${reviewId}`);
    });
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    showNotification('Avis supprimé.', 'info');
    deleteDoc(doc(db, 'reviews', reviewId)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `reviews/${reviewId}`);
    });
  };

  // Coupons
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showNotification(`Code promo "${coupon.code}" créé avec succès !`, 'success');
    api.createCoupon(coupon).catch((err) => console.warn('API create coupon failed:', err));
    setDoc(doc(db, 'coupons', coupon.code), coupon).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `coupons/${coupon.code}`);
    });
  };

  const updateCoupon = (code: string, updates: Partial<Coupon>) => {
    let updatedC: Coupon | undefined;
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.code === code) {
          const u = { ...c, ...updates };
          updatedC = u;
          return u;
        }
        return c;
      })
    );
    showNotification(`Code promo "${code}" mis à jour.`, 'success');
    if (updatedC) {
      setDoc(doc(db, 'coupons', code), updatedC, { merge: true }).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `coupons/${code}`);
      });
    }
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showNotification('Code promo supprimé.', 'info');
    api.deleteCoupon(code).catch((err) => console.warn('API delete coupon failed:', err));
    deleteDoc(doc(db, 'coupons', code)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `coupons/${code}`);
    });
  };

  // CMS Visual Settings & Drag-and-drop Reordering
  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    let updatedS: SiteSettings | undefined;
    setSiteSettings((prev) => {
      const u = { ...prev, ...updates };
      updatedS = u;
      return u;
    });
    showNotification('Apparence du site enregistrée sans coder !', 'success');
    api.updateSettings(updates).catch((err) => console.warn('API update settings failed:', err));
    if (updatedS) {
      setDoc(doc(db, 'settings', 'store_config'), updatedS, { merge: true }).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, 'settings/store_config');
      });
    }
  };

  const reorderHomeSections = (fromIndex: number, toIndex: number) => {
    setSiteSettings((prev) => {
      const sections = [...prev.homeSections];
      const [moved] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, moved);
      // re-index order numbers
      const updated = sections.map((sec, idx) => ({ ...sec, order: idx + 1 }));
      return { ...prev, homeSections: updated };
    });
    showNotification('Ordre des sections de la page d\'accueil mis à jour !', 'success');
  };

  const toggleHomeSection = (id: string, isEnabled: boolean) => {
    setSiteSettings((prev) => ({
      ...prev,
      homeSections: prev.homeSections.map((sec) =>
        sec.id === id ? { ...sec, isEnabled } : sec
      ),
    }));
    showNotification(`Section ${isEnabled ? 'activée' : 'masquée'}.`, 'info');
  };

  const resetToDefaults = () => {
    setProducts([]);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    setCoupons(INITIAL_COUPONS);
    setSiteSettings(INITIAL_SETTINGS);
    setCart([]);
    setWishlistIds([]);
    showNotification('Catalogue réinitialisé (0 produit démo). Prêt pour vos publications.', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        selectedProduct,
        setSelectedProduct,
        selectedCategory,
        setSelectedCategory,
        selectedGender,
        setSelectedGender,
        searchQuery,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        notification,
        showNotification,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSizeStock,
        toggleProductStatus,

        cart,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        selectedDeliveryZoneId,
        setSelectedDeliveryZoneId,
        deliveryFee,
        appliedCoupon,
        couponCodeInput,
        setCouponCodeInput,
        applyCoupon,
        removeCoupon,
        discountAmount,
        cartTotal,

        wishlist: wishlistIds,
        wishlistIds,
        toggleWishlist,
        isWishlisted,

        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        lastCreatedOrder,
        setLastCreatedOrder,

        reviews,
        addReview,
        approveReview,
        deleteReview,

        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,

        siteSettings,
        updateSiteSettings,
        reorderHomeSections,
        toggleHomeSection,

        customer,
        isCustomerAuthenticated: customer.isAuthenticated,
        customerLogin,
        customerRegister,
        customerGoogleLogin,
        customerLogout,
        updateCustomerProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,

        isWishlistOpen,
        setIsWishlistOpen,

        isSplashScreenOpen,
        setIsSplashScreenOpen,
        triggerSplashScreen,

        SUPER_ADMIN_EMAIL,
        isAdminAuthenticated: adminAuth.isAuthenticated,
        adminEmail: adminAuth.email,
        adminUser,
        adminLogin,
        adminLogout,
        adminRole,
        setAdminRole,
        isMobileAdminPreview,
        setIsMobileAdminPreview,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
