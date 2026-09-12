import React from 'react';
import { 
  Flame, 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  Star, 
  Bike, 
  Sun, 
  ChevronRight, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { BelanfaLogo } from './BelanfaLogo';

interface FooterProps {
  onOpenReservation: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenReservation, onOpenAdmin }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      
      {/* Top Banner */}
      <div className="border-b border-stone-800/80 py-8 bg-stone-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <BelanfaLogo size="lg" variant="dark" />
            <p className="text-xs text-stone-400 mt-2">
              Terrasse Bistro · Coin Cheminée · Grillades au Charbon · Casablanca Centre
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenReservation}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Réserver une table
            </button>
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp : 06 60 14 00 17
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: About */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white">À Propos de Belanfa</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Une institution conviviale de Casablanca située au 26 Rue Driss Lahrizi. Connue pour ses brochettes savoureuses grillées au charbon de bois, son sol en damier vintage, sa terrasse ombragée et sa cheminée réconfortante en soirée.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold pt-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>4.9 / 5 étoiles (823 avis Google vérifiés)</span>
            </div>
          </div>

          {/* Col 2: Navigation rapide */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white">Accès Rapide</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                  Carte & Livraison Casablanca (50-100 MAD)
                </a>
              </li>
              <li>
                <a href="#reservation" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                  Réservation en ligne instantanée
                </a>
              </li>
              <li>
                <a href="#communaute" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                  Partage Social (Instagram, TikTok, Facebook)
                </a>
              </li>
              <li>
                <a href="#avis" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                  Témoignages & Avis Clients (823 avis)
                </a>
              </li>
              <li>
                <a href="#localisation" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                  Plan & Itinéraire Google Maps
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Informations pratiques */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white">Horaires & Contact</h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Service Continu 7j/7 :</strong>
                  De 07h00 jusqu’à 23h30
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Adresse :</strong>
                  26 Rue Driss Lahrizi, Casablanca 20250
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Téléphone direct :</strong>
                  06 60 14 00 17
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Prestations & Ambiance */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white">Prestations Clés</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-900 border border-stone-800">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-stone-300">Terrasse sur rue piétonne Driss Lahrizi</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-900 border border-stone-800">
                <Flame className="w-4 h-4 text-red-400" />
                <span className="text-stone-300">Coin Cheminée cosy & chaleureux</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-900 border border-stone-800">
                <Bike className="w-4 h-4 text-emerald-400" />
                <span className="text-stone-300">Livraison exclusive Casablanca (2–3 km max)</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-stone-500 block mb-1.5">
                Programme Belanfa Fidélité :
              </span>
              <p className="text-[11px] text-stone-400 leading-snug">
                Gagnez 1 point par MAD dépensé et débloquez thés, desserts et repas offerts.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} Restaurant Belanfa Casablanca. 26 Rue Driss Lahrizi.</p>
          <div className="flex items-center gap-4">
            <a href="#menu" className="hover:text-stone-300">Menu</a>
            <a href="#reservation" className="hover:text-stone-300">Réservation</a>
            <a href="#localisation" className="hover:text-stone-300">Google Maps</a>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-amber-400/80 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Espace Gérance Admin</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};

