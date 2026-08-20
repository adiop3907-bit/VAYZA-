import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  ArrowUpRight,
  Sparkles,
  Users,
  Flame
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA, formatDateTime } from '../../utils/formatters';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { products, orders, reviews } = useStore();

  // Metrics calculation
  const totalRevenue = orders
    .filter((o) => o.status !== 'annulee')
    .reduce((acc, curr) => acc + curr.total, 0);

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'recue' || o.status === 'confirmee').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'livree').length;

  const totalUnitsInStock = products.reduce((acc, p) => acc + p.totalStock, 0);
  const outOfStockProducts = products.filter((p) => p.totalStock <= 0 || p.status === 'rupture');
  const lowStockProducts = products.filter((p) => p.totalStock > 0 && p.totalStock <= 5);

  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Recent 5 orders
  const recentOrders = [...orders].reverse().slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn text-[#121212]">
      
      {/* Top Banner KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Chiffre d'Affaires */}
        <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 space-y-2 shadow-lg shadow-gray-200/50">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Chiffre d'Affaires</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#121212] font-display">{formatFCFA(totalRevenue)}</div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span>+18.4% ce mois</span>
            <span className="text-gray-400">• {orders.length} commandes</span>
          </div>
        </div>

        {/* KPI 2: Commandes en cours */}
        <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 space-y-2 shadow-lg shadow-gray-200/50">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Commandes à Traiter</span>
            <div className="p-2.5 bg-orange-50 text-[#FF6321] rounded-2xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#121212] font-display">{pendingOrdersCount}</div>
          <div className="text-[11px] text-gray-500 font-medium">
            {deliveredOrdersCount} déjà livrées avec succès
          </div>
        </div>

        {/* KPI 3: Panier Moyen */}
        <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 space-y-2 shadow-lg shadow-gray-200/50">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Panier Moyen</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#121212] font-display">{formatFCFA(averageOrderValue)}</div>
          <div className="text-[11px] text-gray-500 font-medium">
            Moyenne de 1.4 paire(s) / commande
          </div>
        </div>

        {/* KPI 4: Stock Disponible */}
        <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 space-y-2 shadow-lg shadow-gray-200/50">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Inventaire Réel</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#121212] font-display">{totalUnitsInStock} paires</div>
          <div className="text-[11px] text-gray-500">
            {outOfStockProducts.length > 0 ? (
              <span className="text-rose-600 font-semibold">{outOfStockProducts.length} modèle(s) en rupture</span>
            ) : (
              <span className="text-emerald-700 font-semibold">Tous les modèles disponibles</span>
            )}
          </div>
        </div>

      </div>

      {/* Main split: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Orders Table */}
        <div className="lg:col-span-8 p-6 sm:p-8 bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl space-y-5 shadow-xl shadow-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[#121212] font-display uppercase tracking-tight">
                Dernières Commandes Clients
              </h3>
              <p className="text-xs text-gray-500">Flux d'achats en temps réel sur la boutique VAYZA</p>
            </div>

            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-[#FF6321] hover:underline flex items-center gap-1"
            >
              <span>Voir tout ({orders.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase font-semibold">
                  <th className="pb-3">Réf</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Articles</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Paiement</th>
                  <th className="pb-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#121212]">{ord.id}</td>
                    <td className="py-3">
                      <div className="font-semibold text-[#121212]">{ord.customer.firstName} {ord.customer.lastName}</div>
                      <div className="text-gray-400 text-[10px]">{ord.customer.city}</div>
                    </td>
                    <td className="py-3 text-gray-600">
                      {ord.items.length} paire(s)
                    </td>
                    <td className="py-3 font-bold text-[#121212]">{formatFCFA(ord.total)}</td>
                    <td className="py-3">
                      <span className="uppercase font-mono text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        ord.status === 'livree'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ord.status === 'annulee'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ord.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Stock Health & Best Sellers */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Stock Alerts Card */}
          <div className="p-6 bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl space-y-4 shadow-xl shadow-gray-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#121212] uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Alertes Stock
              </h3>
              <button
                onClick={() => onNavigateTab('stock-matrix')}
                className="text-[11px] font-bold text-[#FF6321] hover:underline"
              >
                Matrice
              </button>
            </div>

            {lowStockProducts.length > 0 || outOfStockProducts.length > 0 ? (
              <div className="space-y-2.5">
                {[...outOfStockProducts, ...lowStockProducts].slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover shrink-0 bg-white" />
                      <div className="truncate">
                        <div className="font-bold text-[#121212] truncate">{p.name}</div>
                        <div className="text-gray-400 text-[10px]">{p.sku}</div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      p.totalStock === 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {p.totalStock === 0 ? 'Rupture' : `${p.totalStock} restantes`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center text-xs text-gray-500">
                ✅ Tous les niveaux de stock sont optimaux.
              </div>
            )}
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="p-6 bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl space-y-3 shadow-xl shadow-gray-200/50">
            <h3 className="text-xs font-bold text-[#121212] uppercase tracking-wider">
              Actions Rapides CMS & ERP
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigateTab('products')}
                className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left text-xs text-gray-700 hover:text-[#121212] transition-colors"
              >
                <Package className="w-4 h-4 text-[#FF6321] mb-1" />
                <div className="font-bold">Gérer Produits</div>
              </button>

              <button
                onClick={() => onNavigateTab('coupons')}
                className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left text-xs text-gray-700 hover:text-[#121212] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 mb-1" />
                <div className="font-bold">Codes Promo</div>
              </button>

              <button
                onClick={() => onNavigateTab('settings')}
                className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left text-xs text-gray-700 hover:text-[#121212] transition-colors"
              >
                <Flame className="w-4 h-4 text-amber-600 mb-1" />
                <div className="font-bold">Bannières CMS</div>
              </button>

              <button
                onClick={() => onNavigateTab('reviews')}
                className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left text-xs text-gray-700 hover:text-[#121212] transition-colors"
              >
                <Users className="w-4 h-4 text-blue-600 mb-1" />
                <div className="font-bold">Avis ({reviews.length})</div>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
