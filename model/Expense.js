import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    __v: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
