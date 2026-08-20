import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

export const NewArrivalsSection: React.FC = () => {
  const { products, setCurrentView, setSelectedCategory } = useStore();

  const newProducts = products.filter((p) => p.isNew && p.status !== 'brouillon').slice(0, 4);

  if (newProducts.length === 0) return null;

  return (
    <section className="py-10 lg:py-14 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-[#FF6321] uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DERNIERS ARRIVAGES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#121212] font-display tracking-tight uppercase">
              Nouveautés Chaussures
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('nouveautes');
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#121212] group transition-colors"
          >
            <span>Toutes les nouveautés</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {newProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
};
