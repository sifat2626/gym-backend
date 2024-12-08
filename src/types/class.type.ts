// src/types/class.type.ts
import { Types } from "mongoose";

export type Class = {
    title: string; // Name of the class, e.g., "Yoga Morning Session"
    trainer: Types.ObjectId; // Reference to the Trainer (User model)
    trainees: Types.ObjectId[]; // List of Trainees (User model)
    startTime: Date; // Start time of the class
    endTime: Date; // End time of the class
    date: Date; // Specific date for the class
    isActive: boolean; // Indicates if the class is active
};

export type ClassWithId = Class & { _id: Types.ObjectId };
