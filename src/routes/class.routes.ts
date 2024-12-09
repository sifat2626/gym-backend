import { Router } from "express";
import {
    createClass,
    getClasses,
    bookClass,
    updateClass,
    deleteClass, getClassesByTrainer,
} from "../controllers/class.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Route to create a new class schedule (Admin only)
router.post(
    "/create",
    protect,
    authorize(["Admin"]), // Only Admin can create classes
    createClass
);

// Route to get all class schedules (Admin and Trainer can view)
router.get(
    "/",
    protect,
    getClasses
);


// Route for a trainee to book a class
router.post(
    "/:classId/book",
    protect,
    authorize(["Trainee"]), // Only Trainee can book classes
    bookClass
);

// Route to update class details (Admin only)
router.put(
    "/:classId/update",
    protect,
    authorize(["Admin"]), // Only Admin can update classes
    updateClass
);

// Route to delete a class schedule (Admin only)
router.delete(
    "/:classId/delete",
    protect,
    authorize(["Admin"]), // Only Admin can delete classes
    deleteClass
);

router.get("/trainer/:trainerId", getClassesByTrainer);

export default router;
