const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB Atlas

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/income", require("./routes/income"));
app.use("/api/expense", require("./routes/expense"));

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Use the integrated auth routes
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
