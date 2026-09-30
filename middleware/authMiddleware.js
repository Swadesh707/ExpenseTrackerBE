import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.headers["x-auth-token"]) {
      token = req.headers["x-auth-token"];
    } else if (req.headers.authorization) {
      token = req.headers.authorization;
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
        error: "Not authorized, token missing",
      });
    }

    const secret = process.env.JWT_SECRET || "expense_tracker_jwt_secret_key_default";
    const decoded = jwt.verify(token, secret);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid or expired token",
      error: error.message,
    });
  }
};

// Only allows users with role "admin"
export const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
        error: "Forbidden",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Server error checking admin role",
      error: error.message,
    });
  }
};
