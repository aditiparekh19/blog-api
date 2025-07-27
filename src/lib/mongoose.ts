import mongoose from 'mongoose';

import config from '../config';
import { logger } from './winston'

import type { ConnectOptions } from 'mongoose';

const clientOptions: ConnectOptions = {
  dbName: 'blog-db',
  appName: 'Blog API',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

// Establishes a connection to the MongoDB database using Mongoose.

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error('Mongodb URI is not defined in the configuration.');
  }
  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info('Connected to the database successfully.', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    logger.error('Error connecting to the datase', err);
  }
};

// Disconnect from the MongoDB database using Mongoose.
export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.error('Disconnected from the database successfully.', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    logger.error('Error connecting to the datase', err);
  }
};
