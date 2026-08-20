import React from 'react';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlist, products, setCurrentView } = useStore();

  const currentWishlist = wishlist || [];
  const wishlistedProducts = (products || []).filter((p) => currentWishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 lg:py-14 text-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF6321] uppercase tracking-widest">
            <Heart className="w-4 h-4 fill-[#FF6321]" />
            <span>VOS FAVORIS VAYZA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#121212] font-display uppercase tracking-tight">
            Liste d'Envies ({wishlistedProducts.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Retrouvez facilement toutes les paires que vous avez sauvegardées pour plus tard.
          </p>
        </div>

        {wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="p-12 sm:p-16 text-center bg-white border border-gray-200 rounded-3xl space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#121212]">Votre liste d'envies est vide</h3>
            <p className="text-xs text-gray-500">
              Cliquez sur l'icône cœur de n'importe quel modèle pour l'ajouter à vos favoris.
            </p>
            <button
              onClick={() => setCurrentView('catalog')}
              className="px-6 py-3 bg-[#FF6321] hover:bg-[#E5591E] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all"
            >
              Explorer les Collections
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

