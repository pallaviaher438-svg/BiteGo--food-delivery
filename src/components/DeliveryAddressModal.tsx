import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryAddress } from '../types';

interface DeliveryAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'select' | 'add' | 'edit';
  editAddressTarget?: DeliveryAddress | null;
  onAddressSelected?: (addr: DeliveryAddress) => void;
}

const NASHIK_LOCALITIES = [
  'College Road',
  'Gangapur Road',
  'Indira Nagar',
  'Govind Nagar',
  'Mahatma Nagar',
  'Panchavati',
  'Nashik Road',
  'Canada Corner',
  'Tidke Colony',
  'Pathardi Phata'
];

export const DeliveryAddressModal: React.FC<DeliveryAddressModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'select',
  editAddressTarget = null,
  onAddressSelected
}) => {
  const {
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    currentUser
  } = useApp();

  const [mode, setMode] = useState<'select' | 'add' | 'edit'>(initialMode);
  const [editingId, setEditingId] = useState<string | null>(editAddressTarget?.id || null);

  // Form State
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [customLabel, setCustomLabel] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [streetArea, setStreetArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 9876543210');
  const [isDefault, setIsDefault] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      if (editAddressTarget) {
        populateForm(editAddressTarget);
      } else {
        resetForm();
      }
    }
  }, [isOpen, initialMode, editAddressTarget]);

  const populateForm = (addr: DeliveryAddress) => {
    setEditingId(addr.id);
    setLabel(addr.label);
    setPhone(addr.phone || currentUser?.phone || '+91 9876543210');
    setIsDefault(!!addr.isDefault);

    // Parse address parts if possible
    const parts = addr.addressLine.split(',');
    if (parts.length >= 2) {
      setHouseNo(parts[0].trim());
      setStreetArea(parts.slice(1).join(',').trim());
    } else {
      setHouseNo('');
      setStreetArea(addr.addressLine);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setLabel('Home');
    setCustomLabel('');
    setHouseNo('');
    setStreetArea('');
    setLandmark('');
    setPhone(currentUser?.phone || '+91 9876543210');
    setIsDefault(addresses.length === 0);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Simulate Geolocation in Nashik
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      const randomLoc = NASHIK_LOCALITIES[Math.floor(Math.random() * NASHIK_LOCALITIES.length)];
      const generatedAddr = `Flat 402, Royal Residency, near ${randomLoc}, Nashik 422005`;
      
      const newAddr = addAddress({
        label: 'Other',
        addressLine: generatedAddr,
        phone: currentUser?.phone || '+91 9876543210',
        isDefault: false
      });
      setSelectedAddress(newAddr);
      if (onAddressSelected) onAddressSelected(newAddr);
      showToast(`📍 Located at ${randomLoc}, Nashik!`);
      setTimeout(() => onClose(), 600);
    }, 1000);
  };

  const handleSelectAddress = (addr: DeliveryAddress) => {
    setSelectedAddress(addr);
    if (onAddressSelected) onAddressSelected(addr);
    showToast(`Delivering to ${addr.label} (${addr.addressLine.split(',')[0]})`);
    setTimeout(() => onClose(), 250);
  };

  const handleStartEdit = (addr: DeliveryAddress, e: React.MouseEvent) => {
    e.stopPropagation();
    populateForm(addr);
    setMode('edit');
  };

  const handleDeleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (addresses.length <= 1) {
      showToast('You must have at least one delivery address.');
      return;
    }
    deleteAddress(id);
    setDeleteConfirmId(null);
    showToast('Address removed successfully');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetArea.trim()) {
      showToast('Please enter your area or street name in Nashik.');
      return;
    }

    const fullAddress = [
      houseNo.trim(),
      streetArea.trim(),
      landmark.trim() ? `Near ${landmark.trim()}` : '',
      'Nashik 422005'
    ].filter(Boolean).join(', ');

    if (mode === 'edit' && editingId) {
      updateAddress(editingId, {
        label,
        addressLine: fullAddress,
        phone: phone.trim() || '+91 9876543210',
        isDefault
      });
      showToast('Address updated successfully!');
    } else {
      const created = addAddress({
        label,
        addressLine: fullAddress,
        phone: phone.trim() || '+91 9876543210',
        isDefault
      });
      if (isDefault || addresses.length === 0) {
        setSelectedAddress(created);
        if (onAddressSelected) onAddressSelected(created);
      }
      showToast('New address saved!');
    }

    setMode('select');
    resetForm();
  };

  if (!isOpen) return null;

  const filteredAddresses = addresses.filter(addr =>
    addr.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    addr.addressLine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#e4e2e1] animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Pull/Drag Indicator */}
        <div className="w-full pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3.5 sm:py-4 border-b border-[#e4e2e1] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            {mode !== 'select' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('select');
                  resetForm();
                }}
                className="p-1.5 -ml-1.5 rounded-full hover:bg-[#f6f3f2] text-[#1b1c1c] transition-colors"
                title="Back to saved addresses"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#ffdbd0] text-[#a83300] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </div>
            )}
            <div>
              <h3 className="font-headline font-bold text-base text-[#1b1c1c]">
                {mode === 'select'
                  ? 'Delivery Address'
                  : mode === 'add'
                  ? 'Add New Delivery Address'
                  : 'Edit Delivery Address'}
              </h3>
              <p className="text-[11px] text-[#5c4037]">
                {mode === 'select' ? 'Select or add your location in Nashik' : 'Provide exact door and street details'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-[#f6f3f2] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Toast Alert Banner */}
        {toastMessage && (
          <div className="bg-[#29695b] text-white text-xs py-2 px-4 text-center font-bold animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {mode === 'select' ? (
            <>
              {/* Quick Actions (GPS + Search) */}
              <div className="space-y-2.5">
                {/* Geolocation Button */}
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="w-full p-3 bg-gradient-to-r from-[#ffdbd0]/50 to-orange-50/70 hover:from-[#ffdbd0] hover:to-orange-100 border border-[#ffb59d] rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99] group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#a83300] text-white flex items-center justify-center shadow-xs shrink-0">
                      <span className={`material-symbols-outlined text-[20px] ${isLocating ? 'animate-spin' : ''}`}>
                        {isLocating ? 'sync' : 'my_location'}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#a83300] block">
                        {isLocating ? 'Detecting GPS Location...' : 'Use Current GPS Location'}
                      </span>
                      <span className="text-[11px] text-[#5c4037]">
                        Auto-detect nearest colony & landmark in Nashik
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#a83300] text-[18px] group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </button>

                {/* Search Bar for Nashik Localities */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search saved addresses or Nashik localities..."
                    className="w-full pl-9 pr-8 py-2.5 bg-[#f6f3f2] rounded-xl text-xs outline-none border border-[#e4e2e1] focus:bg-white focus:ring-1 focus:ring-[#a83300] transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                    </button>
                  )}
                </div>

                {/* Popular Localities Chips */}
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#5c4037] block mb-1.5">
                    Popular Nashik Hubs:
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
                    {NASHIK_LOCALITIES.slice(0, 6).map(loc => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          const matching = addresses.find(a => a.addressLine.toLowerCase().includes(loc.toLowerCase()));
                          if (matching) {
                            handleSelectAddress(matching);
                          } else {
                            setStreetArea(loc);
                            setMode('add');
                          }
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-[#ffdbd0] text-[#5c4037] hover:text-[#a83300] border border-[#e4e2e1] hover:border-[#ffdbd0] rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all shrink-0"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Saved Addresses List */}
              <div className="space-y-2.5 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider">
                    Saved Addresses ({filteredAddresses.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setMode('add');
                    }}
                    className="text-xs font-bold text-[#a83300] hover:text-[#d24200] flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    <span>+ Add New Address</span>
                  </button>
                </div>

                {filteredAddresses.length === 0 ? (
                  <div className="p-6 text-center bg-[#f6f3f2] rounded-2xl border border-dashed border-[#e4e2e1] space-y-2">
                    <span className="material-symbols-outlined text-[28px] text-gray-400">location_off</span>
                    <p className="text-xs text-[#5c4037] font-medium">No matching address found.</p>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setMode('add');
                      }}
                      className="px-3 py-1.5 bg-[#a83300] text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1"
                    >
                      <span>Create New Address</span>
                    </button>
                  </div>
                ) : (
                  filteredAddresses.map(addr => {
                    const isSelected = selectedAddress.id === addr.id;
                    const isDeleting = deleteConfirmId === addr.id;

                    return (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'border-[#a83300] bg-[#fff8f5] shadow-xs'
                            : 'border-[#e4e2e1] hover:border-[#ffdbd0] bg-white hover:bg-[#faf9f8]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'bg-[#a83300] text-white' : 'bg-[#f6f3f2] text-[#5c4037]'
                            }`}>
                              <span className="material-symbols-outlined text-[18px]">
                                {addr.label === 'Home' ? 'home' : addr.label === 'Work' ? 'business' : 'pin_drop'}
                              </span>
                            </div>
                            <div className="min-w-0">
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
                                  <span className="text-[10px] font-bold text-[#a83300] bg-[#ffdbd0] px-2 py-0.2 rounded-full flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-[12px]">check</span>
                                    Delivering Here
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

                          {/* Quick Edit/Delete Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handleStartEdit(addr, e)}
                              className="p-1.5 text-gray-400 hover:text-[#a83300] hover:bg-[#ffdbd0]/50 rounded-lg transition-colors"
                              title="Edit Address"
                            >
                              <span className="material-symbols-outlined text-[17px]">edit</span>
                            </button>
                            {addresses.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirmId(isDeleting ? null : addr.id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Address"
                              >
                                <span className="material-symbols-outlined text-[17px]">delete</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Inline Delete Confirmation */}
                        {isDeleting && (
                          <div
                            onClick={e => e.stopPropagation()}
                            className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-2 text-xs text-red-900 animate-in fade-in"
                          >
                            <span className="font-semibold">Delete this address?</span>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-600 font-bold hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteAddress(addr.id, e)}
                                className="px-2.5 py-1 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-2xs"
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            /* Mode === 'add' or 'edit': Full Address Input Form */
            <form onSubmit={handleSaveAddress} className="space-y-4">
              {/* Address Label Selector */}
              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] mb-1.5">
                  Save Address As:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setLabel(type)}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                        label === type
                          ? 'border-[#a83300] bg-[#ffdbd0]/50 text-[#a83300] shadow-2xs'
                          : 'border-[#e4e2e1] bg-white text-[#5c4037] hover:bg-[#f6f3f2]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[17px]">
                        {type === 'Home' ? 'home' : type === 'Work' ? 'business' : 'pin_drop'}
                      </span>
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* House / Flat / Block No */}
              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] mb-1">
                  House / Flat / Floor / Building Name *
                </label>
                <input
                  type="text"
                  required
                  value={houseNo}
                  onChange={e => setHouseNo(e.target.value)}
                  placeholder="e.g. Flat 302, Blossom Heights, Wing B"
                  className="w-full p-2.5 bg-[#f6f3f2] rounded-xl text-xs outline-none border border-[#e4e2e1] focus:bg-white focus:ring-1 focus:ring-[#a83300]"
                />
              </div>

              {/* Street / Locality in Nashik */}
              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] mb-1">
                  Area / Street / Locality in Nashik *
                </label>
                <input
                  type="text"
                  required
                  value={streetArea}
                  onChange={e => setStreetArea(e.target.value)}
                  placeholder="e.g. College Road / Gangapur Road / Indira Nagar"
                  className="w-full p-2.5 bg-[#f6f3f2] rounded-xl text-xs outline-none border border-[#e4e2e1] focus:bg-white focus:ring-1 focus:ring-[#a83300]"
                />
                {/* Locality suggestions */}
                <div className="flex gap-1.5 overflow-x-auto mt-2 pb-1 hide-scrollbar">
                  {NASHIK_LOCALITIES.slice(0, 5).map(loc => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setStreetArea(prev => prev ? `${prev}, ${loc}` : loc)}
                      className="px-2 py-0.5 bg-gray-100 hover:bg-[#ffdbd0] text-[#5c4037] hover:text-[#a83300] rounded text-[10px] font-semibold whitespace-nowrap transition-colors"
                    >
                      + {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Landmark (Optional) */}
              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite City Centre Mall / Near Big Bazaar"
                  className="w-full p-2.5 bg-[#f6f3f2] rounded-xl text-xs outline-none border border-[#e4e2e1] focus:bg-white focus:ring-1 focus:ring-[#a83300]"
                />
              </div>

              {/* Recipient Phone Number */}
              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] mb-1">
                  Delivery Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 bg-[#f6f3f2] rounded-xl text-xs outline-none border border-[#e4e2e1] focus:bg-white focus:ring-1 focus:ring-[#a83300]"
                />
              </div>

              {/* Set as Default checkbox */}
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#f6f3f2] border border-[#e4e2e1] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={e => setIsDefault(e.target.checked)}
                  className="w-4 h-4 accent-[#a83300] rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#1b1c1c] block">Set as default delivery address</span>
                  <span className="text-[11px] text-[#5c4037]">Will be automatically pre-selected for faster checkout</span>
                </div>
              </label>

              {/* Form Actions */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('select');
                    resetForm();
                  }}
                  className="flex-1 py-3 border border-[#e4e2e1] hover:bg-[#f6f3f2] text-[#5c4037] font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#a83300] hover:bg-[#d24200] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[17px]">check_circle</span>
                  <span>{mode === 'edit' ? 'Update Address' : 'Save & Select'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer on Select mode */}
        {mode === 'select' && (
          <div className="p-4 border-t border-[#e4e2e1] bg-[#faf9f8] flex items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-[#5c4037] min-w-0">
              <span className="font-bold block text-[#1b1c1c] truncate">
                Active: {selectedAddress.label}
              </span>
              <span className="text-[11px] text-[#5c4037] truncate block">
                {selectedAddress.addressLine}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#a83300] hover:bg-[#d24200] text-white rounded-xl text-xs font-bold shadow-xs shrink-0 transition-colors"
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
