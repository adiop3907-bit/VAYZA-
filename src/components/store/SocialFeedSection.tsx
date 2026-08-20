import React from 'react';
import { Instagram, Video, MessageCircle, ArrowUpRight, Play, Heart, MessageSquare } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppSupportLink } from '../../utils/formatters';

export const SocialFeedSection: React.FC = () => {
  const { siteSettings } = useStore();

  const socialReels = [
    {
      platform: 'TikTok',
      title: 'Unboxing Boîte Signature VAYZA 📦',
      tag: 'Unboxing & Découverte',
      likes: '14.2K',
      comments: '342',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    },
    {
      platform: 'Instagram',
      title: 'Top 3 Sneakers indispensables à Dakar 👟',
      tag: 'Styling & Look',
      likes: '9.8K',
      comments: '189',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
    },
    {
      platform: 'TikTok',
      title: 'Mocassins Cuir vs Tenue Traditionnelle Vendredi 👞',
      tag: 'Élégance & Heritage',
      likes: '21.5K',
      comments: '512',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80',
    },
    {
      platform: 'Instagram',
      title: 'Test d\'amorti CloudPulse sur la Corniche 🌊',
      tag: 'Performance Test',
      likes: '11.3K',
      comments: '204',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-gray-50/60 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#FF6321] uppercase mb-1">
              <span>COMMUNAUTÉ & RÉSEAUX</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#121212] font-display uppercase tracking-tight">
              Suivez VAYZA en Mouvement
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://tiktok.com/${siteSettings.tiktokHandle}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-[#121212] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Video className="w-3.5 h-3.5 text-[#FF6321]" />
              <span>TikTok {siteSettings.tiktokHandle}</span>
            </a>
            <a
              href={`https://instagram.com/${siteSettings.instagramHandle.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-[#121212] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-600" />
              <span>Instagram {siteSettings.instagramHandle}</span>
            </a>
          </div>
        </div>

        {/* Reels Preview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {socialReels.map((reel, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 aspect-[9/16] shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={reel.image}
                alt={reel.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

              {/* Platform badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#121212] text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  {reel.platform}
                </span>
              </div>

              {/* Play icon center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#FF6321] transition-all">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>

              {/* Bottom stats & title */}
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <span className="text-[10px] font-bold text-[#FF6321] uppercase tracking-wider block">
                  {reel.tag}
                </span>
                <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                  {reel.title}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-300 pt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-[#FF6321] text-[#FF6321]" /> {reel.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> {reel.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
