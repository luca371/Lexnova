// AskAI.jsx
import "./AskAI.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function AskAI() {
  const [input, setInput] = useState("");
  const [thread, setThread] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // NEW: short "speaking pulse" after assistant message arrives
  const [speakingPulse, setSpeakingPulse] = useState(false);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);
  const canClear = useMemo(() => thread.length > 0 && !loading, [thread.length, loading]);

  // auto focus
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread, loading]);

  // Auto-resize textarea (smooth + stable)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 140);
    el.style.height = next + "px";
  }, [input]);

  function triggerPulse(ms = 900) {
    setSpeakingPulse(true);
    window.setTimeout(() => setSpeakingPulse(false), ms);
  }

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // Build next thread based on current state
    const nextThread = [...thread, { role: "user", content: trimmed }];

    // Optimistically update UI
    setThread(nextThread);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://lexnova.onrender.com/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "Ești Lumi, un asistent AI pentru studenți la drept. Răspunde clar, structurat, în română. Dacă lipsește context, pune 1 întrebare scurtă."
            },
            ...nextThread
          ]
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "AI request failed");

      setThread((prev) => [...prev, { role: "assistant", content: data.answer }]);

      // NEW: pulse when answer lands (agent-like)
      triggerPulse(900);
    } catch (err) {
      console.error(err);
      setThread((prev) => [
        ...prev,
        { role: "assistant", content: "Eroare la AI. Verifică serverul și token-ul, apoi încearcă din nou." }
      ]);

      // optional: small pulse on error too
      triggerPulse(650);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!canSend) return;
    sendMessage(input);
  }

  function onKeyDown(e) {
    // Enter sends; Shift+Enter newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) sendMessage(input);
    }
  }

  async function copyToClipboard(text, index) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 900);
    } catch {
      // no-op
    }
  }

  function clearChat() {
    setThread([]);
    setInput("");
    textareaRef.current?.focus();
  }

  const isSpeaking = loading || speakingPulse;

  return (
    <div className="ask-container">
      <div className="ask-card">
        <div className="ask-header">
          <div className="ask-header-top">
            <button
              className="ask-back"
              onClick={() => navigate("/start")}
              aria-label="Înapoi"
            >
              ← Înapoi
            </button>

            <span className="ask-brand">LEXNOVA</span>

            <button
              className="ask-clear"
              type="button"
              onClick={clearChat}
              disabled={!canClear}
            >
              Sterge
            </button>
          </div>

          {/* NEW: Planet agent header */}
          {/* NEW: planet only (no text) */}
          {/* Planet only (no text, no mouth) */}
          <div className="ask-planet-wrap" aria-label="Lumi agent">
            <div
              className={`ask-planet-big ${isSpeaking ? "is-speaking" : ""}`}
              aria-label="Lumi"
              role="img"
            >
              <div className="ask-planet-surface" />
              <div className="ask-planet-highlight" />
              <div className="ask-planet-shadow" />
            </div>
          </div>
        </div>

        <div className="ask-chat">
          {thread.length === 0 && (
            <div className="ask-empty">
              <div className="ask-empty-title">Idei rapide</div>
              <div className="ask-empty-list">
                <span>• „Explică diferența dintre nulitate absolută și relativă.”</span>
                <span>• „Fă-mi 5 grile despre contracte.”</span>
                <span>• „Dă-mi un rezumat pe capitole la drept civil.”</span>
              </div>
            </div>
          )}

          {thread.map((m, i) => (
            <div key={i} className={`ask-row ${m.role}`}>
              <div className={`ask-bubble ${m.role}`}>{m.content}</div>

              {m.role === "assistant" && (
                <div className="ask-actions-row">
                  <button
                    type="button"
                    className="ask-mini"
                    onClick={() => copyToClipboard(m.content, i)}
                  >
                    {copiedIndex === i ? "Copiat!" : "Copiaza"}
                  </button>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="ask-row assistant">
              <div className="ask-bubble assistant ask-typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form className="ask-form" onSubmit={onSubmit}>
          <div className="ask-input-wrap">
            <textarea
              ref={textareaRef}
              className="ask-input"
              placeholder="Scrie întrebarea ta… (Enter = trimite, Shift+Enter = rând nou)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
            />
          </div>

          <button className="ask-send" disabled={!canSend}>
            {loading ? "..." : "Trimite"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AskAI;
