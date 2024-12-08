// src/routes/user.routes.ts
import express from "express";
import { registerTrainee, loginUser, getUserProfile, logoutUser } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// User registration route (Trainee)
router.post("/register", registerTrainee);

// User login route
router.post("/login", loginUser);

// Protected route to get user profile (must be authenticated)
router.get("/profile", protect, getUserProfile);

// User logout route
router.post("/logout", logoutUser);

export default router;
