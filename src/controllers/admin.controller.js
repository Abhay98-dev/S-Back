import User from "../models/user.model.js";
import Class from "../models/class.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalClasses = await Class.countDocuments();

    res.status(200).json({
      success: true,
      totalStudents,
      totalTeachers,
      totalClasses,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};