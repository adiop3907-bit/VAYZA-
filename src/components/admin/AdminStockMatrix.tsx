import React, { useState } from 'react';
import { Package, Plus, Minus, Search, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA } from '../../utils/formatters';

export const AdminStockMatrix: React.FC = () => {
  const { products, updateSizeStock, showNotification } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

  const handleAdjustStock = (productId: string, size: number, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    updateSizeStock(productId, size, newStock);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn text-[#121212]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#121212] font-display uppercase tracking-tight">
            Matrice des Stocks par Pointure (EU 36 - 45)
          </h2>
          <p className="text-xs text-gray-500">
            Ajustez l'inventaire en 1 clic (+ / -) pour chaque pointure sans passer par un formulaire.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrer un modèle ou SKU..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-[#121212] placeholder-gray-400 focus:outline-none focus:border-[#FF6321]"
          />
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 uppercase font-semibold text-[11px]">
                <th className="py-3 px-4 text-left min-w-[200px]">Modèle / Réf</th>
                <th className="py-3 px-2 text-center">Total</th>
                {sizes.map((sz) => (
                  <th key={sz} className="py-3 px-1 text-center min-w-[70px]">
                    EU {sz}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                return (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    
                    {/* Model Info */}
                    <td className="py-3 px-4 text-left">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-[#121212] truncate max-w-[160px]">{p.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            {p.sku} • {formatFCFA(p.price)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Total Stock */}
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                        p.totalStock === 0
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : p.totalStock <= 5
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {p.totalStock}
                      </span>
                    </td>

                    {/* Size Cells with Instant +/- Buttons */}
                    {sizes.map((sz) => {
                      const currentStock = p.sizeStock[sz] || 0;
                      const isZero = currentStock === 0;

                      return (
                        <td key={sz} className="py-2.5 px-1">
                          <div className={`p-1.5 rounded-xl border flex items-center justify-between gap-1 transition-all ${
                            isZero
                              ? 'bg-gray-50 border-gray-200 opacity-60'
                              : currentStock <= 2
                              ? 'bg-amber-50/60 border-amber-200'
                              : 'bg-white border-gray-200 shadow-sm'
                          }`}>
                            <button
                              onClick={() => handleAdjustStock(p.id, sz, currentStock, -1)}
                              disabled={isZero}
                              className="w-5 h-5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black flex items-center justify-center font-bold text-xs disabled:opacity-20 transition-colors"
                            >
                              -
                            </button>

                            <span className={`font-mono font-bold text-xs ${
                              isZero ? 'text-gray-400' : currentStock <= 2 ? 'text-amber-600 font-black' : 'text-[#121212]'
                            }`}>
                              {currentStock}
                            </span>

                            <button
                              onClick={() => handleAdjustStock(p.id, sz, currentStock, 1)}
                              className="w-5 h-5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black flex items-center justify-center font-bold text-xs transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      );
                    })}

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
