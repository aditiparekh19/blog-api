import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';
import { error } from 'console';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer')) {
    res.status(401).json({
      code: 'AuthenticationError',
      meaasge: 'Access denied, no token provided,',
    });
    return;
  }

  // Split out the token from the 'Bearer' prefix
  const [_, token] = authHeader.split(' ');

  try {
    // Verify the token and extract the userId from the payload
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    // Attach the userId to the request object for later use
    req.userId = jwtPayload.userId;

    // Proceed to the next middleware or route handler
    return next();
  } catch (err) {
    // Handle expired token error
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token expiired, request a new one with refresh token',
      });
      return;
    }

    // Handle invalid token error
    if (err instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token invalid',
      });
      return;
    }

    // Catch all other errors
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
    logger.error('Error during authentication, err');
  }
};

export default authenticate;
