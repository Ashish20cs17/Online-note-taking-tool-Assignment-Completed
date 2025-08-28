

const axios = require("axios");

const getGeminiResponse = async (req, res) => {
  try {
    const { noteContent } = req.body; // this must match frontend JSON

    if (!noteContent) {
      return res.status(400).json({ success: false, error: "noteContent is required" });
    }

    const model = "text-bison-001";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateText?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(url, {
      prompt: { text: noteContent },
      temperature: 0.7,
      maxOutputTokens: 100
    });

    const aiText = response.data?.candidates?.[0]?.output || "No response from Gemini";
    res.json({ success: true, summary: aiText });

  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
};

module.exports = { getGeminiResponse };


