import { rateLimit } from 'express-rate-limit';

// Configure rate limiting middleware to prevent abuse.
const limiter = rateLimit({
    windowMs: 60000, // 1-min time window for req limiting
    limit: 60, // Allow a max of 60 requests per windows per IP
    standardHeaders: 'draft-8', // Use the latest std rate-limit headers
    legacyHeaders: false, // Disable deprecated X-RateLimit headers
    message : {
        error: 'You have sent too many requests in a given amount of time. Please try again later.',
    },
});

export default limiter;