import { getStore } from '../data/store';

export interface PlatformMetrics {
  totalGMV: number;
  totalOrders: number;
  activeOrders: number;
  platformCommission: number;
  restaurantCount: number;
  fleetCount: number;
  deliveredToday: number;
  cancelledToday: number;
}

export interface PaymentBreakdown {
  upi: { count: number; volume: number };
  card: { count: number; volume: number };
  netbanking: { count: number; volume: number };
  cod: { count: number; volume: number };
  transactions: Array<{
    txId: string;
    orderId: string;
    customerName: string;
    amount: number;
    method: string;
    provider: string;
    status: string;
    timestamp: string;
  }>;
}

export class AdminService {
  async getMetrics(): Promise<PlatformMetrics> {
    const store = await getStore();

    const today = new Date().toDateString();
    const allOrders = store.orders;
    const deliveredOrders = allOrders.filter(o => o.status === 'delivered');
    const activeStatuses = ['confirmed', 'preparing', 'on_the_way'];

    const totalGMV = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
    const platformCommission = Math.round(totalGMV * 0.18);

    const deliveredToday = allOrders.filter(o => {
      if (o.status !== 'delivered') return false;
      try {
        return new Date(o.placedAt).toDateString() === today;
      } catch { return false; }
    }).length;

    const cancelledToday = allOrders.filter(o => {
      if (o.status !== 'cancelled') return false;
      try {
        return new Date(o.placedAt).toDateString() === today;
      } catch { return false; }
    }).length;

    return {
      totalGMV,
      totalOrders: allOrders.length,
      activeOrders: allOrders.filter(o => activeStatuses.includes(o.status)).length,
      platformCommission,
      restaurantCount: store.restaurants.length,
      fleetCount: store.riders.length,
      deliveredToday,
      cancelledToday,
    };
  }

  async getFleet(): Promise<import('../types').Rider[]> {
    const store = await getStore();
    return store.riders;
  }

  async getPaymentBreakdown(timeframe: string = '7d'): Promise<PaymentBreakdown> {
    const store = await getStore();

    const now = new Date();
    let cutoff: Date;
    if (timeframe === 'today') {
      cutoff = new Date(now.toDateString());
    } else if (timeframe === '30d') {
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      // default 7d
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const filtered = store.transactions.filter(t => new Date(t.timestamp) >= cutoff);

    const breakdown: PaymentBreakdown = {
      upi: { count: 0, volume: 0 },
      card: { count: 0, volume: 0 },
      netbanking: { count: 0, volume: 0 },
      cod: { count: 0, volume: 0 },
      transactions: filtered.map(t => ({
        txId: t.txId,
        orderId: t.orderId,
        customerName: t.customerName,
        amount: t.amount,
        method: t.method,
        provider: t.provider,
        status: t.status,
        timestamp: t.timestamp,
      })),
    };

    for (const tx of filtered) {
      const method = tx.method as keyof Omit<PaymentBreakdown, 'transactions'>;
      if (breakdown[method]) {
        breakdown[method].count++;
        breakdown[method].volume += tx.amount;
      }
    }

    return breakdown;
  }
}

export const adminService = new AdminService();
