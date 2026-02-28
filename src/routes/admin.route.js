import express from "express";
import { getDashboardStats } from "../controllers/admin.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/dashboard-stats",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);

export default router;