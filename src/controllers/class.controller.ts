import { Request, Response, NextFunction } from "express";
import ClassModel from "../models/class.model";
import UserModel from "../models/user.model";
import moment from "moment"; // Importing moment.js for date parsing and formatting

// Helper function for error handling
const errorResponse = (res: Response, message: string, statusCode: number) => {
    res.status(statusCode).json({ success: false, message });
};

// Create a new class schedule (Admin only)
export const createClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, trainer, startTime, endTime, date } = req.body;

        // Parse the dates using moment.js to ensure valid Date objects
        const parsedStartTime = moment(startTime, "YYYY-MM-DD HH:mm:ss").toDate();
        const parsedEndTime = moment(endTime, "YYYY-MM-DD HH:mm:ss").toDate();
        const parsedDate = moment(date, "YYYY-MM-DD").toDate();

        // Check if the trainer exists
        const trainerExists = await UserModel.findById(trainer);
        if (!trainerExists || trainerExists.role !== "Trainer") {
            errorResponse(res, "Invalid trainer ID or the user is not a trainer.", 400);
            return; // Stop further execution
        }

        // Create the class
        const newClass = await ClassModel.create({
            title,
            trainer,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            date: parsedDate,
        });

        res.status(201).json({
            success: true,
            message: "Class created successfully.",
            data: newClass,
        });
    } catch (error) {
        next(error);
    }
};

// Get all class schedules (Admin/Trainer only)
export const getClasses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date } = req.query;

        const query: any = {};
        if (date) query.date = new Date(date as string);

        const classes = await ClassModel.find(query)
            .populate("trainer", "name email")
            .populate("trainees", "name email");

        res.status(200).json({
            success: true,
            message: "Classes retrieved successfully.",
            data: classes,
        });
    } catch (error) {
        next(error);
    }
};

// Book a trainee into a class (Trainee only)
export const bookClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { classId } = req.params;
        const traineeId = req.user?.id; // Assuming `req.user` contains the authenticated user

        // Check if the class exists
        const gymClass = await ClassModel.findById(classId);
        if (!gymClass) {
            errorResponse(res, "Class not found.", 404);
            return;
        }

        // Check if the trainee is already booked
        if (gymClass.trainees.includes(traineeId)) {
            errorResponse(res, "Trainee is already booked for this class.", 400);
            return;
        }

        // Check if the class is full
        if (gymClass.trainees.length >= 10) {
            errorResponse(res, "Class schedule is full. Maximum 10 trainees allowed.", 400);
            return;
        }

        // Add the trainee to the class
        gymClass.trainees.push(traineeId);
        await gymClass.save();

        res.status(200).json({
            success: true,
            message: "Class booked successfully.",
            data: gymClass,
        });
    } catch (error) {
        next(error);
    }
};

// Update class details (Admin only)
export const updateClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { classId } = req.params;
        const updates = req.body;

        // Check if start and end times are provided and parse them
        if (updates.startTime) {
            updates.startTime = moment(updates.startTime, "YYYY-MM-DD HH:mm:ss").toDate();
        }
        if (updates.endTime) {
            updates.endTime = moment(updates.endTime, "YYYY-MM-DD HH:mm:ss").toDate();
        }

        // Find and update the class
        const updatedClass = await ClassModel.findByIdAndUpdate(classId, updates, {
            new: true,
        });

        if (!updatedClass) {
            errorResponse(res, "Class not found.", 404);
            return;
        }

        res.status(200).json({
            success: true,
            message: "Class updated successfully.",
            data: updatedClass,
        });
    } catch (error) {
        next(error);
    }
};

// Delete a class schedule (Admin only)
export const deleteClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { classId } = req.params;

        const deletedClass = await ClassModel.findByIdAndDelete(classId);
        if (!deletedClass) {
            errorResponse(res, "Class not found.", 404);
            return;
        }

        res.status(200).json({
            success: true,
            message: "Class deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};