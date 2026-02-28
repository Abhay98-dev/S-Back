import express from "express";
import { createTeacher , createStudent , getAllTeachers , getAllStudents , deleteUser } from "../controllers/user.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/teachers", 
  protect, 
  authorizeRoles("admin"), 
  getAllTeachers
);

router.get("/students", 
  protect, 
  authorizeRoles("admin"), 
  getAllStudents
);

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

router.delete(
  "/:id", 
  protect, 
  authorizeRoles("admin"), 
  deleteUser
);

export default router;