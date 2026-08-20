import React, { useState } from 'react';
import { 
  Save, 
  RefreshCw, 
  Truck, 
  MessageCircle, 
  Phone, 
  Sparkles, 
  Flame, 
  Check, 
  Plus, 
  Trash2,
  Image as ImageIcon,
  Layers,
  Camera,
  FolderPlus
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SiteSettings, DeliveryZone } from '../../types';
import { formatFCFA } from '../../utils/formatters';
import { PhotothequePickerModal } from '../common/PhotothequePickerModal';

export const AdminSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings, resetToDefaults, showNotification } = useStore();

  const [settings, setSettings] = useState<SiteSettings>(siteSettings);

  // Delivery zones local state
  const [zones, setZones] = useState<DeliveryZone[]>(siteSettings.deliveryZones);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneFee, setNewZoneFee] = useState<number>(2500);
  const [newZoneTime, setNewZoneTime] = useState('24h à 48h');

  // Photothèque picker target state
  const [photothequeTarget, setPhotothequeTarget] = useState<'hero' | 'trending' | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      ...settings,
      deliveryZones: zones,
    });
    showNotification('Paramètres généraux enregistrés avec succès !', 'success');
  };

  const handleAddZone = () => {
    if (!newZoneName.trim()) return;
    const newZone: DeliveryZone = {
      id: `zone-${Date.now()}`,
      name: newZoneName.trim(),
      fee: Number(newZoneFee),
      estimatedTime: newZoneTime.trim(),
    };
    setZones([...zones, newZone]);
    setNewZoneName('');
  };

  const handleRemoveZone = (id: string) => {
    setZones(zones.filter((z) => z.id !== id));
  };

  const handleResetData = () => {
    if (window.confirm('Voulez-vous réinitialiser toutes les données démo par défaut (produits, avis, réglages) ?')) {
      resetToDefaults();
      showNotification('Données réinitialisées au catalogue démo VAYZA d\'origine.', 'info');
    }
  };

  const handleSelectPhotothequeImage = (url: string) => {
    if (photothequeTarget === 'hero') {
      setSettings({ ...settings, heroImage: url });
    } else if (photothequeTarget === 'trending') {
      setSettings({ ...settings, trendingBannerImage: url });
    }
    setPhotothequeTarget(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#121212]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#121212] font-display uppercase tracking-tight">
            Paramètres Généraux & CMS de la Boutique
          </h2>
          <p className="text-xs text-gray-500">
            Contrôlez les bannières, textes promotionnels, tarifs de livraison et contacts sans coder.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-8 py-3.5 bg-[#FF6321] hover:bg-[#E5591E] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-[#FF6321]/25 flex items-center justify-center gap-2 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer les Modifications</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Hero Banner CMS */}
        <div className="p-6 bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl space-y-4 shadow-xl shadow-gray-200/50">
          <h3 className="text-xs font-black text-[#FF6321] uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            1. Bannière d'Accueil Principale (Hero Banner)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Badge d'en-tête</label>
              <input
                type="text"
                value={settings.heroBadge}
                onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Texte du bouton CTA</label>
              <input
                type="text"
                value={settings.heroButtonText}
                onChange={(e) => setSettings({ ...settings, heroButtonText: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Titre Principal (Saut de ligne supporté)</label>
            <textarea
              rows={2}
              value={settings.heroTitle}
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-[#121212] font-display focus:outline-none focus:border-[#FF6321]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Sous-titre / Phrase d'accroche</label>
            <input
              type="text"
              value={settings.heroSubtitle}
              onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Image Hero (Chaussure vedette)</label>
            <div className="flex items-center gap-3">
              <input
                type="url"
                value={settings.heroImage}
                onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
              />
              <button
                type="button"
                onClick={() => setPhotothequeTarget('hero')}
                className="px-4 py-2.5 bg-[#121212] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-2 shrink-0 shadow-xs"
              >
                <FolderPlus className="w-3.5 h-3.5 text-[#FF6321]" />
                <span>Photothèque</span>
              </button>
            </div>

            {settings.heroImage && (
              <div className="mt-2 flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-200 max-w-xs">
                <img src={settings.heroImage} alt="Hero" className="w-12 h-12 object-cover rounded-lg" referrerPolicy="no-referrer" />
                <span className="text-[11px] text-gray-500 truncate">Aperçu Hero actif</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Promotional Bar & Trending Banner CMS */}
        <div className="p-6 bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl space-y-4 shadow-xl shadow-gray-200/50">
          <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            2. Bandeau Promo & Bannière Tendance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Texte de la bannière promo</label>
              <input
                type="text"
                value={settings.promoBannerText}
                onChange={(e) => setSettings({ ...settings, promoBannerText: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.promoBannerActive}
                  onChange={(e) => setSettings({ ...settings, promoBannerActive: e.target.checked })}
                  className="accent-[#FF6321] w-4 h-4 rounded"
                />
                <span className="text-xs font-bold text-[#121212]">Activer le bandeau promo</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Titre de la Collection Tendance</label>
              <input
                type="text"
                value={settings.trendingBannerTitle}
                onChange={(e) => setSettings({ ...settings, trendingBannerTitle: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Image Bannière Tendance</label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={settings.trendingBannerImage}
                  onChange={(e) => setSettings({ ...settings, trendingBannerImage: e.target.value })}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                />
                <button
                  type="button"
                  onClick={() => setPhotothequeTarget('trending')}
                  className="px-4 py-2.5 bg-[#121212] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-2 shrink-0 shadow-xs"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-[#FF6321]" />
                  <span>Photothèque</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Delivery Zones & Fees */}
        <div className="p-6 bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl space-y-4 shadow-xl shadow-gray-200/50">
          <h3 className="text-xs font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            3. Tarifs & Délais de Livraison par Zone (Sénégal)
          </h3>

          {/* Zones list */}
          <div className="space-y-2.5">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#121212]">{zone.name}</h4>
                  <p className="text-[11px] text-gray-500">Délai estimé : {zone.estimatedTime}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">{formatFCFA(zone.fee)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveZone(zone.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add zone mini-form */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              placeholder="Nom de zone (ex: Saint-Louis)"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321]"
            />
            <input
              type="number"
              value={newZoneFee}
              onChange={(e) => setNewZoneFee(Number(e.target.value))}
              placeholder="Frais FCFA"
              className="w-full sm:w-32 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321]"
            />
            <input
              type="text"
              value={newZoneTime}
              onChange={(e) => setNewZoneTime(e.target.value)}
              placeholder="Délai (ex: 48h)"
              className="w-full sm:w-36 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321]"
            />
            <button
              type="button"
              onClick={handleAddZone}
              className="px-4 py-2 bg-[#121212] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter</span>
            </button>
          </div>
        </div>

        {/* Section 4: Contact & Socials */}
        <div className="p-6 bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl space-y-4 shadow-xl shadow-gray-200/50">
          <h3 className="text-xs font-black text-indigo-700 uppercase tracking-widest flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-600" />
            4. Contacts & Service Client VAYZA Dakar
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp de Commande Directe</label>
              <input
                type="text"
                value={settings.contactWhatsApp}
                onChange={(e) => setSettings({ ...settings, contactWhatsApp: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Téléphone Appel Direct</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Officiel</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Reset Demo Data */}
        <div className="p-6 bg-rose-50/50 border border-rose-100 rounded-3xl space-y-3">
          <h3 className="text-xs font-black text-rose-700 uppercase tracking-widest flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-rose-600" />
            5. Restauration du Catalogue Démo
          </h3>
          <p className="text-xs text-gray-600">
            Si vous souhaitez réinitialiser l'ensemble des produits démo, avis et réglages d'usine :
          </p>
          <button
            type="button"
            onClick={handleResetData}
            className="px-5 py-2.5 bg-white hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl transition-all"
          >
            Réinitialiser au catalogue d'origine
          </button>
        </div>

      </form>

      {/* Photothèque Picker Modal for Settings */}
      <PhotothequePickerModal
        isOpen={photothequeTarget !== null}
        onClose={() => setPhotothequeTarget(null)}
        onSelectImage={handleSelectPhotothequeImage}
        title={
          photothequeTarget === 'hero'
            ? 'Choisir l\'image Hero depuis la Photothèque'
            : 'Choisir la Bannière Tendance depuis la Photothèque'
        }
      />
    </div>
  );
};
