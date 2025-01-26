import app from "./app.js";
import dotenv from "dotenv";
import { Request, Response } from "express";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

// Handling Uncaught Exception
process.on("uncaughtException", (err: Error) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    
    process.exit(1);
});

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Auth Service Working!"
    })
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err: any) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});