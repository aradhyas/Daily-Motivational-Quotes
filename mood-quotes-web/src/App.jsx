import { useEffect, useMemo, useState } from "react";
import "./index.css";
import confetti from "canvas-confetti";

const MOODS = [
  "happy","sad","anxious","angry","motivated","lonely","grateful","tired",
  "calm","stressed","curious","inspired","overwhelmed","hopeful","determined",
  "bored","nostalgic","confident","fearful","excited","peaceful","frustrated","burnt out","creative"
];
const MAX_SELECT = 3;
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8787";

const BUTTON_TEXTS = [
  "Ready to roll",
  "Hit me!",
  "Serve the vibes",
  "Spark me up",
  "Boost me",
  "Inspire me",
  "Let's go!"
];

function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#7dd3fc", "#a78bfa", "#f9a8d4", "#fde68a"],
  });
}

export default function App() {
  const [selected, setSelected] = useState([]);
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitNote, setLimitNote] = useState(false);

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
      fireConfetti(); // 🎉 right after we get the quote
    } catch {
      setQuote("⚠️ Error fetching quote.");
    } finally {
      setLoading(false);
    }
  }
  

  function clearSelection() {
    setSelected([]);
    setQuote("");
  }

  return (
    <div className="min-h-screen text-white px-6 py-12 relative">
      {/* floating sparkles */}
      <div className="sparkle" style={{left: "10%", bottom: "20%"}} />
      <div className="sparkle" style={{left: "25%", bottom: "15%", animationDelay: ".6s"}} />
      <div className="sparkle" style={{left: "70%", bottom: "25%", animationDelay: ".3s"}} />
      <div className="sparkle" style={{left: "85%", bottom: "12%", animationDelay: ".9s"}} />

      <div className="mx-auto w-full max-w-3xl">
        <header className="text-center">
          <div className="text-5xl md:text-6xl display font-bold tracking-tight">
            <span className="align-middle">✨</span> Feeling Moody?
          </div>
          <p className="mt-3 text-white/70">
            Pick up to <b>{MAX_SELECT}</b> emotions and get a tiny boost.
          </p>
        </header>

        {/* Chips */}
        <section className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {MOODS.map((m) => {
            const isActive = selected.includes(m);
            const atLimit = !isActive && selected.length >= MAX_SELECT;

            return (
              <button
                key={m}
                onClick={() => toggleMood(m)}
                aria-pressed={isActive}
                title={atLimit ? `You can select up to ${MAX_SELECT}` : `Toggle ${m}`}
                className={[
                  "w-full text-sm px-3 py-2 rounded-full border transition transform",
                  "backdrop-blur-sm",
                  isActive
                    ? "bg-white text-black border-transparent ring-2 ring-offset-0 ring-[#99f6e4]/70 shadow"
                    : "bg-white/10 border-white/15 hover:bg-white/15 hover:-translate-y-[1px]",
                  atLimit && "opacity-40 cursor-not-allowed hover:translate-y-0"
                ].join(" ")}
              >
                {m}
              </button>
            );
          })}
        </section>

        {/* Helper + clear */}
        <div className="mt-2 flex justify-between items-center text-sm">
          {limitNote ? (
            <span className="text-rose-300/90">Limit reached — pick at most {MAX_SELECT} moods.</span>
          ) : <span />}
          {selected.length > 0 && (
            <button onClick={clearSelection} className="text-white/70 hover:text-white">
              Clear selection ✕
            </button>
          )}
        </div>

        {/* CTA */}
        <div className="mt-6 flex justify-center">
            <button
              onClick={getQuote}
              disabled={loading || selected.length === 0}
              className="btn-shine px-7 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-violet-400 text-black font-semibold shadow-lg disabled:opacity-60"
            >
              {loading ? "Thinking…" : BUTTON_TEXTS[Math.floor(Math.random() * BUTTON_TEXTS.length)]}
            </button>
        </div>

        {/* Skeleton while loading */}
        {loading && (
          <div className="mt-10 glow-card animate-fade-up">
            <div className="inner p-6 rounded-[15px]">
              <div className="skeleton h-3 w-28 rounded mb-4"></div>
              <div className="skeleton h-7 w-full rounded mb-3"></div>
              <div className="skeleton h-7 w-5/6 rounded mb-3"></div>
              <div className="skeleton h-7 w-3/5 rounded"></div>
            </div>
          </div>
        )}

        {/* Quote card */}
        {!loading && quote && (
          <div key={quote} className="mt-10 glow-card animate-fade-up">
            <div className="inner p-6 md:p-7 rounded-[15px]">
              <p className="text-xs uppercase tracking-wide text-white/70">
                For: <span className="font-semibold text-white/90">{selectedStr}</span>
              </p>
              <div className="mt-3 text-2xl md:text-3xl leading-9 md:leading-[2.2rem]">
                {quote.split(" ").map((w, i) => (
                  <span key={i} className="inline-block mr-[6px] transition hover:text-sky-300 hover:-translate-y-0.5">
                    {w}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={getQuote}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15"
                >
                  Regenerate ↻
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-xs text-white/60">
          Made with ✨ · Colorful & minimal
        </footer>
      </div>
    </div>
  );
}
