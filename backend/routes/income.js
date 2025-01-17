const express = require("express");
const Income = require("../models/Income");
const protect = require("../middleware/auth");
const router = express.Router();

// Add new income
router.post("/", protect, async (req, res) => {
  try {
    const { name, date, amount, description } = req.body;
    const income = await Income.create({
      user: req.user.id,
      name,
      date,
      amount,
      description
    });
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get user's income entries
router.get("/", protect, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update income
router.put("/:id", protect, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    
    if (income.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedIncome);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete income
router.delete("/:id", protect, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    
    if (income.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await income.deleteOne();
    res.json({ message: "Income removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;