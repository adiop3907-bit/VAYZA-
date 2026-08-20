import React, { useEffect, useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { NotificationToast } from './components/common/NotificationToast';
import { SizeGuideModal } from './components/common/SizeGuideModal';
import { CartDrawer } from './components/store/CartDrawer';
import { WishlistDrawer } from './components/store/WishlistDrawer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ProductDetailModal } from './components/store/ProductDetailModal';
import { SplashScreen } from './components/common/SplashScreen';

// Storefront Sections
import { HeroSection } from './components/store/HeroSection';
import { CategoryBlocks } from './components/store/CategoryBlocks';
import { NewArrivalsSection } from './components/store/NewArrivalsSection';
import { BestSellersSection } from './components/store/BestSellersSection';
import { TrendingBanner } from './components/store/TrendingBanner';
import { PromotionsSection } from './components/store/PromotionsSection';
import { WhyVayzaSection } from './components/store/WhyVayzaSection';
import { PackagingExperience } from './components/store/PackagingExperience';
import { CustomerReviewsSection } from './components/store/CustomerReviewsSection';
import { SocialFeedSection } from './components/store/SocialFeedSection';

// Views
import { CatalogView } from './components/store/CatalogView';
import { CheckoutView } from './components/store/CheckoutView';
import { OrderTrackingView } from './components/store/OrderTrackingView';
import { WishlistView } from './components/store/WishlistView';
import { AboutView } from './components/store/AboutView';
import { ContactView } from './components/store/ContactView';
import { AccountView } from './components/store/AccountView';
import { AiStylistModal } from './components/store/AiStylistModal';
import { FaqAndPoliciesModal } from './components/store/FaqAndPoliciesModal';
import { CustomerAuthModal } from './components/common/CustomerAuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginGate } from './components/admin/AdminLoginGate';
import { Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import { buildWhatsAppSupportLink } from './utils/formatters';

const AppContent: React.FC = () => {
  const { 
    currentView, 
    siteSettings, 
    isAdminAuthenticated, 
    adminEmail, 
    SUPER_ADMIN_EMAIL,
    isSplashScreenOpen,
    setIsSplashScreenOpen
  } = useStore();
  const [isAiStylistOpen, setIsAiStylistOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  if (currentView === 'admin') {
    const isAuthorized = isAdminAuthenticated && adminEmail?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

    return (
      <div className="min-h-screen bg-gray-100/60 text-[#121212] font-sans selection:bg-[#FF6321] selection:text-white">
        {isAuthorized ? <AdminDashboard /> : <AdminLoginGate />}
        <NotificationToast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#121212] font-sans selection:bg-[#FF6321] selection:text-white relative w-full max-w-full overflow-x-hidden">
      {/* Brand Splash Screen on solid orange background */}
      {isSplashScreenOpen && (
        <SplashScreen onComplete={() => setIsSplashScreenOpen(false)} />
      )}

      {/* Global Header */}
      <Header />

      {/* Main Content Router */}
      <main className="flex-1 pb-20 md:pb-24">
        {currentView === 'store' && (
          <>
            <HeroSection />
            <CategoryBlocks />
            <NewArrivalsSection />
            <BestSellersSection />
            <TrendingBanner />
            <PromotionsSection />
            <WhyVayzaSection />
            <PackagingExperience />
            <CustomerReviewsSection />
            <SocialFeedSection />
          </>
        )}

        {currentView === 'catalog' && <CatalogView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'order-tracking' && <OrderTrackingView />}
        {currentView === 'account' && <AccountView />}
        {currentView === 'wishlist' && <WishlistView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'contact' && <ContactView />}
      </main>

      {/* Floating Quick Action Buttons */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 flex flex-col items-end gap-2.5">
        {/* AI Shoe Stylist Trigger */}
        <button
          onClick={() => setIsAiStylistOpen(true)}
          className="group flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#121212] hover:bg-black text-white rounded-full shadow-2xl hover:scale-105 transition-all text-xs font-black uppercase tracking-wider border border-white/20"
          title="Demander conseil au Styliste IA VAYZA"
        >
          <div className="p-1 rounded-full bg-[#FF6321] text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline">Conseiller Style IA</span>
        </button>

        {/* WhatsApp Direct Concierge */}
        <a
          href={buildWhatsAppSupportLink(siteSettings.contactWhatsApp)}
          target="_blank"
          rel="noreferrer"
          className="p-3 sm:p-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center border border-white/20"
          title="Discuter avec le service client VAYZA sur WhatsApp"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Bar */}
      <MobileBottomNav />

      {/* Overlays & Drawers (All seamlessly rendered on the same page) */}
      <CustomerAuthModal />
      <ProductDetailModal />
      <CartDrawer />
      <WishlistDrawer />
      <SizeGuideModal />
      <AiStylistModal isOpen={isAiStylistOpen} onClose={() => setIsAiStylistOpen(false)} />
      <FaqAndPoliciesModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
      <NotificationToast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
