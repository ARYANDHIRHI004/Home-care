import mongoose from "mongoose";

const serviceAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      enum: ["Bhilai", "Durg"],
      required: true,
    },

    // Real addresses get typed inconsistently ("Smriti Nagar" vs "Smruti
    // Nagar" vs "Smriti Ngr") — matched case-insensitively alongside `name`,
    // not treated as a fuzzy hint.
    aliases: {
      type: [String],
      default: [],
    },

    // "All sector areas" isn't one locality (Bhilai has numbered sectors 1–10)
    // — a "sector" area matches any locality containing "Sector" + a number,
    // instead of one fixed string nothing would ever literally equal.
    matchType: {
      type: String,
      enum: ["exact", "sector"],
      default: "exact",
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

serviceAreaSchema.index({ name: 1 }, { unique: true });

export const ServiceArea = mongoose.model("ServiceArea", serviceAreaSchema);

export default ServiceArea;
