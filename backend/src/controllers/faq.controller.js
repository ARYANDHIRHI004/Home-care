import Faq from "../models/faq.model.js";
import { ROLE_PERMISSIONS } from "../constants/role-permissions.js";
import { PERMISSIONS as P } from "../constants/permissions.js";

// Same role-check requirePermission does, but usable inline here since this
// route is hit by both anonymous website visitors and authenticated office
// staff, and only one of them is allowed to see pending questions.
const canManageFaqs = (req) => {
  const roles = String(req.user?.role || "").split(",").map((r) => r.trim()).filter(Boolean);
  return roles.some((role) => (ROLE_PERMISSIONS[role] || []).includes(P.SETTINGS_MANAGE));
};

export const getFaqs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active !== undefined) filter.active = req.query.active === "true";
    if (req.query.category) filter.category = req.query.category;

    if (canManageFaqs(req)) {
      // Office staff manage the review queue — respect an explicit status
      // filter if given, otherwise show everything (published + pending).
      if (req.query.status) filter.status = req.query.status;
    } else {
      // Public visitors (and any other authenticated-but-unprivileged role)
      // never see a question that hasn't been reviewed and answered yet.
      filter.status = "published";
    }

    const faqs = await Faq.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public — no auth required. A website visitor suggests a question with no
// answer yet; it enters the review queue as 'pending' and is invisible to
// GET /api/faqs (and therefore the website's FAQ list) until an admin
// answers and publishes it via updateFaq.
export const suggestFaq = async (req, res) => {
  try {
    const { question, category, name, email } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ message: "question is required" });
    }

    const faq = await Faq.create({
      question: question.trim(),
      category: category || "General",
      status: "pending",
      active: false,
      submittedByName: name || null,
      submittedByEmail: email || null,
    });

    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFaq = async (req, res) => {
  try {
    // Office-authored FAQs are published immediately — distinct from
    // suggestFaq's pending review queue.
    const faq = await Faq.create({ ...req.body, status: "published" });
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    faq.active = !faq.active;
    await faq.save();
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json({ message: "FAQ deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
