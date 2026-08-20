import React from 'react';
import { ShieldCheck, Wallet, Truck, MessageCircle, Sparkles, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppSupportLink } from '../../utils/formatters';

export const WhyVayzaSection: React.FC = () => {
  const { siteSettings } = useStore();

  const pillars = [
    {
      icon: <Sparkles className="w-6 h-6 text-[#FF6321]" />,
      title: 'Qualité Sélectionnée',
      subtitle: 'Nous sélectionnons nos modèles avec la plus grande exigence.',
      details: 'Chaque paire subit un contrôle qualité rigoureux (finition des coutures, adhérence de la semelle, confort du chaussant).',
    },
    {
      icon: <Wallet className="w-6 h-6 text-emerald-600" />,
      title: 'Paiement Sécurisé & Local',
      subtitle: 'Des moyens de paiement 100% adaptés au Sénégal.',
      details: 'Payez instantanément via Wave, Orange Money, Free Money, Carte Bancaire ou directement en espèces à la livraison.',
    },
    {
      icon: <Truck className="w-6 h-6 text-amber-600" />,
      title: 'Livraison Rapide & Régions',
      subtitle: 'Livraison express à Dakar en 24h et dans tout le pays.',
      details: 'Nos livreurs vous contactent avant chaque passage. Suivi en temps réel de votre colis par SMS et WhatsApp.',
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-[#25D366]" />,
      title: 'Service Client Réactif',
      subtitle: 'Assistance dédiée 7j/7 sur WhatsApp.',
      details: 'Conseils personnalisés sur le choix de votre pointure, suivi de commande et échanges faciles en cas d\'erreur de taille.',
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-gray-50/70 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black tracking-widest text-[#FF6321] uppercase block mb-1">
            NOTRE ENGAGEMENT
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#121212] font-display uppercase tracking-tight">
            Pourquoi Choisir VAYZA ?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
            Plus qu'une boutique de chaussures, une expérience d'achat fiable, rapide et pensée pour vous.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-300 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xs group hover:shadow-md"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 mb-4 group-hover:scale-105 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold text-[#121212] mb-1 font-display">
                  {pillar.title}
                </h3>
                <p className="text-xs font-bold text-[#FF6321] mb-2">
                  {pillar.subtitle}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed font-normal">
                  {pillar.details}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center text-[11px] font-bold text-gray-400">
                <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                <span>Garanti par VAYZA</span>
              </div>
            </div>
          ))}
        </div>

        {/* Direct WhatsApp Callout */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#121212]">Une question sur un modèle ou une pointure ?</div>
              <div className="text-xs text-gray-500 font-medium">Notre équipe à Dakar vous répond directement sur WhatsApp.</div>
            </div>
          </div>
          <a
            href={buildWhatsAppSupportLink(siteSettings.contactWhatsApp, 'Conseil pointure & commande')}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md flex items-center gap-2 shrink-0 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Discuter sur WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
