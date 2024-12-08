"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Connect to DB and start server
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const port = process.env.PORT || 8000;
mongoose_1.default
    .connect(process.env.DATABASE)
    .then(() => {
    app_1.default.listen(port, () => {
        console.log(`Server Running on port ${port}`);
    });
})
    .catch((err) => console.error("Database connection error:", err));
