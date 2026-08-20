import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  CreditCard, 
  Phone, 
  ChevronDown, 
  MessageCircle,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppSupportLink } from '../../utils/formatters';

interface FaqAndPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaqAndPoliciesModal: React.FC<FaqAndPoliciesModalProps> = ({ isOpen, onClose }) => {
  const { siteSettings } = useStore();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: "Comment fonctionne l'échange de pointure sous 48h à Dakar ?",
      a: "Si votre paire de chaussures est trop petite ou trop grande, contactez immédiatement notre service client sur WhatsApp. Un coursier passe à votre adresse récupérer la paire non portée (dans sa boîte d'origine) et vous livre la nouvelle pointure sans tracas."
    },
    {
      q: "Quels sont les délais et zones de livraison ?",
      a: "• Dakar Centre, Plateau, Almadies, Mermoz, Yoff : Livraison express le jour même (2 à 4 heures).\n• Banlieue de Dakar (Pikine, Guédiawaye, Keur Massar, Rufisque) : Livraison sous 24h.\n• Régions du Sénégal (Thiès, Saint-Louis, Mbour, Touba, Ziguinchor) : Livraison en 24h à 48h via nos transporteurs partenaires."
    },
    {
      q: "Quels sont les modes de paiement acceptés ?",
      a: "Vous pouvez régler au moment de la livraison en espèces (Cash on Delivery) après avoir vérifié votre colis, ou payer immédiatement par Wave, Orange Money, Free Money ou carte bancaire sécurisée."
    },
    {
      q: "Les chaussures VAYZA sont-elles garanties d'origine et authentiques ?",
      a: "Absolument. VAYZA contrôle scrupuleusement son approvisionnement, la qualité des finitions, des cuirs, des meshes et des semelles amortissantes. Chaque modèle est vérifié à la main avant expédition."
    },
    {
      q: "Puis-je essayer les chaussures avant de payer le coursier ?",
      a: "Oui ! À Dakar et en banlieue, notre livreur vous permet d'essayer votre paire en sa présence afin de vérifier la pointure et le confort avant de finaliser votre paiement."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl overflow-hidden my-6 text-[#121212]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#121212] text-white rounded-2xl shadow-sm">
              <HelpCircle className="w-5 h-5 text-[#FF6321]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#121212] font-display uppercase tracking-tight">
                FAQ & Engagements VAYZA
              </h2>
              <p className="text-xs text-gray-500">Tout savoir sur la livraison, les pointures et les garanties</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-[#121212] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          
          {/* Key Value Props Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-1.5">
              <div className="flex items-center gap-2 text-[#FF6321] font-bold uppercase">
                <Truck className="w-4 h-4" />
                <span>Express Dakar 2-4h</span>
              </div>
              <p className="text-gray-600 font-medium">Livraison rapide à domicile ou au bureau.</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-700 font-bold uppercase">
                <RotateCcw className="w-4 h-4" />
                <span>Échange 48h Garanti</span>
              </div>
              <p className="text-gray-600 font-medium">Pointure trop petite ou grande ? Nous l'échangeons.</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-700 font-bold uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Paiement à Réception</span>
              </div>
              <p className="text-gray-600 font-medium">Wave, Orange Money ou Espèces après vérification.</p>
            </div>
          </div>

          {/* Accordion FAQs */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Questions Fréquemment Posées
            </h3>

            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-gray-50/80 rounded-2xl border border-gray-100 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#121212] hover:text-[#FF6321] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-[#FF6321]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed whitespace-pre-line border-t border-gray-100/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* WhatsApp Direct Concierge */}
          <div className="p-5 rounded-2xl bg-[#121212] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold font-display">Besoin d'une assistance immédiate ?</h4>
              <p className="text-xs text-neutral-300">Notre équipe VAYZA à Dakar est disponible 7j/7 sur WhatsApp.</p>
            </div>
            <a
              href={buildWhatsAppSupportLink(siteSettings.contactWhatsApp, "J'ai une question concernant une commande ou un échange de pointure.")}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Discuter sur WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
