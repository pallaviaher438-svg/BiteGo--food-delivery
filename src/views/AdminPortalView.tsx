import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Restaurant, MenuItem, Coupon, Order } from '../types';
import { PaymentFlowBreakdown } from '../components/PaymentFlowBreakdown';

export const AdminPortalView: React.FC = () => {
  const {
    restaurants,
    orders,
    coupons,
    setRole,
    setCurrentScreen,
    updateOrderStatus,
    addRestaurant,
    deleteRestaurant,
    toggleRestaurantStatus,
    toggleItemAvailability,
    addMenuItem,
    deleteMenuItem,
    updateMenuItemPrice,
    addCoupon,
    deleteCoupon,
    setSelectedRestaurantId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'restaurants' | 'riders' | 'coupons'>('overview');
  const [orderFilter, setOrderFilter] = useState<'all' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  
  // Modals state
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);
  const [managingRestaurantId, setManagingRestaurantId] = useState<string | null>(null);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // New Restaurant Form State
  const [newRestForm, setNewRestForm] = useState({
    name: '',
    tagline: '',
    cuisine: 'North Indian, Biryani',
    priceForOne: 250,
    deliveryTime: '25-35 mins',
    address: 'College Road, Nashik',
    discountBadge: '20% OFF'
  });

  // New Coupon Form State
  const [newCouponForm, setNewCouponForm] = useState<Coupon>({
    code: '',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 299,
    maxDiscount: 100,
    description: 'Special weekend food offer'
  });

  // New Dish Form State
  const [newDishForm, setNewDishForm] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 199,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHv9u-bKzX1j2iM5v2zM6fWf6PcvxP2zWfOqH_B2qjP4yZ1mH2qF-8QYkQ9c6kH_1qE-8QYkQ9c6kH_1qE',
    category: 'Main Course',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  });

  // Fleet list
  const ridersList = [
    { id: 'r1', name: 'Alex M.', phone: '+91 9823012345', vehicle: 'MH 15 AB 4592 (EV Scooter)', rating: 4.9, activeDeliveries: 1, completedToday: 14, status: 'On Delivery', location: 'Gangapur Road', battery: '88%' },
    { id: 'r2', name: 'Vikram K.', phone: '+91 9823012346', vehicle: 'MH 15 CD 8821 (Bike)', rating: 4.8, activeDeliveries: 0, completedToday: 18, status: 'Available', location: 'College Road', battery: '92%' },
    { id: 'r3', name: 'Sunita P.', phone: '+91 9823012347', vehicle: 'MH 15 XY 1120 (EV Scooter)', rating: 5.0, activeDeliveries: 1, completedToday: 12, status: 'On Delivery', location: 'Indira Nagar', battery: '76%' },
    { id: 'r4', name: 'Rohit S.', phone: '+91 9823012348', vehicle: 'MH 15 MN 6643 (Bike)', rating: 4.7, activeDeliveries: 0, completedToday: 16, status: 'Available', location: 'Panchavati', battery: '64%' }
  ];

  const totalGMV = orders.reduce((acc, o) => acc + o.total, 0) + 38450;
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered').length;
  const platformCommission = Math.round(totalGMV * 0.18);

  const filteredOrders = orders.filter(o => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch = !orderSearch.trim() ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.restaurantName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.address.label.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestForm.name) return;

    const newRestaurant: Restaurant = {
      id: `rest-${Date.now()}`,
      name: newRestForm.name,
      tagline: newRestForm.tagline || 'Delicious food in Nashik',
      cuisine: newRestForm.cuisine.split(',').map(c => c.trim()),
      rating: 4.6,
      reviewsCount: '1.2k+',
      deliveryTime: newRestForm.deliveryTime,
      priceForOne: Number(newRestForm.priceForOne),
      discountBadge: newRestForm.discountBadge,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3JPViR-MmE4kg7CVumdao_FYQdGYNhowCpjGZ7TqPMNQnQ4tjbAMIB-RVjif3UFT0cXOE44zY-gVpWIAyvBHkTXyqSFPgnIoZQ4fwkp-NC-6b56X1r2C4NEYLnR3Y-s8Ffn0HzngW52DXd-tqJv0KQoFGrIkTkjUm906-Drp4VNlz6JOrxXZPulYHV_YmVeF19EembwWVOVQVV0dpQxO7Z9gE3WYZJr9Gj61wItVpbxSbrTtoQcg',
      logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_B7nF1JbT00j4nN66l9-XvO132Q92vGzY96z-0Q1uJ8A-421A4B0H4w9_zG1yK94z',
      distance: '2.5 km',
      address: newRestForm.address,
      isOpen: true,
      featured: true,
      menu: [
        {
          id: `menu-${Date.now()}-1`,
          name: `${newRestForm.name} Signature Platter`,
          description: 'Chef special prepared fresh with authentic ingredients and aromatic spices',
          price: Number(newRestForm.priceForOne),
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHv9u-bKzX1j2iM5v2zM6fWf6PcvxP2zWfOqH_B2qjP4yZ1mH2qF-8QYkQ9c6kH_1qE-8QYkQ9c6kH_1qE',
          category: 'Main Course',
          isVeg: true,
          isBestseller: true,
          isAvailable: true
        }
      ]
    };

    addRestaurant(newRestaurant);
    setIsAddRestaurantOpen(false);
    setNewRestForm({
      name: '',
      tagline: '',
      cuisine: 'North Indian, Biryani',
      priceForOne: 250,
      deliveryTime: '25-35 mins',
      address: 'College Road, Nashik',
      discountBadge: '20% OFF'
    });
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponForm.code) return;
    addCoupon({
      ...newCouponForm,
      code: newCouponForm.code.toUpperCase().trim()
    });
    setIsAddCouponOpen(false);
    setNewCouponForm({
      code: '',
      discountType: 'percentage',
      discountValue: 20,
      minOrder: 299,
      maxDiscount: 100,
      description: 'Special weekend food offer'
    });
  };

  const handleAddDish = (restaurantId: string) => {
    if (!newDishForm.name) return;
    const item: MenuItem = {
      ...newDishForm,
      id: `dish-${Date.now()}`
    };
    addMenuItem(restaurantId, item);
    setIsAddDishOpen(false);
    setNewDishForm({
      name: '',
      description: '',
      price: 199,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHv9u-bKzX1j2iM5v2zM6fWf6PcvxP2zWfOqH_B2qjP4yZ1mH2qF-8QYkQ9c6kH_1qE-8QYkQ9c6kH_1qE',
      category: 'Main Course',
      isVeg: true,
      isAvailable: true,
      isBestseller: false
    });
  };

  const currentManagingRestaurant = restaurants.find(r => r.id === managingRestaurantId);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1b1c1c] pb-16 font-sans">
      {/* Top Universal Banner */}
      <div className="bg-gradient-to-r from-[#a83300] via-[#c44005] to-[#29695b] text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
            ⚡ BiteGo Admin Hub (Starting View)
          </span>
          <span className="hidden sm:inline text-white/90">
            Welcome to the Central Food Delivery Command Center • Nashik Zone 1
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setRole('customer'); setCurrentScreen('home'); }}
            className="bg-white text-[#a83300] font-bold px-3 py-1 rounded-md text-xs hover:bg-gray-100 transition-all flex items-center gap-1 shadow-sm"
          >
            <span className="material-symbols-outlined text-[14px]">storefront</span>
            Open Customer Storefront
          </button>
        </div>
      </div>

      {/* Main Admin Header */}
      <header className="bg-[#1b1c1c] text-white px-4 md:px-8 py-3.5 sticky top-0 z-30 flex flex-wrap justify-between items-center shadow-lg border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#a83300] flex items-center justify-center font-headline font-bold text-xl text-white shadow-inner">
            BG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline font-bold text-base md:text-lg text-white">BiteGo Command Center</h1>
              <span className="bg-[#29695b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">v2.4 Live</span>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Nashik Hub Active • All Services Operational
            </p>
          </div>
        </div>

        {/* Quick Persona Launchers */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setRole('customer'); setCurrentScreen('home'); }}
            className="px-3 py-1.5 bg-[#a83300] hover:bg-[#d24200] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
          >
            <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
            Customer App
          </button>

          <button
            onClick={() => { setRole('restaurant'); setCurrentScreen('restaurant_portal'); }}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">restaurant</span>
            Kitchen Portal
          </button>

          <button
            onClick={() => { setRole('delivery'); setCurrentScreen('delivery_portal'); }}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
            Rider App
          </button>
        </div>
      </header>

      {/* Admin Dashboard Body */}
      <main className="max-w-[1360px] mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-[#e4e2e1] pb-3 flex-wrap gap-3">
          <div className="flex space-x-2 md:space-x-4 overflow-x-auto hide-scrollbar">
            {[
              { id: 'overview', label: 'Overview & KPIs', icon: 'dashboard' },
              { id: 'orders', label: `Live Orders (${orders.length})`, icon: 'receipt_long' },
              { id: 'restaurants', label: `Restaurants (${restaurants.length})`, icon: 'storefront' },
              { id: 'riders', label: 'Rider Fleet (4)', icon: 'two_wheeler' },
              { id: 'coupons', label: `Coupons (${coupons.length})`, icon: 'local_offer' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#1b1c1c] text-white shadow-sm'
                      : 'text-[#5c4037] hover:bg-[#eae8e7] bg-white border border-[#e4e2e1]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddRestaurantOpen(true)}
              className="bg-[#29695b] hover:bg-[#065043] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add_business</span>
              Add Restaurant
            </button>
            <button
              onClick={() => setIsAddCouponOpen(true)}
              className="bg-[#a83300] hover:bg-[#d24200] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              New Coupon
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e4e2e1] relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-[#5c4037] font-semibold">Total GMV (Nashik)</span>
                    <h3 className="font-headline font-bold text-2xl md:text-3xl text-[#1b1c1c] mt-1">₹{totalGMV.toLocaleString()}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  <span>+22.4% vs last week</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e4e2e1] relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-[#5c4037] font-semibold">Active Live Orders</span>
                    <h3 className="font-headline font-bold text-2xl md:text-3xl text-[#a83300] mt-1">{activeOrdersCount}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#a83300] flex items-center justify-center">
                    <span className="material-symbols-outlined">soup_kitchen</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-amber-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span>In kitchen & on the road</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e4e2e1] relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-[#5c4037] font-semibold">Platform Commission</span>
                    <h3 className="font-headline font-bold text-2xl md:text-3xl text-[#29695b] mt-1">₹{platformCommission.toLocaleString()}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#acedda]/30 text-[#29695b] flex items-center justify-center">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-[#29695b] font-bold">
                  <span>18% avg take-rate</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e4e2e1] relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-[#5c4037] font-semibold">Avg SLA Delivery Time</span>
                    <h3 className="font-headline font-bold text-2xl md:text-3xl text-[#1b1c1c] mt-1">24.2 min</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-blue-600 font-bold">
                  <span>98.6% on-time guarantee</span>
                </div>
              </div>
            </div>

            {/* Hub Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Delivery Zones in Nashik */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e2e1] space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-headline font-bold text-sm text-[#1b1c1c] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#a83300]">pin_drop</span>
                    Nashik Delivery Zones
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">All Zones 100%</span>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { zone: 'College Road & Canada Corner', orders: 42, share: 35, avgTime: '21m' },
                    { zone: 'Gangapur Road & Anandwalli', orders: 34, share: 28, avgTime: '23m' },
                    { zone: 'Indira Nagar & Pathardi Phata', orders: 24, share: 20, avgTime: '26m' },
                    { zone: 'Panchavati & Old Nashik', orders: 20, share: 17, avgTime: '27m' }
                  ].map((z, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-semibold text-[#1b1c1c]">
                        <span>{z.zone}</span>
                        <span>{z.orders} orders ({z.avgTime})</span>
                      </div>
                      <div className="w-full bg-[#f0eded] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#a83300] h-full rounded-full" style={{ width: `${z.share}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Gateways Performance & Flow Breakdown */}
              <PaymentFlowBreakdown
                orders={orders}
                totalGMV={totalGMV}
                platformCommission={platformCommission}
              />

              {/* Quick Customer Storefront Launcher Card */}
              <div className="bg-gradient-to-br from-[#1b1c1c] to-[#2c2d2d] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
                <div>
                  <span className="bg-[#a83300] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Customer Experience
                  </span>
                  <h4 className="font-headline font-bold text-lg text-white mt-3 mb-1">
                    Explore BiteGo Storefront
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed mb-4">
                    Switch to the customer viewport to browse restaurant menus, test cart calculations, apply promo codes like <strong className="text-amber-300">BITE50</strong>, and track live mock orders.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => { setRole('customer'); setCurrentScreen('home'); }}
                    className="w-full py-2.5 bg-[#a83300] hover:bg-[#d24200] text-white font-bold text-xs rounded-xl transition-all shadow"
                  >
                    Open Customer App →
                  </button>
                  <button
                    onClick={() => { setSelectedRestaurantId('rest-3'); setRole('customer'); setCurrentScreen('restaurant'); }}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors"
                  >
                    Direct View: The Spice Route Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e4e2e1] space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h3 className="font-headline font-bold text-lg text-[#1b1c1c]">Live Orders Stream</h3>
                <p className="text-xs text-[#5c4037]">Real-time order statuses and live dispatch control</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order ID, restaurant..."
                  className="px-3 py-1.5 bg-[#f6f3f2] border border-[#e4e2e1] rounded-lg text-xs outline-none focus:border-[#a83300] flex-1 md:w-48"
                />

                <div className="flex gap-1 bg-[#f0eded] p-1 rounded-lg">
                  {(['all', 'confirmed', 'preparing', 'on_the_way', 'delivered'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-2.5 py-1 rounded text-xs font-bold capitalize transition-colors ${
                        orderFilter === st ? 'bg-white text-[#a83300] shadow-sm' : 'text-[#5c4037] hover:text-black'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f6f3f2] text-[#5c4037] uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Restaurant</th>
                    <th className="p-3">Customer & Location</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Rider</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Quick Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eded]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">No orders found in this category.</td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#fbf9f8] transition-colors">
                        <td className="p-3 font-bold text-[#1b1c1c]">
                          <button
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="text-[#a83300] hover:underline font-bold"
                          >
                            #{ord.orderNumber}
                          </button>
                          <span className="text-[10px] text-gray-400 block">{ord.placedAt}</span>
                        </td>
                        <td className="p-3 font-semibold text-[#1b1c1c]">{ord.restaurantName}</td>
                        <td className="p-3">
                          <span className="font-semibold text-gray-800">Rahul Deshmukh</span>
                          <span className="text-[10px] text-gray-500 block truncate max-w-[140px]">{ord.address.label} - {ord.address.addressLine}</span>
                        </td>
                        <td className="p-3 text-gray-600 max-w-[160px] truncate">
                          {ord.items.map(i => `${i.quantity}x ${i.item.name}`).join(', ')}
                        </td>
                        <td className="p-3 font-bold text-[#a83300]">₹{ord.total}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="font-medium text-gray-700">{ord.deliveryPartner.name}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            ord.status === 'on_the_way' ? 'bg-[#ffdbd0] text-[#832600]' :
                            ord.status === 'preparing' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {ord.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            {ord.status === 'confirmed' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'preparing')}
                                className="px-2 py-1 bg-amber-600 text-white rounded text-[10px] font-bold hover:bg-amber-700"
                              >
                                Send to Kitchen
                              </button>
                            )}
                            {ord.status === 'preparing' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'on_the_way')}
                                className="px-2 py-1 bg-[#a83300] text-white rounded text-[10px] font-bold hover:bg-[#d24200]"
                              >
                                Dispatch Rider
                              </button>
                            )}
                            {ord.status === 'on_the_way' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'delivered')}
                                className="px-2 py-1 bg-[#29695b] text-white rounded text-[10px] font-bold hover:bg-[#065043]"
                              >
                                Mark Delivered
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="px-2 py-1 border border-gray-300 rounded text-[10px] font-medium hover:bg-gray-100"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: RESTAURANTS & MENUS */}
        {activeTab === 'restaurants' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline font-bold text-lg text-[#1b1c1c]">Nashik Restaurant Partners ({restaurants.length})</h3>
                <p className="text-xs text-[#5c4037]">Manage restaurant availability, menus, pricing, and onboarding</p>
              </div>
              <button
                onClick={() => setIsAddRestaurantOpen(true)}
                className="bg-[#29695b] hover:bg-[#065043] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <span className="material-symbols-outlined text-[18px]">add_business</span>
                Add New Restaurant
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {restaurants.map((rest) => (
                <div key={rest.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e2e1] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <img src={rest.logoImage} alt={rest.name} className="w-12 h-12 rounded-xl object-contain bg-[#fbf9f8] p-1 border" />
                        <div>
                          <h4 className="font-headline font-bold text-base text-[#1b1c1c]">{rest.name}</h4>
                          <p className="text-[11px] text-[#5c4037]">{rest.cuisine.join(', ')}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleRestaurantStatus(rest.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          rest.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rest.isOpen ? '● Online' : '○ Paused'}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mb-3">{rest.address}</p>

                    <div className="flex items-center justify-between text-xs bg-[#fbf9f8] p-2.5 rounded-xl mb-4 border border-[#e4e2e1]">
                      <div>
                        <span className="text-[10px] text-[#5c4037] block">Menu Items</span>
                        <span className="font-bold text-[#1b1c1c]">{rest.menu.length} Dishes</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5c4037] block">Rating</span>
                        <span className="font-bold text-amber-600">{rest.rating} ★ ({rest.reviewsCount})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5c4037] block">Avg Ticket</span>
                        <span className="font-bold text-[#1b1c1c]">₹{rest.priceForOne}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#f0eded]">
                    <button
                      onClick={() => setManagingRestaurantId(rest.id)}
                      className="flex-1 py-2 bg-[#1b1c1c] text-white hover:bg-black rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">menu_book</span>
                      Manage Menu ({rest.menu.length})
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRestaurantId(rest.id);
                        setRole('customer');
                        setCurrentScreen('restaurant');
                      }}
                      className="px-3 py-2 border border-[#e4e2e1] hover:bg-[#f6f3f2] rounded-lg text-xs font-bold text-[#5c4037]"
                      title="Preview in Customer App"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                    </button>
                    <button
                      onClick={() => deleteRestaurant(rest.id)}
                      className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold"
                      title="Remove Restaurant"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RIDER FLEET DISPATCH */}
        {activeTab === 'riders' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e4e2e1] space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline font-bold text-lg text-[#1b1c1c]">Nashik Rider Fleet Telemetry</h3>
                <p className="text-xs text-[#5c4037]">Live GPS status, active deliveries, and fleet performance</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                4 Active Riders Online
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ridersList.map((rider) => (
                <div key={rider.id} className="p-4 rounded-2xl border border-[#e4e2e1] bg-[#fbf9f8] space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#ffdbd0] text-[#a83300] font-bold text-base flex items-center justify-center border-2 border-[#a83300]">
                        {rider.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1b1c1c]">{rider.name}</h4>
                        <p className="text-[11px] text-[#5c4037]">{rider.vehicle} • {rider.phone}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      rider.status === 'On Delivery' ? 'bg-[#ffdbd0] text-[#832600]' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {rider.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs bg-white p-2.5 rounded-xl border border-[#e4e2e1]">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Rating</span>
                      <span className="font-bold text-amber-500">{rider.rating} ★</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Today's Trips</span>
                      <span className="font-bold text-gray-800">{rider.completedToday}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Battery</span>
                      <span className="font-bold text-emerald-600">{rider.battery}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Zone</span>
                      <span className="font-bold text-gray-800 truncate">{rider.location}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => { setRole('delivery'); setCurrentScreen('delivery_portal'); }}
                      className="px-3 py-1.5 bg-[#29695b] hover:bg-[#065043] text-white rounded-lg text-xs font-bold"
                    >
                      Open Rider Portal View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROMOTIONS & COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e4e2e1] space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-headline font-bold text-lg text-[#1b1c1c]">Promo Codes & Discounts Engine</h3>
                <p className="text-xs text-[#5c4037]">Active discount coupons redeemable in the customer checkout</p>
              </div>
              <button
                onClick={() => setIsAddCouponOpen(true)}
                className="bg-[#a83300] hover:bg-[#d24200] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Create New Coupon
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((coupon) => (
                <div key={coupon.code} className="p-4 rounded-2xl border border-[#e5beb2] bg-[#ffdbd0]/20 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono font-bold text-base bg-[#a83300] text-white px-2.5 py-1 rounded-lg">
                        {coupon.code}
                      </span>
                      <span className="text-xs font-bold text-[#29695b]">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`}
                      </span>
                    </div>
                    <p className="text-xs text-[#5c4037] mb-2">{coupon.description}</p>
                    <div className="text-[11px] text-gray-600 space-y-0.5">
                      <div>• Min order: ₹{coupon.minOrder}</div>
                      {coupon.maxDiscount && <div>• Max discount: ₹{coupon.maxDiscount}</div>}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[#e5beb2]">
                    <span className="text-[10px] text-emerald-700 font-bold">● Active in Checkout</span>
                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD RESTAURANT */}
      {isAddRestaurantOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-lg text-[#1b1c1c]">Onboard New Restaurant</h3>
              <button onClick={() => setIsAddRestaurantOpen(false)} className="text-gray-400 hover:text-black">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRestaurant} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#5c4037] font-semibold mb-1">Restaurant Name *</label>
                <input
                  type="text"
                  required
                  value={newRestForm.name}
                  onChange={(e) => setNewRestForm({ ...newRestForm, name: e.target.value })}
                  placeholder="e.g. Samosa Nation / Biryani By Kilo"
                  className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5c4037] font-semibold mb-1">Tagline</label>
                <input
                  type="text"
                  value={newRestForm.tagline}
                  onChange={(e) => setNewRestForm({ ...newRestForm, tagline: e.target.value })}
                  placeholder="e.g. Authentic hand-rolled treats & delicacies"
                  className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5c4037] font-semibold mb-1">Cuisines (comma separated)</label>
                  <input
                    type="text"
                    value={newRestForm.cuisine}
                    onChange={(e) => setNewRestForm({ ...newRestForm, cuisine: e.target.value })}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#5c4037] font-semibold mb-1">Price For One (₹)</label>
                  <input
                    type="number"
                    value={newRestForm.priceForOne}
                    onChange={(e) => setNewRestForm({ ...newRestForm, priceForOne: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5c4037] font-semibold mb-1">Delivery Time</label>
                  <input
                    type="text"
                    value={newRestForm.deliveryTime}
                    onChange={(e) => setNewRestForm({ ...newRestForm, deliveryTime: e.target.value })}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#5c4037] font-semibold mb-1">Discount Promo Badge</label>
                  <input
                    type="text"
                    value={newRestForm.discountBadge}
                    onChange={(e) => setNewRestForm({ ...newRestForm, discountBadge: e.target.value })}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5c4037] font-semibold mb-1">Nashik Location / Address</label>
                <input
                  type="text"
                  value={newRestForm.address}
                  onChange={(e) => setNewRestForm({ ...newRestForm, address: e.target.value })}
                  className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddRestaurantOpen(false)}
                  className="px-4 py-2 border border-[#e4e2e1] rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#29695b] hover:bg-[#065043] text-white rounded-lg text-xs font-bold"
                >
                  Add Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANAGE RESTAURANT MENU */}
      {managingRestaurantId && currentManagingRestaurant && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#e4e2e1] pb-3">
              <div>
                <h3 className="font-headline font-bold text-lg text-[#1b1c1c]">
                  Menu Manager: {currentManagingRestaurant.name}
                </h3>
                <p className="text-xs text-[#5c4037]">Total {currentManagingRestaurant.menu.length} active dishes</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddDishOpen(true)}
                  className="px-3 py-1.5 bg-[#a83300] text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span> Add Dish
                </button>
                <button onClick={() => setManagingRestaurantId(null)} className="text-gray-400 hover:text-black">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Menu Items Table */}
            <div className="space-y-2">
              {currentManagingRestaurant.menu.map((dish) => (
                <div key={dish.id} className="p-3 bg-[#fbf9f8] rounded-xl border border-[#e4e2e1] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={dish.image} alt={dish.name} className="w-12 h-12 rounded-lg object-cover bg-gray-200 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${dish.isVeg ? 'text-emerald-700 border-emerald-500' : 'text-red-700 border-red-500'}`}>
                          {dish.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                        <h5 className="font-bold text-xs text-[#1b1c1c] truncate">{dish.name}</h5>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate max-w-sm">{dish.category} • {dish.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <span>₹</span>
                      <input
                        type="number"
                        defaultValue={dish.price}
                        onBlur={(e) => updateMenuItemPrice(currentManagingRestaurant.id, dish.id, Number(e.target.value))}
                        className="w-16 p-1 text-center bg-white border border-[#e4e2e1] rounded font-bold"
                      />
                    </div>

                    <button
                      onClick={() => toggleItemAvailability(currentManagingRestaurant.id, dish.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        dish.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {dish.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </button>

                    <button
                      onClick={() => deleteMenuItem(currentManagingRestaurant.id, dish.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete dish"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Dish Sub-Form */}
            {isAddDishOpen && (
              <div className="p-4 bg-[#ffdbd0]/30 rounded-xl border border-[#e5beb2] space-y-3 mt-4">
                <h4 className="font-bold text-xs text-[#a83300]">Add New Dish to Menu</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-600 mb-1">Dish Name</label>
                    <input
                      type="text"
                      value={newDishForm.name}
                      onChange={(e) => setNewDishForm({ ...newDishForm, name: e.target.value })}
                      placeholder="e.g. Paneer Butter Masala"
                      className="w-full p-2 bg-white rounded border border-[#e4e2e1]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={newDishForm.price}
                      onChange={(e) => setNewDishForm({ ...newDishForm, price: Number(e.target.value) })}
                      className="w-full p-2 bg-white rounded border border-[#e4e2e1]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Category</label>
                    <select
                      value={newDishForm.category}
                      onChange={(e) => setNewDishForm({ ...newDishForm, category: e.target.value as any })}
                      className="w-full p-2 bg-white rounded border border-[#e4e2e1]"
                    >
                      <option value="Appetizers">Appetizers</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Breads">Breads</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Burgers">Burgers</option>
                      <option value="Pizzas">Pizzas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Food Type</label>
                    <select
                      value={newDishForm.isVeg ? 'veg' : 'non-veg'}
                      onChange={(e) => setNewDishForm({ ...newDishForm, isVeg: e.target.value === 'veg' })}
                      className="w-full p-2 bg-white rounded border border-[#e4e2e1]"
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Vegetarian</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-600 mb-1">Description</label>
                    <input
                      type="text"
                      value={newDishForm.description}
                      onChange={(e) => setNewDishForm({ ...newDishForm, description: e.target.value })}
                      placeholder="Short appetizing description"
                      className="w-full p-2 bg-white rounded border border-[#e4e2e1]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsAddDishOpen(false)}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddDish(currentManagingRestaurant.id)}
                    className="px-4 py-1.5 bg-[#a83300] text-white rounded text-xs font-bold"
                  >
                    Save Dish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD COUPON */}
      {isAddCouponOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-lg text-[#1b1c1c]">Create Discount Coupon</h3>
              <button onClick={() => setIsAddCouponOpen(false)} className="text-gray-400 hover:text-black">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#5c4037] font-semibold mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  value={newCouponForm.code}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. NASHIK30 / MONSOON"
                  className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5c4037] font-semibold mb-1">Discount Type</label>
                  <select
                    value={newCouponForm.discountType}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, discountType: e.target.value as any })}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Cash (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5c4037] font-semibold mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={newCouponForm.discountValue}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, discountValue: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5c4037] font-semibold mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newCouponForm.minOrder}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, minOrder: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#5c4037] font-semibold mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={newCouponForm.maxDiscount || ''}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, maxDiscount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5c4037] font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={newCouponForm.description}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                  placeholder="e.g. 30% OFF up to ₹150 on all orders"
                  className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCouponOpen(false)}
                  className="px-4 py-2 border border-[#e4e2e1] rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#a83300] hover:bg-[#d24200] text-white rounded-lg text-xs font-bold"
                >
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#e4e2e1] pb-3">
              <div>
                <h3 className="font-headline font-bold text-lg text-[#1b1c1c]">Order #{selectedOrderDetails.orderNumber}</h3>
                <p className="text-xs text-[#5c4037]">{selectedOrderDetails.placedAt} • {selectedOrderDetails.restaurantName}</p>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-gray-400 hover:text-black">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Customer & Address */}
            <div className="p-3 bg-[#f6f3f2] rounded-xl text-xs space-y-1">
              <span className="font-bold text-[#1b1c1c] block">Delivery Location:</span>
              <p className="text-gray-600">{selectedOrderDetails.address.label} - {selectedOrderDetails.address.addressLine}</p>
              <p className="text-[#29695b] font-medium">{selectedOrderDetails.address.phone}</p>
            </div>

            {/* Items */}
            <div className="space-y-2 border-b border-[#f0eded] pb-3">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Ordered Items</span>
              {selectedOrderDetails.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span>{it.quantity}x {it.item.name}</span>
                  <span className="font-bold">₹{it.item.price * it.quantity}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="space-y-1 text-xs text-gray-600 border-b border-[#f0eded] pb-3">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span>₹{selectedOrderDetails.itemTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{selectedOrderDetails.deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>₹{selectedOrderDetails.taxes}</span>
              </div>
              {selectedOrderDetails.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({selectedOrderDetails.couponApplied})</span>
                  <span>-₹{selectedOrderDetails.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-[#1b1c1c] pt-1">
                <span>Total Paid ({selectedOrderDetails.paymentMethod.toUpperCase()})</span>
                <span className="text-[#a83300]">₹{selectedOrderDetails.total}</span>
              </div>
            </div>

            {/* Rider info */}
            <div className="flex items-center gap-3 p-2.5 bg-emerald-50 rounded-xl text-xs">
              <span className="material-symbols-outlined text-[#29695b]">two_wheeler</span>
              <div>
                <span className="font-bold text-gray-800 block">Assigned Rider: {selectedOrderDetails.deliveryPartner.name}</span>
                <span className="text-[10px] text-gray-500">{selectedOrderDetails.deliveryPartner.vehicleNumber} • {selectedOrderDetails.deliveryPartner.phone}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="w-full py-2.5 bg-[#1b1c1c] text-white font-bold text-xs rounded-xl hover:bg-black transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
