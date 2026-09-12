import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Flame, 
  Sun, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  Share2,
  Copy,
  Check,
  Send,
  Heart,
  Compass,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { SeatingZone, Reservation } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface ReservationSectionProps {
  onReservationComplete?: (reservation: Reservation) => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ onReservationComplete }) => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('20:00');
  const [guests, setGuests] = useState(2);
  const [zone, setZone] = useState<SeatingZone>('terrasse');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const availableTimes = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
  ];

  const zonesConfig: { id: SeatingZone; label: string; icon: any; desc: string }[] = [
    {
      id: 'terrasse',
      label: 'Terrasse Extérieure',
      icon: Sun,
      desc: 'Bistrot au grand air, rue piétonne Driss Lahrizi',
    },
    {
      id: 'cheminee',
      label: 'Coin Cheminée',
      icon: Flame,
      desc: 'Ambiance feutrée, chaleureuse et romantique',
    },
    {
      id: 'salon_cosy',
      label: 'Salon Marocain Cosy',
      icon: Sparkles,
      desc: 'Banquettes velours et lumières tamisées',
    },
    {
      id: 'salle_principale',
      label: 'Salle Principale & Four',
      icon: Users,
      desc: 'Sol en damier vintage et vue sur le four à pizza',
    },
  ];

  const getReservationShareText = (res: Reservation) => {
    const zoneLabels: Record<string, string> = {
      terrasse: 'Terrasse Extérieure',
      cheminee: 'Coin Cheminée',
      salon_cosy: 'Salon Marocain Cosy',
      salle_principale: 'Salle Principale',
      ecran_sport: 'Salle Intérieure'
    };

    return `🍽️ Réservation confirmée au Restaurant Belanfa Casablanca !
📍 Adresse : 26 Rue Driss Lahrizi (Centre-Ville Casablanca)
📌 Code : ${res.code}
👤 Réservé pour : ${res.customerName}
📅 Date : ${res.date} à ${res.time}
👥 Nombre de personnes : ${res.guests}
🛋️ Emplacement : ${zoneLabels[res.seatingZone] || res.seatingZone}
📞 Contact restaurant : 06 60 14 00 17

Hâte de vous retrouver autour de nos grillades au feu de bois ! 🔥`;
  };

  const handleShareReservation = async (res: Reservation, medium?: 'whatsapp' | 'sms' | 'copy') => {
    const text = getReservationShareText(res);

    if (medium === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      return;
    }

    if (medium === 'sms') {
      window.open(`sms:?&body=${encodeURIComponent(text)}`, '_blank');
      return;
    }

    if (medium === 'copy') {
      navigator.clipboard?.writeText(text);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
      return;
    }

    // Default: try native share if available, otherwise toggle share options
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Réservation Restaurant Belanfa Casablanca',
          text: text,
        });
      } catch (err) {
        setShowShareOptions(true);
      }
    } else {
      setShowShareOptions((prev) => !prev);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Veuillez renseigner votre nom et numéro de téléphone.');
      return;
    }

    setLoading(true);

    const bookingCode = 'BLF-' + Math.floor(1000 + Math.random() * 9000);
    const newReservation: Reservation = {
      id: 'res-' + Date.now(),
      code: bookingCode,
      date,
      time,
      guests,
      seatingZone: zone,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      specialRequests: notes,
      status: 'confirmee',
      createdAt: new Date().toISOString(),
    };

    (async () => {
      let finalReservation = newReservation;
      try {
        // Send to Express backend API (real-time server for all phones)
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReservation),
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData && resData.reservation) {
            finalReservation = resData.reservation;
          }
        }
      } catch (err) {
        console.warn('Backend reservation sync note:', err);
      }

      // Save in localStorage & purge any old mock IDs
      try {
        const stored = localStorage.getItem('belanfa_reservations');
        const existing = stored ? JSON.parse(stored) : [];
        const cleanExisting = existing.filter((r: any) => !['res-101', 'res-102', 'res-103', 'BLF-8821', 'BLF-7734', 'BLF-5590'].includes(r.id || r.code));
        localStorage.setItem('belanfa_reservations', JSON.stringify([finalReservation, ...cleanExisting]));
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
      setConfirmedReservation(finalReservation);
      if (onReservationComplete) {
        onReservationComplete(finalReservation);
      }
    })();
  };

  const getWhatsAppMessage = (res: Reservation) => {
    const zoneLabels: Record<string, string> = {
      terrasse: 'Terrasse Extérieure',
      cheminee: 'Coin Cheminée',
      salon_cosy: 'Salon Marocain Cosy',
      salle_principale: 'Salle Principale',
      ecran_sport: 'Salle Intérieure'
    };

    const text = `Bonjour Restaurant Belanfa ! Je viens de réserver en ligne :
📌 Réf : ${res.code}
👤 Nom : ${res.customerName}
📞 Tél : ${res.customerPhone}
📅 Date : ${res.date} à ${res.time}
👥 Nombre de personnes : ${res.guests}
📍 Emplacement : ${zoneLabels[res.seatingZone] || res.seatingZone}
${res.specialRequests ? `📝 Notes : ${res.specialRequests}` : ''}

Merci de me confirmer la réservation !`;

    return encodeURIComponent(text);
  };

  return (
    <section id="reservation" className="py-16 sm:py-20 bg-stone-900 text-white relative overflow-hidden">
      {/* Subtle decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <Calendar className="w-3.5 h-3.5" />
            Réservation Instantanée sans Frais
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
            Réserver Votre Table à Belanfa
          </h2>
          <p className="text-stone-300 text-sm sm:text-base">
            Choisissez votre date, votre créneau horaire et votre ambiance favorite : terrasse ensoleillée, coin cheminée chaleureux ou salon feutré.
          </p>
        </div>

        {confirmedReservation ? (
          /* Confirmation State */
          <div className="max-w-xl mx-auto bg-stone-800/95 border border-amber-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Réservation Validée avec Succès
            </span>
            <h3 className="font-serif text-2xl font-bold text-white mt-1 mb-2">
              Merci, {confirmedReservation.customerName} !
            </h3>
            <p className="text-xs text-stone-300 mb-6">
              Votre table est pré-enregistrée sous le code de référence ci-dessous.
            </p>

            <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-700 text-left space-y-2 mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-xs text-stone-400">Référence de réservation</span>
                <span className="font-mono text-sm font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  {confirmedReservation.code}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">Date & Heure :</span>
                <span className="text-white font-medium">{confirmedReservation.date} à {confirmedReservation.time}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">Nombre de convives :</span>
                <span className="text-white font-medium">{confirmedReservation.guests} personnes</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">Emplacement choisi :</span>
                <span className="text-amber-300 font-semibold capitalize">
                  {confirmedReservation.seatingZone.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">Adresse :</span>
                <span className="text-stone-300">26 Rue Driss Lahrizi, Casablanca</span>
              </div>
            </div>

            {/* Action Buttons: WhatsApp + Share Reservation */}
            <div className="space-y-3">
              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${getWhatsAppMessage(confirmedReservation)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Envoyer confirmation WhatsApp au 06 60 14 00 17
              </a>

              {/* Share Reservation Button */}
              <button
                type="button"
                onClick={() => handleShareReservation(confirmedReservation)}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 hover:text-white border border-amber-500/40 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                Partager la réservation (WhatsApp, SMS...)
              </button>

              {/* Messaging Apps Share Options Tray */}
              {showShareOptions && (
                <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-700 text-left space-y-2 animate-in fade-in">
                  <span className="text-[11px] text-stone-400 font-medium block">
                    Partager les détails avec vos convives via :
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleShareReservation(confirmedReservation, 'whatsapp')}
                      className="py-2 px-2 bg-emerald-700/40 hover:bg-emerald-700/60 text-emerald-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleShareReservation(confirmedReservation, 'sms')}
                      className="py-2 px-2 bg-blue-700/40 hover:bg-blue-700/60 text-blue-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>SMS</span>
                    </button>
                    <button
                      onClick={() => handleShareReservation(confirmedReservation, 'copy')}
                      className="py-2 px-2 bg-stone-700/60 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSuccess ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                </div>
              )}

              {copiedSuccess && (
                <p className="text-[11px] text-emerald-400 font-medium">
                  ✓ Détails de la réservation copiés dans le presse-papiers !
                </p>
              )}

              <button
                onClick={() => {
                  setConfirmedReservation(null);
                  setShowShareOptions(false);
                }}
                className="text-xs text-stone-400 hover:text-white underline transition-colors cursor-pointer block mx-auto pt-2"
              >
                Effectuer une autre réservation
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form 
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-stone-800/80 border border-stone-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6"
          >
            {/* 1. Pick Seating Zone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                1. Choisissez votre emplacement préféré :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {zonesConfig.map((item) => {
                  const Icon = item.icon;
                  const isSelected = zone === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setZone(item.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-400/30'
                          : 'bg-stone-900/50 border-stone-700 hover:border-stone-500'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {item.label}
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="text-[11px] text-stone-400 leading-snug mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Date, Time, Guests */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                2. Date, Heure & Convives :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Date */}
                <div>
                  <label className="block text-[11px] font-medium text-stone-400 mb-1">
                    Date du repas
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-[11px] font-medium text-stone-400 mb-1">
                    Heure d'arrivée
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {availableTimes.map((t) => (
                        <option key={t} value={t} className="bg-stone-900 text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-[11px] font-medium text-stone-400 mb-1">
                    Nombre de personnes
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
                        <option key={num} value={num} className="bg-stone-900 text-white">
                          {num} {num === 1 ? 'personne' : 'personnes'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Contact Details */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                3. Vos coordonnées de réservation :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-400 mb-1">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Youssef Bennani"
                    className="w-full px-3 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-400 mb-1">
                    Numéro de Téléphone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 06 60 14 00 17"
                    className="w-full px-3 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-[11px] font-medium text-stone-400 mb-1">
                  Demande spéciale (facultatif)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex : Anniversaire, chaise bébé, vue directe sur grand écran..."
                  className="w-full px-3 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="submit-reservation-btn"
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 via-amber-700 to-red-700 hover:from-amber-700 hover:to-red-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Confirmation en cours...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-amber-300" />
                    <span>Confirmer la réservation en ligne</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 mt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Réservation directe sans acompte ni carte bancaire. Annulation gratuite.</span>
              </div>
            </div>

          </form>
        )}

      </div>
    </section>
  );
};
