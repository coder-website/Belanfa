import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Eye, 
  Heart, 
  Sparkles, 
  Flame, 
  Sun, 
  Tv, 
  X,
  Share2
} from 'lucide-react';
import { VideoStory } from '../types';
import { VIDEO_STORIES } from '../data/restaurantData';

export const AmbianceGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'terrasse' | 'interieur' | 'grillades' | 'sports'>('all');
  const [activeVideo, setActiveVideo] = useState<VideoStory | null>(null);
  const [activePhoto, setActivePhoto] = useState<{ src: string; title: string; desc: string; tag: string } | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const photos = [
    {
      id: 'photo-1',
      src: '/images/terrace.jpg',
      category: 'terrasse',
      title: 'Notre Terrasse Parisienne à Casablanca',
      desc: 'Façade animée, chaises bistrot blanches sur le tapis rouge de la rue Driss Lahrizi. Idéale pour les déjeuners et dîners sous les étoiles.',
      tag: 'Terrasse Extérieure',
    },
    {
      id: 'photo-2',
      src: '/images/interior.jpg',
      category: 'interieur',
      title: 'Salle Principale & Sol en Damier',
      desc: 'Ambiance chaleureuse, boiseries, décorations festives, cheminée et vue directe sur le four à pizza artisanal.',
      tag: 'Ambiance Chaleureuse',
    },
    {
      id: 'photo-3',
      src: '/images/grillades.jpg',
      category: 'grillades',
      title: 'Assiette de Grillades & Frites Courbées',
      desc: 'Brochettes de poulet mariné crousti-fondantes, légumes glacés, frites dorées servies dans un panier traditionnel.',
      tag: 'Grillades au Feu de Bois',
    },
    {
      id: 'photo-4',
      src: '/images/sports.jpg',
      category: 'sports',
      title: 'Les Soirées Matchs & Passion Sport',
      desc: 'Écrans haute définition, son immersif et supporters réunis pour partager des moments de sport intenses avec thé et grillades.',
      tag: 'Écrans & Soirées Sport',
    },
    {
      id: 'photo-5',
      src: '/images/tagine.jpg',
      category: 'grillades',
      title: 'Tagine Poulet Citron Confit Fassie',
      desc: 'Le parfum envoûtant du safran pur, citron confit beldi et olives vertes mijoté dans un tagine traditionnel en terre cuite.',
      tag: 'Spécialité Fassie',
    },
  ];

  const filteredPhotos = photos.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <section id="ambiance" className="py-16 sm:py-20 bg-stone-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Atmosphère Authentique & Chaleureuse
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Galerie & Vidéos de Belanfa
          </h2>
          <p className="text-stone-300 text-sm sm:text-base">
            Découvrez en images et en vidéos l'esprit unique de notre brasserie : la chaleur du feu de bois, le sol en damier intemporel, la terrasse sous les lampadaires et l’effervescence des soirs de match.
          </p>
        </div>

        {/* Video Stories Carousel Section */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h3 className="text-lg font-bold text-white">
                Vidéos & Stories de l’Établissement
              </h3>
            </div>
            <span className="text-xs text-stone-400">
              Cliquez pour lancer en grand écran
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VIDEO_STORIES.map((story) => (
              <div
                key={story.id}
                onClick={() => {
                  setActiveVideo(story);
                  setIsPlaying(true);
                }}
                className="group relative h-72 rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 cursor-pointer shadow-lg hover:border-amber-500/60 transition-all hover:scale-[1.02]"
              >
                <img
                  src={story.thumbnail}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                {/* Badge Category */}
                <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-400 border border-stone-700">
                  {story.category}
                </div>

                {/* Duration */}
                <div className="absolute top-3 right-3 bg-black/60 px-2 py-0.5 rounded text-[10px] text-stone-300">
                  {story.duration}
                </div>

                {/* Center Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-115 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>

                {/* Bottom text */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-1 text-[10px] text-stone-400 mb-1">
                    <Eye className="w-3 h-3" />
                    <span>{story.views} vues</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {story.title}
                  </h4>
                  <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5">
                    {story.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            Toutes les photos ({photos.length})
          </button>
          <button
            onClick={() => setSelectedCategory('terrasse')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'terrasse'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            Terrasse Driss Lahrizi
          </button>
          <button
            onClick={() => setSelectedCategory('interieur')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'interieur'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Salle & Cheminée
          </button>
          <button
            onClick={() => setSelectedCategory('grillades')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'grillades'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            🥩 Grillades & Plats
          </button>
          <button
            onClick={() => setSelectedCategory('sports')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'sports'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            Soirées Sport
          </button>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 aspect-4/3 cursor-pointer shadow-lg hover:border-amber-500/60 transition-all"
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-400 border border-stone-700">
                {photo.tag}
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-sm sm:text-base font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                  {photo.title}
                </h4>
                <p className="text-xs text-stone-300 line-clamp-2">
                  {photo.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-stone-900 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-950">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  {activeVideo.category} · Restaurant Belanfa
                </span>
                <h3 className="text-base font-bold text-white">{activeVideo.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-9 h-9 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center hover:bg-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video container */}
            <div className="relative aspect-16/9 bg-black flex items-center justify-center">
              <video
                src={activeVideo.videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Video control overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-stone-950/70 backdrop-blur-md p-3 rounded-2xl border border-stone-700/50">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl transition-colors"
                    title={isMuted ? 'Activer le son' : 'Couper le son'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <span className="text-xs text-stone-300 hidden sm:inline">
                    {activeVideo.subtitle}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Partager
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full bg-stone-900 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>

            <div className="p-5 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {activePhoto.tag}
                </span>
                <h3 className="text-base font-bold text-white">{activePhoto.title}</h3>
                <p className="text-xs text-stone-400 mt-0.5">{activePhoto.desc}</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent('Découvrez le Restaurant Belanfa à Casablanca : ' + activePhoto.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Partager photo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
