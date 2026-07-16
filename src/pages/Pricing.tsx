import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { GlobalHeader } from "@/components/GlobalHeader";

// ============================================================================
// Tunable constants — update once real figures land.
// ============================================================================
const SEAT = 35; // £ per person per month
const MIN_SEATS = 2;
const SIMPLE = 0.02; // £ per simple document
const COMPLEX = 0.10; // £ per complex document
const MIX_COMPLEX_RATIO = 1 / 5; // 1 complex in every 5 documents
const BLENDED = SIMPLE * (1 - MIX_COMPLEX_RATIO) + COMPLEX * MIX_COMPLEX_RATIO; // ~£0.036
const HANDOFF = 500; // documents threshold for personal quote

// ============================================================================
// Design tokens (scoped to this page via inline style vars).
// Deep pine-ink, paper, antique brass — calm British professional-services feel.
// ============================================================================
const TOKENS = {
  ink: "#2A1758", // deep brand purple (replaces pine-ink)
  paper: "#FFFFFF",
  paperSoft: "#FAF8FF",
  brass: "#F97316", // brand-orange
  brassLight: "#FB923C",
  primary: "#8B5CF6", // brand primary purple
  primaryLight: "#A78BFA",
  card: "#FFFFFF",
  inkSoft: "rgba(42,23,88,0.85)",
  inkMuted: "rgba(42,23,88,0.75)",
  hairline: "rgba(42,23,88,0.12)",
  hairlineDark: "rgba(251,146,60,0.28)",
};

const FONTS = {
  serif: "'Fraunces', 'Cormorant Garamond', Georgia, serif",
  sans: "'Hanken Grotesk', 'Inter', system-ui, sans-serif",
  mono: "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace",
};

