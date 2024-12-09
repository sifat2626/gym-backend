// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";

// Protect Middleware: Verifies the token and attaches the user to the request object
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Get token from cookies or headers
    let token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    // Check if token exists
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Not authorized, no token provided",
        });
        return; // End request cycle if no token is provided
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        // Find the user in the database
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found, authorization failed",
            });
            return; // End request cycle if user is not found
        }

        // Attach the user to the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Not authorized, invalid token",
        });
    }
};

// Role-based Authorization Middleware: Checks if the user has the required role
export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        console.log(req.user)
        // Check if the user has the required role
        if (!req.user || !roles.some(role => req.user.role.includes(role))) {
            res.status(403).json({
                success: false,
                message: "Forbidden, you do not have permission to access this resource",
            });
            return; // End request cycle if user is not authorized
        }

        next(); // Proceed if authorized
    };
};
