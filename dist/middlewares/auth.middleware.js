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
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Protect Middleware: Verifies the token and attaches the user to the request object
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Get token from cookies or headers
    let token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Find the user in the database
        const user = yield user_model_1.default.findById(decoded.id);
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
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Not authorized, invalid token",
        });
    }
});
exports.protect = protect;
// Role-based Authorization Middleware: Checks if the user has the required role
const authorize = (roles) => {
    return (req, res, next) => {
        console.log(req.user);
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
exports.authorize = authorize;
