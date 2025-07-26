"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const authenticate_1 = __importDefault(require("@/middlewares/authenticate"));
const validationError_1 = __importDefault(require("@/middlewares/validationError"));
const authorize_1 = __importDefault(require("@/middlewares/authorize"));
const uploadBlogBanner_1 = __importDefault(require("@/middlewares/uploadBlogBanner"));
const create_blog_1 = __importDefault(require("@/controllers/v1/blog/create_blog"));
const get_all_blogs_1 = __importDefault(require("@/controllers/v1/blog/get_all_blogs"));
const get_blogs_by_user_1 = __importDefault(require("@/controllers/v1/blog/get_blogs_by_user"));
const get_blog_by_slug_1 = __importDefault(require("@/controllers/v1/blog/get_blog_by_slug"));
const update_blog_1 = __importDefault(require("@/controllers/v1/blog/update_blog."));
const delete_blog_1 = __importDefault(require("@/controllers/v1/blog/delete_blog"));
const upload = (0, multer_1.default)();
const router = (0, express_1.Router)();
router.post('/', authenticate_1.default, (0, authorize_1.default)(['admin']), upload.single('banner_image'), (0, express_validator_1.body)('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'), (0, express_validator_1.body)('content').trim().notEmpty().withMessage('Content is required'), (0, express_validator_1.body)('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft or published'), validationError_1.default, (0, uploadBlogBanner_1.default)('post'), create_blog_1.default);
router.get('/', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), (0, express_validator_1.query)('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'), (0, express_validator_1.query)('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a positive integer'), validationError_1.default, get_all_blogs_1.default);
router.get('/user/:userId', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), (0, express_validator_1.param)('userId').isMongoId().withMessage('Invalid user ID'), (0, express_validator_1.query)('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'), (0, express_validator_1.query)('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a positive integer'), validationError_1.default, get_blogs_by_user_1.default);
router.get('/:slug', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), (0, express_validator_1.param)('slug').notEmpty().withMessage('Slug is requires'), validationError_1.default, get_blog_by_slug_1.default);
router.put('/:blogId', authenticate_1.default, (0, authorize_1.default)(['admin']), (0, express_validator_1.param)('blogId').isMongoId().withMessage('Invalid blog ID'), upload.single('banner_image'), (0, express_validator_1.body)('title')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'), (0, express_validator_1.body)('content'), (0, express_validator_1.body)('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft or published'), validationError_1.default, (0, uploadBlogBanner_1.default)('put'), update_blog_1.default);
router.delete('/:blogId', authenticate_1.default, (0, authorize_1.default)(['admin']), delete_blog_1.default);
exports.default = router;
