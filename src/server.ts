// Connect to DB and start server
import app from "./app";
import mongoose from "mongoose";

const port = process.env.PORT || 8000;

mongoose
    .connect(process.env.DATABASE as string)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server Running on port ${port}`);
        });
    })
    .catch((err) => console.error("Database connection error:", err));