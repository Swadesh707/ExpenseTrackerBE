import express from "express";
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseControllers.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/getAll", getAllExpenses);
router.get("/getById/:id", getExpenseById);
router.post("/create", createExpense);
router.put("/update/:id", updateExpense);
router.delete("/delete/:id", deleteExpense);

export default router;
