import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated } from '../utils/response';

export class AuthController {
  async requestOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone } = req.body;
      const result = await authService.requestOtp(phone);
      sendSuccess(res, result, 'OTP sent successfully');
    } catch (err) {
      next(err);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone, otp, name, role } = req.body;
      const result = await authService.verifyOtp(phone, otp, name, role);
      sendSuccess(res, result, 'Authentication successful');
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      sendSuccess(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, phone, password, role } = req.body;
      const result = await authService.signup(name, email, phone, password, role);
      sendCreated(res, result, 'Account created successfully');
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getProfile(req.user!.id);
      sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, phone, avatar } = req.body;
      const user = await authService.updateProfile(req.user!.id, { name, email, phone, avatar });
      sendSuccess(res, user, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
