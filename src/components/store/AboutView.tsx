import React from 'react';
import { Sparkles, Shield, Compass, Heart, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <div className="min-h-screen bg-[#0A0A0C] py-12 lg:py-20 text-neutral-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Brand Identity */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF3B30]/15 text-[#FF3B30] border border-[#FF3B30]/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MANIFESTE VAYZA</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display uppercase tracking-tight leading-tight">
            VAYZA — Your Style. Your Step.
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Fondée à Dakar avec l'ambition de devenir la marque de chaussures de référence en Afrique de l'Ouest, VAYZA allie allure contemporaine, confort sans compromis et service irréprochable.
          </p>
        </div>

        {/* Story & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">
              Une Spécialisation Absolue
            </h2>
            <p>
              Contrairement aux marketplaces généralistes qui proposent tout et rien, VAYZA a fait un choix radical : <strong className="text-white">se consacrer exclusivement à l'univers de la chaussure</strong>.
            </p>
            <p>
              Chaque cuir, chaque semelle, chaque profil de sneaker est minutieusement sélectionné et testé pour affronter la vie urbaine dakaroise tout en conservant une élégance internationale.
            </p>
            <p>
              Notre promesse est simple : vous permettre de découvrir, commander et recevoir votre paire en un clic, avec la certitude d'un produit authentique présenté dans un coffret signature.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900 aspect-video md:aspect-square">
            <img
              src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1000&auto=format&fit=crop&q=80"
              alt="VAYZA Atelier & Chaussures"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* 3 Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
            <div className="p-3 bg-neutral-950 rounded-xl w-fit text-[#FF3B30] border border-neutral-800">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display uppercase">Contrôle Total</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Nous gérons nous-mêmes notre catalogue, nos stocks réels et notre politique de satisfaction client.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
            <div className="p-3 bg-neutral-950 rounded-xl w-fit text-amber-400 border border-neutral-800">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display uppercase">Ancrage Local</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Paiement direct Wave / OM, livraison rapide à Dakar en 24h et expéditions suivies dans toutes les régions du Sénégal.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
            <div className="p-3 bg-neutral-950 rounded-xl w-fit text-emerald-400 border border-neutral-800">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display uppercase">Expérience Client</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Unboxing soigné, boîtes rigides VAYZA, échanges faciles de pointures et assistance WhatsApp 7j/7.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
            Prêt à trouver votre prochaine paire ?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Découvrez nos dernières collections homme, femme et sneakers sélectionnées pour votre style.
          </p>
          <button
            onClick={() => {
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-3.5 bg-[#FF3B30] hover:bg-[#E63946] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-red-950/60 inline-flex items-center gap-2"
          >
            <span>Voir le catalogue VAYZA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
