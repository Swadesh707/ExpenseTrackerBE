import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./controllers/db.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/expense", expenseRoutes);
app.use("/category", categoryRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:8000`);
  });
});

export default app;
