import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShoppingBag,
  ExternalLink,
  Edit3,
  Check,
  Gift,
  LogOut,
  LogIn,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA, formatDateTime } from '../../utils/formatters';

export const AccountView: React.FC = () => {
  const { 
    orders, 
    wishlistIds, 
    products, 
    setCurrentView, 
    setSelectedProduct, 
    showNotification,
    isAdminAuthenticated,
    adminEmail,
    SUPER_ADMIN_EMAIL,
    customer,
    isCustomerAuthenticated,
    customerLogin,
    customerRegister,
    customerGoogleLogin,
    customerLogout,
    updateCustomerProfile,
    authModalMode,
    setAuthModalMode,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'loyalty'>('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(customer);

  // Authentication form state for non-logged users
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+221 ');
  const [deliveryZone, setDeliveryZone] = useState('Dakar Centre & Almadies');
  const [preferredSize, setPreferredSize] = useState<number>(42);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isSuperAdmin = isAdminAuthenticated && adminEmail?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await customerLogin(email, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Identifiants incorrects.');
      }
    } catch (err) {
      setErrorMsg('Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await customerRegister({
        email,
        firstName,
        lastName,
        phone,
        deliveryZone,
        preferredSize,
      }, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Erreur lors de la création du compte.');
      }
    } catch (err) {
      setErrorMsg('Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    try {
      const res = await customerGoogleLogin();
      if (!res.success && res.message && !res.message.includes('annulée')) {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('Erreur lors de la connexion Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile(editForm);
    setIsEditing(false);
  };

  // IF NOT AUTHENTICATED: Display Full Account Connexion / Inscription View
  if (!isCustomerAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50/60 py-12 lg:py-20 text-[#121212]">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            
            {/* Header Banner */}
            <div className="bg-[#121212] text-white p-7 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6321]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-black font-display tracking-tight text-white uppercase">
                    VAYZA
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#FF6321]" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6321] px-2 py-0.5 rounded-full bg-[#FF6321]/20">
                    Espace Client Sécurisé
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black uppercase font-display tracking-tight">
                  {authMode === 'login' ? 'Connexion à votre compte' : 'Créer un compte client'}
                </h1>
                <p className="text-xs text-gray-300 mt-1.5">
                  {authMode === 'login'
                    ? 'Accédez à votre historique de commandes, suivi de livraison et avantages exclusifs.'
                    : 'Rejoignez le VAYZA Club pour bénéficier de 10% de bienvenue et du service express Dakar.'}
                </p>

                {/* Tabs Switcher */}
                <div className="flex items-center gap-2 mt-6 bg-white/10 p-1 rounded-2xl backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMsg(null);
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      authMode === 'login'
                        ? 'bg-[#FF6321] text-white shadow-md'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Se connecter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMsg(null);
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      authMode === 'register'
                        ? 'bg-[#FF6321] text-white shadow-md'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Créer un compte
                  </button>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-6 sm:p-8 space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isGoogleLoading}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center gap-3 shadow-xs hover:border-gray-300 transition-all active:scale-[0.99] disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                <span>{isGoogleLoading ? 'Connexion en cours...' : 'Continuer avec Google'}</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider relative">
                  ou avec vos identifiants
                </span>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                      Adresse Email *
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre.email@exemple.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                      Mot de passe *
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-[#121212] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                  >
                    <span>{isLoading ? 'Connexion...' : 'Se Connecter'}</span>
                    <ArrowRight className="w-4 h-4 text-[#FF6321]" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Prénom *
                      </label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Moussa"
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Diallo"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                      Téléphone Sénégal *
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+221 77 000 00 00"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                      Email *
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="moussa.diallo@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Zone de Livraison
                      </label>
                      <select
                        value={deliveryZone}
                        onChange={(e) => setDeliveryZone(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                      >
                        <option value="Dakar Centre & Almadies">Dakar Centre & Almadies</option>
                        <option value="Mermoz, Sacré-Cœur, Ouakam">Mermoz, Sacré-Cœur, Ouakam</option>
                        <option value="Banlieue & Guédiawaye">Banlieue & Guédiawaye</option>
                        <option value="Rufisque & Diamniadio">Rufisque & Diamniadio</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Pointure Habituelle
                      </label>
                      <select
                        value={preferredSize}
                        onChange={(e) => setPreferredSize(Number(e.target.value))}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                      >
                        {[38, 39, 40, 41, 42, 43, 44, 45].map((s) => (
                          <option key={s} value={s}>EU {s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                      Mot de passe *
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Au moins 6 caractères"
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-2.5 text-[11px] text-gray-700">
                    <Gift className="w-4 h-4 text-[#FF6321] shrink-0 mt-0.5" />
                    <span>
                      En créant votre compte, vous recevez automatiquement <strong>10% de remise</strong> avec le code <strong>VAYZA10</strong>.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-[#FF6321] hover:bg-[#E5591E] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <span>{isLoading ? 'Création du compte...' : 'Créer mon compte VAYZA'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Perks */}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-[11px] text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Livraison Express Dakar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Échange de pointure 48h</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED: Display Full Customer Dashboard
  return (
    <div className="min-h-screen bg-gray-50/50 py-10 lg:py-16 text-[#121212]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card with Glassmorphism */}
        <div className="relative overflow-hidden bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FF6321] text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shadow-[#FF6321]/30 font-display">
                {customer.firstName ? customer.firstName[0].toUpperCase() : 'C'}{customer.lastName ? customer.lastName[0].toUpperCase() : ''}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-[#121212] font-display uppercase tracking-tight">
                    {customer.firstName} {customer.lastName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Connecté</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF6321]/10 text-[#FF6321] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>VAYZA Club</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {customer.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {customer.phone}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {customer.city} ({customer.deliveryZone})
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {isSuperAdmin && (
                <button
                  onClick={() => setCurrentView('admin')}
                  className="px-4 py-2.5 rounded-full bg-[#121212] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FF6321]" />
                  <span>Accès Admin ERP</span>
                </button>
              )}

              <button
                onClick={() => setCurrentView('order-tracking')}
                className="px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-[#FF6321]" />
                <span>Suivre un colis</span>
              </button>

              {/* Déconnexion button */}
              <button
                onClick={customerLogout}
                className="px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all flex items-center gap-2"
                title="Se déconnecter de votre compte"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-gray-100 mt-6 pt-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-[#121212] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#121212] hover:bg-gray-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Mes Commandes ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-[#121212] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#121212] hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profil & Coordonnées</span>
            </button>

            <button
              onClick={() => setActiveTab('loyalty')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'loyalty'
                  ? 'bg-[#121212] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#121212] hover:bg-gray-100'
              }`}
            >
              <Gift className="w-4 h-4 text-[#FF6321]" />
              <span>Avantages & Réductions</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#121212] uppercase font-display tracking-tight">
                Historique de vos commandes
              </h2>
              <span className="text-xs text-gray-500 font-medium">{orders.length} commande(s) au total</span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl p-12 text-center shadow-lg shadow-gray-200/50 space-y-4">
                <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mx-auto text-[#FF6321]">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-[#121212]">Aucune commande pour le moment</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Découvrez nos modèles exclusifs et passez votre première commande avec livraison express à Dakar.
                </p>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="px-6 py-2.5 bg-[#FF6321] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md hover:bg-[#E5591E] transition-all"
                >
                  Commander une paire
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-md shadow-gray-200/40 hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#FF6321] uppercase">
                            {order.id}
                          </span>
                          <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'livree'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'annulee'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>Commandé le {formatDateTime(order.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:text-right">
                        <div>
                          <div className="text-xs text-gray-400 font-medium">Total Commande</div>
                          <div className="text-base font-black text-[#121212]">{formatFCFA(order.total)}</div>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentView('order-tracking');
                          }}
                          className="px-4 py-2 rounded-full bg-gray-100 hover:bg-[#121212] hover:text-white text-gray-800 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <span>Suivre</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Order items preview */}
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50/80 p-2.5 rounded-2xl border border-gray-100">
                          <img src={it.image} alt={it.name} className="w-12 h-12 rounded-xl object-cover bg-white" />
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-bold text-[#121212] truncate">{it.name}</p>
                            <p className="text-gray-500 text-[11px]">EU {it.size} • {it.color} (x{it.quantity})</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile & Delivery Details */}
        {activeTab === 'profile' && (
          <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/50">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-black text-[#121212] font-display uppercase tracking-tight">
                  Coordonnées & Adresse de Livraison
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Enregistrées pour pré-remplir instantanément vos commandes.
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => {
                    setEditForm(customer);
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 rounded-full bg-gray-100 hover:bg-[#121212] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modifier</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="pt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom de famille *</label>
                    <input
                      type="text"
                      required
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Numéro de Téléphone (Sénégal) *</label>
                    <input
                      type="tel"
                      required
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">WhatsApp de confirmation</label>
                    <input
                      type="tel"
                      value={editForm.whatsapp}
                      onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pointure habituelle (EU)</label>
                    <select
                      value={editForm.preferredSize}
                      onChange={(e) => setEditForm({ ...editForm, preferredSize: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                    >
                      {[36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46].map((s) => (
                        <option key={s} value={s}>EU {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Adresse complète & quartier *</label>
                    <input
                      type="text"
                      required
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Zone de Livraison à Dakar</label>
                    <select
                      value={editForm.deliveryZone}
                      onChange={(e) => setEditForm({ ...editForm, deliveryZone: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                    >
                      <option value="Dakar Centre & Almadies">Dakar Centre & Almadies</option>
                      <option value="Mermoz, Sacré-Cœur, Ouakam">Mermoz, Sacré-Cœur, Ouakam</option>
                      <option value="Banlieue & Guédiawaye">Banlieue & Guédiawaye</option>
                      <option value="Rufisque & Diamniadio">Rufisque & Diamniadio</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-500 hover:text-gray-800"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#FF6321] hover:bg-[#E5591E] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#FF6321]/20 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Enregistrer</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <span className="text-gray-400 font-bold uppercase">Identité</span>
                  <p className="font-bold text-[#121212] text-sm">{customer.firstName} {customer.lastName}</p>
                  <p className="text-gray-600">{customer.email}</p>
                  <p className="text-[#FF6321] font-medium">Pointure préférée : EU {customer.preferredSize}</p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <span className="text-gray-400 font-bold uppercase">Livraison par défaut</span>
                  <p className="font-bold text-[#121212]">{customer.address}</p>
                  <p className="text-gray-600">{customer.city} • Zone : {customer.deliveryZone}</p>
                  <p className="text-gray-600">Téléphone coursier : {customer.phone}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Loyalty & VIP Club */}
        {activeTab === 'loyalty' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#121212] to-[#25252d] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6321]/20 text-[#FF6321] text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Programme Fidélité VAYZA VIP</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight">
                  Vos Avantages Exclusifs
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300">
                  En tant que client VAYZA, bénéficiez de remises exclusives, de l'accès prioritaire aux nouveaux arrivages et de la garantie échange de pointure 48h gratuite à Dakar.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-[110px]">
                    <div className="text-xl font-black text-[#FF6321]">5%</div>
                    <div className="text-[10px] text-neutral-400 uppercase font-bold">Dès 2 paires</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-[110px]">
                    <div className="text-xl font-black text-emerald-400">Gratuit</div>
                    <div className="text-[10px] text-neutral-400 uppercase font-bold">Échange 48h</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exclusive Promo Card */}
            <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-xl shadow-gray-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#FF6321] uppercase tracking-wider">Code Promo de Bienvenue</span>
                <h4 className="text-lg font-black text-[#121212] font-display">VAYZA10 — 10% de réduction immédiate</h4>
                <p className="text-xs text-gray-500">Valable sur votre prochaine commande de sneakers ou mocassins.</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('VAYZA10');
                  showNotification('Code promo VAYZA10 copié dans le presse-papier !', 'success');
                }}
                className="px-5 py-2.5 rounded-full bg-[#121212] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm shrink-0"
              >
                Copier le code
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
