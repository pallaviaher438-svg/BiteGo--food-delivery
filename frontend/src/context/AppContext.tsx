import React, { createContext, useContext, useState, useEffect } from 'react';
import { Restaurant, CartItem, Order, DeliveryAddress, UserRole, MenuItem, Coupon, UserProfile } from '../types';
import { RESTAURANTS_DATA, INITIAL_ADDRESSES, INITIAL_ORDERS, AVAILABLE_COUPONS } from '../data/mockData';

const INITIAL_USER: UserProfile = {
  id: 'usr-1',
  name: 'Rahul Deshmukh',
  email: 'rahul.nashik@bitego.com',
  phone: '+91 9876543210',
  isLoggedIn: true,
  isGoldMember: true,
  joinedDate: 'March 2024',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
};

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  restaurants: Restaurant[];
  currentScreen: 'home' | 'restaurant' | 'cart' | 'track' | 'orders' | 'search' | 'profile' | 'auth' | 'restaurant_portal' | 'delivery_portal' | 'admin_portal';
  setCurrentScreen: (screen: any) => void;
  selectedRestaurantId: string;
  setSelectedRestaurantId: (id: string) => void;
  activeOrderId: string;
  setActiveOrderId: (id: string) => void;
  cart: CartItem[];
  addToCart: (restaurant: Restaurant, item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  getItemQuantity: (itemId: string) => number;
  clearCart: () => void;
  addresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress;
  setSelectedAddress: (addr: DeliveryAddress) => void;
  addAddress: (addr: Omit<DeliveryAddress, 'id'>) => DeliveryAddress;
  updateAddress: (id: string, addr: Partial<DeliveryAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  orders: Order[];
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  placeOrder: (paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod') => Order;
  addOrder: (order: Order) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  favorites: string[];
  toggleFavorite: (restaurantId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  addReview: (orderId: string, rating: number, comment: string) => void;
  toggleItemAvailability: (restaurantId: string, itemId: string) => void;
  addRestaurant: (newRest: Restaurant) => void;
  deleteRestaurant: (restaurantId: string) => void;
  toggleRestaurantStatus: (restaurantId: string) => void;
  addMenuItem: (restaurantId: string, item: MenuItem) => void;
  deleteMenuItem: (restaurantId: string, itemId: string) => void;
  updateMenuItemPrice: (restaurantId: string, itemId: string, newPrice: number) => void;
  currentUser: UserProfile | null;
  login: (emailOrPhone: string, name?: string) => void;
  signup: (name: string, email: string, phone: string) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  authInitialMode: 'login' | 'signup';
  setAuthInitialMode: (mode: 'login' | 'signup') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with admin role & portal at the starting as requested
  const [role, setRole] = useState<UserRole>('admin');
  const [currentScreen, setCurrentScreen] = useState<'home' | 'restaurant' | 'cart' | 'track' | 'orders' | 'search' | 'profile' | 'auth' | 'restaurant_portal' | 'delivery_portal' | 'admin_portal'>('admin_portal');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USER);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS_DATA);
  const [coupons, setCoupons] = useState<Coupon[]>(AVAILABLE_COUPONS);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('rest-3');
  const [activeOrderId, setActiveOrderId] = useState<string>('ord-active-1');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(INITIAL_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress>(INITIAL_ADDRESSES[0]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['rest-1', 'rest-3']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const login = (emailOrPhone: string, name?: string) => {
    const isEmail = emailOrPhone.includes('@');
    const displayName = name || (isEmail ? emailOrPhone.split('@')[0] : 'Rahul Deshmukh');
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email: isEmail ? emailOrPhone : 'rahul.nashik@bitego.com',
      phone: isEmail ? '+91 9876543210' : (emailOrPhone.startsWith('+') ? emailOrPhone : `+91 ${emailOrPhone}`),
      isLoggedIn: true,
      isGoldMember: true,
      joinedDate: 'August 2026',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    setCurrentUser(user);
  };

  const signup = (name: string, email: string, phone: string) => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.startsWith('+') ? phone : `+91 ${phone}`,
      isLoggedIn: true,
      isGoldMember: true,
      joinedDate: 'August 2026',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    };
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
  };

  const getItemQuantity = (itemId: string): number => {
    const item = cart.find(ci => ci.item.id === itemId);
    return item ? item.quantity : 0;
  };

  const addToCart = (restaurant: Restaurant, item: MenuItem) => {
    setCart(prev => {
      // If adding from another restaurant, reset cart to new restaurant
      const currentRestId = prev.length > 0 ? prev[0].restaurantId : null;
      let newCart = currentRestId && currentRestId !== restaurant.id ? [] : [...prev];
      
      const existingIndex = newCart.findIndex(ci => ci.item.id === item.id);
      if (existingIndex > -1) {
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + 1
        };
      } else {
        newCart.push({
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          item,
          quantity: 1
        });
      }
      return newCart;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(ci => ci.item.id === itemId);
      if (existingIndex === -1) return prev;
      
      const currentQty = prev[existingIndex].quantity;
      if (currentQty <= 1) {
        return prev.filter(ci => ci.item.id !== itemId);
      } else {
        const newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: currentQty - 1
        };
        return newCart;
      }
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const found = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) return { success: false, message: 'Invalid promo code' };
    
    const subtotal = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
    if (subtotal < found.minOrder) {
      return { success: false, message: `Minimum order amount for this coupon is ₹${found.minOrder}` };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const placeOrder = (paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod'): Order => {
    const itemTotal = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
    const deliveryFee = itemTotal > 500 ? 0 : 40;
    const taxes = Math.round(itemTotal * 0.05);
    
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = Math.min((itemTotal * appliedCoupon.discountValue) / 100, appliedCoupon.maxDiscount || 999);
      } else {
        discount = appliedCoupon.discountValue;
      }
    }

    const total = Math.max(0, itemTotal + deliveryFee + taxes - discount);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `BG-${Math.floor(1000 + Math.random() * 9000)}`,
      restaurantId: cart[0]?.restaurantId || 'rest-3',
      restaurantName: cart[0]?.restaurantName || 'The Spice Route',
      items: [...cart],
      itemTotal,
      deliveryFee,
      taxes,
      discount,
      couponApplied: appliedCoupon?.code,
      total,
      status: 'confirmed',
      estimatedArrival: '30-40 mins',
      estimatedMinutes: 30,
      placedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      address: selectedAddress,
      paymentMethod,
      paymentStatus: 'paid',
      deliveryPartner: {
        name: 'Alex M.',
        phone: '+91 9823012345',
        rating: 4.9,
        deliveriesCount: 1204,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWv-MffSDYcdDAFBFZOOSPs7j0dQ5p1fWfo4VEj-QD4l5y-CvJTKm2z8wpUFkt-iypQg1JrfUkF5k1sGQh3yDkYY44ejU4aRWayO68cD0MHPITJpxqE_nwCmauFU2vCqOYs27QAzkeJtJdBINN9DsTEasIVTVdLagkq8PnXrg9MZ2xuANWqHqnlGsc-41-7hwGkt3gz4opMEqDIPWHMP2hvbyMQK3Y5Bk05sYMocyrY5n1_MUPSbg',
        vehicleNumber: 'MH 15 AB 4592'
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    clearCart();
    setCurrentScreen('track');
    return newOrder;
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' as const } : o));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const toggleFavorite = (restId: string) => {
    setFavorites(prev => prev.includes(restId) ? prev.filter(id => id !== restId) : [...prev, restId]);
  };

  const addReview = (orderId: string, rating: number, comment: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      review: {
        rating,
        comment,
        createdAt: new Date().toISOString().substring(0, 10)
      }
    } : o));
  };

  const addAddress = (addrData: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addrData,
      id: `addr-${Date.now()}`
    };
    setAddresses(prev => {
      if (newAddr.isDefault) {
        return [newAddr, ...prev.map(a => ({ ...a, isDefault: false }))];
      }
      return [...prev, newAddr];
    });
    if (newAddr.isDefault || addresses.length === 0) {
      setSelectedAddress(newAddr);
    }
    return newAddr;
  };

  const updateAddress = (id: string, addrData: Partial<DeliveryAddress>) => {
    setAddresses(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...addrData };
        if (selectedAddress.id === id) {
          setSelectedAddress(updated);
        }
        return updated;
      }
      return addrData.isDefault ? { ...a, isDefault: false } : a;
    }));
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => {
      const filtered = prev.filter(a => a.id !== id);
      if (selectedAddress.id === id && filtered.length > 0) {
        setSelectedAddress(filtered[0]);
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    const target = addresses.find(a => a.id === id);
    if (target) {
      setSelectedAddress(target);
    }
  };

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons(prev => [newCoupon, ...prev]);
  };

  const deleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
  };

  const addRestaurant = (newRest: Restaurant) => {
    setRestaurants(prev => [newRest, ...prev]);
  };

  const deleteRestaurant = (restaurantId: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
  };

  const toggleRestaurantStatus = (restaurantId: string) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, isOpen: !r.isOpen } : r));
  };

  const addMenuItem = (restaurantId: string, item: MenuItem) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id !== restaurantId) return r;
      return {
        ...r,
        menu: [...r.menu, item]
      };
    }));
  };

  const deleteMenuItem = (restaurantId: string, itemId: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id !== restaurantId) return r;
      return {
        ...r,
        menu: r.menu.filter(m => m.id !== itemId)
      };
    }));
  };

  const updateMenuItemPrice = (restaurantId: string, itemId: string, newPrice: number) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id !== restaurantId) return r;
      return {
        ...r,
        menu: r.menu.map(m => m.id === itemId ? { ...m, price: newPrice } : m)
      };
    }));
  };

  const toggleItemAvailability = (restaurantId: string, itemId: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id !== restaurantId) return r;
      return {
        ...r,
        menu: r.menu.map(m => m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m)
      };
    }));
  };

  return (
    <AppContext.Provider value={{
      role,
      setRole,
      restaurants,
      currentScreen,
      setCurrentScreen,
      selectedRestaurantId,
      setSelectedRestaurantId,
      activeOrderId,
      setActiveOrderId,
      cart,
      addToCart,
      removeFromCart,
      getItemQuantity,
      clearCart,
      addresses,
      selectedAddress,
      setSelectedAddress,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      orders,
      coupons,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      addCoupon,
      deleteCoupon,
      placeOrder,
      addOrder,
      cancelOrder,
      updateOrderStatus,
      favorites,
      toggleFavorite,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      addReview,
      toggleItemAvailability,
      addRestaurant,
      deleteRestaurant,
      toggleRestaurantStatus,
      addMenuItem,
      deleteMenuItem,
      updateMenuItemPrice,
      currentUser,
      login,
      signup,
      logout,
      updateUserProfile,
      authInitialMode,
      setAuthInitialMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
