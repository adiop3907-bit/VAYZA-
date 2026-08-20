import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  QrCode, 
  Phone, 
  MapPin, 
  Sparkles,
  RotateCcw,
  Package,
  Lock,
  Smartphone,
  Banknote,
  Receipt,
  Download,
  Copy,
  Check,
  Clock,
  AlertCircle,
  ExternalLink,
  Zap,
  RefreshCw,
  ChevronRight,
  Shield,
  CheckCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod, OrderCustomer, Order } from '../../types';
import { formatFCFA, buildWhatsAppOrderStatusLink } from '../../utils/formatters';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    addToCart,
    products,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    cartTotal,
    selectedDeliveryZoneId,
    setSelectedDeliveryZoneId,
    siteSettings,
    createOrder,
    setCurrentView,
    lastCreatedOrder,
    customer,
    isCustomerAuthenticated,
    openAuthModal,
    showNotification
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State initialized with customer profile if available
  const [firstName, setFirstName] = useState(customer.firstName !== 'Invité' ? customer.firstName : '');
  const [lastName, setLastName] = useState(customer.lastName !== 'VAYZA' ? customer.lastName : '');
  const [phone, setPhone] = useState(customer.phone !== '+221 77 000 00 00' ? customer.phone : '');
  const [whatsapp, setWhatsapp] = useState(customer.whatsapp !== '+221 77 000 00 00' ? customer.whatsapp : '');
  const [address, setAddress] = useState(customer.address !== 'Dakar Plateau, Sénégal' ? customer.address : '');
  const [city, setCity] = useState(customer.city || 'Dakar');
  const [region, setRegion] = useState('Dakar');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wave');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(lastCreatedOrder);

  // Direct payment specific states
  const [directPaymentTab, setDirectPaymentTab] = useState<'qr' | 'push' | 'app'>('push');
  
  // Wave state
  const [wavePhone, setWavePhone] = useState(phone || '');
  
  // Orange Money state
  const [omPhone, setOmPhone] = useState(phone || '');
  const [omOtp, setOmOtp] = useState('');
  const [omMethod, setOmMethod] = useState<'push' | 'ussd' | 'qr'>('push');

  // Yas state
  const [yasPhone, setYasPhone] = useState(phone || '');
  const [yasPin, setYasPin] = useState('');
  const [yasMethod, setYasMethod] = useState<'push' | 'qr'>('push');

  // Free Money state
  const [freePhone, setFreePhone] = useState(phone || '');
  
  // Cash change state
  const [cashChangeNeeded, setCashChangeNeeded] = useState<'exact' | '10000' | '20000' | '50000'>('exact');
  
  // Card payment details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Interactive Live Direct Payment Modal
  const [isDirectPaying, setIsDirectPaying] = useState(false);
  const [directPayProgress, setDirectPayProgress] = useState<1 | 2 | 3>(1); // 1: connecting, 2: prompt on phone/scan, 3: success
  const [directPayCountdown, setDirectPayCountdown] = useState(600); // 10 minutes in seconds
  const [directTxnRef, setDirectTxnRef] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedTxnId, setCopiedTxnId] = useState(false);

  // Auto-sync form if customer logs in during checkout
  useEffect(() => {
    if (isCustomerAuthenticated) {
      if (customer.firstName && customer.firstName !== 'Invité') setFirstName(customer.firstName);
      if (customer.lastName && customer.lastName !== 'VAYZA') setLastName(customer.lastName);
      if (customer.phone && customer.phone !== '+221 77 000 00 00') {
        setPhone(customer.phone);
        if (!wavePhone) setWavePhone(customer.phone);
        if (!omPhone) setOmPhone(customer.phone);
        if (!yasPhone) setYasPhone(customer.phone);
      }
      if (customer.whatsapp && customer.whatsapp !== '+221 77 000 00 00') setWhatsapp(customer.whatsapp);
      if (customer.address) setAddress(customer.address);
      if (customer.city) setCity(customer.city);
    }
  }, [isCustomerAuthenticated, customer]);

  // Countdown timer for direct payment QR/Push
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDirectPaying && directPayProgress === 2) {
      timer = setInterval(() => {
        setDirectPayCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isDirectPaying, directPayProgress]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddSampleItem = () => {
    const sampleProduct = products.find(p => p.status === 'disponible') || products[0];
    if (sampleProduct) {
      const defaultSize = Number(Object.keys(sampleProduct.sizeStock)[0]) || 42;
      const defaultColor = sampleProduct.colors[0]?.name || 'Noir';
      addToCart(sampleProduct, defaultSize, defaultColor, 1);
      showNotification('Une paire a été ajoutée au panier pour continuer le paiement !', 'success');
    }
  };

  // If cart is empty and not on step 4, show empty state with 1-click add
  if (cart.length === 0 && step !== 4 && !confirmedOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#FF6321] mb-5 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-[#121212] font-display uppercase tracking-tight mb-2">Votre panier est vide</h2>
        <p className="text-xs text-gray-500 mb-8 max-w-sm leading-relaxed">
          Pour finaliser une commande et procéder au paiement direct (Wave, Orange Money, Yas, CB ou Espèces), ajoutez au moins une paire de chaussures à votre panier.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setCurrentView('catalog')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#121212] hover:bg-black text-white text-xs font-extrabold uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-95"
          >
            Explorer la boutique
          </button>
          <button
            onClick={handleAddSampleItem}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#FF6321] hover:bg-[#E5591E] text-white text-xs font-extrabold uppercase tracking-wider rounded-2xl shadow-lg shadow-[#FF6321]/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ajouter une paire démo & Tester le Paiement</span>
          </button>
        </div>
      </div>
    );
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone || !address) {
      showNotification('Veuillez remplir tous les champs obligatoires (*)', 'error');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Submit = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch Direct Online Payment Terminal for Wave, Orange Money, Yas
  const handleLaunchDirectPayment = () => {
    const isDirectMethod = ['wave', 'orange_money', 'yas'].includes(paymentMethod);
    
    if (paymentMethod === 'wave' && !wavePhone && !phone) {
      showNotification('Veuillez renseigner votre numéro de téléphone Wave', 'warning');
      return;
    }
    if (paymentMethod === 'orange_money' && !omPhone && !phone) {
      showNotification('Veuillez renseigner votre numéro Orange Money', 'warning');
      return;
    }
    if (paymentMethod === 'yas' && !yasPhone && !phone) {
      showNotification('Veuillez renseigner votre numéro ou compte Yas', 'warning');
      return;
    }

    if (isDirectMethod) {
      const prefix = paymentMethod === 'wave' ? 'TXN-WAVE' : paymentMethod === 'orange_money' ? 'TXN-OM' : 'TXN-YAS';
      const txn = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
      setDirectTxnRef(txn);
      setIsDirectPaying(true);
      setDirectPayProgress(1);
      setDirectPayCountdown(600);

      // For Wave: trigger instant direct redirection to Wave account
      if (paymentMethod === 'wave') {
        try {
          const waveUrl = `https://pay.wave.com/`;
          window.open(waveUrl, '_blank', 'noopener,noreferrer');
          showNotification('Redirection vers votre compte Wave en cours...', 'info');
        } catch {
          // Fallback if popup blocked
        }
      }

      // Step 1 -> Step 2 transition (Connection -> Waiting user action)
      setTimeout(() => {
        setDirectPayProgress(2);
      }, 1000);
    } else {
      handleFinalOrderSubmit();
    }
  };

  // User confirms on the direct payment simulator / prompt
  const handleConfirmDirectPaymentOnSite = () => {
    setDirectPayProgress(3);

    const orderCustomer: OrderCustomer = {
      firstName,
      lastName,
      phone: phone || wavePhone || omPhone || yasPhone,
      whatsapp: whatsapp || phone || wavePhone || omPhone || yasPhone,
      address,
      city,
      region,
      email: customer.email || (customer.id ? `${customer.id}@vayza.sn` : undefined)
    };

    let paymentNotes = notes;
    if (paymentMethod === 'wave') paymentNotes = `${paymentNotes ? paymentNotes + ' | ' : ''}Paiement direct Wave (${wavePhone || phone})`;
    if (paymentMethod === 'orange_money') paymentNotes = `${paymentNotes ? paymentNotes + ' | ' : ''}Paiement direct Orange Money (${omPhone || phone})`;
    if (paymentMethod === 'yas') paymentNotes = `${paymentNotes ? paymentNotes + ' | ' : ''}Paiement direct Yas (${yasPhone || phone})`;

    setTimeout(() => {
      const newOrder = createOrder(orderCustomer, paymentMethod, paymentNotes, directTxnRef);
      setConfirmedOrder(newOrder);
      setIsDirectPaying(false);
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showNotification(`Paiement direct ${paymentMethod.toUpperCase().replace('_', ' ')} validé avec succès !`, 'success');
    }, 1200);
  };

  const handleFinalOrderSubmit = () => {
    setIsProcessing(true);

    const orderCustomer: OrderCustomer = {
      firstName,
      lastName,
      phone,
      whatsapp: whatsapp || phone,
      address,
      city,
      region,
      email: customer.email || (customer.id ? `${customer.id}@vayza.sn` : undefined)
    };

    let paymentNotes = notes;
    if (paymentMethod === 'cod' && cashChangeNeeded !== 'exact') {
      paymentNotes = `${paymentNotes ? paymentNotes + ' | ' : ''}Prévoir monnaie sur ${cashChangeNeeded} FCFA`;
    }

    setTimeout(() => {
      const newOrder = createOrder(orderCustomer, paymentMethod, paymentNotes);
      setConfirmedOrder(newOrder);
      setIsProcessing(false);
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showNotification('Commande et paiement enregistrés avec succès !', 'success');
    }, 1000);
  };

  const selectedZone = siteSettings.deliveryZones.find((z) => z.id === selectedDeliveryZoneId);

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
    showNotification('Numéro de commande copié !', 'info');
  };

  const handleCopyTxnId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTxnId(true);
    setTimeout(() => setCopiedTxnId(false), 2000);
    showNotification('Référence de transaction copiée !', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 lg:py-14 text-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Stepper (Steps 1 to 4) */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
            
            {[
              { num: 1, label: 'Coordonnées' },
              { num: 2, label: 'Livraison' },
              { num: 3, label: 'Paiement Direct' },
              { num: 4, label: 'Confirmation' },
            ].map((s) => {
              const isPassed = step > s.num;
              const isCurrent = step === s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    disabled={s.num > step && !confirmedOrder}
                    onClick={() => {
                      if (s.num < step) setStep(s.num as any);
                    }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isPassed
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 cursor-pointer'
                        : isCurrent
                        ? 'bg-[#FF6321] text-white shadow-lg shadow-[#FF6321]/30 ring-4 ring-[#FF6321]/20'
                        : 'bg-white border border-gray-300 text-gray-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                  </button>
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold mt-1.5 uppercase tracking-wider ${
                      isCurrent ? 'text-[#121212]' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: Informations Client */}
        {step === 1 && (
          <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/50 animate-fadeIn">
            <div className="mb-6">
              <span className="text-xs font-black tracking-widest text-[#FF6321] uppercase block mb-1">
                ÉTAPE 1 SUR 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#121212] font-display uppercase tracking-tight">
                Vos Coordonnées de Livraison
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Indiquez les détails pour que le coursier VAYZA puisse vous joindre facilement à Dakar ou en région.
              </p>
            </div>

            {!isCustomerAuthenticated ? (
              <div className="mb-6 p-4 bg-orange-50/70 border border-orange-200/70 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FF6321] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#121212]">Déjà client ou membre VAYZA ?</p>
                    <p className="text-[11px] text-gray-600">Connectez-vous pour charger automatiquement vos adresses et profiter de vos points fidélité.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 bg-[#121212] hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0"
                >
                  Se connecter
                </button>
              </div>
            ) : (
              <div className="mb-6 p-3.5 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Connecté en tant que <strong>{customer.firstName} {customer.lastName}</strong> ({customer.email})</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  Champs pré-remplis
                </span>
              </div>
            )}

            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: Moussa"
                    className="w-full bg-white/90 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Ndiaye"
                    className="w-full bg-white/90 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Numéro de Téléphone (Appels) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (!wavePhone) setWavePhone(e.target.value);
                      if (!omPhone) setOmPhone(e.target.value);
                      if (!yasPhone) setYasPhone(e.target.value);
                    }}
                    placeholder="+221 77 000 00 00"
                    className="w-full bg-white/90 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Numéro WhatsApp (Suivi en direct)
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+221 77 000 00 00 (si identique, laisser vide)"
                    className="w-full bg-white/90 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Région / Département *
                  </label>
                  <select
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setCity(e.target.value);
                    }}
                    className="w-full bg-white/90 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#121212] focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]"
                  >
                    <option value="Dakar">Dakar (Capitale)</option>
                    <option value="Thiès">Thiès</option>
                    <option value="Mbour">Mbour / Saly</option>
                    <option value="Saint-Louis">Saint-Louis</option>
                    <option value="Kaolack">Kaolack</option>
                    <option value="Touba">Touba / Mbacké</option>
                    <option value="Ziguinchor">Ziguinchor (Casamance)</option>
                    <option value="Autre région">Autre région du Sénégal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Quartier / Précision de zone *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Almadies, Sacré-Cœur, Mermoz, Maristes..."
                    className="w-full bg-white/90 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Adresse complète / Point de repère *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Villa 45, Rue MZ-14 en face de la pharmacie, 2ème étage porte droite..."
                  className="w-full bg-white/90 border border-gray-200 rounded-xl p-3.5 text-xs sm:text-sm text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Instructions spécifiques pour le livreur (Optionnel)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Appeler 15 minutes avant le passage..."
                  className="w-full bg-white/90 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]"
                />
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-[#FF6321] hover:bg-[#E5591E] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-[#FF6321]/25 flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Continuer vers la Livraison</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Livraison */}
        {step === 2 && (
          <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/50 animate-fadeIn space-y-6">
            <div>
              <span className="text-xs font-black tracking-widest text-[#FF6321] uppercase block mb-1">
                ÉTAPE 2 SUR 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#121212] font-display uppercase tracking-tight">
                Mode & Zone de Livraison
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Sélectionnez votre zone géographique au Sénégal pour calculer les frais et le délai d'acheminement.
              </p>
            </div>

            <div className="space-y-3">
              {siteSettings.deliveryZones.map((zone) => {
                const isSelected = selectedDeliveryZoneId === zone.id;

                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedDeliveryZoneId(zone.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-orange-50/60 border-[#FF6321] ring-2 ring-[#FF6321]/20 shadow-md'
                        : 'bg-white/90 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-[#FF6321] text-white shadow-md shadow-[#FF6321]/20' : 'bg-gray-100 text-gray-500'}`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#121212]">{zone.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Délai estimé : <span className="text-gray-800 font-semibold">{zone.estimatedTime}</span></p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-[#121212]">{formatFCFA(zone.fee)}</div>
                      <div className="text-[10px] text-gray-500 font-medium">Frais d'expédition</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-200 flex items-center gap-3 text-xs text-gray-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Chaque colis est soigneusement emballé dans la boîte officielle VAYZA avec papier de soie et contrôle de qualité avant expédition.</span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 text-xs font-bold text-gray-500 hover:text-[#121212]"
              >
                ← Modifier mes coordonnées
              </button>

              <button
                type="button"
                onClick={handleStep2Submit}
                className="px-8 py-4 bg-[#FF6321] hover:bg-[#E5591E] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-[#FF6321]/25 flex items-center gap-2 active:scale-98"
              >
                <span>Passer au Paiement Direct</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAIEMENT DIRECT SUR LE SITE */}
        {step === 3 && (
          <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/50 animate-fadeIn space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-black tracking-widest text-[#FF6321] uppercase block mb-1">
                  ÉTAPE 3 SUR 4 • PAIEMENT DIRECT
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#121212] font-display uppercase tracking-tight">
                  Paiement Direct sur le Site
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Réglez instantanément en ligne via <strong>Wave</strong>, <strong>Orange Money</strong>, <strong>Yas</strong>, Carte Bancaire ou à la livraison.
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-xs font-bold w-fit">
                <Lock className="w-3.5 h-3.5" />
                <span>Passerelle Sécurisée SSL</span>
              </div>
            </div>

            {/* Payment Methods Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              {/* 1. WAVE SÉNÉGAL (DIRECT) */}
              <div
                onClick={() => setPaymentMethod('wave')}
                className={`p-4.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  paymentMethod === 'wave'
                    ? 'bg-sky-50/90 border-[#1CA0F2] ring-4 ring-[#1CA0F2]/20 shadow-lg shadow-sky-500/10'
                    : 'bg-white/90 border-gray-200 hover:border-sky-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#1CA0F2] text-white font-black text-xl flex items-center justify-center shadow-md shadow-[#1CA0F2]/30">
                    🌊
                  </div>
                  <span className="px-2.5 py-1 bg-sky-100 text-[#1CA0F2] text-[10px] font-black rounded-lg uppercase tracking-wider">
                    Direct 0% Frais
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#121212]">Wave Sénégal</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Paiement direct Wave : Débit instantané sur votre appli ou scan QR code.</p>
                </div>
              </div>

              {/* 2. ORANGE MONEY (DIRECT) */}
              <div
                onClick={() => setPaymentMethod('orange_money')}
                className={`p-4.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  paymentMethod === 'orange_money'
                    ? 'bg-orange-50/90 border-[#FF6600] ring-4 ring-[#FF6600]/20 shadow-lg shadow-orange-500/10'
                    : 'bg-white/90 border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FF6600] text-white font-black text-xl flex items-center justify-center shadow-md shadow-[#FF6600]/30">
                    🍊
                  </div>
                  <span className="px-2.5 py-1 bg-orange-100 text-[#FF6600] text-[10px] font-black rounded-lg uppercase tracking-wider">
                    Direct OM
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#121212]">Orange Money</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Validation immédiate par notification push mobile ou code marchand #144#.</p>
                </div>
              </div>

              {/* 3. YAS (DIRECT) */}
              <div
                onClick={() => setPaymentMethod('yas')}
                className={`p-4.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  paymentMethod === 'yas'
                    ? 'bg-purple-50/90 border-[#7928CA] ring-4 ring-[#7928CA]/20 shadow-lg shadow-purple-500/10'
                    : 'bg-white/90 border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#7928CA] to-[#FF0080] text-white font-black text-sm flex items-center justify-center shadow-md shadow-purple-500/30">
                    YAS
                  </div>
                  <span className="px-2.5 py-1 bg-purple-100 text-[#7928CA] text-[10px] font-black rounded-lg uppercase tracking-wider">
                    Direct Yas
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#121212]">Yas Sénégal</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Portefeuille numérique Yas : Paiement direct par compte Yas & QR express.</p>
                </div>
              </div>

              {/* 4. CARTE BANCAIRE */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  paymentMethod === 'card'
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/30 shadow-md'
                    : 'bg-white/90 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-extrabold rounded-md uppercase">
                    Visa • MC
                  </span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#121212]">Carte Bancaire</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Visa, Mastercard et cartes bancaires UEMOA sécurisées.</p>
                </div>
              </div>

              {/* 5. ESPÈCES À LA LIVRAISON */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between sm:col-span-2 ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                    : 'bg-white/90 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white font-bold flex items-center justify-center text-xl shadow-md shadow-amber-500/20">
                    💵
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-black rounded-lg uppercase">
                    À la Réception
                  </span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#121212]">Paiement en Espèces à la Livraison</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Réglez directement le coursier après essayage et contrôle de votre colis.</p>
                </div>
              </div>

            </div>

            {/* DEDICATED DIRECT PAYMENT TERMINAL PANELS */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-md space-y-6">
              
              {/* ======================= WAVE DIRECT TERMINAL ======================= */}
              {paymentMethod === 'wave' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Mode switcher tabs (App Direct, Push Mobile, Scan QR) */}
                  <div className="flex items-center gap-2 p-1.5 bg-sky-50 rounded-2xl border border-sky-100 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setDirectPaymentTab('push')}
                      className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                        directPaymentTab === 'push'
                          ? 'bg-[#1CA0F2] text-white shadow-md shadow-[#1CA0F2]/30'
                          : 'text-sky-800 hover:bg-sky-100/60'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Débit Direct Mobile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirectPaymentTab('qr')}
                      className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                        directPaymentTab === 'qr'
                          ? 'bg-[#1CA0F2] text-white shadow-md shadow-[#1CA0F2]/30'
                          : 'text-sky-800 hover:bg-sky-100/60'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Scanner QR Wave</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirectPaymentTab('app')}
                      className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                        directPaymentTab === 'app'
                          ? 'bg-[#1CA0F2] text-white shadow-md shadow-[#1CA0F2]/30'
                          : 'text-sky-800 hover:bg-sky-100/60'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ouvrir l'App Wave</span>
                    </button>
                  </div>

                  {/* TAB 1: Push direct mobile */}
                  {directPaymentTab === 'push' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-4 bg-sky-50/80 rounded-2xl border border-sky-200/80 flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#1CA0F2] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                          🌊
                        </div>
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-[#121212]">Paiement Direct Wave sans quitter le site :</p>
                          <p className="text-gray-600 leading-relaxed">
                            Entrez votre numéro Wave Sénégal. Lorsque vous cliquerez sur <strong>« Valider & Payer en Direct »</strong>, une notification push Wave sécurisée sera envoyée sur votre téléphone pour confirmer le débit de <strong className="text-[#FF6321]">{formatFCFA(cartTotal)}</strong>.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Numéro de Téléphone Wave Sénégal *
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={wavePhone}
                            onChange={(e) => setWavePhone(e.target.value)}
                            placeholder="+221 77 / 78 / 76 / 70 XXX XX XX"
                            className="w-full bg-gray-50 border-2 border-sky-200 focus:border-[#1CA0F2] rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm font-semibold text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#1CA0F2]/20"
                          />
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🇸🇳</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5 text-sky-600" /> Aucun frais de transaction prélevé (Frais 0 FCFA).
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: QR Code Scan Wave */}
                  {directPaymentTab === 'qr' && (
                    <div className="space-y-4 animate-fadeIn text-center sm:text-left">
                      <div className="p-5 bg-sky-50/80 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-center gap-6">
                        <div className="p-3 bg-white rounded-2xl border-2 border-[#1CA0F2] shadow-md flex flex-col items-center shrink-0">
                          <div className="relative">
                            <QrCode className="w-32 h-32 text-sky-900" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-[#1CA0F2] text-white flex items-center justify-center text-xs font-bold shadow-md border-2 border-white">
                                🌊
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-[#1CA0F2] tracking-wider uppercase mt-1">
                            VAYZA DAKAR WAVE
                          </span>
                        </div>

                        <div className="text-xs space-y-2 flex-1">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1CA0F2] text-white text-[11px] font-black rounded-lg uppercase">
                            <Zap className="w-3 h-3" /> Scanner avec Wave
                          </div>
                          <h4 className="font-black text-[#121212] text-sm">Montant exact : {formatFCFA(cartTotal)}</h4>
                          <p className="text-gray-600 leading-relaxed text-[11px]">
                            1. Ouvrez l'application <strong>Wave</strong> sur votre smartphone.<br />
                            2. Appuyez sur le bouton <strong>Scan QR</strong>.<br />
                            3. Pointez votre appareil photo sur ce code. Le paiement sera détecté instantanément sur le site.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Direct App Link */}
                  {directPaymentTab === 'app' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-xs space-y-2">
                        <p className="font-bold text-[#121212]">Lien direct Wave App (Mobile & Tablette) :</p>
                        <p className="text-gray-600 text-[11px]">
                          Si vous effectuez cet achat depuis votre smartphone, vous pouvez lancer directement l'application Wave avec le montant pré-rempli.
                        </p>
                        <a
                          href={`wave://send?phone=221770000000&amount=${cartTotal}`}
                          onClick={(e) => {
                            // In web iframe preview, wave:// protocol might not launch native app, we provide visual fallback
                            showNotification('Ouverture de la passerelle Wave en cours...', 'info');
                          }}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1CA0F2] hover:bg-[#188ecc] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#1CA0F2]/25"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Lancer l'application Wave ({formatFCFA(cartTotal)})</span>
                        </a>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ======================= ORANGE MONEY DIRECT TERMINAL ======================= */}
              {paymentMethod === 'orange_money' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* OM Sub Tabs */}
                  <div className="flex items-center gap-2 p-1.5 bg-orange-50 rounded-2xl border border-orange-100 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setOmMethod('push')}
                      className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                        omMethod === 'push'
                          ? 'bg-[#FF6600] text-white shadow-md shadow-[#FF6600]/30'
                          : 'text-orange-900 hover:bg-orange-100/60'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Validation Directe Mobile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOmMethod('ussd')}
                      className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                        omMethod === 'ussd'
                          ? 'bg-[#FF6600] text-white shadow-md shadow-[#FF6600]/30'
                          : 'text-orange-900 hover:bg-orange-100/60'
                      }`}
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Code Marchand #144#</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOmMethod('qr')}
                      className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                        omMethod === 'qr'
                          ? 'bg-[#FF6600] text-white shadow-md shadow-[#FF6600]/30'
                          : 'text-orange-900 hover:bg-orange-100/60'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QR Max It Orange</span>
                    </button>
                  </div>

                  {/* OM Push Tab */}
                  {omMethod === 'push' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-4 bg-orange-50/80 rounded-2xl border border-orange-200 flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#FF6600] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                          🍊
                        </div>
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-[#121212]">Autorisation Orange Money en temps réel :</p>
                          <p className="text-gray-600 leading-relaxed">
                            Indiquez votre numéro Orange Sénégal (+221 77 / 78). Vous recevrez instantanément une demande d'autorisation de prélèvement de <strong>{formatFCFA(cartTotal)}</strong> sur votre téléphone.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Numéro Orange Money Sénégal *
                          </label>
                          <input
                            type="tel"
                            value={omPhone}
                            onChange={(e) => setOmPhone(e.target.value)}
                            placeholder="+221 77 / 78 XXX XX XX"
                            className="w-full bg-gray-50 border-2 border-orange-200 focus:border-[#FF6600] rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF6600]/20"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Code d'autorisation / OTP (Optionnel)
                          </label>
                          <input
                            type="text"
                            value={omOtp}
                            onChange={(e) => setOmOtp(e.target.value)}
                            placeholder="Code secret SMS à 6 chiffres"
                            className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#FF6600] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#121212] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OM USSD Tab */}
                  {omMethod === 'ussd' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#121212]">Génération de code USSD Marchand :</span>
                          <span className="px-2 py-0.5 bg-orange-200 text-orange-900 font-mono font-bold rounded">#144#391#</span>
                        </div>
                        <p className="text-gray-600 text-[11px]">
                          1. Composez <strong>#144#391#</strong> sur votre mobile Orange.<br />
                          2. Entrez votre code secret Orange Money pour générer un code de paiement éphémère.<br />
                          3. Renseignez ce code ci-dessous pour valider immédiatement la commande.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Code Marchand Éphémère OM *
                        </label>
                        <input
                          type="text"
                          value={omOtp}
                          onChange={(e) => setOmOtp(e.target.value)}
                          placeholder="Ex: 928104"
                          className="w-full bg-gray-50 border-2 border-orange-200 focus:border-[#FF6600] rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-[#121212] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* OM QR Tab */}
                  {omMethod === 'qr' && (
                    <div className="p-5 bg-orange-50/80 rounded-2xl border border-orange-200 flex flex-col sm:flex-row items-center gap-6">
                      <div className="p-3 bg-white rounded-2xl border-2 border-[#FF6600] shadow-md flex flex-col items-center shrink-0">
                        <QrCode className="w-28 h-28 text-orange-950" />
                        <span className="text-[9px] font-black text-[#FF6600] tracking-wider uppercase mt-1">
                          ORANGE MONEY MAX IT
                        </span>
                      </div>
                      <div className="text-xs space-y-1.5">
                        <span className="px-2.5 py-0.5 bg-[#FF6600] text-white text-[10px] font-black rounded uppercase">
                          Scan Max It
                        </span>
                        <h4 className="font-bold text-[#121212]">Scannez avec l'app Orange Money Sénégal</h4>
                        <p className="text-gray-600 text-[11px]">
                          Pointez votre scanner Max It sur ce code pour régler la somme de <strong>{formatFCFA(cartTotal)}</strong>.
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ======================= YAS DIRECT TERMINAL ======================= */}
              {paymentMethod === 'yas' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Yas Sub Tabs */}
                  <div className="flex items-center gap-2 p-1.5 bg-purple-50 rounded-2xl border border-purple-100 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setYasMethod('push')}
                      className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                        yasMethod === 'push'
                          ? 'bg-[#7928CA] text-white shadow-md shadow-purple-500/30'
                          : 'text-purple-900 hover:bg-purple-100/60'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Portefeuille Yas Direct</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setYasMethod('qr')}
                      className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                        yasMethod === 'qr'
                          ? 'bg-[#7928CA] text-white shadow-md shadow-purple-500/30'
                          : 'text-purple-900 hover:bg-purple-100/60'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QR Code Yas Pay</span>
                    </button>
                  </div>

                  {yasMethod === 'push' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200 flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7928CA] to-[#FF0080] text-white flex items-center justify-center font-bold shrink-0 shadow-sm text-xs">
                          YAS
                        </div>
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-[#121212]">Paiement Direct via Portefeuille Digital Yas :</p>
                          <p className="text-gray-600 leading-relaxed">
                            Renseignez votre numéro de compte ou téléphone Yas Sénégal. Le débit de <strong>{formatFCFA(cartTotal)}</strong> s'exécute directement et de façon instantanée avec reçu électronique certifié.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Numéro / Identifiant de Compte Yas *
                          </label>
                          <input
                            type="tel"
                            value={yasPhone}
                            onChange={(e) => setYasPhone(e.target.value)}
                            placeholder="+221 7X XXX XX XX"
                            className="w-full bg-gray-50 border-2 border-purple-200 focus:border-[#7928CA] rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#121212] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Code PIN / OTP Yas (Sécurisé)
                          </label>
                          <input
                            type="password"
                            maxLength={6}
                            value={yasPin}
                            onChange={(e) => setYasPin(e.target.value)}
                            placeholder="Code secret PIN à 4 ou 6 chiffres"
                            className="w-full bg-gray-50 border-2 border-gray-200 focus:border-[#7928CA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#121212] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {yasMethod === 'qr' && (
                    <div className="p-5 bg-purple-50/80 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-center gap-6">
                      <div className="p-3 bg-white rounded-2xl border-2 border-[#7928CA] shadow-md flex flex-col items-center shrink-0">
                        <QrCode className="w-28 h-28 text-purple-950" />
                        <span className="text-[9px] font-black text-[#7928CA] tracking-wider uppercase mt-1">
                          YAS EXPRESS QR
                        </span>
                      </div>
                      <div className="text-xs space-y-1.5">
                        <span className="px-2.5 py-0.5 bg-[#7928CA] text-white text-[10px] font-black rounded uppercase">
                          Yas Pay Express
                        </span>
                        <h4 className="font-bold text-[#121212]">Scan direct depuis l'application Yas</h4>
                        <p className="text-gray-600 text-[11px]">
                          Scannez ce QR Code avec votre application mobile Yas pour valider le montant de <strong>{formatFCFA(cartTotal)}</strong>.
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ======================= CARTE BANCAIRE FORM ======================= */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-600" /> Passerelle sécurisée SSL 256-Bit & 3D Secure
                    </span>
                    <span className="text-[11px] font-bold text-blue-700">Visa • Mastercard • GIM-UEMOA</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Numéro de Carte Bancaire *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                            const matches = v.match(/\d{4,16}/g);
                            const match = (matches && matches[0]) || '';
                            const parts = [];
                            for (let i = 0, len = match.length; i < len; i += 4) {
                              parts.push(match.substring(i, i + 4));
                            }
                            if (parts.length) {
                              setCardNumber(parts.join(' '));
                            } else {
                              setCardNumber(v);
                            }
                          }}
                          placeholder="4234 •••• •••• 1234"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#121212] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                        />
                        <CreditCard className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Nom sur la Carte *
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Ex: CHEIKH NDIAYE"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#121212] uppercase focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Exp. *
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                              let v = e.target.value.replace(/[^0-9]/g, '');
                              if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
                              setCardExpiry(v);
                            }}
                            placeholder="MM/AA"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-xs text-center text-[#121212] focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            CVV *
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="123"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-xs text-center text-[#121212] focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================= CASH ON DELIVERY OPTIONS ======================= */}
              {paymentMethod === 'cod' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 flex items-start gap-3">
                    <Banknote className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-[#121212]">Conseil pour la livraison en espèces :</p>
                      <p className="text-gray-600 text-[11px]">
                        Vous paierez directement au coursier lors de la remise en main propre. Indiquez si vous aurez besoin de monnaie pour fluidifier le passage.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Prévision de monnaie pour le coursier :
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'exact', label: 'Appoint exact' },
                        { id: '10000', label: 'Billet 10.000 FCFA' },
                        { id: '20000', label: 'Billet 20.000 FCFA' },
                        { id: '50000', label: 'Billet 50.000 FCFA' },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setCashChangeNeeded(opt.id as any)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                            cashChangeNeeded === opt.id
                              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Recap Box */}
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Total articles ({cart.length} paire{cart.length > 1 ? 's' : ''}) :</span>
                <span className="text-[#121212] font-semibold">{formatFCFA(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Réduction promo appliquée :</span>
                  <span>-{formatFCFA(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Frais d'expédition ({selectedZone?.name}) :</span>
                <span className="text-[#121212] font-semibold">{formatFCFA(deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-center text-base font-black text-[#121212] pt-3 border-t border-gray-200">
                <span>MONTANT TOTAL À RÉGLER :</span>
                <span className="text-[#FF6321] text-xl font-display tracking-tight">{formatFCFA(cartTotal)}</span>
              </div>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isProcessing}
                className="px-6 py-3 text-xs font-bold text-gray-500 hover:text-[#121212]"
              >
                ← Retour livraison
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleLaunchDirectPayment}
                className={`px-8 py-4 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl flex items-center gap-2 active:scale-98 disabled:opacity-50 ${
                  paymentMethod === 'wave'
                    ? 'bg-[#1CA0F2] hover:bg-[#188ecc] shadow-[#1CA0F2]/30'
                    : paymentMethod === 'orange_money'
                    ? 'bg-[#FF6600] hover:bg-[#e65c00] shadow-[#FF6600]/30'
                    : paymentMethod === 'yas'
                    ? 'bg-gradient-to-r from-[#7928CA] to-[#FF0080] hover:opacity-90 shadow-purple-500/30'
                    : 'bg-[#FF6321] hover:bg-[#E5591E] shadow-[#FF6321]/25'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>
                      {['wave', 'orange_money', 'yas'].includes(paymentMethod)
                        ? `Payer Directement via ${paymentMethod === 'wave' ? 'Wave' : paymentMethod === 'orange_money' ? 'Orange Money' : 'Yas'} (${formatFCFA(cartTotal)})`
                        : `Valider la Commande (${formatFCFA(cartTotal)})`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: Confirmation & Instant Official Receipt */}
        {step === 4 && confirmedOrder && (
          <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/50 animate-fadeIn space-y-8 text-center sm:text-left">
            
            {/* Header Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-widest block">
                    PAIEMENT DIRECT & COMMANDE VALIDÉS
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#121212] font-display uppercase tracking-tight">
                      {confirmedOrder.id}
                    </h2>
                    <button
                      onClick={() => handleCopyOrderId(confirmedOrder.id)}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      title="Copier le numéro"
                    >
                      {copiedOrderId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <div className="text-xs text-gray-500 font-medium">Montant total certifié</div>
                <div className="text-2xl font-black text-[#FF6321] font-display">
                  {formatFCFA(confirmedOrder.total)}
                </div>
                <span className="inline-block mt-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md uppercase">
                  {confirmedOrder.paymentStatus === 'paye' ? 'Règlement Encaissé ✅' : 'À la livraison 💵'}
                </span>
              </div>
            </div>

            {/* Transaction Reference & Method Highlight */}
            {confirmedOrder.transactionRef && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#121212] text-white flex items-center justify-center text-xs font-black">
                    REF
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">
                      RÉFÉRENCE DE TRANSACTION BANCAIRE DIRECTE
                    </span>
                    <span className="text-xs font-mono font-bold text-[#121212]">
                      {confirmedOrder.transactionRef}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyTxnId(confirmedOrder.transactionRef!)}
                  className="px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors"
                >
                  {copiedTxnId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTxnId ? 'Copié' : 'Copier'}</span>
                </button>
              </div>
            )}

            {/* Next Steps Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/60 space-y-1">
                <div className="font-bold text-[#FF6321] flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> 1. Préparation
                </div>
                <p className="text-gray-600 text-[11px]">
                  Votre colis est transmis immédiatement à l'équipe logistique de Dakar.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 space-y-1">
                <div className="font-bold text-blue-700 flex items-center gap-1.5">
                  <Truck className="w-4 h-4" /> 2. Acheminement
                </div>
                <p className="text-gray-600 text-[11px]">
                  Livraison prévue à {confirmedOrder.customer.city} ({confirmedOrder.deliveryZone}).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-1">
                <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> 3. Garantie VAYZA
                </div>
                <p className="text-gray-600 text-[11px]">
                  Échange de pointure gratuit sous 48h en cas de besoin.
                </p>
              </div>
            </div>

            {/* Items Summary Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                Récapitulatif des Articles
              </h3>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-white">
                {confirmedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-12 h-12 object-cover rounded-xl border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-[#121212]">{it.name}</h4>
                        <span className="text-[11px] text-gray-500">
                          Pointure : EU {it.size} • Couleur : {it.color} • Qté : {it.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#121212]">{formatFCFA(it.price * it.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Notification Button & Tracking CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={buildWhatsAppOrderStatusLink(
                  siteSettings.contactWhatsApp,
                  confirmedOrder.id,
                  `${confirmedOrder.customer.firstName} ${confirmedOrder.customer.lastName}`,
                  'Payée et Validée'
                )}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Recevoir le Suivi sur WhatsApp</span>
              </a>

              <button
                onClick={() => setCurrentView('catalog')}
                className="w-full sm:w-auto px-8 py-4 bg-[#121212] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-98"
              >
                Retourner à la Boutique
              </button>
            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
          INTERACTIVE DIRECT PAYMENT TERMINAL MODAL (Wave / Orange Money / Yas)
      ========================================================================== */}
      {isDirectPaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-center">
            
            {/* Header branding based on method */}
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-3 ${
                paymentMethod === 'wave'
                  ? 'bg-[#1CA0F2] text-white shadow-sky-500/30'
                  : paymentMethod === 'orange_money'
                  ? 'bg-[#FF6600] text-white shadow-orange-500/30'
                  : 'bg-gradient-to-tr from-[#7928CA] to-[#FF0080] text-white shadow-purple-500/30'
              }`}>
                {paymentMethod === 'wave' ? '🌊' : paymentMethod === 'orange_money' ? '🍊' : '⚡'}
              </div>
              <h3 className="text-lg font-black text-[#121212] uppercase tracking-tight">
                Passerelle Directe {paymentMethod === 'wave' ? 'Wave Sénégal' : paymentMethod === 'orange_money' ? 'Orange Money' : 'Yas Pay'}
              </h3>
              <p className="text-xs text-gray-500">
                Transaction Sécurisée SSL • Référence : <span className="font-mono font-bold text-gray-800">{directTxnRef}</span>
              </p>
            </div>

            {/* Step 1: Connecting */}
            {directPayProgress === 1 && (
              <div className="py-8 space-y-4 animate-fadeIn">
                <div className="w-12 h-12 border-4 border-[#FF6321] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-gray-700">
                  Initialisation de la passerelle de paiement mobile...
                </p>
              </div>
            )}

            {/* Step 2: Waiting Confirmation on Phone / Wave Account / Scan */}
            {directPayProgress === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                  <div className="flex justify-between items-center text-gray-500 text-[11px]">
                    <span>Montant à débiter :</span>
                    <span className="font-black text-[#FF6321] text-sm">{formatFCFA(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 text-[11px]">
                    <span>Bénéficiaire officiel :</span>
                    <span className="font-bold text-[#121212]">VAYZA SÉNÉGAL</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 text-[11px]">
                    <span>Numéro débité :</span>
                    <span className="font-bold text-[#121212]">
                      {paymentMethod === 'wave' ? wavePhone || phone : paymentMethod === 'orange_money' ? omPhone || phone : yasPhone || phone}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 text-[11px] pt-1 border-t border-gray-200">
                    <span>Délai de validation :</span>
                    <span className="font-mono font-bold text-amber-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {formatTimer(directPayCountdown)}
                    </span>
                  </div>
                </div>

                {paymentMethod === 'wave' ? (
                  <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs space-y-3 text-sky-900 text-left">
                    <div className="flex items-center gap-2 font-bold text-[#1CA0F2]">
                      <span className="text-base">🌊</span>
                      <span>Redirection directe vers votre compte Wave</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Votre compte Wave s'ouvre pour autoriser le paiement de <strong>{formatFCFA(cartTotal)}</strong>. Si la fenêtre ne s'est pas ouverte automatiquement, cliquez sur le bouton ci-dessous :
                    </p>
                    <a
                      href="https://pay.wave.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-[#1CA0F2] hover:bg-[#188ecc] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#1CA0F2]/20"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ouvrir l'application / mon compte Wave</span>
                    </a>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1.5 text-emerald-800">
                    <p className="font-bold flex items-center justify-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-600 animate-bounce" />
                      Veuillez confirmer sur votre téléphone
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      Un prompt de confirmation est apparu sur votre application. Validez votre code secret pour finaliser.
                    </p>
                  </div>
                )}

                {/* Direct confirmation trigger button */}
                <button
                  type="button"
                  onClick={handleConfirmDirectPaymentOnSite}
                  className={`w-full py-4 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 ${
                    paymentMethod === 'wave'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                  }`}
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'wave' 
                      ? "J'ai confirmé mon paiement sur Wave (Valider)" 
                      : "J'ai validé sur mon téléphone (Confirmer)"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDirectPaying(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 underline font-medium"
                >
                  Annuler la transaction
                </button>
              </div>
            )}

            {/* Step 3: Success Animation */}
            {directPayProgress === 3 && (
              <div className="py-6 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-scaleUp">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-sm font-black text-[#121212] uppercase">
                  Paiement de {formatFCFA(cartTotal)} Confirmé !
                </h4>
                <p className="text-xs text-gray-500">
                  Génération de votre reçu officiel VAYZA...
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
