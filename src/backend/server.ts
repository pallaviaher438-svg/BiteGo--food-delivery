import { env } from './config/env';
import { logger } from './config/logger';
import { getStore } from './data/store';
import app from './app';

async function start(): Promise<void> {
  try {
    // Warm up the in-memory store (hashes seed passwords, loads restaurants & orders)
    logger.info('Initializing data store...');
    await getStore();
    logger.info('Data store ready');

    const server = app.listen(env.PORT, () => {
      logger.info(`BiteGo API running`, {
        port: env.PORT,
        env: env.NODE_ENV,
        url: `http://localhost:${env.PORT}`,
        health: `http://localhost:${env.PORT}/health`,
        api: `http://localhost:${env.PORT}/api/v1`,
      });
    });

    // Graceful shutdown
    const shutdown = (signal: string) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
      // Force-kill after 10 s if hanging
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught exception', { error: err.message, stack: err.stack });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection', { reason: String(reason) });
      process.exit(1);
    });
  } catch (err: any) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
}

start();
