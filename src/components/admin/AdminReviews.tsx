import React from 'react';
import { Star, CheckCircle, XCircle, Trash2, MapPin, MessageSquare } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminReviews: React.FC = () => {
  const { reviews, approveReview, rejectReview, deleteReview } = useStore();

  return (
    <div className="space-y-6 animate-fadeIn text-[#121212]">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#121212] font-display uppercase tracking-tight">
          Modération des Avis & Témoignages Clients ({reviews.length})
        </h2>
        <p className="text-xs text-gray-500">
          Approuvez ou masquez les avis avant leur affichage public sur la boutique.
        </p>
      </div>

      {/* Reviews list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`p-5 rounded-3xl border flex flex-col justify-between space-y-4 shadow-lg shadow-gray-200/50 backdrop-blur-xl transition-all ${
              rev.status === 'approuvé'
                ? 'bg-white/90 border-white/80'
                : rev.status === 'en_attente'
                ? 'bg-amber-50/90 border-amber-200'
                : 'bg-gray-50/90 border-gray-200 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  rev.status === 'approuvé'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : rev.status === 'en_attente'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {rev.status}
                </span>
              </div>

              <p className="text-xs text-gray-700 italic mb-3">
                « {rev.comment} »
              </p>

              <div className="text-xs">
                <span className="font-bold text-[#121212]">{rev.author}</span>
                <span className="text-gray-400 ml-2">({rev.location || 'Dakar'})</span>
              </div>
              <div className="text-[11px] font-bold text-[#FF6321] mt-0.5">
                Produit : {rev.productName}
              </div>
            </div>

            {/* Actions buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {rev.status !== 'approuvé' && (
                  <button
                    onClick={() => approveReview(rev.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approuver</span>
                  </button>
                )}
                {rev.status !== 'rejeté' && (
                  <button
                    onClick={() => rejectReview(rev.id)}
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Masquer</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => deleteReview(rev.id)}
                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Supprimer définitivement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
