"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/class.model.ts
const mongoose_1 = __importStar(require("mongoose"));
const ClassSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Class title is required"],
        trim: true,
        minlength: [3, "Class title must be at least 3 characters long"],
    },
    trainer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // Assuming "User" model includes Trainers
        required: [true, "Trainer is required"],
    },
    trainees: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User", // Assuming "User" model includes Trainees
        },
    ],
    startTime: {
        type: Date,
        required: [true, "Start time is required"],
    },
    endTime: {
        type: Date,
        required: [true, "End time is required"],
        validate: {
            validator: function (value) {
                return value > this.startTime;
            },
            message: "End time must be after start time",
        },
    },
    date: {
        type: Date,
        required: [true, "Class date is required"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});
// Middleware to enforce business rules
ClassSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const classDoc = this;
        // Check for the daily schedule limit (5 schedules per day)
        const dailySchedules = yield mongoose_1.default.models.Class.countDocuments({
            date: classDoc.date,
        });
        if (dailySchedules >= 5) {
            return next(new Error("Daily schedule limit reached. Maximum 5 classes per day."));
        }
        next();
    });
});
const ClassModel = (0, mongoose_1.model)("Class", ClassSchema);
exports.default = ClassModel;
