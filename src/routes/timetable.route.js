import express from "express";
import { createOrUpdateTimetable, getMyTimetable } from "../controllers/timetable.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/admin", protect, authorizeRoles("admin"), createOrUpdateTimetable);

router.get("/student", protect, authorizeRoles("student"), getMyTimetable);

export default router;