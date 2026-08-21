import { env } from './env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = LEVELS[(env.LOG_LEVEL as LogLevel)] ?? 1;

function formatMessage(level: LogLevel, message: string, meta?: Record<string, any>): string {
  const ts = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${ts}] [${level.toUpperCase()}] ${message}${metaStr}`;
}

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= currentLevel;
}

export const logger = {
  debug(message: string, meta?: Record<string, any>) {
    if (shouldLog('debug')) console.debug(formatMessage('debug', message, meta));
  },
  info(message: string, meta?: Record<string, any>) {
    if (shouldLog('info')) console.log(formatMessage('info', message, meta));
  },
  warn(message: string, meta?: Record<string, any>) {
    if (shouldLog('warn')) console.warn(formatMessage('warn', message, meta));
  },
  error(message: string, meta?: Record<string, any>) {
    if (shouldLog('error')) console.error(formatMessage('error', message, meta));
  },
  request(method: string, url: string, statusCode: number, durationMs: number, meta?: Record<string, any>) {
    this.info(`${method} ${url} ${statusCode} ${durationMs}ms`, meta);
  },
};
