export interface PhotothequeItem {
  id: string;
  title: string;
  category: 'sneakers_sport' | 'sneakers_lifestyle' | 'homme_ville' | 'femme_chic' | 'enfant' | 'details' | 'banners';
  categoryLabel: string;
  url: string;
  tags: string[];
}

export const PHOTOTHEQUE_PRESETS: PhotothequeItem[] = [
  // 1. SNEAKERS SPORT & RUNNING
  {
    id: 'photo-snk-red-1',
    title: 'Sneaker Air Rouge & Blanc Dynapulse',
    category: 'sneakers_sport',
    categoryLabel: 'Sneakers Sport & Running',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=85',
    tags: ['rouge', 'running', 'sport', 'dynamique', 'air'],
  },
  {
    id: 'photo-snk-blue-running',
    title: 'Sneaker Pro Running Bleu Océan',
    category: 'sneakers_sport',
    categoryLabel: 'Sneakers Sport & Running',
    url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1000&auto=format&fit=crop&q=85',
    tags: ['bleu', 'running', 'sport', 'semelle amorti'],
  },
  {
    id: 'photo-snk-orange-runner',
    title: 'Sneaker Nitro Flash Orange Sunset',
    category: 'sneakers_sport',
    categoryLabel: 'Sneakers Sport & Running',
    url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=1000&auto=format&fit=crop&q=85',
    tags: ['orange', 'flash', 'running', 'street'],
  },
  {
    id: 'photo-snk-mesh-black',
    title: 'Sneaker Runner Noir Carbone Mesh',
    category: 'sneakers_sport',
    categoryLabel: 'Sneakers Sport & Running',
    url: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=1000&auto=format&fit=crop&q=85',
    tags: ['noir', 'carbone', 'mesh', 'confort', 'ultra-léger'],
  },
  {
    id: 'photo-snk-neon-green',
    title: 'Sneaker Speed Runner Vert Fluo & Noir',
    category: 'sneakers_sport',
    categoryLabel: 'Sneakers Sport & Running',
    url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=1000&auto=format&fit=crop&q=85',
    tags: ['vert fluo', 'sport', 'gym', 'vitesse'],
  },

  // 2. SNEAKERS LIFESTYLE & STREETWEAR
  {
    id: 'photo-snk-white-classic',
    title: 'Baskets Basses Blanc Pur Minimaliste',
    category: 'sneakers_lifestyle',
    categoryLabel: 'Sneakers Lifestyle & Ville',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&auto=format&fit=crop&q=85',
    tags: ['blanc', 'minimaliste', 'cuir', 'lifestyle', 'retro'],
  },
  {
    id: 'photo-snk-pastel-street',
    title: 'Sneakers Chunky Pastel & Blanc Crème',
    category: 'sneakers_lifestyle',
    categoryLabel: 'Sneakers Lifestyle & Ville',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&auto=format&fit=crop&q=85',
    tags: ['pastel', 'chunky', 'streetwear', 'mode'],
  },
  {
    id: 'photo-snk-retro-high',
    title: 'Sneakers Montantes Rétro Cuir Noir & Blanc',
    category: 'sneakers_lifestyle',
    categoryLabel: 'Sneakers Lifestyle & Ville',
    url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&auto=format&fit=crop&q=85',
    tags: ['montante', 'retro', 'streetwear', 'cuir'],
  },
  {
    id: 'photo-snk-beige-suede',
    title: 'Sneakers Daim & Nubuck Beige Sable',
    category: 'sneakers_lifestyle',
    categoryLabel: 'Sneakers Lifestyle & Ville',
    url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1000&auto=format&fit=crop&q=85',
    tags: ['beige', 'daim', 'street', 'casual'],
  },
  {
    id: 'photo-snk-tri-color',
    title: 'Sneakers Multicolor Urban Dakar',
    category: 'sneakers_lifestyle',
    categoryLabel: 'Sneakers Lifestyle & Ville',
    url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1000&auto=format&fit=crop&q=85',
    tags: ['multicolore', 'urbain', 'tendance'],
  },

  // 3. HOMME CHAUSSURES DE VILLE & MOCASSINS
  {
    id: 'photo-homme-mocassin-noir',
    title: 'Mocassins Cuir Noir Mors Métallique',
    category: 'homme_ville',
    categoryLabel: 'Homme Habillé & Mocassins',
    url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1000&auto=format&fit=crop&q=85',
    tags: ['noir', 'mocassin', 'cuir véritable', 'habillé', 'cérémonie'],
  },
  {
    id: 'photo-homme-derby-brown',
    title: 'Derbies Richelieu Cuir Marron Cognac',
    category: 'homme_ville',
    categoryLabel: 'Homme Habillé & Mocassins',
    url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=1000&auto=format&fit=crop&q=85',
    tags: ['marron', 'richelieu', 'cuir', 'costume', 'business'],
  },
  {
    id: 'photo-homme-boots-chelsea',
    title: 'Chelsea Boots Daim Havane Premium',
    category: 'homme_ville',
    categoryLabel: 'Homme Habillé & Mocassins',
    url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1000&auto=format&fit=crop&q=85',
    tags: ['chelsea', 'bottines', 'daim', 'élégance'],
  },
  {
    id: 'photo-homme-loafer-bordeaux',
    title: 'Loafers Cuir Artisanal Verni',
    category: 'homme_ville',
    categoryLabel: 'Homme Habillé & Mocassins',
    url: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=1000&auto=format&fit=crop&q=85',
    tags: ['loafer', 'verni', 'luxe', 'afro-chic'],
  },

  // 4. FEMME CHIC & SANDALES
  {
    id: 'photo-femme-sandale-dore',
    title: 'Sandales Lanières Cuir Doré & Nude',
    category: 'femme_chic',
    categoryLabel: 'Femme Chic & Sandales',
    url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1000&auto=format&fit=crop&q=85',
    tags: ['sandales', 'doré', 'talons', 'soirée', 'chic'],
  },
  {
    id: 'photo-femme-mules-nude',
    title: 'Mules Cuir Tressé Beige Nude',
    category: 'femme_chic',
    categoryLabel: 'Femme Chic & Sandales',
    url: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=1000&auto=format&fit=crop&q=85',
    tags: ['mules', 'beige', 'été', 'confort', 'tressé'],
  },
  {
    id: 'photo-femme-escarpins-noir',
    title: 'Escarpins Noirs Talons Stiletto Élégance',
    category: 'femme_chic',
    categoryLabel: 'Femme Chic & Sandales',
    url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=1000&auto=format&fit=crop&q=85',
    tags: ['escarpins', 'noir', 'stiletto', 'gala', 'business'],
  },

  // 5. ENFANTS & JUNIORS
  {
    id: 'photo-enfant-snk-color',
    title: 'Baskets Junior Scratch Colorfun',
    category: 'enfant',
    categoryLabel: 'Enfants & Juniors',
    url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=1000&auto=format&fit=crop&q=85',
    tags: ['enfant', 'scratch', 'multicolore', 'école', 'robuste'],
  },
  {
    id: 'photo-enfant-runner-blue',
    title: 'Baskets Mini-Runner Bleu & Orange',
    category: 'enfant',
    categoryLabel: 'Enfants & Juniors',
    url: 'https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?w=1000&auto=format&fit=crop&q=85',
    tags: ['enfant', 'bleu', 'orange', 'confort', 'jeu'],
  },

  // 6. DÉTAILS, SEMELLES & PACKAGING
  {
    id: 'photo-detail-leather-texture',
    title: 'Gros plan texture cuir pleine fleur et surpiqûres',
    category: 'details',
    categoryLabel: 'Finitions & Gros Plans',
    url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=1000&auto=format&fit=crop&q=85',
    tags: ['texture', 'cuir', 'couture', 'finition', 'artisanat'],
  },
  {
    id: 'photo-detail-sole-tread',
    title: 'Semelle d\'usure crantée haute adhérence',
    category: 'details',
    categoryLabel: 'Finitions & Gros Plans',
    url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=1000&auto=format&fit=crop&q=85',
    tags: ['semelle', 'grip', 'adhérence', 'amorti'],
  },

  // 7. BANNIÈRES & MARKETING
  {
    id: 'photo-banner-dakar-lifestyle',
    title: 'Bannière Urbaine Sneakers Dakar Vibe',
    category: 'banners',
    categoryLabel: 'Bannières & Campagnes',
    url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1400&auto=format&fit=crop&q=85',
    tags: ['bannière', 'lifestyle', 'dakar', 'lookbook', 'hero'],
  },
  {
    id: 'photo-banner-luxury-collection',
    title: 'Bannière Atelier Cuir Luxe & Chaussures',
    category: 'banners',
    categoryLabel: 'Bannières & Campagnes',
    url: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=1400&auto=format&fit=crop&q=85',
    tags: ['bannière', 'luxe', 'cuir', 'collection'],
  },
];

/**
 * Utility to process an image file from the device (phone gallery, desktop file picker)
 * Compresses and returns a lightweight Base64 string for fast loading and Firestore compatibility.
 */
export const processDeviceImageFile = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Le fichier sélectionné n\'est pas une image valide.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaling
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Draw image smoothly
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to web-friendly JPEG / WEBP DataURL
        const outputDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(outputDataUrl);
      };
      img.onerror = () => {
        reject(new Error('Impossible de charger l\'image.'));
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
