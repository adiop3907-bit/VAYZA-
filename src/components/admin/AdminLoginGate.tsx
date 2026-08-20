import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { auth, googleProvider } from '../../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export const AdminLoginGate: React.FC = () => {
  const { adminLogin, setCurrentView, showNotification, SUPER_ADMIN_EMAIL } = useStore();
  const [email, setEmail] = useState('senjaaba221@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await adminLogin(email, password);
      if (!result.success) {
        setErrorMessage(result.message || 'Authentification impossible. Accès refusé.');
        showNotification(result.message || 'Accès refusé.', 'error');
      } else {
        showNotification('Connexion administrateur réussie ! Bienvenue sur VAYZA ERP.', 'success');
      }
    } catch (err: any) {
      setErrorMessage('Une erreur est survenue lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const userEmail = cred.user.email?.toLowerCase();
      if (userEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
        const result = await adminLogin(SUPER_ADMIN_EMAIL);
        if (result.success) {
          showNotification(`Connexion Google réussie avec ${SUPER_ADMIN_EMAIL}`, 'success');
        }
      } else {
        await auth.signOut();
        setErrorMessage(`Accès refusé pour ${userEmail}. Seul ${SUPER_ADMIN_EMAIL} est autorisé.`);
        showNotification(`Compte ${userEmail} non autorisé.`, 'error');
      }
    } catch (err: any) {
      console.warn('Google sign in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage('Erreur lors de la connexion Google. Vous pouvez utiliser le formulaire ci-dessous.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Background Decorative Blur Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF6321]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gray-200/50 rounded-full blur-2xl pointer-events-none" />

      {/* Back to store button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => {
            setCurrentView('store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 text-gray-700 hover:text-black text-xs font-bold flex items-center gap-2 shadow-xs transition-all hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF6321]" />
          <span>Retour à la boutique</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-gray-200/80">
          
          {/* Brand Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#121212] text-white shadow-xl shadow-black/10 mb-4 ring-4 ring-[#FF6321]/20">
              <Lock className="w-7 h-7 text-[#FF6321]" />
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-2xl font-black tracking-tight text-[#121212] font-display uppercase">
                VAYZA
              </span>
              <span className="w-2 h-2 rounded-full bg-[#FF6321] inline-block"></span>
            </div>

            <h1 className="text-lg font-black text-[#121212] tracking-tight uppercase">
              Espace Direction & ERP
            </h1>
            <p className="text-xs text-gray-500 mt-1.5 max-w-xs mx-auto">
              Accès strictement restreint. Seul l'administrateur propriétaire autorisé peut gérer le catalogue et les commandes.
            </p>
          </div>

          {/* Authorization Notice */}
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#FF6321] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Administrateur unique :</span>
              <div className="font-mono text-[11px] font-bold text-[#FF6321] mt-0.5">
                senjaaba221@gmail.com
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Accès non autorisé</div>
                <div className="mt-0.5 text-[11px] leading-relaxed">{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Google Sign In Option */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-[#121212] text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2.5"
            >
              {isGoogleLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continuer avec Google ({SUPER_ADMIN_EMAIL})</span>
                </>
              )}
            </button>
            
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-100" />
              <span className="px-3 text-[10px] uppercase font-bold text-gray-400">ou avec identifiants</span>
              <div className="flex-1 border-t border-gray-100" />
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Adresse Email Administrateur
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  required
                  placeholder="senjaaba221@gmail.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-[#121212] font-medium placeholder-gray-400 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321] transition-all"
                />
              </div>
            </div>

            {/* Password / Access Code Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Mot de passe ou Code PIN
                </label>
                <span className="text-[10px] text-gray-400">Optionnel pour le compte gérant</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-10 py-3 text-sm text-[#121212] font-medium placeholder-gray-400 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 bg-[#FF6321] hover:bg-[#E5591E] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-[#FF6321]/30 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Se connecter en tant qu'administrateur</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Helper */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail('senjaaba221@gmail.com');
                setErrorMessage(null);
              }}
              className="text-[11px] text-gray-500 hover:text-[#FF6321] font-semibold transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6321]" />
              <span>Utiliser l'adresse autorisée (senjaaba221@gmail.com)</span>
            </button>
          </div>

        </div>

        {/* Security watermark footer */}
        <div className="text-center mt-6 text-xs text-gray-400 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Session sécurisée VAYZA Backend • Contrôle de rôle strict</span>
        </div>

      </div>
    </div>
  );
};
