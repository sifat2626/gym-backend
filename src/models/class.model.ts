// src/models/class.model.ts
import mongoose, { Schema, Document, model } from "mongoose";
import { Class } from "../types/class.type";

export type ClassDocument = Class & Document;

const ClassSchema = new Schema<ClassDocument>(
    {
        title: {
            type: String,
            required: [true, "Class title is required"],
            trim: true,
            minlength: [3, "Class title must be at least 3 characters long"],
        },
        trainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Assuming "User" model includes Trainers
            required: [true, "Trainer is required"],
        },
        trainees: [
            {
                type: mongoose.Schema.Types.ObjectId,
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
                validator: function (this: ClassDocument, value: Date): boolean {
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
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Middleware to enforce business rules
ClassSchema.pre("save", async function (next) {
    const classDoc = this as ClassDocument;

    // Check for the daily schedule limit (5 schedules per day)
    const dailySchedules = await mongoose.models.Class.countDocuments({
        date: classDoc.date,
    });

    if (dailySchedules >= 5) {
        return next(
            new Error("Daily schedule limit reached. Maximum 5 classes per day.")
        );
    }

    next();
});

const ClassModel = model<ClassDocument>("Class", ClassSchema);
export default ClassModel;
