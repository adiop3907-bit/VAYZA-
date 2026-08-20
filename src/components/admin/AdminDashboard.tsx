import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Sliders, 
  Tag, 
  MessageSquare, 
  Settings, 
  ArrowLeft, 
  ExternalLink,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminStockMatrix } from './AdminStockMatrix';
import { AdminCoupons } from './AdminCoupons';
import { AdminReviews } from './AdminReviews';
import { AdminSettings } from './AdminSettings';

export const AdminDashboard: React.FC = () => {
  const { setCurrentView, orders, products, reviews, adminEmail, SUPER_ADMIN_EMAIL, adminLogout } = useStore();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'stock-matrix' | 'coupons' | 'reviews' | 'settings'
  >('overview');

  const pendingOrders = orders.filter((o) => o.status === 'recue' || o.status === 'confirmee').length;
  const pendingReviews = reviews.filter((r) => r.status === 'en_attente').length;

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Catalogue Produits', icon: <Package className="w-4 h-4" />, count: products.length },
    { id: 'orders', label: 'Commandes & Livraisons', icon: <ShoppingBag className="w-4 h-4" />, badge: pendingOrders > 0 ? pendingOrders : undefined },
    { id: 'stock-matrix', label: 'Matrice des Stocks', icon: <Sliders className="w-4 h-4" /> },
    { id: 'coupons', label: 'Codes Promo', icon: <Tag className="w-4 h-4" /> },
    { id: 'reviews', label: 'Avis Clients', icon: <MessageSquare className="w-4 h-4" />, badge: pendingReviews > 0 ? pendingReviews : undefined },
    { id: 'settings', label: 'CMS & Paramètres', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100/60 text-[#121212]">
      
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-gray-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCurrentView('store');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 hover:text-[#121212] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#FF6321]" />
              <span>Retour à la boutique</span>
            </button>

            <div className="h-5 w-[1px] bg-gray-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF6321] animate-pulse" />
              <span className="text-xs font-black tracking-wider text-[#121212] uppercase font-display">
                VAYZA ERP & CMS
              </span>
              <span className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-[#FF6321]/10 text-[10px] font-black text-[#FF6321] uppercase">
                Super Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{adminEmail || SUPER_ADMIN_EMAIL}</span>
            </div>

            <button
              onClick={adminLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Se déconnecter de la session administrateur"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 border-b border-gray-200">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all shadow-2xs ${
                  isActive
                    ? 'bg-[#121212] text-white shadow-md'
                    : 'bg-white/85 text-gray-600 hover:text-[#121212] hover:bg-white border border-gray-200/80'
                }`}
              >
                <span className={isActive ? 'text-[#FF6321]' : 'text-gray-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#FF6321] text-white text-[10px] font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <main>
          {activeTab === 'overview' && <AdminOverview onNavigateTab={(t: any) => setActiveTab(t)} />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'stock-matrix' && <AdminStockMatrix />}
          {activeTab === 'coupons' && <AdminCoupons />}
          {activeTab === 'reviews' && <AdminReviews />}
          {activeTab === 'settings' && <AdminSettings />}
        </main>

      </div>

    </div>
  );
};
