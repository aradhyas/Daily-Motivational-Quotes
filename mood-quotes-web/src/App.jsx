import { useEffect, useMemo, useState } from "react";
import "./index.css";

const MOODS = [
  "happy","sad","anxious","angry","motivated","lonely","grateful","tired",
  "calm","stressed","curious","inspired","overwhelmed","hopeful","determined",
  "bored","nostalgic","confident","fearful","excited","peaceful","frustrated","burnt out","creative"
];
const MAX_SELECT = 3;
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8787";

export default function App() {
  const [selected, setSelected] = useState([]);
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitNote, setLimitNote] = useState(false);

  // persist selection so users remember even after refresh
  useEffect(() => {
    const saved = localStorage.getItem("moods");
    if (saved) setSelected(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("moods", JSON.stringify(selected));
  }, [selected]);

  const selectedStr = useMemo(
    () => (selected.length ? selected.join(", ") : "neutral"),
    [selected]
  );

  function toggleMood(m) {
    setLimitNote(false);
    setSelected((prev) => {
      if (prev.includes(m)) return prev.filter((x) => x !== m);
      if (prev.length >= MAX_SELECT) { setLimitNote(true); return prev; }
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
    <div className="min-h-screen bg-neutral-50 text-neutral-900 px-6 py-12">
      <div className="mx-auto w-full max-w-3xl">
        <header className="text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Mood Quotes
          </h1>
          <p className="mt-2 text-sm md:text-base text-neutral-500">
            Pick up to <b>{MAX_SELECT}</b> emotions and get a tiny boost.
          </p>
        </header>

        {/* Mood chips */}
        <section className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {MOODS.map((m) => {
            const isActive = selected.includes(m);
            const atLimit = !isActive && selected.length >= MAX_SELECT;
            return (
              <button
                key={m}
                onClick={() => toggleMood(m)}
                className={[
                  "w-full text-sm px-3 py-2 rounded-full border transition",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/50",
                  isActive
                    ? "bg-white border-neutral-900 text-neutral-900 ring-1 ring-neutral-900 shadow-sm"
                    : "bg-neutral-100 border-neutral-300 hover:bg-white hover:border-neutral-400",
                  atLimit && "opacity-40 cursor-not-allowed hover:bg-neutral-100 hover:border-neutral-300",
                ].join(" ")}
                aria-pressed={isActive}
                title={atLimit ? `You can select up to ${MAX_SELECT}` : `Toggle ${m}`}
              >
                {m}
              </button>
            );
          })}
        </section>

        {/* Helper note */}
        <div className="h-6 mt-2 text-center">
          {limitNote && (
            <span className="text-xs text-red-500">
              Limit reached — pick at most {MAX_SELECT} moods.
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={getQuote}
            disabled={loading || selected.length === 0}
            className="px-6 py-3 rounded-xl bg-neutral-900 text-white disabled:opacity-50 hover:bg-black transition"
          >
            {loading ? "Thinking…" : "Get Quote"}
          </button>
        </div>

        {/* Result card */}
        {quote && (
          <div className="mt-8 border border-neutral-200 rounded-2xl bg-white p-6">
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              For: <span className="font-medium text-neutral-700">{selectedStr}</span>
            </p>
            <p className="mt-3 text-2xl md:text-3xl leading-snug">
              {quote}
            </p>
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-neutral-400">
          Made with care · Minimal design
        </footer>
      </div>
    </div>
  );
}
