import React from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard,
  Instagram,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppSupportLink } from '../../utils/formatters';

export const Footer: React.FC = () => {
  const { siteSettings, setCurrentView, setSelectedCategory, setIsSizeGuideOpen, triggerSplashScreen } = useStore();

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-100 text-gray-500 text-sm">
      {/* Brand Value Bar */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FF6321]/10 flex items-center justify-center text-[#FF6321] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[#121212] font-bold text-sm">Livraison Dakar 24h</h4>
                <p className="text-xs text-gray-500 mt-0.5">Expédition rapide à Dakar & dans toutes les régions du Sénégal.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FF6321]/10 flex items-center justify-center text-[#FF6321] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[#121212] font-bold text-sm">Paiements Sécurisés</h4>
                <p className="text-xs text-gray-500 mt-0.5">Wave, Orange Money, Free Money & Paiement à la livraison.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FF6321]/10 flex items-center justify-center text-[#FF6321] shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[#121212] font-bold text-sm">Échange de Pointure</h4>
                <p className="text-xs text-gray-500 mt-0.5">Pas la bonne taille ? Échange simplifié sous 48h.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FF6321]/10 flex items-center justify-center text-[#FF6321] shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[#121212] font-bold text-sm">Assistance WhatsApp 7j/7</h4>
                <p className="text-xs text-gray-500 mt-0.5">Conseils sur les modèles et suivi direct par nos équipes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6321] text-white flex items-center justify-center shadow-md shadow-[#FF6321]/20 shrink-0">
                <svg viewBox="0 0 100 100" className="w-6 h-6 text-white" fill="none">
                  <path d="M50 8 L90 50 L50 92 L10 50 Z" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
                  <path d="M28 28 L44 72 H56 L40 28 H28Z" fill="currentColor" />
                  <path d="M72 28 L56 72 H44 L60 28 H72Z" fill="currentColor" />
                  <path d="M30 36 H70 L64 43 H42 L68 64 H30 L36 57 H58 L30 36Z" fill="currentColor" />
                  <circle cx="50" cy="50" r="2.5" fill="#FF6321" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black tracking-tighter text-[#121212] font-display">
                    VAYZA
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#FF6321]"></span>
                </div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Maison de Chaussures Dakar
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              <span className="font-bold text-[#121212]">VAYZA — Your Style. Your Step.</span><br />
              Boutique spécialisée exclusivement dans la chaussure et la sneaker d'exception. Une marque pensée pour le rythme urbain et l'élégance de Dakar et de l'Afrique de l'Ouest.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={triggerSplashScreen}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100/80 text-[#FF6321] text-[11px] font-bold rounded-xl border border-orange-200/70 transition-all"
                title="Afficher l'animation d'ouverture VAYZA"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Revoir le Splash Screen VAYZA</span>
              </button>
            </div>

            <div className="pt-2">
              <div className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">
                Moyens de Paiement Acceptés
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 bg-white text-[#1CA0F2] font-bold text-xs rounded-full border border-gray-200 shadow-2xs flex items-center gap-1">
                  🌊 Wave
                </span>
                <span className="px-2.5 py-1 bg-white text-[#FF6600] font-bold text-xs rounded-full border border-gray-200 shadow-2xs flex items-center gap-1">
                  🍊 Orange Money
                </span>
                <span className="px-2.5 py-1 bg-white text-red-500 font-bold text-xs rounded-full border border-gray-200 shadow-2xs">
                  Free Money
                </span>
                <span className="px-2.5 py-1 bg-white text-gray-700 font-medium text-xs rounded-full border border-gray-200 shadow-2xs">
                  Paiement à la livraison
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-widest text-gray-400">Collections</h5>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => handleCategoryClick('sneakers')} className="hover:text-[#121212] transition-colors">
                  Sneakers Lifestyle & Running
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('homme')} className="hover:text-[#121212] transition-colors">
                  Homme (Mocassins & Derbies)
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('femme')} className="hover:text-[#121212] transition-colors">
                  Femme (Escarpins & Sandales)
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('enfant')} className="hover:text-[#121212] transition-colors">
                  Enfants (Scratch & Scolaire)
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('promotions')} className="text-[#FF6321] font-bold hover:underline">
                  Offres & Promotions (-30%)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Guide & Services */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-widest text-gray-400">Aide & Conseils</h5>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[#FF6321] font-bold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Guide des Tailles (EU 36-45)
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('order-tracking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#121212] transition-colors">
                  Suivre ma commande (#VZ-...)
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#121212] transition-colors">
                  L'expérience Packaging VAYZA
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#121212] transition-colors">
                  Foire Aux Questions (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & WhatsApp */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-widest text-gray-400">Contact Direct</h5>
            <div className="space-y-2.5 text-xs">
              <a 
                href={buildWhatsAppSupportLink(siteSettings.contactWhatsApp)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all font-bold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp VAYZA 24/7</span>
              </a>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{siteSettings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{siteSettings.contactEmail}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>{siteSettings.contactAddress || siteSettings.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} <span className="text-[#121212] font-bold">VAYZA SN</span>. Tous droits réservés.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Catalogue Certifié 100% Officiel
            </span>
            <span>•</span>
            <span>Dakar, Sénégal 🇸🇳</span>
            <span>•</span>
            <button
              onClick={() => {
                setCurrentView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-gray-400 hover:text-[#FF6321] transition-colors flex items-center gap-1 text-[11px]"
              title="Accès Direction / Administration"
            >
              <span>Accès Gérant</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
