import React, { useState } from 'react';
import { 
  X, 
  History, 
  Clock, 
  CheckCircle2, 
  ShoppingBag, 
  Repeat, 
  Trash2,
  ChefHat,
  Award,
  Sparkles,
  Gift,
  Copy,
  Check,
  ChevronRight,
  Coffee,
  Cake,
  Percent,
  Crown,
  Truck
} from 'lucide-react';
import { Order } from '../types';
import { 
  calculateLoyaltyPoints, 
  getCurrentTier, 
  LOYALTY_REWARDS, 
  LOYALTY_TIERS 
} from '../data/loyaltyData';
import { BelanfaLogo } from './BelanfaLogo';

interface OrderHistoryModalProps {
  orders: Order[];
  onReorder: (order: Order) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  orders,
  onReorder,
  onClearHistory,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'loyalty' | 'orders'>('loyalty');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const points = calculateLoyaltyPoints(orders);
  const currentTier = getCurrentTier(points);

  // Next reward calculation
  const nextReward = LOYALTY_REWARDS.find((r) => r.pointsRequired > points) || LOYALTY_REWARDS[LOYALTY_REWARDS.length - 1];
  const pointsToNext = Math.max(0, nextReward.pointsRequired - points);
  const progressPercent = Math.min(100, Math.round((points / nextReward.pointsRequired) * 100));

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'en_attente':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            En attente
          </span>
        );
      case 'en_preparation':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <ChefHat className="w-3 h-3 animate-spin" /> En cuisine
          </span>
        );
      case 'en_livraison':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
            <Truck className="w-3 h-3" /> En cours de livraison
          </span>
        );
      case 'prete':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Prête
          </span>
        );
      case 'livree':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
            Livrée avec succès
          </span>
        );
      case 'annulee':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
            Annulée
          </span>
        );
    }
  };

  const renderRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee': return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'Cake': return <Cake className="w-4 h-4 text-pink-500" />;
      case 'Percent': return <Percent className="w-4 h-4 text-emerald-500" />;
      case 'Crown': return <Crown className="w-4 h-4 text-yellow-500" />;
      default: return <Gift className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header with Belanfa Logo */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <BelanfaLogo size="sm" showText={false} />
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                Espace Fidélité & Commandes
              </h3>
              <p className="text-[11px] text-stone-500">
                Restaurant Belanfa · 26 Rue Driss Lahrizi, Casablanca
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'loyalty'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>Belanfa Loyalty ({points} pts)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <History className="w-4 h-4 text-stone-600" />
            <span>Mes Commandes ({orders.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'loyalty' ? (
            /* ========================================================
               BELANFA LOYALTY SECTION
            ======================================================== */
            <div className="space-y-6">
              
              {/* VIP Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 p-6 text-white shadow-xl border border-amber-500/30">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2.5">
                    <img src="/images/belanfa-logo.svg" alt="Belanfa" className="w-9 h-9 drop-shadow" />
                    <div>
                      <span className="font-serif text-sm font-bold tracking-wider text-amber-400 block uppercase">
                        Belanfa Club Gourmand
                      </span>
                      <span className="text-[10px] text-stone-400">Programme Privilège Casablanca</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                    {currentTier.name}
                  </span>
                </div>

                <div className="space-y-1 mb-6">
                  <span className="text-[11px] text-stone-400 block font-medium">Solde de Points Cumulés</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold font-serif text-amber-400 tracking-tight">
                      {points}
                    </span>
                    <span className="text-xs font-semibold text-stone-300 uppercase tracking-widest">
                      Points Belanfa
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-200/80 pt-0.5">
                    ★ 1 MAD dépensé = 1 point fidélité crédité automatiquement
                  </p>
                </div>

                {/* Progress Bar to next reward */}
                <div className="space-y-1.5 pt-2 border-t border-stone-800">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-300">
                      Prochaine récompense : <strong>{nextReward.title}</strong>
                    </span>
                    <span className="font-bold text-amber-400">
                      {points >= nextReward.pointsRequired ? 'Débloqué !' : `Encore ${pointsToNext} pts`}
                    </span>
                  </div>
                  <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden border border-stone-700">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-amber-300 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Perks of current tier */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Vos Avantages Membre ({currentTier.name})
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {currentTier.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-amber-900/90 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Rewards Catalog */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-600" />
                    Récompenses à Débloquer & Utiliser
                  </h4>
                  <span className="text-[11px] text-stone-500">Valable en livraison & restaurant</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {LOYALTY_REWARDS.map((reward) => {
                    const isUnlocked = points >= reward.pointsRequired;
                    return (
                      <div
                        key={reward.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isUnlocked
                            ? 'bg-white border-amber-300 shadow-xs hover:border-amber-400'
                            : 'bg-stone-50 border-stone-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isUnlocked ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-400'
                          }`}>
                            {renderRewardIcon(reward.icon)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-bold text-stone-900">
                                {reward.title}
                              </h5>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                                {reward.pointsRequired} pts
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {reward.description}
                            </p>
                          </div>
                        </div>

                        {isUnlocked ? (
                          <button
                            onClick={() => handleCopyCode(reward.code)}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
                            title="Copier le code promo de cette récompense"
                          >
                            {copiedCode === reward.code ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-white" />
                                <span>Copié !</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{reward.code}</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-[10px] text-stone-400 font-medium shrink-0 px-2 py-1 bg-stone-100 rounded-lg">
                            Verrouillé
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            /* ========================================================
               PAST ORDERS SECTION
            ======================================================== */
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                  <h4 className="font-semibold text-stone-700 text-sm">Aucune commande enregistrée</h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Vos prochaines commandes en livraison à Casablanca apparaîtront ici avec vos points fidélité crédités.
                  </p>
                </div>
              ) : (
                orders.map((order) => {
                  const pointsEarned = Math.round(order.total);
                  return (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50/80 hover:border-amber-400/50 transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-stone-900">
                              #{order.id}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <span className="text-[10px] text-stone-500 block mt-0.5">{order.date}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-extrabold text-amber-800">
                            {order.total} MAD
                          </span>
                          <span className="text-[10px] font-bold text-amber-600 block">
                            +{pointsEarned} pts fidélité
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-2.5 bg-white rounded-xl border border-stone-100 text-xs space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-stone-700">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-medium text-stone-900">
                              {item.price * item.quantity} MAD
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery address info */}
                      {order.deliveryAddress && (
                        <div className="text-[11px] text-stone-600 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-stone-400" />
                          <span className="truncate">Livraison : {order.deliveryAddress}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                        <span className="text-[11px] text-stone-500">
                          Client : {order.customerName}
                        </span>
                        <button
                          onClick={() => {
                            onReorder(order);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          <Repeat className="w-3 h-3" />
                          <span>Recommander</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 flex justify-between items-center text-xs">
          {orders.length > 0 && activeTab === 'orders' ? (
            <button
              onClick={onClearHistory}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Effacer l'historique
            </button>
          ) : (
            <span className="text-[11px] text-stone-500">
              Programme Belanfa Loyalty · Casablanca
            </span>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-medium cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
