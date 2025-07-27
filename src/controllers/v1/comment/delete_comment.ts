import Blog from '../../../models/blog';
import User from '../../../models/user';
import Comment from '../../../models/comment';

import { logger } from '../../../lib/winston';

import type { Request, Response } from 'express';

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params;
  const currentUserId = req.userId;

  try {
    const comment = await Comment.findById(commentId)
      .select('userId blogId')
      .lean()
      .exec();
    const user = await User.findById(currentUserId)
      .select('role')
      .lean()
      .exec();

    if (!comment) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found',
      });
      return;
    }

    const blog = await Blog.findById(comment.blogId)
      .select('commentsCount')
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (comment.userId !== currentUserId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });
      logger.warn('A user tried to update a blog without permission', {
        userId: currentUserId,
        comment,
      });
      return;
    }

    await Comment.deleteOne({ _id: commentId });

    logger.info('Commented deleted successfully', {
      commentId,
    });

    blog.commentsCount--;
    await blog.save();

    logger.info('Blog comments count updated', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
    logger.error('Error while deleting comment', err);
  }
};

export default deleteComment;
