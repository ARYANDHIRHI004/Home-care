import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model("Category", categorySchema);

export default Category;
