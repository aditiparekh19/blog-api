import winston from 'winston';

import config from '../config';

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

// Define the transports array to hold different logging transports
const transports: winston.transport[] = [];

// If the app is not running in production, add a console transport.
if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // Add color to all log levels
        timestamp({ format: 'YYY-MM-DD hh:mm:ss A' }), // Add timestamp to logs
        align(), // Align log messages
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : '';
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        }),
      ),
    }),
  );
}

// Create a logger instance using Winston
const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info',
    format: combine(timestamp(), errors({ stack: true }), json()), // Use JSON format for log messages
    transports,
    silent: config.NODE_ENV === 'test', // Disable loggig in test env
});

export { logger };
