import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  Compass, 
  Car, 
  Footprints, 
  Train, 
  Check, 
  Copy,
  AlertCircle
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export const LocationSection: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleGetLocation = () => {
    setLocating(true);
    setLocError(null);

    if (!navigator.geolocation) {
      setLocError("La géolocalisation n'est pas supportée par votre navigateur.");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });
        const d = calculateDistance(
          userLat,
          userLng,
          RESTAURANT_INFO.coordinates.lat,
          RESTAURANT_INFO.coordinates.lng
        );
        setDistanceKm(Math.round(d * 10) / 10);
        setLocating(false);
      },
      (err) => {
        console.warn(err);
        setLocError("Impossible d'obtenir votre position GPS. Veuillez autoriser l'accès à la localisation.");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const copyAddress = () => {
    navigator.clipboard?.writeText(RESTAURANT_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGoogleMapsDirectionsUrl = () => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=Restaurant+Belanfa+26+Rue+Driss+Lahrizi+Casablanca`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=Restaurant+Belanfa+26+Rue+Driss+Lahrizi+Casablanca`;
  };

  return (
    <section id="localisation" className="py-16 sm:py-20 bg-stone-100/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            Accès Facile en Plein Cœur de Casablanca
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Géolocalisation & Navigation Google Maps
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-1">
            Rejoignez-nous facilement au <strong>26 Rue Driss Lahrizi, Casablanca</strong>. À deux pas du Boulevard Mohammed V et de la Place des Nations Unies.
          </p>
        </div>

        {/* Main Grid: Info + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Coordinates & Distance Calculator */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address Details Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Restaurant Belanfa
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Brasserie marocaine · Grillades · Terrasse & Cheminée
                  </p>
                </div>
                <button
                  onClick={copyAddress}
                  className="p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
                  title="Copier l'adresse"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3 text-stone-700">
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 font-semibold">Adresse exacte :</strong>
                    26 Rue Driss Lahrizi, Casablanca 20250 (Maroc)
                  </div>
                </div>

                <div className="flex items-start gap-3 text-stone-700">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 font-semibold">Horaires d’ouverture :</strong>
                    Ouvert 7j/7 · de 07h00 à 23h30 sans interruption
                  </div>
                </div>

                <div className="flex items-start gap-3 text-stone-700">
                  <Phone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 font-semibold">Téléphone & Réservations :</strong>
                    06 60 14 00 17
                  </div>
                </div>
              </div>

              {/* Transit hints */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-2 text-xs text-stone-600">
                <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-amber-700" />
                  Accès en Tramway & Transports :
                </div>
                <p className="text-[11px] leading-relaxed">
                  • <strong>Tramway Ligne 1 :</strong> Arrêt <em>Place des Nations Unies</em> ou <em>Marché Central</em> (3 min à pied).<br />
                  • <strong>Station de taxi :</strong> Nombreux petits taxis rouges disponibles sur le Bd Mohammed V.<br />
                  • <strong>Parking :</strong> Stationnement rue Driss Lahrizi et parkings surveillés à proximité.
                </p>
              </div>

              {/* GPS Button */}
              <div className="pt-2">
                <button
                  id="gps-location-button"
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Compass className={`w-4 h-4 text-amber-400 ${locating ? 'animate-spin' : ''}`} />
                  {locating ? 'Calcul de votre position GPS...' : 'Calculer la distance depuis ma position'}
                </button>

                {locError && (
                  <p className="text-[11px] text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {locError}
                  </p>
                )}

                {distanceKm !== null && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 animate-in fade-in">
                    <div className="font-bold flex items-center justify-between mb-2">
                      <span>Vous êtes à :</span>
                      <span className="text-emerald-700 text-sm font-extrabold">{distanceKm} km</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="bg-white p-2 rounded-xl border border-emerald-100">
                        <Car className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-700" />
                        <span>~{Math.max(3, Math.round(distanceKm * 2.5))} min</span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-emerald-100">
                        <Footprints className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-700" />
                        <span>~{Math.round(distanceKm * 13)} min</span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-emerald-100">
                        <Train className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-700" />
                        <span>Tram T1</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Links */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={getGoogleMapsDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-3 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Itinéraire Maps
                </a>

                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=Bonjour%2C%20je%20suis%20en%20route%20pour%20Restaurant%20Belanfa%20(26%20Rue%20Driss%20Lahrizi).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp direct
                </a>
              </div>

            </div>

          </div>

          {/* Right Column: Google Maps Interactive Embed */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col h-[540px]">
            <div className="p-3.5 bg-stone-900 text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Google Maps · 26 Rue Driss Lahrizi, Casablanca 20250</span>
              </div>
              <a
                href={getGoogleMapsDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                Agrandir le plan <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative flex-1 w-full h-full bg-stone-200">
              <iframe
                title="Google Maps Location - Restaurant Belanfa Casablanca"
                src={RESTAURANT_INFO.embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