// ---- helpers ----------------------------------------------------------------
const fmtGBP = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
const fmtGBP2 = (n: number) =>
  `£${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const roundNice = (n: number) => {
  if (n < 20) return Math.round(n);
  if (n < 100) return Math.round(n);
  return Math.round(n / 5) * 5;
};


// ============================================================================
// Reusable bits
// ============================================================================
const Pill: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 12px",
      borderRadius: 999,
      border: `1px solid ${dark ? TOKENS.hairlineDark : TOKENS.hairline}`,
      background: dark ? "rgba(251,146,60,0.08)" : "rgba(255,255,255,0.6)",
      color: dark ? TOKENS.brassLight : TOKENS.ink,
      fontFamily: FONTS.mono,
      fontSize: 12,
      letterSpacing: "0.02em",
    }}
  >
    {children}
  </span>
);

const SectionLabel: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <div
    style={{
      fontFamily: FONTS.mono,
      fontSize: 11,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: dark ? TOKENS.brassLight : TOKENS.brass,
      marginBottom: 12,
    }}
  >
    {children}
  </div>
);

const H2: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <h2
    style={{
      fontFamily: FONTS.serif,
      fontWeight: 400,
      fontSize: "clamp(1.9rem, 3.6vw, 2.75rem)",
      lineHeight: 1.1,
      letterSpacing: "-0.01em",
      color: dark ? TOKENS.paper : TOKENS.ink,
      margin: 0,
    }}
  >
    {children}
  </h2>
);

// ============================================================================
// Slider — accessible, brass thumb, monospace value.
// ============================================================================
const Slider: React.FC<{
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  id: string;
}> = ({ label, min, max, value, onChange, suffix, id }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
      <label htmlFor={id} style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: TOKENS.brass }}>
        {label}
      </label>
      <span style={{ fontFamily: FONTS.mono, fontSize: 20, color: TOKENS.ink }}>
        {value}
        {suffix ? ` ${suffix}` : ""}
      </span>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="hp-slider"
      style={{ width: "100%" }}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
    />
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONTS.mono, fontSize: 11, color: TOKENS.inkMuted, marginTop: 6 }}>
      <span>{min}</span>
      <span>{max}+</span>
    </div>
  </div>
);


// ============================================================================
// Section 3 — Calculators
// ============================================================================
const Calculators: React.FC = () => {
  const [people, setPeople] = useState(5);
  const [docs, setDocs] = useState(305);

  const billedSeats = Math.max(people, MIN_SEATS);
  const seatsMonthly = billedSeats * SEAT;
  const overflow = docs >= HANDOFF;

  const blendedEst = docs * BLENDED;
  const low = docs * SIMPLE;
  const high = docs * COMPLEX;

  const oneOffDisplay = overflow ? "a quote we'll confirm with you" : `around ${fmtGBP(roundNice(blendedEst))}`;

  return (
    <section
      id="calculator"
      style={{
        background: `radial-gradient(1200px 600px at 15% -10%, rgba(139,92,246,0.10), transparent 60%), radial-gradient(900px 500px at 100% 110%, rgba(249,115,22,0.10), transparent 60%), ${TOKENS.paperSoft}`,
        color: TOKENS.ink,
        padding: "clamp(72px, 9vw, 128px) 24px",
        borderTop: `1px solid ${TOKENS.hairline}`,
        borderBottom: `1px solid ${TOKENS.hairline}`,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ maxWidth: 720, marginBottom: 56, marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
          <H2>See what Hobson would cost.</H2>
          <p style={{ fontFamily: FONTS.sans, fontSize: 17, lineHeight: 1.6, color: TOKENS.inkSoft, marginTop: 16 }}>
            Slide, and see. Just an honest picture of what Hobson would cost your firm.
          </p>
        </div>


        {/* ============ SIDE-BY-SIDE: SEATS (hero) + LEARNING (supporting) ============ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "clamp(20px, 2.5vw, 32px)",
            alignItems: "stretch",
          }}
          className="hp-calc-grid"
        >
          {/* ---------- LEARNING (light supporting) ---------- */}
          <div
            style={{
              position: "relative",
              borderRadius: 28,
              padding: "clamp(32px, 3.5vw, 48px)",
              background: TOKENS.paper,
              border: `1px solid ${TOKENS.hairline}`,
              boxShadow: "0 8px 24px -16px rgba(42,23,88,0.15)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, background: TOKENS.brass, borderRadius: "28px 28px 0 0" }} />

            <div style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: "0.24em", color: TOKENS.brass, textTransform: "uppercase", marginBottom: 16 }}>
              Learning · one-off · upfront
            </div>
            <h3 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: "clamp(1.75rem, 2.8vw, 2.4rem)", lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0, color: TOKENS.ink }}>
              Teach Hobson your documents.{" "}
              <span style={{ fontStyle: "italic", color: TOKENS.brass }}>Once.</span>
            </h3>
            <p style={{ fontFamily: FONTS.sans, fontSize: 15, lineHeight: 1.6, color: TOKENS.inkSoft, marginTop: 16 }}>
              2–10p a document, read once and known for good. You approve a firm quote before the full read.
            </p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
              {["Read once", "Known for good", "Firm quote first"].map((t) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 999, background: "rgba(249,115,22,0.08)", border: `1px solid ${TOKENS.hairline}`, fontFamily: FONTS.mono, fontSize: 10.5, letterSpacing: "0.04em", color: TOKENS.ink }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: TOKENS.brass }} /> {t}
                </span>
              ))}
            </div>

            {/* Calculator block */}
            <div
              style={{
                marginTop: 28,
                background: TOKENS.paperSoft,
                border: `1px solid ${TOKENS.hairline}`,
                borderRadius: 18,
                padding: "clamp(22px, 2.4vw, 30px)",
              }}
            >
              <Slider id="docs" label="Documents" min={10} max={600} value={docs} onChange={setDocs} suffix="docs" />
              <div style={{ marginTop: 22, paddingTop: 20, borderTop: `1px solid ${TOKENS.hairline}` }}>
                {overflow ? (
                  <>
                    <div style={{ fontFamily: FONTS.serif, fontSize: "clamp(1.5rem, 2.6vw, 1.9rem)", lineHeight: 1.15, color: TOKENS.ink, fontStyle: "italic" }}>
                      Let's confirm together.
                    </div>
                    <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: TOKENS.inkSoft, marginTop: 10, lineHeight: 1.55 }}>
                      Above roughly {HANDOFF} documents we confirm the details with you personally.
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: TOKENS.inkMuted, marginBottom: 6, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      Estimate — one-off
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                      <div style={{ fontFamily: FONTS.serif, fontSize: "clamp(2.6rem, 4.8vw, 3.75rem)", lineHeight: 1, color: TOKENS.ink, letterSpacing: "-0.02em" }}>
                        {fmtGBP(roundNice(blendedEst))}
                      </div>
                      <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: TOKENS.brass }}>one-off</span>
                    </div>
                    <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: TOKENS.inkMuted, marginTop: 10 }}>
                      Range: {fmtGBP2(low)} — {fmtGBP2(high)}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ---------- SEATS (dark hero) ---------- */}
          <div
            style={{
              position: "relative",
              borderRadius: 28,
              padding: "clamp(32px, 3.5vw, 48px)",
              background: `linear-gradient(135deg, ${TOKENS.ink} 0%, #3B1F7A 60%, #4C2A9E 100%)`,
              color: TOKENS.paper,
              boxShadow: "0 40px 80px -30px rgba(42,23,88,0.45), 0 8px 24px -12px rgba(42,23,88,0.35)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ position: "absolute", top: 0, right: 0, width: 240, height: 240, background: `radial-gradient(circle at top right, rgba(249,115,22,0.35), transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, background: `linear-gradient(90deg, ${TOKENS.brass}, ${TOKENS.primaryLight}, ${TOKENS.brass})` }} />

            <div style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: "0.24em", color: TOKENS.brassLight, textTransform: "uppercase", marginBottom: 16, position: "relative" }}>
              Seats · monthly · what a seat gives you
            </div>
            <h3 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: "clamp(1.75rem, 2.8vw, 2.4rem)", lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0, color: TOKENS.paper, position: "relative" }}>
              Every person gets{" "}
              <span style={{ fontStyle: "italic", color: TOKENS.brassLight }}>their own</span>{" "}
              personal co-worker.
            </h3>
            <p style={{ fontFamily: FONTS.sans, fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.82)", marginTop: 16, position: "relative" }}>
              One Hobson per person. He learns how they work, remembers what matters, and stays ready for whatever they ask next.
            </p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20, position: "relative" }}>
              {["Unlimited questions", "Learns each person"].map((t) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", fontFamily: FONTS.mono, fontSize: 10.5, letterSpacing: "0.04em", color: "rgba(255,255,255,0.9)" }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: TOKENS.brass }} /> {t}
                </span>
              ))}
            </div>

            {/* Calculator block */}
            <div
              style={{
                marginTop: 28,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 18,
                padding: "clamp(22px, 2.4vw, 30px)",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                <label htmlFor="people" style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: TOKENS.brassLight }}>
                  How many people
                </label>
                <span style={{ fontFamily: FONTS.mono, fontSize: 20, color: TOKENS.paper }}>
                  {people} {people === 1 ? "person" : "people"}
                </span>
              </div>
              <input
                id="people"
                type="range"
                min={MIN_SEATS}
                max={30}
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                className="hp-slider hp-slider-dark"
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONTS.mono, fontSize: 10.5, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>
                <span>{MIN_SEATS}</span><span>30+</span>
              </div>

              <div style={{ marginTop: 22, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.14)" }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: "rgba(255,255,255,0.6)", marginBottom: 6, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {billedSeats} × £{SEAT} — every month{people <= MIN_SEATS ? " · Hobson starts at two seats" : ""}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontFamily: FONTS.serif, fontSize: "clamp(2.6rem, 4.8vw, 3.75rem)", lineHeight: 1, color: TOKENS.paper, letterSpacing: "-0.02em" }}>
                    {fmtGBP(seatsMonthly)}
                  </div>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: TOKENS.brassLight }}>/ month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* ============ TOGETHER STRIP ============ */}
        <div style={{ marginTop: 32, padding: "28px 32px", borderRadius: 20, background: `linear-gradient(135deg, rgba(249,115,22,0.08), rgba(139,92,246,0.06))`, border: `1px solid ${TOKENS.hairline}` }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: "0.24em", color: TOKENS.brass, textTransform: "uppercase", marginBottom: 10 }}>
            Together
          </div>
          <p style={{ fontFamily: FONTS.serif, fontSize: "clamp(1.2rem, 2.1vw, 1.55rem)", lineHeight: 1.5, color: TOKENS.ink, margin: 0 }}>
            A <span style={{ color: TOKENS.brass }}>{people}-person</span> firm with{" "}
            <span style={{ color: TOKENS.brass }}>{docs}{overflow ? "+" : ""} documents</span>:{" "}
            a one-off of {oneOffDisplay} to get started, then{" "}
            <span style={{ fontFamily: FONTS.mono, fontSize: "0.9em" }}>{fmtGBP(seatsMonthly)}/mo</span> ongoing.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hp-calc-grid { grid-template-columns: 1fr !important; }
        }
        .hp-slider-dark::-webkit-slider-runnable-track { background: rgba(255,255,255,0.18); }
        .hp-slider-dark::-moz-range-track { background: rgba(255,255,255,0.18); }
      `}</style>
    </section>
  );
};

// ============================================================================
// FAQ
// ============================================================================
const FAQS: Array<{ q: string; a: string }> = [
  { q: "Do you charge per question?", a: "No. Every seat comes with unlimited questions — ask Hobson as much as you like, across everything he's learned. We don't count what he does, so there's no meter running while you think." },
  { q: "Why is there no plan to choose?", a: "Because everyone gets the complete Hobson — there's no smaller version to sell. Your price is simply built from how many people use him and how many documents he learns. Nothing to compare, nothing to outgrow." },
  { q: "What does each person actually get?", a: "Their own co-worker. Hobson works alongside each person, learns how they like to work, and keeps their access, permissions and history separate and secure. It's one Hobson with one shared understanding of your documents — but he knows each of your people individually." },
  { q: "Why is the document price a range?", a: "Because a three-page notice and a three-hundred-page lease aren't the same job. Simple documents cost 2p, complex ones up to 10p. We estimate on a typical mix, then Hobson confirms the exact figure once he's seen how many of yours are complex — always inside the range you were shown." },
  { q: "Do I keep paying every time Hobson uses a document?", a: "No. Hobson reads each document once. After that he knows it for good — every question, calculation or check that touches it is free, forever. You pay for the one-time read, never for the knowing." },
  { q: "What happens when new documents arrive?", a: "They're just more learning, at the same 2–10p. A few new leases are handled without fuss. If a large batch arrives — a purchase, a data room — Hobson quotes it and waits for your approval before reading. It's never charged automatically." },
  { q: "Do I pay before I know the real cost?", a: "You approve a firm quote before the full read, and that quote always lands inside the range the estimate showed you. Hobson assesses your documents to price them accurately, but doesn't do the detailed, expensive read until you've said yes." },
  { q: "Can I add or remove people?", a: "Any time. Hobson starts at two seats (£70/month), then it's £35 for each additional person for their own co-worker and unlimited use. Add seats as your team grows, remove them when it doesn't — no lock-in." },
];

const TEAM: Array<{ name: string; role: string }> = [
  { name: "The Professor", role: "Understands leases & documents" },
  { name: "The Architect", role: "Understands the portfolio's structure" },
  { name: "The Inspector", role: "Keeps on top of compliance" },
  { name: "The Broker", role: "Understands people & organisations" },
  { name: "The Researcher", role: "Finds trusted external information" },
  { name: "The Bookkeeper", role: "Runs calculations & financial analysis" },
  { name: "The Communicator", role: "Connects to your other systems" },
  { name: "The Keeper", role: "Manages permissions & access" },
];




// ============================================================================
// Page
// ============================================================================
export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>Pricing — Hobson</title>
        <meta name="description" content="No plans. No credits. Nothing counted. Pay for seats and document learning — that's it." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Hanken+Grotesk:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </Helmet>

      {/* Page-scoped styles */}
      <style>{`
        .hp-page { background: ${TOKENS.paper}; color: ${TOKENS.ink}; font-family: ${FONTS.sans}; }
        .hp-page * { box-sizing: border-box; }
        .hp-reveal { opacity: 0; transform: translateY(12px); animation: hpRise .7s ease-out forwards; }
        @keyframes hpRise { to { opacity: 1; transform: none; } }
        .hp-lift { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        .hp-lift:hover { transform: translateY(-2px); box-shadow: 0 12px 32px -18px rgba(42,23,88,0.35); }
        .hp-slider { -webkit-appearance: none; appearance: none; height: 4px; background: rgba(251,146,60,0.22); border-radius: 999px; outline: none; }
        .hp-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: ${TOKENS.brassLight}; border: 3px solid ${TOKENS.ink}; box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: pointer; }
        .hp-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: ${TOKENS.brassLight}; border: 3px solid ${TOKENS.ink}; cursor: pointer; }
        .hp-slider:focus-visible::-webkit-slider-thumb { outline: 2px solid ${TOKENS.brassLight}; outline-offset: 3px; }
        .hp-btn { font-family: ${FONTS.mono}; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; padding: 14px 28px; border-radius: 999px; cursor: pointer; transition: all .25s ease; border: 1px solid transparent; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
        .hp-btn-brass { background: ${TOKENS.brass}; color: ${TOKENS.paper}; }
        .hp-btn-brass:hover { background: ${TOKENS.brassLight}; }
        .hp-btn-ghost { background: transparent; color: ${TOKENS.paper}; border-color: ${TOKENS.brassLight}; }
        .hp-btn-ghost:hover { background: rgba(251,146,60,0.1); }
        .hp-btn:focus-visible { outline: 2px solid ${TOKENS.brassLight}; outline-offset: 3px; }
        details.hp-faq { border-top: 1px solid ${TOKENS.hairline}; padding: 22px 0; }
        details.hp-faq:last-of-type { border-bottom: 1px solid ${TOKENS.hairline}; }
        details.hp-faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 24px; font-family: ${FONTS.serif}; font-size: 1.15rem; color: ${TOKENS.ink}; }
        details.hp-faq summary::-webkit-details-marker { display: none; }
        details.hp-faq summary .hp-plus { font-family: ${FONTS.mono}; color: ${TOKENS.brass}; transition: transform .25s ease; flex-shrink: 0; }
        details.hp-faq[open] summary .hp-plus { transform: rotate(45deg); }
        details.hp-faq p { font-family: ${FONTS.sans}; font-size: 15.5px; line-height: 1.65; color: ${TOKENS.inkSoft}; margin: 16px 0 0; max-width: 68ch; }
        @media (prefers-reduced-motion: reduce) {
          .hp-reveal, .hp-lift, details.hp-faq summary .hp-plus { animation: none !important; transition: none !important; transform: none !important; }
        }
      `}</style>

      
      <GlobalHeader />

      <main className="hp-page">






        {/* ---------------- Section 3 — Calculators ---------------- */}
        <Calculators />

        {/* ---------------- Section 4 — Enterprise talk-to-us ---------------- */}
        <section style={{ padding: "clamp(72px, 10vw, 140px) 24px clamp(36px, 5vw, 64px)", borderTop: `1px solid ${TOKENS.hairline}` }}>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: "0.14em", color: TOKENS.brass, marginBottom: 20 }}>
              ENTERPRISE
            </div>
            <h2 style={{ fontFamily: FONTS.serif, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 400, color: TOKENS.ink, margin: 0, marginBottom: 24, lineHeight: 1.15 }}>
              Bigger, or more complex? Let's talk.
            </h2>
            <p style={{ fontFamily: FONTS.sans, fontSize: 17, lineHeight: 1.65, color: TOKENS.inkSoft, margin: "0 auto 32px", maxWidth: 680 }}>
              The calculators above cover most firms perfectly. But if you're running a large or unusual portfolio, operating across multiple entities, or need something shaped around how your organisation actually works — a bespoke setup, tailored onboarding, or specific security and access arrangements — we'd rather design it with you than guess. You still get the complete Hobson; we just fit the details around you.
            </p>
            <a href="mailto:info@hobsonschoice.ai" className="hp-btn hp-btn-brass">Talk to us</a>
            <p style={{ fontFamily: FONTS.sans, fontSize: 13, lineHeight: 1.6, color: TOKENS.inkSoft, opacity: 0.75, margin: "24px auto 0", maxWidth: 560 }}>
              Typically for portfolios beyond what a quick estimate can price, or organisations with particular compliance, security or integration needs.
            </p>
          </div>
        </section>









        {/* ---------------- Section 6 — FAQ ---------------- */}
        <section style={{ padding: "clamp(72px, 10vw, 140px) 24px", background: TOKENS.card, borderTop: `1px solid ${TOKENS.hairline}`, borderBottom: `1px solid ${TOKENS.hairline}` }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ marginBottom: 40 }}>
              
              <H2>Questions, answered plainly.</H2>
            </div>
            <div>
              {FAQS.map((f, i) => (
                <details key={f.q} className="hp-faq" open={i === 0}>
                  <summary>
                    <span>{f.q}</span>
                    <span className="hp-plus" aria-hidden>+</span>
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Section 7 — Closing CTA ---------------- */}
        <section style={{ background: TOKENS.ink, color: TOKENS.paper, padding: "clamp(72px, 10vw, 140px) 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <SectionLabel dark>Ready</SectionLabel>
            <h2 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: "clamp(2.2rem, 4.5vw, 3.25rem)", lineHeight: 1.1, letterSpacing: "-0.01em", color: TOKENS.paper, margin: 0 }}>
              Ready to meet <em style={{ color: TOKENS.brassLight, fontStyle: "italic" }}>Hobson?</em>
            </h2>
            <p style={{ fontFamily: FONTS.sans, fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", marginTop: 20, marginBottom: 40 }}>
              Add up your seats, estimate your library, and see exactly where you stand. No plans, no credits, no surprises.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
              <a href="#calculator" className="hp-btn hp-btn-brass">Register your interest</a>
              
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
