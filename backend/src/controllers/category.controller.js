import Category from "../models/category.model.js";
import TermsAndCondition from "../models/termsAndCondition.model.js";

export const createCategory = async (req, res) => {
  const { name, slug, description, imageUrl, termsContent } = req.body;
  let newCategory;
  try {
    // Check if category name or slug already exists
    if (name) {
      const existingName = await Category.findOne({ name: name.trim() });
      if (existingName) {
        return res.status(400).json({ message: "Category name already exists" });
      }
    }
    if (slug) {
      const existingSlug = await Category.findOne({ slug: slug.trim() });
      if (existingSlug) {
        return res.status(400).json({ message: "Category slug already exists" });
      }
    }

    newCategory = await Category.create({ 
      name: name?.trim(), 
      slug: slug?.trim(), 
      description: description?.trim(), 
      imageUrl: imageUrl?.trim() 
    });

    await TermsAndCondition.create({
      categoryId: newCategory._id,
      content: termsContent || "Standard terms and conditions apply.",
      version: 1,
      active: true
    });

    // Return category with active terms populated
    const createdCategory = newCategory.toObject();
    createdCategory.terms = { version: 1, content: termsContent || "" };

    res.status(201).json(createdCategory);
  } catch (error) {
    if (newCategory) {
      await Category.findByIdAndDelete(newCategory._id);
    }
    res.status(400).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active !== undefined) filter.active = req.query.active === "true";
    const categories = await Category.find(filter).sort({ name: 1 }).lean();

    // Populate active terms for each category
    const categoriesWithTerms = await Promise.all(
      categories.map(async (cat) => {
        const activeTerms = await TermsAndCondition.findOne({ categoryId: cat._id, active: true }).lean();
        return {
          ...cat,
          terms: activeTerms ? { version: activeTerms.version, content: activeTerms.content } : null
        };
      })
    );

    res.json(categoriesWithTerms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) return res.status(404).json({ message: "Category not found" });

    const activeTerms = await TermsAndCondition.findOne({ categoryId: category._id, active: true }).lean();
    category.terms = activeTerms ? { version: activeTerms.version, content: activeTerms.content } : null;

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const { name, slug, description, imageUrl, termsContent, active } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Validate name/slug uniqueness if changed
    if (name && name.trim() !== category.name) {
      const existingName = await Category.findOne({ name: name.trim() });
      if (existingName) {
        return res.status(400).json({ message: "Category name already exists" });
      }
      category.name = name.trim();
    }

    if (slug && slug.trim() !== category.slug) {
      const existingSlug = await Category.findOne({ slug: slug.trim() });
      if (existingSlug) {
        return res.status(400).json({ message: "Category slug already exists" });
      }
      category.slug = slug.trim();
    }

    if (description !== undefined) category.description = description.trim();
    if (imageUrl !== undefined) category.imageUrl = imageUrl.trim();
    if (active !== undefined) category.active = Boolean(active);

    await category.save();

    // Version terms content if changed
    if (termsContent !== undefined) {
      const currentActive = await TermsAndCondition.findOne({ categoryId: category._id, active: true });
      
      if (!currentActive) {
        // If no active terms exist, create version 1
        await TermsAndCondition.create({
          categoryId: category._id,
          content: termsContent,
          version: 1,
          active: true
        });
      } else if (currentActive.content !== termsContent) {
        // Set old terms active to false
        currentActive.active = false;
        await currentActive.save();

        // Create new active version
        await TermsAndCondition.create({
          categoryId: category._id,
          content: termsContent,
          version: currentActive.version + 1,
          active: true
        });
      }
    }

    // Return updated category with its active terms
    const updatedCat = await Category.findById(category._id).lean();
    const activeTerms = await TermsAndCondition.findOne({ categoryId: category._id, active: true }).lean();
    updatedCat.terms = activeTerms ? { version: activeTerms.version, content: activeTerms.content } : null;

    res.json(updatedCat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    
    // Also remove terms associated with deleted category
    await TermsAndCondition.deleteMany({ categoryId: req.params.id });

    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
