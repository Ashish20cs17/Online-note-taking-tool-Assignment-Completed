const express = require("express");
const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working",
    received: req.query.msg || "No message sent"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
