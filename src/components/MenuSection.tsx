import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Flame, 
  Sparkles, 
  Tv, 
  Leaf, 
  Clock, 
  Plus, 
  Check, 
  SlidersHorizontal,
  Info,
  ChevronRight
} from 'lucide-react';
import { CategoryId, MenuItem } from '../types';
import { MENU_ITEMS } from '../data/restaurantData';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, notes?: string) => void;
  onOpenReservation: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart, onOpenReservation }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'chef' | 'match' | 'veggie' | 'spicy'>('all');
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const [detailModalItem, setDetailModalItem] = useState<MenuItem | null>(null);
  const [customNotes, setCustomNotes] = useState('');

  const categories: { id: CategoryId; label: string; icon?: string }[] = [
    { id: 'all', label: 'Toute la Carte' },
    { id: 'grillades', label: '🥩 Grillades au Charbon' },
    { id: 'tagines', label: '🍲 Tagines & Fassie' },
    { id: 'pizzas', label: '🍕 Pizzas au Feu de Bois' },
    { id: 'salades', label: '🥗 Salades Fraîches' },
    { id: 'burgers', label: '🍔 Burgers & Paninis' },
    { id: 'desserts', label: '🍰 Desserts Maison' },
    { id: 'boissons', label: '☕ Thés, Jus & Cafés' },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Dietary / Feature filters
      if (activeFilter === 'chef' && !item.isChefSpecial) return false;
      if (activeFilter === 'match' && !item.isMatchSpecial) return false;
      if (activeFilter === 'veggie' && !item.isVegetarian) return false;
      if (activeFilter === 'spicy' && !item.isSpicy) return false;

      return true;
    });
  }, [selectedCategory, searchQuery, activeFilter]);

  const handleQuickAdd = (item: MenuItem) => {
    onAddToCart(item);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1200);
  };

  const handleAddWithDetails = () => {
    if (detailModalItem) {
      onAddToCart(detailModalItem, customNotes);
      setDetailModalItem(null);
      setCustomNotes('');
    }
  };

  return (
    <section id="menu" className="py-16 sm:py-20 bg-stone-100/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-700" />
              Carte Gourmande & Prix Clairs (50–100 MAD)
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Notre Menu Interactif
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-2xl">
              De nos célèbres brochettes grillées au charbon de bois jusqu’aux authentiques recettes fassies et nos pizzas dorées au four traditionnel.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              id="menu-search-input"
              type="text"
              placeholder="Rechercher (brochettes, tagine, pizza...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
              >
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Category Horizontal Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-800 text-white shadow-md shadow-amber-900/20'
                  : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter Badges (Quick tags) */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filtres :
          </span>
          
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            Tous les plats ({filteredItems.length})
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'chef' ? 'all' : 'chef')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeFilter === 'chef'
                ? 'bg-amber-700 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Coup de Cœur Chef
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'match' ? 'all' : 'match')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeFilter === 'match'
                ? 'bg-red-700 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-red-500" />
            Spécial Soir de Match
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'veggie' ? 'all' : 'veggie')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeFilter === 'veggie'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            Végétarien
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'spicy' ? 'all' : 'spicy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeFilter === 'spicy'
                ? 'bg-orange-700 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            Épicé Beldi
          </button>
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
            <p className="text-stone-500 text-base mb-3">Aucun plat trouvé pour votre recherche.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="px-4 py-2 bg-amber-700 text-white text-xs font-semibold rounded-xl hover:bg-amber-800"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isJustAdded = addedItemId === item.id;
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-400/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Item Image with Badge */}
                    <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {item.badge && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-600 text-white shadow-xs">
                            {item.badge}
                          </span>
                        )}
                        {item.isMatchSpecial && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-red-600 text-white shadow-xs flex items-center gap-1">
                            <Tv className="w-3 h-3" /> Match
                          </span>
                        )}
                        {item.isVegetarian && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-700 text-white shadow-xs">
                            Végé
                          </span>
                        )}
                      </div>

                      {/* Prep time info */}
                      {item.prepTime && (
                        <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] font-medium text-stone-200">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{item.prepTime}</span>
                        </div>
                      )}

                      {/* Price Pill */}
                      <div className="absolute bottom-2.5 right-3 bg-stone-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-stone-700 text-amber-400 font-bold text-sm sm:text-base">
                        {item.price} <span className="text-xs text-stone-300 font-normal">MAD</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5 group-hover:text-amber-800 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-3">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center justify-between border-t border-stone-100 mt-2 gap-2">
                    <button
                      onClick={() => setDetailModalItem(item)}
                      className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-stone-400" />
                      Personnaliser
                    </button>

                    <button
                      onClick={() => handleQuickAdd(item)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white scale-95'
                          : 'bg-stone-900 hover:bg-amber-800 text-white shadow-xs hover:shadow-md'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Ajouté !
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          Ajouter ({item.price} DH)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner for Reservation */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber-900 to-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div>
            <h4 className="text-lg font-bold">Vous prévoyez de venir déjeuner ou dîner ?</h4>
            <p className="text-stone-300 text-xs sm:text-sm mt-0.5">
              Réservez votre table en terrasse ou près de la cheminée pour éviter toute attente aux heures de pointe.
            </p>
          </div>
          <button
            onClick={onOpenReservation}
            className="shrink-0 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            Réserver ma table en ligne <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Item Customization Modal */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="relative h-48 bg-stone-900">
              <img
                src={detailModalItem.image}
                alt={detailModalItem.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setDetailModalItem(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-sm font-bold hover:bg-black"
              >
                ✕
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {detailModalItem.name}
                </h3>
                <span className="text-amber-800 font-bold text-lg">
                  {detailModalItem.price} MAD
                </span>
              </div>
              <p className="text-xs text-stone-600 mb-4">
                {detailModalItem.description}
              </p>

              {/* Notes or requests */}
              <div className="space-y-3 mb-5">
                <label className="block text-xs font-semibold text-stone-700">
                  Instructions ou préférences pour le chef :
                </label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Ex : Cuisson bien cuite, sans oignons, sauce à part..."
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setDetailModalItem(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddWithDetails}
                  className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter au panier ({detailModalItem.price} MAD)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
