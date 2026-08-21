import { Request, Response, NextFunction } from 'express';
import { deliveryService } from '../services/deliveryService';
import { AuthenticatedRequest } from '../types';
import { sendSuccess } from '../utils/response';

export class DeliveryController {
  async getTasks(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await deliveryService.getTasks(req.user!.id, req.user!.role);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async advanceStage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { stage } = req.body;
      const order = await deliveryService.advanceStage(req.params.orderId, req.user!.id, stage);
      sendSuccess(res, order, `Delivery advanced to stage: ${order.status}`);
    } catch (err) {
      next(err);
    }
  }

  async verifyOtp(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { otp } = req.body;
      const order = await deliveryService.verifyOtpAndComplete(req.params.orderId, req.user!.id, otp);
      sendSuccess(res, order, 'Delivery completed successfully');
    } catch (err) {
      next(err);
    }
  }

  async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { timeframe } = req.query as { timeframe?: string };
      const dashboard = await deliveryService.getDashboard(req.user!.id, timeframe);
      sendSuccess(res, dashboard);
    } catch (err) {
      next(err);
    }
  }

  async requestCashout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { amount } = req.body;
      const result = await deliveryService.requestCashout(req.user!.id, Number(amount));
      sendSuccess(res, result, result.message);
    } catch (err) {
      next(err);
    }
  }
}

export const deliveryController = new DeliveryController();
