import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { DriverChatModal, DriverCallModal, ReceiptModal, SupportModal, ReviewModal } from '../components/Modals';

export const TrackOrderView: React.FC = () => {
  const {
    orders,
    activeOrderId,
    setCurrentScreen,
    updateOrderStatus,
    addReview
  } = useApp();

  const [activeModal, setActiveModal] = useState<'chat' | 'call' | 'receipt' | 'support' | 'review' | null>(null);

  const order = orders.find(o => o.id === activeOrderId) || orders[0];

  const steps = [
    { key: 'confirmed', label: 'Confirmed', icon: 'check' },
    { key: 'preparing', label: 'Preparing', icon: 'soup_kitchen' },
    { key: 'on_the_way', label: 'On the way', icon: 'local_shipping' },
    { key: 'delivered', label: 'Delivered', icon: 'home' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'confirmed': return 0;
      case 'preparing': return 1;
      case 'on_the_way': return 2;
      case 'delivered': return 3;
      default: return 2;
    }
  };

  const currentStepIdx = getStepIndex(order.status);
  const progressPercent = ((currentStepIdx) / (steps.length - 1)) * 100;

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] min-h-screen flex flex-col pb-16">
      {/* Header */}
      <Header
        title="Track Order"
        showBack={true}
        onBack={() => setCurrentScreen('home')}
        hideSearch={true}
      />

      <main className="flex-grow flex flex-col w-full max-w-[640px] mx-auto pb-8">
        {/* Map Header Preview */}
        <div
          className="w-full h-[280px] md:h-[320px] bg-[#eae8e7] relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDRfTRw8GBuJfZ8LwFbJzE57kY2grmp3JezB_XGvdpWB5V_LT7ZcciJ-epCbGDUzIsxkghs8xfG543in-XhqxqZmhcapXwt6MGd0-iq4oEHBHsboKfyRAAfJSI756sfk8cP4VekYZ63NYx5o1WTR81PicAUvHZiVG9sXJcW_eZK37w56Q4uPEILcJFGI7hwiMA3tbyHjRLzD1CXLGVBJITahrsAJYiJ-bscOt3tXUtJ6-8JXFTPpqI')`
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />

          {/* Delivery Partner Pin (Animated) */}
          <div className="absolute top-1/2 left-[48%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 floating-pin">
            <div className="bg-[#a83300] text-white p-2 rounded-full shadow-xl pulse-animation flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] fill">two_wheeler</span>
            </div>
            <div className="bg-[#1b1c1c] text-white text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 shadow-md">
              {order.deliveryPartner.name}
            </div>
          </div>

          {/* Destination Home Pin */}
          <div className="absolute bottom-1/4 right-[28%] flex flex-col items-center z-10">
            <div className="bg-[#29695b] text-white p-1.5 rounded-full shadow-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] fill">home</span>
            </div>
            <div className="bg-white text-[#1b1c1c] text-[9px] font-bold px-1.5 py-0.5 rounded shadow mt-1">
              Home
            </div>
          </div>

          {/* Dashed Route SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 230 160 Q 280 180 320 220"
              fill="none"
              stroke="#a83300"
              strokeWidth="4"
              strokeDasharray="6 4"
              className="opacity-90"
            />
          </svg>

          {/* Live tracking badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#29695b] flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            LIVE GPS TRACKING • NASHIK
          </div>
        </div>

        {/* Content Cards */}
        <div className="px-4 -mt-6 relative z-20 space-y-4">
          {/* Status Card */}
          <section className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center border border-[#e4e2e1]">
            <h2 className="font-headline font-bold text-3xl md:text-4xl text-[#a83300] mb-0.5">
              {order.status === 'delivered' ? 'Delivered!' : `${order.estimatedMinutes} mins`}
            </h2>
            <p className="text-xs md:text-sm text-[#5c4037] mb-6">
              {order.status === 'delivered' ? 'Enjoy your meal!' : `Estimated Arrival: ${order.estimatedArrival}`}
            </p>

            {/* Stepper */}
            <div className="w-full flex items-center justify-between relative mt-2 px-2">
              {/* Background Track */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#e4e2e1] -z-10 rounded-full" />
              {/* Active Track */}
              <div
                className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-[#a83300] -z-10 rounded-full transition-all duration-700"
                style={{ width: `calc(${progressPercent}% - 24px)` }}
              />

              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.key} className="flex flex-col items-center bg-white">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shadow-sm transition-all ${
                      isCurrent
                        ? 'bg-[#a83300] pulse-animation scale-110'
                        : isPassed
                        ? 'bg-[#a83300]'
                        : 'bg-[#e4e2e1] text-[#5c4037]'
                    }`}>
                      <span className="material-symbols-outlined text-[16px] fill">
                        {step.icon}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-full flex justify-between mt-3 text-[11px] text-[#5c4037] px-1 font-medium">
              {steps.map((step, idx) => {
                const isCurrent = idx === currentStepIdx;
                return (
                  <span
                    key={step.key}
                    className={`text-center ${isCurrent ? 'text-[#a83300] font-bold' : ''}`}
                  >
                    {step.label}
                  </span>
                );
              })}
            </div>

            {/* Simulation controls for demo */}
            <div className="w-full mt-5 pt-3 border-t border-[#f0eded] flex items-center justify-between text-[11px]">
              <span className="text-[#5c4037] font-semibold">Simulate Status:</span>
              <div className="flex gap-1.5">
                {(['confirmed', 'preparing', 'on_the_way', 'delivered'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateOrderStatus(order.id, st)}
                    className={`px-2 py-1 rounded text-[10px] font-bold capitalize transition-colors ${
                      order.status === st
                        ? 'bg-[#a83300] text-white'
                        : 'bg-[#f0eded] text-[#5c4037] hover:bg-[#ffdbd0]'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Driver Info Card */}
          <section className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between border border-[#e4e2e1]">
            <div className="flex items-center gap-3">
              <img
                src={order.deliveryPartner.avatar}
                alt={order.deliveryPartner.name}
                className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-[#ffdbd0]"
              />
              <div className="text-left">
                <h3 className="font-headline font-bold text-base text-[#1b1c1c] leading-tight">
                  {order.deliveryPartner.name}
                </h3>
                <div className="flex items-center text-[#5c4037] text-xs mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-amber-500 fill mr-1">star</span>
                  <span>{order.deliveryPartner.rating} ({order.deliveryPartner.deliveriesCount.toLocaleString()} deliveries)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal('chat')}
                aria-label="Message Driver"
                className="w-10 h-10 rounded-full border border-[#907065]/40 flex items-center justify-center text-[#29695b] hover:bg-[#f6f3f2] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
              </button>
              <button
                onClick={() => setActiveModal('call')}
                aria-label="Call Driver"
                className="w-10 h-10 rounded-full bg-[#29695b] text-white flex items-center justify-center hover:bg-[#065043] shadow-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px] fill">call</span>
              </button>
            </div>
          </section>

          {/* Delivery Address Destination Card */}
          <section className="bg-white rounded-2xl shadow-xs p-4 sm:p-5 border border-[#e4e2e1] text-left space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#5c4037] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#a83300] text-[16px]">location_on</span>
                DELIVERY DESTINATION
              </span>
              <span className="text-[10px] font-bold bg-[#ffdbd0] text-[#a83300] px-2 py-0.5 rounded-full">
                Nashik 422005
              </span>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <div className="w-8 h-8 rounded-xl bg-[#29695b] text-white flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">home</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-headline font-bold text-sm text-[#1b1c1c]">
                  {order.deliveryAddress || 'Flat 402, Royal Residency, College Road, Nashik'}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-[#5c4037] flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">door_front</span>
                    <span>Instructions: Leave at door</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">phone</span>
                    <span>Recipient: +91 9876543210</span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Order Details Summary Card */}
          <section className="bg-white rounded-2xl shadow-sm p-5 border border-[#e4e2e1]">
            <h3 className="font-bold text-[#5c4037] mb-3 uppercase tracking-wider text-[11px]">
              ORDER DETAILS
            </h3>

            <div className="flex justify-between items-start mb-3">
              <div className="text-left">
                <p className="font-headline font-bold text-sm text-[#1b1c1c]">
                  {order.restaurantName}
                </p>
                <p className="text-xs text-[#5c4037]">
                  Order #{order.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setActiveModal('receipt')}
                className="text-[#29695b] font-bold text-xs hover:underline cursor-pointer"
              >
                Receipt
              </button>
            </div>

            <div className="text-xs space-y-1 text-[#5c4037] pb-3 border-b border-[#f0eded]">
              {order.items.map((ci, i) => (
                <div key={i} className="flex justify-between">
                  <span>{ci.quantity}x {ci.item.name}</span>
                  <span className="font-medium text-[#1b1c1c]">₹{ci.item.price * ci.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 flex justify-between items-center text-xs">
              <span className="text-[#5c4037]">Need help with this order?</span>
              <button
                onClick={() => setActiveModal('support')}
                className="flex items-center gap-1 text-[#ba1a1a] font-bold hover:opacity-80 transition-opacity"
              >
                <span className="material-symbols-outlined text-[17px]">help</span> Support
              </button>
            </div>

            {order.status === 'delivered' && (
              <div className="mt-4 pt-3 border-t border-[#f0eded]">
                {order.review ? (
                  <div className="bg-[#f6f3f2] p-3 rounded-xl text-left">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs font-bold">Your Review:</span>
                      <span className="text-amber-500 font-bold text-xs">{order.review.rating} ★</span>
                    </div>
                    <p className="text-xs text-[#5c4037] italic">"{order.review.comment}"</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveModal('review')}
                    className="w-full py-2.5 bg-[#ffdbd0] text-[#832600] font-bold rounded-xl text-xs hover:bg-[#ffb59d] transition-colors"
                  >
                    Rate & Review Food
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modals */}
      {activeModal === 'chat' && <DriverChatModal order={order} onClose={() => setActiveModal(null)} />}
      {activeModal === 'call' && <DriverCallModal order={order} onClose={() => setActiveModal(null)} />}
      {activeModal === 'receipt' && <ReceiptModal order={order} onClose={() => setActiveModal(null)} />}
      {activeModal === 'support' && <SupportModal order={order} onClose={() => setActiveModal(null)} />}
      {activeModal === 'review' && (
        <ReviewModal
          order={order}
          onClose={() => setActiveModal(null)}
          onSubmit={(r, c) => addReview(order.id, r, c)}
        />
      )}
    </div>
  );
};
