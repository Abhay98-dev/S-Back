import express from "express";
import { getTeacherProfile } from "../controllers/teacher.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/profile",
  protect,
  authorizeRoles("teacher"),
  getTeacherProfile
);

export default router;