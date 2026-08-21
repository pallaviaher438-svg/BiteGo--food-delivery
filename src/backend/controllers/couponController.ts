import { Request, Response, NextFunction } from 'express';
import { couponService } from '../services/couponService';
import { sendSuccess, sendCreated } from '../utils/response';

export class CouponController {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupons = await couponService.listCoupons();
      sendSuccess(res, coupons);
    } catch (err) {
      next(err);
    }
  }

  async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, orderAmount } = req.body;
      const result = await couponService.validateCoupon(code, Number(orderAmount));
      sendSuccess(res, result, 'Coupon is valid');
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupon = await couponService.createCoupon(req.body);
      sendCreated(res, coupon, 'Coupon created successfully');
    } catch (err) {
      next(err);
    }
  }

  async deleteCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await couponService.deleteCoupon(req.params.code);
      sendSuccess(res, null, 'Coupon deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const couponController = new CouponController();
