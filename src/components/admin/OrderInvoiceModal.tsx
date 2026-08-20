import React from 'react';
import { X, Printer, CheckCircle2, MapPin, Phone, MessageCircle } from 'lucide-react';
import { Order, SiteSettings } from '../../types';
import { formatFCFA, formatDateTime } from '../../utils/formatters';

interface OrderInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
  siteSettings: SiteSettings;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  order,
  onClose,
  siteSettings,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white text-neutral-900 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Top bar */}
        <div className="p-4 bg-neutral-900 text-white flex items-center justify-between print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider">
            Bon de Livraison & Facture Officielle VAYZA
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#FF6321] hover:bg-[#E5591E] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-[#FF6321]/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-8 sm:p-12 space-y-8 print:p-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-neutral-900 gap-4">
            <div>
              <div className="text-3xl font-black font-display tracking-tight text-black uppercase">
                VAYZA
              </div>
              <div className="text-[10px] font-bold tracking-[0.25em] text-[#FF6321] uppercase mt-0.5">
                Your Style. Your Step.
              </div>
              <div className="text-xs text-neutral-600 mt-2">
                Boutique spécialisée de chaussures • Dakar, Sénégal
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-bold text-neutral-500 uppercase">
                BON DE LIVRAISON
              </div>
              <div className="text-xl font-black text-black">
                {order.id}
              </div>
              <div className="text-xs text-neutral-600">
                Date : {formatDateTime(order.createdAt)}
              </div>
            </div>
          </div>

          {/* Parties: VAYZA vs Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="font-bold text-black uppercase tracking-wider text-[11px]">
                Émetteur (VAYZA)
              </div>
              <p className="font-semibold text-neutral-900">{siteSettings.address}</p>
              <p className="text-neutral-700">Tél : {siteSettings.contactPhone}</p>
              <p className="text-neutral-700">WhatsApp : {siteSettings.contactWhatsApp}</p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="font-bold text-black uppercase tracking-wider text-[11px]">
                Destinataire (Client)
              </div>
              <p className="font-bold text-neutral-900">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-neutral-700">Tél : {order.customer.phone}</p>
              <p className="text-neutral-700">
                Adresse : {order.customer.address}, {order.customer.city} ({order.deliveryZone})
              </p>
            </div>
          </div>

          {/* Products Table */}
          <div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-900 text-[11px] font-bold text-black uppercase">
                  <th className="py-2.5">Article</th>
                  <th className="py-2.5 text-center">Pointure</th>
                  <th className="py-2.5 text-center">Qté</th>
                  <th className="py-2.5 text-right">Prix Unitaire</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-3">
                    <td className="py-3">
                      <div className="font-bold text-black">{item.name}</div>
                      <div className="text-neutral-500 text-[10px]">Couleur : {item.color}</div>
                    </td>
                    <td className="py-3 text-center font-bold">EU {item.size}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">{formatFCFA(item.price)}</td>
                    <td className="py-3 text-right font-bold text-black">
                      {formatFCFA(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Payment method */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pt-4 border-t-2 border-neutral-900">
            <div className="text-xs space-y-1.5 max-w-sm">
              <div className="font-bold text-black uppercase">Mode de Règlement :</div>
              <p className="text-neutral-700">
                Moyen : <strong className="uppercase">{order.paymentMethod === 'yas' ? 'Yas Sénégal (Direct)' : order.paymentMethod === 'wave' ? 'Wave Sénégal (Direct)' : order.paymentMethod === 'orange_money' ? 'Orange Money (Direct)' : order.paymentMethod}</strong> ({order.paymentStatus === 'paye' ? 'Encaissé ✅' : 'À percevoir à la livraison 💵'})
              </p>
              {order.transactionRef && (
                <p className="text-[11px] font-mono text-neutral-600">
                  Réf Transaction : <strong>{order.transactionRef}</strong>
                </p>
              )}
              {order.notes && (
                <p className="text-neutral-600 italic">
                  Note coursier : « {order.notes} »
                </p>
              )}
            </div>

            <div className="text-xs space-y-1.5 w-full sm:w-64">
              <div className="flex justify-between text-neutral-600">
                <span>Sous-total :</span>
                <span className="font-semibold text-black">{formatFCFA(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Réduction :</span>
                  <span>-{formatFCFA(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Livraison :</span>
                <span className="font-semibold text-black">{formatFCFA(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-black pt-2 border-t border-neutral-400">
                <span>NET À PAYER :</span>
                <span className="text-[#FF6321] text-base">{formatFCFA(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Signature & Box stamp */}
          <div className="pt-8 border-t border-dashed border-neutral-300 flex justify-between items-end text-[11px] text-neutral-500">
            <div>
              <p>Merci pour votre confiance en la marque VAYZA.</p>
              <p>Échange de pointure sous 48h sur présentation de ce bon.</p>
            </div>
            <div className="text-right border-t border-neutral-400 pt-2 w-40">
              Signature / Reçu Client
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
