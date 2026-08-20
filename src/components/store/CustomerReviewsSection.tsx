import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, MapPin, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews, addReview, products } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('Dakar (Almadies)');
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const approvedReviews = reviews.filter((r) => r.status === 'approuvé');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const prod = products.find((p) => p.id === productId);
    const prodName = prod ? prod.name : 'VAYZA Footwear';

    addReview(productId, prodName, author.trim(), rating, comment.trim(), location.trim());
    setAuthor('');
    setComment('');
    setIsFormOpen(false);
  };

  return (
    <section className="py-12 lg:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-[#FF6321] uppercase mb-1">
              <Star className="w-3.5 h-3.5 fill-[#FF6321]" />
              <span>AVIS CLIENTS VÉRIFIÉS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#121212] font-display uppercase tracking-tight">
              Ce que nos clients disent de VAYZA
            </h2>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121212] hover:bg-black text-white text-xs font-bold rounded-full transition-all shadow-xs active:scale-95"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#FF6321]" />
            <span>{isFormOpen ? 'Fermer le formulaire' : 'Donner mon avis'}</span>
          </button>
        </div>

        {/* Add Review Form (Collapsible) */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="mb-10 p-6 sm:p-8 bg-gray-50 border border-gray-100 rounded-3xl animate-fadeIn max-w-2xl mx-auto space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#121212] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF6321]" />
              Partagez votre expérience VAYZA
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Votre Nom & Prénom</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ex: Cheikh Diop"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Votre Ville / Quartier</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Dakar (Mermoz), Thiès..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Modèle acheté</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Note attribuée</label>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-gray-300 hover:text-amber-400 transition-colors"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Votre témoignage</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Qualité de la paire, confort, délai de livraison..."
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-black"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FF6321] hover:bg-[#E5591E] text-white text-xs font-bold rounded-full transition-all shadow-md active:scale-95"
              >
                Publier mon avis
              </button>
            </div>
          </form>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white border border-gray-100 flex flex-col justify-between space-y-4 hover:border-gray-300 transition-all shadow-2xs hover:shadow-xs"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs text-gray-600 italic leading-relaxed">
                  « {rev.comment} »
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#121212]">{rev.author}</span>
                  {rev.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                      <CheckCircle className="w-3 h-3" /> Achat vérifié
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{rev.location || 'Dakar'}</span>
                  <span>•</span>
                  <span className="text-[10px] text-gray-500 font-medium">{rev.productName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
