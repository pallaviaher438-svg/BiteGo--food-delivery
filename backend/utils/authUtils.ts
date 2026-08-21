import crypto from 'crypto';
import { env } from '../config/env';

// ---------- JWT Implementation (HMAC SHA-256, no external dependency) ----------

interface JwtPayload {
  id: string;
  role: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

function base64UrlEncode(data: string): string {
  return Buffer.from(data).toString('base64url');
}

function base64UrlDecode(data: string): string {
  return Buffer.from(data, 'base64url').toString('utf8');
}

export function signToken(payload: JwtPayload): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));

  const expiresIn = env.JWT_EXPIRES_IN;
  let expSeconds = 7 * 24 * 3600; // default 7 days
  if (expiresIn.endsWith('d')) expSeconds = parseInt(expiresIn) * 86400;
  else if (expiresIn.endsWith('h')) expSeconds = parseInt(expiresIn) * 3600;
  else if (expiresIn.endsWith('m')) expSeconds = parseInt(expiresIn) * 60;

  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expSeconds };
  const body = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac('sha256', env.JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): JwtPayload {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  const [header, body, signature] = parts;

  const expectedSig = crypto
    .createHmac('sha256', env.JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  if (signature !== expectedSig) throw new Error('Invalid token signature');

  const payload = JSON.parse(base64UrlDecode(body));

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload as JwtPayload;
}

// ---------- Password Hashing (PBKDF2, no external bcrypt dependency) ----------

const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const ITERATIONS = 100000;
const DIGEST = 'sha512';

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
    crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex') === key);
    });
  });
}

// ---------- OTP Generator ----------

export function generateOtp(length: number = 4): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  // Ensure it's not all zeros
  if (otp === '0'.repeat(length)) otp = '4220';
  return otp;
}

export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}
