import Announcement from "../models/announcement.model.js";
import Class from "../models/class.model.js";

export const createAnnouncement = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const { classId, title, message } = req.body;

    if (!classId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check class
    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Check teacher authorization
    if (
      !classData.classTeacher ||
      classData.classTeacher.toString() !== teacherId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for this class",
      });
    }

    const announcement = await Announcement.create({
      classId,
      title,
      message,
      teacher: teacherId,
    });

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement,
    });

  } catch (error) {
    console.error("Create Announcement Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAnnouncementsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const announcements = await Announcement.find({ classId })
      .populate("teacher", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });

  } catch (error) {
    console.error("Get Announcements Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};