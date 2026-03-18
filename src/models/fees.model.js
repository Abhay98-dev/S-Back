import mongoose from "mongoose";

const feesSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalFees: {
      type: Number,
      required: true,
    },
    paid: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Virtual field for due amount
feesSchema.virtual("due").get(function () {
  return this.totalFees - this.paid;
});

const Fees = mongoose.model("Fees", feesSchema);

export default Fees;