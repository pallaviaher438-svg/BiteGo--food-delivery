import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { CUISINE_CATEGORIES } from '../data/mockData';

export const SearchView: React.FC = () => {
  const { restaurants, searchQuery, setSearchQuery, setSelectedRestaurantId, setCurrentScreen, favorites, toggleFavorite } = useApp();
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'deliveryTime' | 'cost'>('rating');

  const filtered = restaurants.filter(r => {
    const matchesQuery = !searchQuery.trim() ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.menu.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesVeg = !vegOnly || r.menu.some(m => m.isVeg);
    return matchesQuery && matchesVeg;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'cost') return a.priceForOne - b.priceForOne;
    return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
  });

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] min-h-screen pb-24 md:pb-12">
      <Header title="Search & Explore" showBack={false} />

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-4 space-y-4">
        {/* Search input */}
        <div className="flex items-center bg-white px-4 py-3 rounded-xl shadow-sm border border-[#e4e2e1] focus-within:border-[#29695b]">
          <span className="material-symbols-outlined text-[#5c4037] mr-3">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pizza, butter chicken, burgers, desserts..."
            className="bg-transparent border-none outline-none flex-1 text-sm text-[#1b1c1c]"
            autoFocus
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#5c4037]">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              vegOnly ? 'bg-[#29695b] text-white' : 'bg-white border border-[#e4e2e1] text-[#5c4037]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] fill">eco</span>
            Pure Veg
          </button>

          <button
            onClick={() => setSortBy('rating')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              sortBy === 'rating' ? 'bg-[#a83300] text-white' : 'bg-white border border-[#e4e2e1] text-[#5c4037]'
            }`}
          >
            Rating 4.5+
          </button>

          <button
            onClick={() => setSortBy('deliveryTime')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              sortBy === 'deliveryTime' ? 'bg-[#a83300] text-white' : 'bg-white border border-[#e4e2e1] text-[#5c4037]'
            }`}
          >
            Fastest Delivery
          </button>

          <button
            onClick={() => setSortBy('cost')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              sortBy === 'cost' ? 'bg-[#a83300] text-white' : 'bg-white border border-[#e4e2e1] text-[#5c4037]'
            }`}
          >
            Cost: Low to High
          </button>
        </div>

        {/* Cuisines quick pills */}
        {!searchQuery && (
          <div className="pt-2">
            <h3 className="font-bold text-xs text-[#5c4037] uppercase tracking-wider mb-2">Popular Cuisines</h3>
            <div className="flex gap-2 flex-wrap">
              {CUISINE_CATEGORIES.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(c.name)}
                  className="px-3 py-1.5 bg-white border border-[#e4e2e1] hover:bg-[#ffdbd0] text-xs font-medium rounded-lg text-[#1b1c1c]"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results grid */}
        <div className="pt-2">
          <div className="text-xs text-[#5c4037] mb-3">Showing {filtered.length} restaurants in Nashik</div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => {
                  setSelectedRestaurantId(restaurant.id);
                  setCurrentScreen('restaurant');
                }}
                className="bg-white rounded-xl shadow-sm border border-[#e4e2e1] overflow-hidden cursor-pointer group"
              >
                <div className="relative w-full aspect-video bg-[#eae8e7]">
                  <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#a83300] text-[14px] fill">star</span>
                    {restaurant.rating}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(restaurant.id);
                    }}
                    className="absolute top-3 right-3 bg-white/90 w-8 h-8 rounded-full flex items-center justify-center text-[#5c4037]"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${favorites.includes(restaurant.id) ? 'text-[#a83300] fill' : ''}`}>
                      favorite
                    </span>
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-base text-[#1b1c1c]">{restaurant.name}</h4>
                  <p className="text-xs text-[#5c4037] mb-2">{restaurant.cuisine.join(', ')}</p>
                  <div className="flex items-center gap-2 text-xs text-[#5c4037]">
                    <span>{restaurant.deliveryTime}</span>
                    <span>•</span>
                    <span>₹{restaurant.priceForOne} for one</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
