import express from "express";
import {
  getCategories,
} from "../controllers/categoryControllers.js";

const router = express.Router();


router.get("/", getCategories);
router.get("/getAll", getCategories);
// router.post("/", createCategory);
// router.post("/create", createCategory);
// router.put("/:id", updateCategory);
// router.put("/update/:id", updateCategory);
// router.delete("/:id", deleteCategory);
// router.delete("/delete/:id", deleteCategory);

export default router;
