// ---- Backend Entity Types (derived from frontend src/types.ts + DATABASE.md) ----

export type UserRole = 'customer' | 'restaurant' | 'delivery' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  role: UserRole;
  avatar?: string;
  isGoldMember: boolean;
  restaurantId?: string;  // for restaurant partners
  createdAt: string;
  updatedAt: string;
}

export type MenuCategory = 'Appetizers' | 'Main Course' | 'Breads' | 'Beverages' | 'Desserts' | 'Burgers' | 'Pizzas' | 'Sides';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  isVeg: boolean;
  isBestseller?: boolean;
  isAvailable: boolean;
  rating?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string[];
  rating: number;
  reviewsCount: string;
  deliveryTime: string;
  priceForOne: number;
  discountBadge?: string;
  coverImage: string;
  logoImage: string;
  distance: string;
  address: string;
  isOpen: boolean;
  featured?: boolean;
  menu: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryAddress {
  id: string;
  userId: string;
  label: 'Home' | 'Work' | 'Other';
  addressLine: string;
  phone: string;
  isDefault?: boolean;
  createdAt: string;
}

export type OrderStatus = 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';

export interface CartItemData {
  restaurantId: string;
  restaurantName: string;
  item: MenuItem;
  quantity: number;
}

export interface DeliveryPartnerInfo {
  id?: string;
  name: string;
  phone: string;
  rating: number;
  deliveriesCount?: number;
  avatar: string;
  vehicleNumber: string;
}

export interface OrderReview {
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName?: string;
  customerPhone?: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItemData[];
  itemTotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  couponApplied?: string;
  total: number;
  status: OrderStatus;
  estimatedArrival: string;
  estimatedMinutes: number;
  placedAt: string;
  address: Omit<DeliveryAddress, 'userId' | 'createdAt'>;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryPartner: DeliveryPartnerInfo;
  deliveryOtp: string;
  trackingCoordinates?: { lat: number; lng: number };
  review?: OrderReview;
  specialInstructions?: string;
  rejectionReason?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
  isActive: boolean;
}

export interface Rider {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  activeDeliveries: number;
  completedToday: number;
  status: 'Available' | 'On Delivery' | 'Offline';
  location: string;
  battery: string;
}

export interface PaymentTransaction {
  txId: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  provider: string;
  status: 'settled' | 'pending' | 'refunded';
  timestamp: string;
}

// OTP store entry
export interface OtpEntry {
  phone: string;
  otp: string;
  expiresAt: number;
}

// Express request augmentation
import { Request } from 'express';
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    email?: string;
    phone?: string;
    restaurantId?: string;
  };
}
