import React from 'react';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatFCFA } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    setSelectedProduct, 
    setCurrentView, 
    toggleWishlist, 
    isWishlisted,
    addToCart 
  } = useStore();

  const isFavorite = isWishlisted(product.id);
  const primaryImg = product.images[product.primaryImageIndex || 0] || product.images[0];
  const secondaryImg = product.images[1] || primaryImg;

  const handleOpenDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
  };

  // Find first available size
  const availableSizes = Object.entries(product.sizeStock)
    .filter(([_, stock]) => Number(stock) > 0)
    .map(([size]) => Number(size));

  const firstAvailableSize = availableSizes[0] || 41;
  const isOutOfStock = product.totalStock === 0 || availableSizes.length === 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      handleOpenDetail(e);
      return;
    }
    const color = product.colors[0]?.name || 'Standard';
    addToCart(product, firstAvailableSize, color, 1);
  };

  return (
    <div 
      onClick={handleOpenDetail}
      className="group relative bg-white border border-gray-100 hover:border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={primaryImg}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="px-2.5 py-0.5 bg-[#FF6321] text-white text-[10px] font-black rounded-full uppercase tracking-wider shadow-sm">
              -{product.discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-md text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-2xs">
              Nouveau
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-md text-amber-700 border border-amber-200 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-2xs">
              Best-Seller
            </span>
          )}
        </div>

        {/* Wishlist Button on Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 border ${
            isFavorite
              ? 'bg-[#FF6321] text-white border-[#FF6321] shadow-md shadow-[#FF6321]/30'
              : 'bg-white/90 text-gray-400 hover:text-[#FF6321] hover:bg-white border-gray-100 shadow-2xs'
          }`}
          aria-label="Ajouter aux favoris"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden group-hover:flex items-center gap-2 z-10 animate-fadeIn">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex-1 py-2.5 px-3 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#121212] text-white hover:bg-black'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Rupture' : `Ajout rapide (EU ${firstAvailableSize})`}</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-bold uppercase tracking-widest text-[10px] text-gray-400">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-bold text-[#121212] group-hover:text-[#FF6321] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Available Colors Preview */}
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.map((col, idx) => (
              <span
                key={idx}
                className="w-2.5 h-2.5 rounded-full border border-gray-300 shadow-2xs"
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
            <span className="text-[10px] text-gray-400 font-medium ml-1">
              {product.colors.length} coul.
            </span>
          </div>
        </div>

        {/* Pricing & Stock indicator */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-black text-[#121212]">
                {formatFCFA(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  {formatFCFA(product.originalPrice)}
                </span>
              )}
            </div>
            {/* Low stock tag */}
            {product.totalStock > 0 && product.totalStock <= 5 && (
              <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">
                ⚠️ Plus que {product.totalStock} paires
              </span>
            )}
            {isOutOfStock && (
              <span className="text-[10px] text-rose-500 font-semibold block mt-0.5">
                Rupture temporaire
              </span>
            )}
          </div>

          <span className="text-xs font-bold text-gray-500 group-hover:text-[#FF6321] flex items-center gap-0.5 transition-colors">
            Détails →
          </span>
        </div>
      </div>
    </div>
  );
};
