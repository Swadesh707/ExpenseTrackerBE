import mongoose from "mongoose";
import Category from "../model/Category.js";

// @desc    Get all categories
// @route   GET /api/categories or GET /category
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id or GET /category/getById/:id
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID", error: "Invalid category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found", error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories or POST /category/create
export const createCategory = async (req, res) => {
  try {
    const { title, status = true } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Category title is required", error: "Category title is required" });
    }

    const category = await Category.create({
      title: title.trim(),
      status: status !== undefined ? status : true,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

// @desc    Update a category
// @route   PUT/PATCH /api/categories/:id or PUT /category/update/:id
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID", error: "Invalid category ID" });
    }

    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found", error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id or DELETE /category/delete/:id
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID", error: "Invalid category ID" });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found", error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};
