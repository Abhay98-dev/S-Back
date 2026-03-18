import express from "express";
import {
  markAttendance,
  getMyAttendance,
  markAbsentStudents,
  getClassAttendance 
} from "../controllers/attendance.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/class/:classId",
  protect,
  authorizeRoles("teacher"),
  getClassAttendance
);

// Teacher marks attendance
router.post("/teacher", protect, authorizeRoles("teacher"), markAttendance);

// Student views attendance
router.get("/student", protect, authorizeRoles("student"), getMyAttendance);

router.patch(
  "/:attendanceId/mark-absent",
  protect,
  authorizeRoles("teacher"),
  markAbsentStudents
);

export default router;