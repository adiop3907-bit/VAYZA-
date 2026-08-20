import React from 'react';
import { Package, Sparkles, QrCode, CheckCircle2, Gift } from 'lucide-react';

export const PackagingExperience: React.FC = () => {
  return (
    <section className="py-12 lg:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Text side */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6321]/10 text-[#FF6321] text-xs font-bold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              <span>UNBOXING EXPÉRIENCE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#121212] font-display uppercase tracking-tight leading-tight">
              Chaque Colis VAYZA est une Signature.
            </h2>

            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Nous soignons chaque détail pour que l'ouverture de votre commande soit un moment privilégié. Pas de vulgaire sachet plastique, mais un véritable coffret premium.
            </p>

            {/* Packaging Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-[#FF6321]/10 flex items-center justify-center text-[#FF6321] shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#121212] uppercase">Boîte Noire Mate Rigide VAYZA</h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-normal">Estampillée du logo VAYZA et de notre devise intérieure : <span className="text-[#121212] italic font-semibold">« STEP INTO YOUR STYLE. »</span></p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#121212] uppercase">Papier de Soie & Carte de Remerciement</h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-normal">Protection délicate de votre paire avec sticker de scellé officiel et mot personnalisé.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#121212] uppercase">Autocollant Collector & QR Code Direct</h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-normal">Accès instantané à nos concours Instagram et aux conseils d'entretien du cuir.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual box rendering */}
          <div className="lg:col-span-6">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-[#121212] text-white shadow-xl shadow-black/10 overflow-hidden group">
              
              {/* Decorative brand watermark */}
              <div className="absolute -right-6 -bottom-6 text-8xl font-black text-white/5 font-display select-none">
                VAYZA
              </div>

              {/* Shoe Box Mockup Visual */}
              <div className="relative border border-white/10 rounded-2xl bg-black/40 p-6 sm:p-8 shadow-inner text-center space-y-6">
                
                {/* Box Cover */}
                <div className="border border-white/10 rounded-xl p-6 bg-neutral-900">
                  <div className="text-3xl sm:text-4xl font-black tracking-widest text-white font-display uppercase">
                    VAYZA
                  </div>
                  <div className="text-[10px] tracking-[0.3em] text-[#FF6321] uppercase font-bold mt-1">
                    Your Style. Your Step.
                  </div>
                </div>

                {/* Box Inner Reveal */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left space-y-2">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Message Intérieur du Coffret :
                  </div>
                  <div className="text-base sm:text-lg font-black text-white tracking-wide font-display italic">
                    « STEP INTO YOUR STYLE. »
                  </div>
                  <div className="flex items-center gap-2 pt-2 text-xs text-gray-300 border-t border-white/10">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Papier de soie VAYZA scellé & Guide d'entretien inclus</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-gray-300">
                  <span className="px-3 py-1 bg-white/10 rounded-full border border-white/10 font-medium">
                    📦 Boîte Réutilisable
                  </span>
                  <span className="px-3 py-1 bg-white/10 rounded-full border border-white/10 font-medium">
                    🏷️ Sac de Livraison VAYZA
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
