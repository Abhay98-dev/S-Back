import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import classRoutes from "./routes/class.routes.js";
import timetableRoute from "./routes/timetable.route.js";
import attendanceRoute from  "./routes/attendance.route.js";
import homeworkRoute from "./routes/homework.route.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "School Backend API is running 🚀",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/timetable", timetableRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/homework", homeworkRoute);

export default app;