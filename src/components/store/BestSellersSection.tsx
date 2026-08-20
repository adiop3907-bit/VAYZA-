import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

export const BestSellersSection: React.FC = () => {
  const { products, setCurrentView, setSelectedCategory } = useStore();

  const bestSellers = products.filter((p) => p.isBestSeller && p.status !== 'brouillon').slice(0, 4);

  if (bestSellers.length === 0) return null;

  return (
    <section className="py-10 lg:py-14 bg-gray-50/60 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-[#FF6321] uppercase mb-1">
              <Flame className="w-3.5 h-3.5 fill-[#FF6321]" />
              <span>LES MODÈLES LES PLUS DEMANDÉS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#121212] font-display tracking-tight uppercase">
              Nos Best-Sellers
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('best-sellers');
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#121212] group transition-colors"
          >
            <span>Voir les plus vendus</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
};
