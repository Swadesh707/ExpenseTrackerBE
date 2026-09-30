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

// Apply auth protection to all expense routes
router.use(protect);

// Standard RESTful CRUD routes
router.route("/").get(getAllExpenses).post(createExpense);
router
  .route("/:id")
  .get(getExpenseById)
  .put(updateExpense)
  .patch(updateExpense)
  .delete(deleteExpense);

// Backward-compatible action-based aliases
router.get("/getAll", getAllExpenses);
router.get("/getById/:id", getExpenseById);
router.post("/create", createExpense);
router.put("/update/:id", updateExpense);
router.patch("/update/:id", updateExpense);
router.delete("/delete/:id", deleteExpense);

export default router;
