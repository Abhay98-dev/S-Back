import express from "express";
import { createTeacher , createStudent } from "../controllers/user.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

// Admin creates teacher
router.post(
  "/create-teacher",
  protect,
  authorizeRoles("admin"),
  createTeacher
);

router.post(
  "/create-student",
  protect,
  authorizeRoles("admin"),
  createStudent
);

export default router;