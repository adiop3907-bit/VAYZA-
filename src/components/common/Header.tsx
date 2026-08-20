import React, { useState, useRef } from 'react';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Package, 
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Tag,
  Footprints,
  Users,
  Flame,
  Shirt
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedCategory,
    setSelectedCategory,
    selectedGender,
    setSelectedGender,
    siteSettings,
    searchQuery,
    setSearchQuery,
    isAdminAuthenticated,
    adminEmail,
    SUPER_ADMIN_EMAIL,
    setIsAiStylistOpen
  } = useStore();

  const isSuperAdmin = isAdminAuthenticated && adminEmail?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  const handleSelectCategory = (view: any, category = 'all', gender = 'all') => {
    setSelectedCategory(category);
    setSelectedGender(gender);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoriesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const allCategories = [
    { label: 'Tous les modèles', view: 'catalog', category: 'all', gender: 'all', icon: LayoutGrid },
    { label: 'Sneakers', view: 'catalog', category: 'sneakers', gender: 'all', icon: Footprints, popular: true },
    { label: 'Hommes', view: 'catalog', category: 'homme', gender: 'homme', icon: Users },
    { label: 'Femmes', view: 'catalog', category: 'femme', gender: 'femme', icon: Users },
    { label: 'Enfants', view: 'catalog', category: 'enfant', gender: 'enfant', icon: Users },
    { label: 'Nouveautés', view: 'catalog', category: 'nouveautes', gender: 'all', badge: 'Nouveau', icon: Sparkles },
    { label: 'Promotions', view: 'catalog', category: 'promotions', gender: 'all', badge: '-30%', icon: Tag },
    { label: 'Running & Sport', view: 'catalog', category: 'running', gender: 'all', icon: Flame },
    { label: 'Mocassins Cuir', view: 'catalog', category: 'mocassins', gender: 'all', icon: Footprints },
    { label: 'Ville & Casual', view: 'catalog', category: 'casual', gender: 'all', icon: Shirt },
    { label: 'Bottines & Boots', view: 'catalog', category: 'bottines', gender: 'all', icon: Footprints },
    { label: 'Sandales & Claquettes', view: 'catalog', category: 'sandales', gender: 'all', icon: Footprints },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/75 backdrop-blur-2xl backdrop-saturate-200 border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-all select-none">
      {/* Top Announcement Bar */}
      {siteSettings.announcementActive && (
        <div className="bg-[#FF6321] text-white text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-3 shadow-inner">
          <span className="tracking-wide">{siteSettings.announcementText}</span>
          <span className="hidden md:inline-block px-2 py-0.5 bg-black/15 rounded-full text-[10px] uppercase font-black tracking-wider">
            Sénégal & UEMOA
          </span>
        </div>
      )}

      {/* Barre Principale d'Actions (Recherche, Suivi, Styliste IA, Admin) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Titre ou Indicateur de Navigation à gauche */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedGender('all');
                setCurrentView('store');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#121212] hover:text-[#FF6321] transition-colors flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF6321]" />
              <span>Rayons & Collections</span>
            </button>
          </div>

          {/* Contrôles d'actions à droite en Liquid Glass */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Bouton Styliste IA */}
            <button
              onClick={() => setIsAiStylistOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/15 hover:from-orange-500/25 hover:to-amber-500/25 text-[#121212] border border-orange-200/70 text-xs font-bold transition-all shadow-xs"
              title="Conseiller Styliste IA VAYZA"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6321]" />
              <span>Styliste IA</span>
            </button>

            {/* Déclencheur de Recherche */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/70 hover:bg-white/95 backdrop-blur-md border border-white/80 text-gray-700 hover:text-[#121212] shadow-xs text-xs font-medium transition-all"
              title="Recherche intelligente (⌘K)"
              aria-label="Recherche"
            >
              <Search className="w-4 h-4 text-gray-600" />
              <span className="hidden md:inline">Rechercher...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 text-[9px] bg-white/80 text-gray-500 rounded border border-gray-200 font-mono font-bold shadow-xs">
                ⌘K
              </kbd>
            </button>

            {/* Suivre ma commande */}
            <button
              onClick={() => {
                setCurrentView('order-tracking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md ${
                currentView === 'order-tracking'
                  ? 'bg-[#FF6321] text-white shadow-sm'
                  : 'bg-white/70 hover:bg-white/95 text-gray-700 hover:text-[#121212] border border-white/80 shadow-xs'
              }`}
              title="Suivre une commande"
            >
              <Package className={`w-4 h-4 ${currentView === 'order-tracking' ? 'text-white' : 'text-[#FF6321]'}`} />
              <span className="hidden sm:inline">Suivi Colis</span>
            </button>

            {/* Bouton Super Admin (Affiché uniquement pour senjaaba221@gmail.com) */}
            {isSuperAdmin && (
              <button
                onClick={() => {
                  if (currentView === 'admin') {
                    setCurrentView('store');
                  } else {
                    setCurrentView('admin');
                  }
                }}
                className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold transition-all shrink-0 backdrop-blur-md ${
                  currentView === 'admin'
                    ? 'bg-[#121212] text-white shadow-sm'
                    : 'bg-white/80 border border-white text-gray-700 hover:bg-white shadow-xs'
                }`}
                title="Accès Administrateur / CMS & ERP (senjaaba221@gmail.com)"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6321]" />
                <span className="hidden sm:inline">
                  {currentView === 'admin' ? 'Boutique' : 'Admin & CMS'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              </button>
            )}
          </div>
        </div>

        {/* Live Search Bar en Liquid Glass */}
        {isSearchOpen && (
          <div className="py-2.5 border-t border-white/50 animate-fadeIn">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'catalog') {
                    setCurrentView('catalog');
                  }
                }}
                placeholder="Rechercher par modèle, genre, couleur, pointure (ex: Air Street, 42, Cuir, Mocassin)..."
                className="w-full bg-white/85 backdrop-blur-md border border-white rounded-2xl pl-10 pr-10 py-2 text-sm text-[#121212] placeholder-gray-400 shadow-xs focus:outline-none focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/30 transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-gray-400 hover:text-[#121212]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* RAIL HORIZONTAL DES CATÉGORIES EN LIQUID GLASS DÉFILANT DE GAUCHE À DROITE */}
        {/* ========================================================================= */}
        <div className="relative flex items-center py-2 pb-2.5 border-t border-white/40">
          
          {/* Flèche de défilement vers la gauche */}
          <button
            type="button"
            onClick={() => scrollCategories('left')}
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-[#121212] shadow-xs hover:shadow-md border border-white/80 backdrop-blur-md transition-all shrink-0 mr-1.5 active:scale-90"
            title="Défiler vers la gauche"
            aria-label="Défiler vers la gauche"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Rail à défilement horizontal fluide */}
          <div
            ref={categoriesScrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full px-0.5 py-0.5 touch-pan-x"
          >
            {allCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive =
                currentView === cat.view &&
                selectedCategory === cat.category &&
                (cat.gender === 'all' || selectedGender === cat.gender);

              return (
                <button
                  key={cat.label}
                  onClick={() => handleSelectCategory(cat.view, cat.category, cat.gender)}
                  className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all backdrop-blur-md ${
                    isActive
                      ? 'bg-[#FF6321] text-white shadow-md shadow-[#FF6321]/30 border border-[#FF6321] scale-[1.02]'
                      : 'bg-white/70 hover:bg-white/95 text-gray-800 hover:text-[#121212] border border-white/80 shadow-xs hover:shadow-sm'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#FF6321]'}`} />
                  <span className="whitespace-nowrap">{cat.label}</span>
                  {cat.badge && (
                    <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-full ${
                      isActive ? 'bg-white text-[#FF6321]' : 'bg-[#FF6321] text-white shadow-xs'
                    }`}>
                      {cat.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Flèche de défilement vers la droite */}
          <button
            type="button"
            onClick={() => scrollCategories('right')}
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-[#121212] shadow-xs hover:shadow-md border border-white/80 backdrop-blur-md transition-all shrink-0 ml-1.5 active:scale-90"
            title="Défiler vers la droite"
            aria-label="Défiler vers la droite"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
