import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { DeliveryAddressModal } from '../components/DeliveryAddressModal';
import confetti from 'canvas-confetti';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    setCurrentScreen,
    selectedAddress,
    addresses,
    setSelectedAddress,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    placeOrder,
    currentUser,
    setAuthInitialMode
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState<'select' | 'add' | 'edit'>('select');
  const [selectedInstruction, setSelectedInstruction] = useState<string>('Leave at door');
  const [customInstruction, setCustomInstruction] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  // Fallback demo cart items if cart is empty so users can immediately test checkout matching Image 6!
  const hasCart = cart.length > 0;
  const demoItems = [
    {
      name: 'Classic Cheeseburger',
      quantity: 2,
      price: 225,
      total: 450,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx4ei_PyuMpYH5prRYFMlrrTQhv9s7qEqlwjHIW1Hhhp1-COI4L5wxk8zfLZ7ovX96dU4GOzMPwTcJYJYFPOPRN7_0zDu4yYYYWgdxu7ZcyzIURyCO9suTcDSc10xCNqOSYEURND6W6jGER6N7iak6zw29KtF0isYf-Wvvr_tfUEaHeUoCyX3keJTNszrb1KswqoYRwTpvviHY2pocuBYT-ZG1HJtJFaLD_x_f1JLlI26_kw4xi_g'
    },
    {
      name: 'Pepperoni Pizza (Large)',
      quantity: 1,
      price: 650,
      total: 650,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy32mBAt5JwkqN_yv3X5rv8eXyBW4dYzRk91ojw9BTU4QpdM74NyvS7prGDK8P4SeKk9ieXS4zUzjkHZilgun9xNJZvUE2jcy4g6GptIaCmZdckR8G0rFW7mIPSY_Io_zkYj0OHTFHAH4xpM0hDF9k37xrB5ItxX7YN5-HRjo4W1eodmngZyQYHBUmKMdZwpeWwmgw9-KJtWYSfGhoGWPh8Q3KSKyYeKLbipXtApUbmh20dtqZ5Ig'
    }
  ];

  const itemTotal = hasCart
    ? cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0)
    : 1100;

  const deliveryFee = itemTotal > 500 ? 40 : 40;
  const taxes = hasCart ? Math.round(itemTotal * 0.05) : 55;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.min((itemTotal * appliedCoupon.discountValue) / 100, appliedCoupon.maxDiscount || 999);
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const finalTotal = Math.max(0, itemTotal + deliveryFee + taxes - discount);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, isError: !res.success });
  };

  const handlePlaceOrder = () => {
    setIsPlacing(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      placeOrder(paymentMethod);
      setIsPlacing(false);
    }, 700);
  };

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] min-h-screen pb-32 md:pb-12">
      <Header
        title="Checkout"
        showBack={true}
        onBack={() => setCurrentScreen('home')}
        hideSearch={true}
      />

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-4 md:py-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="flex-1 flex flex-col gap-6 w-full">
          {/* Guest Sign-In Notice Banner */}
          {!currentUser && (
            <div className="bg-gradient-to-r from-[#ffdbd0]/60 to-orange-50 p-4 rounded-xl border border-[#e5beb2] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#a83300] text-[24px]">account_circle</span>
                <div>
                  <h4 className="font-bold text-xs text-[#1b1c1c]">Ordering as Guest?</h4>
                  <p className="text-[11px] text-[#5c4037]">Sign in to apply member coupons and track your rider in real time.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAuthInitialMode('login');
                  setCurrentScreen('auth');
                }}
                className="px-3.5 py-1.5 bg-[#a83300] hover:bg-[#d24200] text-white text-xs font-bold rounded-lg shrink-0 transition-colors shadow-xs"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Delivery Address Card */}
          <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#e4e2e1] flex flex-col gap-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0eded] pb-3">
              <div>
                <h2 className="font-headline font-bold text-base sm:text-lg text-[#1b1c1c] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#a83300] text-[20px]">local_shipping</span>
                  Delivery Address & Instructions
                </h2>
                <p className="text-[11px] text-[#5c4037]">Confirm your drop-off location in Nashik</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setAddressModalMode('add');
                    setIsAddressModalOpen(true);
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#a83300] hover:bg-[#ffdbd0]/50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">add_location_alt</span>
                  <span>+ Add New</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddressModalMode('select');
                    setIsAddressModalOpen(true);
                  }}
                  className="px-3 py-1 bg-[#ffdbd0] text-[#a83300] hover:bg-[#ffb59d] font-bold text-xs rounded-lg transition-colors"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Quick Address Switcher Chips (Horizontal Scrollable on mobile, flex-wrap on desktop) */}
            {addresses.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#5c4037] shrink-0">
                  Switch:
                </span>
                {addresses.map(addr => {
                  const isSelected = selectedAddress.id === addr.id;
                  return (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => setSelectedAddress(addr)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all border ${
                        isSelected
                          ? 'bg-[#a83300] text-white border-[#a83300] shadow-2xs'
                          : 'bg-[#f6f3f2] hover:bg-[#eae8e7] text-[#1b1c1c] border-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {addr.label === 'Home' ? 'home' : addr.label === 'Work' ? 'business' : 'pin_drop'}
                      </span>
                      <span>{addr.label}</span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active Selected Address Detail Card */}
            <div className="p-3.5 bg-gradient-to-br from-[#fff8f5] to-[#fcfaf9] rounded-xl border border-[#ffdbd0] flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#a83300] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <span className="material-symbols-outlined text-[20px] fill">location_on</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-headline font-bold text-sm text-[#1b1c1c]">
                      {selectedAddress.label}
                    </span>
                    {selectedAddress.isDefault && (
                      <span className="text-[10px] font-bold bg-[#29695b] text-white px-1.5 py-0.2 rounded-full">
                        Default
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-[#a83300] bg-white border border-[#ffb59d] px-2 py-0.2 rounded-full">
                      Deliver to this address
                    </span>
                  </div>
                  <p className="text-xs text-[#5c4037] mt-1.5 leading-relaxed">
                    {selectedAddress.addressLine}
                  </p>
                  <p className="text-xs font-semibold text-[#1b1c1c] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#5c4037]">call</span>
                    <span>Contact: {selectedAddress.phone || '+91 9876543210'}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAddressModalMode('edit');
                  setIsAddressModalOpen(true);
                }}
                className="self-start sm:self-center px-3 py-1.5 border border-[#e4e2e1] bg-white hover:bg-gray-50 rounded-xl text-xs font-bold text-[#5c4037] hover:text-[#1b1c1c] transition-colors flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
                <span>Edit</span>
              </button>
            </div>

            {/* Delivery Instructions Selection */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-[#1b1c1c] mb-1.5">
                Delivery Instructions (Optional):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                {[
                  { label: 'Leave at door', icon: 'door_front' },
                  { label: 'Avoid calling', icon: 'volume_off' },
                  { label: 'Ring bell twice', icon: 'notifications_active' },
                  { label: 'Hand to guard', icon: 'security' }
                ].map(inst => (
                  <button
                    key={inst.label}
                    type="button"
                    onClick={() => setSelectedInstruction(inst.label === selectedInstruction ? '' : inst.label)}
                    className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition-all text-left ${
                      selectedInstruction === inst.label
                        ? 'border-[#a83300] bg-[#ffdbd0]/50 text-[#a83300] shadow-2xs font-bold'
                        : 'border-[#e4e2e1] bg-[#f6f3f2] text-[#5c4037] hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px] shrink-0">{inst.icon}</span>
                    <span className="truncate">{inst.label}</span>
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={customInstruction}
                onChange={e => setCustomInstruction(e.target.value)}
                placeholder="Add special instructions for rider (e.g., gate code, landmark)..."
                className="w-full px-3 py-2 bg-[#f6f3f2] rounded-xl text-xs outline-none border border-[#e4e2e1] focus:bg-white focus:ring-1 focus:ring-[#a83300] transition-all"
              />
            </div>
          </section>

          {/* Order Summary Card */}
          <section className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-[#e4e2e1] flex flex-col gap-4">
            <h2 className="font-headline font-bold text-lg md:text-xl text-[#1b1c1c]">Order Summary</h2>

            <div className="flex flex-col divide-y divide-[#f0eded]">
              {hasCart ? (
                cart.map((ci) => (
                  <div key={ci.item.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg bg-[#eae8e7] overflow-hidden shrink-0">
                        <img src={ci.item.image} alt={ci.item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-[#1b1c1c]">{ci.item.name}</span>
                        <span className="text-xs text-[#5c4037]">x{ci.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[#1b1c1c]">₹{ci.item.price * ci.quantity}</span>
                  </div>
                ))
              ) : (
                demoItems.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg bg-[#eae8e7] overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-[#1b1c1c]">{item.name}</span>
                        <span className="text-xs text-[#5c4037]">x{item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[#1b1c1c]">₹{item.total}</span>
                  </div>
                ))
              )}
            </div>

            {/* Apply Coupon */}
            <div className="pt-2 border-t border-[#f0eded]">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5c4037] text-[18px]">
                    local_offer
                  </span>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Apply Coupon (e.g. BITE50)"
                    className="w-full pl-9 pr-3 py-2 bg-[#fbf9f8] rounded-lg border border-[#e5beb2] focus:border-[#29695b] outline-none text-xs text-[#1b1c1c]"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="bg-[#29695b] text-white px-5 py-2 rounded-lg font-bold text-xs hover:bg-[#065043] transition-colors active:scale-95"
                >
                  Apply
                </button>
              </div>

              {couponMsg && (
                <p className={`text-xs mt-1.5 font-medium ${couponMsg.isError ? 'text-[#ba1a1a]' : 'text-[#29695b]'}`}>
                  {couponMsg.text}
                </p>
              )}

              {appliedCoupon && !couponMsg && (
                <div className="flex items-center justify-between bg-[#acedda]/30 p-2 rounded-lg mt-2 text-xs text-[#2e6d5f]">
                  <span>Coupon <strong>{appliedCoupon.code}</strong> applied!</span>
                  <button onClick={removeCoupon} className="font-bold text-[#ba1a1a]">Remove</button>
                </div>
              )}
            </div>

            {/* Bill Details */}
            <div className="pt-3 border-t border-[#f0eded] flex flex-col gap-2">
              <div className="flex justify-between text-xs text-[#5c4037]">
                <span>Item Total</span>
                <span>₹{itemTotal}</span>
              </div>
              <div className="flex justify-between text-xs text-[#5c4037]">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-xs text-[#5c4037]">
                <span>Taxes & Charges</span>
                <span>₹{taxes}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-[#29695b] font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-[#1b1c1c] pt-2 border-t border-[#f0eded]">
                <span>To Pay</span>
                <span className="text-[#a83300] font-headline text-lg">₹{finalTotal}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Payment Column */}
        <div className="flex-1 w-full flex flex-col gap-6 lg:sticky lg:top-[90px]">
          <section className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-[#e4e2e1] flex flex-col gap-3">
            <h2 className="font-headline font-bold text-lg md:text-xl flex items-center gap-2 text-[#1b1c1c]">
              <span className="material-symbols-outlined text-[#29695b] fill">shield</span>
              Payment Method
            </h2>

            <div className="flex flex-col gap-2.5">
              {/* UPI */}
              <label
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#29695b] bg-[#acedda]/25'
                    : 'border-[#e4e2e1] bg-white hover:bg-[#f6f3f2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#29695b]">qr_code_scanner</span>
                  <span className="font-bold text-xs md:text-sm text-[#1b1c1c]">UPI (Popular in India)</span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="accent-[#29695b] w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Credit/Debit Card */}
              <label
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#29695b] bg-[#acedda]/25'
                    : 'border-[#e4e2e1] bg-white hover:bg-[#f6f3f2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#5c4037]">credit_card</span>
                  <span className="font-bold text-xs md:text-sm text-[#1b1c1c]">Credit/Debit Card</span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="accent-[#29695b] w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Net Banking */}
              <label
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-[#29695b] bg-[#acedda]/25'
                    : 'border-[#e4e2e1] bg-white hover:bg-[#f6f3f2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#5c4037]">account_balance</span>
                  <span className="font-bold text-xs md:text-sm text-[#1b1c1c]">Net Banking</span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'netbanking'}
                  onChange={() => setPaymentMethod('netbanking')}
                  className="accent-[#29695b] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </section>

          {/* Desktop Place Order CTA */}
          <div className="hidden md:block">
            <button
              disabled={isPlacing}
              onClick={handlePlaceOrder}
              className="w-full bg-[#a83300] hover:bg-[#d24200] text-white py-4 px-6 rounded-xl font-headline font-bold text-base flex justify-between items-center shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>{isPlacing ? 'Processing Order...' : 'Place Order'}</span>
              <span>₹{finalTotal}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom CTA */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white p-4 shadow-[0px_-8px_24px_rgba(0,0,0,0.1)] z-40 border-t border-[#e4e2e1]">
        <button
          disabled={isPlacing}
          onClick={handlePlaceOrder}
          className="w-full bg-[#a83300] hover:bg-[#d24200] text-white py-3.5 px-6 rounded-xl font-headline font-bold text-base flex justify-between items-center active:scale-95 transition-all"
        >
          <span>{isPlacing ? 'Processing...' : 'Place Order'}</span>
          <span>₹{finalTotal}</span>
        </button>
      </div>

      {/* Responsive Delivery Address Modal */}
      <DeliveryAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        initialMode={addressModalMode}
      />
    </div>
  );
};
