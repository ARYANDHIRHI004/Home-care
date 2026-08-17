import mongoose from "mongoose";

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

export const sanitizeCustomerIdentity = (data = {}) => {
  const payload = { ...data };

  const normalizeOptionalUnique = (fieldName) => {
    const rawValue = payload[fieldName];
    const trimmedValue = typeof rawValue === "string" ? rawValue.trim() : rawValue;

    if (trimmedValue === undefined || trimmedValue === null || trimmedValue === "") {
      delete payload[fieldName];
      return;
    }

    payload[fieldName] = trimmedValue;
  };

  normalizeOptionalUnique("phone");
  normalizeOptionalUnique("email");

  if (typeof payload.email === "string") {
    payload.email = payload.email.toLowerCase();
  }

  return payload;
};

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Not required — a Google-only signup has no phone number to key on yet
    // (see the databaseHooks Google-sync fix in utils/auth.js, which upserts
    // by email instead when this is absent). `sparse` so multiple such
    // phone-less documents don't collide on the unique index the way two
    // literal nulls would.
    phone: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },

    // Also not required for the same reason, but unique+sparse so a Google
    // signup's real email can be the alternate key without colliding with
    // the many pre-existing customers that have no email at all.
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    // Google OAuth's profile picture URL — absent for OTP-only customers,
    // who fall back to an initial-letter avatar on the frontend instead.
    avatarUrl: {
      type: String,
      trim: true,
      default: null,
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

export const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
