import Homework from "../models/homework.model.js";
import Class from "../models/class.model.js";

/**
 * @desc   Teacher creates homework
 * @route  POST /api/homework
 * @access Private (Teacher)
 */
export const createHomework = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const { classId, subject, title, description, dueDate } = req.body;

    if (!classId || !subject || !title || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const homework = await Homework.create({
      classId,
      subject,
      title,
      description,
      dueDate,
      teacher: teacherId,
    });

    res.status(201).json({
      success: true,
      message: "Homework created successfully",
      data: homework,
    });

  } catch (error) {
    console.error("Create Homework Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



/**
 * @desc   Student views homework of own class
 * @route  GET /api/homework/my
 * @access Private (Student)
 */
export const getMyHomework = async (req, res) => {
  try {
    const classId = req.user.classId;

    const homeworkList = await Homework.find({ classId })
      .populate("teacher", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: homeworkList.length,
      data: homeworkList,
    });

  } catch (error) {
    console.error("Get Homework Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};