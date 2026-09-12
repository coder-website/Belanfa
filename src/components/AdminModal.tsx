import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  Calendar, 
  Bike, 
  DollarSign, 
  Phone, 
  MessageCircle, 
  MapPin, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Search,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Trash2,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2,
  Printer,
  ExternalLink,
  Receipt,
  LayoutGrid,
  List,
  Utensils,
  ArrowDownCircle,
  ArrowUpCircle,
  Layers,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Order, Reservation } from '../types';
import { BelanfaLogo } from './BelanfaLogo';

interface AdminModalProps {
  onClose: () => void;
}

type TabType = 'all' | 'deliveries' | 'reservations';

export const AdminModal: React.FC<AdminModalProps> = ({ onClose }) => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fullscreen & UI Layout states
  const [isFullscreen, setIsFullscreen] = useState<boolean>(true);
  const [showStats, setShowStats] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Unified Scroll mode: 'all' by default so users can freely scroll down to see reservations
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Selected for full detail modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Dashboard data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilterDeliveries, setStatusFilterDeliveries] = useState<string>('all');
  const [statusFilterReservations, setStatusFilterReservations] = useState<string>('all');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastOrderCountRef = useRef<number>(0);
  const lastResCountRef = useRef<number>(0);

  // Play audio chime when a new real order arrives
  const playOrderChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}
  };

  // Fetch real-time data from Express server
  const fetchData = async (showSpinner = true) => {
    if (showSpinner) setRefreshing(true);
    try {
      // 1. Fetch Orders
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        const orderList: Order[] = (Array.isArray(data) ? data : (data.orders || []))
          .filter((o: any) => !['CMD-4091', 'CMD-4092', 'CMD-4093'].includes(o.id));
        
        if (lastOrderCountRef.current > 0 && orderList.length > lastOrderCountRef.current) {
          const newest = orderList[0];
          setNewOrderAlert(`Nouvelle commande reçue : ${newest.id} (${newest.customerName} - ${newest.total} MAD)`);
          if (soundEnabled) playOrderChime();
          setTimeout(() => setNewOrderAlert(null), 6000);
        }
        lastOrderCountRef.current = orderList.length;
        setOrders(orderList);

        if (selectedOrder) {
          const found = orderList.find((o) => o.id === selectedOrder.id);
          if (found) setSelectedOrder(found);
        }
      }

      // 2. Fetch Reservations
      const resRes = await fetch('/api/reservations');
      if (resRes.ok) {
        const data = await resRes.json();
        const resList: Reservation[] = (Array.isArray(data) ? data : (data.reservations || []))
          .filter((r: any) => !['res-101', 'res-102', 'res-103', 'BLF-8821', 'BLF-7734', 'BLF-5590'].includes(r.id || r.code));
        
        if (lastResCountRef.current > 0 && resList.length > lastResCountRef.current) {
          const newest = resList[0];
          setNewOrderAlert(`Nouvelle réservation reçue : ${newest.code} (${newest.customerName} - ${newest.guests} pers)`);
          if (soundEnabled) playOrderChime();
          setTimeout(() => setNewOrderAlert(null), 6000);
        }
        lastResCountRef.current = resList.length;
        setReservations(resList);

        if (selectedReservation) {
          const found = resList.find((r) => r.id === selectedReservation.id || r.code === selectedReservation.code);
          if (found) setSelectedReservation(found);
        }
      }

      setLastSyncTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn('Backend sync check:', err);
    } finally {
      if (showSpinner) setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchData(true);
    const interval = setInterval(() => {
      fetchData(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated, soundEnabled]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        if (email.trim().toLowerCase() === 'admin@belanfa.ma' && password === 'BelanfaCasa2026!') {
          setIsAuthenticated(true);
        } else {
          setLoginError(data.message || data.error || 'Identifiants incorrects. Veuillez vérifier votre adresse e-mail et mot de passe.');
        }
      }
    } catch (err) {
      if (email.trim().toLowerCase() === 'admin@belanfa.ma' && password === 'BelanfaCasa2026!') {
        setIsAuthenticated(true);
      } else {
        setLoginError('Identifiants incorrects. Veuillez vérifier votre adresse e-mail et mot de passe.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {}

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    }

    try {
      const stored = localStorage.getItem('belanfa_order_history');
      if (stored) {
        const list: Order[] = JSON.parse(stored);
        const updated = list.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
        localStorage.setItem('belanfa_order_history', JSON.stringify(updated));
      }
    } catch (e) {}
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm(`Supprimer définitivement la commande ${orderId} ?`)) return;
    try {
      await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    } catch (e) {}

    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedOrder && selectedOrder.id === orderId) setSelectedOrder(null);
    lastOrderCountRef.current = Math.max(0, lastOrderCountRef.current - 1);

    try {
      const stored = localStorage.getItem('belanfa_order_history');
      if (stored) {
        const list: Order[] = JSON.parse(stored);
        localStorage.setItem('belanfa_order_history', JSON.stringify(list.filter((o) => o.id !== orderId)));
      }
    } catch (e) {}
  };

  const updateReservationStatus = async (resId: string, newStatus: Reservation['status']) => {
    try {
      await fetch(`/api/reservations/${resId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {}

    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status: newStatus } : r))
    );

    if (selectedReservation && (selectedReservation.id === resId || selectedReservation.code === resId)) {
      setSelectedReservation((prev) => prev ? { ...prev, status: newStatus } : null);
    }

    try {
      const stored = localStorage.getItem('belanfa_reservations');
      if (stored) {
        const list: Reservation[] = JSON.parse(stored);
        const updated = list.map((r) => (r.id === resId ? { ...r, status: newStatus } : r));
        localStorage.setItem('belanfa_reservations', JSON.stringify(updated));
      }
    } catch (e) {}
  };

  const deleteReservation = async (resId: string) => {
    if (!window.confirm(`Supprimer définitivement cette réservation ?`)) return;
    try {
      await fetch(`/api/reservations/${resId}`, { method: 'DELETE' });
    } catch (e) {}

    setReservations((prev) => prev.filter((r) => r.id !== resId && r.code !== resId));
    if (selectedReservation && (selectedReservation.id === resId || selectedReservation.code === resId)) {
      setSelectedReservation(null);
    }
    lastResCountRef.current = Math.max(0, lastResCountRef.current - 1);

    try {
      const stored = localStorage.getItem('belanfa_reservations');
      if (stored) {
        const list: Reservation[] = JSON.parse(stored);
        localStorage.setItem('belanfa_reservations', JSON.stringify(list.filter((r) => r.id !== resId && r.code !== resId)));
      }
    } catch (e) {}
  };

  const handleResetAllData = async () => {
    if (!window.confirm('Voulez-vous réinitialiser toutes les données à 0 ? Toutes les commandes et réservations seront effacées.')) return;
    try {
      await fetch('/api/admin/reset-all', { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem('belanfa_order_history');
    localStorage.removeItem('belanfa_reservations');
    setOrders([]);
    setReservations([]);
    setSelectedOrder(null);
    setSelectedReservation(null);
    lastOrderCountRef.current = 0;
    lastResCountRef.current = 0;
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // KPI Calculations
  const totalDeliveriesRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'en_attente').length;
  const kitchenOrdersCount = orders.filter((o) => o.status === 'en_preparation').length;
  const deliveryOrdersCount = orders.filter((o) => o.status === 'en_livraison').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'livree').length;
  const cancelledOrdersCount = orders.filter((o) => o.status === 'annulee').length;

  const confirmedReservationsCount = reservations.filter((r) => r.status === 'confirmee').length;
  const honoredReservationsCount = reservations.filter((r) => r.status === 'honoree' || r.status === 'terminee').length;
  const cancelledReservationsCount = reservations.filter((r) => r.status === 'annulee').length;

  // Filtered lists
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      (o.deliveryDistrict && o.deliveryDistrict.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.deliveryAddress && o.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilterDeliveries === 'all' || o.status === statusFilterDeliveries;
    return matchesSearch && matchesStatus;
  });

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch = 
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerPhone.includes(searchQuery) ||
      (r.specialRequests && r.specialRequests.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilterReservations === 'all' || r.status === statusFilterReservations;
    return matchesSearch && matchesStatus;
  });

  const printTicket = () => {
    window.print();
  };

  return (
    <div 
      id="admin-modal-backdrop"
      className={`fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-stone-950/90 backdrop-blur-sm transition-all ${
        isFullscreen ? 'p-0' : 'p-0 sm:p-3 lg:p-4'
      }`}
      style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
    >
      <div 
        className={`w-full max-w-7xl mx-auto min-h-full bg-stone-100 flex flex-col shadow-2xl transition-all ${
          isFullscreen ? 'rounded-none' : 'rounded-none sm:rounded-3xl border-0 sm:border sm:border-stone-300'
        }`}
      >
        
        {/* ========================================================
            TOP MAIN HEADER BAR (Sticky on mobile & desktop)
        ======================================================== */}
        <header className="sticky top-0 z-40 p-3 sm:p-4 bg-stone-900 text-white border-b border-stone-800 flex items-center justify-between gap-3 shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <BelanfaLogo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-base sm:text-xl font-bold text-white tracking-wide">
                  Restaurant Belanfa · Administration
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                  Accès Privé
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Direct actif
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Vue complète des commandes et réservations à Casablanca (Driss Lahrizi)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick jump to Reservations if in unified view */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  if (activeTab === 'deliveries') setActiveTab('all');
                  setTimeout(() => scrollToSection('section-reservations'), 100);
                }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/80 hover:bg-blue-800 text-blue-200 border border-blue-700/60 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Défiler directement vers les réservations de tables"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-300" />
                <span>Voir Réservations ({reservations.length}) ↓</span>
              </button>
            )}

            {/* Toggle Fullscreen / Windowed */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 sm:px-3 sm:py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isFullscreen ? "Réduire la fenêtre" : "Agrandir en plein écran"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden md:inline">Mode Fenêtre</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden md:inline">Plein Écran</span>
                </>
              )}
            </button>

            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-2 bg-stone-800 hover:bg-red-950 hover:text-red-300 text-stone-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-stone-800 text-stone-300 flex items-center justify-center hover:bg-stone-700 hover:text-white transition-colors cursor-pointer border border-stone-700"
              title="Fermer l'administration"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {!isAuthenticated ? (
          /* ========================================================
             LOGIN SCREEN
          ======================================================== */
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 sm:p-8 bg-stone-100">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-amber-200">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Espace Direction Belanfa
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Connectez-vous pour visualiser et gérer en direct toutes les commandes de grillades et réservations de tables à Casablanca.
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
                    Identifiant E-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="admin@belanfa.ma"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white font-mono transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-stone-900 hover:bg-amber-800 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Authentification...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      <span>Ouvrir le Tableau de Bord</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ========================================================
             FULL-SIZE DASHBOARD WITH RELIABLE CONTINUOUS SCROLL
          ======================================================== */
          <div className="flex-1 flex flex-col bg-stone-100 relative">
            
            {/* Real-time Order Alert Toast Banner */}
            {newOrderAlert && (
              <div className="mx-3 sm:mx-6 mt-3 p-3.5 bg-emerald-600 text-white text-sm font-bold rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-300 border border-emerald-500 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>{newOrderAlert}</span>
                </div>
                <button
                  onClick={() => setNewOrderAlert(null)}
                  className="p-1 hover:bg-emerald-700 rounded-lg text-emerald-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Top Quick Bar (Sync status, Chime & Reset) */}
            <div className="px-3 sm:px-6 py-2 bg-stone-900 text-stone-300 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-white text-[11px] sm:text-xs">
                  Direct actif
                </span>
                <span className="text-stone-400 text-[10px] sm:text-[11px]">
                  {lastSyncTime ? `(${lastSyncTime})` : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    soundEnabled ? 'bg-amber-950 text-amber-300 border border-amber-700/50' : 'bg-stone-800 text-stone-500'
                  }`}
                  title={soundEnabled ? 'Sonnette active' : 'Sonnette coupée'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{soundEnabled ? 'Sonnette active' : 'Muet'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fetchData(true)}
                  disabled={refreshing}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  title="Actualiser maintenant"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
                  <span className="hidden sm:inline">Actualiser</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetAllData}
                  className="text-stone-400 hover:text-red-400 text-xs transition-colors cursor-pointer flex items-center gap-1 p-1 hover:bg-stone-800 rounded"
                  title="Réinitialiser toutes les données"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Vider (0)</span>
                </button>
              </div>
            </div>

            {/* STICKY SEGMENTED NAV & INSTANT SEARCH */}
            <div className="sticky top-[53px] sm:top-[61px] z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs px-3 sm:px-6 py-2.5 space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                
                {/* 3 Main View Tabs: High-contrast badges */}
                <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 gap-1">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'all'
                        ? 'bg-stone-900 text-white shadow-md'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Tout</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                      activeTab === 'all' ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {orders.length + reservations.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('deliveries')}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'deliveries'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-amber-900 hover:text-amber-950 hover:bg-amber-100/60'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>Livraisons</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                      activeTab === 'deliveries' ? 'bg-white text-amber-950' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {orders.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('reservations')}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'reservations'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-blue-900 hover:text-blue-950 hover:bg-blue-100/60'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Réservations</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                      activeTab === 'reservations' ? 'bg-white text-blue-950' : 'bg-blue-200 text-blue-900'
                    }`}>
                      {reservations.length}
                    </span>
                  </button>
                </div>

                {/* Instant Search Bar */}
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Recherche : client, tél, quartier..."
                    className="w-full pl-9 pr-8 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>

              {/* Compact 1-line Summary Capsule (Replaces giant 4 boxes) */}
              <div className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 overflow-x-auto gap-3">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-amber-800 flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5" />
                    {orders.length} Livraisons
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="font-black text-stone-900">{totalDeliveriesRevenue} MAD</span>
                  {pendingOrdersCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded font-black text-[10px]">
                      {pendingOrdersCount} en attente
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-blue-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {reservations.length} Réservations
                  </span>
                  {confirmedReservationsCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-900 rounded font-black text-[10px]">
                      {confirmedReservationsCount} confirmées
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ========================================================
                CONTINUOUS SCROLLABLE CONTENT BODY
            ======================================================== */}
            <div 
              ref={scrollContainerRef}
              id="admin-scroll-container"
              className="p-3 sm:p-6 space-y-8 flex-1"
            >
              
              {/* SECTION 1: COMMANDES DE LIVRAISON */}
              {(activeTab === 'all' || activeTab === 'deliveries') && (
                <section id="section-livraisons" className="space-y-4">
                  {/* Section Title & Sub-filters */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                          <span>Commandes de Livraison à Domicile</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                            {filteredOrders.length}
                          </span>
                        </h3>
                        <p className="text-xs text-stone-500">
                          Grillades sur braise préparées à Casablanca et envoyées aux clients
                        </p>
                      </div>
                    </div>

                    {/* Status filter for deliveries */}
                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
                      <button
                        onClick={() => setStatusFilterDeliveries('all')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                          statusFilterDeliveries === 'all'
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        Toutes ({orders.length})
                      </button>
                      <button
                        onClick={() => setStatusFilterDeliveries('en_attente')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                          statusFilterDeliveries === 'en_attente'
                            ? 'bg-amber-500 text-stone-950 font-black'
                            : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        }`}
                      >
                        ⏳ Attente ({pendingOrdersCount})
                      </button>
                      <button
                        onClick={() => setStatusFilterDeliveries('en_preparation')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                          statusFilterDeliveries === 'en_preparation'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                        }`}
                      >
                        👨‍🍳 Cuisine ({kitchenOrdersCount})
                      </button>
                      <button
                        onClick={() => setStatusFilterDeliveries('en_livraison')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                          statusFilterDeliveries === 'en_livraison'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200'
                        }`}
                      >
                        🛵 En route ({deliveryOrdersCount})
                      </button>
                      <button
                        onClick={() => setStatusFilterDeliveries('livree')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                          statusFilterDeliveries === 'livree'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        }`}
                      >
                        🏁 Livrées ({deliveredOrdersCount})
                      </button>
                    </div>
                  </div>

                  {/* Deliveries Content */}
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 px-4 max-w-md mx-auto bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
                      <div className="w-14 h-14 bg-amber-50 text-amber-800 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
                        <Bike className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-stone-900">
                        0 commande de livraison en attente
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Aucune fausse commande. Dès qu'un client passe commande sur son téléphone à Casablanca, elle apparaît ici instantanément avec notification sonore.
                      </p>
                    </div>
                  ) : viewMode === 'table' ? (
                    <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-xs">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-stone-100 text-stone-700 uppercase text-[11px] font-bold border-b border-stone-200">
                          <tr>
                            <th className="p-3">N° Commande</th>
                            <th className="p-3">Client & Contact</th>
                            <th className="p-3">Adresse & Quartier</th>
                            <th className="p-3">Grillades</th>
                            <th className="p-3">Total</th>
                            <th className="p-3">Statut</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {filteredOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-amber-50/40 transition-colors">
                              <td className="p-3 font-mono font-bold text-stone-900">
                                <span className="bg-stone-100 px-2 py-1 rounded-lg border border-stone-200">
                                  {ord.id}
                                </span>
                                <div className="text-[11px] text-stone-400 font-normal mt-1">{ord.date}</div>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-stone-900">{ord.customerName}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <a 
                                    href={`tel:${ord.customerPhone}`} 
                                    className="text-stone-600 hover:text-stone-900 flex items-center gap-1 font-mono text-xs"
                                  >
                                    <Phone className="w-3 h-3 text-stone-400" />
                                    <span>{ord.customerPhone}</span>
                                  </a>
                                  <a
                                    href={`https://wa.me/212${ord.customerPhone.replace(/^0/, '')}?text=Bonjour%20${encodeURIComponent(ord.customerName)},%20Restaurant%20Belanfa%20à%20propos%20de%20votre%20commande%20${ord.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5 text-xs bg-emerald-50 px-1.5 py-0.5 rounded"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span>WA</span>
                                  </a>
                                </div>
                              </td>
                              <td className="p-3 max-w-xs">
                                <div className="font-medium text-stone-800 text-xs">
                                  {ord.deliveryAddress || 'Casablanca'}
                                </div>
                                <span className="inline-block mt-1 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                                  {ord.deliveryDistrict || 'Casablanca'} (~{ord.deliveryDistanceKm || 1.5} km)
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="space-y-1">
                                  {ord.items.map((it, idx) => (
                                    <div key={idx} className="text-xs text-stone-700">
                                      <strong className="text-stone-900">{it.quantity}x</strong> {it.name}
                                      {it.notes && <span className="text-amber-800 text-[11px] ml-1 italic">({it.notes})</span>}
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="p-3 font-black text-amber-950 text-base whitespace-nowrap">
                                {ord.total} MAD
                              </td>
                              <td className="p-3">
                                <select
                                  value={ord.status}
                                  onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                                  className="text-xs font-bold rounded-xl px-2.5 py-1.5 border cursor-pointer bg-white"
                                >
                                  <option value="en_attente">⏳ En attente</option>
                                  <option value="en_preparation">👨‍🍳 En cuisine</option>
                                  <option value="en_livraison">🛵 En livraison</option>
                                  <option value="livree">🏁 Livrée</option>
                                  <option value="annulee">❌ Annulée</option>
                                </select>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setSelectedOrder(ord)}
                                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                    title="Voir le bon complet et imprimer"
                                  >
                                    <Receipt className="w-3.5 h-3.5" />
                                    <span>Ticket</span>
                                  </button>
                                  <button
                                    onClick={() => deleteOrder(ord.id)}
                                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="Supprimer la commande"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-5 rounded-3xl bg-white border-2 border-stone-200 hover:border-amber-400 shadow-sm transition-all space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-mono text-sm sm:text-base font-black bg-stone-900 text-white px-3 py-1.5 rounded-xl shadow-xs">
                                {ord.id}
                              </span>
                              <span className="text-xs sm:text-sm text-stone-500 font-medium">
                                📅 {ord.date}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300/80 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                                <span>{ord.deliveryDistrict || 'Casablanca Centre'} (~{ord.deliveryDistanceKm || 1.5} km)</span>
                              </span>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3">
                              <div className="text-right">
                                <span className="text-xs text-stone-400 uppercase font-bold block">Total</span>
                                <span className="text-xl sm:text-2xl font-black text-amber-950">
                                  {ord.total} MAD
                                </span>
                              </div>

                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Receipt className="w-4 h-4 text-amber-800" />
                                <span>Ticket Bon</span>
                              </button>

                              <button
                                onClick={() => deleteOrder(ord.id)}
                                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-amber-700" />
                                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">Client</span>
                                <span className="text-base font-bold text-stone-950">{ord.customerName}</span>
                              </div>

                              <div className="flex items-center gap-3 pt-1">
                                <a
                                  href={`tel:${ord.customerPhone}`}
                                  className="px-3 py-1.5 bg-white border border-stone-300 hover:border-stone-400 rounded-xl text-xs font-bold text-stone-800 flex items-center gap-1.5 shadow-xs transition-colors"
                                >
                                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                                  <span>{ord.customerPhone}</span>
                                </a>

                                <a
                                  href={`https://wa.me/212${ord.customerPhone.replace(/^0/, '')}?text=Bonjour%20${encodeURIComponent(ord.customerName)},%20Restaurant%20Belanfa%20à%20propos%20de%20votre%20commande%20${ord.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-amber-700" />
                                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">Adresse</span>
                              </div>
                              <div className="text-sm font-semibold text-stone-900 leading-snug">
                                {ord.deliveryAddress || 'Casablanca'}
                              </div>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((ord.deliveryAddress || '') + ', Casablanca')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:underline pt-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Itinéraire Google Maps</span>
                              </a>
                            </div>
                          </div>

                          <div className="space-y-2 pt-1">
                            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide flex items-center gap-1.5">
                              <Utensils className="w-3.5 h-3.5 text-stone-600" />
                              <span>Articles commandés ({ord.items.length}) :</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                              {ord.items.map((it, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-start justify-between gap-2 text-xs"
                                >
                                  <div>
                                    <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                                      <span className="w-5 h-5 bg-stone-900 text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0">
                                        {it.quantity}
                                      </span>
                                      <span>{it.name}</span>
                                    </div>
                                    {it.notes && (
                                      <p className="text-amber-800 text-[11px] font-medium mt-1 bg-amber-100/60 px-2 py-0.5 rounded-md inline-block">
                                        Instruction : {it.notes}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="font-extrabold text-stone-900 text-sm">
                                      {it.price * it.quantity} MAD
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                            <span className="text-xs font-bold text-stone-600">
                              Changer le statut :
                            </span>

                            <div className="flex flex-wrap items-center gap-1.5">
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'en_attente')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  ord.status === 'en_attente'
                                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                              >
                                ⏳ En attente
                              </button>

                              <button
                                onClick={() => updateOrderStatus(ord.id, 'en_preparation')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  ord.status === 'en_preparation'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                              >
                                👨‍🍳 En cuisine
                              </button>

                              <button
                                onClick={() => updateOrderStatus(ord.id, 'en_livraison')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  ord.status === 'en_livraison'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                              >
                                🛵 En livraison
                              </button>

                              <button
                                onClick={() => updateOrderStatus(ord.id, 'livree')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  ord.status === 'livree'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                              >
                                🏁 Livrée
                              </button>

                              <button
                                onClick={() => updateOrderStatus(ord.id, 'annulee')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  ord.status === 'annulee'
                                    ? 'bg-red-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                              >
                                ❌ Annulée
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* SECTION 2: RÉSERVATIONS DE TABLES (NATURALLY REACHABLE BY SCROLLING DOWN) */}
              {(activeTab === 'all' || activeTab === 'reservations') && (
                <section id="section-reservations" className="space-y-4 pt-4 border-t-4 border-stone-200">
                  {/* Section Title & Sub-filters */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                          <span>Réservations de Tables au Restaurant</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300">
                            {filteredReservations.length}
                          </span>
                        </h3>
                        <p className="text-xs text-stone-500">
                          Terrasse, Coin Cheminée et Salons cosy réservés par les clients
                        </p>
                      </div>
                    </div>

                    {/* Status filter for reservations */}
                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
                      <button
                        onClick={() => setStatusFilterReservations('all')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                          statusFilterReservations === 'all'
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        Toutes ({reservations.length})
                      </button>
                      <button
                        onClick={() => setStatusFilterReservations('confirmee')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                          statusFilterReservations === 'confirmee'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                        }`}
                      >
                        📅 Confirmées ({confirmedReservationsCount})
                      </button>
                      <button
                        onClick={() => setStatusFilterReservations('honoree')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                          statusFilterReservations === 'honoree'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        }`}
                      >
                        ✨ Honorées ({honoredReservationsCount})
                      </button>
                      <button
                        onClick={() => setStatusFilterReservations('annulee')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                          statusFilterReservations === 'annulee'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-900 hover:bg-red-200'
                        }`}
                      >
                        ❌ Annulées ({cancelledReservationsCount})
                      </button>
                    </div>
                  </div>

                  {/* Reservations Content */}
                  {filteredReservations.length === 0 ? (
                    <div className="text-center py-12 px-4 max-w-md mx-auto bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
                      <div className="w-14 h-14 bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center mx-auto border border-blue-200">
                        <Calendar className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-stone-900">
                        0 réservation de table en cours
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Aucune fausse réservation. Dès qu'un client réserve une table sur le site pour la terrasse ou le salon, elle apparaît directement ici.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredReservations.map((res) => (
                        <div
                          key={res.id || res.code}
                          className="p-5 rounded-3xl bg-white border-2 border-stone-200 hover:border-blue-400 shadow-sm transition-all space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-mono text-sm sm:text-base font-black bg-blue-950 text-blue-200 px-3 py-1.5 rounded-xl border border-blue-800">
                                {res.code}
                              </span>
                              <span className="text-base font-bold text-stone-900">
                                {res.customerName}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                                👥 {res.guests} personnes
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-800 capitalize">
                                🛋️ Zone : {res.seatingZone.replace('_', ' ')}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedReservation(res)}
                                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Fiche Complète</span>
                              </button>

                              <button
                                onClick={() => deleteReservation(res.id || res.code)}
                                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                title="Supprimer la réservation"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
                            <div>
                              <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Date & Heure</span>
                              <span className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span>{res.date} à <strong>{res.time}</strong></span>
                              </span>
                            </div>

                            <div>
                              <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Contact Client</span>
                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:${res.customerPhone}`}
                                  className="font-bold text-stone-900 hover:underline flex items-center gap-1 font-mono text-sm"
                                >
                                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                                  <span>{res.customerPhone}</span>
                                </a>
                                <a
                                  href={`https://wa.me/212${res.customerPhone.replace(/^0/, '')}?text=Bonjour%20${encodeURIComponent(res.customerName)},%20Restaurant%20Belanfa%20à%20propos%20de%20votre%20réservation%20${res.code}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 text-xs bg-emerald-50 px-2 py-0.5 rounded-md"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            </div>

                            <div>
                              <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Demandes Particulières</span>
                              <span className="text-xs text-stone-700 italic">
                                {res.specialRequests ? `"${res.specialRequests}"` : 'Aucune demande spécifique'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <span className="text-xs font-bold text-stone-600">
                              Statut de la table :
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateReservationStatus(res.id || res.code, 'confirmee')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  res.status === 'confirmee'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                              >
                                📅 Confirmée
                              </button>

                              <button
                                onClick={() => updateReservationStatus(res.id || res.code, 'honoree')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  res.status === 'honoree' || res.status === 'terminee'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                              >
                                ✨ Table Honorée
                              </button>

                              <button
                                onClick={() => updateReservationStatus(res.id || res.code, 'annulee')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  res.status === 'annulee'
                                    ? 'bg-red-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                              >
                                ❌ Annulée
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

            </div>

            {/* Quick Floating Jump Button in Bottom Right Corner (Visible on mobile & desktop) */}
            <div className="fixed bottom-6 right-3 sm:right-6 z-40 flex flex-col gap-2">
              <button
                onClick={() => {
                  if (activeTab === 'deliveries') setActiveTab('all');
                  setTimeout(() => scrollToSection('section-reservations'), 50);
                }}
                className="px-3 sm:px-3.5 py-2 sm:py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer hover:scale-105 border border-blue-500"
                title="Défiler vers le bas jusqu'aux réservations"
              >
                <ArrowDownCircle className="w-4 h-4 text-blue-200" />
                <span>Réservations ({reservations.length}) ↓</span>
              </button>

              <button
                onClick={() => {
                  if (activeTab === 'reservations') setActiveTab('all');
                  setTimeout(() => scrollToSection('section-livraisons'), 50);
                }}
                className="px-3 sm:px-3.5 py-2 sm:py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer hover:scale-105 border border-stone-700"
                title="Remonter aux livraisons"
              >
                <ArrowUpCircle className="w-4 h-4 text-amber-400" />
                <span>Livraisons ({orders.length}) ↑</span>
              </button>
            </div>

            {/* Footer Status Bar */}
            <footer className="p-3 bg-white border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-stone-500 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Session Direction : <strong>admin@belanfa.ma</strong></span>
              </div>
              <div className="flex items-center gap-4">
                <span>Restaurant Belanfa · 26 Rue Driss Lahrizi, Casablanca</span>
                <span className="font-semibold text-stone-700">Tél : +212 5 22 20 20 20</span>
              </div>
            </footer>

          </div>
        )}

      </div>

      {/* ========================================================
          FULL-SCREEN DETAIL & PRINT MODAL FOR ORDERS
      ======================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col min-h-0 overflow-hidden shadow-2xl border border-stone-300">
            <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Bon de Commande #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center hover:bg-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 bg-stone-50" id="order-print-sheet">
              <div className="text-center pb-4 border-b border-stone-200 space-y-1">
                <h2 className="font-serif text-2xl font-bold text-stone-900">RESTAURANT BELANFA</h2>
                <p className="text-xs text-stone-500">26 Rue Driss Lahrizi, Casablanca · Tél : 05 22 20 20 20</p>
                <div className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-stone-900 text-white">
                  COMMANDE #{selectedOrder.id} · {selectedOrder.date}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Destinataire</div>
                <div className="text-lg font-bold text-stone-900">{selectedOrder.customerName}</div>
                <div className="text-sm font-semibold text-stone-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-stone-400" />
                  <span>{selectedOrder.customerPhone}</span>
                </div>
                <div className="text-sm text-stone-800 flex items-start gap-2 pt-1">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{selectedOrder.deliveryAddress || '26 Rue Driss Lahrizi, Casablanca'}</span>
                </div>
                <div className="text-xs text-amber-800 font-bold">
                  Quartier : {selectedOrder.deliveryDistrict || 'Casablanca'} (~{selectedOrder.deliveryDistanceKm || 1.5} km)
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <div className="p-3 bg-stone-100 text-xs font-bold text-stone-700 uppercase tracking-wider border-b border-stone-200">
                  Détail de la commande cuisine
                </div>
                <div className="divide-y divide-stone-100 p-3 space-y-2">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-start pt-2">
                      <div>
                        <div className="text-sm font-bold text-stone-900">
                          <span className="w-5 h-5 bg-amber-950 text-white rounded-md inline-flex items-center justify-center text-xs mr-2">
                            {it.quantity}x
                          </span>
                          {it.name}
                        </div>
                        {it.notes && (
                          <div className="text-xs text-amber-800 font-medium pl-7 italic">
                            Note : {it.notes}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-black text-stone-900 whitespace-nowrap">
                        {it.price * it.quantity} MAD
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-amber-50 border-t border-amber-200 flex justify-between items-center">
                  <span className="text-sm font-bold text-amber-950">TOTAL À ENCAISSER</span>
                  <span className="text-2xl font-black text-amber-950">{selectedOrder.total} MAD</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wide">Modifier le statut de la commande :</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'en_attente')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                      selectedOrder.status === 'en_attente' ? 'bg-amber-500 text-stone-950' : 'bg-white border text-stone-700'
                    }`}
                  >
                    ⏳ En attente
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'en_preparation')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                      selectedOrder.status === 'en_preparation' ? 'bg-blue-600 text-white' : 'bg-white border text-stone-700'
                    }`}
                  >
                    👨‍🍳 En cuisine
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'en_livraison')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                      selectedOrder.status === 'en_livraison' ? 'bg-indigo-600 text-white' : 'bg-white border text-stone-700'
                    }`}
                  >
                    🛵 En livraison
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'livree')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                      selectedOrder.status === 'livree' ? 'bg-emerald-600 text-white' : 'bg-white border text-stone-700'
                    }`}
                  >
                    🏁 Livrée
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={printTicket}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer le ticket</span>
              </button>

              <a
                href={`https://wa.me/212${selectedOrder.customerPhone.replace(/^0/, '')}?text=Bonjour%20${encodeURIComponent(selectedOrder.customerName)},%20Restaurant%20Belanfa%20à%20propos%20de%20votre%20commande%20${selectedOrder.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Client</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DETAIL MODAL FOR RESERVATIONS
      ======================================================== */}
      {selectedReservation && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col min-h-0 overflow-hidden shadow-2xl border border-stone-300">
            <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Fiche Réservation #{selectedReservation.code}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReservation(null)}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center hover:bg-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto min-h-0 bg-stone-50">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Client</div>
                <div className="text-xl font-bold text-stone-900">{selectedReservation.customerName}</div>
                <div className="text-sm font-semibold text-stone-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-stone-400" />
                  <span>{selectedReservation.customerPhone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-xs text-stone-400 font-bold block">Date & Heure</span>
                  <span className="text-sm font-bold text-stone-900">
                    {selectedReservation.date} à {selectedReservation.time}
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-xs text-stone-400 font-bold block">Couverts</span>
                  <span className="text-sm font-bold text-stone-900">
                    {selectedReservation.guests} personnes
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-xs text-stone-400 font-bold block">Zone Sélectionnée</span>
                <span className="text-sm font-bold text-stone-900 capitalize">
                  🛋️ {selectedReservation.seatingZone.replace('_', ' ')}
                </span>
                {selectedReservation.specialRequests && (
                  <div className="pt-2 text-xs text-amber-900 italic">
                    <strong>Note du client :</strong> "{selectedReservation.specialRequests}"
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
              <a
                href={`https://wa.me/212${selectedReservation.customerPhone.replace(/^0/, '')}?text=Bonjour%20${encodeURIComponent(selectedReservation.customerName)},%20Restaurant%20Belanfa%20confirme%20votre%20réservation%20de%20table%20${selectedReservation.code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Client</span>
              </a>

              <button
                onClick={() => setSelectedReservation(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
