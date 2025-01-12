const express = require("express");
const Expense = require("../models/Expense");
const protect = require("../middleware/auth");
const router = express.Router();

// Add new expense
router.post("/", protect, async (req, res) => {
  try {
    const { name, date, amount, description } = req.body;
    const expense = await Expense.create({
      user: req.user.id,
      name,
      date,
      amount,
      description
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get user's expense entries
router.get("/", protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update expense
router.put("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete expense
router.delete("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;