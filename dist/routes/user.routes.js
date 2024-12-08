"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/user.routes.ts
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// User registration route (Trainee)
router.post("/register", auth_controller_1.registerTrainee);
// User login route
router.post("/login", auth_controller_1.loginUser);
// Protected route to get user profile (must be authenticated)
router.get("/profile", auth_middleware_1.protect, auth_controller_1.getUserProfile);
// User logout route
router.post("/logout", auth_controller_1.logoutUser);
exports.default = router;
