import winston from 'winston';
import config from '../config';

const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;

// Use env var to disable logs (e.g., on Vercel Preview or Development deployments)
const DISABLE_LOGS = process.env.DISABLE_LOGS === 'true';

// Define the transports array to hold different logging transports
const transports: winston.transport[] = [];

// Only add transports if logging is not disabled
if (!DISABLE_LOGS) {
  if (config.NODE_ENV !== 'production') {
    transports.push(
      new winston.transports.Console({
        format: combine(
          colorize({ all: true }),
          timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
          align(),
          printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length
              ? `\n${JSON.stringify(meta, null, 2)}`
              : '';
            return `${timestamp} [${level}]: ${message}${metaStr}`;
          }),
        ),
      }),
    );
  } else {
    // In production, use clean JSON logs
    transports.push(
      new winston.transports.Console({
        format: combine(timestamp(), errors({ stack: true }), json()),
      }),
    );
  }
}

// Create a logger instance using Winston
const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: DISABLE_LOGS || config.NODE_ENV === 'test',
});

export { logger };