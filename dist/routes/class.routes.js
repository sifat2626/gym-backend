"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const class_controller_1 = require("../controllers/class.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Route to create a new class schedule (Admin only)
router.post("/create", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["Admin"]), // Only Admin can create classes
class_controller_1.createClass);
// Route to get all class schedules (Admin and Trainer can view)
router.get("/", auth_middleware_1.protect, class_controller_1.getClasses);
// Route for a trainee to book a class
router.post("/:classId/book", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["Trainee"]), // Only Trainee can book classes
class_controller_1.bookClass);
// Route to update class details (Admin only)
router.put("/:classId/update", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["Admin"]), // Only Admin can update classes
class_controller_1.updateClass);
// Route to delete a class schedule (Admin only)
router.delete("/:classId/delete", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["Admin"]), // Only Admin can delete classes
class_controller_1.deleteClass);
router.get("/trainer/:trainerId", class_controller_1.getClassesByTrainer);
exports.default = router;
