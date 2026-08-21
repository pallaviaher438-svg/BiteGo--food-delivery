import { getStore } from '../data/store';
import { User, OtpEntry } from '../types';
import { AppError } from '../utils/AppError';
import { signToken, hashPassword, verifyPassword, generateOtp, generateId } from '../utils/authUtils';

export class AuthService {
  /** Request OTP for phone login */
  async requestOtp(phone: string): Promise<{ phone: string; demoOtp: string }> {
    const store = await getStore();
    const otp = generateOtp(4);
    // Remove any existing OTP for this phone
    store.otps = store.otps.filter(e => e.phone !== phone);
    store.otps.push({ phone, otp, expiresAt: Date.now() + 5 * 60 * 1000 });
    return { phone, demoOtp: otp };
  }

  /** Verify OTP and login/register user */
  async verifyOtp(phone: string, otp: string, name?: string, role?: string): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const store = await getStore();
    const entry = store.otps.find(e => e.phone === phone);

    // Accept demo OTP 4220 or 1234 or matching entry
    const isValidOtp = otp === '4220' || otp === '1234' || (entry && entry.otp === otp && entry.expiresAt > Date.now());
    if (!isValidOtp) {
      throw AppError.invalidOtp('Invalid or expired OTP');
    }

    // Remove used OTP
    store.otps = store.otps.filter(e => e.phone !== phone);

    // Find or create user
    let user = store.users.find(u => u.phone === phone);
    if (!user) {
      user = {
        id: generateId('usr-'),
        name: name || phone.replace(/\D/g, '').slice(-10),
        email: '',
        phone,
        role: (role as any) || 'customer',
        isGoldMember: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.users.push(user);
    }

    const token = signToken({ id: user.id, role: user.role, phone: user.phone, email: user.email, restaurantId: user.restaurantId });
    const { passwordHash, ...safeUser } = user;
    return { token, user: safeUser };
  }

  /** Email/password login */
  async login(email: string, password: string): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const store = await getStore();
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !user.passwordHash) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const token = signToken({ id: user.id, role: user.role, email: user.email, phone: user.phone, restaurantId: user.restaurantId });
    const { passwordHash, ...safeUser } = user;
    return { token, user: safeUser };
  }

  /** Register with email/password */
  async signup(name: string, email: string, phone: string, password: string, role?: string): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const store = await getStore();

    if (store.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw AppError.conflict('A user with this email already exists');
    }

    const passwordHash = await hashPassword(password);
    const user: User = {
      id: generateId('usr-'),
      name,
      email,
      phone: phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`,
      passwordHash,
      role: (role as any) || 'customer',
      isGoldMember: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.users.push(user);

    const token = signToken({ id: user.id, role: user.role, email: user.email, phone: user.phone, restaurantId: user.restaurantId });
    const { passwordHash: _, ...safeUser } = user;
    return { token, user: safeUser };
  }

  /** Get user profile */
  async getProfile(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const store = await getStore();
    const user = store.users.find(u => u.id === userId);
    if (!user) throw AppError.notFound('User');
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  /** Update user profile */
  async updateProfile(userId: string, data: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatar'>>): Promise<Omit<User, 'passwordHash'>> {
    const store = await getStore();
    const idx = store.users.findIndex(u => u.id === userId);
    if (idx === -1) throw AppError.notFound('User');

    if (data.name) store.users[idx].name = data.name;
    if (data.email) store.users[idx].email = data.email;
    if (data.phone) store.users[idx].phone = data.phone;
    if (data.avatar) store.users[idx].avatar = data.avatar;
    store.users[idx].updatedAt = new Date().toISOString();

    const { passwordHash, ...safeUser } = store.users[idx];
    return safeUser;
  }
}

export const authService = new AuthService();
