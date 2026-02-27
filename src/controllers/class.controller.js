import Class from "../models/class.model.js";

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

    return res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: newClass,
    });

  } catch (error) {
    console.error("Create Class Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};