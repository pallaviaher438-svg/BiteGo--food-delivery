import { getStore } from '../data/store';
import { Order, Rider } from '../types';
import { AppError } from '../utils/AppError';

export interface EarningsEntry {
  orderId: string;
  orderNumber: string;
  amount: number;
  distance: string;
  time: string;
  paymentMethod: string;
}

export interface RiderDashboard {
  totalEarnings: number;
  completedDeliveries: number;
  onlineHours: number;
  averageRating: number;
  earnings: EarningsEntry[];
  surgeZones: Array<{ zone: string; multiplier: string; activeOrders: number }>;
}

export class DeliveryService {
  /**
   * Get active task and nearby pending orders for a rider
   */
  async getTasks(userId: string, userRole: string): Promise<{ activeTask: Order | null; nearbyRequests: Order[] }> {
    const store = await getStore();

    let rider: Rider | undefined;
    if (userRole === 'delivery') {
      rider = store.riders.find(r => r.userId === userId);
    }

    const activeTask = rider
      ? store.orders.find(
          o =>
            o.deliveryPartner?.id === rider!.id &&
            (o.status === 'on_the_way' || o.status === 'confirmed' || o.status === 'preparing')
        ) ?? null
      : null;

    // Nearby requests: orders in preparing state without an assigned active rider
    const nearbyRequests = store.orders.filter(
      o => o.status === 'confirmed' || o.status === 'preparing'
    );

    return { activeTask, nearbyRequests };
  }

  /**
   * Advance delivery stage (confirmed->preparing->on_the_way)
   * BR-005: on_the_way -> delivered only via OTP
   */
  async advanceStage(orderId: string, userId: string, stage: string): Promise<Order> {
    const store = await getStore();
    const idx = store.orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw AppError.notFound('Order');

    const order = store.orders[idx];
    const rider = store.riders.find(r => r.userId === userId);

    // Authorization: rider must be assigned to this order (or it's a pickup stage)
    if (rider && order.deliveryPartner?.id && order.deliveryPartner.id !== rider.id) {
      throw AppError.forbidden('This order is not assigned to you');
    }

    const validStages = ['confirmed', 'preparing', 'on_the_way'];
    if (!validStages.includes(stage)) {
      throw AppError.badRequest('Invalid delivery stage');
    }

    const stageOrder = validStages.indexOf(stage);
    const currentStageOrder = validStages.indexOf(order.status);
    if (stageOrder <= currentStageOrder) {
      throw AppError.badRequest(`Cannot move order back to stage: ${stage}`);
    }

    store.orders[idx].status = stage as Order['status'];

    // Assign rider to order if not yet assigned
    if (rider && !order.deliveryPartner?.id) {
      store.orders[idx].deliveryPartner = {
        id: rider.id,
        name: rider.name,
        phone: rider.phone,
        rating: rider.rating,
        avatar: '',
        vehicleNumber: rider.vehicle.split(' (')[0],
      };
    }

    return store.orders[idx];
  }

  /**
   * Complete delivery using customer OTP (BR-006)
   */
  async verifyOtpAndComplete(orderId: string, userId: string, otp: string): Promise<Order> {
    const store = await getStore();
    const idx = store.orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw AppError.notFound('Order');

    const order = store.orders[idx];
    if (order.status !== 'on_the_way') {
      throw AppError.badRequest('Order must be in on_the_way status to complete');
    }

    const rider = store.riders.find(r => r.userId === userId);
    if (rider && order.deliveryPartner?.id && order.deliveryPartner.id !== rider.id) {
      throw AppError.forbidden('This order is not assigned to you');
    }

    // BR-006: Verify 4-digit OTP (demo allows '4220')
    const isValidOtp = otp === order.deliveryOtp || otp === '4220';
    if (!isValidOtp) {
      throw AppError.invalidOtp('Invalid delivery OTP. Please check with the customer.');
    }

    store.orders[idx].status = 'delivered';
    store.orders[idx].estimatedMinutes = 0;
    store.orders[idx].estimatedArrival = 'Delivered';

    // Update rider stats
    if (rider) {
      const riderIdx = store.riders.findIndex(r => r.id === rider.id);
      if (riderIdx !== -1) {
        store.riders[riderIdx].completedToday++;
        store.riders[riderIdx].activeDeliveries = Math.max(0, store.riders[riderIdx].activeDeliveries - 1);
        if (store.riders[riderIdx].activeDeliveries === 0) {
          store.riders[riderIdx].status = 'Available';
        }
      }
    }

    // Record COD cash audit
    if (order.paymentMethod === 'cod') {
      store.orders[idx].paymentStatus = 'paid';
      store.transactions.push({
        txId: `TXN-COD-${Date.now()}`,
        orderId: order.id,
        customerName: order.customerName || 'Customer',
        amount: order.total,
        method: 'cod',
        provider: 'Cash on Delivery',
        status: 'settled',
        timestamp: new Date().toISOString(),
      });
    }

    return store.orders[idx];
  }

  /**
   * Rider earnings dashboard
   */
  async getDashboard(userId: string, timeframe: string = 'today'): Promise<RiderDashboard> {
    const store = await getStore();
    const rider = store.riders.find(r => r.userId === userId);

    const deliveredOrders = store.orders.filter(o => {
      if (o.status !== 'delivered') return false;
      if (rider && o.deliveryPartner?.id !== rider.id) return false;

      const placedAt = new Date(o.placedAt);
      const now = new Date();
      if (timeframe === 'today') {
        return placedAt.toDateString() === now.toDateString();
      } else if (timeframe === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return placedAt >= weekAgo;
      } else if (timeframe === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return placedAt >= monthAgo;
      }
      return true;
    });

    // Rider earns ₹30 per delivery + 10% of order value
    const earnings: EarningsEntry[] = deliveredOrders.map(o => ({
      orderId: o.id,
      orderNumber: o.orderNumber,
      amount: Math.round(30 + o.total * 0.1),
      distance: `${(Math.random() * 3 + 1).toFixed(1)} km`,
      time: new Date(o.placedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: o.paymentMethod,
    }));

    const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);

    return {
      totalEarnings,
      completedDeliveries: deliveredOrders.length,
      onlineHours: rider?.completedToday ? Math.ceil(rider.completedToday / 3) : 0,
      averageRating: rider?.rating ?? 0,
      earnings,
      surgeZones: [
        { zone: 'College Road', multiplier: '1.5x', activeOrders: 8 },
        { zone: 'Gangapur Road', multiplier: '1.3x', activeOrders: 5 },
        { zone: 'Panchavati', multiplier: '1.2x', activeOrders: 3 },
      ],
    };
  }

  /**
   * Instant payout / cashout request
   */
  async requestCashout(userId: string, amount: number): Promise<{ message: string; amount: number; utr: string }> {
    const store = await getStore();
    const rider = store.riders.find(r => r.userId === userId);
    if (!rider) throw AppError.notFound('Rider profile');

    if (amount <= 0) throw AppError.badRequest('Cashout amount must be greater than 0');

    // In demo mode: simulate successful instant payout
    const utr = `UTR${Date.now()}`;
    return {
      message: `Instant payout of ₹${amount} initiated successfully`,
      amount,
      utr,
    };
  }
}

export const deliveryService = new DeliveryService();
