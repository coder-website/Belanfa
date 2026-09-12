export type CategoryId = 
  | 'all'
  | 'grillades'
  | 'tagines'
  | 'pizzas'
  | 'salades'
  | 'burgers'
  | 'desserts'
  | 'boissons';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  price: number; // in MAD
  description: string;
  image: string;
  badge?: string;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isChefSpecial?: boolean;
  isMatchSpecial?: boolean;
  prepTime?: string;
  calories?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
  cookingPreference?: 'saignant' | 'a_point' | 'bien_cuit';
  sauceChoice?: string;
}

export type DiningType = 'livraison' | 'sur_place' | 'a_emporter';

export interface Order {
  id: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    notes?: string;
  }[];
  total: number;
  diningType: DiningType;
  tableNumber?: string;
  deliveryDistrict?: string;
  deliveryDistanceKm?: number;
  deliveryAddress?: string;
  customerName: string;
  customerPhone: string;
  status: 'en_attente' | 'en_preparation' | 'en_livraison' | 'prete' | 'livree' | 'annulee';
  createdAt: number;
}

export type SeatingZone = 'terrasse' | 'cheminee' | 'salon_cosy' | 'salle_principale' | 'ecran_sport';

export interface Reservation {
  id: string;
  code: string;
  date: string;
  time: string;
  guests: number;
  seatingZone: SeatingZone;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  specialRequests?: string;
  status: 'confirmee' | 'en_attente' | 'terminee' | 'honoree' | 'annulee';
  createdAt: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  restaurant: string;
  token: string;
}

export interface LoyaltyReward {
  id: string;
  pointsRequired: number;
  title: string;
  description: string;
  code: string;
  icon: string;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  date: string;
  rating: number; // 1-5
  comment: string;
  dishMentioned?: string;
  tag?: string;
  verified: boolean;
  helpfulCount: number;
}

export interface VideoStory {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  views: string;
  category: string;
}

export interface SocialPost {
  id: string;
  authorHandle: string;
  authorName: string;
  avatar: string;
  photoUrl: string;
  dishName: string;
  caption: string;
  likes: number;
  date: string;
  isUserUploaded?: boolean;
}

export interface PushPromo {
  id: string;
  title: string;
  message: string;
  tag: string;
  discountCode?: string;
  timestamp: string;
  isRead: boolean;
  linkAction?: string;
  badgeColor?: string;
}
