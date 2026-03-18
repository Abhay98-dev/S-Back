import express from "express";
import {
  createHomework,
  getMyHomework,
  getHomeworkByClass,
} from "../controllers/homework.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

// Teacher creates homework
router.post("/teacher", protect, authorizeRoles("teacher"), createHomework);

// Student views homework
router.get("/student", protect, authorizeRoles("student"), getMyHomework);

router.get(
  "/class/:classId",
  protect,
  authorizeRoles("teacher"),
  getHomeworkByClass
);

export default router;