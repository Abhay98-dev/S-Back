import express from "express";
import {
  createHomework,
  getMyHomework,
} from "../controllers/homework.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

// Teacher creates homework
router.post("/", protect, authorizeRoles("teacher"), createHomework);

// Student views homework
router.get("/my", protect, authorizeRoles("student"), getMyHomework);

export default router;