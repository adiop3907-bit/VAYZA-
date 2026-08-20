import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  Eye, 
  Check, 
  AlertTriangle,
  Flame,
  Sparkles,
  SlidersHorizontal,
  Copy,
  Camera,
  FolderPlus,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatFCFA } from '../../utils/formatters';
import { ProductFormModal } from './ProductFormModal';
import { PhotothequePickerModal } from '../common/PhotothequePickerModal';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, showNotification } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPhotothequeModalOpen, setIsPhotothequeModalOpen] = useState(false);

  const handleOpenNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleDuplicateProduct = (p: Product) => {
    const duplicatedData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'> = {
      name: `${p.name} (Copie)`,
      sku: `VZ-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      gender: p.gender,
      price: p.price,
      originalPrice: p.originalPrice,
      discountPercent: p.discountPercent,
      description: p.description,
      material: p.material,
      images: [...p.images],
      primaryImageIndex: p.primaryImageIndex || 0,
      colors: [...p.colors],
      sizeStock: { ...p.sizeStock },
      totalStock: p.totalStock,
      status: p.status,
      isBestSeller: p.isBestSeller,
      isNew: true,
      isPromotion: p.isPromotion,
      isTrending: p.isTrending,
      isPremium: p.isPremium,
    };
    addProduct(duplicatedData);
    showNotification(`Modèle dupliqué avec succès sous une nouvelle référence !`, 'success');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le modèle "${name}" du catalogue VAYZA ?`)) {
      deleteProduct(id);
    }
  };

  const handleQuickStatusChange = (product: Product, newStatus: 'disponible' | 'rupture' | 'brouillon') => {
    updateProduct(product.id, { status: newStatus });
  };

  const handleSaveProduct = (productData: any, existingId?: string) => {
    if (existingId) {
      updateProduct(existingId, productData);
    } else {
      addProduct(productData);
    }
  };

  // Create product directly from selected phototheque image
  const handleCreateFromPhototheque = (imageUrl: string) => {
    const newSku = `VZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const templateProduct: Product = {
      id: `prod-${Date.now()}`,
      name: 'Nouveau Modèle VAYZA',
      slug: `nouveau-modele-vayza-${Date.now()}`,
      sku: newSku,
      brand: 'VAYZA',
      category: 'sneakers',
      subcategory: 'Lifestyle',
      gender: 'unisex',
      price: 28000,
      originalPrice: 35000,
      discountPercent: 20,
      isNew: true,
      isBestSeller: false,
      isPromotion: true,
      images: [imageUrl],
      primaryImageIndex: 0,
      description: 'Nouvelle paire haute finition avec confort d\'amorti supérieur.',
      material: 'Cuir & Mesh respirant',
      colors: [{ name: 'Original', hex: '#111111' }],
      sizeStock: { 39: 4, 40: 6, 41: 8, 42: 8, 43: 6, 44: 4 },
      totalStock: 36,
      status: 'disponible',
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };

    setEditingProduct(templateProduct);
    setIsModalOpen(true);
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn text-[#121212]">
      
      {/* Header & New Product CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#121212] font-display uppercase tracking-tight">
              Gestion du Catalogue Produits ({products.length})
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
              Édition Temps Réel
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Modifiez librement tous les modèles démo, importez des photos depuis votre photothèque, ajustez les prix et le stock.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Open phototheque browser */}
          <button
            onClick={() => setIsPhotothequeModalOpen(true)}
            className="px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center gap-2 hover:border-[#FF6321]"
          >
            <Camera className="w-4 h-4 text-[#FF6321]" />
            <span>Photothèque Photos</span>
          </button>

          {/* Add product */}
          <button
            onClick={handleOpenNew}
            className="px-5 py-3 bg-[#FF6321] hover:bg-[#E5591E] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-[#FF6321]/25 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Paire</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white/85 backdrop-blur-xl border border-white/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, SKU ou catégorie..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'sneakers', 'homme', 'femme', 'enfant'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase ${
                categoryFilter === cat
                  ? 'bg-[#121212] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:text-black border border-gray-200'
              }`}
            >
              {cat === 'all' ? 'Toutes catégories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 uppercase font-semibold text-[11px]">
                <th className="py-3.5 px-4">Modèle & SKU</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Prix de Vente</th>
                <th className="py-3.5 px-4 text-center">Stock Total</th>
                <th className="py-3.5 px-4 text-center">Pointures Actives</th>
                <th className="py-3.5 px-4">Statut Vente</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF6321] flex items-center justify-center mx-auto">
                        <Package className="w-6 h-6" />
                      </div>
                      <div className="font-extrabold text-sm text-[#121212]">
                        {products.length === 0
                          ? 'Catalogue vide — Prêt pour vos propres produits !'
                          : 'Aucun produit ne correspond à votre recherche.'}
                      </div>
                      <p className="text-xs text-gray-500">
                        {products.length === 0
                          ? 'Tous les produits démo ont été supprimés. Vous pouvez dès maintenant ajouter vos paires avec photos, prix, pointures et stocks.'
                          : 'Modifiez votre terme de recherche ou sélectionnez une autre catégorie.'}
                      </p>
                      {products.length === 0 && (
                        <div className="pt-2 flex items-center justify-center gap-3">
                          <button
                            onClick={handleOpenNew}
                            className="px-4 py-2.5 bg-[#FF6321] hover:bg-[#E5591E] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Ajouter ma première paire</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                const primaryImg = p.images[p.primaryImageIndex || 0] || p.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';
                return (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    
                    {/* Model + Photo + SKU */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => handleOpenEdit(p)}
                          className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0 cursor-pointer group/img"
                          title="Cliquer pour modifier la photo"
                        >
                          <img
                            src={primaryImg}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Edit className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div 
                            onClick={() => handleOpenEdit(p)}
                            className="font-bold text-[#121212] truncate max-w-[180px] sm:max-w-xs cursor-pointer hover:text-[#FF6321] transition-colors"
                          >
                            {p.name}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                            <span>SKU: {p.sku}</span>
                            <span>•</span>
                            <span>{p.images.length} photo(s)</span>
                            {p.isBestSeller && (
                              <span className="text-amber-600 font-bold">★ Best-Seller</span>
                            )}
                            {p.isNew && (
                              <span className="text-emerald-600 font-bold">✦ Nouveau</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-700 font-semibold uppercase text-[10px]">
                        {p.category} ({p.subcategory})
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#121212]">{formatFCFA(p.price)}</div>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <div className="text-[10px] text-gray-400 line-through">
                          {formatFCFA(p.originalPrice)} (-{p.discountPercent}%)
                        </div>
                      )}
                    </td>

                    {/* Total Stock */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                        p.totalStock === 0
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : p.totalStock <= 5
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {p.totalStock} paires
                      </span>
                    </td>

                    {/* Sizes in stock breakdown */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap max-w-[140px] mx-auto">
                        {Object.entries(p.sizeStock).map(([sz, qty]) => (
                          <span
                            key={sz}
                            title={`Taille ${sz}: ${qty} en stock`}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                              Number(qty) > 0
                                ? 'bg-gray-100 text-gray-800 border border-gray-200'
                                : 'bg-gray-50 text-gray-400 opacity-40 line-through'
                            }`}
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={p.status}
                        onChange={(e: any) => handleQuickStatusChange(p, e.target.value)}
                        className={`bg-white border rounded-xl px-2.5 py-1 text-[11px] font-bold uppercase focus:outline-none cursor-pointer ${
                          p.status === 'disponible'
                            ? 'border-emerald-300 text-emerald-700'
                            : p.status === 'rupture'
                            ? 'border-rose-300 text-rose-700'
                            : 'border-gray-300 text-gray-600'
                        }`}
                      >
                        <option value="disponible">En Vente</option>
                        <option value="rupture">Rupture</option>
                        <option value="brouillon">Brouillon</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Prominent Modifier Button */}
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#121212] hover:text-white text-[#121212] font-bold transition-all flex items-center gap-1 shadow-2xs"
                          title="Modifier ce modèle (Prix, Photos, Stock...)"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#FF6321]" />
                          <span>Modifier</span>
                        </button>

                        {/* Dupliquer Button */}
                        <button
                          onClick={() => handleDuplicateProduct(p)}
                          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black transition-colors"
                          title="Dupliquer ce modèle démo"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Supprimer Button */}
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 rounded-xl bg-gray-100 hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
                          title="Supprimer définitivement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Product Edit/Create Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      {/* Photothèque Browser Modal */}
      <PhotothequePickerModal
        isOpen={isPhotothequeModalOpen}
        onClose={() => setIsPhotothequeModalOpen(false)}
        onSelectImage={handleCreateFromPhototheque}
        title="Photothèque VAYZA - Créer ou Remplacer un Modèle"
      />

    </div>
  );
};
