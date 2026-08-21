import { Response, NextFunction } from 'express';
import { addressService } from '../services/addressService';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated } from '../utils/response';

export class AddressController {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const addresses = await addressService.getAddresses(req.user!.id);
      sendSuccess(res, addresses);
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const address = await addressService.createAddress(req.user!.id, req.body);
      sendCreated(res, address, 'Address added successfully');
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const address = await addressService.updateAddress(req.params.id, req.user!.id, req.body);
      sendSuccess(res, address, 'Address updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await addressService.deleteAddress(req.params.id, req.user!.id);
      sendSuccess(res, null, 'Address deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const addressController = new AddressController();
