import Class from "../models/class.model.js";
import User from "../models/user.model.js";

/**
 * @desc   Admin creates class
 * @route  POST /api/classes
 * @access Private (Admin)
 */
export const createClass = async (req, res) => {
  try {
    const { name, section, standard } = req.body;

    if (!name || !section || !standard) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newClass = await Class.create({
      name,
      section,
      standard,
    });

    return res.status(201).json(newClass);

  } catch (error) {
    console.error("Create Class Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



/**
 * @desc   Assign teacher as class teacher
 * @route  PATCH /api/classes/:classId/assign-teacher
 * @access Private (Admin)
 */
export const assignClassTeacher = async (req, res) => {
  try {
    const { classId } = req.params;
    const { teacherId } = req.body;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "teacherId is required",
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

    // 2️⃣ Check teacher exists and role is teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID",
      });
    }

    // 3️⃣ Prevent teacher from being class teacher of multiple classes
    const alreadyAssigned = await Class.findOne({ classTeacher: teacherId });
    if (alreadyAssigned && alreadyAssigned._id.toString() !== classId) {
      return res.status(400).json({
        success: false,
        message: "This teacher is already assigned to another class",
      });
    }

    // 4️⃣ Assign teacher
    classData.classTeacher = teacherId;
    await classData.save();

    const updatedClass = await Class.findById(classId)
      .populate("classTeacher", "name email");

    return res.json(updatedClass);

  } catch (error) {
    console.error("Assign Class Teacher Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc   Get classes assigned to logged-in teacher
 * @route  GET /api/classes/my
 * @access Private (Teacher)
 */
export const getMyClasses = async (req, res) => {
  try {
    const teacherId = req.user.userId;

    const classes = await Class.find({
      $or: [
        { classTeacher: teacherId },
        { "subjectTeachers.teacher": teacherId },
      ],
    })
      .populate("classTeacher", "name email")
      .populate("subjectTeachers.teacher", "name email");

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });

  } catch (error) {
    console.error("Get My Classes Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc   Assign subject teacher to class
 * @route  PATCH /api/classes/:classId/assign-subject
 * @access Private (Admin)
 */
export const assignSubjectTeacher = async (req, res) => {
  try {
    const { classId } = req.params;
    const { subject, teacherId } = req.body;

    if (!subject || !teacherId) {
      return res.status(400).json({
        success: false,
        message: "subject and teacherId required",
      });
    }

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher",
      });
    }

    classData.subjectTeachers.push({
      subject,
      teacher: teacherId,
    });

    await classData.save();

    res.status(200).json({
      success: true,
      message: "Subject teacher assigned",
      data: classData,
    });

  } catch (error) {
    console.error("Assign Subject Teacher Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllClasses = async (req, res) => {
  const classes = await Class.find().populate("classTeacher", "name");
  res.json(classes);
};

export const getSingleClass = async (req, res) => {
  const cls = await Class.findById(req.params.id).populate("classTeacher");
  res.json(cls);
};

export const updateClass = async (req, res) => {
  const cls = await Class.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(cls);
};

export const deleteClass = async (req, res) => {
  await Class.findByIdAndDelete(req.params.id);
  res.json({ message: "Class deleted" });
};

export const removeTeacher = async (req, res) => {
  const cls = await Class.findByIdAndUpdate(
    req.params.classId,
    { classTeacher: null },
    { new: true }
  );
  res.json(cls);
};