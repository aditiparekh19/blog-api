import 'module-alias/register';
import app from '@/app';
import { connectToDatabase } from '@/lib/mongoose';
import { logger } from '@/lib/winston';

let isConnected = false;

export default async function handler(req: any, res: any) {
  if (!isConnected) {
    try {
      await connectToDatabase();
      isConnected = true;
      logger.info('Connected to DB');
    } catch (err) {
      logger.error('Database connection failed', err);
      return res.status(500).send('Database connection failed');
    }
  }

  app(req, res);
}
