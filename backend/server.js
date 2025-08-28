app.use(express.json()); // already present with bodyParser

// Add this above your existing routes
app.post("/test", (req, res) => {
  const { promptText } = req.body;
  if (!promptText) return res.status(400).json({ success: false, error: "promptText missing" });

  res.json({
    success: true,
    output: `Received prompt: ${promptText}`
  });
});
