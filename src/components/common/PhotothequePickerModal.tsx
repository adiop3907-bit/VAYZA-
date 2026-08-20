import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Link, 
  Search, 
  Check, 
  Sparkles, 
  FolderPlus, 
  Trash2,
  Camera,
  Layers,
  ZoomIn
} from 'lucide-react';
import { PHOTOTHEQUE_PRESETS, PhotothequeItem, processDeviceImageFile } from '../../data/phototheque';

interface PhotothequePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  onSelectMultiple?: (imageUrls: string[]) => void;
  allowMultiple?: boolean;
  title?: string;
}

export const PhotothequePickerModal: React.FC<PhotothequePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  onSelectMultiple,
  allowMultiple = false,
  title = 'Photothèque & Import Photos',
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'device' | 'presets' | 'url'>('device');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [directUrl, setDirectUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([]);
  const [selectedPresetUrls, setSelectedPresetUrls] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle files chosen from phone/desktop phototheque
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const processedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await processDeviceImageFile(file, 1200, 1200, 0.85);
          processedList.push(dataUrl);
        }
      }

      if (processedList.length === 0) {
        setErrorMsg('Aucun fichier image valide détecté.');
      } else {
        setUploadedPreviews((prev) => [...processedList, ...prev]);
        if (!allowMultiple && processedList.length === 1) {
          // Immediately select if single mode
          onSelectImage(processedList[0]);
          onClose();
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Erreur lors du traitement de l\'image depuis votre photothèque.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const togglePresetSelection = (url: string) => {
    if (!allowMultiple) {
      onSelectImage(url);
      onClose();
      return;
    }

    if (selectedPresetUrls.includes(url)) {
      setSelectedPresetUrls(selectedPresetUrls.filter((u) => u !== url));
    } else {
      setSelectedPresetUrls([...selectedPresetUrls, url]);
    }
  };

  const handleApplyMulti = () => {
    const combined = [...uploadedPreviews, ...selectedPresetUrls];
    if (combined.length > 0) {
      if (onSelectMultiple) {
        onSelectMultiple(combined);
      } else {
        onSelectImage(combined[0]);
      }
      onClose();
    }
  };

  const handleDirectUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl.trim()) return;
    onSelectImage(directUrl.trim());
    onClose();
  };

  const filteredPresets = PHOTOTHEQUE_PRESETS.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] text-[#121212]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6321] text-white flex items-center justify-center shadow-md shadow-[#FF6321]/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase font-display tracking-tight text-[#121212]">
                {title}
              </h2>
              <p className="text-xs text-gray-500">
                Ajoutez des images depuis la photothèque de votre appareil ou piochez dans le catalogue VAYZA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-3 bg-gray-100/70 border-b border-gray-200/70 px-6">
          <button
            onClick={() => setActiveTab('device')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'device'
                ? 'bg-[#121212] text-white shadow-sm'
                : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
            }`}
          >
            <Upload className="w-4 h-4 text-[#FF6321]" />
            <span>Depuis mon appareil (Photothèque / Fichiers)</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'presets'
                ? 'bg-[#121212] text-white shadow-sm'
                : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#FF6321]" />
            <span>Photothèque VAYZA ({PHOTOTHEQUE_PRESETS.length} photos)</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'url'
                ? 'bg-[#121212] text-white shadow-sm'
                : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
            }`}
          >
            <Link className="w-4 h-4 text-[#FF6321]" />
            <span>Lien Web URL</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: DEVICE PHOTOTHEQUE / UPLOAD */}
          {activeTab === 'device' && (
            <div className="space-y-6">
              
              {/* Dropzone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-[#FF6321] rounded-3xl p-8 sm:p-12 text-center bg-gray-50/60 hover:bg-orange-50/30 transition-all cursor-pointer group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple={allowMultiple}
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mx-auto text-[#FF6321] group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>

                <h3 className="text-base font-bold text-[#121212] mt-4">
                  {isProcessing ? 'Optimisation de l\'image en cours...' : 'Cliquez pour ouvrir la photothèque de votre appareil'}
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 max-w-md mx-auto">
                  Prenez une photo en direct ou choisissez depuis votre galerie mobile, PC ou Mac (JPEG, PNG, WebP).
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] text-white text-xs font-bold shadow-md">
                  <FolderPlus className="w-4 h-4 text-[#FF6321]" />
                  <span>Parcourir ma photothèque</span>
                </div>
              </div>

              {/* Uploaded Previews */}
              {uploadedPreviews.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Photos importées de votre appareil ({uploadedPreviews.length})
                    </h4>
                    <button
                      onClick={() => setUploadedPreviews([])}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Effacer tout
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {uploadedPreviews.map((previewUrl, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group">
                        <img src={previewUrl} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedPreviews(uploadedPreviews.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            onSelectImage(previewUrl);
                            onClose();
                          }}
                          className="absolute inset-x-2 bottom-2 py-1 bg-[#121212]/90 hover:bg-black text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-center shadow"
                        >
                          Choisir
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: PRESETS PHOTOTHEQUE VAYZA */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par couleur, style..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                  />
                </div>

                {/* Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
                  {[
                    { id: 'all', label: 'Toutes' },
                    { id: 'sneakers_sport', label: 'Running' },
                    { id: 'sneakers_lifestyle', label: 'Streetwear' },
                    { id: 'homme_ville', label: 'Mocassins & Cuir' },
                    { id: 'femme_chic', label: 'Femme' },
                    { id: 'enfant', label: 'Enfant' },
                    { id: 'details', label: 'Détails' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-[#FF6321] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[48vh] overflow-y-auto pr-1">
                {filteredPresets.map((item) => {
                  const isSelected = selectedPresetUrls.includes(item.url);
                  return (
                    <div
                      key={item.id}
                      onClick={() => togglePresetSelection(item.url)}
                      className={`relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 cursor-pointer transition-all group ${
                        isSelected
                          ? 'border-[#FF6321] ring-2 ring-[#FF6321]/30 shadow-md'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-white">
                        <span className="text-[10px] font-bold line-clamp-1">{item.title}</span>
                        <span className="text-[9px] text-[#FF6321] font-semibold">{item.categoryLabel}</span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FF6321] text-white flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: DIRECT URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleDirectUrlSubmit} className="space-y-4 max-w-lg mx-auto py-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Lien URL de l'image (HTTPS)
                </label>
                <div className="relative flex items-center">
                  <Link className="w-4 h-4 text-gray-400 absolute left-3.5" />
                  <input
                    type="url"
                    required
                    value={directUrl}
                    onChange={(e) => setDirectUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                  />
                </div>
              </div>

              {directUrl && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-3">
                  <img
                    src={directUrl}
                    alt="Aperçu URL"
                    className="w-14 h-14 rounded-xl object-cover bg-white border border-gray-200 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="text-xs">
                    <p className="font-bold text-[#121212]">Aperçu de l'image</p>
                    <p className="text-gray-500 text-[11px] truncate max-w-xs">{directUrl}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#FF6321] hover:bg-[#E5591E] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all active:scale-[0.99]"
              >
                Utiliser cette image
              </button>
            </form>
          )}

        </div>

        {/* Footer actions for multiple selection */}
        {allowMultiple && (uploadedPreviews.length > 0 || selectedPresetUrls.length > 0) && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-xs text-gray-600">
              <strong className="text-[#121212]">
                {uploadedPreviews.length + selectedPresetUrls.length}
              </strong> photo(s) prête(s) à être ajoutée(s)
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleApplyMulti}
                className="px-6 py-2.5 bg-[#121212] hover:bg-black text-white text-xs font-bold uppercase rounded-xl flex items-center gap-2 shadow"
              >
                <Check className="w-4 h-4 text-[#FF6321]" />
                <span>Ajouter à la galerie</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
