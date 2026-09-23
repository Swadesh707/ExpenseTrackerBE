import Expense from "../model/Expense.js";


export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      {
        returnDocument: "after",
      }
    );
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
