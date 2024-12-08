import { Request, Response, NextFunction } from "express";
import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";

// Helper function to set cookie
const setTokenCookie = (res: Response, token: string) => {
    res.cookie("token", token, {
        httpOnly: true, // Prevent JavaScript access to the cookie
        secure: process.env.NODE_ENV === "production", // Secure cookie in production
        sameSite: "strict", // Helps prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
};

// Register a new user
export const registerTrainee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email is already registered" });
        }

        // Create new user
        const newUser = new UserModel({ name, email, password, role });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        // Set cookie with the token
        setTokenCookie(res, token);

        res.status(201).json({
            success: true,
            message: "Trainee registered successfully",
            data: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
        });
    } catch (error) {
        next(error);
    }
};

// Login an existing user
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        // Set cookie with the token
        setTokenCookie(res, token);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        next(error);
    }
};

// Logout the user by clearing the cookie
export const logoutUser = async (req: Request, res: Response) => {
    // Clear the cookie
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure cookie in production
        sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logout successful" });
};

// Get user profile (protected route)
export const getUserProfile = async (req: Request, res: Response) => {
    const user = req.user; // Populated by the auth middleware
    res.status(200).json({ success: true, data: user });
};
