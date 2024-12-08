// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ success: false, message: "Not authorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            res.status(401).json({ success: false, message: "User not found" });
            return
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Not authorized" });
    }
};
