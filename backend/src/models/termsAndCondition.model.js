import mongoose from "mongoose";

const termsAndConditionSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    title: { type: String, trim: true },
    content: { type: String, required: true },
    version: { type: Number, default: 1 },
    active: { type: Boolean, default: true, index: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const TermsAndCondition = mongoose.model("TermsAndCondition", termsAndConditionSchema);
export default TermsAndCondition;
