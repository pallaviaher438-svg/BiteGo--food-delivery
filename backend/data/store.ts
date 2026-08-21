/**
 * In-memory data store with seed data.
 * All repositories read from and mutate this store.
 * Serves as a pluggable persistence layer.
 */
import {
  User, Restaurant, Order, Coupon, DeliveryAddress,
  Rider, PaymentTransaction, OtpEntry
} from '../types';
import { hashPassword } from '../utils/authUtils';

// ---- Seed Data (from frontend mockData.ts + AdminPortalView riders) ----

const SEED_ADDRESSES: DeliveryAddress[] = [
  { id: 'addr-1', userId: 'usr-1', label: 'Home', addressLine: '42, Tech Park Avenue, Block C, Silicon Valley Sector, Nashik 422005', phone: '+91 9876543210', isDefault: true, createdAt: '2026-03-15T10:00:00Z' },
  { id: 'addr-2', userId: 'usr-1', label: 'Work', addressLine: 'Plot 15, IT Park, MIDC Ambad, Nashik 422010', phone: '+91 9876543210', createdAt: '2026-04-01T10:00:00Z' },
  { id: 'addr-3', userId: 'usr-1', label: 'Other', addressLine: 'Flat 302, Green View Heights, College Road, Nashik 422005', phone: '+91 9876543210', createdAt: '2026-05-20T10:00:00Z' },
];

const SEED_COUPONS: Coupon[] = [
  { code: 'BITE50', discountType: 'percentage', discountValue: 50, maxDiscount: 100, minOrder: 199, description: '50% OFF up to ₹100 on your first order', isActive: true },
  { code: 'NASHIKFEAST', discountType: 'flat', discountValue: 150, minOrder: 499, description: 'Flat ₹150 OFF on orders above ₹499', isActive: true },
  { code: 'FREEDEL', discountType: 'flat', discountValue: 40, minOrder: 299, description: 'Free delivery on orders above ₹299', isActive: true },
];

const SEED_RIDERS: Rider[] = [
  { id: 'r1', userId: 'usr-rider-1', name: 'Alex M.', phone: '+91 9823012345', vehicle: 'MH 15 AB 4592 (EV Scooter)', rating: 4.9, activeDeliveries: 1, completedToday: 14, status: 'On Delivery', location: 'Gangapur Road', battery: '88%' },
  { id: 'r2', userId: 'usr-rider-2', name: 'Vikram K.', phone: '+91 9823012346', vehicle: 'MH 15 CD 8821 (Bike)', rating: 4.8, activeDeliveries: 0, completedToday: 18, status: 'Available', location: 'College Road', battery: '92%' },
  { id: 'r3', userId: 'usr-rider-3', name: 'Sunita P.', phone: '+91 9823012347', vehicle: 'MH 15 XY 1120 (EV Scooter)', rating: 5.0, activeDeliveries: 1, completedToday: 12, status: 'On Delivery', location: 'Indira Nagar', battery: '76%' },
  { id: 'r4', userId: 'usr-rider-4', name: 'Rohit S.', phone: '+91 9823012348', vehicle: 'MH 15 MN 6643 (Bike)', rating: 4.7, activeDeliveries: 0, completedToday: 16, status: 'Available', location: 'Panchavati', battery: '64%' },
];

const SEED_TRANSACTIONS: PaymentTransaction[] = [
  { txId: 'TXN-982143', orderId: 'ord-active-1', customerName: 'Kunal Deshmukh', amount: 1195, method: 'upi', provider: 'PhonePe UPI', status: 'settled', timestamp: '2026-08-21T14:15:00Z' },
  { txId: 'TXN-982144', orderId: 'ord-prep-1', customerName: 'Priya Sharma', amount: 628, method: 'upi', provider: 'GPay UPI', status: 'settled', timestamp: '2026-08-21T14:12:00Z' },
  { txId: 'TXN-982145', orderId: 'ord-past-1', customerName: 'Rahul Deshmukh', amount: 548, method: 'upi', provider: 'Paytm UPI', status: 'settled', timestamp: '2026-08-18T20:30:00Z' },
];

// ---- The global data store ----

