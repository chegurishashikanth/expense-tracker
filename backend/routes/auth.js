const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protect = require('../middleware/auth');

const router = express.Router();

// Register a user
router.post("/register", async (req, res) => {
 const { name, email, password } = req.body;

 try {
   const existingUser = await User.findOne({ email });
   if (existingUser) {
     return res.status(400).json({ message: "User already exists" });
   }

   const user = await User.create({ name, email, password });
   res.status(201).json({ message: "User registered successfully" });
 } catch (error) {
   res.status(500).json({ message: "Server error", error });
 }
});

// Login a user
router.post("/login", async (req, res) => {
 const { email, password } = req.body;

 try {
   const user = await User.findOne({ email });
   if (!user) {
     return res.status(404).json({ message: "User not found" });
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
     return res.status(400).json({ message: "Invalid credentials" });
   }

   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
   res.status(200).json({ 
     token, 
     user: { 
       id: user._id, 
       name: user.name, 
       email: user.email 
     } 
   });
 } catch (error) {
   res.status(500).json({ message: "Server error", error });
 }
});

// Protected route to get user data
router.get('/user', protect, async (req, res) => {
 try {
   const user = await User.findById(req.user._id).select('-password');
   res.json(user);
 } catch (error) {
   res.status(500).json({ message: 'Server error' });
 }
});

module.exports = router;