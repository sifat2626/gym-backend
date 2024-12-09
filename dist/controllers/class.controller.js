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
exports.getClassesByTrainer = exports.deleteClass = exports.updateClass = exports.bookClass = exports.getClasses = exports.createClass = void 0;
const class_model_1 = __importDefault(require("../models/class.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const moment_1 = __importDefault(require("moment")); // Importing moment.js for date parsing and formatting
// Helper function for error handling
const errorResponse = (res, message, statusCode) => {
    res.status(statusCode).json({ success: false, message });
};
// Create a new class schedule (Admin only)
const createClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, trainer, startTime, date } = req.body;
        // Parse the date
        const parsedDate = (0, moment_1.default)(date, "YYYY-MM-DD").startOf("day");
        if (!parsedDate.isValid()) {
            errorResponse(res, "Invalid date format. Use 'YYYY-MM-DD'.", 400);
            return;
        }
        // Parse the time
        const parsedStartTime = (0, moment_1.default)(startTime, "HH:mm");
        if (!parsedStartTime.isValid()) {
            errorResponse(res, "Invalid start time format. Use 'HH:mm'.", 400);
            return;
        }
        // Combine date and start time
        const combinedStartTime = (0, moment_1.default)(parsedDate)
            .set({
            hour: parsedStartTime.hours(),
            minute: parsedStartTime.minutes(),
        })
            .toDate();
        // Calculate end time (2 hours later)
        const endTime = (0, moment_1.default)(combinedStartTime).add(2, "hours").toDate();
        // Check if the trainer exists
        const trainerExists = yield user_model_1.default.findById(trainer);
        if (!trainerExists || trainerExists.role !== "Trainer") {
            errorResponse(res, "Invalid trainer ID or the user is not a trainer.", 400);
            return;
        }
        // Create the class
        const newClass = yield class_model_1.default.create({
            title,
            trainer,
            startTime: combinedStartTime,
            endTime,
            date: parsedDate.toDate(),
        });
        res.status(201).json({
            success: true,
            message: "Class created successfully.",
            data: newClass,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createClass = createClass;
// Get all class schedules (Admin/Trainer only)
const getClasses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.query;
        const query = {};
        if (date)
            query.date = new Date(date);
        const classes = yield class_model_1.default.find(query)
            .populate("trainer", "name email")
            .populate("trainees", "name email");
        res.status(200).json({
            success: true,
            message: "Classes retrieved successfully.",
            data: classes,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getClasses = getClasses;
// Book a trainee into a class (Trainee only)
const bookClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { classId } = req.params;
        const traineeId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming `req.user` contains the authenticated user
        // Check if the class exists
        const gymClass = yield class_model_1.default.findById(classId);
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
        yield gymClass.save();
        res.status(200).json({
            success: true,
            message: "Class booked successfully.",
            data: gymClass,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.bookClass = bookClass;
// Update class details (Admin only)
const updateClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId } = req.params;
        const updates = req.body;
        // Check if start and end times are provided and parse them
        if (updates.startTime) {
            updates.startTime = (0, moment_1.default)(updates.startTime, "YYYY-MM-DD HH:mm:ss").toDate();
        }
        if (updates.endTime) {
            updates.endTime = (0, moment_1.default)(updates.endTime, "YYYY-MM-DD HH:mm:ss").toDate();
        }
        // Find and update the class
        const updatedClass = yield class_model_1.default.findByIdAndUpdate(classId, updates, {
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
    }
    catch (error) {
        next(error);
    }
});
exports.updateClass = updateClass;
// Delete a class schedule (Admin only)
const deleteClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId } = req.params;
        const deletedClass = yield class_model_1.default.findByIdAndDelete(classId);
        if (!deletedClass) {
            errorResponse(res, "Class not found.", 404);
            return;
        }
        res.status(200).json({
            success: true,
            message: "Class deleted successfully.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteClass = deleteClass;
const getClassesByTrainer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trainerId } = req.params;
        // Validate if the trainer exists and has the correct role
        const trainer = yield user_model_1.default.findById(trainerId);
        if (!trainer || trainer.role !== "Trainer") {
            res.status(404).json({ success: false, message: "Trainer not found or invalid role." });
            return;
        }
        // Fetch all classes for the trainer
        const classes = yield class_model_1.default.find({ trainer: trainerId })
            .populate("trainer", "name email")
            .populate("trainees", "name email");
        res.status(200).json({
            success: true,
            message: "Classes retrieved successfully.",
            data: classes,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getClassesByTrainer = getClassesByTrainer;
