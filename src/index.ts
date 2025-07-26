// api/index.ts

import { createServer } from 'http';
import app from '../src/app';
import { connectToDatabase } from '../src/lib/mongoose';
import { logger } from '../src/lib/winston';

// Ensure DB connection once per cold start
let isConnected = false;

const handler = async (req: any, res: any) => {
  if (!isConnected) {
    try {
      await connectToDatabase();
      isConnected = true;
      logger.info('Connected to DB');
    } catch (err) {
      logger.error('Database connection failed', err);
      res.statusCode = 500;
      return res.end('Database connection failed');
    }
  }

  const server = createServer(app);
  server.emit('request', req, res);
};

export default handler;
