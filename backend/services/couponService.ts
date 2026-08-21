import { getStore } from '../data/store';
import { Coupon } from '../types';
import { AppError } from '../utils/AppError';

export interface PriceQuote {
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  couponApplied?: string;
  total: number;
}

export class CouponService {
  async listCoupons(): Promise<Coupon[]> {
    const store = await getStore();
    return store.coupons.filter(c => c.isActive);
  }

  async validateCoupon(code: string, orderAmount: number): Promise<{ code: string; discount: number; finalAmount: number }> {
    const store = await getStore();
    const coupon = store.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) throw AppError.invalidCoupon('Coupon code not found');
    if (!coupon.isActive) throw AppError.invalidCoupon('This coupon is no longer active');
    if (orderAmount < coupon.minOrder) {
      throw AppError.invalidCoupon(`Minimum order amount of ₹${coupon.minOrder} required for this coupon`);
    }

    const discount = this.calculateDiscount(coupon, orderAmount);
    return {
      code: coupon.code,
      discount,
      finalAmount: Math.max(0, orderAmount - discount),
    };
  }

  calculateDiscount(coupon: Coupon, subtotal: number): number {
    if (coupon.discountType === 'percentage') {
      const raw = (subtotal * coupon.discountValue) / 100;
      return Math.min(raw, coupon.maxDiscount ?? 9999);
    }
    return coupon.discountValue;
  }

  /**
   * Calculate full order price quote (BR-001, BR-002)
   */
  calculateQuote(subtotal: number, coupon?: Coupon): PriceQuote {
    const taxes = Math.round(subtotal * 0.05);
    let discount = 0;
    let couponApplied: string | undefined;

    if (coupon && coupon.isActive && subtotal >= coupon.minOrder) {
      discount = this.calculateDiscount(coupon, subtotal);
      couponApplied = coupon.code;
    }

    // BR-001: Free delivery if subtotal > 500, or FREEDEL coupon applied
    const isFreeDelivery = subtotal > 500 || couponApplied === 'FREEDEL';
    const deliveryFee = isFreeDelivery ? 0 : 40;

    const total = Math.max(0, subtotal + deliveryFee + taxes - discount);
    return { subtotal, deliveryFee, taxes, discount, couponApplied, total };
  }

  async createCoupon(data: Coupon): Promise<Coupon> {
    const store = await getStore();
    const existing = store.coupons.find(c => c.code.toUpperCase() === data.code.toUpperCase());
    if (existing) throw AppError.conflict('A coupon with this code already exists');

    const coupon: Coupon = {
      ...data,
      code: data.code.toUpperCase(),
      isActive: data.isActive ?? true,
    };
    store.coupons.push(coupon);
    return coupon;
  }

  async deleteCoupon(code: string): Promise<void> {
    const store = await getStore();
    const idx = store.coupons.findIndex(c => c.code.toUpperCase() === code.toUpperCase());
    if (idx === -1) throw AppError.notFound('Coupon');
    store.coupons.splice(idx, 1);
  }
}

export const couponService = new CouponService();
