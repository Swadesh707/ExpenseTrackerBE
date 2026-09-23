import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      console.error("DB_URL is not defined in environment variables!");
      return;
    }
    console.log("Connecting to MongoDB database...");
    await mongoose.connect(dbUrl);
    console.log("MongoDB connection successful!");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};