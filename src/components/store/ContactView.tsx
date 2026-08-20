import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, MapPin, Send, Clock, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppSupportLink } from '../../utils/formatters';

export const ContactView: React.FC = () => {
  const { siteSettings, showNotification } = useStore();
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [subject, setSubject] = useState('Conseil pointure / Modèle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Votre message a été transmis à l\'équipe VAYZA. Réponse sous 2h.', 'success');
    setName('');
    setEmailOrPhone('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] py-12 lg:py-20 text-neutral-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF3B30]/15 text-[#FF3B30] border border-[#FF3B30]/30 text-xs font-bold uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>ASSISTANCE & SERVICE CLIENT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display uppercase tracking-tight">
            Contactez la Maison VAYZA
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Une question sur une commande, un conseil pour choisir votre pointure ou une demande de partenariat ? Notre équipe à Dakar est à votre écoute 7j/7.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* WhatsApp Direct */}
          <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between space-y-4 hover:border-[#25D366]/50 transition-colors shadow-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white font-display uppercase">WhatsApp Direct</h3>
              <p className="text-xs text-neutral-400">
                Le canal le plus rapide. Réponses immédiates de nos conseillers à Dakar.
              </p>
              <div className="text-sm font-black text-[#25D366]">{siteSettings.contactWhatsApp}</div>
            </div>

            <a
              href={buildWhatsAppSupportLink(siteSettings.contactWhatsApp, 'Demande de renseignement')}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Discuter en Direct</span>
            </a>
          </div>

          {/* Téléphone Direct */}
          <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors shadow-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF3B30]/20 text-[#FF3B30] flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white font-display uppercase">Appel Téléphonique</h3>
              <p className="text-xs text-neutral-400">
                Du lundi au samedi de 08h30 à 20h00.
              </p>
              <div className="text-sm font-black text-white">{siteSettings.contactPhone}</div>
            </div>

            <a
              href={`tel:${siteSettings.contactPhone.replace(/\s+/g, '')}`}
              className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Appeler VAYZA</span>
            </a>
          </div>

          {/* Email Support */}
          <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors shadow-xl">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white font-display uppercase">Email Officiel</h3>
              <p className="text-xs text-neutral-400">
                Pour vos commandes institutionnelles, factures et partenariats.
              </p>
              <div className="text-sm font-mono text-white">{siteSettings.contactEmail}</div>
            </div>

            <a
              href={`mailto:${siteSettings.contactEmail}`}
              className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Envoyer un Email</span>
            </a>
          </div>

        </div>

        {/* Contact Form & Office location */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF3B30]" />
              Formulaire de Contact
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Votre Nom *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Aminata Fall"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF3B30]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Téléphone ou Email *</label>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Ex: 77 123 45 67 ou email@..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF3B30]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Objet de votre demande</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF3B30]"
                >
                  <option value="Conseil pointure / Modèle">Conseil pointure & Modèle</option>
                  <option value="Suivi de commande en cours">Suivi de commande en cours</option>
                  <option value="Échange de taille / Retour">Échange de taille / Retour</option>
                  <option value="Commande entreprise ou grossiste">Commande entreprise ou grossiste</option>
                  <option value="Autre demande">Autre demande</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Votre Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre besoin avec précision..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF3B30]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#FF3B30] hover:bg-[#E63946] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer le Message</span>
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">
              Showroom & Logistique VAYZA
            </h2>

            <div className="space-y-4 text-xs text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display uppercase">Siège Opérationnel :</strong>
                  <span>{siteSettings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display uppercase">Horaires d'Expédition :</strong>
                  <span>Lundi — Samedi : 08h30 - 20h00<br />Dimanche : Permanence WhatsApp (10h - 18h)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 space-y-2">
              <p className="font-bold text-white">📦 Retrait en Point Relais Dakar</p>
              <p>Possibilité de récupérer directement votre commande préparée à notre hub des Almadies sur rendez-vous téléphonique.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
