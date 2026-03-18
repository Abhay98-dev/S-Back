import User from "../models/user.model.js";
import Fees from "../models/fees.model.js";

export const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const student = await User.findById(studentId)
      .select("name email uid classId")
      .populate("classId", "standard section");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      uid: student.uid,
      class: student.classId,
    });

  } catch (error) {
    console.error("Get Student Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getStudentFees = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const fees = await Fees.findOne({ student: studentId });

    if (!fees) {
      return res.status(404).json({
        success: false,
        message: "Fees record not found",
      });
    }

    res.status(200).json({
      totalFees: fees.totalFees,
      paid: fees.paid,
      due: fees.totalFees - fees.paid,
    });

  } catch (error) {
    console.error("Get Fees Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};