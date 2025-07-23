import { logger } from '@/lib/winston';

import User from '@/models/user';

import type { Request, Response } from 'express';

const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.params.userId;

  try {
    await User.deleteOne({ _id: userId});
    logger.info('User account has been deleted', { userId });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
    logger.error('Error while deleting user', err);
  }
};

export default deleteUser;
