import TermsAndCondition from "../models/termsAndCondition.model.js";

export const createTerms = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const latest = await TermsAndCondition.findOne({ categoryId })
      .sort({ version: -1 });

    const version = latest ? latest.version + 1 : 1;

    await TermsAndCondition.updateMany(
      { categoryId, active: true },
      { active: false }
    );

    const terms = await TermsAndCondition.create({
      ...req.body,
      version,
      active: true,
    });

    res.status(201).json(terms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTerms = async (req, res) => {
  try {
    const filter = {};
    if (req.query.categoryId) filter.categoryId = req.query.categoryId;
    if (req.query.active !== undefined) filter.active = req.query.active === "true";

    res.json(
      await TermsAndCondition.find(filter)
        .populate("categoryId", "name")
        .populate("createdBy", "name email")
        .sort({ categoryId: 1, version: -1 })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveTermsByCategory = async (req, res) => {
  try {
    const terms = await TermsAndCondition.findOne({
      categoryId: req.params.categoryId,
      active: true,
    }).populate("categoryId", "name");

    if (!terms)
      return res.status(404).json({ message: "Active terms not found" });

    res.json(terms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTermsById = async (req, res) => {
  try {
    const terms = await TermsAndCondition.findById(req.params.id)
      .populate("categoryId", "name")
      .populate("createdBy", "name email");

    if (!terms) return res.status(404).json({ message: "Terms not found" });
    res.json(terms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTerms = async (req, res) => {
  res.status(400).json({
    message: "Terms are versioned. Create a new version instead of overwriting an existing version.",
  });
};

export const activateTerms = async (req, res) => {
  try {
    const terms = await TermsAndCondition.findById(req.params.id);
    if (!terms) return res.status(404).json({ message: "Terms not found" });

    await TermsAndCondition.updateMany(
      { categoryId: terms.categoryId, active: true },
      { active: false }
    );

    terms.active = true;
    await terms.save();

    res.json(terms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
