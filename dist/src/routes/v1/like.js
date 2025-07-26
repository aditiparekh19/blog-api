"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const like_blog_1 = __importDefault(require("@/controllers/v1/like/like_blog"));
const unlike_blog_1 = __importDefault(require("@/controllers/v1/like/unlike_blog"));
const validationError_1 = __importDefault(require("@/middlewares/validationError"));
const authenticate_1 = __importDefault(require("@/middlewares/authenticate"));
const authorize_1 = __importDefault(require("@/middlewares/authorize"));
const router = (0, express_1.Router)();
router.post('/blog/:blogId', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), (0, express_validator_1.param)('blogId').isMongoId().withMessage('Invalid blog ID'), (0, express_validator_1.body)('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user ID'), validationError_1.default, like_blog_1.default);
router.delete('/blog/:blogId', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), (0, express_validator_1.param)('blogId').isMongoId().withMessage('Invalid blog ID'), (0, express_validator_1.body)('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user ID'), validationError_1.default, unlike_blog_1.default);
exports.default = router;
