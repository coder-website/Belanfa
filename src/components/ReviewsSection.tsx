import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  Award, 
  Plus, 
  X,
  Sparkles
} from 'lucide-react';
import { Review } from '../types';
import { CUSTOMER_REVIEWS, RESTAURANT_INFO } from '../data/restaurantData';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(CUSTOMER_REVIEWS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [authorName, setAuthorName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [comment, setComment] = useState('');
  const [dishMentioned, setDishMentioned] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const handleHelpful = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    setSubmitting(true);
    const newRev: Review = {
      id: 'rev-' + Date.now(),
      author: authorName,
      date: 'À l’instant',
      rating: newRating,
      comment,
      dishMentioned: dishMentioned || undefined,
      tag: 'Avis Client Belanfa',
      verified: true,
      helpfulCount: 1,
    };

    setTimeout(() => {
      setReviews([newRev, ...reviews]);
      setSubmitting(false);
      setShowAddModal(false);
      setAuthorName('');
      setComment('');
      setDishMentioned('');
      setNewRating(5);
    }, 400);
  };

  return (
    <section id="avis" className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Global Score */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              Excellence Reconnue sur Google & Réseaux
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Ce que disent nos clients
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-xl">
              Plus de 820 convives partagent leur enthousiasme pour l’accueil chaleureux, les grillades tendres et nos soirées inoubliables.
            </p>
          </div>

          {/* Rating Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
            <div className="text-center sm:border-r sm:border-stone-100 sm:pr-6">
              <div className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
                4.9
              </div>
              <div className="flex items-center justify-center gap-1 my-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Basé sur <strong>823 avis Google</strong>
              </p>
            </div>

            <div className="space-y-2 text-xs w-full sm:w-56">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Saveur & Grillades</span>
                <span className="font-bold text-stone-900">4.9 / 5</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5">
                <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '98%' }} />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-600">Accueil & Service</span>
                <span className="font-bold text-stone-900">4.8 / 5</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5">
                <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '96%' }} />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-600">Ambiance & Cadre</span>
                <span className="font-bold text-stone-900">5.0 / 5</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5">
                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Laisser un avis
            </button>
          </div>
        </div>

        {/* Filter by stars */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterRating('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterRating === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            Tous les avis ({reviews.length})
          </button>
          {[5, 4].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                filterRating === star
                  ? 'bg-amber-700 text-white'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              <span>{star} étoiles</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm border border-amber-200">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-stone-900">{rev.author}</h4>
                        {rev.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Client vérifié" />
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {rev.tag && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 mb-2">
                    {rev.tag}
                  </span>
                )}

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-3">
                  "{rev.comment}"
                </p>

                {rev.dishMentioned && (
                  <div className="text-[11px] text-stone-500 bg-stone-50 p-2 rounded-xl border border-stone-100 mb-3">
                    <span className="font-semibold text-stone-700">Plat apprécié :</span> {rev.dishMentioned}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-500">
                <span>Avis Google certifié</span>
                <button
                  onClick={() => handleHelpful(rev.id)}
                  className="flex items-center gap-1 text-stone-600 hover:text-amber-800 font-medium cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Utile ({rev.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Laisser votre avis sur Belanfa
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Votre note :
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setNewRating(s)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          s <= newRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-700 ml-2">
                    {newRating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Votre nom ou pseudo *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ex: Tariq K."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Plat dégusté (facultatif)
                </label>
                <input
                  type="text"
                  value={dishMentioned}
                  onChange={(e) => setDishMentioned(e.target.value)}
                  placeholder="Ex: Brochettes de poulet, Pizza Reine, Tagine..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Votre commentaire *
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience sur la nourriture, le service, la terrasse ou la cheminée..."
                  className="w-full p-3 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-xs"
                >
                  {submitting ? 'Publication...' : 'Publier mon avis'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
