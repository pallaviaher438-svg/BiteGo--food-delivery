import React from 'react';
import { useApp } from '../context/AppContext';
import { CUISINE_CATEGORIES } from '../data/mockData';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';

export const HomeView: React.FC = () => {
  const {
    restaurants,
    setSelectedRestaurantId,
    setCurrentScreen,
    favorites,
    toggleFavorite,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory
  } = useApp();

  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = searchQuery === '' ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.menu.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory ||
      r.cuisine.some(c => c.toLowerCase() === selectedCategory.toLowerCase()) ||
      r.menu.some(m => m.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c] pb-24 md:pb-12">
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 w-full">
        {/* Mobile Search Bar */}
        <div className="py-3 md:hidden">
          <div className="flex items-center bg-[#e4e2e1] px-4 py-3 rounded-lg shadow-sm border border-transparent focus-within:border-[#29695b] focus-within:bg-white transition-colors">
            <span className="material-symbols-outlined text-[#5c4037] mr-3">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for food..."
              className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-[#5c4037]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[#5c4037]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Hero Banner */}
        <section className="py-2 md:py-8">
          <div
            onClick={() => {
              setSelectedRestaurantId('rest-2'); // La Pino'z Pizza
              setCurrentScreen('restaurant');
            }}
            className="relative w-full h-[180px] md:h-[320px] rounded-xl md:rounded-[24px] overflow-hidden shadow-lg bg-[#eae8e7] group cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-500 group-hover:scale-105"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA3JPViR-MmE4kg7CVumdao_FYQdGYNhowCpjGZ7TqPMNQnQ4tjbAMIB-RVjif3UFT0cXOE44zY-gVpWIAyvBHkTXyqSFPgnIoZQ4fwkp-NC-6b56X1r2C4NEYLnR3Y-s8Ffn0HzngW52DXd-tqJv0KQoFGrIkTkjUm906-Drp4VNlz6JOrxXZPulYHV_YmVeF19EembwWVOVQVV0dpQxO7Z9gE3WYZJr9Gj61wItVpbxSbrTtoQcg')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fbf9f8] via-[#fbf9f8]/85 to-transparent p-6 md:p-12 flex flex-col justify-center w-[85%] sm:w-[70%] md:w-[55%]">
              <span className="bg-[#a83300] text-white font-bold px-3 py-1 rounded-full text-[10px] md:text-xs uppercase tracking-wider w-max mb-2 md:mb-3">
                Limited Time
              </span>
              <h2 className="font-headline font-bold text-2xl md:text-4xl text-[#1b1c1c] leading-tight mb-2 md:mb-3">
                First Order<br />
                <span className="text-[#a83300]">50% Off</span>
              </h2>
              <p className="text-xs md:text-sm text-[#5c4037] mb-4 hidden sm:block max-w-sm">
                Craving something delicious in Nashik? Order now and enjoy a massive discount on your first feast.
              </p>
              <button className="bg-[#a83300] text-white font-bold py-2 md:py-2.5 px-5 md:px-7 rounded-lg w-max hover:bg-[#d24200] transition-colors shadow-md text-xs md:text-sm active:scale-95">
                Order Now
              </button>
            </div>
          </div>
        </section>

        {/* What's on your mind? Categories */}
        <section className="py-4 md:py-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline font-bold text-xl md:text-2xl text-[#1b1c1c]">What's on your mind?</h3>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-semibold text-[#a83300] hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 snap-x">
            {CUISINE_CATEGORIES.map((cat, idx) => {
              const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                  className="flex flex-col items-center gap-2 min-w-[76px] snap-start cursor-pointer hover:opacity-90 transition-all group"
                >
                  <div className={`w-[72px] h-[72px] rounded-full overflow-hidden shadow-sm p-1 transition-all ${
                    isSelected ? 'ring-3 ring-[#a83300] bg-[#ffdbd0]' : 'bg-[#eae8e7] group-hover:scale-105'
                  }`}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className={`text-xs font-semibold text-center ${
                    isSelected ? 'text-[#a83300] font-bold' : 'text-[#1b1c1c]'
                  }`}>
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured Restaurants Grid */}
        <section className="py-4 md:py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-xl md:text-2xl text-[#1b1c1c]">
              {selectedCategory ? `${selectedCategory} Restaurants` : 'Featured Restaurants'}
            </h3>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className="text-[#a83300] font-bold text-sm hover:text-[#d24200] transition-colors"
            >
              See All
            </button>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-[#e4e2e1]">
              <span className="material-symbols-outlined text-4xl text-[#907065] mb-2">restaurant</span>
              <h4 className="font-bold text-base text-[#1b1c1c]">No restaurants found</h4>
              <p className="text-xs text-[#5c4037] mt-1">Try resetting your search query or filters</p>
              <button
                onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                className="mt-4 px-4 py-2 bg-[#a83300] text-white text-xs font-bold rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => {
                const isFav = favorites.includes(restaurant.id);
                return (
                  <div
                    key={restaurant.id}
                    onClick={() => {
                      setSelectedRestaurantId(restaurant.id);
                      setCurrentScreen('restaurant');
                    }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer group border border-[#e4e2e1]"
                  >
                    <div className="relative w-full aspect-video overflow-hidden bg-[#eae8e7]">
                      <img
                        src={restaurant.coverImage}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Rating pill */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[15px] text-[#a83300] fill">star</span>
                        <span className="font-bold text-[#1b1c1c] text-xs">{restaurant.rating}</span>
                      </div>

                      {/* Favorite button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(restaurant.id);
                        }}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-[#5c4037] hover:text-[#a83300] transition-colors"
                      >
                        <span className={`material-symbols-outlined text-[18px] ${isFav ? 'text-[#a83300] fill' : ''}`}>
                          favorite
                        </span>
                      </button>

                      {/* Promo Tag Overlay */}
                      {restaurant.discountBadge && (
                        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full p-3 pt-6 text-white">
                          <span className="font-bold text-xs bg-[#a83300] px-2 py-0.5 rounded text-white shadow-sm">
                            {restaurant.discountBadge}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex gap-3.5">
                      <div className="w-12 h-12 rounded-lg border border-[#e4e2e1] bg-white overflow-hidden shrink-0 mt-0.5 shadow-sm p-0.5">
                        <img
                          src={restaurant.logoImage}
                          alt={restaurant.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-headline font-bold text-base text-[#1b1c1c] mb-0.5 truncate">
                          {restaurant.name}
                        </h4>
                        <p className="text-xs text-[#5c4037] truncate mb-2.5">
                          {restaurant.cuisine.join(', ')}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#5c4037]">
                          <span className="flex items-center gap-1 bg-[#f6f3f2] px-2 py-1 rounded-md text-[11px] font-medium">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {restaurant.deliveryTime}
                          </span>
                          <span className="flex items-center gap-1 bg-[#f6f3f2] px-2 py-1 rounded-md text-[11px] font-medium">
                            <span className="material-symbols-outlined text-[14px]">local_mall</span>
                            ₹{restaurant.priceForOne} for one
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};
