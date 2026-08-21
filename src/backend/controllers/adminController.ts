import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/adminService';
import { sendSuccess } from '../utils/response';

export class AdminController {
  async getMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await adminService.getMetrics();
      sendSuccess(res, metrics);
    } catch (err) {
      next(err);
    }
  }

  async getFleet(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const fleet = await adminService.getFleet();
      sendSuccess(res, fleet);
    } catch (err) {
      next(err);
    }
  }

  async getPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { timeframe } = req.query as { timeframe?: string };
      const breakdown = await adminService.getPaymentBreakdown(timeframe);
      sendSuccess(res, breakdown);
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();
