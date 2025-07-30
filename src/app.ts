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
import { logger } from './lib/winston';
import v1Routes from './routes/v1';

import type { CorsOptions } from 'cors';

const app = express();
app.set('trust proxy', 1);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: ${origin} is not allowed by CORS`), false);
      logger.warn(`CORS error: ${origin} is not allowed by CORS`);
    }
  },
};

app.use(express.static('public'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression({ threshold: 1024 }));
app.use(helmet());
app.use(limiter);
app.use('/api/v1', v1Routes);

const swaggerPath = path.join(process.cwd(), 'public', 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
