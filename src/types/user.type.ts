import { Types } from "mongoose";

export type UserRole = "Admin" | "Trainer" | "Trainee";

// Define the User type (without methods)
export type User = {
    name: string;
    email: string;
    password: string;
    role: UserRole;
};

// Extend the User type with the comparePassword method for instances
export type UserDocument = User & {
    _id: Types.ObjectId;
    comparePassword: (enteredPassword: string) => Promise<boolean>;
};
