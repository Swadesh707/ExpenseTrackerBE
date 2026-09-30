import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public reads – any authenticated or unauthenticated request can list categories
router.get("/", getCategories);
router.get("/getAll", getCategories);
router.get("/getById/:id", getCategoryById);
router.get("/:id", getCategoryById);

// Write operations – admin only
router.post("/", protect, adminOnly, createCategory);
router.post("/create", protect, adminOnly, createCategory);

router.put("/:id", protect, adminOnly, updateCategory);
router.put("/update/:id", protect, adminOnly, updateCategory);
router.patch("/:id", protect, adminOnly, updateCategory);
router.patch("/update/:id", protect, adminOnly, updateCategory);

router.delete("/:id", protect, adminOnly, deleteCategory);
router.delete("/delete/:id", protect, adminOnly, deleteCategory);

export default router;
