const express = require("express");
const { getGeminiResponse } = require("../controllers/geminiController");
const router = express.Router();

router.post("/generate", getGeminiResponse);

module.exports = router;









//yes