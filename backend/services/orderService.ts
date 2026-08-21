import { getStore } from '../data/store';
import { Order, OrderStatus, CartItemData, DeliveryAddress, PaymentMethod } from '../types';
import { AppError } from '../utils/AppError';
import { generateId, generateOtp } from '../utils/authUtils';
import { couponService } from './couponService';

// BR-005: Valid state machine transitions
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  confirmed: ['preparing', 'cancelled'],
  preparing: ['on_the_way', 'cancelled'],
  on_the_way: ['delivered'],
  delivered: [],
  cancelled: [],
};

export interface PlaceOrderInput {
  restaurantId: string;
  items: Array<{ itemId: string; quantity: number }>;
  addressId: string;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
}

export interface QuoteInput {
  items: Array<{ itemId: string; restaurantId: string; quantity: number }>;
  couponCode?: string;
}

export class OrderService {
  async getOrderQuote(input: QuoteInput): Promise<object> {
    const store = await getStore();

    // Validate single restaurant (BR-003)
    const restaurantIds = [...new Set(input.items.map(i => i.restaurantId))];
    if (restaurantIds.length > 1) {
      throw AppError.badRequest('An order can only contain items from a single restaurant');
    }

    const restaurantId = restaurantIds[0];
    const restaurant = store.restaurants.find(r => r.id === restaurantId);
    if (!restaurant) throw AppError.notFound('Restaurant');
    if (!restaurant.isOpen) throw AppError.badRequest('Restaurant is currently closed');

    let subtotal = 0;
    const lineItems: Array<{ itemId: string; name: string; price: number; quantity: number; lineTotal: number }> = [];

    for (const input_item of input.items) {
      const menuItem = restaurant.menu.find(m => m.id === input_item.itemId);
      if (!menuItem) throw AppError.notFound(`Menu item ${input_item.itemId}`);
      if (!menuItem.isAvailable) throw AppError.badRequest(`${menuItem.name} is currently unavailable`);

      const lineTotal = menuItem.price * input_item.quantity;
      subtotal += lineTotal;
      lineItems.push({ itemId: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: input_item.quantity, lineTotal });
    }

    let coupon;
    if (input.couponCode) {
      coupon = store.coupons.find(c => c.code.toUpperCase() === input.couponCode!.toUpperCase());
      if (!coupon || !coupon.isActive) throw AppError.invalidCoupon('Invalid coupon code');
    }

    const quote = couponService.calculateQuote(subtotal, coupon);

    return {
      items: lineItems,
      subtotal: quote.subtotal,
      deliveryFee: quote.deliveryFee,
      taxes: quote.taxes,
      discount: quote.discount,
      couponApplied: quote.couponApplied,
      total: quote.total,
    };
  }

