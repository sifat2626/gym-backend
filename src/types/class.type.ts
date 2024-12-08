// src/types/class.type.ts
import { Types } from "mongoose";
import { UserWithId } from "./user.type";

export type TimeSlot = "6-8 AM" | "8-10 AM" | "10-12 PM" | "4-6 PM" | "6-8 PM";

export type Class = {
    date: Date;
    timeSlot: TimeSlot;
    trainer: UserWithId["_id"]; // Reference to User
    trainees: UserWithId["_id"][]; // Array of User references
    capacity: number; // Maximum 10
};
