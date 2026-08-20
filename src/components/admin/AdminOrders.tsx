import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MessageCircle, 
  Printer, 
  Eye, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  DollarSign
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { formatFCFA, formatDateTime, buildWhatsAppOrderStatusLink } from '../../utils/formatters';
import { OrderInvoiceModal } from './OrderInvoiceModal';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, siteSettings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(term) ||
      o.customer.firstName.toLowerCase().includes(term) ||
      o.customer.lastName.toLowerCase().includes(term) ||
      o.customer.phone.includes(term) ||
      o.customer.city.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn text-[#121212]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#121212] font-display uppercase tracking-tight">
            Gestion des Commandes & Expéditions ({orders.length})
          </h2>
          <p className="text-xs text-gray-500">
            Suivi des statuts (Reçue → Préparée → En Livraison → Livrée) et notifications WhatsApp client directes.
          </p>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold">
            {orders.filter((o) => o.status === 'recue' || o.status === 'confirmee').length} En attente
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold">
            {orders.filter((o) => o.status === 'expediee' || o.status === 'en_livraison').length} En route
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white/85 backdrop-blur-xl border border-white/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par commande, nom, tél..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'recue', label: 'Reçues' },
            { id: 'preparee', label: 'Préparées' },
            { id: 'en_livraison', label: 'En Livraison' },
            { id: 'livree', label: 'Livrées' },
            { id: 'annulee', label: 'Annulées' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase ${
                statusFilter === st.id
                  ? 'bg-[#121212] text-white'
                  : 'bg-gray-100 text-gray-600 hover:text-black border border-gray-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 uppercase font-semibold text-[11px]">
                <th className="py-3.5 px-4">Commande</th>
                <th className="py-3.5 px-4">Client & Contact</th>
                <th className="py-3.5 px-4">Articles</th>
                <th className="py-3.5 px-4">Montant Net</th>
                <th className="py-3.5 px-4">Paiement</th>
                <th className="py-3.5 px-4">Statut Logistique</th>
                <th className="py-3.5 px-4 text-right">Actions & WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((ord) => {
                const whatsAppAlertLink = buildWhatsAppOrderStatusLink(
                  ord.customer.whatsapp || ord.customer.phone,
                  ord.id,
                  ord.customer.firstName,
                  ord.status
                );

                return (
                  <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                    
                    {/* Order ID & Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-[#121212] text-sm">{ord.id}</div>
                      <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTime(ord.createdAt)}</span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#121212]">{ord.customer.firstName} {ord.customer.lastName}</div>
                      <div className="text-gray-600 text-[11px] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{ord.customer.phone}</span>
                      </div>
                      <div className="text-gray-400 text-[10px] truncate max-w-[150px]">
                        {ord.customer.address}, {ord.customer.city}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="text-gray-700">
                            <span className="font-bold text-[#121212]">{it.name}</span>
                            <span className="text-[10px] text-gray-500 ml-1">
                              (EU {it.size} • {it.quantity}x)
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-[#121212] text-sm">{formatFCFA(ord.total)}</div>
                      <div className="text-[10px] text-gray-400">Livraison : {formatFCFA(ord.deliveryFee)}</div>
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">
                      <span className="uppercase font-mono text-[10px] px-2 py-0.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 block w-fit font-bold">
                        {ord.paymentMethod === 'yas' ? '⚡ YAS' : ord.paymentMethod === 'wave' ? '🌊 WAVE' : ord.paymentMethod === 'orange_money' ? '🍊 OM' : ord.paymentMethod.replace('_', ' ')}
                      </span>
                      {ord.transactionRef && (
                        <div className="text-[9px] font-mono text-gray-500 mt-0.5 truncate max-w-[120px]" title={ord.transactionRef}>
                          {ord.transactionRef}
                        </div>
                      )}
                      <span className={`text-[10px] font-bold block mt-1 ${ord.paymentStatus === 'paye' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {ord.paymentStatus === 'paye' ? 'Encaissé ✅' : 'À la livraison 💵'}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e: any) => handleStatusChange(ord.id, e.target.value)}
                        className={`bg-white border rounded-xl px-2.5 py-1 text-[11px] font-bold uppercase focus:outline-none ${
                          ord.status === 'livree'
                            ? 'border-emerald-300 text-emerald-700'
                            : ord.status === 'annulee'
                            ? 'border-rose-300 text-rose-700'
                            : ord.status === 'en_livraison' || ord.status === 'expediee'
                            ? 'border-blue-300 text-blue-700'
                            : 'border-amber-300 text-amber-700'
                        }`}
                      >
                        <option value="recue">1. Reçue</option>
                        <option value="confirmee">2. Confirmée</option>
                        <option value="preparee">3. Préparée</option>
                        <option value="expediee">4. Expédiée</option>
                        <option value="en_livraison">5. En Livraison</option>
                        <option value="livree">6. Livrée ✅</option>
                        <option value="annulee">Annulée ❌</option>
                      </select>
                    </td>

                    {/* Actions: Invoice + WhatsApp Client */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Printable invoice */}
                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black transition-colors"
                          title="Imprimer Bon de Livraison / Facture"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* WhatsApp Update to Customer */}
                        <a
                          href={whatsAppAlertLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#1fad52] transition-colors"
                          title="Notifier le client sur WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      <OrderInvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
        siteSettings={siteSettings}
      />

    </div>
  );
};
