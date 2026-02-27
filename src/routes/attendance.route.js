import express from "express";
import {
  markAttendance,
  getMyAttendance,
  markAbsentStudents 
} from "../controllers/attendance.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

// Teacher marks attendance
router.post("/", protect, authorizeRoles("teacher"), markAttendance);

// Student views attendance
router.get("/my", protect, authorizeRoles("student"), getMyAttendance);

router.patch(
  "/:attendanceId/mark-absent",
  protect,
  authorizeRoles("teacher"),
  markAbsentStudents
);

export default router;