export type UserRole = 'customer' | 'restaurant' | 'delivery' | 'admin';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Appetizers' | 'Main Course' | 'Breads' | 'Beverages' | 'Desserts' | 'Burgers' | 'Pizzas' | 'Sides';
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
}

export interface CartItem {
  restaurantId: string;
  restaurantName: string;
  item: MenuItem;
  quantity: number;
}

export interface DeliveryAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  addressLine: string;
  phone: string;
  isDefault?: boolean;
}

export type OrderStatus = 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
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
  address: DeliveryAddress;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  deliveryPartner: {
    name: string;
    phone: string;
    rating: number;
    deliveriesCount: number;
    avatar: string;
    vehicleNumber: string;
  };
  trackingCoordinates?: {
    lat: number;
    lng: number;
  };
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
  customerName?: string;
  customerPhone?: string;
  specialInstructions?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isLoggedIn: boolean;
  isGoldMember?: boolean;
  joinedDate?: string;
}
