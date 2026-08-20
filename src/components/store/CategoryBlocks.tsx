import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategoryBlocks: React.FC = () => {
  const { setCurrentView, setSelectedCategory, setSelectedGender } = useStore();

  const categories = [
    {
      id: 'sneakers',
      category: 'sneakers',
      gender: 'all',
      title: 'SNEAKERS',
      subtitle: 'Lifestyle, Running & Montantes',
      tag: '🔥 Best-Seller',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'homme',
      category: 'homme',
      gender: 'homme',
      title: 'HOMME',
      subtitle: 'Mocassins, Derbies & Boots',
      tag: 'Élégance & Bureau',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'femme',
      category: 'femme',
      gender: 'femme',
      title: 'FEMME',
      subtitle: 'Escarpins, Sandales & Ballerines',
      tag: 'Chic & Soirées',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'enfant',
      category: 'enfant',
      gender: 'enfant',
      title: 'ENFANTS',
      subtitle: 'Scratch, Sport & Chaussures Scolaires',
      tag: 'Résistant & Confort',
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const handleSelect = (category: string, gender: string) => {
    setSelectedCategory(category);
    setSelectedGender(gender);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-black tracking-widest text-[#FF6321] uppercase block mb-1">
              UNIVERS VAYZA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#121212] font-display tracking-tight uppercase">
              Explorez par Catégorie
            </h2>
          </div>
          <p className="text-xs text-gray-500 max-w-xs font-medium">
            Des collections ciblées, pensées pour chaque membre de la famille.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.category, cat.gender)}
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 hover:border-[#FF6321] transition-all duration-300 shadow-sm cursor-pointer"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Top Tag */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#121212] text-[10px] font-black rounded-full uppercase tracking-wider shadow-sm">
                  {cat.tag}
                </span>
              </div>

              {/* Action arrow */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#121212] flex items-center justify-center group-hover:bg-[#FF6321] group-hover:text-white transition-colors shadow-sm">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 left-4 right-4 p-2 text-white">
                <h3 className="text-2xl font-black font-display uppercase tracking-tight group-hover:text-[#FF6321] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-gray-300 font-medium mt-1">
                  {cat.subtitle}
                </p>
                <div className="mt-3 inline-flex items-center text-xs font-bold text-white group-hover:text-[#FF6321] transition-colors">
                  <span>Voir les modèles</span>
                  <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
