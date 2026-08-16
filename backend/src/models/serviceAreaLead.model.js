import mongoose from "mongoose";

// A bounced "we don't serve your area yet" visitor who left contact info —
// low-effort capture so an expansion into their locality has someone to notify.
const serviceAreaLeadSchema = new mongoose.Schema(
  {
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    locality: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ServiceAreaLead = mongoose.model("ServiceAreaLead", serviceAreaLeadSchema);

export default ServiceAreaLead;
