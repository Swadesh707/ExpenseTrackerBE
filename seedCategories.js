import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./model/Category.js";

dotenv.config();

const categories = [
  { title: "Food & Dining", status: true },
  { title: "Transportation", status: true },
  { title: "Utilities", status: true },
  { title: "Entertainment", status: true },
  { title: "Shopping", status: true },
  { title: "Health", status: true },
  { title: "Other", status: true },
];

const seedDB = async () => {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      console.error("DB_URL is missing in .env");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(dbUrl);
    console.log("Connected successfully.");

    console.log("Clearing existing categories...");
    await Category.deleteMany({});

    console.log("Inserting categories...");
    const inserted = await Category.insertMany(categories);
    console.log(`Successfully inserted ${inserted.length} categories:`);
    inserted.forEach((cat) => console.log(` - ${cat.title} (ID: ${cat._id})`));

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB. Done!");
    process.exit(0);
  } catch (err) {
    console.error("Error populating database:", err);
    process.exit(1);
  }
};

seedDB();
