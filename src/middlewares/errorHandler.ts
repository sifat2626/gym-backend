// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

interface ErrorResponse extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

// Global error handler middleware
const errorHandler = (
    err: ErrorResponse,
    req: Request,
    res: Response,
    next: NextFunction
) => {
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

export default errorHandler;
