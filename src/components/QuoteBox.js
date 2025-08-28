import React, { useEffect, useState, useCallback } from "react";
import { fetchQuote } from "../services/api";

/**
 * QuoteBox:
 * - attempts to fetch quotes from external API via services/api.js
 * - if API fails or DNS blocked, cycles through fallback quotes every 3 seconds
 * - small fade animation via CSS class .quote-text
 */

const fallbackQuotes = [
  "Keep going, you're doing great! 🚀",
  "Believe in yourself, you got this 💪",
  "Small steps lead to big success 🌱",
  "Every expert was once a beginner 🌟",
  "Dream it. Do it. 💡",
  "Stay positive, work hard, make it happen ✨"
];

const QuoteBox = () => {
  const [quote, setQuote] = useState(fallbackQuotes[0]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const loadQuote = useCallback(async () => {
    try {
      const q = await fetchQuote();
      setQuote(q);
    } catch (e) {
      // use fallback rotated value
      setQuote(fallbackQuotes[(index + 1) % fallbackQuotes.length]);
      setIndex((i) => i + 1);
    }
    // trigger fade animation
    setFade(true);
    setTimeout(() => setFade(false), 700);
  }, [index]);

  useEffect(() => {
    loadQuote(); // initial
    const id = setInterval(loadQuote, 3000); // every 3 seconds
    return () => clearInterval(id);
  }, [loadQuote]);

  return (
    <div className="quote-box">
      <h3>✨ Inspiration</h3>
      <p className={`quote-text ${fade ? "fade" : ""}`}>{quote}</p>
    </div>
  );
};

export default QuoteBox;
