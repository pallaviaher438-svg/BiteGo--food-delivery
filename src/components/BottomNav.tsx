import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, cart } = useApp();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'search', label: 'Search', icon: 'search' },
    { key: 'orders', label: 'Orders', icon: 'receipt_long' },
    { key: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-2 bg-[#fbf9f8] shadow-[0px_-4px_16px_rgba(0,0,0,0.06)] border-t border-[#e4e2e1] rounded-t-2xl md:hidden">
      {navItems.map((item) => {
        const isActive = currentScreen === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setCurrentScreen(item.key)}
            className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
              isActive
                ? 'bg-[#acedda] text-[#2e6d5f] rounded-full px-5 py-1 font-semibold'
                : 'text-[#5c4037] hover:opacity-80 py-1'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${isActive ? 'fill' : ''}`}
            >
              {item.icon}
            </span>
            <span className="text-[11px] font-medium tracking-tight mt-0.5">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
