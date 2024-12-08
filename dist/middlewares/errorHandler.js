"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    // Send response
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
    // Optionally log the error details in production environment
    if (process.env.NODE_ENV === "production" && !err.isOperational) {
        console.error(err);
    }
};
exports.default = errorHandler;
