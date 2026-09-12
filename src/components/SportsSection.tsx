import React from 'react';
import { 
  Tv, 
  Trophy, 
  Calendar, 
  Clock, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Volume2 
} from 'lucide-react';

interface SportsSectionProps {
  onOpenReservation: () => void;
}

export const SportsSection: React.FC<SportsSectionProps> = ({ onOpenReservation }) => {
  const upcomingMatches = [
    {
      id: 'match-1',
      competition: 'Ligue des Champions CAF / Botola Pro',
      teams: 'Wydad Casablanca vs Raja Casablanca',
      date: 'Ce Samedi',
      time: '20:30',
      badge: 'Le Grand Derby',
      screens: 'Salle Principale + Mezzanine',
      isHot: true,
    },
    {
      id: 'match-2',
      competition: 'UEFA Champions League',
      teams: 'Real Madrid vs Manchester City',
      date: 'Mardi Prochain',
      time: '21:00',
      badge: 'Choc Européen',
      screens: 'Tous nos écrans HD',
      isHot: true,
    },
    {
      id: 'match-3',
      competition: 'Équipe Nationale du Maroc',
      teams: 'Maroc 🇲🇦 vs Sénégal 🇸🇳',
      date: 'Vendredi 20:00',
      time: '20:00',
      badge: 'Lions de l’Atlas',
      screens: 'Ambiance Supporters & Drapeaux',
      isHot: true,
    },
  ];

  return (
    <section id="sport" className="py-16 sm:py-20 bg-stone-900 text-white border-t border-b border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-2 border border-red-500/30">
              <Tv className="w-3.5 h-3.5 text-red-400" />
              Diffusion Sportive & Soirées Match
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Le Rendez-vous des Supporters à Casablanca
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-1 max-w-2xl">
              Profitez d’une ambiance survoltée avec son immersif, drapeaux du monde entier, écrans multiples et un service continu de grillades fraîches et de thés à la menthe.
            </p>
          </div>

          <button
            onClick={onOpenReservation}
            className="self-start md:self-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            Réserver pour le prochain match <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Features highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-stone-800/70 border border-stone-700/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Écrans Haute Définition</h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Visibilité optimale depuis chaque table, en salle comme en mezzanine.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/70 border border-stone-700/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Commentaires & Son Ambiance</h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Son direct pour vibrer au rythme des chants des supporters et des buts.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/70 border border-stone-700/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Formules Spéciales Match</h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Pizzas croustillantes au feu de bois, burgers et thé marocain servis à table.
              </p>
            </div>
          </div>
        </div>

        {/* Matches Program Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingMatches.map((match) => (
            <div
              key={match.id}
              className="bg-stone-800/90 rounded-2xl border border-stone-700 p-5 flex flex-col justify-between shadow-lg hover:border-red-500/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    {match.competition}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600/30 text-red-300 border border-red-500/40">
                    {match.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3">
                  {match.teams}
                </h3>

                <div className="space-y-1.5 text-xs text-stone-300 mb-5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{match.date} · Coup d’envoi à {match.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tv className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-stone-400">{match.screens}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenReservation}
                className="w-full py-2.5 bg-stone-700 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Réserver ma place match
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
