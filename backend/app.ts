import express, { Request, Response } from 'express';
import { corsMiddleware, securityHeaders, requestLogger } from './middlewares/securityMiddleware';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';

import authRoutes     from './routes/authRoutes';
import userRoutes     from './routes/userRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import couponRoutes   from './routes/couponRoutes';
import addressRoutes  from './routes/addressRoutes';
import orderRoutes    from './routes/orderRoutes';
import deliveryRoutes from './routes/deliveryRoutes';
import adminRoutes    from './routes/adminRoutes';

const app = express();

// ---- Core Middleware ----
app.use(corsMiddleware);
app.use(securityHeaders);
app.use(requestLogger);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ---- Health Check ----
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'BiteGo API', timestamp: new Date().toISOString() });
});

// ---- API Routes (all under /api/v1) ----
app.use('/api/v1/auth',        authRoutes);
app.use('/api/v1/users',       userRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/coupons',     couponRoutes);
app.use('/api/v1/addresses',   addressRoutes);
app.use('/api/v1/orders',      orderRoutes);
app.use('/api/v1/delivery',    deliveryRoutes);
app.use('/api/v1/admin',       adminRoutes);

// ---- 404 + Error Handling ----
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
