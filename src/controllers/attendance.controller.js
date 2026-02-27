import Attendance from "../models/attendance.model.js";
import Class from "../models/class.model.js";
import User from "../models/user.model.js";

/**
 * @desc   Class Teacher marks attendance (day-wise)
 * @route  POST /api/attendance
 * @access Private (Teacher)
 */
export const markAttendance = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const { classId, date } = req.body;

    if (!classId || !date) {
      return res.status(400).json({
        success: false,
        message: "classId and date required",
      });
    }

    // 1️⃣ Check class exists
    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // 2️⃣ Check if teacher is class teacher
    if (!classData.classTeacher || classData.classTeacher.toString() !== teacherId) {
      return res.status(403).json({
        success: false,
        message: "You are not the class teacher of this class",
      });
    }

    // 3️⃣ Get all students of this class automatically
    const students = await User.find({
      classId,
      role: "student",
      isActive: true,
    });

    if (!students.length) {
      return res.status(400).json({
        success: false,
        message: "No students found in this class",
      });
    }

    // 4️⃣ Create default attendance (all present)
    const records = students.map((student) => ({
      student: student._id,
      status: "present",
    }));

    const attendance = await Attendance.create({
      classId,
      date,
      teacher: teacherId,
      records,
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully (all present by default)",
      data: attendance,
    });

  } catch (error) {
    console.error("Mark Attendance Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc   Student views own attendance
 * @route  GET /api/attendance/my
 * @access Private (Student)
 */
export const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const classId = req.user.classId;

    const attendanceRecords = await Attendance.find({
      classId,
      "records.student": studentId,
    });

    let totalDays = 0;
    let totalPresent = 0;

    attendanceRecords.forEach((doc) => {
      const record = doc.records.find(
        (r) => r.student.toString() === studentId
      );

      if (record) {
        totalDays++;
        if (record.status === "present") {
          totalPresent++;
        }
      }
    });

    const percentage =
      totalDays === 0
        ? 0
        : ((totalPresent / totalDays) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      summary: {
        totalDays,
        totalPresent,
        percentage,
      },
      rawData: attendanceRecords,
    });

  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc   Mark specific students absent
 * @route  PATCH /api/attendance/:attendanceId/mark-absent
 * @access Private (Teacher - Class Teacher only)
 */
export const markAbsentStudents = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const { attendanceId } = req.params;
    const { absentStudentIds } = req.body;

    if (!absentStudentIds || !absentStudentIds.length) {
      return res.status(400).json({
        success: false,
        message: "absentStudentIds array required",
      });
    }

    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    // Ensure teacher is the same who created it
    if (attendance.teacher.toString() !== teacherId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to modify this attendance",
      });
    }

    attendance.records.forEach((record) => {
      if (absentStudentIds.includes(record.student.toString())) {
        record.status = "absent";
      }
    });

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Absent students updated successfully",
      data: attendance,
    });

  } catch (error) {
    console.error("Mark Absent Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};