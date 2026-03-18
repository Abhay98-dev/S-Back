import express from "express";
import { getStudentProfile , getStudentFees } from "../controllers/student.controller.js";
import  protect  from "../middlewares/auth.middleware.js";
import  authorizeRoles  from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/profile",
  protect,
  authorizeRoles("student"),
  getStudentProfile
);

router.get(
  "/fees",
  protect,
  authorizeRoles("student"),
  getStudentFees
);

export default router;