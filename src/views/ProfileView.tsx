import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { DeliveryAddressModal } from '../components/DeliveryAddressModal';
import { DeliveryAddress } from '../types';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    logout,
    selectedAddress,
    setSelectedAddress,
    setDefaultAddress,
    deleteAddress,
    addresses,
    orders,
    setRole,
    setCurrentScreen,
    setAuthInitialMode
  } = useApp();

  const [userName, setUserName] = useState(currentUser?.name || 'Rahul Deshmukh');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '+91 9876543210');
  const [userEmail, setUserEmail] = useState(currentUser?.email || 'rahul.nashik@bitego.com');
  const [isSaved, setIsSaved] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState<'select' | 'add' | 'edit'>('add');
  const [addressToEdit, setAddressToEdit] = useState<DeliveryAddress | null>(null);

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name);
      setUserPhone(currentUser.phone);
      setUserEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: userName,
      phone: userPhone,
      email: userEmail
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthInitialMode(mode);
    setCurrentScreen('auth');
  };

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] min-h-screen pb-24 md:pb-12">
      <Header title="My Account" showBack={false} />

      <main className="max-w-[800px] mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* If user is logged in */}
        {currentUser ? (
          <>
            {/* User Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e2e1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#ffdbd0] text-[#a83300] font-headline font-bold text-2xl flex items-center justify-center border-2 border-[#a83300] shrink-0">
                  {currentUser.name
                    ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                    : 'BG'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline font-bold text-lg text-[#1b1c1c]">{currentUser.name}</h2>
                    {currentUser.isGoldMember && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">verified</span> Gold Member
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5c4037]">{currentUser.phone} • {currentUser.email}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Member since {currentUser.joinedDate || '2026'} • Nashik, Maharashtra</p>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('login')}
                  className="px-3 py-1.5 bg-[#f6f3f2] hover:bg-[#eae8e7] text-xs font-semibold text-[#1b1c1c] rounded-xl transition-colors border border-[#e4e2e1]"
                >
                  Switch Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 rounded-xl transition-colors border border-red-200"
                >
                  Log Out
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-[#e4e2e1] text-center shadow-xs">
                <div className="font-headline font-bold text-lg text-[#a83300]">{orders.length}</div>
                <div className="text-[11px] text-[#5c4037] font-medium">Orders Placed</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#e4e2e1] text-center shadow-xs">
                <div className="font-headline font-bold text-lg text-[#29695b]">₹420</div>
                <div className="text-[11px] text-[#5c4037] font-medium">Gold Savings</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#e4e2e1] text-center shadow-xs">
                <div className="font-headline font-bold text-lg text-amber-600">3</div>
                <div className="text-[11px] text-[#5c4037] font-medium">Saved Addresses</div>
              </div>
            </div>

            {/* Edit Profile Form */}
            <form onSubmit={handleSave} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e2e1] space-y-4">
              <h3 className="font-headline font-bold text-sm text-[#1b1c1c]">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#5c4037] mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-lg outline-none focus:ring-1 focus:ring-[#a83300] border border-[#e4e2e1]"
                  />
                </div>
                <div>
                  <label className="block text-[#5c4037] mb-1 font-medium">Phone Number</label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-lg outline-none focus:ring-1 focus:ring-[#a83300] border border-[#e4e2e1]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#5c4037] mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-lg outline-none focus:ring-1 focus:ring-[#a83300] border border-[#e4e2e1]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#a83300] text-white rounded-xl text-xs font-bold hover:bg-[#d24200] transition-colors shadow-sm"
              >
                {isSaved ? 'Changes Saved!' : 'Save Profile'}
              </button>
            </form>
          </>
        ) : (
          /* When Logged Out: Welcome Card with Auth CTAs */
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e4e2e1] text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#ffdbd0] text-[#a83300] mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">account_circle</span>
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="font-headline font-bold text-xl text-[#1b1c1c]">Sign in to your BiteGo Account</h2>
              <p className="text-xs text-[#5c4037]">
                Access your past orders, favorite Nashik restaurants, saved delivery locations, and exclusive member discounts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => handleOpenAuth('login')}
                className="w-full py-2.5 bg-[#a83300] text-white font-bold text-xs rounded-xl hover:bg-[#d24200] transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                Log In with OTP / Email
              </button>
              <button
                type="button"
                onClick={() => handleOpenAuth('signup')}
                className="w-full py-2.5 bg-white text-[#1b1c1c] border border-[#e4e2e1] font-bold text-xs rounded-xl hover:bg-[#f6f3f2] transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Saved Delivery Addresses */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e4e2e1] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0eded] pb-3">
            <div>
              <h3 className="font-headline font-bold text-sm sm:text-base text-[#1b1c1c] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#a83300] text-[20px]">location_on</span>
                Saved Delivery Addresses
              </h3>
              <p className="text-[11px] text-[#5c4037]">Manage and set default delivery spots in Nashik</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAddressToEdit(null);
                setAddressModalMode('add');
                setAddressModalOpen(true);
              }}
              className="px-3 py-1.5 bg-[#a83300] hover:bg-[#d24200] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
              <span>+ Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {addresses.map((addr) => {
              const isSelected = selectedAddress.id === addr.id;

              return (
                <div
                  key={addr.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-[#a83300] bg-[#fff8f5] shadow-xs'
                      : 'border-[#e4e2e1] bg-[#fcfaf9] hover:bg-white hover:border-[#ffdbd0]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-[#a83300] text-white' : 'bg-[#f6f3f2] text-[#5c4037]'
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">
                        {addr.label === 'Home' ? 'home' : addr.label === 'Work' ? 'business' : 'pin_drop'}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-headline font-bold text-sm text-[#1b1c1c]">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold bg-[#29695b] text-white px-1.5 py-0.2 rounded-full">
                            Default
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-[10px] font-bold text-[#a83300] bg-[#ffdbd0] px-1.5 py-0.2 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5c4037] mt-1 line-clamp-2 leading-relaxed">
                        {addr.addressLine}
                      </p>
                      {addr.phone && (
                        <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">phone</span>
                          {addr.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#f0eded] text-xs">
                    <button
                      type="button"
                      onClick={() => setDefaultAddress(addr.id)}
                      className={`text-[11px] font-bold transition-colors ${
                        addr.isDefault
                          ? 'text-[#29695b] cursor-default'
                          : 'text-[#5c4037] hover:text-[#a83300]'
                      }`}
                    >
                      {addr.isDefault ? '✓ Default Address' : 'Set as Default'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAddressToEdit(addr);
                          setAddressModalMode('edit');
                          setAddressModalOpen(true);
                        }}
                        className="px-2 py-1 text-gray-600 hover:text-[#a83300] hover:bg-[#ffdbd0]/50 rounded-lg font-semibold flex items-center gap-0.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        <span>Edit</span>
                      </button>

                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteAddress(addr.id)}
                          className="px-2 py-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg font-semibold flex items-center gap-0.5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partner Portals shortcut */}
        <div className="bg-gradient-to-r from-[#29695b] to-[#065043] text-white rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-headline font-bold text-sm">BiteGo Business Ecosystem</h3>
          <p className="text-xs text-[#afefdd]">Switch roles to preview partner and management views defined in the architecture PRD:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => { setRole('restaurant'); setCurrentScreen('restaurant_portal'); }}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-left transition-colors"
            >
              <div className="text-white font-bold">Restaurant Portal</div>
              <div className="text-[10px] text-[#afefdd]">Spice Route kitchen</div>
            </button>
            <button
              onClick={() => { setRole('delivery'); setCurrentScreen('delivery_portal'); }}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-left transition-colors"
            >
              <div className="text-white font-bold">Rider App</div>
              <div className="text-[10px] text-[#afefdd]">Alex M. active job</div>
            </button>
            <button
              onClick={() => { setRole('admin'); setCurrentScreen('admin_portal'); }}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-left transition-colors"
            >
              <div className="text-white font-bold">Admin Console</div>
              <div className="text-[10px] text-[#afefdd]">Platform analytics</div>
            </button>
          </div>
        </div>
      </main>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">logout</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-headline font-bold text-base text-[#1b1c1c]">Log Out of BiteGo?</h3>
              <p className="text-xs text-[#5c4037]">
                You can sign back in at any time with your phone number or email.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 border border-[#e4e2e1] rounded-xl text-xs font-bold hover:bg-[#f6f3f2]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setShowLogoutConfirm(false);
                }}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Delivery Address Modal */}
      <DeliveryAddressModal
        isOpen={addressModalOpen}
        onClose={() => {
          setAddressModalOpen(false);
          setAddressToEdit(null);
        }}
        initialMode={addressModalMode}
        editAddressTarget={addressToEdit}
      />

      <BottomNav />
    </div>
  );
};

