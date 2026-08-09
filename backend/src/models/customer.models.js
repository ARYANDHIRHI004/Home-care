const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
    },
    addressText: {
      type: String,
      required: true,
      trim: true,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    placeId: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
    },
  },
  { _id: true }
);

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

const customerSchema = new mongoose.Schema(
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

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },

    registrationChannel: {
      type: String,
      enum: [
        "website",
        "call",
        "whatsapp",
        "facebook",
        "instagram",
      ],
      required: true,
    },

    addresses: [addressSchema],

    totalBilling: {
      type: Number,
      default: 0,
      min: 0,
    },

    feedbackAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    documents: [documentSchema],
  },
  {
    timestamps: true,
  }
);

customerSchema.index({
  "addresses.location": "2dsphere",
});

module.exports = mongoose.model("Customer", customerSchema);
