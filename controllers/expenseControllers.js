import mongoose from "mongoose";
import Expense from "../model/Expense.js";

// @desc    Get all expenses for current logged-in user
// @route   GET /api/expenses or GET /expense/getAll
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({
      date: -1,
      createdAt: -1,
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

// @desc    Get expense by ID
// @route   GET /api/expenses/:id or GET /expense/getById/:id
export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense ID", error: "Invalid expense ID" });
    }

    const expense = await Expense.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found", error: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses or POST /expense/create
export const createExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    if (!description || amount === undefined || amount === null || !category) {
      return res.status(400).json({
        message: "description, amount, and category are required fields",
        error: "Missing required fields",
      });
    }

    const expense = await Expense.create({
      description,
      amount: Number(amount),
      category,
      date: date || Date.now(),
      user: req.user.id,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

// @desc    Update expense by ID
// @route   PUT/PATCH /api/expenses/:id or PUT /expense/update/:id
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense ID", error: "Invalid expense ID" });
    }

    const updateData = { ...req.body };
    if (updateData.amount !== undefined) {
      updateData.amount = Number(updateData.amount);
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user.id },
      updateData,
      {
        new: true,
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found", error: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

// @desc    Delete expense by ID
// @route   DELETE /api/expenses/:id or DELETE /expense/delete/:id
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense ID", error: "Invalid expense ID" });
    }

    const expense = await Expense.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found", error: "Expense not found" });
    }
    res.json({ message: "Expense deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};
