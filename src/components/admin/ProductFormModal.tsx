import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  Package, 
  Upload, 
  Camera, 
  FolderPlus,
  ArrowUp,
  ArrowDown,
  Star,
  Layers,
  RefreshCw
} from 'lucide-react';
import { Product, CategoryType, GenderType } from '../../types';
import { PhotothequePickerModal } from '../common/PhotothequePickerModal';
import { processDeviceImageFile, PHOTOTHEQUE_PRESETS } from '../../data/phototheque';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>, existingId?: string) => void;
  initialProduct?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(initialProduct?.name || '');
  const [sku, setSku] = useState(initialProduct?.sku || `VZ-${Math.floor(1000 + Math.random() * 9000)}`);
  const [brand, setBrand] = useState(initialProduct?.brand || 'VAYZA');
  const [category, setCategory] = useState<CategoryType>(initialProduct?.category || 'sneakers');
  const [subcategory, setSubcategory] = useState(initialProduct?.subcategory || 'Lifestyle');
  const [gender, setGender] = useState<GenderType>(initialProduct?.gender || 'unisex');
  const [price, setPrice] = useState<number>(initialProduct?.price || 28000);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(initialProduct?.originalPrice || undefined);
  const [discountPercent, setDiscountPercent] = useState<number | undefined>(initialProduct?.discountPercent || undefined);
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [material, setMaterial] = useState(initialProduct?.material || 'Cuir synthétique & Mesh respirant');
  const [status, setStatus] = useState<'disponible' | 'rupture' | 'brouillon'>(initialProduct?.status || 'disponible');
  const [isBestSeller, setIsBestSeller] = useState(initialProduct?.isBestSeller || false);
  const [isNew, setIsNew] = useState(initialProduct?.isNew ?? true);
  const [isPromotion, setIsPromotion] = useState(initialProduct?.isPromotion || false);
  const [isTrending, setIsTrending] = useState(initialProduct?.isTrending || false);
  const [isPremium, setIsPremium] = useState(initialProduct?.isPremium || false);

  // Images list
  const [images, setImages] = useState<string[]>(
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images
      : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=85']
  );
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(initialProduct?.primaryImageIndex || 0);

  // Photothèque picker modal state
  const [isPhotothequeOpen, setIsPhotothequeOpen] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  // Colors list
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(
    initialProduct?.colors && initialProduct.colors.length > 0
      ? initialProduct.colors
      : [
          { name: 'Noir Carbone', hex: '#111111' },
          { name: 'Blanc Pur', hex: '#FFFFFF' },
        ]
  );
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#FF6321');

  // Stock per size (36 to 45)
  const defaultStock: Record<number, number> = {
    36: 0,
    37: 0,
    38: 2,
    39: 4,
    40: 6,
    41: 8,
    42: 8,
    43: 6,
    44: 4,
    45: 2,
  };

  const [sizeStock, setSizeStock] = useState<Record<number, number>>(
    initialProduct?.sizeStock || defaultStock
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle direct file upload from device photothèque
  const handleDeviceFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingUpload(true);
    try {
      const newImagesList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await processDeviceImageFile(file, 1200, 1200, 0.85);
          newImagesList.push(dataUrl);
        }
      }
      if (newImagesList.length > 0) {
        setImages((prev) => [...prev, ...newImagesList]);
      }
    } catch (e) {
      console.error('Upload error:', e);
    } finally {
      setIsProcessingUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddPhotothequeImage = (url: string) => {
    if (!images.includes(url)) {
      setImages([...images, url]);
    }
  };

  const handleAddMultiplePhotothequeImages = (urls: string[]) => {
    const fresh = urls.filter((u) => !images.includes(u));
    setImages([...images, ...fresh]);
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    if (primaryImageIndex >= updated.length) {
      setPrimaryImageIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleSetPrimary = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleSizeStockChange = (size: number, qty: number) => {
    setSizeStock({
      ...sizeStock,
      [size]: Math.max(0, qty),
    });
  };

  // Quick fill all sizes helper
  const handleQuickFillStock = (qty: number) => {
    const updated: Record<number, number> = {};
    [36, 37, 38, 39, 40, 41, 42, 43, 44, 45].forEach((s) => {
      updated[s] = qty;
    });
    setSizeStock(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalStock: number = Number(
      Object.values(sizeStock).reduce((a: number, b: any) => a + (Number(b) || 0), 0)
    );

    const productPayload: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'> = {
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      brand: brand.trim(),
      category,
      subcategory: subcategory.trim(),
      gender,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discountPercent: discountPercent ? Number(discountPercent) : undefined,
      description: description.trim(),
      material: material.trim(),
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=85'],
      primaryImageIndex: Math.min(primaryImageIndex, images.length - 1),
      colors: colors.length > 0 ? colors : [{ name: 'Standard', hex: '#111111' }],
      sizeStock,
      totalStock,
      status: totalStock === 0 && status === 'disponible' ? 'rupture' : status,
      isBestSeller,
      isNew,
      isPromotion: (discountPercent && discountPercent > 0) || isPromotion,
      isTrending,
      isPremium,
    };

    onSave(productPayload, initialProduct?.id);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-gray-100 text-[#121212] flex flex-col max-h-[92vh]">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/70 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6321] text-white flex items-center justify-center shadow-md shadow-[#FF6321]/25 font-black">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-[#121212] font-display uppercase tracking-tight">
                    {initialProduct ? `Modifier le Modèle : ${initialProduct.name}` : 'Ajouter une Nouvelle Paire au Catalogue'}
                  </h2>
                  {initialProduct && (
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6321] font-mono text-[10px] font-bold">
                      {initialProduct.sku}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Modifiez les prix, photos de la photothèque, pointures et visibilité sans coder
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

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
            
            {/* Section 1: Photos & Photothèque */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-black text-[#FF6321] uppercase tracking-widest flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    <span>1. Galerie Photos & Photothèque</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Ajoutez vos images depuis la photothèque de votre téléphone/PC ou choisissez dans le catalogue VAYZA.
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingUpload}
                    className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-gray-200"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#FF6321]" />
                    <span>{isProcessingUpload ? 'Import...' : 'Importer depuis appareil'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPhotothequeOpen(true)}
                    className="px-3.5 py-2 bg-[#121212] hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-[#FF6321]" />
                    <span>Ouvrir Photothèque</span>
                  </button>
                </div>
              </div>

              {/* Hidden File Input for Device Phototheque */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleDeviceFileUpload(e.target.files)}
              />

              {/* Visual Drag & Drop banner if empty or additional */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 border-2 border-dashed border-gray-200 hover:border-[#FF6321] rounded-2xl bg-gray-50/60 hover:bg-orange-50/20 text-center cursor-pointer transition-all flex items-center justify-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#FF6321] shadow-2xs">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-left text-xs">
                  <span className="font-bold text-[#121212]">Ajouter des photos depuis votre photothèque</span>
                  <span className="text-gray-500 block text-[11px]">Cliquez ou glissez-déposez vos fichiers ici (JPEG, PNG, WebP)</span>
                </div>
              </div>

              {/* Photos List Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Photos actives ({images.length}) • Cliquez sur "Couverture" pour définir la photo principale</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {images.map((img, i) => {
                    const isPrimary = primaryImageIndex === i;
                    return (
                      <div
                        key={i}
                        className={`relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 transition-all group ${
                          isPrimary ? 'border-[#FF6321] ring-2 ring-[#FF6321]/30 shadow-md' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Aperçu ${i}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />

                        {/* Top action delete */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          title="Supprimer cette photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Primary Badge or Set Primary Button */}
                        {isPrimary ? (
                          <div className="absolute bottom-1.5 inset-x-1.5 bg-[#FF6321] text-white text-[9px] font-black uppercase tracking-wider py-0.5 rounded-md text-center shadow">
                            ★ Couverture
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(i)}
                            className="absolute bottom-1.5 inset-x-1.5 bg-black/80 hover:bg-black text-white text-[9px] font-bold py-0.5 rounded-md text-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Mettre en Couverture
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 2: General info */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-black text-[#FF6321] uppercase tracking-widest">
                2. Informations & Tarification
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nom du modèle *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: VAYZA Air Dakar Velocity"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Référence SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Ex: VZ-SNK-001"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] font-mono focus:outline-none focus:border-[#FF6321] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Catégorie *</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                  >
                    <option value="sneakers">SNEAKERS (Baskets / Sport)</option>
                    <option value="homme">HOMME (Mocassins / Ville)</option>
                    <option value="femme">FEMME (Sandales / Chic)</option>
                    <option value="enfant">ENFANTS (Juniors)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Sous-catégorie</label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="Ex: Running, Lifestyle, Loafers"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Genre Cible</label>
                  <select
                    value={gender}
                    onChange={(e: any) => setGender(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                  >
                    <option value="unisex">Unisexe</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="enfant">Enfant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Statut Visibilité</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                  >
                    <option value="disponible">En Vente (Disponible)</option>
                    <option value="rupture">Rupture de Stock</option>
                    <option value="brouillon">Brouillon Masqué</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Prix de vente (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="500"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] font-black text-sm focus:outline-none focus:border-[#FF6321] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Ancien Prix Barré (FCFA)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={originalPrice || ''}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : undefined;
                      setOriginalPrice(val);
                      if (val && val > price) {
                        const calculatedDiscount = Math.round(((val - price) / val) * 100);
                        setDiscountPercent(calculatedDiscount);
                      }
                    }}
                    placeholder="Ex: 35000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Remise (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={discountPercent || ''}
                    onChange={(e) => setDiscountPercent(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Ex: 20"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description Détaillée</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Confort, matériaux, semelle, style..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Composition & Matières</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Ex: Cuir pleine fleur véritable & semelle anti-dérapante"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321] focus:bg-white"
                />
              </div>
            </div>

            {/* Section 3: Pointures & Stock ERP */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-black text-[#FF6321] uppercase tracking-widest">
                    3. Matrice de Stock par Pointure (EU 36 à 45)
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Stock Total Calculé : <strong className="text-[#121212]">{Object.values(sizeStock).reduce((a: number, b: any) => a + (Number(b) || 0), 0)} paires</strong>
                  </p>
                </div>

                {/* Quick fills */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Remplir :</span>
                  <button
                    type="button"
                    onClick={() => handleQuickFillStock(5)}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-lg"
                  >
                    5 ch.
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFillStock(10)}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-lg"
                  >
                    10 ch.
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFillStock(0)}
                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded-lg"
                  >
                    0 (Rupture)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
                {[36, 37, 38, 39, 40, 41, 42, 43, 44, 45].map((sz) => (
                  <div key={sz} className="p-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-center">
                    <div className="text-[11px] font-bold text-gray-600 mb-1">EU {sz}</div>
                    <input
                      type="number"
                      min="0"
                      value={sizeStock[sz] ?? 0}
                      onChange={(e) => handleSizeStockChange(sz, Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg py-1 text-center text-xs font-black text-[#121212] focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Couleurs */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-black text-[#FF6321] uppercase tracking-widest">
                4. Coloris & Variantes
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                {colors.map((c, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-[#121212]"
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(i)}
                      className="text-gray-400 hover:text-rose-600 ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-9 h-9 p-0.5 rounded-xl border border-gray-200 bg-white cursor-pointer"
                />
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Nom de couleur (ex: Bleu Nuit)"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#FF6321]"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl"
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* Section 5: Badges & Mise en avant */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-black text-[#FF6321] uppercase tracking-widest">
                5. Badges & Mise en Avant Commerciale
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="accent-[#FF6321] w-4 h-4 rounded"
                  />
                  <span className="text-xs font-semibold text-[#121212]">✦ Nouveauté Arrivage</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="accent-[#FF6321] w-4 h-4 rounded"
                  />
                  <span className="text-xs font-semibold text-[#121212]">★ Best-Seller Vedette</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={isPromotion}
                    onChange={(e) => setIsPromotion(e.target.checked)}
                    className="accent-[#FF6321] w-4 h-4 rounded"
                  />
                  <span className="text-xs font-semibold text-[#121212]">% Offre Promo Spéciale</span>
                </label>
              </div>
            </div>

            {/* Footer Submit */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {initialProduct ? 'Mise à jour en direct' : 'Enregistrement dans le catalogue VAYZA'}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-black"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-7 py-3 bg-[#FF6321] hover:bg-[#E5591E] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-[#FF6321]/25 flex items-center gap-2 active:scale-[0.99]"
                >
                  <Check className="w-4 h-4" />
                  <span>{initialProduct ? 'Enregistrer les Modifications' : 'Publier le Modèle'}</span>
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>

      {/* Photothèque Modal */}
      <PhotothequePickerModal
        isOpen={isPhotothequeOpen}
        onClose={() => setIsPhotothequeOpen(false)}
        onSelectImage={handleAddPhotothequeImage}
        onSelectMultiple={handleAddMultiplePhotothequeImages}
        allowMultiple={true}
        title="Photothèque & Galerie VAYZA"
      />
    </>
  );
};
