import React from 'react';
import { ArrowRight, Sparkles, Shield, Zap, Flame, Compass } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroSection: React.FC = () => {
  const { siteSettings, setCurrentView, setSelectedCategory, setSelectedGender } = useStore();

  const handleCtaClick = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="relative rounded-3xl overflow-hidden bg-[#121212] group min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] flex items-center shadow-xl shadow-black/10">
        
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 lg:via-black/40 to-transparent z-10" />

        {/* Right side showcase */}
        <div className="absolute top-0 right-0 h-full w-full lg:w-3/5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 to-[#121212] overflow-hidden">
          <img
            src={siteSettings.heroImage}
            alt="VAYZA Sneaker Collection"
            className="w-full h-full object-cover object-center lg:object-right opacity-40 lg:opacity-85 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 transform group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent lg:hidden" />
        </div>

        {/* Text Content */}
        <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 text-white max-w-2xl">
          {siteSettings.heroBadge && (
            <span className="text-[#FF6321] font-bold uppercase tracking-[0.3em] text-xs mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6321]"></span>
              {siteSettings.heroBadge}
            </span>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-[1.05] tracking-tight font-display uppercase">
            YOUR STYLE.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-gray-400">
              YOUR STEP.
            </span>
          </h1>

          <p className="text-gray-400 max-w-md mb-8 text-sm sm:text-base font-medium leading-relaxed">
            {siteSettings.heroSubtitle || "VAYZA — L'élégance à chaque pas. Découvrez notre sélection exclusive de sneakers et chaussures au Sénégal."}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCtaClick}
              className="bg-[#FF6321] hover:bg-[#E5591E] text-white px-8 sm:px-10 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#FF6321]/25 active:scale-95 flex items-center gap-2 group"
            >
              <span>{siteSettings.heroButtonText || 'Découvrir la collection'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                setSelectedCategory('promotions');
                setCurrentView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/10 px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider backdrop-blur-md transition-all active:scale-95"
            >
              Promotions (-30%)
            </button>
          </div>

          {/* Micro trust stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-white/10 max-w-md">
            <div>
              <div className="text-base sm:text-lg font-black text-white">100%</div>
              <div className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">Spécialisé</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-white">24H</div>
              <div className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">Dakar Express</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-[#FF6321]">Wave / OM</div>
              <div className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">Local & Sécurisé</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
