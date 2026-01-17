process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Allow both common CRA ports.
 * Your current origin is http://localhost:5001 (per the error),
 * so we include it here.
 */
const allowedOrigins = ["http://localhost:3000", "http://localhost:5001"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl/postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));

const ENDPOINT = "https://models.github.ai/inference/chat/completions";
const MODEL = "openai/gpt-4.1";

// health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Ask AI (Lumi)
app.post("/api/ask-ai", async (req, res) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "Missing GITHUB_TOKEN in .env" });
    }

    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ error: "messages must be a non-empty array" });
    }

    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        top_p: 1,
      }),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      return res.status(502).json({
        error: data?.error?.message || `Upstream error (${r.status})`,
        details: data,
      });
    }

    const answer = data?.choices?.[0]?.message?.content ?? "";
    res.json({ answer });
  } catch (err) {
    console.error("Server error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ AI server running on http://localhost:${PORT}`);
});