export interface DataStore {
  users: User[];
  restaurants: Restaurant[];
  orders: Order[];
  coupons: Coupon[];
  addresses: DeliveryAddress[];
  riders: Rider[];
  transactions: PaymentTransaction[];
  otps: OtpEntry[];
}

let store: DataStore | null = null;

export async function getStore(): Promise<DataStore> {
  if (store) return store;
  store = await initializeStore();
  return store;
}

async function initializeStore(): Promise<DataStore> {
  // Pre-hash passwords for seeded users
  const adminHash = await hashPassword('Admin123!');
  const customerHash = await hashPassword('Customer123!');
  const restaurantHash = await hashPassword('Restaurant123!');
  const deliveryHash = await hashPassword('Delivery123!');

  const users: User[] = [
    { id: 'usr-1', name: 'Rahul Deshmukh', email: 'rahul.nashik@bitego.com', phone: '+919876543210', passwordHash: customerHash, role: 'customer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', isGoldMember: true, createdAt: '2024-03-01T10:00:00Z', updatedAt: '2026-08-21T10:00:00Z' },
    { id: 'usr-admin-1', name: 'BiteGo Admin', email: 'admin@bitego.com', phone: '+919800000001', passwordHash: adminHash, role: 'admin', isGoldMember: false, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2026-08-21T00:00:00Z' },
    { id: 'usr-rest-1', name: 'Spice Route Manager', email: 'restaurant@bitego.com', phone: '+919800000002', passwordHash: restaurantHash, role: 'restaurant', restaurantId: 'rest-3', isGoldMember: false, createdAt: '2024-02-01T00:00:00Z', updatedAt: '2026-08-21T00:00:00Z' },
    { id: 'usr-rider-1', name: 'Alex M.', email: 'delivery@bitego.com', phone: '+919823012345', passwordHash: deliveryHash, role: 'delivery', isGoldMember: false, createdAt: '2024-03-01T00:00:00Z', updatedAt: '2026-08-21T00:00:00Z' },
  ];

  // Import restaurant data structure inline (simplified from mockData)
  // We reuse the frontend RESTAURANTS_DATA structure to seed identical data
  const restaurants: Restaurant[] = await loadRestaurantSeed();

  // Import order seed data
  const orders: Order[] = loadOrderSeed();

  return {
    users,
    restaurants,
    orders,
    coupons: [...SEED_COUPONS],
    addresses: [...SEED_ADDRESSES],
    riders: [...SEED_RIDERS],
    transactions: [...SEED_TRANSACTIONS],
    otps: [],
  };
}

// ---- Restaurant Seed (matches frontend mockData RESTAURANTS_DATA) ----
function loadRestaurantSeed(): Promise<Restaurant[]> {
  // These match the frontend's rest-1 through rest-5 with their complete menus
  const now = '2026-08-21T00:00:00Z';
  const restaurants: Restaurant[] = [
    {
      id: 'rest-1', name: 'Burger King', tagline: 'Flame-grilled burgers & crispy fries',
      cuisine: ['Burgers', 'American', 'Fast Food'], rating: 4.5, reviewsCount: '3.4k+',
      deliveryTime: '20-30 mins', priceForOne: 200, discountBadge: '50% OFF up to ₹100',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBiK2wWQKblhCitDbsKB9jp7OqhztNWK1mM6E566haWNZkKd67a0hTld_f9ZSy4VL0KAKJDR__ZXUifgC1WK1RtSHw5yuHqzBEYTvoz5QYqMQR_wA_M_L-bIaU8gqgxuzcL97WA7CZqxCu67PcNzYNXnv09t0lgt9TT6G2XAo4WzVwA8B3u5tVM48NF4cZwxd6NVRnYsXCKRBrv_zbpzQFbSoySAixXd-YpcoTED7OHnVBz_nDnZA',
      logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArSPGeAo_Jb-nFzS7llRPQzc17Oxv6pQbVsdhfSUxgNU4pn3eVGw50eHLgTT6ilaFJUGzj_AGUyjYS4mvJrfIyWlVnaJBc9JOtqFKFoEwECwIQ4M5SaP4jJrHS752CxAOANz9GirLTNSc5xq1pNDG8TX9bl5SdENWBEF-7yp0bWUaz7W4Erk34x-RrdwY054RiqXJDbsu9K-k1B0Po0yz8tyXrOyRwrNY-EZpnz3UIqbcYDzD_dBw',
      distance: '1.8 km away', address: 'City Centre Mall, Untwadi, Nashik',
      isOpen: true, featured: true,
      menu: [
        { id: 'bk-1', name: 'Classic Cheeseburger', description: 'Flame grilled juicy patty, melted cheddar cheese, fresh lettuce and tangy secret sauce.', price: 225, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx4ei_PyuMpYH5prRYFMlrrTQhv9s7qEqlwjHIW1Hhhp1-COI4L5wxk8zfLZ7ovX96dU4GOzMPwTcJYJYFPOPRN7_0zDu4yYYYWgdxu7ZcyzIURyCO9suTcDSc10xCNqOSYEURND6W6jGER6N7iak6zw29KtF0isYf-Wvvr_tfUEaHeUoCyX3keJTNszrb1KswqoYRwTpvviHY2pocuBYT-ZG1HJtJFaLD_x_f1JLlI26_kw4xi_g', category: 'Burgers', isVeg: false, isBestseller: true, isAvailable: true, rating: 4.6 },
        { id: 'bk-2', name: 'Crispy Veg Whopper', description: 'Signature crispy vegetable patty, crisp lettuce, juicy tomatoes, creamy mayo, sesame seed bun.', price: 180, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAStwwGbpgSJPP6v62lz3B1NaU39mMfrZC6qTDqhb5ZUZlk8ZVm8xx3E0kV0ceQ5SeFkxhFEvqPUh1SUvoRiPsNyroasRG5ZVZW41WQlHM19fdYB_qNuRI0KW49eWlOXF9fMX3z2j88Vi8rWaxkAiwiRBzzP4NbE1KWuGZhgFvcaT7aJBXrAOjoHmD6HDISqu46lg7AwBpwvYBvmSRnf9Wa8QTCVrVNyg76QvXixI2VoL6Pm77MB5U', category: 'Burgers', isVeg: true, isBestseller: true, isAvailable: true, rating: 4.5 },
        { id: 'bk-3', name: 'Peri Peri Crispy Fries', description: 'Golden fried crispy potato fries tossed in zesty peri-peri spice mix.', price: 110, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=500&q=80', category: 'Sides', isVeg: true, isAvailable: true, rating: 4.3 },
        { id: 'bk-4', name: 'Cold Coffee Shake', description: 'Thick and creamy cold coffee blended with ice cream and whipped cream.', price: 149, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80', category: 'Beverages', isVeg: true, isAvailable: true, rating: 4.4 },
      ],
      createdAt: now, updatedAt: now,
    },
    {
      id: 'rest-2', name: "La Pino'z Pizza", tagline: 'Hand-tossed pizzas & epic toppings',
      cuisine: ['Pizzas', 'Italian', 'Fast Food'], rating: 4.3, reviewsCount: '2.1k+',
      deliveryTime: '25-35 mins', priceForOne: 300, discountBadge: '₹150 OFF above ₹499',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3JPViR-MmE4kg7CVumdao_FYQdGYNhowCpjGZ7TqPMNQnQ4tjbAMIB-RVjif3UFT0cXOE44zY-gVpWIAyvBHkTXyqSFPgnIoZQ4fwkp-NC-6b56X1r2C4NEYLnR3Y-s8Ffn0HzngW52DXd-tqJv0KQoFGrIkTkjUm906-Drp4VNlz6JOrxXZPulYHV_YmVeF19EembwWVOVQVV0dpQxO7Z9gE3WYZJr9Gj61wItVpbxSbrTtoQcg',
      logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjuE0E4yl5a50oGR50u8NAYH6PF5jq-OlhXz7pITG_yBuLwqKw_bpD9pW31MUqfugjQc2opbZENAl0lVoOSA0UfeMpGCw_AYlz6OI2C4u12AxILjXPREKRuopJDjfLKERjMZzh-HXN18UPwBrQw1YhYPt97Z6EwSfVxBQXCGnQYX9RiCZbFmgp6y_SnhkMxEH0x-iN5_JeepBR8Vx1HCHGvvjS4b6zy3_Kn8T0ZHUjxRBawE26AX0m0',
      distance: '2.5 km away', address: 'College Road, Near Big Bazaar, Nashik',
      isOpen: true, featured: true,
      menu: [
        { id: 'lp-1', name: 'Pepperoni Pizza (Large)', description: 'Hand-tossed crust loaded with mozzarella and spicy pepperoni slices.', price: 650, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy32mBAt5JwkqN_yv3X5rv8eXyBW4dYzRk91ojw9BTU4QpdM74NyvS7prGDK8P4SeKk9ieXS4zUzjkHZilgun9xNJZvUE2jcy4g6GptIaCmZdckR8G0rFW7mIPSY_Io_zkYj0OHTFHAH4xpM0hDF9k37xrB5ItxX7YN5-HRjo4W1eodmngZyQYHBUmKMdZwpeWwmgw9-KJtWYSfGhoGWPh8Q3KSKyYeKLbipXtApUbmh20dtqZ5Ig', category: 'Pizzas', isVeg: false, isBestseller: true, isAvailable: true, rating: 4.7 },
        { id: 'lp-2', name: 'Margherita Pizza', description: 'Classic Italian pizza with fresh mozzarella, ripe tomatoes, and fragrant basil leaves.', price: 350, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=80', category: 'Pizzas', isVeg: true, isBestseller: true, isAvailable: true, rating: 4.5 },
        { id: 'lp-3', name: 'Garlic Breadsticks', description: 'Freshly baked breadsticks brushed with garlic butter and herbs.', price: 149, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=500&q=80', category: 'Sides', isVeg: true, isAvailable: true, rating: 4.2 },
        { id: 'lp-4', name: 'Chocolate Lava Cake', description: 'Warm, gooey chocolate cake with a molten center.', price: 199, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80', category: 'Desserts', isVeg: true, isAvailable: true, rating: 4.6 },
      ],
      createdAt: now, updatedAt: now,
    },
    {
      id: 'rest-3', name: 'The Spice Route', tagline: 'Authentic North Indian & Mughlai cuisine',
      cuisine: ['North Indian', 'Mughlai', 'Biryani'], rating: 4.6, reviewsCount: '5.2k+',
      deliveryTime: '30-40 mins', priceForOne: 350, discountBadge: 'Free Delivery above ₹500',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdmP3t-E9M9j1SVp5TQ8F7Qi9N6TOMNEtXP2N8QkXpjKBa8WbvvR_LvQF36VJJjPqo6g-KmWRWCl2cq7AcCMbMPbGzjKyPaI8JmIQUiNzH9EqX_AjmUMcSMM0TW6VTK_gZKVCGIb0glPVZj3MJjkCTH8R9MBpLQ9bXrqOzwWw3TsJt-fCx_K3_F4l3_e6lJyxTjsIbEWCoxr9_fh0-jI4o7MZoIDqRPCOy5zVZpyuXF2kp_U4xM',
      logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx2YT9jkHtKT7h1ZTtEA45nfZCL4A1K3NJm1_qGJjAZp0nHuOFBMnP4P8Z2bgP8a5p0B2GbTy2ZN1uRl-vOzfRb5Z9Dh6fPAGKuNjPF8F_KbZ_q4TeMiUvzGnT3r6s5P5_gIFXjX7jt',
      distance: '3.2 km away', address: 'Gangapur Road, Near Golf Club, Nashik',
      isOpen: true, featured: false,
      menu: [
        { id: 'sr-1', name: 'Paneer Tikka', description: 'Charcoal-grilled marinated cottage cheese cubes with bell peppers and onions.', price: 280, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80', category: 'Appetizers', isVeg: true, isBestseller: true, isAvailable: true, rating: 4.7 },
        { id: 'sr-2', name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken, saffron and caramelized onions.', price: 320, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80', category: 'Main Course', isVeg: false, isBestseller: true, isAvailable: true, rating: 4.8 },
        { id: 'sr-3', name: 'Butter Chicken', description: 'Tender chicken cooked in rich tomato butter gravy.', price: 450, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXPdD1ETYzhlTYnfYdv87kREXcOT3Tptnw19DXuQ9OXMgKZa9ZESwoJeBlpbQtRwyVy80hjDdCmvF4FaDvzNpQbF2g91-7kfRp-ouMGvGrjt0SnNT3_PjQ3Y2-P4Ccam6oBzqnc2SOkRxBLV6viwith7ip5b4fWpDuh7m26ttK1UWKBMnUopK4UzUkL2HcBoMGkdX2wfqp4S2H4syL0ARd3HRw4U67qc610_lfdKaj_mOOzQ39nls', category: 'Main Course', isVeg: false, isBestseller: true, isAvailable: true, rating: 4.9 },
        { id: 'sr-4', name: 'Dal Makhani', description: 'Slow-cooked black lentils in a creamy buttery tomato gravy.', price: 220, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80', category: 'Main Course', isVeg: true, isAvailable: true, rating: 4.5 },
        { id: 'sr-5', name: 'Butter Garlic Naan', description: 'Tandoor baked flatbread with butter and garlic.', price: 60, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80', category: 'Breads', isVeg: true, isAvailable: true, rating: 4.4 },
        { id: 'sr-6', name: 'Mango Lassi', description: 'Refreshing yogurt drink blended with ripe Alphonso mangoes.', price: 120, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=500&q=80', category: 'Beverages', isVeg: true, isAvailable: true, rating: 4.6 },
        { id: 'sr-7', name: 'Gulab Jamun', description: 'Soft deep-fried milk dumplings soaked in rose-scented sugar syrup.', price: 100, image: 'https://images.unsplash.com/photo-1666190070892-05e1dbf8ae23?auto=format&fit=crop&w=500&q=80', category: 'Desserts', isVeg: true, isAvailable: true, rating: 4.5 },
      ],
      createdAt: now, updatedAt: now,
    },
    {
      id: 'rest-4', name: 'Sadhana Chulivarchi Misal', tagline: 'Legendary Nashik Misal Pav since 1964',
      cuisine: ['Maharashtrian', 'Street Food', 'Nashik Special'], rating: 4.7, reviewsCount: '8.9k+',
      deliveryTime: '15-25 mins', priceForOne: 150,
      coverImage: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?auto=format&fit=crop&w=800&q=80',
      logoImage: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=200&q=80',
      distance: '1.2 km away', address: 'Bardan Phata, Gangapur Road, Nashik',
      isOpen: true, featured: true,
      menu: [
        { id: 'sm-1', name: 'Chulivarchi Misal Pav', description: 'Nashik\'s legendary spicy sprouted moth bean curry with farsan & fresh pav.', price: 120, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?auto=format&fit=crop&w=500&q=80', category: 'Main Course', isVeg: true, isBestseller: true, isAvailable: true, rating: 4.9 },
        { id: 'sm-2', name: 'Vada Pav', description: 'Crispy spiced potato fritter in soft pav bun with chutneys.', price: 40, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?auto=format&fit=crop&w=500&q=80', category: 'Sides', isVeg: true, isAvailable: true, rating: 4.7 },
        { id: 'sm-3', name: 'Sabudana Khichdi', description: 'Tapioca pearls cooked with peanuts, cumin and green chili.', price: 100, image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=500&q=80', category: 'Main Course', isVeg: true, isAvailable: true, rating: 4.5 },
        { id: 'sm-4', name: 'Cutting Chai', description: 'Classic strong Indian tea served in cutting glass.', price: 20, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=500&q=80', category: 'Beverages', isVeg: true, isAvailable: true, rating: 4.8 },
      ],
      createdAt: now, updatedAt: now,
    },
    {
      id: 'rest-5', name: 'Sweet Tooth Bakery', tagline: 'Artisan cakes, pastries & premium desserts',
      cuisine: ['Desserts', 'Bakery', 'Cafe'], rating: 4.4, reviewsCount: '1.8k+',
      deliveryTime: '20-30 mins', priceForOne: 250,
      coverImage: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80',
      logoImage: 'https://images.unsplash.com/photo-1486427944544-d2c246c4d3e3?auto=format&fit=crop&w=200&q=80',
      distance: '4.0 km away', address: 'Panchavati Karanja, Nashik',
      isOpen: true, featured: false,
      menu: [
        { id: 'st-1', name: 'Belgian Chocolate Truffle Cake', description: 'Triple-layered rich dark Belgian chocolate cake.', price: 450, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80', category: 'Desserts', isVeg: true, isBestseller: true, isAvailable: true, rating: 4.8 },
        { id: 'st-2', name: 'Blueberry Cheesecake', description: 'New York style creamy cheesecake with blueberry compote.', price: 380, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80', category: 'Desserts', isVeg: true, isAvailable: true, rating: 4.6 },
        { id: 'st-3', name: 'Fresh Croissant', description: 'Flaky, buttery French croissant baked daily.', price: 120, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?auto=format&fit=crop&w=500&q=80', category: 'Sides', isVeg: true, isAvailable: true, rating: 4.3 },
        { id: 'st-4', name: 'Cold Brew Coffee', description: 'Smooth 18-hour steeped cold brew served over ice.', price: 180, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80', category: 'Beverages', isVeg: true, isAvailable: true, rating: 4.5 },
      ],
      createdAt: now, updatedAt: now,
    },
  ];
  return Promise.resolve(restaurants);
}

// ---- Order Seed Data ----
function loadOrderSeed(): Order[] {
  return [
    {
      id: 'ord-conf-1', orderNumber: 'BG-9201', userId: 'usr-1',
      restaurantId: 'rest-1', restaurantName: 'Burger King',
      customerName: 'Amit Kadam', customerPhone: '+91 98230 11223',
      items: [
        { restaurantId: 'rest-1', restaurantName: 'Burger King', quantity: 2, item: { id: 'bk-1', name: 'Classic Cheeseburger', description: 'Flame grilled juicy patty.', price: 225, image: '', category: 'Burgers', isVeg: false, isAvailable: true } },
        { restaurantId: 'rest-1', restaurantName: 'Burger King', quantity: 1, item: { id: 'bk-3', name: 'Peri Peri Crispy Fries', description: 'Golden fried crispy potato fries.', price: 110, image: '', category: 'Sides', isVeg: true, isAvailable: true } },
      ],
      itemTotal: 560, deliveryFee: 40, taxes: 28, discount: 0, total: 628,
      status: 'confirmed', estimatedArrival: '8:10 PM', estimatedMinutes: 30,
      placedAt: '5 mins ago',
      address: { id: 'addr-1', label: 'Home', addressLine: '42, Tech Park Avenue, Block C, Silicon Valley Sector, Nashik 422005', phone: '+91 9876543210' },
      paymentMethod: 'upi', paymentStatus: 'paid',
      deliveryPartner: { name: 'Vikram K.', phone: '+91 9823012346', rating: 4.8, avatar: '', vehicleNumber: 'MH 15 CD 8821' },
      deliveryOtp: '4220',
    },
    {
      id: 'ord-prep-1', orderNumber: 'BG-8930', userId: 'usr-1',
      restaurantId: 'rest-3', restaurantName: 'The Spice Route',
      customerName: 'Priya Sharma', customerPhone: '+91 98812 34567',
      items: [
        { restaurantId: 'rest-3', restaurantName: 'The Spice Route', quantity: 1, item: { id: 'sr-3', name: 'Butter Chicken', description: 'Tender chicken in rich tomato butter gravy.', price: 450, image: '', category: 'Main Course', isVeg: false, isAvailable: true } },
        { restaurantId: 'rest-3', restaurantName: 'The Spice Route', quantity: 2, item: { id: 'sr-5', name: 'Butter Garlic Naan', description: 'Tandoor baked flatbread.', price: 60, image: '', category: 'Breads', isVeg: true, isAvailable: true } },
      ],
      itemTotal: 570, deliveryFee: 30, taxes: 28, discount: 0, total: 628,
      status: 'preparing', estimatedArrival: '7:55 PM', estimatedMinutes: 14,
      placedAt: '12 mins ago', specialInstructions: 'Make it extra spicy and pack spoon/fork.',
      address: { id: 'addr-2', label: 'Work', addressLine: 'Plot 15, IT Park, MIDC Ambad, Nashik 422010', phone: '+91 9876543210' },
      paymentMethod: 'upi', paymentStatus: 'paid',
      deliveryPartner: { name: 'Vikram Jadhav', phone: '+91 98220 77889', rating: 4.9, avatar: '', vehicleNumber: 'MH 15 AZ 7711' },
      deliveryOtp: '1234',
    },
    {
      id: 'ord-active-1', orderNumber: 'BG-8924', userId: 'usr-1',
      restaurantId: 'rest-4', restaurantName: 'Gourmet Burger Joint',
      customerName: 'Kunal Deshmukh', customerPhone: '+91 98221 99887',
      items: [
        { restaurantId: 'rest-4', restaurantName: 'Gourmet Burger Joint', quantity: 2, item: { id: 'bk-1', name: 'Classic Cheeseburger', description: 'Flame grilled juicy patty.', price: 225, image: '', category: 'Burgers', isVeg: false, isAvailable: true } },
        { restaurantId: 'rest-4', restaurantName: 'Gourmet Burger Joint', quantity: 1, item: { id: 'lp-1', name: 'Pepperoni Pizza (Large)', description: 'Hand-tossed crust with mozzarella and pepperoni.', price: 650, image: '', category: 'Pizzas', isVeg: false, isAvailable: true } },
      ],
      itemTotal: 1100, deliveryFee: 40, taxes: 55, discount: 0, total: 1195,
      status: 'on_the_way', estimatedArrival: '7:45 PM', estimatedMinutes: 12,
      placedAt: '20 mins ago',
      address: { id: 'addr-1', label: 'Home', addressLine: '42, Tech Park Avenue, Block C, Silicon Valley Sector, Nashik 422005', phone: '+91 9876543210' },
      paymentMethod: 'upi', paymentStatus: 'paid',
      deliveryPartner: { name: 'Alex M.', phone: '+91 9823012345', rating: 4.9, deliveriesCount: 1204, avatar: '', vehicleNumber: 'MH 15 AB 4592' },
      deliveryOtp: '4220',
    },
    {
      id: 'ord-past-1', orderNumber: 'BG-7821', userId: 'usr-1',
      restaurantId: 'rest-3', restaurantName: 'The Spice Route',
      customerName: 'Rahul Deshmukh', customerPhone: '+91 98230 45678',
      items: [
        { restaurantId: 'rest-3', restaurantName: 'The Spice Route', quantity: 1, item: { id: 'sr-3', name: 'Butter Chicken', description: 'Tender chicken in rich tomato butter gravy.', price: 450, image: '', category: 'Main Course', isVeg: false, isAvailable: true } },
        { restaurantId: 'rest-3', restaurantName: 'The Spice Route', quantity: 2, item: { id: 'sr-5', name: 'Butter Garlic Naan', description: 'Tandoor baked flatbread.', price: 60, image: '', category: 'Breads', isVeg: true, isAvailable: true } },
      ],
      itemTotal: 570, deliveryFee: 0, taxes: 28, discount: 50, couponApplied: 'BITE50', total: 548,
      status: 'delivered', estimatedArrival: 'Delivered', estimatedMinutes: 0,
      placedAt: '2026-08-18 20:30',
      address: { id: 'addr-1', label: 'Home', addressLine: '42, Tech Park Avenue, Block C, Silicon Valley Sector, Nashik 422005', phone: '+91 9876543210' },
      paymentMethod: 'upi', paymentStatus: 'paid',
      deliveryPartner: { name: 'Rohan Sharma', phone: '+91 9823098765', rating: 4.8, avatar: '', vehicleNumber: 'MH 15 CZ 1122' },
      deliveryOtp: '4220',
      review: { rating: 5, comment: 'Food was blazing hot and super delicious! Packaging was 10/10.', createdAt: '2026-08-18 21:20' },
    },
  ];
}
