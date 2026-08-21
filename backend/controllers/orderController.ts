import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orderService';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated } from '../utils/response';

export class OrderController {
  async getQuote(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const quote = await orderService.getOrderQuote(req.body);
      sendSuccess(res, quote, 'Order quote calculated');
    } catch (err) {
      next(err);
    }
  }

  async placeOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.placeOrder(req.user!.id, req.body);
      sendCreated(res, order, 'Order placed successfully');
    } catch (err) {
      next(err);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role, status, restaurantId } = req.query as Record<string, string>;
      const orders = await orderService.getOrders(req.user!.id, req.user!.role, { role, status, restaurantId });
      sendSuccess(res, orders);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.getOrderById(req.params.id, req.user!.id, req.user!.role);
      sendSuccess(res, order);
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, estimatedMinutes, rejectionReason } = req.body;
      const order = await orderService.updateOrderStatus(
        req.params.id,
        req.user!.id,
        req.user!.role,
        { status, estimatedMinutes, rejectionReason }
      );
      sendSuccess(res, order, `Order status updated to ${order.status}`);
    } catch (err) {
      next(err);
    }
  }

  async cancelOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reason } = req.body;
      const order = await orderService.cancelOrder(
        req.params.id,
        req.user!.id,
        req.user!.role,
        reason || 'Cancelled by user'
      );
      sendSuccess(res, order, 'Order cancelled successfully');
    } catch (err) {
      next(err);
    }
  }

  async submitReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { rating, comment } = req.body;
      const order = await orderService.submitReview(req.params.id, req.user!.id, Number(rating), comment);
      sendSuccess(res, order, 'Review submitted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const orderController = new OrderController();
