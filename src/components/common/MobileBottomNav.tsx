import React, { useRef } from 'react';
import { 
  Home, 
  Grid, 
  Heart, 
  ShoppingBag, 
  User,
  LogIn,
  Sparkles,
  Package,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppSupportLink } from '../../utils/formatters';

export const MobileBottomNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cart,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    isCustomerAuthenticated,
    customer,
    openAuthModal,
    setSelectedCategory,
    siteSettings,
    setIsAiStylistOpen
  } = useStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const cartItemCount = (cart || []).reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = (wishlist || []).length;

  const handleHomeClick = () => {
    setSelectedCategory('all');
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCatalogClick = () => {
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWishlistClick = () => {
    setIsWishlistOpen(true);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleAccountClick = () => {
    if (isCustomerAuthenticated) {
      setCurrentView('account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      openAuthModal('login');
    }
  };

  const handleTrackingClick = () => {
    setCurrentView('order-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollDock = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <nav
      id="bottom-dock-nav"
      aria-label="Navigation d'accès rapide et dock interactif"
      className="fixed z-40 select-none transition-all duration-300
        /* Mobile: Pleine largeur en bas en Liquid Glass */
        bottom-0 inset-x-0 w-full bg-white/80 backdrop-blur-2xl backdrop-saturate-200 border-t border-white/60 shadow-[0_-4px_30px_rgba(0,0,0,0.1)]
        /* Tablette & Ordinateur: Dock flottant centré en bas en Liquid Glass */
        md:bottom-5 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-auto md:max-w-[92vw] lg:max-w-2xl md:rounded-2xl md:border md:border-white/80 md:shadow-[0_15px_50px_rgba(0,0,0,0.18)] md:bg-white/80"
    >
      <div className="relative flex items-center px-1 sm:px-2 md:px-3 py-1.5 md:py-2">
        {/* Optional scroll button Left on tablets/desktops */}
        <button
          type="button"
          onClick={() => scrollDock('left')}
          className="hidden md:flex items-center justify-center w-6 h-6 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0 mr-1"
          title="Défiler vers la gauche"
          aria-label="Défiler vers la gauche"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Container (Défilement horizontal fluide de gauche à droite) */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full px-1 py-0.5 touch-pan-x"
        >
          {/* 1. Accueil */}
          <button
            type="button"
            onClick={handleHomeClick}
            className={`shrink-0 flex flex-col md:flex-row items-center justify-center py-1 px-2.5 sm:px-3 md:py-1.5 md:px-3.5 rounded-xl transition-all ${
              currentView === 'store'
                ? 'text-[#FF6321] font-black bg-[#FF6321]/10'
                : 'text-gray-600 hover:text-[#121212] hover:bg-gray-100/70'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5 md:mb-0 md:mr-1.5" />
            <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">Accueil</span>
          </button>

          {/* 2. Catalogue */}
          <button
            type="button"
            onClick={handleCatalogClick}
            className={`shrink-0 flex flex-col md:flex-row items-center justify-center py-1 px-2.5 sm:px-3 md:py-1.5 md:px-3.5 rounded-xl transition-all ${
              currentView === 'catalog'
                ? 'text-[#FF6321] font-black bg-[#FF6321]/10'
                : 'text-gray-600 hover:text-[#121212] hover:bg-gray-100/70'
            }`}
          >
            <Grid className="w-5 h-5 mb-0.5 md:mb-0 md:mr-1.5" />
            <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">Catalogue</span>
          </button>

          {/* 3. Favoris (Wishlist) */}
          <button
            type="button"
            onClick={handleWishlistClick}
            className="shrink-0 relative flex flex-col md:flex-row items-center justify-center py-1 px-2.5 sm:px-3 md:py-1.5 md:px-3.5 rounded-xl text-gray-600 hover:text-[#121212] hover:bg-gray-100/70 transition-all"
            title="Ouvrir mes favoris"
          >
            <div className="relative">
              <Heart className={`w-5 h-5 mb-0.5 md:mb-0 md:mr-1.5 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 md:-top-1.5 md:-right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">Favoris</span>
          </button>

          {/* 4. Panier (Cart) */}
          <button
            type="button"
            onClick={handleCartClick}
            className="shrink-0 relative flex flex-col md:flex-row items-center justify-center py-1 px-3 sm:px-3.5 md:py-1.5 md:px-4 rounded-xl bg-gray-900 text-white hover:bg-black transition-all shadow-sm active:scale-95"
            title="Ouvrir le panier d'achat"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-0.5 md:mb-0 md:mr-1.5 text-[#FF6321]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 md:-top-1.5 md:-right-1 min-w-[16px] h-4 px-1 bg-[#FF6321] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] md:text-xs font-black whitespace-nowrap">Panier</span>
          </button>

          {/* 5. Compte / Connexion */}
          <button
            type="button"
            onClick={handleAccountClick}
            className={`shrink-0 flex flex-col md:flex-row items-center justify-center py-1 px-2.5 sm:px-3 md:py-1.5 md:px-3.5 rounded-xl transition-all ${
              currentView === 'account'
                ? 'text-[#FF6321] font-black bg-[#FF6321]/10'
                : 'text-gray-600 hover:text-[#121212] hover:bg-gray-100/70'
            }`}
            title={isCustomerAuthenticated ? `Mon compte (${customer.firstName || 'Client'})` : 'Se connecter'}
          >
            {isCustomerAuthenticated ? (
              <div className="w-5 h-5 mb-0.5 md:mb-0 md:mr-1.5 rounded-full bg-[#FF6321] text-white flex items-center justify-center text-[10px] font-black">
                {customer.firstName ? customer.firstName[0].toUpperCase() : 'C'}
              </div>
            ) : (
              <LogIn className="w-5 h-5 mb-0.5 md:mb-0 md:mr-1.5" />
            )}
            <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">
              {isCustomerAuthenticated ? (customer.firstName ? customer.firstName.slice(0, 8) : 'Compte') : 'Connexion'}
            </span>
          </button>

          {/* 6. Styliste IA */}
          <button
            type="button"
            onClick={() => setIsAiStylistOpen(true)}
            className="shrink-0 flex flex-col md:flex-row items-center justify-center py-1 px-2.5 sm:px-3 md:py-1.5 md:px-3.5 rounded-xl text-gray-700 hover:text-[#FF6321] hover:bg-[#FF6321]/10 transition-all"
            title="Conseiller Styliste IA VAYZA"
          >
            <Sparkles className="w-5 h-5 mb-0.5 md:mb-0 md:mr-1.5 text-[#FF6321]" />
            <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">Styliste IA</span>
          </button>

          {/* 7. Suivi Colis */}
          <button
            type="button"
            onClick={handleTrackingClick}
            className={`shrink-0 flex flex-col md:flex-row items-center justify-center py-1 px-2.5 sm:px-3 md:py-1.5 md:px-3.5 rounded-xl transition-all ${
              currentView === 'order-tracking'
                ? 'text-[#FF6321] font-black bg-[#FF6321]/10'
                : 'text-gray-600 hover:text-[#121212] hover:bg-gray-100/70'
            }`}
            title="Suivre une commande"
          >
            <Package className="w-5 h-5 mb-0.5 md:mb-0 md:mr-1.5 text-[#FF6321]" />
            <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">Suivi Colis</span>
          </button>

          {/* 8. Assistance WhatsApp */}
          <a
            href={buildWhatsAppSupportLink(siteSettings.contactWhatsApp)}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 flex flex-col md:flex-row items-center justify-center py-1 px-2.5 sm:px-3 md:py-1.5 md:px-3.5 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-all"
            title="Assistance client directe WhatsApp"
          >
            <MessageCircle className="w-5 h-5 mb-0.5 md:mb-0 md:mr-1.5" />
            <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">WhatsApp</span>
          </a>
        </div>

        {/* Optional scroll button Right on tablets/desktops */}
        <button
          type="button"
          onClick={() => scrollDock('right')}
          className="hidden md:flex items-center justify-center w-6 h-6 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0 ml-1"
          title="Défiler vers la droite"
          aria-label="Défiler vers la droite"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
