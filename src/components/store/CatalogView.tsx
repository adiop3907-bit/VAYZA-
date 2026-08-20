import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  X, 
  Check, 
  Sparkles, 
  Flame, 
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { CategoryType, GenderType } from '../../types';
import { formatFCFA } from '../../utils/formatters';

export const CatalogView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    selectedGender,
    setSelectedGender,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [selectedSizeFilter, setSelectedSizeFilter] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<number>(50000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const allSizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Status check
      if (p.status === 'brouillon') return false;

      // 2. Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesSubcat = p.subcategory.toLowerCase().includes(q);
        const matchesColor = p.colors.some((c) => c.name.toLowerCase().includes(q));
        const matchesSize = q.match(/\d+/) ? p.sizeStock[Number(q.match(/\d+/)![0])] > 0 : false;

        if (!matchesName && !matchesBrand && !matchesCat && !matchesSubcat && !matchesColor && !matchesSize) {
          return false;
        }
      }

      // 3. Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'promotions') {
          if (!p.isPromotion && (!p.discountPercent || p.discountPercent <= 0)) return false;
        } else if (selectedCategory === 'nouveautes') {
          if (!p.isNew) return false;
        } else if (selectedCategory === 'best-sellers') {
          if (!p.isBestSeller) return false;
        } else if (p.category !== selectedCategory) {
          return false;
        }
      }

      // 4. Gender filter
      if (selectedGender !== 'all') {
        if (p.gender !== selectedGender && p.gender !== 'unisex') return false;
      }

      // 5. SubCategory filter
      if (selectedSubCategory !== 'all' && p.subcategory !== selectedSubCategory) {
        return false;
      }

      // 6. Size filter (Stock > 0 for this size)
      if (selectedSizeFilter !== null) {
        if (!p.sizeStock[selectedSizeFilter] || p.sizeStock[selectedSizeFilter] <= 0) {
          return false;
        }
      }

      // 7. Price Max
      if (p.price > priceMax) return false;

      // 8. In stock only
      if (onlyInStock && p.totalStock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // default featured: best sellers first, then new
      return (b.isBestSeller ? 2 : 0) + (b.isNew ? 1 : 0) - ((a.isBestSeller ? 2 : 0) + (a.isNew ? 1 : 0));
    });
  }, [products, selectedCategory, selectedGender, selectedSubCategory, selectedSizeFilter, priceMax, onlyInStock, sortBy, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSelectedSubCategory('all');
    setSelectedSizeFilter(null);
    setPriceMax(50000);
    setOnlyInStock(false);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedGender !== 'all' ||
    selectedSubCategory !== 'all' ||
    selectedSizeFilter !== null ||
    priceMax < 50000 ||
    onlyInStock ||
    searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-[#0A0A0C] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Catalog Banner / Title */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF3B30] uppercase tracking-widest">
            <span>CATALOGUE OFFICIEL</span>
            <span>•</span>
            <span>{filteredProducts.length} MODÈLE(S)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
            {selectedCategory === 'promotions'
              ? 'Offres & Promotions (-30%)'
              : selectedCategory === 'nouveautes'
              ? 'Nouveautés Chaussures & Sneakers'
              : selectedCategory === 'best-sellers'
              ? 'Best-Sellers VAYZA'
              : selectedCategory !== 'all'
              ? `Chaussures ${selectedCategory.toUpperCase()}`
              : 'Toutes les Chaussures & Sneakers'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Filtrez par pointure, genre, prix et style pour trouver la paire parfaite.
          </p>
        </div>

        {/* Top Control Bar: Search + Quick Category Pills + Sort + Mobile Filter Toggle */}
        <div className="mb-8 p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          
          {/* Quick Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'Tout voir' },
              { id: 'sneakers', label: 'Sneakers 👟' },
              { id: 'homme', label: 'Homme 👞' },
              { id: 'femme', label: 'Femme 👠' },
              { id: 'enfant', label: 'Enfants 👶' },
              { id: 'promotions', label: 'Promos 🔥' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF3B30] text-white shadow-md'
                    : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Right Controls: Sort & Mobile Filter */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-neutral-800 text-white text-xs font-bold flex items-center gap-2"
            >
              <Filter className="w-4 h-4 text-[#FF3B30]" />
              <span>Filtres {hasActiveFilters && '(Actifs)'}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 hidden sm:inline">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF3B30]"
              >
                <option value="featured">Recommandés VAYZA</option>
                <option value="newest">Derniers Arrivages</option>
                <option value="price-asc">Prix croissant (FCFA)</option>
                <option value="price-desc">Prix décroissant (FCFA)</option>
                <option value="rating">Mieux notés ⭐</option>
              </select>
            </div>
          </div>

        </div>

        {/* Main Grid with Filter Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Filter Sidebar (Desktop & Mobile Drawer) */}
          <aside className={`lg:col-span-3 space-y-6 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="p-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                  <SlidersHorizontal className="w-4 h-4 text-[#FF3B30]" />
                  <span>Filtres Avancés</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-[#FF3B30] hover:underline font-semibold"
                  >
                    Effacer tout
                  </button>
                )}
              </div>

              {/* Pointure Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2.5">
                  Pointure Disponible (EU) :
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSizeFilter(selectedSizeFilter === size ? null : size)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        selectedSizeFilter === size
                          ? 'bg-[#FF3B30] text-white border-[#FF3B30] shadow-md shadow-red-950'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2.5">
                  Genre :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'Tous' },
                    { id: 'homme', label: 'Homme' },
                    { id: 'femme', label: 'Femme' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGender(g.id)}
                      className={`py-2 px-1 text-center text-xs font-bold rounded-lg border transition-all ${
                        selectedGender === g.id
                          ? 'bg-neutral-200 text-black border-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  <span>Prix Max :</span>
                  <span className="text-[#FF3B30] font-black">{formatFCFA(priceMax)}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="50000"
                  step="1000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#FF3B30] bg-neutral-950 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                  <span>15 000 FCFA</span>
                  <span>50 000 FCFA</span>
                </div>
              </div>

              {/* In stock only toggle */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-300">En stock uniquement</span>
                <button
                  type="button"
                  onClick={() => setOnlyInStock(!onlyInStock)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    onlyInStock ? 'bg-[#FF3B30]' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      onlyInStock ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-neutral-900/60 border border-neutral-800 rounded-3xl space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Aucun modèle ne correspond à vos critères</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Essayez d'élargir vos filtres de pointure, de prix ou de catégorie pour découvrir plus de chaussures VAYZA.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#FF3B30] text-white text-xs font-bold rounded-xl shadow-lg"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
};
