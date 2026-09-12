export interface DeliveryDistrict {
  id: string;
  name: string;
  distanceKm: number;
  isEligible: boolean;
  estimatedTime: string;
  notes?: string;
}

export const MAX_DELIVERY_DISTANCE_KM = 3.0;

export const RESTAURANT_DELIVERY_INFO = {
  address: '26 Rue Driss Lahrizi, Casablanca 20250',
  maxDistanceKm: 3.0,
  minOrder: 50,
  deliveryFee: 15,
  description: 'Pour préserver la chaleur et le croustillant de nos grillades au feu de bois, la livraison rapide est strictement réservée à un rayon de 2 à 3 km autour du restaurant.'
};

export const CASABLANCA_DELIVERY_DISTRICTS: DeliveryDistrict[] = [
  {
    id: 'centre_ville',
    name: 'Centre-Ville / Rue Driss Lahrizi',
    distanceKm: 0.2,
    isEligible: true,
    estimatedTime: '15-20 min',
    notes: 'Zone immédiate du restaurant'
  },
  {
    id: 'nations_unies',
    name: 'Place des Nations Unies & Bd Mohammed V',
    distanceKm: 0.5,
    isEligible: true,
    estimatedTime: '15-25 min',
    notes: 'Proche tramway Nations Unies'
  },
  {
    id: 'sidi_belyout',
    name: 'Sidi Belyout & Ancienne Médina',
    distanceKm: 0.8,
    isEligible: true,
    estimatedTime: '20-25 min',
    notes: 'Secteur historique'
  },
  {
    id: 'mers_sultan',
    name: 'Mers Sultan & Place de la Victoire',
    distanceKm: 1.2,
    isEligible: true,
    estimatedTime: '20-30 min',
    notes: 'Quartier commerçant central'
  },
  {
    id: 'ligue_arabe',
    name: 'Parc de la Ligue Arabe & Bd Hassan II',
    distanceKm: 1.4,
    isEligible: true,
    estimatedTime: '20-30 min',
    notes: 'Axe Hassan II'
  },
  {
    id: 'gautier',
    name: 'Quartier Gautier (Rue Molière / Bd d’Anfa)',
    distanceKm: 1.9,
    isEligible: true,
    estimatedTime: '25-35 min',
    notes: 'Zone résidentielle & bureaux'
  },
  {
    id: 'racine',
    name: 'Racine / Proche Twin Center',
    distanceKm: 2.5,
    isEligible: true,
    estimatedTime: '25-35 min',
    notes: 'Bvd Massira & Twin Center'
  },
  {
    id: 'bourgogne_est',
    name: 'Bourgogne Est (vers Bd Zerktouni)',
    distanceKm: 2.9,
    isEligible: true,
    estimatedTime: '30-40 min',
    notes: 'Limite de zone (2.9 km)'
  },
  // Ineligible districts outside the 3km radius
  {
    id: 'maarif_sud',
    name: 'Maârif Sud / Val Fleuri (> 3.5 km)',
    distanceKm: 3.7,
    isEligible: false,
    estimatedTime: 'Non desservi',
    notes: 'Trop éloigné pour nos grillades au feu de bois'
  },
  {
    id: 'ain_diab',
    name: 'Ain Diab / Corniche / Anfa Supérieur (> 5.5 km)',
    distanceKm: 6.0,
    isEligible: false,
    estimatedTime: 'Non desservi',
    notes: 'Hors rayon strict de 3 km'
  },
  {
    id: 'oulfa',
    name: 'Oulfa & Hay Hassani (> 8 km)',
    distanceKm: 8.5,
    isEligible: false,
    estimatedTime: 'Non desservi',
    notes: 'Hors rayon strict de 3 km'
  },
  {
    id: 'californie',
    name: 'Californie & Sidi Maarouf (> 10 km)',
    distanceKm: 10.5,
    isEligible: false,
    estimatedTime: 'Non desservi',
    notes: 'Hors rayon strict de 3 km'
  },
];
