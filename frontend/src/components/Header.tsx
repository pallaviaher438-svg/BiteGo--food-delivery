import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryAddressModal } from './DeliveryAddressModal';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  hideSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack, onBack, hideSearch }) => {
  const {
    currentScreen,
    setCurrentScreen,
    searchQuery,
    setSearchQuery,
    selectedAddress,
    cart,
    setRole,
    currentUser,
    setAuthInitialMode
  } = useApp();
  const [showAddressModal, setShowAddressModal] = useState(false);

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthInitialMode(mode);
    setCurrentScreen('auth');
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="w-full sticky top-0 bg-[#fbf9f8] shadow-xs z-40 flex items-center justify-between px-3 sm:px-4 py-2 md:hidden border-b border-[#e4e2e1] gap-2">
        {showBack ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              onClick={onBack || (() => setCurrentScreen('home'))}
              className="p-1.5 -ml-1 rounded-full hover:bg-[#f0eded] transition-colors active:scale-95 text-[#1b1c1c] flex items-center justify-center shrink-0"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            {title ? (
              <span className="font-headline font-bold text-base sm:text-lg text-[#1b1c1c] truncate">{title}</span>
            ) : (
              <div className="font-display font-bold text-xl sm:text-2xl text-[#a83300] shrink-0">BiteGo</div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddressModal(true)}
            className="flex items-center gap-1.5 text-left hover:bg-[#f6f3f2] active:scale-95 p-1 rounded-xl cursor-pointer min-w-0 max-w-[170px] xs:max-w-[210px] sm:max-w-[260px] transition-all"
            title="Change Delivery Location"
          >
            <div className="w-7 h-7 rounded-lg bg-[#ffdbd0]/80 text-[#a83300] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[17px]">location_on</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-[#5c4037] uppercase tracking-wider font-bold truncate">
                Delivering to
              </span>
              <span className="font-bold text-xs text-[#1b1c1c] flex items-center gap-0.5 truncate">
                <span className="truncate">{selectedAddress.label} - {selectedAddress.addressLine.split(',')[0]}</span>
                <span className="material-symbols-outlined text-[15px] shrink-0 text-[#a83300]">expand_more</span>
              </span>
            </div>
          </button>
        )}

        {!showBack && (
          <div
            onClick={() => setCurrentScreen('home')}
            className="font-display font-bold text-xl sm:text-2xl text-[#a83300] cursor-pointer tracking-tight shrink-0 hidden xs:block"
          >
            BiteGo
          </div>
        )}

        <div className="flex items-center gap-1.5 shrink-0">
          {currentScreen !== 'cart' && cartCount > 0 && (
            <button
              onClick={() => setCurrentScreen('cart')}
              className="relative p-2 rounded-full bg-[#ffdbd0] text-[#a83300] hover:bg-[#ffb59d] transition-colors"
              title="View Cart"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span className="absolute -top-1 -right-1 bg-[#a83300] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </button>
          )}

          {showBack && !title && (
            <button
              onClick={() => setCurrentScreen('search')}
              className="p-1.5 rounded-full hover:bg-[#f0eded] transition-colors"
            >
              <span className="material-symbols-outlined text-[#1b1c1c]">search</span>
            </button>
          )}

          <button
            onClick={() => { setRole('admin'); setCurrentScreen('admin_portal'); }}
            className="p-1.5 rounded-full bg-[#1b1c1c] text-white hover:bg-black transition-colors"
            title="Admin Portal"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-400">admin_panel_settings</span>
          </button>

          {currentUser ? (
            <div
              onClick={() => setCurrentScreen('profile')}
              className="w-8 h-8 rounded-full bg-[#ffdbd0] text-[#a83300] font-bold text-xs border border-[#a83300] overflow-hidden cursor-pointer hover:bg-[#ffb59d] transition-colors flex items-center justify-center"
              title={currentUser.name}
            >
              {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'RD'}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenAuth('login')}
              className="px-2.5 py-1 bg-[#a83300] text-white rounded-lg text-xs font-bold shadow-xs hover:bg-[#d24200] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">login</span>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Desktop Header */}
      <header className="w-full sticky top-0 bg-[#fbf9f8] shadow-xs z-40 hidden md:flex items-center justify-between px-8 py-3 max-w-[1280px] mx-auto border-b border-[#e4e2e1]">
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          <div
            onClick={() => setCurrentScreen('home')}
            className="font-display font-bold text-3xl text-[#a83300] cursor-pointer tracking-tight shrink-0"
          >
            BiteGo
          </div>
          <button
            type="button"
            onClick={() => setShowAddressModal(true)}
            className="flex items-center gap-2.5 text-[#1b1c1c] hover:bg-[#f0eded] transition-all p-2 rounded-xl cursor-pointer text-left border border-transparent hover:border-[#e4e2e1] max-w-[280px] lg:max-w-[340px]"
            title="Change Delivery Address in Nashik"
          >
            <div className="w-8 h-8 rounded-lg bg-[#ffdbd0] text-[#a83300] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#5c4037] uppercase font-bold tracking-wider block">Delivering to</span>
              <span className="font-bold text-xs lg:text-sm text-[#1b1c1c] flex items-center gap-1 truncate">
                <span className="truncate">{selectedAddress.label} • {selectedAddress.addressLine}</span>
                <span className="material-symbols-outlined text-[18px] text-[#a83300] shrink-0">expand_more</span>
              </span>
            </div>
          </button>
        </div>

        {!hideSearch && (
          <div className="flex items-center bg-[#f0eded] px-4 py-2.5 rounded-full flex-1 max-w-md mx-6 lg:mx-8 shadow-inner border border-transparent focus-within:border-[#29695b] focus-within:bg-white transition-all">
            <span className="material-symbols-outlined text-[#5c4037] mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentScreen !== 'search' && currentScreen !== 'home') {
                  setCurrentScreen('search');
                }
              }}
              onFocus={() => {
                if (currentScreen !== 'search' && currentScreen !== 'home') {
                  setCurrentScreen('search');
                }
              }}
              placeholder="Search for restaurants, cuisine or dishes in Nashik"
              className="bg-transparent border-none outline-none flex-1 text-sm text-[#1b1c1c] placeholder:text-[#5c4037]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs text-[#5c4037] hover:text-[#1b1c1c]">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        )}

        <nav className="flex items-center gap-4 lg:gap-5 shrink-0">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`font-semibold flex items-center gap-2 p-2 rounded-lg transition-colors ${
              currentScreen === 'home' ? 'text-[#a83300] bg-[#ffdbd0]/50' : 'text-[#5c4037] hover:bg-[#f0eded]'
            }`}
          >
            <span className="material-symbols-outlined fill">home</span> Home
          </button>
          <button
            onClick={() => setCurrentScreen('orders')}
            className={`font-medium flex items-center gap-2 p-2 rounded-lg transition-colors ${
              currentScreen === 'orders' ? 'text-[#a83300] bg-[#ffdbd0]/50' : 'text-[#5c4037] hover:bg-[#f0eded]'
            }`}
          >
            <span className="material-symbols-outlined">receipt_long</span> Orders
          </button>
          <button
            onClick={() => setCurrentScreen('cart')}
            className={`relative font-medium flex items-center gap-2 p-2 rounded-lg transition-colors ${
              currentScreen === 'cart' ? 'text-[#a83300] bg-[#ffdbd0]/50' : 'text-[#5c4037] hover:bg-[#f0eded]'
            }`}
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            Cart
            {cartCount > 0 && (
              <span className="bg-[#a83300] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setRole('admin'); setCurrentScreen('admin_portal'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1b1c1c] text-white hover:bg-black transition-colors text-xs font-bold shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-amber-400">admin_panel_settings</span>
            Admin Panel
          </button>

          {currentUser ? (
            <div
              onClick={() => setCurrentScreen('profile')}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-[#f0eded] cursor-pointer transition-colors border border-[#e4e2e1]"
            >
              <div className="w-8 h-8 rounded-full bg-[#ffdbd0] text-[#a83300] font-bold text-xs flex items-center justify-center border border-[#a83300]">
                {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'RD'}
              </div>
              <span className="text-xs font-bold text-[#1b1c1c] max-w-[100px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenAuth('login')}
                className="px-3.5 py-1.5 bg-[#a83300] text-white rounded-lg text-xs font-bold shadow-sm hover:bg-[#d24200] transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleOpenAuth('signup')}
                className="px-3.5 py-1.5 bg-white border border-[#e4e2e1] text-[#1b1c1c] rounded-lg text-xs font-bold hover:bg-[#f6f3f2] transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Responsive Delivery Address Modal */}
      <DeliveryAddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        initialMode="select"
      />
    </>
  );
};
