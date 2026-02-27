import express from "express";
import { createClass, assignClassTeacher } from "../controllers/class.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

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