  async placeOrder(userId: string, input: PlaceOrderInput): Promise<Order> {
    const store = await getStore();

    // Fetch user
    const user = store.users.find(u => u.id === userId);
    if (!user) throw AppError.notFound('User');

    // Validate restaurant (BR-003, BR-004)
    const restaurant = store.restaurants.find(r => r.id === input.restaurantId);
    if (!restaurant) throw AppError.notFound('Restaurant');
    if (!restaurant.isOpen) throw AppError.badRequest('Restaurant is currently closed');

    // Validate address ownership
    const address = store.addresses.find(a => a.id === input.addressId && a.userId === userId);
    if (!address) throw AppError.notFound('Delivery address');

    // Validate and price items (BR-001: server-side calculation)
    let subtotal = 0;
    const cartItems: CartItemData[] = [];

    for (const orderItem of input.items) {
      const menuItem = restaurant.menu.find(m => m.id === orderItem.itemId);
      if (!menuItem) throw AppError.notFound(`Menu item ${orderItem.itemId}`);
      if (!menuItem.isAvailable) throw AppError.badRequest(`${menuItem.name} is currently unavailable`);
      if (orderItem.quantity < 1) throw AppError.badRequest('Quantity must be at least 1');

      subtotal += menuItem.price * orderItem.quantity;
      cartItems.push({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        item: menuItem,
        quantity: orderItem.quantity,
      });
    }

    // Apply coupon (BR-002)
    let coupon;
    if (input.couponCode) {
      coupon = store.coupons.find(c => c.code.toUpperCase() === input.couponCode!.toUpperCase());
      if (!coupon || !coupon.isActive) throw AppError.invalidCoupon('Invalid coupon code');
      if (subtotal < coupon.minOrder) {
        throw AppError.invalidCoupon(`Minimum order of ₹${coupon.minOrder} required for this coupon`);
      }
    }

    const quote = couponService.calculateQuote(subtotal, coupon);

    // Find an available rider
    const availableRider = store.riders.find(r => r.status === 'Available');

    // Generate delivery OTP (BR-005, BR-006)
    const deliveryOtp = generateOtp(4);

    const now = new Date();
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `BG-${Math.floor(1000 + Math.random() * 9000)}`;
    const estimatedMinutes = parseInt(restaurant.deliveryTime.split('-')[0]) + 10;
    const eta = new Date(now.getTime() + estimatedMinutes * 60 * 1000);
    const etaStr = eta.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const order: Order = {
      id: orderId,
      orderNumber,
      userId,
      customerName: user.name,
      customerPhone: user.phone,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      items: cartItems,
      itemTotal: quote.subtotal,
      deliveryFee: quote.deliveryFee,
      taxes: quote.taxes,
      discount: quote.discount,
      couponApplied: quote.couponApplied,
      total: quote.total,
      status: 'confirmed',
      estimatedArrival: etaStr,
      estimatedMinutes,
      placedAt: now.toISOString(),
      address: {
        id: address.id,
        label: address.label,
        addressLine: address.addressLine,
        phone: address.phone,
        isDefault: address.isDefault,
      },
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === 'cod' ? 'pending' : 'paid',
      deliveryPartner: availableRider
        ? {
            id: availableRider.id,
            name: availableRider.name,
            phone: availableRider.phone,
            rating: availableRider.rating,
            avatar: '',
            vehicleNumber: availableRider.vehicle.split(' (')[0],
          }
        : { name: 'Assigning...', phone: '', rating: 0, avatar: '', vehicleNumber: '' },
      deliveryOtp,
      trackingCoordinates: { lat: 20.0059, lng: 73.7997 },
      specialInstructions: input.specialInstructions,
    };

    store.orders.push(order);

    // Mark rider as On Delivery
    if (availableRider) {
      const riderIdx = store.riders.findIndex(r => r.id === availableRider.id);
      if (riderIdx !== -1) {
        store.riders[riderIdx].status = 'On Delivery';
        store.riders[riderIdx].activeDeliveries++;
      }
    }

    // Add payment transaction record
    if (order.paymentStatus === 'paid') {
      store.transactions.push({
        txId: `TXN-${Date.now()}`,
        orderId: order.id,
        customerName: user.name,
        amount: order.total,
        method: order.paymentMethod,
        provider: this.getPaymentProvider(order.paymentMethod),
        status: 'settled',
        timestamp: now.toISOString(),
      });
    }

    return order;
  }

  async getOrders(userId: string, userRole: string, query: { role?: string; status?: string; restaurantId?: string }): Promise<Order[]> {
    const store = await getStore();
    let orders = [...store.orders];

    if (userRole === 'customer') {
      orders = orders.filter(o => o.userId === userId);
    } else if (userRole === 'restaurant') {
      // Restaurant partner sees only their restaurant's orders
      const user = store.users.find(u => u.id === userId);
      orders = orders.filter(o => o.restaurantId === user?.restaurantId);
    } else if (userRole === 'delivery') {
      // Delivery partner sees orders assigned to them OR pending pickup
      const rider = store.riders.find(r => r.userId === userId);
      if (rider) {
        orders = orders.filter(o =>
          o.deliveryPartner?.id === rider.id ||
          o.status === 'confirmed' ||
          o.status === 'preparing'
        );
      }
    }
    // admin sees all

    if (query.status) {
      orders = orders.filter(o => o.status === query.status);
    }
    if (query.restaurantId && userRole === 'admin') {
      orders = orders.filter(o => o.restaurantId === query.restaurantId);
    }

    // Most recent first
    return orders.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
  }

  async getOrderById(orderId: string, userId: string, userRole: string): Promise<Order> {
    const store = await getStore();
    const order = store.orders.find(o => o.id === orderId);
    if (!order) throw AppError.notFound('Order');

    // BR-007: Object-level authorization
    if (userRole === 'customer' && order.userId !== userId) {
      throw AppError.forbidden('You do not have access to this order');
    }
    if (userRole === 'restaurant') {
      const user = store.users.find(u => u.id === userId);
      if (order.restaurantId !== user?.restaurantId) {
        throw AppError.forbidden('You do not have access to this order');
      }
    }

    return order;
  }

