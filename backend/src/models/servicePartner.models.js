import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    days: {
      type: [String],
      default: [],
    },

    hours: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const servicePartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
      index: true,
    },

    documents: [documentSchema],

    availability: {
      type: availabilitySchema,
      default: () => ({}),
    },

    jobHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],

    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
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

export const ServicePartner = mongoose.model(
  "ServicePartner",
  servicePartnerSchema
);
