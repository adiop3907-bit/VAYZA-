import { Router, Request, Response } from 'express';
import { db } from './db';
import { GoogleGenAI } from '@google/genai';

export const apiRouter = Router();

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), brand: 'VAYZA — Your Style. Your Step.' });
});

// ----------------------------------------------------
// Products API
// ----------------------------------------------------
apiRouter.get('/products', (req: Request, res: Response) => {
  try {
    let products = db.getProducts();
    const { category, gender, subcategory, search, status, sort } = req.query;

    if (category && typeof category === 'string' && category !== 'tous') {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (gender && typeof gender === 'string' && gender !== 'all') {
      products = products.filter((p) => p.gender.toLowerCase() === gender.toLowerCase() || p.gender === 'unisex');
    }

    if (subcategory && typeof subcategory === 'string') {
      products = products.filter((p) => p.subcategory.toLowerCase() === subcategory.toLowerCase());
    }

    if (status && typeof status === 'string') {
      products = products.filter((p) => p.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json({ success: true, count: products.length, products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.get('/products/:id', (req: Request, res: Response) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.post('/products', (req: Request, res: Response) => {
  try {
    const productData = req.body;
    if (!productData.name || !productData.price) {
      return res.status(400).json({ success: false, message: 'Nom et prix obligatoires' });
    }
    const created = db.createProduct(productData);
    res.status(201).json({ success: true, product: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.put('/products/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Produit introuvable pour mise à jour' });
    }
    res.json({ success: true, product: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.patch('/products/:id/stock', (req: Request, res: Response) => {
  try {
    const { sizeStock, status } = req.body;
    const updated = db.updateProduct(req.params.id, { sizeStock, status });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Produit introuvable' });
    }
    res.json({ success: true, product: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.delete('/products/:id', (req: Request, res: Response) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }
    res.json({ success: true, message: 'Produit supprimé avec succès' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// Orders API
// ----------------------------------------------------
apiRouter.get('/orders', (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    let orders = db.getOrders();

    if (status && typeof status === 'string') {
      orders = orders.filter((o) => o.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.phone.replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
          o.customer.lastName.toLowerCase().includes(q) ||
          o.customer.firstName.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande non trouvée' });
    }
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.post('/orders', (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Le panier est vide' });
    }
    if (!orderData.customer || !orderData.customer.phone) {
      return res.status(400).json({ success: false, message: 'Numéro de téléphone client requis' });
    }

    const order = db.createOrder(orderData);
    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.patch('/orders/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Statut requis' });
    }
    const order = db.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.patch('/orders/:id/payment', (req: Request, res: Response) => {
  try {
    const { paymentStatus } = req.body;
    if (!paymentStatus) {
      return res.status(400).json({ success: false, message: 'Statut de paiement requis' });
    }
    const order = db.updatePaymentStatus(req.params.id, paymentStatus);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// Coupons API
// ----------------------------------------------------
apiRouter.get('/coupons', (req: Request, res: Response) => {
  try {
    res.json({ success: true, coupons: db.getCoupons() });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.post('/coupons/validate', (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Code promo requis' });
    }
    const result = db.validateCoupon(code, Number(subtotal) || 0);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.post('/coupons', (req: Request, res: Response) => {
  try {
    const coupon = db.createCoupon(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.delete('/coupons/:id', (req: Request, res: Response) => {
  try {
    db.deleteCoupon(req.params.id);
    res.json({ success: true, message: 'Coupon supprimé' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// Reviews API
// ----------------------------------------------------
apiRouter.get('/reviews', (req: Request, res: Response) => {
  try {
    const { productId } = req.query;
    let reviews = db.getReviews();
    if (productId && typeof productId === 'string') {
      reviews = reviews.filter((r) => r.productId === productId);
    }
    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.post('/reviews', (req: Request, res: Response) => {
  try {
    const review = db.createReview(req.body);
    res.status(201).json({ success: true, review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.patch('/reviews/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const review = db.updateReviewStatus(req.params.id, status);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Avis introuvable' });
    }
    res.json({ success: true, review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// Settings & CMS API
// ----------------------------------------------------
apiRouter.get('/settings', (req: Request, res: Response) => {
  try {
    res.json({ success: true, settings: db.getSettings() });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.put('/settings', (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// Analytics & Stats API
// ----------------------------------------------------
apiRouter.get('/stats', (req: Request, res: Response) => {
  try {
    res.json({ success: true, stats: db.getStats() });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// Newsletter / Subscriptions API
// ----------------------------------------------------
apiRouter.post('/newsletter', (req: Request, res: Response) => {
  try {
    const { contact } = req.body;
    if (!contact || !contact.trim()) {
      return res.status(400).json({ success: false, message: 'Contact requis (Email ou Numéro)' });
    }
    db.addSubscriber(contact.trim());
    res.json({ success: true, message: 'Inscription réussie ! Vous recevrez nos offres exclusives.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// AI Style & Size Assistant (Optional Gemini integration)
// ----------------------------------------------------
apiRouter.post('/ai/recommend', async (req: Request, res: Response) => {
  try {
    const { userPreference, occasion, gender } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Rule-based fallback if API key is not configured
      const products = db.getProducts().slice(0, 3);
      return res.json({
        success: true,
        recommendation: `Pour vos sorties ${occasion || 'lifestyle'}, nous vous conseillons nos modèles phares conçus pour le confort et le style sous le climat sénégalais.`,
        suggestedProducts: products,
      });
    }

    const products = db.getProducts();
    const catalogContext = products.map(p => `${p.name} (${p.category}, ${p.price} FCFA) - ${p.description}`).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Tu es le conseiller style officiel de VAYZA, boutique exclusive de chaussures de marque à Dakar au Sénégal.
Style : Moderne, élégant, sportif, chaleureux.
Préférence client : ${userPreference || 'polyvalent'}
Occasion : ${occasion || 'tous les jours'}
Genre : ${gender || 'tous'}

Catalogue disponible :
${catalogContext}

Donne une recommandation courte, percutante (2-3 phrases) en français avec un conseil de style adapté à Dakar/Sénégal.`,
    });

    res.json({
      success: true,
      recommendation: response.text || 'Découvrez nos paires VAYZA les plus appréciées !',
      suggestedProducts: products.slice(0, 3),
    });
  } catch (error: any) {
    console.error('AI assistant error:', error);
    res.json({
      success: true,
      recommendation: 'Nos sneakers et mocassins VAYZA sont spécialement conçus pour allier confort supérieur et élégance.',
      suggestedProducts: db.getProducts().slice(0, 3),
    });
  }
});

// ----------------------------------------------------
// Admin Authentication (Restricted strictly to senjaaba221@gmail.com)
// ----------------------------------------------------
const AUTHORIZED_SUPER_ADMIN_EMAIL = 'senjaaba221@gmail.com';

apiRouter.post('/auth/admin-login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Adresse email requise' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Strict validation: Only senjaaba221@gmail.com is authorized
    if (normalizedEmail !== AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Seule l'adresse ${AUTHORIZED_SUPER_ADMIN_EMAIL} est habilitée à administrer le site VAYZA.`,
      });
    }

    // Return successful admin session
    res.json({
      success: true,
      message: 'Authentification administrateur réussie',
      user: {
        id: 'admin-super-1',
        name: 'Direction VAYZA',
        email: AUTHORIZED_SUPER_ADMIN_EMAIL,
        role: 'super_admin',
        lastLogin: new Date().toISOString(),
      },
      token: 'vayza_admin_token_' + Buffer.from(AUTHORIZED_SUPER_ADMIN_EMAIL).toString('base64'),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

apiRouter.get('/auth/verify-admin', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const emailHeader = req.headers['x-admin-email'];

    if (
      emailHeader &&
      typeof emailHeader === 'string' &&
      emailHeader.trim().toLowerCase() === AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase()
    ) {
      return res.json({
        success: true,
        authorized: true,
        email: AUTHORIZED_SUPER_ADMIN_EMAIL,
        role: 'super_admin',
      });
    }

    res.status(401).json({
      success: false,
      authorized: false,
      message: 'Session administrateur non valide ou non autorisée',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

