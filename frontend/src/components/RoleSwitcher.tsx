import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const RoleSwitcher: React.FC = () => {
  const { role, setRole, setCurrentScreen } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const roles: { id: UserRole; label: string; desc: string; icon: string }[] = [
    { id: 'customer', label: 'Customer App', desc: 'Browse, Cart, Checkout, Track', icon: 'person' },
    { id: 'restaurant', label: 'Restaurant Partner', desc: 'Manage orders & live menu', icon: 'storefront' },
    { id: 'delivery', label: 'Delivery Partner', desc: 'Live assigned delivery task', icon: 'two_wheeler' },
    { id: 'admin', label: 'Admin Portal', desc: 'Platform metrics, orders & audit', icon: 'admin_panel_settings' },
  ];

  const handleSelectRole = (newRole: UserRole) => {
    setRole(newRole);
    setIsOpen(false);
    if (newRole === 'customer') setCurrentScreen('home');
    if (newRole === 'restaurant') setCurrentScreen('restaurant_portal');
    if (newRole === 'delivery') setCurrentScreen('delivery_portal');
    if (newRole === 'admin') setCurrentScreen('admin_portal');
  };

  return (
    <div className="fixed top-2 right-2 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 bg-[#1b1c1c] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg hover:bg-black transition-all border border-white/20"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="material-symbols-outlined text-[16px]">
            {roles.find(r => r.id === role)?.icon}
          </span>
          <span className="capitalize hidden sm:inline">{roles.find(r => r.id === role)?.label}</span>
          <span className="material-symbols-outlined text-[14px]">unfold_more</span>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-[#e4e2e1] p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-[#e4e2e1] mb-1">
                <span className="text-[11px] font-bold text-[#5c4037] uppercase tracking-wider">
                  BiteGo Multi-Persona Switcher
                </span>
                <p className="text-xs text-gray-500">Preview any platform persona:</p>
              </div>

              <div className="space-y-1">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRole(r.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                      role === r.id ? 'bg-[#ffdbd0]/60 text-[#a83300]' : 'hover:bg-[#f6f3f2] text-[#1b1c1c]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{r.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-xs">{r.label}</div>
                      <div className="text-[10px] text-[#5c4037]">{r.desc}</div>
                    </div>
                    {role === r.id && (
                      <span className="material-symbols-outlined text-[#a83300] text-[18px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
