import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus, MenuItem, Restaurant } from '../types';

export const RestaurantPortalView: React.FC = () => {
  const {
    restaurants,
    orders,
    addOrder,
    cancelOrder,
    updateOrderStatus,
    toggleItemAvailability,
    addMenuItem,
    deleteMenuItem,
    updateMenuItemPrice,
    toggleRestaurantStatus,
    setRole,
    setCurrentScreen
  } = useApp();

  // Active selected restaurant for the portal
  const [selectedRestId, setSelectedRestId] = useState<string>('rest-3');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'analytics' | 'settings'>('orders');
  
  // Mobile stage filter for KDS orders
  const [mobileOrderFilter, setMobileOrderFilter] = useState<'all' | 'new' | 'preparing' | 'ready'>('all');
  
  // Menu tab filters
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);

  // Modals & Interactive States
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [viewTicketOrder, setViewTicketOrder] = useState<any | null>(null);
  const [rejectOrderModal, setRejectOrderModal] = useState<any | null>(null);
  const [selectedRejectReason, setSelectedRejectReason] = useState<string>('Item Out of Stock');
  const [customRejectNote, setCustomRejectNote] = useState<string>('');
  const [orderPrepTimes, setOrderPrepTimes] = useState<Record<string, number>>({});
  const [editingPriceItemId, setEditingPriceItemId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [prepTimeBuffer, setPrepTimeBuffer] = useState<number>(20);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState<boolean>(false);
  const [soundAlerts, setSoundAlerts] = useState<boolean>(true);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // New Dish Form State
  const [newDishName, setNewDishName] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<MenuItem['category']>('Main Course');
  const [newDishIsVeg, setNewDishIsVeg] = useState(true);
  const [newDishImage, setNewDishImage] = useState('');

  // Selected Restaurant
  const activeRestaurant: Restaurant = restaurants.find(r => r.id === selectedRestId) || restaurants[0];

  // Orders for this restaurant
  const restaurantOrders = useMemo(() => {
    // If order has restaurantId match or fallback to all orders for demo realism
    return orders.filter(o => o.restaurantId === activeRestaurant.id || orders.length < 5);
  }, [orders, activeRestaurant]);

  const newOrders = restaurantOrders.filter(o => o.status === 'confirmed');
  const preparingOrders = restaurantOrders.filter(o => o.status === 'preparing');
  const readyAndDispatchedOrders = restaurantOrders.filter(o => o.status === 'on_the_way' || o.status === 'delivered');

  // Trigger temporary notification
  const triggerToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // Helper to simulate a realistic incoming order
  const handleSimulateIncomingOrder = () => {
    const availableItems = activeRestaurant.menu.filter(i => i.isAvailable);
    const menuToUse = availableItems.length > 0 ? availableItems : activeRestaurant.menu;
    
    if (menuToUse.length === 0) {
      triggerToast('Menu is empty. Add dishes first!');
      return;
    }

    const shuffled = [...menuToUse].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(2, shuffled.length));
    
    const items = selected.map(item => ({
      restaurantId: activeRestaurant.id,
      restaurantName: activeRestaurant.name,
      quantity: Math.floor(Math.random() * 2) + 1,
      item
    }));

    const itemTotal = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
    const taxes = Math.round(itemTotal * 0.05);
    const deliveryFee = 35;
    const total = itemTotal + taxes + deliveryFee;

    const names = ['Pooja Sharma', 'Vikram Patil', 'Rohit Shinde', 'Tanvi Kulkarni', 'Aditya Joshi', 'Neha Deshpande', 'Siddharth Rao'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const notes = [
      'Please make it medium spicy with extra green mint chutney.',
      'Pack curry and breads separately. Cutlery needed please.',
      'Pure veg handling only. No garlic in dal please.',
      'Extra lemons and sliced onion rings.',
      'Please keep it piping hot for delivery.'
    ];
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    const randomOrderNo = `BG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newSimulatedOrder: any = {
      id: `ord-sim-${Date.now()}`,
      orderNumber: randomOrderNo,
      restaurantId: activeRestaurant.id,
      restaurantName: activeRestaurant.name,
      items,
      itemTotal,
      deliveryFee,
      taxes,
      discount: 0,
      total,
      status: 'confirmed',
      estimatedArrival: '25-30 mins',
      estimatedMinutes: 20,
      placedAt: 'Just now (<1 min ago)',
      address: {
        id: `addr-${Date.now()}`,
        label: 'Home',
        addressLine: `${Math.floor(10 + Math.random() * 90)}, Green Leaf Park, College Road, Nashik 422005`,
        phone: '+91 98220 12345'
      },
      customerName: randomName,
      customerPhone: `+91 ${Math.floor(9820000000 + Math.random() * 9999999)}`,
      specialInstructions: randomNote,
      paymentMethod: Math.random() > 0.3 ? 'upi' : 'cod',
      paymentStatus: Math.random() > 0.3 ? 'paid' : 'pending',
      deliveryPartner: {
        name: 'Gaurav K.',
        phone: '+91 98230 99881',
        rating: 4.9,
        deliveriesCount: 780,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        vehicleNumber: 'MH 15 DP 3042'
      }
    };

    addOrder(newSimulatedOrder);
    triggerToast(`🔔 New Order #${randomOrderNo} received from ${randomName}!`);
  };

  // Quick Accept with selected prep time
  const handleAcceptOrder = (orderId: string, orderNumber: string) => {
    const time = orderPrepTimes[orderId] || 20;
    updateOrderStatus(orderId, 'preparing');
    triggerToast(`Order #${orderNumber} accepted! Cooking timer set to ${time} mins 👨‍🍳`);
  };

  // Confirm rejection
  const handleConfirmReject = () => {
    if (!rejectOrderModal) return;
    const finalReason = selectedRejectReason === 'Other' ? (customRejectNote || 'Other reason') : selectedRejectReason;
    cancelOrder(rejectOrderModal.id, finalReason);
    triggerToast(`Order #${rejectOrderModal.orderNumber} declined (${finalReason})`);
    setRejectOrderModal(null);
    setCustomRejectNote('');
  };

  // Handle Adding Dish
  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || !newDishPrice) return;

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: newDishName.trim(),
      description: newDishDesc.trim() || 'Freshly prepared signature delicacy with authentic spices.',
      price: parseFloat(newDishPrice) || 199,
      image: newDishImage.trim() || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
      category: newDishCategory,
      isVeg: newDishIsVeg,
      isAvailable: true,
      rating: 4.8
    };

    addMenuItem(activeRestaurant.id, newItem);
    triggerToast(`Added "${newItem.name}" to menu!`);
    setIsAddDishOpen(false);
    
    // Reset Form
    setNewDishName('');
    setNewDishDesc('');
    setNewDishPrice('');
    setNewDishImage('');
    setNewDishIsVeg(true);
  };

  // Quick Price Save
  const handleSavePrice = (itemId: string) => {
    const priceNum = parseFloat(tempPrice);
    if (!isNaN(priceNum) && priceNum > 0) {
      updateMenuItemPrice(activeRestaurant.id, itemId, priceNum);
      triggerToast('Price updated successfully');
    }
    setEditingPriceItemId(null);
  };

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return activeRestaurant.menu.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                          item.description.toLowerCase().includes(menuSearch.toLowerCase());
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchVeg = !vegOnlyFilter || item.isVeg;
      return matchSearch && matchCategory && matchVeg;
    });
  }, [activeRestaurant.menu, menuSearch, selectedCategory, vegOnlyFilter]);

  const categories = ['All', 'Appetizers', 'Main Course', 'Breads', 'Beverages', 'Desserts', 'Burgers', 'Pizzas', 'Sides'];

  return (
    <div className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c] font-sans pb-24 md:pb-12 flex flex-col">
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1b1c1c] text-white px-4 py-2.5 rounded-xl shadow-xl border border-white/20 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          <span>{notificationToast}</span>
        </div>
      )}

      {/* ================= TOP PARTNER NAVBAR (RESPONSIVE) ================= */}
      <header className="bg-[#1b1c1c] text-white sticky top-0 z-40 shadow-md border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Outlet Selector & Brand */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#a83300] flex items-center justify-center font-headline font-bold text-base sm:text-lg shrink-0 shadow-sm">
                🍽️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedRestId}
                    onChange={(e) => setSelectedRestId(e.target.value)}
                    className="bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-sm sm:text-base rounded-lg px-2 py-0.5 outline-none cursor-pointer border border-white/10 max-w-[200px] sm:max-w-[280px] truncate"
                  >
                    {restaurants.map((r) => (
                      <option key={r.id} value={r.id} className="text-[#1b1c1c] bg-white">
                        {r.name} ({r.address.split(',')[0]})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-300 mt-0.5">
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${activeRestaurant.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className={activeRestaurant.isOpen ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                      {activeRestaurant.isOpen ? 'Kitchen Open & Live' : 'Kitchen Closed'}
                    </span>
                  </span>
                  <span className="hidden sm:inline">• Nashik Hub</span>
                </div>
              </div>
            </div>

            {/* Quick Open/Close Toggle Button for Mobile */}
            <button
              type="button"
              onClick={() => {
                toggleRestaurantStatus(activeRestaurant.id);
                triggerToast(activeRestaurant.isOpen ? 'Kitchen marked as Closed' : 'Kitchen marked as Open & Live');
              }}
              className={`sm:hidden px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                activeRestaurant.isOpen
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-red-500/20 text-red-300 border-red-500/40'
              }`}
            >
              {activeRestaurant.isOpen ? 'Pause' : 'Go Live'}
            </button>
          </div>

          {/* Desktop Controls & App Switchers */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
            {/* Sound alert switch */}
            <button
              type="button"
              onClick={() => {
                setSoundAlerts(!soundAlerts);
                triggerToast(soundAlerts ? 'Order chime muted' : 'Order chime enabled 🔔');
              }}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                soundAlerts ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-white/10 text-gray-400'
              }`}
              title={soundAlerts ? 'Audio alert active' : 'Audio alert muted'}
            >
              <span className="material-symbols-outlined text-[16px]">
                {soundAlerts ? 'volume_up' : 'volume_off'}
              </span>
              <span className="hidden md:inline">{soundAlerts ? 'Chime ON' : 'Muted'}</span>
            </button>

            {/* Desktop Kitchen Online Toggle */}
            <button
              type="button"
              onClick={() => {
                toggleRestaurantStatus(activeRestaurant.id);
                triggerToast(activeRestaurant.isOpen ? 'Kitchen marked as Closed' : 'Kitchen marked as Open & Live');
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeRestaurant.isOpen
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-sm'
                  : 'bg-red-600 hover:bg-red-700 text-white border-red-500'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {activeRestaurant.isOpen ? 'restaurant' : 'do_not_disturb_on'}
              </span>
              <span>{activeRestaurant.isOpen ? 'Accepting Orders' : 'Store Offline'}</span>
            </button>

            {/* Switch to Customer App */}
            <button
              onClick={() => {
                setRole('customer');
                setCurrentScreen('home');
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              <span className="hidden sm:inline">Customer App</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= PORTAL SUB-HEADER & STATS STRIP (RESPONSIVE) ================= */}
      <div className="bg-white border-b border-[#e4e2e1] px-4 md:px-8 py-3 shadow-xs">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full md:w-auto">
            <div className="bg-[#f6f3f2] p-2 sm:p-2.5 rounded-xl border border-[#e4e2e1] flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#a83300]/10 text-[#a83300] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              </div>
              <div>
                <div className="text-[10px] text-[#5c4037] font-semibold uppercase">Active Orders</div>
                <div className="text-sm font-bold text-[#1b1c1c]">{newOrders.length + preparingOrders.length}</div>
              </div>
            </div>

            <div className="bg-[#f6f3f2] p-2 sm:p-2.5 rounded-xl border border-[#e4e2e1] flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#29695b]/10 text-[#29695b] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">payments</span>
              </div>
              <div>
                <div className="text-[10px] text-[#5c4037] font-semibold uppercase">Today's Sales</div>
                <div className="text-sm font-bold text-[#29695b]">₹14,850</div>
              </div>
            </div>

            <div className="bg-[#f6f3f2] p-2 sm:p-2.5 rounded-xl border border-[#e4e2e1] flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">timer</span>
              </div>
              <div>
                <div className="text-[10px] text-[#5c4037] font-semibold uppercase">Avg Prep Time</div>
                <div className="text-sm font-bold text-[#1b1c1c]">{prepTimeBuffer} mins</div>
              </div>
            </div>

            <div className="bg-[#f6f3f2] p-2 sm:p-2.5 rounded-xl border border-[#e4e2e1] flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
              </div>
              <div>
                <div className="text-[10px] text-[#5c4037] font-semibold uppercase">Live Menu</div>
                <div className="text-sm font-bold text-[#1b1c1c]">{activeRestaurant.menu.length} Items</div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsAddDishOpen(true)}
              className="w-full sm:w-auto px-3.5 py-2 bg-[#a83300] hover:bg-[#d24200] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Add New Dish</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= RESPONSIVE NAVIGATION TABS ================= */}
      <div className="bg-[#f0eded]/60 border-b border-[#e4e2e1] sticky top-[57px] sm:top-[65px] z-30 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar py-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'orders'
                  ? 'bg-white text-[#a83300] shadow-sm border border-[#e4e2e1]'
                  : 'text-[#5c4037] hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">kitchen</span>
              <span>Kitchen Display (KDS)</span>
              <span className="ml-1 bg-[#ffdbd0] text-[#a83300] text-[10px] font-bold px-2 py-0.2 rounded-full">
                {newOrders.length + preparingOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'menu'
                  ? 'bg-white text-[#a83300] shadow-sm border border-[#e4e2e1]'
                  : 'text-[#5c4037] hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
              <span>Menu & Stock</span>
              <span className="ml-1 bg-[#eae8e7] text-[#5c4037] text-[10px] font-bold px-2 py-0.2 rounded-full">
                {activeRestaurant.menu.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'analytics'
                  ? 'bg-white text-[#a83300] shadow-sm border border-[#e4e2e1]'
                  : 'text-[#5c4037] hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">insights</span>
              <span>Analytics & Sales</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-white text-[#a83300] shadow-sm border border-[#e4e2e1]'
                  : 'text-[#5c4037] hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">store</span>
              <span>Outlet Settings</span>
            </button>
          </nav>
        </div>
      </div>

      {/* ================= MAIN TAB CONTENT ================= */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        
        {/* TAB 1: KITCHEN DISPLAY SYSTEM (ORDERS) */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Mobile Column Switcher (Visible on <md screens) */}
            <div className="md:hidden flex bg-[#e4e2e1]/60 p-1 rounded-xl gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMobileOrderFilter('all')}
                className={`flex-1 py-2 rounded-lg transition-all text-center ${
                  mobileOrderFilter === 'all' ? 'bg-white text-[#1b1c1c] shadow-xs' : 'text-[#5c4037]'
                }`}
              >
                All ({restaurantOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setMobileOrderFilter('new')}
                className={`flex-1 py-2 rounded-lg transition-all text-center ${
                  mobileOrderFilter === 'new' ? 'bg-[#ffdbd0] text-[#a83300] shadow-xs' : 'text-[#5c4037]'
                }`}
              >
                New ({newOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setMobileOrderFilter('preparing')}
                className={`flex-1 py-2 rounded-lg transition-all text-center ${
                  mobileOrderFilter === 'preparing' ? 'bg-amber-100 text-amber-900 shadow-xs' : 'text-[#5c4037]'
                }`}
              >
                Cooking ({preparingOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setMobileOrderFilter('ready')}
                className={`flex-1 py-2 rounded-lg transition-all text-center ${
                  mobileOrderFilter === 'ready' ? 'bg-emerald-100 text-emerald-900 shadow-xs' : 'text-[#5c4037]'
                }`}
              >
                Ready ({readyAndDispatchedOrders.length})
              </button>
            </div>

            {/* Responsive Orders Grid: 1 col on mobile, 3 cols on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              
              {/* COLUMN 1: NEW / CONFIRMED ORDERS */}
              {(mobileOrderFilter === 'all' || mobileOrderFilter === 'new') && (
                <div className="bg-[#f0eded] p-3 sm:p-4 rounded-2xl space-y-3 border border-[#e4e2e1]">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e4e2e1]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#a83300] animate-ping" />
                      <h3 className="font-headline font-bold text-xs sm:text-sm uppercase tracking-wide text-[#1b1c1c]">
                        1. New Incoming
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#ffdbd0] text-[#a83300] font-bold text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                        {newOrders.length} pending
                      </span>
                      <button
                        type="button"
                        onClick={handleSimulateIncomingOrder}
                        className="px-2 py-1 bg-white hover:bg-[#ffdbd0] text-[#a83300] border border-[#ffdbd0] rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs"
                        title="Simulate a new incoming customer order"
                      >
                        <span className="material-symbols-outlined text-[13px]">add_alert</span>
                        <span>+ Test Order</span>
                      </button>
                    </div>
                  </div>

                  {newOrders.length === 0 ? (
                    <div className="bg-white/70 rounded-xl p-8 text-center text-xs text-[#5c4037] border border-dashed border-[#e4e2e1] space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#ffdbd0]/60 text-[#a83300] flex items-center justify-center mx-auto">
                        <span className="material-symbols-outlined text-[24px]">notifications_active</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#1b1c1c] text-sm">No new orders pending acceptance</p>
                        <p className="text-[11px] text-[#5c4037] mt-0.5">New incoming orders from customers will appear here with a live alert chime.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleSimulateIncomingOrder}
                        className="px-3.5 py-1.5 bg-[#a83300] hover:bg-[#d24200] text-white rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[15px]">add</span>
                        <span>Simulate New Order</span>
                      </button>
                    </div>
                  ) : (
                    newOrders.map(order => {
                      const currentPrepTime = orderPrepTimes[order.id] || 20;
                      return (
                        <div
                          key={order.id}
                          className="bg-white p-4 rounded-xl shadow-md border-2 border-[#ffdbd0] hover:border-[#a83300] transition-all space-y-3 relative overflow-hidden"
                        >
                          {/* Top Status Bar */}
                          <div className="flex justify-between items-center bg-[#fff5f2] -mx-4 -mt-4 px-4 py-1.5 border-b border-[#ffdbd0] text-[11px] font-semibold text-[#a83300]">
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-[#a83300] animate-pulse" />
                              <span>⏳ ACTION REQUIRED • Awaiting Acceptance</span>
                            </span>
                            <span className="text-[#5c4037] text-[10px]">{order.placedAt}</span>
                          </div>

                          {/* Order Header */}
                          <div className="flex justify-between items-start pt-1">
                            <div>
                              <span className="font-headline font-bold text-base text-[#1b1c1c]">
                                Order #{order.orderNumber}
                              </span>
                              <div className="text-xs text-[#5c4037] flex items-center gap-1 mt-0.5 font-medium">
                                <span className="material-symbols-outlined text-[14px]">account_circle</span>
                                <span className="font-bold text-[#1b1c1c]">{order.customerName || order.address?.label || 'Customer'}</span>
                                {order.customerPhone && (
                                  <span className="text-[11px] text-gray-500">• {order.customerPhone}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-bold text-[#a83300]">₹{order.total}</span>
                              <span className={`block text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                                order.paymentStatus === 'paid' 
                                  ? 'text-emerald-700 bg-emerald-50' 
                                  : 'text-amber-800 bg-amber-50'
                              }`}>
                                {order.paymentMethod.toUpperCase()} {order.paymentStatus === 'paid' ? 'PAID' : 'COD'}
                              </span>
                            </div>
                          </div>

                          {/* Delivery Address Preview */}
                          <div className="bg-[#f6f3f2] p-2 rounded-lg text-xs flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 truncate text-[#5c4037]">
                              <span className="material-symbols-outlined text-[15px] shrink-0 text-[#a83300]">location_on</span>
                              <span className="truncate">{order.address?.addressLine || 'Nashik City'}</span>
                            </div>
                            <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded text-[#1b1c1c] shrink-0 border border-[#e4e2e1]">
                              {order.address?.label || 'Home'}
                            </span>
                          </div>

                          {/* Special Cooking Instructions Note */}
                          {order.specialInstructions && (
                            <div className="bg-amber-50/80 border border-amber-200/90 rounded-lg p-2 text-xs flex items-start gap-1.5 text-amber-900">
                              <span className="material-symbols-outlined text-amber-600 text-[16px] shrink-0 mt-0.5">restaurant</span>
                              <div className="flex-1">
                                <span className="font-bold text-[10px] uppercase tracking-wider block text-amber-800">Special Cooking Request:</span>
                                <span className="font-medium">{order.specialInstructions}</span>
                              </div>
                            </div>
                          )}

                          {/* Items List */}
                          <div className="space-y-1.5 text-xs text-[#1b1c1c] border-y border-[#f0eded] py-2.5">
                            {order.items.map((ci, idx) => (
                              <div key={idx} className="flex justify-between items-center font-medium">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${ci.item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                                  <span className="font-bold text-[#a83300] bg-[#ffdbd0]/40 px-1.5 py-0.2 rounded text-[11px]">
                                    {ci.quantity}x
                                  </span>
                                  <span className="truncate max-w-[170px] sm:max-w-[210px] font-semibold text-[#1b1c1c]">
                                    {ci.item.name}
                                  </span>
                                </div>
                                <span className="text-xs font-bold text-[#5c4037]">₹{ci.item.price * ci.quantity}</span>
                              </div>
                            ))}
                          </div>

                          {/* Prep Time Quick Selector */}
                          <div className="bg-[#f6f3f2] p-2 rounded-xl border border-[#e4e2e1] space-y-1.5">
                            <div className="flex justify-between items-center text-[11px] font-bold text-[#5c4037]">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">timer</span>
                                <span>Target Prep Time:</span>
                              </span>
                              <span className="text-[#a83300] font-headline">{currentPrepTime} mins</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1">
                              {[15, 20, 30, 45].map((mins) => (
                                <button
                                  key={mins}
                                  type="button"
                                  onClick={() => setOrderPrepTimes(prev => ({ ...prev, [order.id]: mins }))}
                                  className={`py-1 rounded-lg text-xs font-bold transition-all text-center ${
                                    currentPrepTime === mins
                                      ? 'bg-[#a83300] text-white shadow-xs'
                                      : 'bg-white text-[#5c4037] hover:bg-gray-100 border border-[#e4e2e1]'
                                  }`}
                                >
                                  {mins}m
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setViewTicketOrder(order)}
                              className="p-2.5 bg-[#f6f3f2] hover:bg-[#eae8e7] rounded-xl text-[#5c4037] text-xs font-semibold shrink-0"
                              title="Print / View Kitchen Ticket"
                            >
                              <span className="material-symbols-outlined text-[18px]">receipt</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectOrderModal(order)}
                              className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors shrink-0"
                              title="Decline Order"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAcceptOrder(order.id, order.orderNumber)}
                              className="flex-1 py-2.5 bg-[#a83300] hover:bg-[#d24200] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98]"
                            >
                              <span className="material-symbols-outlined text-[16px]">soup_kitchen</span>
                              <span>Accept & Cook ({currentPrepTime}m)</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* COLUMN 2: IN PREPARATION (COOKING) */}
              {(mobileOrderFilter === 'all' || mobileOrderFilter === 'preparing') && (
                <div className="bg-[#f0eded] p-3 sm:p-4 rounded-2xl space-y-3 border border-[#e4e2e1]">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e4e2e1]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <h3 className="font-headline font-bold text-xs sm:text-sm uppercase tracking-wide text-[#1b1c1c]">
                        2. Cooking in Kitchen
                      </h3>
                    </div>
                    <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2.5 py-0.5 rounded-full">
                      {preparingOrders.length}
                    </span>
                  </div>

                  {preparingOrders.length === 0 ? (
                    <div className="bg-white/60 rounded-xl p-8 text-center text-xs text-[#5c4037] border border-dashed border-[#e4e2e1]">
                      <span className="material-symbols-outlined text-[32px] text-gray-400 mb-1">skillet</span>
                      <p>No active dishes on the stove</p>
                    </div>
                  ) : (
                    preparingOrders.map(order => (
                      <div
                        key={order.id}
                        className="bg-white p-4 rounded-xl shadow-sm border border-amber-200 space-y-3"
                      >
                        {/* Order Header */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-headline font-bold text-sm text-[#1b1c1c]">
                              Order #{order.orderNumber}
                            </span>
                            <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                              <span>Simmering • ETA {order.estimatedMinutes || 18}m</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                              In Oven
                            </span>
                          </div>
                        </div>

                        {/* Items Checklist */}
                        <div className="space-y-1.5 text-xs text-[#1b1c1c] bg-amber-50/40 p-2.5 rounded-xl border border-amber-100">
                          {order.items.map((ci, idx) => (
                            <label key={idx} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked
                                className="w-3.5 h-3.5 accent-[#a83300] rounded"
                              />
                              <span className="font-bold text-[#1b1c1c]">{ci.quantity}x</span>
                              <span className="truncate">{ci.item.name}</span>
                            </label>
                          ))}
                        </div>

                        {/* Assigned Rider Info */}
                        <div className="flex items-center justify-between text-xs text-[#5c4037] bg-[#f6f3f2] p-2 rounded-lg">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="material-symbols-outlined text-[#29695b] text-[16px]">two_wheeler</span>
                            <span className="font-semibold text-xs truncate">
                              {order.deliveryPartner?.name || 'Assigned Rider'}
                            </span>
                          </div>
                          <span className="text-[10px] bg-white border border-[#e4e2e1] px-1.5 py-0.5 rounded font-mono">
                            {order.deliveryPartner?.vehicleNumber || 'MH-15-EV'}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setViewTicketOrder(order)}
                            className="p-2 bg-[#f6f3f2] hover:bg-[#eae8e7] rounded-xl text-[#5c4037] text-xs font-semibold"
                            title="View Kitchen Ticket"
                          >
                            <span className="material-symbols-outlined text-[18px]">receipt</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateOrderStatus(order.id, 'on_the_way');
                              triggerToast(`Order #${order.orderNumber} ready! Notified rider.`);
                            }}
                            className="flex-1 py-2.5 bg-[#29695b] hover:bg-[#1d4d42] text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span>Food Ready for Pickup</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* COLUMN 3: HANDED OVER / DISPATCHED */}
              {(mobileOrderFilter === 'all' || mobileOrderFilter === 'ready') && (
                <div className="bg-[#f0eded] p-3 sm:p-4 rounded-2xl space-y-3 border border-[#e4e2e1]">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e4e2e1]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <h3 className="font-headline font-bold text-xs sm:text-sm uppercase tracking-wide text-[#1b1c1c]">
                        3. Handed to Rider
                      </h3>
                    </div>
                    <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-2.5 py-0.5 rounded-full">
                      {readyAndDispatchedOrders.length}
                    </span>
                  </div>

                  {readyAndDispatchedOrders.length === 0 ? (
                    <div className="bg-white/60 rounded-xl p-8 text-center text-xs text-[#5c4037] border border-dashed border-[#e4e2e1]">
                      <span className="material-symbols-outlined text-[32px] text-gray-400 mb-1">delivery_dining</span>
                      <p>No dispatched orders in transit</p>
                    </div>
                  ) : (
                    readyAndDispatchedOrders.map(order => (
                      <div
                        key={order.id}
                        className="bg-white p-4 rounded-xl shadow-sm border border-[#e4e2e1] space-y-2.5"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-headline font-bold text-sm text-[#1b1c1c]">
                              Order #{order.orderNumber}
                            </span>
                            <div className="text-[11px] text-[#5c4037]">
                              {order.items.length} items • ₹{order.total}
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status === 'delivered' ? 'Delivered' : 'On The Way'}
                          </span>
                        </div>

                        <div className="text-xs text-[#5c4037] bg-[#f6f3f2] p-2 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs">sports_motorsports</span>
                            <span>{order.deliveryPartner?.name}</span>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-700">En Route</span>
                        </div>

                        <div className="flex justify-between items-center pt-1 text-xs">
                          <button
                            type="button"
                            onClick={() => setViewTicketOrder(order)}
                            className="text-[#a83300] font-bold text-xs hover:underline flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">receipt</span>
                            <span>View Details</span>
                          </button>
                          <span className="text-[10px] text-gray-400">Arrives in ~{order.estimatedMinutes}m</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: MENU & INVENTORY MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-5">
            {/* Search & Filter Controls */}
            <div className="bg-white p-4 rounded-2xl border border-[#e4e2e1] shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="flex-1 flex items-center bg-[#f6f3f2] px-3 py-2 rounded-xl border border-[#e4e2e1] focus-within:border-[#a83300]">
                  <span className="material-symbols-outlined text-[#5c4037] text-[18px] mr-2">search</span>
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search dishes by name or ingredients..."
                    className="w-full bg-transparent text-xs text-[#1b1c1c] outline-none"
                  />
                  {menuSearch && (
                    <button onClick={() => setMenuSearch('')} className="text-gray-400 hover:text-black">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>

                {/* Quick Filters */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      vegOnlyFilter
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-[#f6f3f2] text-[#5c4037] border-[#e4e2e1]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>Pure Veg Only</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddDishOpen(true)}
                    className="px-3.5 py-2 bg-[#a83300] hover:bg-[#d24200] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span className="hidden sm:inline">Add Dish</span>
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#1b1c1c] text-white'
                        : 'bg-[#f6f3f2] text-[#5c4037] hover:bg-[#eae8e7]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items List / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems.length === 0 ? (
                <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed border-[#e4e2e1] text-center space-y-2">
                  <span className="material-symbols-outlined text-[36px] text-gray-400">search_off</span>
                  <h4 className="font-bold text-sm text-[#1b1c1c]">No menu dishes found</h4>
                  <p className="text-xs text-[#5c4037]">Try tweaking your search term or category filters</p>
                </div>
              ) : (
                filteredMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl p-4 border transition-all shadow-xs flex flex-col justify-between ${
                      item.isAvailable ? 'border-[#e4e2e1]' : 'border-red-200 bg-red-50/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#e4e2e1]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                          <h4 className="font-headline font-bold text-sm text-[#1b1c1c] truncate">{item.name}</h4>
                        </div>
                        <p className="text-[11px] text-[#5c4037] line-clamp-2 mt-0.5 leading-tight">{item.description}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          {editingPriceItemId === item.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-[#a83300]">₹</span>
                              <input
                                type="number"
                                autoFocus
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                className="w-16 px-1.5 py-0.5 text-xs font-bold bg-[#f6f3f2] border border-[#a83300] rounded"
                              />
                              <button
                                onClick={() => handleSavePrice(item.id)}
                                className="px-2 py-0.5 bg-[#a83300] text-white text-[10px] font-bold rounded"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="font-headline font-bold text-sm text-[#a83300]">₹{item.price}</span>
                              <button
                                onClick={() => {
                                  setEditingPriceItemId(item.id);
                                  setTempPrice(item.price.toString());
                                }}
                                className="text-gray-400 hover:text-black p-0.5"
                                title="Edit Price"
                              >
                                <span className="material-symbols-outlined text-[14px]">edit</span>
                              </button>
                            </div>
                          )}
                          <span className="text-[10px] text-gray-500 bg-[#f6f3f2] px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Controls: Availability Toggle & Delete */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#f0eded]">
                      <button
                        type="button"
                        onClick={() => {
                          toggleItemAvailability(activeRestaurant.id, item.id);
                          triggerToast(`${item.name} marked ${item.isAvailable ? 'Out of Stock' : 'In Stock'}`);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                          item.isAvailable
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                            : 'bg-red-100 hover:bg-red-200 text-red-900'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {item.isAvailable ? 'check_circle' : 'block'}
                        </span>
                        <span>{item.isAvailable ? 'In Stock (Live)' : 'Out of Stock'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          deleteMenuItem(activeRestaurant.id, item.id);
                          triggerToast(`Deleted ${item.name}`);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove dish from menu"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DAILY SALES & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#e4e2e1] shadow-xs space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-[#5c4037] uppercase">
                  <span>Gross Sales</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">+18.4%</span>
                </div>
                <div className="font-headline font-bold text-2xl text-[#1b1c1c]">₹14,850</div>
                <p className="text-[11px] text-gray-500">Across 38 completed orders today</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e4e2e1] shadow-xs space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-[#5c4037] uppercase">
                  <span>Order Acceptance</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">98.5%</span>
                </div>
                <div className="font-headline font-bold text-2xl text-[#29695b]">38 / 39</div>
                <p className="text-[11px] text-gray-500">Only 1 cancellation recorded</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e4e2e1] shadow-xs space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-[#5c4037] uppercase">
                  <span>Avg Preparation</span>
                  <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">Optimal</span>
                </div>
                <div className="font-headline font-bold text-2xl text-[#1b1c1c]">16.4 mins</div>
                <p className="text-[11px] text-gray-500">Target buffer set to 20 mins</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#e4e2e1] shadow-xs space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-[#5c4037] uppercase">
                  <span>Store Rating</span>
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">★ 4.8</span>
                </div>
                <div className="font-headline font-bold text-2xl text-amber-700">4.8 / 5.0</div>
                <p className="text-[11px] text-gray-500">Based on 1.2k+ Nashik reviews</p>
              </div>
            </div>

            {/* Peak Hours Breakdown & Top Selling Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Peak Hours Hourly Graph Simulation */}
              <div className="bg-white p-5 rounded-2xl border border-[#e4e2e1] shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline font-bold text-base text-[#1b1c1c]">Hourly Order Volume (Nashik Rush)</h3>
                  <span className="text-xs text-[#5c4037]">Today's Curve</span>
                </div>
                
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>12:00 PM – 3:30 PM (Lunch Rush)</span>
                      <span className="font-bold text-[#a83300]">18 Orders (47%)</span>
                    </div>
                    <div className="w-full h-3 bg-[#f0eded] rounded-full overflow-hidden">
                      <div className="bg-[#a83300] h-full rounded-full w-[85%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>7:00 PM – 10:30 PM (Dinner Spike)</span>
                      <span className="font-bold text-amber-600">14 Orders (37%)</span>
                    </div>
                    <div className="w-full h-3 bg-[#f0eded] rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full w-[70%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>4:00 PM – 6:30 PM (Evening Snacks)</span>
                      <span className="font-bold text-[#29695b]">6 Orders (16%)</span>
                    </div>
                    <div className="w-full h-3 bg-[#f0eded] rounded-full overflow-hidden">
                      <div className="bg-[#29695b] h-full rounded-full w-[35%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Selling Items Leaderboard */}
              <div className="bg-white p-5 rounded-2xl border border-[#e4e2e1] shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline font-bold text-base text-[#1b1c1c]">Top Selling Dishes</h3>
                  <span className="text-xs text-[#a83300] font-bold">Best Performers</span>
                </div>

                <div className="space-y-3">
                  {activeRestaurant.menu.slice(0, 4).map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 bg-[#f6f3f2] rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white font-bold text-xs flex items-center justify-center text-[#1b1c1c]">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-xs text-[#1b1c1c]">{item.name}</div>
                          <div className="text-[10px] text-[#5c4037]">₹{item.price} • {item.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#a83300]">{14 - idx * 3} sold</div>
                        <div className="text-[10px] text-gray-500">₹{(14 - idx * 3) * item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: OUTLET SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-[800px] mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#e4e2e1] shadow-xs space-y-5">
              <h3 className="font-headline font-bold text-base text-[#1b1c1c]">Outlet Kitchen Preferences</h3>

              {/* Buffer Time */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#5c4037]">Default Kitchen Preparation Time</label>
                <div className="grid grid-cols-3 gap-3">
                  {[15, 20, 30].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        setPrepTimeBuffer(mins);
                        triggerToast(`Prep buffer updated to ${mins} mins`);
                      }}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                        prepTimeBuffer === mins
                          ? 'bg-[#a83300] text-white border-[#a83300]'
                          : 'bg-[#f6f3f2] text-[#5c4037] border-[#e4e2e1]'
                      }`}
                    >
                      {mins} Minutes
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Accept Switch */}
              <div className="flex items-center justify-between p-3.5 bg-[#f6f3f2] rounded-xl border border-[#e4e2e1]">
                <div>
                  <div className="font-bold text-xs text-[#1b1c1c]">Auto-Accept Incoming Orders</div>
                  <div className="text-[11px] text-[#5c4037]">Automatically move new orders into preparation</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoAcceptOrders}
                  onChange={(e) => setAutoAcceptOrders(e.target.checked)}
                  className="w-5 h-5 accent-[#a83300] cursor-pointer"
                />
              </div>

              {/* Outlet Address & Contact */}
              <div className="space-y-3 pt-2 border-t border-[#f0eded] text-xs">
                <div>
                  <label className="block font-semibold text-[#5c4037] mb-1">Outlet Registered Address</label>
                  <input
                    type="text"
                    defaultValue={activeRestaurant.address}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-xl border border-[#e4e2e1] text-[#1b1c1c]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#5c4037] mb-1">Partner Support Phone</label>
                  <input
                    type="text"
                    defaultValue="+91 253 2345678 (Nashik Store Desk)"
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-xl border border-[#e4e2e1] text-[#1b1c1c]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => triggerToast('Outlet preferences saved successfully')}
                className="w-full py-2.5 bg-[#a83300] text-white font-bold text-xs rounded-xl hover:bg-[#d24200] transition-colors shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL 1: ADD NEW DISH ================= */}
      {isAddDishOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl border border-[#e4e2e1] space-y-4 my-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[#f0eded] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#ffdbd0] text-[#a83300] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">lunch_dining</span>
                </div>
                <h3 className="font-headline font-bold text-base text-[#1b1c1c]">Add Dish to Menu</h3>
              </div>
              <button
                onClick={() => setIsAddDishOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-black"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#5c4037] mb-1">Dish Title *</label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Nashik Misal Pav Special"
                  className="w-full p-2.5 bg-[#f6f3f2] rounded-xl border border-[#e4e2e1] outline-none focus:border-[#a83300]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5c4037] mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    placeholder="e.g. 180"
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-xl border border-[#e4e2e1] outline-none focus:border-[#a83300]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5c4037] mb-1">Category</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-xl border border-[#e4e2e1] outline-none cursor-pointer"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5c4037] mb-1">Dietary Classification</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewDishIsVeg(true)}
                    className={`py-2 rounded-xl font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      newDishIsVeg
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                        : 'bg-[#f6f3f2] text-gray-500 border-[#e4e2e1]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>Pure Vegetarian</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewDishIsVeg(false)}
                    className={`py-2 rounded-xl font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      !newDishIsVeg
                        ? 'bg-red-50 text-red-800 border-red-400'
                        : 'bg-[#f6f3f2] text-gray-500 border-[#e4e2e1]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                    <span>Non-Vegetarian</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5c4037] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="Describe flavors, special spices, and side accompaniments..."
                  className="w-full p-2.5 bg-[#f6f3f2] rounded-xl border border-[#e4e2e1] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5c4037] mb-1">Photo Image URL (Optional)</label>
                <input
                  type="url"
                  value={newDishImage}
                  onChange={(e) => setNewDishImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-[#f6f3f2] rounded-xl border border-[#e4e2e1] outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDishOpen(false)}
                  className="flex-1 py-2.5 border border-[#e4e2e1] rounded-xl font-bold hover:bg-[#f6f3f2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#a83300] hover:bg-[#d24200] text-white font-bold rounded-xl shadow-sm"
                >
                  Save & Publish Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: KITCHEN DISPLAY TICKET (KDS) ================= */}
      {viewTicketOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#e4e2e1] space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b-2 border-dashed border-[#1b1c1c] pb-3 font-sans">
              <div>
                <h3 className="font-bold text-base text-[#1b1c1c]">KITCHEN TICKET #{viewTicketOrder.orderNumber}</h3>
                <p className="text-[11px] text-[#5c4037]">{viewTicketOrder.placedAt} • DineIn/Takeaway</p>
              </div>
              <button
                onClick={() => setViewTicketOrder(null)}
                className="text-gray-400 hover:text-black p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2 py-2 border-b-2 border-dashed border-[#1b1c1c]">
              <div className="font-bold text-sm text-[#1b1c1c] font-sans">ITEMS TO COOK:</div>
              {viewTicketOrder.items.map((ci: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="font-bold">[{ci.quantity}x] {ci.item.name}</span>
                  <span>₹{ci.item.price * ci.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Rider Assigned:</span>
                <span className="font-bold">{viewTicketOrder.deliveryPartner?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Vehicle No:</span>
                <span className="font-bold">{viewTicketOrder.deliveryPartner?.vehicleNumber}</span>
              </div>
              <div className="flex justify-between text-[#a83300] font-bold">
                <span>Total Amount:</span>
                <span>₹{viewTicketOrder.total}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2 font-sans">
              <button
                type="button"
                onClick={() => {
                  triggerToast('Ticket sent to Kitchen Printer 🖨️');
                  setViewTicketOrder(null);
                }}
                className="flex-1 py-2.5 bg-[#1b1c1c] hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Ticket</span>
              </button>
              <button
                type="button"
                onClick={() => setViewTicketOrder(null)}
                className="px-4 py-2.5 border border-[#e4e2e1] font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: DECLINE / REJECT ORDER MODAL ================= */}
      {rejectOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#e4e2e1] space-y-4 font-sans text-xs">
            <div className="flex justify-between items-start border-b border-[#e4e2e1] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">cancel</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1b1c1c]">Decline Order #{rejectOrderModal.orderNumber}?</h3>
                  <p className="text-[11px] text-[#5c4037]">Customer will be notified with the selected reason.</p>
                </div>
              </div>
              <button
                onClick={() => setRejectOrderModal(null)}
                className="text-gray-400 hover:text-black p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="block font-bold text-[#1b1c1c]">Select Cancellation Reason:</label>
              <div className="space-y-2">
                {[
                  'Item Out of Stock',
                  'Kitchen is Overloaded / Peak Rush',
                  'Outlet Closing for the Day',
                  'Unable to fulfill Special Customization',
                  'Other'
                ].map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedRejectReason === reason
                        ? 'bg-red-50/70 border-red-300 text-red-950 font-bold'
                        : 'bg-[#f6f3f2] border-[#e4e2e1] text-[#5c4037] hover:bg-gray-100 font-medium'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectReason"
                      value={reason}
                      checked={selectedRejectReason === reason}
                      onChange={(e) => setSelectedRejectReason(e.target.value)}
                      className="accent-red-600"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              {selectedRejectReason === 'Other' && (
                <div className="pt-1">
                  <textarea
                    rows={2}
                    value={customRejectNote}
                    onChange={(e) => setCustomRejectNote(e.target.value)}
                    placeholder="Enter reason for customer..."
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-xl border border-[#e4e2e1] outline-none text-xs"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectOrderModal(null)}
                className="flex-1 py-2.5 border border-[#e4e2e1] rounded-xl font-bold hover:bg-[#f6f3f2] text-[#5c4037]"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
                <span>Confirm Decline</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
