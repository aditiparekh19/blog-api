import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';

import config from './config';
import limiter from './lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from "./lib/mongoose";
import { logger } from './lib/winston';

import v1Routes from './routes/v1';

import type { CorsOptions } from 'cors';

const app = express();

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS`),
        false,
      );
      logger.warn(`CORS error: ${origin} is not allowed by CORS`);
    }
  },
};
app.use(cors(corsOptions));

// Enable JSON request body parsing.
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Enable response compression to reduce payload size and improve performance.
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1KB
  }),
);

// Use Helmet to enhance security by setting various HTTP headers.
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security.
app.use(limiter);

const swaggerPath = path.join(process.cwd(), 'public', 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/*
Immediately Invoked Async Function Expresssion (IIFE) to start the server.
- Tries to connect to DB before initializing the server.
- Defined the API route (`api/v1`)
- Strats the server on teh specified PORT and logs the running URL.
- If an error occurs during startup, it is logged, and the procedd exits with status 1.
*/
(async () => {
  try {
    await connectToDatabase();

    app.use('/api/v1', v1Routes);

    app.listen(config.PORT, () => {
      logger.info(`Server running: http://localhost:${config.PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start the server', err);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

// Handles server shutdown gracefully by disconnecting from the database;
const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.warn('Server SHUTDOWN');
    process.exit(0);
  } catch (err) {
    logger.error('Error during server shutdown', err);
  }
};

// Listens for termination signals (SIGTERM and SIGINT).
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
