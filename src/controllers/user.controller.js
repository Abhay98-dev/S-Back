import User from "../models/user.model.js";


export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, subjects, uid, phone } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone Number and password are required",
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
    
    const normalizedPhone = phone.replace(/\D/g, "");
    //check is phone number already exists
    const existingPhone = await User.findOne({ phone: normalizedPhone });

    if(existingPhone){
      return res.status(400).json({
        success:false,
        message:"User with this phone number already exists"
      })
    }

/**
 * @desc   Admin creates teacher
 * @route  POST /api/users/create-teacher
 * @access Private (Admin)
 */
    // 3️⃣ Create teacher
    const teacher = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Will be hashed automatically
      phone: normalizedPhone,
      role: "teacher",
      subjects: subjects || [],
      uid,
      mustChangePassword: true,
    });

    return res.status(201).json(teacher);
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
    const { name, email, password, classId, uid,phone } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !email || !password || !classId || !uid || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password,Phone number, classId and uid are required",
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

    const normalizedPhone = phone.replace(/\D/g, "");

    const existingPhone = await User.findOne({ phone: normalizedPhone });

    if(existingPhone){
      return res.status(400).json({
        success:false,
        message:"User with this phone number already exists"
      })
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
      phone: normalizedPhone,
    });

    return res.status(201).json(student);

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

    res.json(teachers)

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
    res.json(students);

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

    res.json({
      message: "Deleted"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTeacherById = async (req, res) => {
  const teacher = await User.findById(req.params.id).select("-password");
  res.json(teacher);
};

export const updateTeacher = async (req, res) => {
  const teacher = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(teacher);
};

export const getStudentById = async (req, res) => {
  const student = await User.findById(req.params.id)
    .select("-password")
    .populate("classId");
  res.json(student);
};

export const updateStudent = async (req, res) => {
  const student = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(student);
};