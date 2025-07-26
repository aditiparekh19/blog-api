// api/index.ts

import app from '../src/app';
import { connectToDatabase } from '../src/lib/mongoose';
import { logger } from '../src/lib/winston';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isConnected) {
    try {
      await connectToDatabase();
      isConnected = true;
      logger.info('Connected to DB');
    } catch (err) {
      logger.error('Database connection failed', err);
      res.status(500).send('Database connection failed');
      return;
    }
  }

  // Pass the request directly to Express
  app(req, res);
}