  async updateOrderStatus(orderId: string, userId: string, userRole: string, data: {
    status: OrderStatus;
    estimatedMinutes?: number;
    rejectionReason?: string;
  }): Promise<Order> {
    const store = await getStore();
    const idx = store.orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw AppError.notFound('Order');

    const order = store.orders[idx];

    // BR-007: Role-based access
    if (userRole === 'restaurant') {
      const user = store.users.find(u => u.id === userId);
      if (order.restaurantId !== user?.restaurantId) {
        throw AppError.forbidden('You can only update orders for your restaurant');
      }
    }
    if (userRole === 'delivery') {
      const rider = store.riders.find(r => r.userId === userId);
      if (order.deliveryPartner?.id !== rider?.id) {
        throw AppError.forbidden('You can only update your assigned delivery');
      }
    }

    // BR-005: Validate state machine transition
    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed.includes(data.status)) {
      throw AppError.invalidStatusTransition(order.status, data.status);
    }

    // delivered transition requires OTP — handled by verifyOtp endpoint
    if (data.status === 'delivered') {
      throw AppError.badRequest('Use /verify-otp endpoint to complete delivery');
    }

    store.orders[idx].status = data.status;
    if (data.estimatedMinutes !== undefined) store.orders[idx].estimatedMinutes = data.estimatedMinutes;
    if (data.rejectionReason) store.orders[idx].rejectionReason = data.rejectionReason;

    return store.orders[idx];
  }

  async cancelOrder(orderId: string, userId: string, userRole: string, reason: string): Promise<Order> {
    const store = await getStore();
    const idx = store.orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw AppError.notFound('Order');

    const order = store.orders[idx];

    // BR-007
    if (userRole === 'customer' && order.userId !== userId) {
      throw AppError.forbidden('You can only cancel your own orders');
    }

    // BR-005: terminal states
    if (order.status === 'delivered' || order.status === 'cancelled') {
      throw AppError.badRequest(`Cannot cancel an order that is already ${order.status}`);
    }

    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed.includes('cancelled')) {
      throw AppError.invalidStatusTransition(order.status, 'cancelled');
    }

    store.orders[idx].status = 'cancelled';
    store.orders[idx].rejectionReason = reason;

    // Refund if not COD
    if (order.paymentStatus === 'paid') {
      store.orders[idx].paymentStatus = 'refunded';
      const txIdx = store.transactions.findIndex(t => t.orderId === orderId);
      if (txIdx !== -1) store.transactions[txIdx].status = 'refunded';
    }

    return store.orders[idx];
  }

  async submitReview(orderId: string, userId: string, rating: number, comment: string): Promise<Order> {
    const store = await getStore();
    const idx = store.orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw AppError.notFound('Order');

    const order = store.orders[idx];
    if (order.userId !== userId) throw AppError.forbidden('You can only review your own orders');
    if (order.status !== 'delivered') throw AppError.badRequest('You can only review delivered orders');
    if (order.review) throw AppError.conflict('You have already reviewed this order');

    store.orders[idx].review = {
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    // Update restaurant rating (rolling average)
    const restaurantIdx = store.restaurants.findIndex(r => r.id === order.restaurantId);
    if (restaurantIdx !== -1) {
      const deliveredOrders = store.orders.filter(
        o => o.restaurantId === order.restaurantId && o.review
      );
      const totalRating = deliveredOrders.reduce((sum, o) => sum + (o.review?.rating ?? 0), 0);
      const newReviewCount = deliveredOrders.length;
      store.restaurants[restaurantIdx].rating = Math.round((totalRating / newReviewCount) * 10) / 10;
      store.restaurants[restaurantIdx].reviewsCount = `${newReviewCount}`;
    }

    return store.orders[idx];
  }

  private getPaymentProvider(method: PaymentMethod): string {
    const providers: Record<PaymentMethod, string> = {
      upi: 'PhonePe UPI',
      card: 'Visa/Mastercard',
      netbanking: 'HDFC Netbanking',
      cod: 'Cash on Delivery',
    };
    return providers[method];
  }
}

export const orderService = new OrderService();
