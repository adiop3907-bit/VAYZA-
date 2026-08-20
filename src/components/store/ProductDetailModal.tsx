import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  MessageCircle, 
  Star, 
  Truck, 
  RotateCcw, 
  Ruler, 
  ShieldCheck, 
  Check, 
  AlertTriangle,
  ChevronRight,
  Share2,
  Edit,
  Camera
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA, buildWhatsAppOrderLink } from '../../utils/formatters';
import { ProductFormModal } from '../admin/ProductFormModal';
import { Product } from '../../types';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    currentView,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setIsSizeGuideOpen,
    siteSettings,
    showNotification,
    isAdminAuthenticated,
    updateProduct,
  } = useStore();

  if (!selectedProduct) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);
  
  // Find first available size in stock or default
  const availableSizes = Object.entries(selectedProduct.sizeStock)
    .filter(([_, stock]) => Number(stock) > 0)
    .map(([size]) => Number(size));

  const [selectedSize, setSelectedSize] = useState<number>(
    availableSizes[0] || 41
  );

  const [selectedColor, setSelectedColor] = useState<string>(
    selectedProduct.colors[0]?.name || 'Standard'
  );

  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'reviews'>('details');

  const isFavorite = isWishlisted(selectedProduct.id);
  const currentStockForSelectedSize = selectedProduct.sizeStock[selectedSize] || 0;
  const isSizeOutOfStock = currentStockForSelectedSize <= 0;
  const isAllOutOfStock = selectedProduct.totalStock <= 0;

  const handleAddToCart = () => {
    if (isSizeOutOfStock) {
      showNotification(`La pointure EU ${selectedSize} est en rupture de stock.`, 'warning');
      return;
    }
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (isSizeOutOfStock) {
      showNotification(`La pointure EU ${selectedSize} est en rupture de stock.`, 'warning');
      return;
    }
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    setSelectedProduct(null);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClose = () => {
    setSelectedProduct(null);
  };

  const handleSaveEditedProduct = (productData: any, existingId?: string) => {
    if (existingId) {
      updateProduct(existingId, productData);
      setSelectedProduct({
        ...selectedProduct,
        ...productData,
        id: existingId,
      });
      showNotification('Modèle mis à jour avec succès !', 'success');
    }
  };

  const whatsAppLink = buildWhatsAppOrderLink(
    siteSettings.contactWhatsApp,
    selectedProduct.name,
    selectedSize,
    selectedColor,
    selectedProduct.price,
    selectedProduct.sku
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-md overflow-y-auto animate-fadeIn">
        <div className="relative w-full max-w-5xl bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 text-[#121212]">
          
          {/* Top Actions: Close & Admin Direct Edit */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={() => setIsAdminEditOpen(true)}
                className="px-3.5 py-2 rounded-full bg-[#121212] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-md border border-gray-700 transition-transform active:scale-95"
                title="Modifier ce modèle (Administrateur)"
              >
                <Edit className="w-3.5 h-3.5 text-[#FF6321]" />
                <span>Modifier (Admin)</span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-[#121212] border border-gray-200/80 backdrop-blur-md shadow-sm transition-all"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Column: Photo Gallery */}
            <div className="lg:col-span-7 p-6 sm:p-8 bg-gray-50/60 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Main Image with Zoom preview */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-gray-200/60 shadow-sm group">
                  <img
                    src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    {selectedProduct.discountPercent && selectedProduct.discountPercent > 0 && (
                      <span className="px-3 py-1 bg-[#FF6321] text-white text-xs font-black rounded-lg uppercase tracking-wider shadow-md shadow-[#FF6321]/20">
                        -{selectedProduct.discountPercent}%
                      </span>
                    )}
                    {selectedProduct.isNew && (
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg uppercase shadow-sm">
                        Nouveauté
                      </span>
                    )}
                  </div>

                  {/* Wishlist button */}
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all z-10 shadow-sm ${
                      isFavorite
                        ? 'bg-[#FF6321] text-white shadow-md shadow-[#FF6321]/30'
                        : 'bg-white/80 text-gray-600 hover:text-[#121212] border border-gray-200'
                    }`}
                    aria-label="Favoris"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* Thumbnails list */}
                {selectedProduct.images.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          activeImageIndex === idx
                            ? 'border-[#FF6321] ring-2 ring-[#FF6321]/20 scale-105 shadow-sm'
                            : 'border-gray-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Guarantees micro-bar */}
              <div className="grid grid-cols-3 gap-2 pt-6 mt-4 border-t border-gray-200/80 text-[11px] text-gray-500 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-[#FF6321] mb-1" />
                  <span className="font-medium">Livraison Dakar 24h</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="font-medium">Authenticité VAYZA</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-amber-600 mb-1" />
                  <span className="font-medium">Échange pointure facile</span>
                </div>
              </div>
            </div>

            {/* Right Column: Product Info & Order Controls */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div className="space-y-5">
                
                {/* Header Info */}
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-bold text-gray-500 uppercase tracking-wider">
                      {selectedProduct.brand} • {selectedProduct.category.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono font-medium">
                      Réf : {selectedProduct.sku}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-[#121212] font-display uppercase tracking-tight">
                    {selectedProduct.name}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#121212]">{selectedProduct.rating}</span>
                    <span className="text-xs text-gray-500">({selectedProduct.reviewCount} avis clients)</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-gray-50/80 backdrop-blur-sm border border-gray-200/80 flex items-baseline justify-between shadow-sm">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-[#121212]">
                      {formatFCFA(selectedProduct.price)}
                    </div>
                    {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                      <div className="text-xs text-gray-400 line-through">
                        Prix initial : {formatFCFA(selectedProduct.originalPrice)}
                      </div>
                    )}
                  </div>
                  {selectedProduct.discountPercent && selectedProduct.discountPercent > 0 && (
                    <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-black rounded-lg">
                      Économisez {formatFCFA(selectedProduct.originalPrice! - selectedProduct.price)}
                    </span>
                  )}
                </div>

                {/* Color Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    <span>Couleur sélectionnée :</span>
                    <span className="text-[#121212] normal-case font-semibold">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {selectedProduct.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color.name)}
                        className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color.name
                            ? 'border-[#FF6321] ring-2 ring-[#FF6321]/30 scale-110 shadow-sm'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check className={`w-4 h-4 mx-auto ${color.hex === '#FFFFFF' || color.hex === '#F8F9FA' ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector with Real-Time Stock Status */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Pointure (EU) :
                    </span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs font-semibold text-[#FF6321] hover:text-[#E5591E] flex items-center gap-1"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Guide des tailles</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(selectedProduct.sizeStock).map(([sizeStr, stock]) => {
                      const sizeNum = Number(sizeStr);
                      const stockNum = Number(stock) || 0;
                      const isSelected = selectedSize === sizeNum;
                      const isZeroStock = stockNum <= 0;

                      return (
                        <button
                          key={sizeNum}
                          onClick={() => setSelectedSize(sizeNum)}
                          disabled={isZeroStock}
                          className={`relative py-2.5 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                            isSelected
                              ? 'bg-[#FF6321] text-white border-[#FF6321] shadow-md shadow-[#FF6321]/25'
                              : isZeroStock
                              ? 'bg-gray-100/60 border-gray-200 text-gray-400 cursor-not-allowed line-through'
                              : 'bg-white/90 border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50 shadow-sm'
                          }`}
                        >
                          <div>EU {sizeNum}</div>
                          <div className={`text-[9px] font-normal mt-0.5 ${
                            isSelected 
                              ? 'text-white/90' 
                              : isZeroStock 
                              ? 'text-gray-400' 
                              : stockNum <= 2 
                              ? 'text-amber-600 font-semibold' 
                              : 'text-gray-500'
                          }`}>
                            {isZeroStock ? 'Épuisé' : `${stockNum} dispo`}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Stock notice */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs">
                    {currentStockForSelectedSize > 0 ? (
                      currentStockForSelectedSize <= 2 ? (
                        <span className="text-amber-600 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Plus que {currentStockForSelectedSize} paire(s) restante(s) en taille EU {selectedSize} !
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Pointure EU {selectedSize} en stock ({currentStockForSelectedSize} unités prêtes à l'envoi).
                        </span>
                      )
                    ) : (
                      <span className="text-rose-600 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Rupture de stock pour la taille EU {selectedSize}.
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quantité :</span>
                  <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isSizeOutOfStock}
                      className="px-3 py-1 text-sm font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-[#121212]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStockForSelectedSize, quantity + 1))}
                      disabled={quantity >= currentStockForSelectedSize || isSizeOutOfStock}
                      className="px-3 py-1 text-sm font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  {/* 1. Ajouter au panier */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isSizeOutOfStock}
                    className="w-full py-3.5 px-4 bg-[#121212] hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 active:scale-98 shadow-md shadow-black/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#FF6321]" />
                    <span>{isSizeOutOfStock ? 'Pointure Épuisée' : 'Ajouter au Panier'}</span>
                  </button>

                  {/* 2. Acheter maintenant */}
                  <button
                    onClick={handleBuyNow}
                    disabled={isSizeOutOfStock}
                    className="w-full py-4 px-4 bg-[#FF6321] hover:bg-[#E5591E] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF6321]/25 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Acheter Maintenant ({formatFCFA(selectedProduct.price * quantity)})</span>
                  </button>

                  {/* 3. Commander via WhatsApp */}
                  <a
                    href={whatsAppLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Commander via WhatsApp 💬</span>
                  </a>
                </div>

                {/* Tabs: Description & Matière */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-xs font-bold border-b border-gray-200 pb-2">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`pb-1 transition-colors ${
                        activeTab === 'details' ? 'text-[#121212] border-b-2 border-[#FF6321]' : 'text-gray-400 hover:text-[#121212]'
                      }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setActiveTab('materials')}
                      className={`pb-1 transition-colors ${
                        activeTab === 'materials' ? 'text-[#121212] border-b-2 border-[#FF6321]' : 'text-gray-400 hover:text-[#121212]'
                      }`}
                    >
                      Matière & Entretien
                    </button>
                  </div>

                  <div className="pt-3 text-xs text-gray-600 leading-relaxed">
                    {activeTab === 'details' && (
                      <p>{selectedProduct.description}</p>
                    )}
                    {activeTab === 'materials' && (
                      <div className="space-y-1.5">
                        <p><strong className="text-[#121212]">Composition :</strong> {selectedProduct.material}</p>
                        <p><strong className="text-[#121212]">Semelle :</strong> Caoutchouc haute densité avec motif Dakar-Grip</p>
                        <p><strong className="text-[#121212]">Entretien :</strong> Nettoyer avec un chiffon humide et nourrir avec un cirage adapté.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Admin Direct Product Edit Modal */}
      {isAdminAuthenticated && (
        <ProductFormModal
          isOpen={isAdminEditOpen}
          onClose={() => setIsAdminEditOpen(false)}
          onSave={handleSaveEditedProduct}
          initialProduct={selectedProduct}
        />
      )}
    </>
  );
};
