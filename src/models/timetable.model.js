import mongoose from "mongoose";

const periodSchema = new mongoose.Schema({
  periodNumber: Number,
  subject: String,
  teacherName: String,
  startTime: String,
  endTime: String,
});

const timetableSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      unique: true, // only one timetable per class
    },

    week: {
      Monday: [periodSchema],
      Tuesday: [periodSchema],
      Wednesday: [periodSchema],
      Thursday: [periodSchema],
      Friday: [periodSchema],
      Saturday: [periodSchema],
    },
  },
  { timestamps: true }
);

const Timetable = mongoose.model("Timetable", timetableSchema);

export default Timetable;