export function formatFCFA(amount: number): string {
  if (isNaN(amount)) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function buildWhatsAppOrderLink(
  phone: string,
  productName: string,
  size: number,
  color: string,
  price: number,
  sku: string
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = `Bonjour VAYZA 👋\nJe souhaite commander cette paire :\n\n👟 Modèle : *${productName}*\n🏷️ Réf : ${sku}\n📏 Pointure : *EU ${size}*\n🎨 Couleur : ${color}\n💰 Prix : *${formatFCFA(price)}*\n\nEst-elle toujours disponible ? Merci !`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppSupportLink(phone: string, topic?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = topic
    ? `Bonjour VAYZA, j'ai une question concernant : ${topic}`
    : `Bonjour VAYZA, j'aimerais avoir des renseignements sur vos modèles et la livraison.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppOrderStatusLink(phone: string, orderId: string, customerName: string, statusText: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = `Bonjour ${customerName} 👋\nVotre commande VAYZA *${orderId}* est maintenant : *${statusText}*.\nMerci pour votre confiance !`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export interface SizeGuideRow {
  eu: number;
  cm: number;
  uk: number;
  usMen: number;
  usWomen: number;
}

export const SIZE_GUIDE_TABLE: SizeGuideRow[] = [
  { eu: 36, cm: 22.5, uk: 3.5, usMen: 4.5, usWomen: 6 },
  { eu: 37, cm: 23.5, uk: 4.5, usMen: 5.5, usWomen: 7 },
  { eu: 38, cm: 24.0, uk: 5.0, usMen: 6.0, usWomen: 7.5 },
  { eu: 39, cm: 25.0, uk: 6.0, usMen: 7.0, usWomen: 8.5 },
  { eu: 40, cm: 25.5, uk: 6.5, usMen: 7.5, usWomen: 9.0 },
  { eu: 41, cm: 26.5, uk: 7.5, usMen: 8.5, usWomen: 10.0 },
  { eu: 42, cm: 27.0, uk: 8.0, usMen: 9.0, usWomen: 10.5 },
  { eu: 43, cm: 28.0, uk: 9.0, usMen: 10.0, usWomen: 11.5 },
  { eu: 44, cm: 28.5, uk: 9.5, usMen: 10.5, usWomen: 12.0 },
  { eu: 45, cm: 29.5, uk: 10.5, usMen: 11.5, usWomen: 13.0 },
];
