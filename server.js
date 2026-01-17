process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Dacă vrei TOT pe Render (același domeniu), CORS nu e necesar pentru production.
 * Îl lăsăm doar pentru dev local.
 */
const allowedOrigins = ["http://localhost:3000", "http://localhost:5001", "https://lexnova.onrender.com"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (curl/postman)
      if (!origin) return callback(null, true);

      // allow dev origins
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // IMPORTANT: same-origin requests on Render won't send an Origin that needs CORS,
      // but some browsers/tools might. If you want to allow your Render domain too,
      // add it here, e.g. "https://lexnova.onrender.com"

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));

const ENDPOINT = "https://models.github.ai/inference/chat/completions";
const MODEL = "openai/gpt-4.1";

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Ask AI (Lumi)
app.post("/api/ask-ai", async (req, res) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "Missing GITHUB_TOKEN in Render env vars" });
    }

    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages must be a non-empty array" });
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
    return res.json({ answer });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

/**
 * ✅ Serve React build on Render
 */
app.use(express.static(path.join(__dirname, "build")));

/**
 * ✅ IMPORTANT: don't let the React fallback hijack /api routes.
 * Anything that is NOT /api -> React index.html
 */
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

/**
 * ✅ Ensure /api errors always return JSON (so frontend won't crash on res.json()).
 */
app.use((err, req, res, next) => {
  if (req.path && req.path.startsWith("/api")) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
  next(err);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
