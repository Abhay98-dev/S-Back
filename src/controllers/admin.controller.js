import User from "../models/user.model.js";
import Class from "../models/class.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalClasses = await Class.countDocuments();

    const assignedClasses = await Class.countDocuments({
      classTeacher: { $ne: null },
    });

    const unassignedClasses = await Class.countDocuments({
      classTeacher: null,
    });

    res.status(200).json({
      totalStudents,
      totalTeachers,
      totalClasses,
      assignedClasses,
      unassignedClasses,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};