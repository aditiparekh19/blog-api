// api/index.ts

import app from '../src/app';
import { connectToDatabase } from '../src/lib/mongoose';
import { logger } from '../src/lib/winston';

let isConnected = false;

export default async function handler(req: any, res: any) {
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

  app(req, res); // ✅ Just call the Express app directly
}
