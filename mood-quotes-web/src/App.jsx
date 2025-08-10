import { useMemo, useState } from "react";
import "./index.css";

const MOODS = ["happy", "sad", "anxious", "angry", "motivated", "lonely", "grateful", "tired"];
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8787"; // change to your deployed URL later

export default function App() {
  const [selected, setSelected] = useState([]);   // ← multi-select
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitNote, setLimitNote] = useState(false);

  const selectedStr = useMemo(
    () => (selected.length ? selected.join(", ") : "neutral"),
    [selected]
  );

  function toggleMood(m) {
    setLimitNote(false);
    setSelected((prev) => {
      // remove if already selected
      if (prev.includes(m)) return prev.filter((x) => x !== m);
      // cap at 3
      if (prev.length >= 3) {
        setLimitNote(true);
        return prev;
      }
      return [...prev, m];
    });
  }

  async function getQuote() {
    setLoading(true);
    setQuote("");
    try {
      const res = await fetch(`${API_BASE}/quote?mood=${encodeURIComponent(selectedStr)}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setQuote(data.quote || "Keep going. Your next step matters most.");
    } catch (e) {
      setQuote("⚠️ Error fetching quote.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white px-6 py-12">
      <div className="mx-auto w-full max-w-3xl">
        <header className="text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            🌤️ Mood‑Based Quote Generator
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/70">
            Pick up to <b>three</b> moods and get a tiny boost.
          </p>
        </header>

        {/* Mood chips */}
        <section className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
          {MOODS.map((m) => {
            const isActive = selected.includes(m);
            const atLimit = !isActive && selected.length >= 3;
            return (
              <button
                key={m}
                onClick={() => toggleMood(m)}
                className={[
                  "px-4 py-2 rounded-full border transition-all select-none",
                  "border-white/15 bg-white/5 text-white backdrop-blur-sm",
                  "hover:border-white/40 hover:bg-white/10 hover:-translate-y-[1px]",
                  isActive && "bg-white text-black font-semibold shadow-md",
                  atLimit && "opacity-40 cursor-not-allowed hover:translate-y-0",
                ].join(" ")}
                aria-pressed={isActive}
                title={atLimit ? "You can select up to 3 moods" : `Toggle ${m}`}
              >
                {m}
              </button>
            );
          })}
        </section>

        {/* Helper note */}
        <div className="h-6 mt-2 text-center">
          {limitNote && (
            <span className="text-xs text-red-300">Limit reached — pick at most 3 moods.</span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={getQuote}
            disabled={loading || selected.length === 0}
            className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 shadow-lg transition"
          >
            {loading ? "Thinking…" : "Get Quote"}
          </button>
        </div>

        {/* Result card */}
        {quote && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-7 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-white/60">
              For: <span className="font-semibold text-white/80">{selectedStr}</span>
            </p>

            {/* Hover effect on each word */}
            <div className="mt-3 text-2xl md:text-3xl leading-9 md:leading-[2.2rem] flex flex-wrap gap-x-1">
              {quote.split(" ").map((w, i) => (
                <span
                  key={i}
                  className="inline-block transition-all hover:text-blue-300 hover:underline hover:-translate-y-0.5"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-white/50">
          <span>Made with ❤️ for good vibes</span>
        </footer>
      </div>
    </div>
  );
}
