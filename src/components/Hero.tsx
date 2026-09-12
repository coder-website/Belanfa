import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sun, 
  Bike, 
  Star, 
  Clock, 
  MapPin, 
  Calendar, 
  UtensilsCrossed, 
  Navigation, 
  ChevronRight,
  Sparkles,
  PhoneCall,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface HeroProps {
  onOpenReservation?: () => void;
  onOpenMenu?: () => void;
  onNavigateToLocation?: () => void;
  onOpenDelivery?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenReservation,
  onOpenMenu,
  onNavigateToLocation,
  onOpenDelivery,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleReservation = () => {
    if (typeof onOpenReservation === 'function') {
      onOpenReservation();
    } else {
      document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMenu = () => {
    if (typeof onOpenMenu === 'function') {
      onOpenMenu();
    } else {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLocation = () => {
    if (typeof onNavigateToLocation === 'function') {
      onNavigateToLocation();
    } else {
      document.getElementById('localisation')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelivery = () => {
    if (typeof onOpenDelivery === 'function') {
      onOpenDelivery();
    } else {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroSlides = [
    {
      image: '/images/terrace.jpg',
      tag: 'Terrasse Extérieure',
      title: 'Dînez sous la brise de Casablanca',
      subtitle: 'Notre grande terrasse bistro sur la rue Driss Lahrizi pour vos déjeuners ensoleillés et soirées animées.',
    },
    {
      image: '/images/interior.jpg',
      tag: 'Cheminée & Convivialité',
      title: 'Chaleur, sol damier & four à bois napolitain',
      subtitle: 'Une atmosphère conviviale unique, un feu de cheminée crépitant et des recettes fassies préparées avec passion.',
    },
    {
      image: '/images/grillades.jpg',
      tag: 'Grillades au Charbon',
      title: 'Brochettes savoureuses & viandes fraîches',
      subtitle: 'Poulet mariné, kefta fassie, côtelettes d’agneau et nos fameuses frites dorées croustillantes.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-stone-950 text-white">
      {/* Background carousel */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.tag}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-105 transition-transform duration-7000' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover brightness-[0.38] saturate-[1.1]"
            />
          </div>
        ))}
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/80" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-28">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9 / 5</span>
            <span className="text-amber-200/70 font-normal">(823 avis Google)</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Ouvert · Ferme à 23:30</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800/80 backdrop-blur-md border border-stone-700/50 text-stone-300 text-xs font-medium">
            <span>50–100 MAD / personne</span>
          </div>
        </div>

        {/* Delivery Radius Alert Ticker */}
        <div 
          onClick={handleDelivery}
          className="mb-6 max-w-2xl cursor-pointer group rounded-2xl bg-gradient-to-r from-amber-950/80 via-stone-900/80 to-stone-900/80 border border-amber-500/40 p-3 sm:p-4 backdrop-blur-md hover:border-amber-400 transition-all shadow-lg hover:shadow-amber-500/10"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center shrink-0 text-amber-400 group-hover:scale-105 transition-transform">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Livraison Express Casablanca · Rayon 2 à 3 km max
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Chaud & Croustillant
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                  Livraison rapide en 25–35 min autour de la Rue Driss Lahrizi (Centre-Ville, Sidi Belyout, Gautier...)
                </p>
              </div>
            </div>
            <div className="shrink-0 hidden sm:flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              Commander <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="max-w-3xl mb-8">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-amber-400 font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Brasserie & Grillades au cœur de Casablanca
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-4">
            Restaurant <span className="text-amber-400">Belanfa</span>
          </h1>
          <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed max-w-2xl">
            L’incontournable adresse du centre-ville de Casablanca. Savourez nos généreuses grillades au feu de bois, pizzas artisanales et spécialités marocaines, bercés par la chaleur de la cheminée ou la fraîcheur de notre grande terrasse.
          </p>
        </div>

        {/* 3 Pillars: Terrasse, Cheminée, Livraison Casablanca */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mb-10">
          
          <div className="p-4 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-stone-800 flex items-center gap-3.5 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Grande Terrasse</h4>
              <p className="text-xs text-stone-400">Rue piétonne Driss Lahrizi</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-stone-800 flex items-center gap-3.5 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Coin Cheminée</h4>
              <p className="text-xs text-stone-400">Ambiance feutrée & chaleureuse</p>
            </div>
          </div>

          <div 
            onClick={handleDelivery}
            className="p-4 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-stone-800 flex items-center gap-3.5 hover:border-amber-500/40 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Livraison Casablanca</h4>
              <p className="text-xs text-stone-400">Rayon strict 2 à 3 km max</p>
            </div>
          </div>

        </div>

        {/* Primary Call to Actions */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          
          <button
            id="hero-reserve-cta"
            onClick={handleReservation}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-amber-600 via-amber-700 to-red-700 hover:from-amber-700 hover:to-red-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-amber-900/40 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Réserver une table en ligne</span>
          </button>

          <button
            id="hero-menu-cta"
            onClick={handleMenu}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-stone-900/90 hover:bg-stone-800 text-white font-medium text-sm rounded-xl border border-stone-700 hover:border-amber-400/50 backdrop-blur-md transition-all cursor-pointer"
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <span>Consulter la carte & commander</span>
          </button>

          <button
            id="hero-maps-cta"
            onClick={handleLocation}
            className="flex items-center justify-center gap-2.5 px-4 py-3.5 bg-stone-900/50 hover:bg-stone-800/80 text-stone-300 hover:text-white font-medium text-sm rounded-xl border border-stone-800 backdrop-blur-md transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>Itinéraire Google Maps</span>
          </button>

          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=Bonjour%20Restaurant%20Belanfa%2C%20je%20souhaite%20commander%20ou%20r%C3%A9server.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-medium text-sm rounded-xl border border-emerald-500/30 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp 06 60 14 00 17</span>
          </a>

        </div>

      </div>
    </section>
  );
};

