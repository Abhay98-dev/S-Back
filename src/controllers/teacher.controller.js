import User from "../models/user.model.js";

export const getTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.user.userId;

    const teacher = await User.findById(teacherId)
      .select("_id name email subject role");

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
    });

  } catch (error) {
    console.error("Get Teacher Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};