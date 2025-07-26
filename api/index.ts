// api/index.ts
import { createServer } from 'http';
import app from '../src/app';
import { connectToDatabase } from '../src/lib/mongoose';
import { logger } from '../src/lib/winston';

let isConnected = false;

const handler = async (req: any, res: any) => {
  if (!isConnected) {
    await connectToDatabase();
    isConnected = true;
    logger.info('Connected to DB');
  }

  const server = createServer(app);
  server.emit('request', req, res);
};

export default handler;
