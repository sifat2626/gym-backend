"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyTrainer = exports.registerTrainer = exports.getUserProfile = exports.logoutUser = exports.loginUser = exports.registerTrainee = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Helper function to set cookie
const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true, // Prevent JavaScript access to the cookie
        secure: process.env.NODE_ENV === "production", // Secure cookie in production
        sameSite: "strict", // Helps prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
};
// Register a new user
const registerTrainee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Check if the user already exists
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: "Email is already registered" });
            return;
        }
        // Create new user
        const newUser = new user_model_1.default({ name, email, password });
        yield newUser.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        // Set cookie with the token
        setTokenCookie(res, token);
        res.status(201).json({
            success: true,
            message: "Trainee registered successfully",
            data: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerTrainee = registerTrainee;
// Login an existing user
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = yield user_model_1.default.findOne({ email });
        if (!user || !(yield user.comparePassword(password))) {
            res.status(401).json({ success: false, message: "Invalid email or password" });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        // Set cookie with the token
        setTokenCookie(res, token);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
// Logout the user by clearing the cookie
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Clear the cookie
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure cookie in production
        sameSite: "strict",
    });
    res.status(200).json({ success: true, message: "Logout successful" });
});
exports.logoutUser = logoutUser;
// Get user profile (protected route)
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user; // Populated by the auth middleware
    res.status(200).json({ success: true, data: user });
});
exports.getUserProfile = getUserProfile;
// Register a new trainer (Admin only)
const registerTrainer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Check if the user already exists
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: "Email is already registered" });
            return;
        }
        // Create a new trainer
        const newTrainer = new user_model_1.default({
            name,
            email,
            password,
            role: "Trainer", // Assign the 'Trainer' role
        });
        yield newTrainer.save();
        res.status(201).json({
            success: true,
            message: "Trainer registered successfully",
            data: { id: newTrainer._id, name: newTrainer.name, email: newTrainer.email, role: newTrainer.role },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerTrainer = registerTrainer;
// Modify a trainer's details (Admin only)
const modifyTrainer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trainerId } = req.params;
        const updates = req.body;
        // Ensure role updates are restricted
        if (updates.role && !updates.role.includes("Trainer")) {
            res.status(400).json({ success: false, message: "Role can only include 'Trainer'" });
            return;
        }
        // Update trainer details
        const updatedTrainer = yield user_model_1.default.findByIdAndUpdate(trainerId, updates, { new: true });
        if (!updatedTrainer) {
            res.status(404).json({ success: false, message: "Trainer not found" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Trainer details updated successfully",
            data: { id: updatedTrainer._id, name: updatedTrainer.name, email: updatedTrainer.email, role: updatedTrainer.role },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.modifyTrainer = modifyTrainer;
