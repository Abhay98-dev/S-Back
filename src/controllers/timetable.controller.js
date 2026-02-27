import Timetable from "../models/timetable.model.js";

/**
 * @desc   Admin create/update timetable
 * @access Admin
 */
export const createOrUpdateTimetable = async (req, res) => {
  try {
    const { classId, week } = req.body;

    if (!classId || !week) {
      return res.status(400).json({
        success: false,
        message: "classId and week data required",
      });
    }

    let timetable = await Timetable.findOne({ classId });

    if (timetable) {
      timetable.week = week;
      await timetable.save();
    } else {
      timetable = await Timetable.create({
        classId,
        week,
      });
    }

    res.status(200).json({
      success: true,
      message: "Timetable saved successfully",
      data: timetable,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



/**
 * @desc   Student view own class timetable
 * @access Student
 */
export const getMyTimetable = async (req, res) => {
  try {
    const classId = req.user.classId;

    const timetable = await Timetable.findOne({ classId });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    res.status(200).json({
      success: true,
      data: timetable,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};