import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

export const generateToken = (payload: object, expiresIn: string = "1d"): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): object | string => {
    return jwt.verify(token, JWT_SECRET);
};
