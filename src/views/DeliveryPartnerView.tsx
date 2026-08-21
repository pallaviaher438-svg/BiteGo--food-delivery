import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { DeliveryDashboard } from '../components/DeliveryDashboard';

export const DeliveryPartnerView: React.FC = () => {
  const { orders, updateOrderStatus, setRole, setCurrentScreen } = useApp();

  const [isOnDuty, setIsOnDuty] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'current' | 'requests' | 'history'>('dashboard');
  const [isCallingModal, setIsCallingModal] = useState<{ isOpen: boolean; name: string; phone: string; role: string } | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [deliveryOtp, setDeliveryOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showNavSheet, setShowNavSheet] = useState(false);
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({});

  // Find currently active order or fallback to the first
  const activeOrder = orders.find(o => o.status === 'on_the_way' || o.status === 'preparing' || o.status === 'confirmed') || orders[0];
  const completedOrders = orders.filter(o => o.status === 'delivered');

  // Simulated nearby pickup requests available for Nashik riders
  const availableRequests = [
    {
      id: 'req-101',
      restaurantName: 'Sadhana Chulivarchi Misal',
      pickupArea: 'Bardan Phata, Gangapur Road',
      dropArea: 'College Road, Nashik',
      distance: '3.8 km',
      estEarnings: '₹65',
      itemsCount: 3,
      readyIn: '4 mins'
    },
    {
      id: 'req-102',
      restaurantName: 'The Bombay Biryani Co.',
      pickupArea: 'City Centre Mall, Untwadi',
      dropArea: 'Indira Nagar, Nashik',
      distance: '2.1 km',
      estEarnings: '₹48',
      itemsCount: 2,
      readyIn: 'Ready for Pickup'
    }
  ];

  const handleToggleChecklist = (itemId: string) => {
    setChecklistItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleAdvanceStatus = (nextStatus: OrderStatus) => {
    if (!activeOrder) return;
    if (nextStatus === 'delivered') {
      setIsOtpModalOpen(true);
    } else {
      updateOrderStatus(activeOrder.id, nextStatus);
    }
  };

  const handleConfirmOtpDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    // Accept standard 4-digit code or fallback 4220 (Nashik PIN code prefix)
    if (deliveryOtp.trim().length >= 4 || deliveryOtp === '4220' || deliveryOtp === '1234') {
      updateOrderStatus(activeOrder.id, 'delivered');
      setIsOtpModalOpen(false);
      setDeliveryOtp('');
      setOtpError('');
    } else {
      setOtpError('Please enter a valid 4-digit customer delivery OTP (e.g. 4220)');
    }
  };

  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c] p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">check_circle</span>
        </div>
        <h2 className="text-xl font-bold font-headline mb-2">No Active Delivery Tasks</h2>
        <p className="text-sm text-[#5c4037] max-w-md mb-6">
          You are all caught up! Place a test order in the Customer Storefront or wait for new requests in Nashik.
        </p>
        <button
          onClick={() => { setRole('customer'); setCurrentScreen('home'); }}
          className="px-6 py-2.5 bg-[#a83300] text-white font-bold rounded-xl shadow-md"
        >
          Open Customer App & Place Order
        </button>
      </div>
    );
  }

  // Determine stage in delivery lifecycle
  const isPickupStage = activeOrder.status === 'confirmed' || activeOrder.status === 'preparing';
  const isEnRouteStage = activeOrder.status === 'on_the_way';
  const isDeliveredStage = activeOrder.status === 'delivered';

  return (
    <div className="min-h-screen bg-[#f8f6f5] text-[#1b1c1c] pb-24">
      {/* Top Header - Responsive & Functional */}
      <header className="bg-gradient-to-r from-[#1e5246] to-[#29695b] text-white px-3 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3">
          {/* Rider Profile with Status Indicator */}
          <div className="flex items-center justify-between xs:justify-start gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white text-[#29695b] font-display font-bold text-base flex items-center justify-center shadow-xs">
                AM
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#1e5246] ${
                  isOnDuty ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
                }`}
                title={isOnDuty ? 'Online' : 'Offline'}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-bold text-sm sm:text-base leading-tight">
                  Alex M. <span className="text-emerald-200 font-normal text-xs">• BiteGo Fleet</span>
                </h1>
                <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-emerald-200">
                  Rating 4.9 ★
                </span>
              </div>
              <p className="text-[11px] text-[#afefdd] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[13px]">two_wheeler</span>
                <span>MH 15 AB 4592 • College Rd Hub, Nashik</span>
              </p>
            </div>
          </div>

          {/* Quick Duty Toggle & Switch to Customer App */}
          <div className="flex items-center gap-2 self-end xs:self-auto">
            {/* Duty Switcher */}
            <button
              type="button"
              onClick={() => setIsOnDuty(!isOnDuty)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isOnDuty
                  ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-red-500/20 text-red-100 border-red-400/40 hover:bg-red-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span>{isOnDuty ? 'ON DUTY' : 'OFFLINE'}</span>
            </button>

            {/* Back to Customer App */}
            <button
              type="button"
              onClick={() => {
                setRole('customer');
                setCurrentScreen('home');
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span className="hidden sm:inline">Storefront</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Navigation Tabs for Mobile / Tablet / Desktop */}
        <div className="flex items-center justify-between gap-2 border-b border-[#e4e2e1] pb-2 flex-wrap">
          <div className="flex items-center gap-1 bg-[#eae7e6] p-1 rounded-2xl border border-[#dedad8] overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#29695b] shadow-xs'
                  : 'text-[#5c4037] hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">space_dashboard</span>
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('current')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'current'
                  ? 'bg-white text-[#a83300] shadow-xs'
                  : 'text-[#5c4037] hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">navigation</span>
              <span>Active Task</span>
              {!isDeliveredStage && (
                <span className="w-2 h-2 rounded-full bg-[#a83300] animate-ping shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'requests'
                  ? 'bg-white text-[#29695b] shadow-xs'
                  : 'text-[#5c4037] hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">near_me</span>
              <span>Nearby ({availableRequests.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'history'
                  ? 'bg-white text-[#1b1c1c] shadow-xs'
                  : 'text-[#5c4037] hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span>Trips ({completedOrders.length})</span>
            </button>
          </div>

          {/* Quick SOS / Emergency Helpline Trigger */}
          <button
            type="button"
            onClick={() => setIsCallingModal({
              isOpen: true,
              name: 'BiteGo Nashik Dispatch Support',
              phone: '1800-422-005',
              role: 'Nashik Central Fleet Manager'
            })}
            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
            title="Rider Emergency Hotline"
          >
            <span className="material-symbols-outlined text-[16px]">emergency</span>
            <span className="hidden md:inline">Rider Helpline</span>
          </button>
        </div>

        {/* ================================================================ */}
        {/* TAB 0: RIDER & FLEET DASHBOARD (KPIs, HEATMAP, EARNINGS)         */}
        {/* ================================================================ */}
        {activeTab === 'dashboard' && (
          <DeliveryDashboard
            orders={orders}
            activeOrder={activeOrder}
            onNavigateToTask={() => setActiveTab('current')}
            isOnDuty={isOnDuty}
          />
        )}

        {/* ================================================================ */}
        {/* TAB 1: ACTIVE DELIVERY TASK (RESPONSIVE SPLIT ON LG SCREENS)      */}
        {/* ================================================================ */}
        {activeTab === 'current' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
            
            {/* Left Column (7 cols): Route, Navigation Simulation & Step Tracker */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Main Active Task Card */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-[#e4e2e1] space-y-4">
                
                {/* Header Status Bar */}
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 pb-3 border-b border-[#f0eded]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                      isPickupStage
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : isEnRouteStage
                        ? 'bg-[#ffdbd0] text-[#a83300] border border-[#ffb59d] animate-pulse'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {isPickupStage ? 'restaurant' : isEnRouteStage ? 'two_wheeler' : 'check_circle'}
                      </span>
                      <span>
                        {isPickupStage ? 'Stage 1: Pickup from Kitchen' : isEnRouteStage ? 'Stage 2: Out for Delivery' : 'Task Completed'}
                      </span>
                    </span>
                    <span className="font-mono font-bold text-xs text-[#5c4037] bg-[#f6f3f2] px-2 py-0.5 rounded-lg">
                      #{activeOrder.orderNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#5c4037]">
                    <span className="flex items-center gap-1 font-bold text-[#1b1c1c]">
                      <span className="material-symbols-outlined text-[16px] text-[#a83300]">timer</span>
                      <span>{isDeliveredStage ? 'Delivered' : 'ETA: 12-16 mins'}</span>
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="font-bold text-[#29695b]">₹45 Payout</span>
                  </div>
                </div>

                {/* Simulated Live GPS Map / Route Navigator Widget */}
                <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-[#e8ece9] border border-[#cfd6d1] flex flex-col justify-between p-3 sm:p-4 shadow-inner">
                  {/* Subtle map grid vector background */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(#29695b 1px, transparent 1px)',
                      backgroundSize: '16px 16px'
                    }}
                  />

                  {/* Top Live Banner */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>GPS Tracking • Nashik Zone</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowNavSheet(!showNavSheet)}
                      className="bg-white/90 hover:bg-white text-[#1b1c1c] text-xs font-bold px-3 py-1 rounded-xl shadow-md border border-[#e4e2e1] flex items-center gap-1 transition-all"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#a83300]">near_me</span>
                      <span>{showNavSheet ? 'Hide Guidance' : 'Turn Guidance'}</span>
                    </button>
                  </div>

                  {/* Visual Route Path Line */}
                  <div className="relative z-10 my-auto flex items-center justify-between px-4 sm:px-8">
                    {/* Node 1: Restaurant */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white ${
                        isPickupStage ? 'bg-[#a83300] text-white scale-110' : 'bg-emerald-600 text-white'
                      }`}>
                        <span className="material-symbols-outlined text-[16px]">storefront</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#1b1c1c] mt-1 bg-white/90 px-1.5 py-0.2 rounded shadow-2xs">
                        Kitchen
                      </span>
                    </div>

                    {/* Dotted Route Connector */}
                    <div className="flex-1 mx-2 sm:mx-4 flex items-center relative">
                      <div className="w-full h-1 bg-[#29695b]/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#29695b] transition-all duration-700"
                          style={{ width: isPickupStage ? '30%' : isEnRouteStage ? '75%' : '100%' }}
                        />
                      </div>
                      {/* Animated Bike Marker */}
                      <div
                        className="absolute -top-3.5 transition-all duration-700 bg-white p-1 rounded-full shadow-md border border-[#29695b]"
                        style={{ left: isPickupStage ? '30%' : isEnRouteStage ? '75%' : '95%' }}
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#29695b] block">
                          two_wheeler
                        </span>
                      </div>
                    </div>

                    {/* Node 2: Customer */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white ${
                        isDeliveredStage ? 'bg-emerald-600 text-white scale-110' : 'bg-[#1b1c1c] text-white'
                      }`}>
                        <span className="material-symbols-outlined text-[16px]">home</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#1b1c1c] mt-1 bg-white/90 px-1.5 py-0.2 rounded shadow-2xs">
                        Customer
                      </span>
                    </div>
                  </div>

                  {/* Turn-by-Turn Instruction Banner */}
                  <div className="relative z-10 bg-white/95 backdrop-blur-xs rounded-xl p-2 sm:p-2.5 shadow-md border border-[#e4e2e1] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#a83300] text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px]">turn_right</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#1b1c1c] block truncate">
                          {isPickupStage
                            ? 'Turn right towards College Rd signal (250m)'
                            : isEnRouteStage
                            ? 'Head straight on Gangapur Rd near Big Bazaar (400m)'
                            : 'Arrived at destination'}
                        </span>
                        <span className="text-[10px] text-[#5c4037] block">Speed: 28 km/h • Traffic: Light</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#29695b] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg shrink-0">
                      1.8 km rem.
                    </span>
                  </div>
                </div>

                {/* Pickup and Delivery Timeline Cards */}
                <div className="space-y-3 pt-1">
                  
                  {/* Point A: Pickup Details */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    isPickupStage
                      ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-300/50'
                      : 'bg-[#fcfaf9] border-[#e4e2e1]'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#a83300] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                          <span className="material-symbols-outlined text-[18px]">storefront</span>
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-[#a83300] font-bold uppercase tracking-wider block">
                            STEP 1 • PICKUP LOCATION
                          </span>
                          <h3 className="font-headline font-bold text-sm text-[#1b1c1c] truncate">
                            {activeOrder.restaurantName}
                          </h3>
                          <p className="text-xs text-[#5c4037] mt-0.5">
                            Shop 14, College Road Promenade, Nashik 422005
                          </p>
                          <span className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            <span>Kitchen Order Ready for pickup</span>
                          </span>
                        </div>
                      </div>

                      {/* Call Kitchen Button */}
                      <button
                        type="button"
                        onClick={() => setIsCallingModal({
                          isOpen: true,
                          name: activeOrder.restaurantName,
                          phone: '+91 253 257 8899',
                          role: 'Restaurant Kitchen Manager'
                        })}
                        className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-[#1b1c1c] border border-[#e4e2e1] rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1 shrink-0 transition-colors"
                        title="Call Restaurant"
                      >
                        <span className="material-symbols-outlined text-[15px] text-[#29695b]">call</span>
                        <span className="hidden sm:inline">Call</span>
                      </button>
                    </div>
                  </div>

                  {/* Point B: Dropoff Customer Details */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    isEnRouteStage
                      ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-300/50'
                      : 'bg-[#fcfaf9] border-[#e4e2e1]'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#29695b] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                          <span className="material-symbols-outlined text-[18px]">location_on</span>
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-[#29695b] font-bold uppercase tracking-wider block">
                            STEP 2 • DROP-OFF DESTINATION
                          </span>
                          <h3 className="font-headline font-bold text-sm text-[#1b1c1c] truncate">
                            Rahul Deshmukh • {activeOrder.address.label}
                          </h3>
                          <p className="text-xs text-[#5c4037] mt-0.5 line-clamp-2">
                            {activeOrder.address.addressLine}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-[10px] font-bold bg-[#ffdbd0] text-[#a83300] px-2 py-0.5 rounded-md">
                              Delivery Instruction: Leave at door
                            </span>
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                              Paid Online (₹0 Cash to collect)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Call Customer Button */}
                      <button
                        type="button"
                        onClick={() => setIsCallingModal({
                          isOpen: true,
                          name: 'Rahul Deshmukh',
                          phone: activeOrder.address.phone || '+91 9876543210',
                          role: 'Customer'
                        })}
                        className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-[#1b1c1c] border border-[#e4e2e1] rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1 shrink-0 transition-colors"
                        title="Call Customer"
                      >
                        <span className="material-symbols-outlined text-[15px] text-[#29695b]">call</span>
                        <span className="hidden sm:inline">Call</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button (State Controller) */}
                <div className="pt-3 border-t border-[#f0eded]">
                  {isPickupStage && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus('on_the_way')}
                      className="w-full py-3.5 bg-[#a83300] hover:bg-[#d24200] active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
                      <span>Confirm Kitchen Pickup & Start Navigation</span>
                    </button>
                  )}

                  {isEnRouteStage && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setIsOtpModalOpen(true)}
                        className="w-full py-3.5 bg-[#29695b] hover:bg-[#1e5246] active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[20px]">verified</span>
                        <span>Arrived at Customer • Enter Delivery OTP</span>
                      </button>
                      <p className="text-[11px] text-center text-[#5c4037]">
                        Ask customer for 4-digit code (Default PIN: 4220) to complete handover
                      </p>
                    </div>
                  )}

                  {isDeliveredStage && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                      <div className="inline-flex items-center gap-1.5 text-emerald-800 font-bold text-sm">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span>Order Handover Verified & Delivered!</span>
                      </div>
                      <p className="text-xs text-emerald-700">
                        ₹45 delivery fare + ₹10 peak surge credited to your daily wallet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Order Item Checklist, Payout & Rider Stats */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Order Package Checklist Card */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#e4e2e1] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#f0eded]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#a83300] text-[18px]">checklist</span>
                    <h3 className="font-headline font-bold text-sm text-[#1b1c1c]">
                      Package Items ({activeOrder.items?.length || 2})
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#5c4037] font-semibold">Verify with kitchen</span>
                </div>

                <div className="space-y-2">
                  {(activeOrder.items || [
                    { id: '1', name: 'Special Nashik Misal Pav', quantity: 2, price: 140, isVeg: true },
                    { id: '2', name: 'Solkadhi Cold Beverage', quantity: 1, price: 60, isVeg: true }
                  ]).map((item, idx) => {
                    const isChecked = checklistItems[item.id || idx] || false;

                    return (
                      <div
                        key={item.id || idx}
                        onClick={() => handleToggleChecklist(item.id || `${idx}`)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                            : 'bg-[#fcfaf9] border-[#e4e2e1] hover:bg-[#f6f3f2]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-400 bg-white'
                          }`}>
                            {isChecked && <span className="material-symbols-outlined text-[12px]">check</span>}
                          </span>
                          <span className="font-bold text-xs text-[#1b1c1c] truncate">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-[#5c4037] shrink-0">
                          ₹{(item.price || 120) * (item.quantity || 1)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 text-[11px] text-[#5c4037] flex items-center justify-between border-t border-[#f0eded]">
                  <span>Total Order Bill:</span>
                  <span className="font-bold text-[#1b1c1c] text-xs">₹{activeOrder.total || 340}</span>
                </div>
              </div>

              {/* Rider Performance & Payout Summary Card */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#e4e2e1] space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline font-bold text-sm text-[#1b1c1c] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#29695b] text-[18px]">account_balance_wallet</span>
                    <span>Today's Rider Summary</span>
                  </h3>
                  <span className="text-[11px] font-bold text-[#29695b] bg-emerald-50 px-2 py-0.5 rounded-full">
                    Nashik Shift
                  </span>
                </div>

                {/* 3 Metrics in Responsive Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#fcfaf9] p-2.5 rounded-2xl border border-[#e4e2e1]">
                    <span className="text-[10px] text-[#5c4037] uppercase font-bold block">Completed</span>
                    <span className="font-headline font-bold text-lg text-[#1b1c1c]">
                      {completedOrders.length + 14}
                    </span>
                    <span className="text-[9px] text-emerald-600 block font-semibold">+2 vs yest</span>
                  </div>

                  <div className="bg-[#fcfaf9] p-2.5 rounded-2xl border border-[#e4e2e1]">
                    <span className="text-[10px] text-[#5c4037] uppercase font-bold block">Earnings</span>
                    <span className="font-headline font-bold text-lg text-[#29695b]">
                      ₹965
                    </span>
                    <span className="text-[9px] text-gray-500 block">Payout at 11 PM</span>
                  </div>

                  <div className="bg-[#fcfaf9] p-2.5 rounded-2xl border border-[#e4e2e1]">
                    <span className="text-[10px] text-[#5c4037] uppercase font-bold block">Rating</span>
                    <span className="font-headline font-bold text-lg text-amber-600 flex items-center justify-center gap-0.5">
                      4.9 <span className="text-xs">★</span>
                    </span>
                    <span className="text-[9px] text-emerald-600 block font-semibold">Top 5%</span>
                  </div>
                </div>

                {/* Milestone progress */}
                <div className="p-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-emerald-900">
                    <span>Daily Target: 15 Trips</span>
                    <span>14/15 Done</span>
                  </div>
                  <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#29695b] rounded-full" style={{ width: '93%' }} />
                  </div>
                  <p className="text-[10px] text-emerald-800">
                    Complete 1 more delivery to unlock ₹150 daily fuel bonus!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: NEARBY REQUESTS POOL                                      */}
        {/* ================================================================ */}
        {activeTab === 'requests' && (
          <div className="space-y-3 max-w-2xl mx-auto animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-base text-[#1b1c1c]">
                Live Orders Waiting for Pickup in Nashik
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Auto-Refreshing
              </span>
            </div>

            {availableRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-4 rounded-2xl shadow-xs border border-[#e4e2e1] hover:border-[#ffdbd0] transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-headline font-bold text-sm text-[#1b1c1c]">{req.restaurantName}</h4>
                    <p className="text-xs text-[#5c4037] mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#a83300]">store</span>
                      <span>Pickup: {req.pickupArea}</span>
                    </p>
                    <p className="text-xs text-[#5c4037] mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#29695b]">location_on</span>
                      <span>Drop: {req.dropArea}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-base text-[#29695b] block">{req.estEarnings}</span>
                    <span className="text-[10px] text-gray-500">{req.distance} • {req.itemsCount} items</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#f0eded]">
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    {req.readyIn}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('current');
                      updateOrderStatus(activeOrder.id, 'on_the_way');
                    }}
                    className="px-4 py-1.5 bg-[#a83300] hover:bg-[#d24200] text-white text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-95"
                  >
                    Accept Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: TRIPS HISTORY                                             */}
        {/* ================================================================ */}
        {activeTab === 'history' && (
          <div className="space-y-3 max-w-2xl mx-auto animate-in fade-in duration-150">
            <h3 className="font-headline font-bold text-base text-[#1b1c1c]">Completed Deliveries Today</h3>

            <div className="space-y-2.5">
              {[
                { id: 'TRIP-801', rest: 'Nashik Misal House', area: 'College Road', earning: '₹45', time: '40 mins ago', rating: '5.0 ★' },
                { id: 'TRIP-800', rest: 'The Spice Route', area: 'Gangapur Road', earning: '₹55', time: '1 hr ago', rating: '5.0 ★' },
                { id: 'TRIP-799', rest: 'Barbeque Nation Nashik', area: 'Indira Nagar', earning: '₹60', time: '2 hrs ago', rating: '4.8 ★' }
              ].map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white p-3.5 rounded-2xl shadow-2xs border border-[#e4e2e1] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[17px]">done_all</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-xs text-[#1b1c1c]">{trip.rest}</span>
                        <span className="text-[10px] text-gray-400">• {trip.id}</span>
                      </div>
                      <p className="text-[11px] text-[#5c4037]">{trip.area} • Delivered {trip.time}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-[#29695b] block">{trip.earning}</span>
                    <span className="text-[10px] text-amber-600 font-semibold">{trip.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================================================================ */}
      {/* MODAL 1: OTP VERIFICATION ON DELIVERY                            */}
      {/* ================================================================ */}
      {isOtpModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsOtpModalOpen(false)}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 border border-[#e4e2e1] animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e4e2e1] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#29695b] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">pin</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-[#1b1c1c]">Customer Handover OTP</h3>
                  <p className="text-[11px] text-[#5c4037]">Verify 4-digit code before handing package</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOtpModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmOtpDelivery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] mb-1.5">
                  Enter 4-Digit Delivery Code from Customer:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={deliveryOtp}
                  onChange={e => {
                    setDeliveryOtp(e.target.value);
                    if (otpError) setOtpError('');
                  }}
                  placeholder="e.g. 4220"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono font-bold py-3 bg-[#f6f3f2] rounded-xl outline-none border border-[#e4e2e1] focus:bg-white focus:ring-2 focus:ring-[#29695b]"
                />
                {otpError && (
                  <p className="text-xs text-red-600 font-semibold mt-1.5 text-center">{otpError}</p>
                )}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryOtp('4220')}
                    className="text-[11px] text-[#29695b] font-bold underline"
                  >
                    Use Demo Code: 4220
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="flex-1 py-3 border border-[#e4e2e1] text-[#5c4037] font-bold text-xs rounded-xl hover:bg-[#f6f3f2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#29695b] hover:bg-[#1e5246] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[17px]">check_circle</span>
                  <span>Confirm Handover</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 2: CALL DIALER SIMULATOR                                   */}
      {/* ================================================================ */}
      {isCallingModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsCallingModal(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center space-y-4 border border-[#e4e2e1] animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
              <span className="material-symbols-outlined text-[32px] animate-pulse">call</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#5c4037] tracking-wider block">
                {isCallingModal.role}
              </span>
              <h3 className="font-headline font-bold text-lg text-[#1b1c1c] mt-0.5">
                {isCallingModal.name}
              </h3>
              <p className="font-mono text-xs text-[#29695b] font-bold mt-1">
                {isCallingModal.phone}
              </p>
            </div>

            <div className="p-3 bg-[#f6f3f2] rounded-xl text-xs text-[#5c4037]">
              Masked Rider Hotline connected via BiteGo Nashik Server
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCallingModal(null)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[17px]">call_end</span>
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
