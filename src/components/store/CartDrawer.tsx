import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  Check, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartItemQty,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    appliedCoupon,
    couponCodeInput,
    setCouponCodeInput,
    applyCoupon,
    removeCoupon,
    discountAmount,
    cartTotal,
    setCurrentView,
    siteSettings,
    selectedDeliveryZoneId,
    setSelectedDeliveryZoneId,
  } = useStore();

  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const success = applyCoupon(couponCodeInput);
    if (!success) {
      setCouponError('Code promo invalide');
    } else {
      setCouponError('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="cart-drawer-root" className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)} 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:w-auto justify-end">
        <div className="w-full sm:max-w-md bg-white border-l border-gray-200 text-[#121212] shadow-2xl flex flex-col justify-between h-full">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-gray-100/80 flex items-center justify-between bg-white/70 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#FF6321]/10 text-[#FF6321] rounded-xl border border-[#FF6321]/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#121212] font-display uppercase tracking-wider">
                  Votre Panier ({cart.length})
                </h2>
                <span className="text-[11px] text-gray-500 font-medium">VAYZA Shoes Dakar</span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full bg-gray-100/80 text-gray-500 hover:text-[#121212] hover:bg-gray-200/80 transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
            {cart.length > 0 ? (
              cart.map((item, index) => {
                const primaryImg = item.product.images[item.product.primaryImageIndex || 0] || item.product.images[0];
                const maxStock = item.product.sizeStock[item.size] || 99;

                return (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="p-3.5 bg-white/80 backdrop-blur-md border border-gray-200/70 rounded-2xl flex gap-3.5 items-center justify-between shadow-sm hover:shadow-md transition-all"
                  >
                    <img
                      src={primaryImg}
                      alt={item.product.name}
                      className="w-18 h-18 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#121212] truncate">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                        <span className="font-semibold text-gray-800">Taille : EU {item.size}</span>
                        <span>•</span>
                        <span className="truncate">{item.color}</span>
                      </div>
                      <div className="text-xs font-black text-[#FF6321] mt-1">
                        {formatFCFA(item.product.price)}
                      </div>

                      {/* Quantity selector */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center rounded-lg bg-gray-50/90 border border-gray-200">
                          <button
                            onClick={() => updateCartItemQty(index, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-gray-600 hover:text-[#121212] font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-[#121212]">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItemQty(index, item.quantity + 1)}
                            disabled={item.quantity >= maxStock}
                            className="px-2 py-0.5 text-xs text-gray-600 hover:text-[#121212] font-bold disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                        {item.quantity >= maxStock && (
                          <span className="text-[10px] text-amber-600 font-semibold">Max dispo</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                      title="Supprimer l'article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#121212]">Votre panier est vide</h3>
                <p className="text-xs text-gray-500">
                  Trouvez la paire parfaite dans notre collection exclusive.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('catalog');
                  }}
                  className="px-6 py-2.5 bg-[#FF6321] hover:bg-[#E5591E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#FF6321]/20 transition-all"
                >
                  Découvrir les modèles
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout calculation */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-gray-100/80 bg-white/80 backdrop-blur-xl space-y-4">
              
              {/* Delivery Zone Selector */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#FF6321]" />
                  <span>Zone de livraison :</span>
                </label>
                <select
                  value={selectedDeliveryZoneId}
                  onChange={(e) => setSelectedDeliveryZoneId(e.target.value)}
                  className="w-full bg-white/90 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]"
                >
                  {siteSettings.deliveryZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} (+{formatFCFA(zone.fee)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Promo code form */}
              <div>
                {appliedCoupon ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Code {appliedCoupon.code} (-{appliedCoupon.value}
                      {appliedCoupon.discountType === 'percent' ? '%' : ' FCFA'})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-gray-500 hover:text-[#121212] text-xs underline font-medium"
                    >
                      Retirer
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="Code promo (ex: VAYZA10)"
                      className="flex-1 bg-white/90 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#121212] placeholder-gray-400 uppercase focus:outline-none focus:border-[#FF6321]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-[#121212] text-xs font-bold rounded-xl transition-colors"
                    >
                      Appliquer
                    </button>
                  </form>
                )}
              </div>

              {/* Price summary table */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-200/80">
                <div className="flex justify-between">
                  <span>Sous-total articles :</span>
                  <span className="font-semibold text-[#121212]">{formatFCFA(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Réduction promo :</span>
                    <span className="font-bold">-{formatFCFA(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frais de livraison :</span>
                  <span className="font-semibold text-[#121212]">{formatFCFA(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#121212] pt-2 border-t border-gray-200">
                  <span>TOTAL À PAYER :</span>
                  <span className="text-[#FF6321] text-base">{formatFCFA(cartTotal)}</span>
                </div>
              </div>

              {/* Direct Payment badges */}
              <div className="flex items-center justify-between gap-1.5 p-2 rounded-xl bg-gray-50/80 border border-gray-200/80 text-[10px] font-bold text-gray-600">
                <span className="flex items-center gap-1 text-sky-700">
                  <span>🌊</span> Wave
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-orange-700">
                  <span>🍊</span> OM
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-purple-700">
                  <span>⚡</span> Yas
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-gray-700">
                  <span>💵</span> Espèces
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-[#FF6321] hover:bg-[#E5591E] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF6321]/25 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Payer Directement ({formatFCFA(cartTotal)})</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
