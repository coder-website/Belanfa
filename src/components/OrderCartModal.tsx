import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Bike, 
  CheckCircle2, 
  Tag, 
  ArrowRight, 
  MessageCircle, 
  AlertTriangle,
  MapPin,
  Clock,
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';
import { CartItem, Order } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { 
  CASABLANCA_DELIVERY_DISTRICTS, 
  DeliveryDistrict, 
  MAX_DELIVERY_DISTANCE_KM, 
  RESTAURANT_DELIVERY_INFO 
} from '../data/deliveryZones';
import { BelanfaLogo } from './BelanfaLogo';

interface OrderCartModalProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const OrderCartModal: React.FC<OrderCartModalProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onClose,
  onOrderCompleted,
}) => {
  // Mode is strictly locked to Livraison Casablanca
  const diningType = 'livraison';
  
  // Delivery District & Address states
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('centre_ville');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [freeDelivery, setFreeDelivery] = useState<boolean>(false);
  const [promoAppliedMsg, setPromoAppliedMsg] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const selectedDistrict: DeliveryDistrict = 
    CASABLANCA_DELIVERY_DISTRICTS.find((d) => d.id === selectedDistrictId) || 
    CASABLANCA_DELIVERY_DISTRICTS[0];

  const isEligibleZone = selectedDistrict.isEligible && selectedDistrict.distanceKm <= MAX_DELIVERY_DISTANCE_KM;

  const subtotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const baseDeliveryFee = RESTAURANT_DELIVERY_INFO.deliveryFee;
  const actualDeliveryFee = freeDelivery ? 0 : baseDeliveryFee;
  const grandTotal = Math.max(0, subtotal - discountAmount + actualDeliveryFee);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'BELANFA10') {
      setDiscountPercent(10);
      setPromoAppliedMsg('Code BELANFA10 appliqué : -10% sur votre commande !');
    } else if (code === 'FIDELITE20') {
      setDiscountPercent(20);
      setPromoAppliedMsg('Récompense Fidélité : -20% appliqués avec succès !');
    } else if (code === 'FIDELITE-THE') {
      setPromoAppliedMsg('Récompense Fidélité : 1 Thé à la menthe pignons offert joint à votre colis !');
    } else if (code === 'FIDELITE-DESSERT') {
      setPromoAppliedMsg('Récompense Fidélité : 1 Dessert maison offert joint à votre colis !');
    } else if (code === 'FIDELITE-ROYAL') {
      setDiscountPercent(25);
      setFreeDelivery(true);
      setPromoAppliedMsg('Récompense Fidélité Or : -25% et livraison offerte !');
    } else if (code === 'MIDI69') {
      setDiscountPercent(10);
      setPromoAppliedMsg('Formule Déjeuner appliquée (-10%)');
    } else {
      alert("Code promo ou fidélité invalide. Vérifiez l'orthographe dans votre Espace Fidélité.");
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!isEligibleZone) {
      alert(
        `Désolé, la livraison est impossible dans cette zone (${selectedDistrict.name}). Pour garantir des grillades chaudes et savoureuses, nous livrons uniquement dans un rayon strict de 2 à 3 km autour du 26 Rue Driss Lahrizi (Centre-Ville).`
      );
      return;
    }

    if (!streetAddress.trim() || streetAddress.trim().length < 5) {
      alert('Veuillez préciser une adresse exacte avec rue, numéro d’immeuble et étage à Casablanca.');
      return;
    }

    // Check if user just typed generic "casa" or "casablanca" without specifics
    const lower = streetAddress.trim().toLowerCase();
    if (lower === 'casa' || lower === 'casablanca' || lower === 'casablanca centre') {
      alert('Veuillez renseigner votre rue exacte et votre numéro d’immeuble/étage (ex: 12 Rue Chaouia, 3ème étage).');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Veuillez renseigner votre nom et votre numéro de téléphone marocain.');
      return;
    }

    setSubmitting(true);
    const orderId = 'CMD-' + Math.floor(1000 + Math.random() * 9000);
    const fullDeliveryAddress = `${streetAddress.trim()}, Quartier ${selectedDistrict.name}, Casablanca`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: cart.map((c) => ({
        name: c.item.name,
        quantity: c.quantity,
        price: c.item.price,
        notes: c.notes,
      })),
      total: grandTotal,
      diningType: 'livraison',
      deliveryDistrict: selectedDistrict.name,
      deliveryDistanceKm: selectedDistrict.distanceKm,
      deliveryAddress: fullDeliveryAddress,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      status: 'en_attente',
      createdAt: Date.now(),
    };

    (async () => {
      let finalOrder = newOrder;
      try {
        // Send to Express backend API (real-time server for all phones)
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder),
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData && resData.order) {
            finalOrder = resData.order;
          }
        }
      } catch (err) {
        console.warn('Backend sync note:', err);
      }

      // Save order in client phone local history
      try {
        const stored = localStorage.getItem('belanfa_order_history');
        const existing = stored ? JSON.parse(stored) : [];
        const cleanExisting = existing.filter((o: any) => !['CMD-4091', 'CMD-4092', 'CMD-4093'].includes(o.id));
        localStorage.setItem('belanfa_order_history', JSON.stringify([finalOrder, ...cleanExisting]));
      } catch (err) {
        console.error(err);
      }

      setSubmitting(false);
      setCompletedOrder(finalOrder);
      onOrderCompleted(finalOrder);
      onClearCart();
    })();
  };

  const getWhatsAppOrderText = (ord: Order) => {
    const itemsList = ord.items
      .map((i) => `• ${i.quantity}x ${i.name} (${i.price * i.quantity} MAD)${i.notes ? ` [${i.notes}]` : ''}`)
      .join('\n');

    const message = `Bonjour Restaurant Belanfa ! Voici ma commande pour livraison :
📦 Réf Commande : ${ord.id}
👤 Client : ${ord.customerName}
📞 Tél : ${ord.customerPhone}
📍 Quartier : ${ord.deliveryDistrict || 'Centre Casablanca'} (~${ord.deliveryDistanceKm || 1.5} km)
🏠 Adresse exacte : ${ord.deliveryAddress}
${deliveryNotes ? `📝 Instructions livreur : ${deliveryNotes}\n` : ''}
Articles commandés :
${itemsList}

💰 Total à régler à la livraison : ${ord.total} MAD (Paiement en espèces à réception)
Merci de me confirmer le départ du coursier !`;

    return encodeURIComponent(message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-stone-200">
        
        {/* Header with Belanfa Logo */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <BelanfaLogo size="sm" showText={false} />
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Commande & Livraison
              </h3>
              <p className="text-[11px] text-stone-500">
                Grillades au feu de bois · Casablanca (Rayon 2 à 3 km max)
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

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-5">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Commande en Cuisine !
              </h3>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Votre commande <strong>#{completedOrder.id}</strong> est prise en charge par notre brigade. Nos coursiers interviennent rapidement.
              </p>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-left text-xs space-y-2.5">
                <div className="flex justify-between font-semibold text-stone-900 pb-2 border-b border-stone-200">
                  <span>Numéro de commande :</span>
                  <span className="text-amber-800 font-mono">{completedOrder.id}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Destinataire :</span>
                  <span className="font-medium text-stone-900">{completedOrder.customerName} ({completedOrder.customerPhone})</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Secteur de livraison :</span>
                  <span className="font-semibold text-stone-900">{completedOrder.deliveryDistrict} (~{completedOrder.deliveryDistanceKm} km)</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Adresse précise :</span>
                  <span className="text-right text-stone-800 font-medium max-w-[220px] truncate">{completedOrder.deliveryAddress}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Délai estimé :</span>
                  <span className="text-emerald-700 font-bold">{selectedDistrict.estimatedTime}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold pt-2 border-t border-stone-200">
                  <span>Total à payer au livreur :</span>
                  <span className="text-amber-800 text-sm font-extrabold">{completedOrder.total} MAD</span>
                </div>
              </div>

              {/* Action: WhatsApp Confirmation */}
              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${getWhatsAppOrderText(completedOrder)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Notifier le restaurant sur WhatsApp (06 60 14 00 17)
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Retour au site
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart View */
            <div className="text-center py-16 space-y-3">
              <Bike className="w-12 h-12 text-stone-300 mx-auto" />
              <h4 className="font-semibold text-stone-700 text-sm">Votre panier est vide</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Découvrez nos brochettes au charbon de bois, nos tagines fassis et nos pizzas artisanales pour vous faire livrer à Casablanca.
              </p>
            </div>
          ) : (
            /* Normal Cart and Checkout Form */
            <form onSubmit={handleCheckout} className="space-y-5">
              
              {/* Items List */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold text-stone-800">
                  <span>Plats sélectionnés ({cart.length})</span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-stone-400 hover:text-red-600 text-[11px] font-normal cursor-pointer"
                  >
                    Vider le panier
                  </button>
                </div>

                {cart.map((cartItem) => (
                  <div
                    key={cartItem.item.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80 gap-3"
                  >
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {cartItem.item.name}
                      </h4>
                      <span className="text-xs font-extrabold text-amber-800 block">
                        {cartItem.item.price * cartItem.quantity} MAD
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-stone-900 w-4 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(cartItem.item.id)}
                        className="w-6 h-6 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center ml-1 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Zone Notice & Restriction (2-3 km strictly) */}
              <div className="rounded-2xl bg-amber-50/80 border border-amber-300/80 p-3.5 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      Livraison Express Exclusivement à Casablanca
                      <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded text-[9px] font-bold">
                        Rayon 2 à 3 km max
                      </span>
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-snug mt-0.5">
                      Pour garantir que nos grillades restent fumantes et croustillantes, notre service de livraison est <strong>strictement limité à 3 km maximum</strong> autour du restaurant (26 Rue Driss Lahrizi).
                    </p>
                  </div>
                </div>
              </div>

              {/* District Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  1. Choisissez votre quartier à Casablanca :
                </label>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => setSelectedDistrictId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 font-medium text-stone-900 cursor-pointer"
                >
                  <optgroup label="Quartiers éligibles (proximité 2 à 3 km) ✅">
                    {CASABLANCA_DELIVERY_DISTRICTS.filter((d) => d.isEligible).map((dist) => (
                      <option key={dist.id} value={dist.id}>
                        {dist.name} (~{dist.distanceKm} km) - Éligible ✅
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Quartiers hors de portée (> 3 km) ❌">
                    {CASABLANCA_DELIVERY_DISTRICTS.filter((d) => !d.isEligible).map((dist) => (
                      <option key={dist.id} value={dist.id}>
                        {dist.name} - Non desservi ❌
                      </option>
                    ))}
                  </optgroup>
                </select>

                {/* Eligibility feedback alert */}
                {isEligibleZone ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Quartier éligible</strong> (~{selectedDistrict.distanceKm} km du restaurant)
                      </span>
                    </div>
                    <span className="font-semibold text-[10px] bg-emerald-100 px-2 py-0.5 rounded-md">
                      Délai : {selectedDistrict.estimatedTime}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Quartier trop éloigné ({selectedDistrict.distanceKm} km)</span>
                    </div>
                    <p className="text-[10px] text-red-700 leading-snug">
                      Ce secteur dépasse notre limite de 3 km. Pour préserver la qualité de nos viandes au feu de bois, nous ne pouvons pas livrer au-delà de 3 km du 26 Rue Driss Lahrizi.
                    </p>
                  </div>
                )}
              </div>

              {/* Exact Street Address */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-800">
                  2. Adresse précise (Rue, N° Immeuble, Étage) * :
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Ex: 14 Rue Chaouia, Imm. B, 2ème étage, Apt 5..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>
                <span className="text-[10px] text-stone-500 block">
                  Indiquez un repère clair pour le livreur (ne mettez pas juste "Casa").
                </span>
              </div>

              {/* Instructions for delivery person */}
              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">
                  Instructions coursier (digicode, sonnette, etc.) :
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Ex: Sonner à l'interphone Benjelloun, appeler à l'arrivée..."
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              {/* Customer Contact */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    Votre Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Amine Tazi"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="06 XX XX XX XX"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>
              </div>

              {/* Promo / Loyalty Code */}
              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">
                  Code Promo ou Récompense Fidélité :
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Ex: BELANFA10, FIDELITE20..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs uppercase bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Appliquer
                  </button>
                </div>
                {promoAppliedMsg && (
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                    ✓ {promoAppliedMsg}
                  </p>
                )}
              </div>

              {/* Bill Breakdown */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Sous-total articles :</span>
                  <span className="font-semibold text-stone-900">{subtotal} MAD</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Remise appliquée :</span>
                    <span>-{discountAmount} MAD</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frais de livraison ({selectedDistrict.name}) :</span>
                  <span className="font-semibold text-stone-900">
                    {freeDelivery ? 'Offert' : `${baseDeliveryFee} MAD`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-200">
                  <span>Total TTC :</span>
                  <span className="text-amber-800 text-base font-extrabold">{grandTotal} MAD</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !isEligibleZone}
                className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isEligibleZone && !submitting
                    ? 'bg-amber-800 hover:bg-amber-700 text-white shadow-amber-900/30 cursor-pointer'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <span>Transmission en cours...</span>
                ) : !isEligibleZone ? (
                  <span>Quartier non éligible (Rayon &gt; 3 km)</span>
                ) : (
                  <>
                    <span>Valider ma Livraison ({grandTotal} MAD)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Paiement en espèces à la livraison · Viandes certifiées fraîches</span>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
