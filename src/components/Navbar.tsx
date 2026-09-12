import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  Calendar, 
  Bell, 
  History, 
  Menu as MenuIcon, 
  X, 
  MessageCircle,
  Flame,
  Star,
  ShieldCheck,
  Award
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { BelanfaLogo } from './BelanfaLogo';

interface NavbarProps {
  cartCount: number;
  cartTotal?: number;
  orderCount?: number;
  unreadNotificationCount?: number;
  unreadPromosCount?: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
  onOpenNotifications: () => void;
  onOpenOrderHistory?: () => void;
  onOpenHistory?: () => void;
  onOpenAdmin?: () => void;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal = 0,
  orderCount = 0,
  unreadNotificationCount,
  unreadPromosCount,
  onOpenCart,
  onOpenReservation,
  onOpenNotifications,
  onOpenOrderHistory,
  onOpenHistory,
  onOpenAdmin,
  activeSection = 'menu',
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const effectiveNotificationCount = unreadNotificationCount ?? unreadPromosCount ?? 0;

  const handleOpenHistory = () => {
    if (typeof onOpenOrderHistory === 'function') {
      onOpenOrderHistory();
    } else if (typeof onOpenHistory === 'function') {
      onOpenHistory();
    }
  };

  const navLinks = [
    { id: 'menu', label: 'Carte & Livraison' },
    { id: 'reservation', label: 'Réserver' },
    { id: 'avis', label: 'Avis Clients (4.9 ★)' },
    { id: 'communaute', label: 'Partage Social' },
    { id: 'localisation', label: 'Accès & Google Maps' },
  ];

  const handleNavClick = (id: string) => {
    if (typeof onNavigate === 'function') {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top bar with quick info */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Ouvert · Ferme à 23:30
            </span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              26 Rue Driss Lahrizi, Casablanca (Centre-Ville)
            </span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              4.9 / 5 · 823 Avis Google
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp: 06 60 14 00 17
            </a>
            <span className="text-stone-600">|</span>
            <a 
              href={`tel:${RESTAURANT_INFO.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              Appel direct
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand logo */}
          <div 
            onClick={() => handleNavClick('hero')} 
            className="cursor-pointer group"
          >
            <BelanfaLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 font-semibold'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Push Notifications Toggle */}
            <button
              id="notifications-button"
              onClick={onOpenNotifications}
              className="relative p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              title="Promotions exclusives Belanfa"
            >
              <Bell className="w-5 h-5" />
              {effectiveNotificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs animate-bounce">
                  {effectiveNotificationCount}
                </span>
              )}
            </button>

            {/* Past orders & Loyalty */}
            <button
              id="history-button"
              onClick={handleOpenHistory}
              className="p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Mes commandes & Points Fidélité Belanfa"
            >
              <History className="w-4 h-4 text-amber-700" />
              <span>Commandes & Fidélité</span>
            </button>

            {/* Interactive Cart Button */}
            <button
              id="cart-button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-xs transition-all hover:shadow-md cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold hidden sm:inline">
                {cartCount > 0 ? `${cartTotal} MAD` : 'Panier'}
              </span>
            </button>

            {/* Online Reservation CTA */}
            <button
              id="header-reserve-button"
              onClick={onOpenReservation}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-800 hover:to-red-800 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Réserver</span>
            </button>

            {/* Admin Dashboard Access Button */}
            {onOpenAdmin && (
              <button
                id="admin-button"
                onClick={onOpenAdmin}
                className="p-2 text-stone-600 hover:text-amber-800 hover:bg-amber-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold border border-stone-200 hover:border-amber-300 cursor-pointer"
                title="Espace Gérant Admin (Réservations & Livraisons)"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-stone-950 rounded-lg lg:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          
          {/* Quick status on mobile */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 text-xs text-stone-600">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Ouvert · Ferme à 23:30
            </span>
            <span className="font-semibold text-stone-800">26 Rue Driss Lahrizi</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-200"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              WhatsApp
            </a>
            <a
              href={`tel:${RESTAURANT_INFO.phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 p-2.5 bg-stone-100 text-stone-800 rounded-xl text-xs font-medium border border-stone-200"
            >
              <Phone className="w-4 h-4 text-stone-600" />
              06 60 14 00 17
            </a>
          </div>

          <div className="py-2 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-100 grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                handleOpenHistory();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2 bg-stone-100 text-stone-800 rounded-xl text-xs font-medium cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-amber-700" />
              <span>Fidélité</span>
            </button>
            <button
              onClick={() => {
                onOpenReservation();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2 bg-amber-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Réserver</span>
            </button>
            {onOpenAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 p-2 bg-stone-900 text-amber-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </button>
            )}
          </div>

        </div>
      )}
    </header>
  );
};
