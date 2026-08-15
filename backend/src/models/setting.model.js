import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    invoiceSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    whatsappSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    paymentSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
