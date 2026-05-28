import express from "express";
import { createClass, 
  assignClassTeacher , 
  getTeacherClasses , 
  assignSubjectTeacher ,
  getAllClasses ,
  getSingleClass ,
  updateClass ,
  deleteClass ,
  removeTeacher,
  getStudentClass,
  getClassStudents
} from "../controllers/class.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

// Get teacher's assigned classes
router.get(
  "/my",
  protect,
  authorizeRoles("teacher"),
  getTeacherClasses
);

router.get("/:classId/students", protect, authorizeRoles("teacher", "admin"), getClassStudents);

router.get("/", protect, authorizeRoles("admin"), getAllClasses);

router.get("/student/my-class", protect,authorizeRoles("student"), getStudentClass);

router.get("/:id", protect, authorizeRoles("admin"), getSingleClass);

// Create class
router.post("/", protect, authorizeRoles("admin"), createClass);

router.put("/:id", protect, authorizeRoles("admin"), updateClass);

router.delete("/:id", protect, authorizeRoles("admin"), deleteClass);

// Assign class teacher
router.patch(
  "/:classId/assign-teacher",
  protect,
  authorizeRoles("admin"),
  assignClassTeacher
);

// Assign subject teacher
router.patch(
  "/:classId/assign-subject",
  protect,
  authorizeRoles("admin"),
  assignSubjectTeacher
);

router.patch(
  "/:classId/remove-teacher",
  protect,
  authorizeRoles("admin"),
  removeTeacher
);

export default router;
