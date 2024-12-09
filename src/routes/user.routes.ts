// src/routes/user.routes.ts
import express from "express";
import {
    registerTrainee,
    loginUser,
    getUserProfile,
    logoutUser,
    modifyTrainer,
    registerTrainer
} from "../controllers/auth.controller";
import {authorize, protect} from "../middlewares/auth.middleware";

const router = express.Router();

// User registration route (Trainee)
router.post("/register", registerTrainee);

// User login route
router.post("/login", loginUser);

// Protected route to get user profile (must be authenticated)
router.get("/profile", protect, getUserProfile);

// User logout route
router.post("/logout", logoutUser);

router.post("/register/trainer", protect, authorize(["Admin"]), registerTrainer);

router.put("/modify/trainer/:trainerId",protect, authorize(["Admin"]),  modifyTrainer);

export default router;
