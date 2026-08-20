import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  RefreshCw,
  Zap,
  HelpCircle,
  Footprints
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../utils/api';
import { formatFCFA } from '../../utils/formatters';
import { Product } from '../../types';

interface AiStylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiStylistModal: React.FC<AiStylistModalProps> = ({ isOpen, onClose }) => {
  const { products, setSelectedProduct, setCurrentView } = useStore();

  const [gender, setGender] = useState<'tous' | 'homme' | 'femme' | 'enfant'>('tous');
  const [occasion, setOccasion] = useState('Tous les jours & Casual');
  const [stylePreference, setStylePreference] = useState('Confort respirant pour la ville');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [recommendedShoes, setRecommendedShoes] = useState<Product[]>([]);

  if (!isOpen) return null;

  const occasions = [
    'Tous les jours & Casual',
    'Travail & Rendez-vous Pro',
    'Sorties & Soirées Dakar',
    'Sport & Running',
    'Cérémonie & Mariage',
  ];

  const handleGetAdvice = async () => {
    setLoading(true);
    try {
      const res = await api.getStyleAdvice(stylePreference, occasion, gender);
      if (res && res.recommendation) {
        setAiResponse(res.recommendation);
      } else {
        setAiResponse('Pour un confort optimal et un style affirmé à Dakar, nous vous recommandons nos sneakers légères à semelle amortissante.');
      }

      // Filter matched products from local catalog
      let matched = products.filter((p) => {
        if (gender !== 'tous' && p.gender !== gender && p.gender !== 'unisex') return false;
        return true;
      });

      if (occasion.includes('Sport')) {
        matched = matched.filter((p) => p.category === 'sneakers' || p.subcategory.includes('sport'));
      } else if (occasion.includes('Cérémonie') || occasion.includes('Travail')) {
        matched = matched.filter((p) => p.category === 'homme' || p.category === 'femme' || p.price > 30000);
      }

      if (matched.length === 0) matched = products.slice(0, 3);
      setRecommendedShoes(matched.slice(0, 3));
    } catch (error) {
      console.error(error);
      setAiResponse('Nos modèles phares VAYZA allient matériaux respirants et amorti dynamique pour vos journées actives.');
      setRecommendedShoes(products.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl overflow-hidden my-6 text-[#121212]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FF6321] text-white rounded-2xl shadow-md shadow-[#FF6321]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#121212] font-display uppercase tracking-tight">
                  Conseiller Style & Pointures VAYZA AI
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#FF6321]/10 text-[#FF6321] text-[9px] font-black uppercase">
                  IA Studio
                </span>
              </div>
              <p className="text-xs text-gray-500">Trouvez la paire parfaite selon votre morphologie et vos sorties</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-[#121212] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Questions step */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                1. Pour qui cherchez-vous une paire ?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['tous', 'homme', 'femme', 'enfant'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all ${
                      gender === g
                        ? 'bg-[#121212] text-white shadow-sm'
                        : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {g === 'tous' ? 'Tous' : g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                2. Quelle est l'occasion principale ?
              </label>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setOccasion(occ)}
                    className={`py-2 px-3.5 rounded-full text-xs font-bold transition-all ${
                      occasion === occ
                        ? 'bg-[#FF6321] text-white shadow-sm'
                        : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                3. Vos préférences ou besoins particuliers
              </label>
              <input
                type="text"
                value={stylePreference}
                onChange={(e) => setStylePreference(e.target.value)}
                placeholder="Ex: semelle souple, amorti, cuir élégant, imperméable..."
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <button
              onClick={handleGetAdvice}
              disabled={loading}
              className="w-full py-3.5 bg-[#121212] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FF6321]" />
                  <span>Analyse du catalogue VAYZA en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FF6321]" />
                  <span>Générer mes recommandations personnalisées</span>
                </>
              )}
            </button>
          </div>

          {/* AI Output */}
          {aiResponse && (
            <div className="pt-4 border-t border-gray-100 space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF6321] uppercase">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Le Conseil de Styliste VAYZA</span>
                </div>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  {aiResponse}
                </p>
              </div>

              {recommendedShoes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#121212] uppercase tracking-wider">
                    Modèles recommandés pour vous ({recommendedShoes.length}) :
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {recommendedShoes.map((shoe) => (
                      <div
                        key={shoe.id}
                        onClick={() => {
                          setSelectedProduct(shoe);
                          onClose();
                        }}
                        className="group bg-white p-3 rounded-2xl border border-gray-200 hover:border-[#FF6321] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <img
                            src={shoe.images[0]}
                            alt={shoe.name}
                            className="w-full h-28 object-cover rounded-xl bg-gray-50 group-hover:scale-102 transition-transform"
                          />
                          <p className="text-xs font-bold text-[#121212] mt-2 line-clamp-1">{shoe.name}</p>
                          <p className="text-[11px] text-gray-500">{shoe.category.toUpperCase()}</p>
                        </div>
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-xs font-black text-[#FF6321]">{formatFCFA(shoe.price)}</span>
                          <span className="text-[10px] font-bold text-gray-700 group-hover:text-[#FF6321] flex items-center gap-0.5">
                            Voir <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
