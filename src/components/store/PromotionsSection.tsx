import React from 'react';
import { Tag, ArrowRight, Clock, Percent } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

export const PromotionsSection: React.FC = () => {
  const { products, siteSettings, setCurrentView, setSelectedCategory } = useStore();

  const promoProducts = products
    .filter((p) => (p.isPromotion || (p.discountPercent && p.discountPercent > 0)) && p.status !== 'brouillon')
    .slice(0, 4);

  if (promoProducts.length === 0 || !siteSettings.promoBannerActive) return null;

  return (
    <section className="py-10 lg:py-14 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Promotion Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121212] text-white mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-black/10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6321] text-white text-[10px] font-black uppercase tracking-widest">
              <Percent className="w-3.5 h-3.5" />
              <span>OFFRES LIMITÉES DAKAR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight">
              {siteSettings.promoBannerText}
            </h2>
            <p className="text-xs text-gray-400 max-w-xl font-medium">
              Profitez de réductions immédiates sur une sélection de sneakers et chaussures avant épuisement des stocks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-full text-gray-200 text-xs font-bold backdrop-blur-md">
              <Clock className="w-4 h-4 text-[#FF6321] animate-spin" />
              <span>Offre selon stock disponible</span>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('promotions');
                setCurrentView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 bg-[#FF6321] hover:bg-[#E5591E] text-white text-xs font-bold rounded-full transition-all shadow-lg shadow-[#FF6321]/30 uppercase tracking-wider active:scale-95"
            >
              Voir toutes les promos
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {promoProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
};
