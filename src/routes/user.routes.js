import express from "express";
import { 
  createTeacher ,
  createStudent , 
  getAllTeachers , 
  getAllStudents , 
  deleteUser , 
  getStudentById , 
  getTeacherById , 
  updateStudent , 
  updateTeacher
  } from "../controllers/user.controller.js";
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


router.get("/students/:id", protect, authorizeRoles("admin"), getStudentById);

router.get("/teachers/:id", protect, authorizeRoles("admin"), getTeacherById);

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
  "/teachers/:id", 
  protect, 
  authorizeRoles("admin"), 
  deleteUser
);

router.delete(
  "/students/:id", 
  protect, 
  authorizeRoles("admin"), 
  deleteUser
);


router.put("/teachers/:id", protect, authorizeRoles("admin"), updateTeacher);

router.put("/students/:id", protect, authorizeRoles("admin"), updateStudent);

export default router;