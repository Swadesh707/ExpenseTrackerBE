import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/adminControllers.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
