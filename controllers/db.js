import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const dbUrl =
      process.env.DB_URL ||
      process.env.MONGODB_URI ||
      process.env.MONGO_URI;

    if (!dbUrl) {
      console.warn(
        "⚠️ Warning: DB_URL or MONGODB_URI is not defined in environment variables! Please set it for database connection."
      );
      return;
    }
    console.log("Connecting to MongoDB database...");
    await mongoose.connect(dbUrl);
    console.log("MongoDB connection successful!");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};