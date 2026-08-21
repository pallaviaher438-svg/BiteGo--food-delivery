import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';

export const RestaurantView: React.FC = () => {
  const {
    restaurants,
    selectedRestaurantId,
    setCurrentScreen,
    cart,
    addToCart,
    removeFromCart,
    getItemQuantity
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('Appetizers');

  const restaurant = restaurants.find(r => r.id === selectedRestaurantId) || restaurants[2]; // Default to The Spice Route
  
  const categories: string[] = Array.from(new Set<string>(restaurant.menu.map(m => m.category)));
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat);
    const element = document.getElementById(`cat-${cat.toLowerCase().replace(/\s+/g, '-')}`);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c] pb-32 md:pb-16 relative">
      <Header
        showBack={true}
        onBack={() => setCurrentScreen('home')}
        title=""
      />

      <main className="max-w-[1280px] mx-auto w-full">
        {/* Hero Section */}
        <section className="relative w-full h-[250px] md:h-[380px] bg-[#1b1c1c]">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover rounded-b-2xl md:rounded-none opacity-90"
          />
          <div className="absolute bottom-0 left-0 w-full p-4 md:px-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end h-3/4">
            <h1 className="font-headline font-bold text-2xl md:text-4xl text-white mb-1">
              {restaurant.name}
            </h1>
            <p className="text-xs md:text-sm text-[#e4e2e1] mb-2">
              {restaurant.tagline || `${restaurant.cuisine.join(' • ')}`}
            </p>
            <div className="flex items-center gap-4 text-white text-xs font-medium">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-amber-400 fill">star</span>
                <span className="font-bold">{restaurant.rating}</span>
                <span className="text-gray-300">({restaurant.reviewsCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1 hidden sm:flex">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                <span>{restaurant.distance}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Categories Sticky Nav */}
        <nav className="sticky top-[53px] md:top-[65px] bg-[#fbf9f8] z-30 border-b border-[#e4e2e1] overflow-x-auto hide-scrollbar px-4 md:px-8 py-2.5 flex space-x-6">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`whitespace-nowrap pb-1 font-semibold text-xs md:text-sm transition-all ${
                  isActive
                    ? 'text-[#a83300] border-b-2 border-[#a83300]'
                    : 'text-[#5c4037] hover:text-[#1b1c1c]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>

        {/* Menu Content Grouped by Categories */}
        <div className="px-4 md:px-8 py-6 space-y-8">
          {categories.map((cat) => {
            const items = restaurant.menu.filter(m => m.category === cat);
            if (items.length === 0) return null;

            return (
              <section key={cat} id={`cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}>
                <h2 className="font-headline font-bold text-lg md:text-xl text-[#1b1c1c] mb-4 flex items-center gap-2">
                  <span>{cat}</span>
                  <span className="text-xs font-normal text-[#5c4037]">({items.length})</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((menuItem) => {
                    const quantity = getItemQuantity(menuItem.id);

                    return (
                      <div
                        key={menuItem.id}
                        className="bg-white rounded-xl p-3.5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow border border-[#e4e2e1]"
                      >
                        <div className="flex-1 pr-3">
                          <div className="flex items-center gap-2 mb-1">
                            {menuItem.isVeg ? (
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[15px] text-[#29695b] fill">eco</span>
                                <span className="text-[10px] font-bold text-[#29695b] border border-[#29695b]/30 rounded px-1">VEG</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[15px] text-[#ba1a1a] fill">restaurant_menu</span>
                                <span className="text-[10px] font-bold text-[#ba1a1a] border border-[#ba1a1a]/30 rounded px-1">NON-VEG</span>
                              </div>
                            )}

                            {menuItem.isBestseller && (
                              <span className="text-[10px] font-bold bg-[#ffdbd0] text-[#832600] rounded px-1.5 py-0.5 flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[11px] fill">star</span> Bestseller
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-sm text-[#1b1c1c] mb-1">
                            {menuItem.name}
                          </h3>
                          <p className="text-xs text-[#5c4037] line-clamp-2 mb-2">
                            {menuItem.description}
                          </p>
                          <span className="font-bold text-sm text-[#1b1c1c]">
                            ₹{menuItem.price}
                          </span>
                        </div>

                        <div className="relative w-[100px] h-[100px] shrink-0">
                          <img
                            src={menuItem.image}
                            alt={menuItem.name}
                            className="w-full h-full object-cover rounded-lg bg-[#eae8e7]"
                          />

                          {quantity === 0 ? (
                            <button
                              onClick={() => addToCart(restaurant, menuItem)}
                              className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-[#a83300] font-bold text-xs border border-[#e4e2e1] shadow-sm rounded-lg px-4 py-1 hover:bg-[#ffdbd0]/30 active:scale-95 transition-all"
                            >
                              ADD
                            </button>
                          ) : (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-[#a83300] shadow-md rounded-lg flex items-center overflow-hidden">
                              <button
                                onClick={() => removeFromCart(menuItem.id)}
                                className="px-2 py-1 text-[#a83300] hover:bg-[#ffdbd0]/40 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[15px]">remove</span>
                              </button>
                              <span className="px-1.5 font-bold text-xs text-[#1b1c1c] min-w-[18px] text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() => addToCart(restaurant, menuItem)}
                                className="px-2 py-1 text-[#a83300] hover:bg-[#ffdbd0]/40 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[15px]">add</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Floating View Cart Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-16 md:bottom-6 left-0 w-full px-4 md:px-8 z-40 max-w-[1280px] mx-auto right-0">
          <div
            onClick={() => setCurrentScreen('cart')}
            className="bg-[#29695b] text-white flex items-center justify-between px-5 py-3 rounded-xl shadow-xl cursor-pointer hover:bg-[#065043] transition-all active:scale-[0.99] border border-white/20"
          >
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm">
                {totalCartCount} Item{totalCartCount > 1 ? 's' : ''} | ₹{totalCartAmount}
              </span>
              <span className="text-[10px] text-[#afefdd]">Extra charges may apply</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <span>View Cart</span>
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};
