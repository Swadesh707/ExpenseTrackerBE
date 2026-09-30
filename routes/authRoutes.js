import express from "express";
import { register, login, logout, getMe } from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Profile / Current User endpoints
router.get("/me", protect, getMe);
router.get("/profile", protect, getMe);
router.get("/user", protect, getMe);

export default router;
