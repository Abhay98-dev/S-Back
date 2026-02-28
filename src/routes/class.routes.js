import express from "express";
import { createClass, assignClassTeacher , getMyClasses } from "../controllers/class.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

// Get teacher's assigned classes
router.get(
  "/my",
  protect,
  authorizeRoles("teacher"),
  getMyClasses
);

// Create class
router.post("/", protect, authorizeRoles("admin"), createClass);

// Assign class teacher
router.patch(
  "/:classId/assign-teacher",
  protect,
  authorizeRoles("admin"),
  assignClassTeacher
);

export default router;