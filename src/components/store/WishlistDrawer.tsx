import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles,
  Check
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA } from '../../utils/formatters';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    setIsCartOpen,
    setCurrentView,
  } = useStore();

  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: number }>({});
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  if (!isWishlistOpen) return null;

  const currentWishlist = wishlist || [];
  const wishlistedProducts = (products || []).filter((p) => currentWishlist.includes(p.id));

  const handleSizeSelect = (productId: string, size: number) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: typeof products[0]) => {
    // Find available size or default
    const chosenSize = selectedSizes[product.id] || Number(Object.keys(product.sizeStock)[0]) || 42;
    const chosenColor = product.colors[0]?.name || 'Standard';

    addToCart(product, chosenSize, chosenColor, 1);
    setAddedSuccessId(product.id);

    setTimeout(() => {
      setAddedSuccessId(null);
    }, 1800);
  };

  const handleMoveAllToCart = () => {
    wishlistedProducts.forEach((prod) => {
      const chosenSize = selectedSizes[prod.id] || Number(Object.keys(prod.sizeStock)[0]) || 42;
      const chosenColor = prod.colors[0]?.name || 'Standard';
      addToCart(prod, chosenSize, chosenColor, 1);
    });
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div id="wishlist-drawer-root" className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={() => setIsWishlistOpen(false)} 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:w-auto justify-end">
        <div className="w-full sm:max-w-md bg-white border-l border-gray-200 text-[#121212] shadow-2xl flex flex-col justify-between h-full">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#121212] font-display uppercase tracking-wider">
                  Mes Favoris ({wishlistedProducts.length})
                </h2>
                <span className="text-[11px] text-gray-500 font-medium">Votre sélection sauvegardée</span>
              </div>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-[#121212] hover:bg-gray-200 transition-colors"
              aria-label="Fermer les favoris"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {wishlistedProducts.length > 0 ? (
              wishlistedProducts.map((product) => {
                const primaryImg = product.images[product.primaryImageIndex || 0] || product.images[0];
                const availableSizes = Object.keys(product.sizeStock)
                  .map(Number)
                  .filter((sz) => (product.sizeStock[sz] || 0) > 0);
                const currentSize = selectedSizes[product.id] || availableSizes[0] || 42;
                const isJustAdded = addedSuccessId === product.id;

                return (
                  <div
                    key={product.id}
                    className="p-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl flex flex-col gap-3 shadow-2xs hover:shadow-xs transition-all"
                  >
                    <div className="flex gap-3.5 items-center justify-between">
                      <img
                        src={primaryImg}
                        alt={product.name}
                        className="w-18 h-18 rounded-xl object-cover bg-white border border-gray-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-[#121212] truncate">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="text-gray-400 hover:text-rose-500 p-1 transition-colors"
                            title="Retirer des favoris"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] text-gray-500 capitalize">{product.brand} • {product.category}</p>
                        
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xs font-black text-[#FF6321]">
                            {formatFCFA(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              {formatFCFA(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Size Selector & Add to Cart Action */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200/60">
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-[170px]">
                        <span className="text-[10px] text-gray-500 font-bold uppercase shrink-0">Taille:</span>
                        {availableSizes.slice(0, 5).map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => handleSizeSelect(product.id, sz)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all shrink-0 ${
                              currentSize === sz
                                ? 'bg-[#121212] text-white'
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.status === 'rupture'}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#FF6321] hover:bg-[#E5591E] text-white active:scale-95'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Ajouté !</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>+ Panier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto border border-rose-100">
                  <Heart className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#121212]">Votre liste de favoris est vide</h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Parcourez la collection et appuyez sur le cœur pour retrouver vos paires préférées ici.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    setCurrentView('catalog');
                  }}
                  className="px-5 py-2.5 bg-[#121212] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Découvrir les Chaussures
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {wishlistedProducts.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-gray-100 bg-white space-y-3 shrink-0">
              <button
                onClick={handleMoveAllToCart}
                className="w-full py-3.5 px-4 bg-[#121212] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <ShoppingBag className="w-4 h-4 text-[#FF6321]" />
                <span>Tout Ajouter au Panier ({wishlistedProducts.length})</span>
              </button>

              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-gray-200"
              >
                <span>Accéder au Panier d'Achat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
