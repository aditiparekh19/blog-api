import { v2 as cloudinary } from 'cloudinary';

import { logger } from '@/lib/winston';

import User from '@/models/user';
import Blog from '@/models/blog';

import type { Request, Response } from 'express';

const getUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;
  try {
    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();

    const publicIds = blogs.map(({ banner }) => banner.publicId);
    await cloudinary.api.delete_resources(publicIds);

    logger.info('Multiple blog banners deleted from Clodinary', {
      publicIds,
    });

    await Blog.deleteMany({ author: userId });
    logger.info('Multiple blogs deleted', {
      userId,
      blogs,
    });
    const user = await User.findById(userId).select('-__v').exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
    logger.error('Error while getting user', err);
  }
};

export default getUser;
