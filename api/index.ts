import app from '../src/app';
import { connectToDatabase } from '../src/lib/mongoose';
import { logger } from '../src/lib/winston';

let isConnected = false;

export default async function handler(req: any, res: any) {
  if (!isConnected) {
    try {
      await connectToDatabase();
      isConnected = true;
      logger.info('Connected to Database');
    } catch (err) {
      logger.error('Database connection failed', err);
      return res.status(500).send('Database connection failed');
    }
  }

  app(req, res);
}
