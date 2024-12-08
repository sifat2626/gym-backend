import mongoose, { Schema, Document, model, CallbackError } from "mongoose";
import bcrypt from "bcrypt";
import { User, UserDocument } from "../types/user.type";

const UserSchema = new Schema<UserDocument>({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
            validator: function (v: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email regex validation
            },
            message: "Invalid email format",
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
        type: String,
        enum: ["Admin", "Trainer", "Trainee"],
        required: [true, "Role is required"],
        default: "Trainee"
    },
});

// Hash the password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: unknown) {
        next(error as CallbackError); // Type error as CallbackError
    }
});

// Compare password for login
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
    return bcrypt.compare(enteredPassword, this.password);
};

const UserModel = model<UserDocument>("User", UserSchema);
export default UserModel;
