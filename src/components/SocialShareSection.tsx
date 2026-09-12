import React, { useState } from 'react';
import { 
  Camera, 
  Share2, 
  Heart, 
  MessageCircle, 
  Instagram, 
  Check, 
  Plus, 
  Upload, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SocialPost } from '../types';
import { SOCIAL_POSTS } from '../data/restaurantData';

export const SocialShareSection: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>(SOCIAL_POSTS);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userHandle, setUserHandle] = useState('');
  const [caption, setCaption] = useState('');
  const [dishName, setDishName] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState('/images/grillades.jpg');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const samplePhotoChoices = [
    { label: 'Assiette de Grillades au feu de bois', src: '/images/grillades.jpg' },
    { label: 'Tagine Fassie Traditionnel', src: '/images/tagine.jpg' },
    { label: 'Terrasse de nuit Rue Driss Lahrizi', src: '/images/terrace.jpg' },
    { label: 'Coin Cheminée Chaleureux', src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80' },
  ];

  const handleLike = (id: string) => {
    const isCurrentlyLiked = likedPosts[id];
    setLikedPosts((prev) => ({ ...prev, [id]: !isCurrentlyLiked }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userHandle || !caption) return;

    const formattedHandle = userHandle.startsWith('@') ? userHandle : `@${userHandle}`;
    const newPost: SocialPost = {
      id: 'post-' + Date.now(),
      authorHandle: formattedHandle,
      authorName: formattedHandle.replace('@', ''),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      photoUrl: selectedPhoto,
      dishName: dishName || 'Délice de Belanfa',
      caption: caption + ' #RestaurantBelanfa #CasablancaFood #BelanfaTerrasse',
      likes: 1,
      date: 'À l’instant',
      isUserUploaded: true,
    };

    setPosts([newPost, ...posts]);
    setShowShareModal(false);
    setUserHandle('');
    setCaption('');
    setDishName('');
  };

  const shareToSocial = (platform: 'whatsapp' | 'instagram' | 'tiktok' | 'facebook' | 'copy', post: SocialPost) => {
    const text = `${post.caption} - Dégusté au Restaurant Belanfa (26 Rue Driss Lahrizi, Casablanca)`;
    const url = window.location.origin;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'instagram') {
      navigator.clipboard?.writeText(text);
      alert('✓ Texte et hashtags Belanfa copiés ! Ouvrez Instagram pour publier votre story ou post avec @belanfa_casablanca');
      window.open('https://www.instagram.com', '_blank');
    } else if (platform === 'tiktok') {
      navigator.clipboard?.writeText(text);
      alert('✓ Hashtags #RestaurantBelanfa copiés ! Ouvrez TikTok pour publier votre vidéo dégustation.');
      window.open('https://www.tiktok.com', '_blank');
    } else {
      navigator.clipboard?.writeText(`${text} - ${url}`);
      alert('✓ Lien et message copiés dans le presse-papiers !');
    }
  };

  return (
    <section id="communaute" className="py-16 sm:py-20 bg-stone-900 text-white border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider mb-2 border border-pink-500/30">
              <Camera className="w-3.5 h-3.5 text-pink-400" />
              #RestaurantBelanfa · Communauté Gourmande
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Partagez Vos Plats sur les Réseaux
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-1 max-w-2xl">
              Postez la photo de votre plat, taguez <strong>@belanfa_casablanca</strong> et rejoignez notre mur de convives !
            </p>
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            className="self-start md:self-auto px-5 py-3 bg-gradient-to-r from-pink-600 to-amber-600 hover:from-pink-700 hover:to-amber-700 text-white text-xs font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            Partager ma photo de plat
          </button>
        </div>

        {/* Grid of Social Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => {
            const isLiked = likedPosts[post.id];
            return (
              <div
                key={post.id}
                className="bg-stone-800/90 rounded-3xl overflow-hidden border border-stone-700 shadow-md flex flex-col justify-between hover:border-pink-500/40 transition-all"
              >
                <div>
                  {/* Author Header */}
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.avatar}
                        alt={post.authorName}
                        className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{post.authorHandle}</div>
                        <div className="text-[10px] text-stone-400">{post.date}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-500/30">
                      Casa
                    </span>
                  </div>

                  {/* Photo */}
                  <div className="relative aspect-square w-full overflow-hidden bg-stone-950">
                    <img
                      src={post.photoUrl}
                      alt={post.dishName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 bg-stone-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-medium text-amber-300">
                      {post.dishName}
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-4">
                    <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed">
                      {post.caption}
                    </p>
                  </div>
                </div>

                {/* Social Interaction Buttons */}
                <div className="p-3.5 border-t border-stone-700/60 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                      isLiked ? 'text-pink-500' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => shareToSocial('whatsapp', post)}
                      className="p-1.5 bg-stone-700/70 hover:bg-emerald-600 text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Partager sur WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => shareToSocial('instagram', post)}
                      className="p-1.5 bg-stone-700/70 hover:bg-pink-600 text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Partager sur Instagram (@belanfa_casablanca)"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => shareToSocial('tiktok', post)}
                      className="p-1.5 bg-stone-700/70 hover:bg-black text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer font-bold text-[10px] w-7 h-7 flex items-center justify-center border border-stone-600/60"
                      title="Partager sur TikTok"
                    >
                      TT
                    </button>
                    <button
                      onClick={() => shareToSocial('facebook', post)}
                      className="p-1.5 bg-stone-700/70 hover:bg-blue-600 text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Partager sur Facebook"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl">
            <h3 className="font-serif text-lg font-bold mb-2">
              Partagez votre plat à Belanfa
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Publiez votre photo sur notre mur et faites rayonner le restaurant sur Instagram et WhatsApp !
            </p>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Choisissez la photo de votre plat :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {samplePhotoChoices.map((c) => (
                    <div
                      key={c.src}
                      onClick={() => setSelectedPhoto(c.src)}
                      className={`relative aspect-video rounded-xl overflow-hidden border cursor-pointer ${
                        selectedPhoto === c.src
                          ? 'border-pink-500 ring-2 ring-pink-500/30'
                          : 'border-stone-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={c.src} alt={c.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] px-1.5 rounded">
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Votre nom ou pseudo Instagram / TikTok *
                </label>
                <input
                  type="text"
                  required
                  value={userHandle}
                  onChange={(e) => setUserHandle(e.target.value)}
                  placeholder="@mon_pseudo"
                  className="w-full px-3 py-2 text-xs bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nom du plat dégusté
                </label>
                <input
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="Ex: Brochettes mixtes, Tagine veau pruneaux..."
                  className="w-full px-3 py-2 text-xs bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Votre légende / commentaire *
                </label>
                <textarea
                  required
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Trop bon ! Les brochettes étaient super tendres..."
                  className="w-full p-2.5 text-xs bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-amber-600 hover:from-pink-700 hover:to-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Publier sur le mur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
