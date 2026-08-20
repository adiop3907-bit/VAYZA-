import React, { useState } from 'react';
import { X, Ruler, Footprints, CheckCircle, Info, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SIZE_GUIDE_TABLE } from '../../utils/formatters';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [selectedSize, setSelectedSize] = useState<number>(41);

  if (!isSizeGuideOpen) return null;

  const currentRow = SIZE_GUIDE_TABLE.find((r) => r.eu === selectedSize) || SIZE_GUIDE_TABLE[5];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-[#121212] my-8">
        
        {/* Close button */}
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100/80 hover:bg-gray-200/80 text-gray-500 hover:text-[#121212] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#FF6321]/10 text-[#FF6321] rounded-2xl border border-[#FF6321]/20">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#121212] font-display">Guide des Tailles VAYZA</h3>
            <p className="text-xs text-gray-500 font-medium">Trouvez votre pointure exacte et évitez les retours.</p>
          </div>
        </div>

        {/* Interactive Size Selector */}
        <div className="mb-6 p-4 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-sm">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            1. Choisissez une pointure pour voir la correspondance :
          </label>
          <div className="flex flex-wrap gap-2">
            {SIZE_GUIDE_TABLE.map((row) => (
              <button
                key={row.eu}
                onClick={() => setSelectedSize(row.eu)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSize === row.eu
                    ? 'bg-[#FF6321] text-white shadow-md shadow-[#FF6321]/25 scale-105'
                    : 'bg-white/90 border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
                }`}
              >
                EU {row.eu}
              </button>
            ))}
          </div>

          {/* Result card for selected size */}
          <div className="mt-4 p-4 bg-white/90 backdrop-blur-md rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="text-xs text-gray-500">Pointure sélectionnée</div>
              <div className="text-lg font-black text-[#121212]">EU {currentRow.eu}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Longueur du pied</div>
              <div className="text-lg font-bold text-[#FF6321]">{currentRow.cm} cm</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">UK</div>
              <div className="text-base font-bold text-gray-800">{currentRow.uk}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">US Homme</div>
              <div className="text-base font-bold text-gray-800">{currentRow.usMen}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">US Femme</div>
              <div className="text-base font-bold text-gray-800">{currentRow.usWomen}</div>
            </div>
          </div>
        </div>

        {/* How to measure guide */}
        <div className="mb-6 space-y-3">
          <h4 className="text-sm font-bold text-[#121212] flex items-center gap-2">
            <Footprints className="w-4 h-4 text-[#FF6321]" />
            Comment mesurer votre pied chez vous ?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-700">
            <div className="p-3.5 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200/80">
              <span className="inline-block w-5 h-5 bg-[#FF6321]/15 text-[#FF6321] font-bold text-center rounded-full mb-1">1</span>
              <p className="font-semibold text-[#121212]">Posez votre pied</p>
              <p className="text-gray-500 mt-1">Placez une feuille blanche au sol contre un mur droit. Posez votre talon fermement contre le mur.</p>
            </div>
            <div className="p-3.5 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200/80">
              <span className="inline-block w-5 h-5 bg-[#FF6321]/15 text-[#FF6321] font-bold text-center rounded-full mb-1">2</span>
              <p className="font-semibold text-[#121212]">Tracez un repère</p>
              <p className="text-gray-500 mt-1">À l'aide d'un crayon tenu verticalement, marquez l'extrémité de votre orteil le plus long.</p>
            </div>
            <div className="p-3.5 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200/80">
              <span className="inline-block w-5 h-5 bg-[#FF6321]/15 text-[#FF6321] font-bold text-center rounded-full mb-1">3</span>
              <p className="font-semibold text-[#121212]">Mesurez en cm</p>
              <p className="text-gray-500 mt-1">Mesurez avec une règle la distance du bord de la feuille jusqu'au trait tracé.</p>
            </div>
          </div>
        </div>

        {/* Advice Tip */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-900">Conseil VAYZA :</span> Si vous êtes entre deux tailles, nous vous conseillons de choisir la pointure supérieure pour nos sneakers et votre pointure exacte pour nos mocassins en cuir véritable.
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-6 py-2.5 bg-[#FF6321] hover:bg-[#E5591E] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#FF6321]/20 active:scale-98"
          >
            Compris, fermer le guide
          </button>
        </div>

      </div>
    </div>
  );
};
