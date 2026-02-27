import express from "express";
import { createOrUpdateTimetable, getMyTimetable } from "../controllers/timetable.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createOrUpdateTimetable);

router.get("/my", protect, authorizeRoles("student"), getMyTimetable);

export default router;