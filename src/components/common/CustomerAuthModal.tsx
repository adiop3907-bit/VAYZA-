import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Package,
  Gift
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CustomerAuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    customerLogin,
    customerRegister,
    customerGoogleLogin,
    SUPER_ADMIN_EMAIL,
    setCurrentView,
    siteSettings
  } = useStore();

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

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMsg(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await customerLogin(email, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Identifiants incorrects.');
      } else {
        handleClose();
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
        setErrorMsg(res.message || 'Impossible de créer le compte.');
      } else {
        handleClose();
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
      } else if (res.success) {
        handleClose();
      }
    } catch (err) {
      setErrorMsg('Erreur lors de la connexion avec Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isEmailAdmin = email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  return (
    <div 
      id="customer-auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        id="customer-auth-modal-card"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-[#121212] max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-100/80 hover:bg-gray-200 text-gray-500 hover:text-black transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header with Tabs */}
        <div className="bg-[#121212] text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6321]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl sm:text-2xl font-black font-display tracking-tight text-white uppercase">
                VAYZA
              </span>
              <span className="w-2 h-2 rounded-full bg-[#FF6321]" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF6321] ml-1 px-2 py-0.5 rounded-full bg-[#FF6321]/20">
                Espace Client
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black uppercase font-display tracking-tight">
              {authModalMode === 'login' ? 'Connexion à votre compte' : 'Créer votre compte VAYZA'}
            </h2>
            <p className="text-xs text-gray-300 mt-1">
              {authModalMode === 'login' 
                ? 'Retrouvez vos commandes, votre carnet d\'adresses et vos privilèges.' 
                : 'Bénéficiez de 10% de réduction de bienvenue et du suivi express à Dakar.'}
            </p>

            {/* Mode Switch Tabs */}
            <div className="flex items-center gap-2 mt-5 bg-white/10 p-1 rounded-2xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authModalMode === 'login'
                    ? 'bg-[#FF6321] text-white shadow-md'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('register');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authModalMode === 'register'
                    ? 'bg-[#FF6321] text-white shadow-md'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Créer un compte
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-5">
          
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google 1-Click Sign-In */}
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
            <span>
              {isGoogleLoading ? 'Connexion en cours...' : 'Continuer avec Google'}
            </span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider relative">
              ou avec votre email
            </span>
          </div>

          {/* Form Content */}
          {authModalMode === 'login' ? (
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
                    placeholder="exemple@gmail.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white transition-all"
                  />
                </div>
                {isEmailAdmin && (
                  <p className="text-[11px] text-[#FF6321] font-bold mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Compte Super Admin détecté (Accès ERP)</span>
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Mot de passe *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      alert('Pour réinitialiser votre mot de passe, contactez notre conciergerie WhatsApp au +221 77 123 45 67.');
                    }}
                    className="text-[11px] text-[#FF6321] hover:underline font-bold"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white transition-all"
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
                <span>{isLoading ? 'Connexion en cours...' : 'Se Connecter'}</span>
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
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
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
                    className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Numéro de Téléphone (Sénégal) *
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                  />
                </div>
              </div>

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
                    placeholder="moussa.diallo@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Zone de Livraison Dakar
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-3.5 w-4 h-4 text-gray-400" />
                    <select
                      value={deliveryZone}
                      onChange={(e) => setDeliveryZone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                    >
                      <option value="Dakar Centre & Almadies">Dakar Centre & Almadies</option>
                      <option value="Mermoz, Sacré-Cœur, Ouakam">Mermoz, Sacré-Cœur, Ouakam</option>
                      <option value="Banlieue & Guédiawaye">Banlieue & Guédiawaye</option>
                      <option value="Rufisque & Diamniadio">Rufisque & Diamniadio</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Pointure habituelle
                  </label>
                  <select
                    value={preferredSize}
                    onChange={(e) => setPreferredSize(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                  >
                    {[38, 39, 40, 41, 42, 43, 44, 45].map((sz) => (
                      <option key={sz} value={sz}>
                        EU {sz}
                      </option>
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
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
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

              <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-100 flex items-start gap-2.5 text-[11px] text-gray-700">
                <Gift className="w-4 h-4 text-[#FF6321] shrink-0 mt-0.5" />
                <span>
                  En créant votre compte, vous recevez automatiquement <strong>10% de réduction</strong> de bienvenue avec le code <strong>VAYZA10</strong>.
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

          {/* Quick Privileges Badge */}
          <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 text-[11px] text-gray-600">
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

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span>Besoin d'aide ?</span>
          <a
            href={`https://wa.me/${siteSettings.contactWhatsApp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#FF6321] font-bold hover:underline"
          >
            Assistance WhatsApp VAYZA
          </a>
        </div>
      </div>
    </div>
  );
};
