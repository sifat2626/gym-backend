// src/types/express.d.ts

import { UserDocument } from "../models/user.model";

// Declare module to extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user: UserDocument;
        }
    }
}
