import React, { useState } from 'react';
import { Plus, Tag, Trash2, Check, Sparkles, X, Percent, Calendar, DollarSign } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';
import { formatFCFA } from '../../utils/formatters';

export const AdminCoupons: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon, toggleCouponStatus } = useStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState<number>(10);
  const [minSpend, setMinSpend] = useState<number>(20000);
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      value: Number(value),
      minSpend: Number(minSpend),
      usageLimit: Number(usageLimit),
      expiresAt,
      isActive: true,
    });

    setCode('');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#121212]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#121212] font-display uppercase tracking-tight">
            Codes Promo & Réductions Commerciales ({coupons.length})
          </h2>
          <p className="text-xs text-gray-500">
            Créez des remises en pourcentage ou montant fixe en FCFA pour booster vos ventes.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-6 py-3.5 bg-[#FF6321] hover:bg-[#E5591E] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-[#FF6321]/25 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? 'Fermer le formulaire' : 'Créer un Code Promo'}</span>
        </button>
      </div>

      {/* New Coupon Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-6 bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl space-y-4 max-w-2xl animate-fadeIn shadow-xl shadow-gray-200/50">
          <h3 className="text-sm font-black text-[#121212] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF6321]" />
            Nouveau Code Promotionnel
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Code Promo (Majuscules) *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: BIENVENUE10"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] font-mono uppercase focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Type de Réduction</label>
              <select
                value={discountType}
                onChange={(e: any) => setDiscountType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
              >
                <option value="percent">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (FCFA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Valeur ({discountType === 'percent' ? '%' : 'FCFA'}) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Achat minimum (FCFA)</label>
              <input
                type="number"
                min="0"
                value={minSpend}
                onChange={(e) => setMinSpend(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Date d'expiration</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#FF6321] hover:bg-[#E5591E] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#FF6321]/20"
            >
              Enregistrer le Code
            </button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 uppercase font-semibold text-[11px]">
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Remise</th>
                <th className="py-3.5 px-4">Achat Min.</th>
                <th className="py-3.5 px-4">Utilisations</th>
                <th className="py-3.5 px-4">Expiration</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#121212] text-sm">
                    {c.code}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    {c.discountType === 'percent' ? `-${c.value}%` : `-${formatFCFA(c.value)}`}
                  </td>
                  <td className="py-3.5 px-4 text-gray-700">
                    {formatFCFA(c.minSpend)}
                  </td>
                  <td className="py-3.5 px-4 text-gray-700">
                    {c.usedCount} / {c.usageLimit || '∞'}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">
                    {c.expiresAt}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleCouponStatus(c.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        c.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {c.isActive ? 'Actif' : 'Désactivé'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => deleteCoupon(c.id)}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
