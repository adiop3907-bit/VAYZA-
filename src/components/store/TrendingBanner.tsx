import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const TrendingBanner: React.FC = () => {
  const { siteSettings, setCurrentView, setSelectedCategory } = useStore();

  const handleExplore = () => {
    setSelectedCategory('sneakers');
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#121212] shadow-xl shadow-black/10 min-h-[380px] sm:min-h-[460px] flex items-center group">
          
          {/* Background Image */}
          <img
            src={siteSettings.trendingBannerImage}
            alt="Collection Tendance VAYZA"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.7] transform group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Content */}
          <div className="relative z-10 max-w-xl p-8 sm:p-12 lg:p-16 space-y-4 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6321] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{siteSettings.trendingBannerTag || 'COLLECTION TENDANCE'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display uppercase tracking-tight leading-[1.1]">
              {siteSettings.trendingBannerTitle}
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
              {siteSettings.trendingBannerSubtitle}
            </p>

            <div className="pt-2">
              <button
                onClick={handleExplore}
                className="px-8 py-3.5 bg-white hover:bg-gray-100 text-[#121212] font-black text-xs uppercase tracking-wider rounded-full transition-all shadow-lg flex items-center gap-2 active:scale-95 group"
              >
                <span>Découvrir la sélection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
