import express from "express";
import {
  createAnnouncement,
  getAnnouncementsByClass,
} from "../controllers/announcement.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

// Create announcement (Teacher)
router.post(
  "/create",
  protect,
  authorizeRoles("teacher"),
  createAnnouncement
);

// Get announcements (Teacher/Student both can use)
router.get(
  "/class/:classId",
  protect,
  getAnnouncementsByClass
);

export default router;