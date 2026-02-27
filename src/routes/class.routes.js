import express from "express";
import { createClass } from "../controllers/class.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createClass);

export default router;