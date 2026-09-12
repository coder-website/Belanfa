import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { ReservationSection } from './components/ReservationSection';
import { ReviewsSection } from './components/ReviewsSection';
import { SocialShareSection } from './components/SocialShareSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { OrderCartModal } from './components/OrderCartModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AdminModal } from './components/AdminModal';
import { MenuItem, CartItem, Order, Reservation } from './types';
import { INITIAL_PROMOTIONS, RESTAURANT_INFO } from './data/restaurantData';
import { MessageCircle, Phone, Calendar, ShoppingBag, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load past orders from localStorage on mount, ensuring zero fake mock items
  useEffect(() => {
    try {
      const stored = localStorage.getItem('belanfa_order_history');
      if (stored) {
        const parsed: Order[] = JSON.parse(stored);
        const clean = parsed.filter((o) => !['CMD-4091', 'CMD-4092', 'CMD-4093'].includes(o.id));
        if (clean.length !== parsed.length) {
          localStorage.setItem('belanfa_order_history', JSON.stringify(clean));
        }
        setOrders(clean);
      }

      // Also clean any mock reservations in local storage
      const storedRes = localStorage.getItem('belanfa_reservations');
      if (storedRes) {
        const parsedRes = JSON.parse(storedRes);
        const cleanRes = parsedRes.filter((r: any) => !['res-101', 'res-102', 'res-103', 'BLF-8821', 'BLF-7734', 'BLF-5590'].includes(r.id || r.code));
        if (cleanRes.length !== parsedRes.length) {
          localStorage.setItem('belanfa_reservations', JSON.stringify(cleanRes));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Prevent background body double-scrolling when any modal is open
  useEffect(() => {
    if (isAdminOpen || isCartOpen || isHistoryOpen || isNotificationsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAdminOpen, isCartOpen, isHistoryOpen, isNotificationsOpen]);

  // Cart operations
  const handleAddToCart = (item: MenuItem, notes?: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id
            ? { ...c, quantity: c.quantity + 1, notes: notes || c.notes }
            : c
        );
      }
      return [...prev, { item, quantity: 1, notes }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((c) => {
          if (c.item.id === itemId) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((ordItem) => {
      // Create minimal MenuItem for reorder
      const fallbackItem: MenuItem = {
        id: 'reorder-' + ordItem.name.replace(/\s+/g, '-').toLowerCase(),
        name: ordItem.name,
        price: ordItem.price,
        description: 'Plat de votre historique de commande',
        category: 'grillades',
        image: '/images/grillades.jpg',
      };
      setCart((prev) => [...prev, { item: fallbackItem, quantity: ordItem.quantity, notes: ordItem.notes }]);
    });
    setIsCartOpen(true);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('belanfa_order_history');
    setOrders([]);
  };

  const [activeSection, setActiveSection] = useState<string>('hero');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToReservation = () => {
    scrollToSection('reservation');
  };

  const scrollToMenu = () => {
    scrollToSection('menu');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans selection:bg-amber-800 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        cartCount={totalCartCount}
        cartTotal={cartTotal}
        orderCount={orders.length}
        unreadNotificationCount={INITIAL_PROMOTIONS.length}
        unreadPromosCount={INITIAL_PROMOTIONS.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenOrderHistory={() => setIsHistoryOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenReservation={scrollToReservation}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Main Landing Sections */}
      <main className="pb-24 md:pb-0">
        <Hero
          onOpenMenu={scrollToMenu}
          onOpenReservation={scrollToReservation}
          onNavigateToLocation={() => scrollToSection('localisation')}
          onOpenDelivery={scrollToMenu}
        />

        <MenuSection
          onAddToCart={handleAddToCart}
          onOpenReservation={scrollToReservation}
        />

        <ReservationSection />

        <SocialShareSection />

        <ReviewsSection />

        <LocationSection />
      </main>

      {/* Footer */}
      <Footer 
        onOpenReservation={scrollToReservation} 
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Bottom Action Bar for Mobile Users */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-stone-900/95 backdrop-blur-md rounded-2xl border border-stone-700/80 p-2 px-3 shadow-2xl flex items-center justify-between">
        <a
          href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-600/30 flex items-center justify-center text-emerald-400">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span>WhatsApp</span>
        </a>

        <button
          onClick={scrollToReservation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Réserver</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-1.5 text-xs text-stone-200 font-semibold cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-stone-800 flex items-center justify-center text-amber-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
          <span>Panier</span>
        </button>

        <button
          onClick={() => setIsAdminOpen(true)}
          className="p-1.5 bg-stone-800 text-amber-400 rounded-xl text-xs font-semibold flex items-center justify-center"
          title="Admin Gérant"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>

      {/* Cart & Checkout Modal */}
      {isCartOpen && (
        <OrderCartModal
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onClose={() => setIsCartOpen(false)}
          onOrderCompleted={handleOrderCompleted}
        />
      )}

      {/* Order History & Loyalty Modal */}
      {isHistoryOpen && (
        <OrderHistoryModal
          orders={orders}
          onReorder={handleReorder}
          onClearHistory={handleClearHistory}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {/* Push Notifications & Promos Modal */}
      {isNotificationsOpen && (
        <NotificationsModal
          promotions={INITIAL_PROMOTIONS}
          onClose={() => setIsNotificationsOpen(false)}
        />
      )}

      {/* Admin Dashboard Modal (Reservations & Deliveries) */}
      {isAdminOpen && (
        <AdminModal
          onClose={() => setIsAdminOpen(false)}
        />
      )}

    </div>
  );
};

export default App;
