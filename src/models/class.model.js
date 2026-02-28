import mongoose from "mongoose";

const subjectTeacherSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      required: true,
      trim: true,
    },

    standard: {
      type: Number,
      required: true,
    },

    // Only ONE class teacher allowed
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true, // 🔥 Enforce only one class per teacher
      sparse: true, // allows null values
      default: null,
    },

    // Multiple subject teachers allowed
    subjectTeachers: [subjectTeacherSchema],
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", classSchema);

export default Class;