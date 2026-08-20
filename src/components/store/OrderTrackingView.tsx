import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  MessageCircle, 
  Phone, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { formatFCFA, formatDateTime, buildWhatsAppOrderStatusLink } from '../../utils/formatters';

export const OrderTrackingView: React.FC = () => {
  const { orders, siteSettings } = useStore();
  const [searchCode, setSearchCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(orders[0] || null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    const term = searchCode.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase().includes(term) ||
        o.customer.phone.replace(/\s+/g, '').includes(term.replace(/\s+/g, '')) ||
        o.customer.lastName.toLowerCase().includes(term) ||
        o.customer.firstName.toLowerCase().includes(term)
    );

    setSearchedOrder(found || null);
    setSearched(true);
  };

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'recue', label: 'Reçue', desc: 'Commande enregistrée sur VAYZA' },
    { key: 'confirmee', label: 'Confirmée', desc: 'Pointure & stock vérifiés' },
    { key: 'preparee', label: 'Préparée', desc: 'Boîte signature VAYZA emballée' },
    { key: 'expediee', label: 'Expédiée', desc: 'Remise au coursier logistique' },
    { key: 'en_livraison', label: 'En Livraison', desc: 'Livreur en route vers vous' },
    { key: 'livree', label: 'Livrée', desc: 'Colis remis en main propre' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'annulee') return -1;
    return steps.findIndex((s) => s.key === status);
  };

  const currentStepIdx = searchedOrder ? getStepIndex(searchedOrder.status) : 0;

  return (
    <div className="min-h-screen bg-gray-50/60 py-10 lg:py-16 text-[#121212]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6321]/10 text-[#FF6321] text-xs font-bold uppercase tracking-wider">
            <Package className="w-3.5 h-3.5" />
            <span>LOGISTIQUE & SUIVI DAKAR</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#121212] font-display uppercase tracking-tight">
            Suivi de Commande
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Entrez votre numéro de référence (ex: #VZ-10254) ou votre numéro de téléphone.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
          <div className="flex gap-2 p-2 bg-white/85 backdrop-blur-xl border border-white/80 rounded-full shadow-lg shadow-gray-200/50 hover:border-gray-300 transition-all">
            <div className="flex items-center pl-4 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Ex: #VZ-10254 ou 77 123 45 67..."
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#121212] placeholder-gray-400 focus:outline-none px-2 font-medium"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#FF6321] hover:bg-[#E5591E] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md shadow-[#FF6321]/20 active:scale-95"
            >
              Rechercher
            </button>
          </div>
        </form>

        {/* Quick Recent Orders Chips */}
        {orders.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-10 text-xs">
            <span className="text-gray-400 font-medium">Commandes récentes :</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchedOrder(o);
                  setSearchCode(o.id);
                  setSearched(true);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                  searchedOrder?.id === o.id
                    ? 'bg-[#121212] text-white border-[#121212]'
                    : 'bg-white/90 backdrop-blur-sm text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {o.id} ({o.customer.firstName})
              </button>
            ))}
          </div>
        )}

        {/* Search Result */}
        {searchedOrder ? (
          <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/50 space-y-8 animate-fadeIn">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#FF6321] uppercase">
                  Commande {searchedOrder.id}
                </span>
                <h2 className="text-2xl font-black text-[#121212] font-display uppercase mt-0.5">
                  Client : {searchedOrder.customer.firstName} {searchedOrder.customer.lastName}
                </h2>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-2 font-medium">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Passée le {formatDateTime(searchedOrder.createdAt)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  searchedOrder.status === 'livree'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : searchedOrder.status === 'annulee'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  Statut : {searchedOrder.status.replace('_', ' ')}
                </span>
                <span className="text-base font-black text-[#121212]">
                  Total : {formatFCFA(searchedOrder.total)}
                </span>
              </div>
            </div>

            {/* 6-step Progress Timeline */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                Progression de l'Acheminement :
              </h3>

              <div className="relative">
                {/* Connecting Line (desktop) */}
                <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-gray-200 z-0" />
                
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-2">
                  {steps.map((st, index) => {
                    const isCompleted = currentStepIdx >= index;
                    const isCurrent = currentStepIdx === index;

                    return (
                      <div key={st.key} className="relative z-10 flex md:flex-col items-center gap-3 md:text-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                            isCompleted
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-100'
                              : isCurrent
                              ? 'bg-[#FF6321] text-white shadow-md shadow-[#FF6321]/30 ring-4 ring-orange-100 animate-pulse'
                              : 'bg-white border border-gray-300 text-gray-400'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                        </div>

                        <div>
                          <h4 className={`text-xs font-bold uppercase tracking-wider ${
                            isCompleted || isCurrent ? 'text-[#121212]' : 'text-gray-400'
                          }`}>
                            {st.label}
                          </h4>
                          <p className="text-[10px] text-gray-500 mt-0.5 max-w-[120px] hidden md:block font-normal">
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items & Customer Delivery details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              
              {/* Items */}
              <div className="p-5 rounded-2xl bg-gray-50/80 backdrop-blur-sm border border-gray-200/80 space-y-3">
                <h4 className="text-xs font-bold text-[#121212] uppercase tracking-wider">
                  Contenu du Colis ({searchedOrder.items.length})
                </h4>
                <div className="space-y-3">
                  {searchedOrder.items.map((it: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-white/90 p-2.5 rounded-xl border border-gray-200 shadow-sm">
                      <img src={it.image} alt={it.name} className="w-12 h-12 rounded-lg object-cover bg-white" />
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="font-bold text-[#121212] truncate">{it.name}</div>
                        <div className="text-gray-500">Pointure : EU {it.size} • {it.color} (x{it.quantity})</div>
                      </div>
                      <div className="text-xs font-bold text-[#121212]">{formatFCFA(it.price * it.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info & WhatsApp Assistance */}
              <div className="p-5 rounded-2xl bg-gray-50/80 backdrop-blur-sm border border-gray-200/80 flex flex-col justify-between space-y-4">
                <div className="space-y-2 text-xs">
                  <h4 className="text-xs font-bold text-[#121212] uppercase tracking-wider mb-2">
                    Lieu & Modalité de Livraison
                  </h4>
                  <p className="flex items-start gap-2 text-gray-700 font-medium">
                    <MapPin className="w-4 h-4 text-[#FF6321] shrink-0 mt-0.5" />
                    <span>{searchedOrder.customer.address}, {searchedOrder.customer.city} ({searchedOrder.deliveryZone})</span>
                  </p>
                  <p className="flex items-center gap-2 text-gray-700 font-medium">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{searchedOrder.customer.phone}</span>
                  </p>
                  <p className="text-gray-500 font-normal">
                    Paiement : <strong className="text-[#121212]">{searchedOrder.paymentMethod.toUpperCase()}</strong> ({searchedOrder.paymentStatus})
                  </p>
                </div>

                <a
                  href={buildWhatsAppOrderStatusLink(
                    siteSettings.contactWhatsApp,
                    searchedOrder.id,
                    searchedOrder.customer.firstName,
                    searchedOrder.status
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md shadow-[#25D366]/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contacter le Service Client WhatsApp</span>
                </a>
              </div>

            </div>

          </div>
        ) : searched ? (
          <div className="p-12 text-center bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl space-y-4 max-w-xl mx-auto shadow-lg shadow-gray-200/50">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-500">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#121212]">Aucune commande trouvée</h3>
            <p className="text-xs text-gray-500 font-medium">
              Vérifiez le numéro de référence (ex: #VZ-10254) ou le numéro de téléphone utilisé lors de votre achat.
            </p>
          </div>
        ) : null}

      </div>
    </div>
  );
};
