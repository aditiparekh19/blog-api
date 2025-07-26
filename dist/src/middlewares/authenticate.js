"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt_1 = require("@/lib/jwt");
const winston_1 = require("@/lib/winston");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer'))) {
        res.status(401).json({
            code: 'AuthenticationError',
            meaasge: 'Access denied, no token provided,',
        });
        return;
    }
    const [_, token] = authHeader.split(' ');
    try {
        const jwtPayload = (0, jwt_1.verifyAccessToken)(token);
        req.userId = jwtPayload.userId;
        return next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Access token expired, request a new one with refresh token',
            });
            return;
        }
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Access token invalid',
            });
            return;
        }
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err,
        });
        winston_1.logger.error('Error during authentication, err');
    }
};
exports.default = authenticate;
