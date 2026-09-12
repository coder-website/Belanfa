import { LoyaltyReward, Order } from '../types';

export interface LoyaltyTier {
  name: string;
  minPoints: number;
  maxPoints: number;
  badgeColor: string;
  perks: string[];
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: 'Bronze Gourmand',
    minPoints: 0,
    maxPoints: 199,
    badgeColor: 'from-amber-700 to-amber-900',
    perks: ['1 MAD = 1 Point cumulé', 'Cadeau de bienvenue de 50 points', 'Accès aux codes promos exclusifs']
  },
  {
    name: 'Argent Privilège',
    minPoints: 200,
    maxPoints: 499,
    badgeColor: 'from-slate-400 to-slate-600',
    perks: ['Dessert offert dès 200 pts', 'File prioritaire en cuisine', 'Boisson chaude offerte à chaque commande']
  },
  {
    name: 'Or Ambassadeur',
    minPoints: 500,
    maxPoints: 99999,
    badgeColor: 'from-amber-400 to-amber-600',
    perks: ['Mix Grill Royal débloqué', 'Réservation de table garantie', '-20% sur les commandes livraison']
  }
];

export const LOYALTY_REWARDS: LoyaltyReward[] = [
  {
    id: 'rew-1',
    pointsRequired: 100,
    title: 'Thé à la Menthe & Pignons Offert',
    description: 'Savourez notre thé marocain traditionnel infusé à la menthe fraîche et pignons dorés.',
    code: 'FIDELITE-THE',
    icon: 'Coffee'
  },
  {
    id: 'rew-2',
    pointsRequired: 200,
    title: 'Dessert Maison au Choix Offert',
    description: 'Une délicieuse Pastilla au lait d’amande croustillante ou notre Tiramisu au spéculoos.',
    code: 'FIDELITE-DESSERT',
    icon: 'Cake'
  },
  {
    id: 'rew-3',
    pointsRequired: 350,
    title: 'Remise Immédiate de -20% sur la Livraison',
    description: 'Valable sur l’ensemble de votre panier en livraison à Casablanca.',
    code: 'FIDELITE20',
    icon: 'Percent'
  },
  {
    id: 'rew-4',
    pointsRequired: 600,
    title: 'Mix Grill Royal Belanfa pour 2 Personnes',
    description: 'Brochettes, kefta, côtelettes d’agneau, merguez et frites dorées offertes !',
    code: 'FIDELITE-ROYAL',
    icon: 'Crown'
  }
];

export function calculateLoyaltyPoints(orders: Order[]): number {
  // Base welcome bonus of 50 points
  const welcomeBonus = 50;
  const earnedFromOrders = orders.reduce((sum, order) => {
    return sum + Math.round(order.total || 0);
  }, 0);

  return welcomeBonus + earnedFromOrders;
}

export function getCurrentTier(points: number): LoyaltyTier {
  if (points >= 500) return LOYALTY_TIERS[2];
  if (points >= 200) return LOYALTY_TIERS[1];
  return LOYALTY_TIERS[0];
}
