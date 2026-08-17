import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    // Not required — a customer-submitted question (see suggestFaq) starts
    // with no answer at all; office staff write one before publishing.
    answer: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },

    // Distinguishes an office-authored FAQ (published immediately, the
    // original flow) from a customer-submitted question awaiting review.
    // Public GET /api/faqs always filters to 'published' — a pending
    // question is never visible on the website until an admin answers and
    // publishes it.
    status: {
      type: String,
      enum: ["pending", "published"],
      default: "published",
      index: true,
    },

    // Only set for customer-submitted questions — optional, since the
    // public FAQ page's suggestion form doesn't require the visitor to be
    // logged in.
    submittedByName: {
      type: String,
      trim: true,
      default: null,
    },
    submittedByEmail: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Faq = mongoose.model("Faq", faqSchema);

export default Faq;
