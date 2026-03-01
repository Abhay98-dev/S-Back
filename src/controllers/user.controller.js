import User from "../models/user.model.js";

/**
 * @desc   Admin creates teacher
 * @route  POST /api/users/create-teacher
 * @access Private (Admin)
 */
export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, subjects, uid } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // 2️⃣ Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // 3️⃣ Create teacher
    const teacher = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Will be hashed automatically
      role: "teacher",
      subjects: subjects || [],
      uid,
      mustChangePassword: true,
    });

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        subjects: teacher.subjects,
      },
    });
  } catch (error) {
    console.error("Create Teacher Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc   Admin creates student
 * @route  POST /api/users/create-student
 * @access Private (Admin)
 */
export const createStudent = async (req, res) => {
  try {
    const { name, email, password, classId, uid } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !email || !password || !classId || !uid) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, classId and uid are required",
      });
    }

    // 2️⃣ Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // 3️⃣ Create student
    const student = await User.create({
      name,
      email: email.toLowerCase(),
      password, // auto hashed
      role: "student",
      classId,
      uid,
      subjects: [], // students don't have subjects
      mustChangePassword: true,
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        classId: student.classId,
        uid: student.uid,
      },
    });

  } catch (error) {
    console.error("Create Student Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .populate("classId", "name section")
      .sort({ createdAt: -1 });

    console.log("Fetched Students:", students);  
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};