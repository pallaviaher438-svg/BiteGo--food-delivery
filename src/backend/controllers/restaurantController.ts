import { Request, Response, NextFunction } from 'express';
import { restaurantService } from '../services/restaurantService';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated } from '../utils/response';

export class RestaurantController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, category, cuisine, isVeg, isOpen, sort } = req.query as Record<string, string>;
      const restaurants = await restaurantService.listRestaurants({ search, category, cuisine, isVeg, isOpen, sort });
      sendSuccess(res, restaurants);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurant = await restaurantService.getRestaurantById(req.params.id);
      sendSuccess(res, restaurant);
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurant = await restaurantService.createRestaurant(req.body);
      sendCreated(res, restaurant, 'Restaurant created successfully');
    } catch (err) {
      next(err);
    }
  }

  async toggleStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isOpen } = req.body;
      const restaurant = await restaurantService.toggleStatus(
        req.params.id,
        Boolean(isOpen),
        { role: req.user!.role, restaurantId: req.user!.restaurantId }
      );
      sendSuccess(res, restaurant, `Restaurant is now ${restaurant.isOpen ? 'open' : 'closed'}`);
    } catch (err) {
      next(err);
    }
  }

  async addMenuItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await restaurantService.addMenuItem(
        req.params.id,
        req.body,
        { role: req.user!.role, restaurantId: req.user!.restaurantId }
      );
      sendCreated(res, item, 'Menu item added successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateMenuItemPrice(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { price } = req.body;
      const item = await restaurantService.updateMenuItemPrice(
        req.params.id,
        req.params.itemId,
        Number(price),
        { role: req.user!.role, restaurantId: req.user!.restaurantId }
      );
      sendSuccess(res, item, 'Price updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async toggleItemAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await restaurantService.toggleItemAvailability(
        req.params.id,
        req.params.itemId,
        { role: req.user!.role, restaurantId: req.user!.restaurantId }
      );
      sendSuccess(res, item, `Item is now ${item.isAvailable ? 'available' : 'unavailable'}`);
    } catch (err) {
      next(err);
    }
  }

  async deleteMenuItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await restaurantService.deleteMenuItem(
        req.params.id,
        req.params.itemId,
        { role: req.user!.role, restaurantId: req.user!.restaurantId }
      );
      sendSuccess(res, null, 'Menu item deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const restaurantController = new RestaurantController();
