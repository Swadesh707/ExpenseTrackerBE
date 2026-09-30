import jwt from "jsonwebtoken";
import User from "../model/User.js";

const getJwtSecret = () => {
  return process.env.JWT_SECRET || "expense_tracker_jwt_secret_key_default";
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getJwtSecret(), {
    expiresIn: "30d",
  });
};

// Helper: clean user object to return in responses
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "user",
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password",
        error: "Missing required fields",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use",
        error: "Email already in use",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: "user", // always register as regular user
    });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password",
        error: "Missing credentials",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        error: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: "User not found",
      });
    }

    res.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};
