import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { GlobalHeader } from "@/components/GlobalHeader";
import { InterestModal } from "@/components/InterestModal";
import owlMascot from "@/assets/owl-mascot.png";




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
const PRICING_HEADING = "See what I cost.";

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
// Together card (commit-to-Professor offer)
// ============================================================================
const TogetherCard: React.FC<{ people: number; docEstimate: number; seatsMonthly: number }> = ({
  people,
  docEstimate,
  seatsMonthly,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        marginTop: 32,
        padding: "clamp(28px, 3.5vw, 44px)",
        borderRadius: 24,
        background: TOKENS.paper,
        border: `2px solid ${TOKENS.brass}`,
        boxShadow: "0 12px 40px -20px rgba(249,115,22,0.35)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)",
          gap: "clamp(24px, 3.5vw, 48px)",
          alignItems: "stretch",
        }}
        className="hp-together-grid"
      >
        {/* LEFT column */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: "0.24em", color: TOKENS.brass, textTransform: "uppercase", marginBottom: 14 }}>
            Together
          </div>
          <h3 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: "clamp(1.6rem, 2.6vw, 2.15rem)", lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0, color: TOKENS.ink }}>
            Commit to Professor. I'll give you the first month on me.
          </h3>
          <p style={{ fontFamily: FONTS.sans, fontSize: 15.5, lineHeight: 1.65, color: TOKENS.inkSoft, marginTop: 16 }}>
            Once you approve Professor's reading fee, I will work with your team for the first month at no charge for seats. You experience the complete Hobson before a single monthly payment is made.

          </p>

          <div style={{ height: 1, background: TOKENS.hairline, margin: "24px 0" }} />

          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <img src={owlMascot} alt="" style={{ width: 44, height: 44, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: "clamp(0.98rem, 1.4vw, 1.1rem)", lineHeight: 1.55, color: TOKENS.ink, margin: 0 }}>
              &ldquo;I would rather you experience me properly before deciding. Once Professor knows your documents, the first month is mine to prove my worth.&rdquo;
            </p>
          </div>
        </div>

        {/* RIGHT column */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
          <div
            style={{
              padding: "22px 24px",
              borderRadius: 16,
              background: "rgba(249,115,22,0.06)",
              border: `1px solid rgba(249,115,22,0.28)`,
            }}
          >
            <div style={{ fontFamily: FONTS.mono, fontSize: 10.5, letterSpacing: "0.18em", color: TOKENS.brass, textTransform: "uppercase", marginBottom: 8 }}>
              One-off document read
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div style={{ fontFamily: FONTS.serif, fontSize: "clamp(2rem, 3.6vw, 2.75rem)", lineHeight: 1, color: TOKENS.ink, letterSpacing: "-0.02em" }}>
                {fmtGBP(docEstimate)}
              </div>
              <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: TOKENS.inkMuted }}>est.</span>
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, color: TOKENS.inkSoft, marginTop: 10 }}>
              then <span style={{ fontWeight: 600, color: TOKENS.ink }}>{fmtGBP(seatsMonthly)}/month</span> from month two
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{
              padding: "14px 22px",
              borderRadius: 12,
              border: "none",
              background: TOKENS.brass,
              color: "#fff",
              fontFamily: FONTS.sans,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.01em",
              cursor: "pointer",
              boxShadow: "0 8px 20px -10px rgba(249,115,22,0.6)",
            }}
          >
            Get my firm quote
          </button>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: TOKENS.inkMuted, textAlign: "center" }}>
            No charge until you approve the document estimate
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .hp-together-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <InterestModal open={open} onClose={() => setOpen(false)} source="pricing-together-quote" />
    </div>
  );
};

// ============================================================================
// Section 3 — Calculators
// ============================================================================

const HERO_MESSAGE = "\u201CTell me about your business. I will show you the seat cost for your team and an estimate for my Professor to read your documents. Nothing begins until you approve it.\u201D";

const TypewriterText: React.FC<{ text: string; speed?: number; startDelay?: number }> = ({
  text,
  speed = 22,
  startDelay = 350,
}) => {
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  React.useEffect(() => {
    setShown(0);
    setDone(false);
    let i = 0;
    let raf = 0;
    const start = window.setTimeout(() => {
      const tick = () => {
        i += 1;
        setShown(i);
        if (i >= text.length) {
          setDone(true);
          return;
        }
        // Natural pauses on punctuation.
        const ch = text[i - 1];
        const pause =
          ch === "." || ch === "!" || ch === "?" ? 260 :
          ch === "," || ch === ";" || ch === "—" ? 140 :
          speed;
        raf = window.setTimeout(tick, pause);
      };
      raf = window.setTimeout(tick, speed);
    }, startDelay);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(raf);
    };
  }, [text, speed, startDelay]);
  return (
    <span aria-label={text}>
      <span aria-hidden={done ? "true" : "false"}>{text.slice(0, shown)}</span>
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "0.55ch",
          marginLeft: 2,
          borderRight: `2px solid currentColor`,
          animation: "hpCaretBlink 1s steps(1) infinite",
          opacity: done ? 0 : 1,
          transition: "opacity .4s ease .3s",
          verticalAlign: "-2px",
          height: "1em",
        }}
      />
    </span>
  );
};

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
        background: TOKENS.paper,
        color: TOKENS.ink,
        padding: "clamp(72px, 9vw, 128px) 24px",
        borderTop: `1px solid ${TOKENS.hairline}`,
        borderBottom: `1px solid ${TOKENS.hairline}`,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ maxWidth: 820, marginBottom: 56, marginLeft: 0, marginRight: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(16px, 3vw, 28px)",
              justifyContent: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <img
              src={owlMascot}
              alt="Hobson"
              style={{ width: "clamp(88px, 12vw, 128px)", height: "auto", flexShrink: 0 }}
            />
            <div
              style={{
                position: "relative",
                background: "#6D28D9",
                border: "1px solid #5B21B6",
                borderRadius: 20,
                padding: "20px 24px",
                maxWidth: 520,
                fontFamily: FONTS.serif,
                fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)",
                lineHeight: 1.5,
                color: "#FFFFFF",
                boxShadow: "0 20px 60px -30px rgba(124,58,237,0.55)",
              }}
              className="hp-hero-bubble"
            >
              <span style={{ fontStyle: "italic" }}>{HERO_MESSAGE}</span>

            </div>
          </div>
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
              Professor reads your documents{" "}
              <span style={{ fontStyle: "italic", color: TOKENS.brass }}>once</span>
              . Everything learned is carried forward.
            </h3>
            <p style={{ fontFamily: FONTS.sans, fontSize: 15, lineHeight: 1.6, color: TOKENS.inkSoft, marginTop: 16 }}>
              £0.25–£1.00 per document, depending on its complexity. I read it once and remember it for good. You approve a fixed quote before I begin the full read.
            </p>


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
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 14, borderTop: `1px solid ${TOKENS.hairline}`, paddingTop: 12 }}>
                      <img src={owlMascot} alt="" style={{ width: 24, height: 24, flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontFamily: FONTS.serif, fontSize: 14, fontStyle: "italic", color: TOKENS.inkSoft, margin: 0, lineHeight: 1.5 }}>
                        &ldquo;This is an estimate — until I know the make-up of your documents, I can&rsquo;t firm up the price.&rdquo;
                      </p>
                    </div>
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
              Everyone gets{" "}
              <span style={{ fontStyle: "italic", color: TOKENS.brassLight }}>their own Hobson</span>
              , supported by the complete back-office team.
            </h3>
            <p style={{ fontFamily: FONTS.sans, fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.82)", marginTop: 16, position: "relative" }}>
              One Hobson per person. I learn how you work, remember what matters, and stay ready for whatever you need next.
            </p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20, position: "relative" }}>
              {["Learns from each person"].map((t) => (
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

        {/* ============ TOGETHER CARD ============ */}
        <TogetherCard
          people={people}
          docEstimate={roundNice(blendedEst)}
          seatsMonthly={seatsMonthly}
        />
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hp-calc-grid { grid-template-columns: 1fr !important; }
        }
        .hp-slider-dark::-webkit-slider-runnable-track { background: rgba(255,255,255,0.18); }
        .hp-slider-dark::-moz-range-track { background: rgba(255,255,255,0.18); }
        .hp-hero-bubble::before {
          content: "";
          position: absolute;
          left: -10px;
          top: 32px;
          width: 18px;
          height: 18px;
          background: #6D28D9;
          border-left: 1px solid #5B21B6;
          border-bottom: 1px solid #5B21B6;
          transform: rotate(45deg);
        }
        @media (max-width: 640px) {
          .hp-hero-bubble::before { left: 50%; top: -10px; transform: translateX(-50%) rotate(135deg); }
        }
      `}</style>

    </section>
  );
};

// ============================================================================
// FAQ
// ============================================================================
const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Do you charge per question?",
    a: "No. Every person may ask as many questions as they need, about anything I have learned. I do not count questions or keep a meter running. I may occasionally ask for a brief pause before continuing — but that is all.",
  },
  {
    q: "Why is there no plan to choose?",
    a: "Because there is no smaller version of me. Everyone receives the complete Hobson and my full back-office team. Your price is based simply on how many people use me and how many documents my Professor needs to read. Nothing to compare, nothing to outgrow.",
  },
  {
    q: "What does each person actually get?",
    a: "Their own Hobson, supported by my complete back-office team. I learn how each person works and keep their access, permissions and history separate and secure. Everyone draws on the same understanding of your documents — but I take the time to know each member of your team individually.",
  },
  {
    q: "Why is the document price a range?",
    a: "Because a three-page notice and a 300-page lease are not the same job. A straightforward document may cost as little as £0.25 to read; a longer or more complex one, up to £1.00. I will assess your documents first and confirm a fixed quote within that range before anything begins.",
  },
  {
    q: "Do I keep paying whenever you use a document?",
    a: "No. Professor reads each document once and retains what matters. You pay for that initial read — not for every future question, calculation or check that draws on it.",
  },
  {
    q: "What happens when new documents arrive?",
    a: "Professor reads them in the same way, at the same per-document rate. A few documents can be added as they arrive without any fuss. When a larger batch comes — perhaps after an acquisition or the opening of a data room — I will confirm the cost and wait for your approval before beginning. Nothing is ever charged automatically.",
  },
  {
    q: "Do I pay before I know the final cost?",
    a: "No. I assess your documents first and give you a fixed quote within the range shown by the calculator. The read begins only once you have approved it.",
  },
  {
    q: "Can I add or remove people?",
    a: "Yes, at any time. The minimum is two people at £70 per month. Each additional person costs £35 per month and receives their own Hobson, with the complete back-office team behind them. Add people as your team grows; remove them when circumstances change. There is no lock-in.",
  },
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
  const [interestOpen, setInterestOpen] = useState(false);
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
        @keyframes hpCaretBlink { 50% { border-color: transparent; } }
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
        details.hp-faq { background: ${TOKENS.paper}; border: 1px solid ${TOKENS.hairline}; border-radius: 14px; padding: 22px 26px; transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease; }
        details.hp-faq + details.hp-faq { margin-top: 12px; }
        details.hp-faq:hover { border-color: rgba(249,115,22,0.35); box-shadow: 0 6px 24px -12px rgba(42,23,88,0.18); }
        details.hp-faq[open] { border-color: rgba(249,115,22,0.45); box-shadow: 0 10px 30px -14px rgba(42,23,88,0.22); }
        details.hp-faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 24px; font-family: ${FONTS.serif}; font-size: 1.15rem; color: ${TOKENS.ink}; }
        details.hp-faq summary::-webkit-details-marker { display: none; }
        details.hp-faq summary .hp-plus { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 999px; background: rgba(249,115,22,0.10); font-family: ${FONTS.mono}; font-size: 18px; line-height: 1; color: ${TOKENS.brass}; transition: transform .25s ease, background .25s ease; flex-shrink: 0; }
        details.hp-faq[open] summary .hp-plus { transform: rotate(45deg); background: rgba(249,115,22,0.18); }
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
        <section style={{ padding: "clamp(48px, 7vw, 96px) 24px clamp(72px, 10vw, 140px)", background: `radial-gradient(900px 500px at 100% -10%, rgba(249,115,22,0.10), transparent 60%), radial-gradient(1200px 600px at 15% 110%, rgba(139,92,246,0.10), transparent 60%), ${TOKENS.paperSoft}` }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <div
              style={{
                position: "relative",
                background: TOKENS.paper,
                border: `1px solid ${TOKENS.hairline}`,
                borderTop: `3px solid ${TOKENS.brass}`,
                borderRadius: 20,
                padding: "clamp(36px, 5vw, 64px)",
                boxShadow: "0 24px 60px -30px rgba(20, 14, 40, 0.18)",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr)",
                gap: "clamp(28px, 4vw, 48px)",
                alignItems: "center",
              }}
              className="hp-enterprise-card"
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{ width: 28, height: 1, background: TOKENS.brass }} />
                  <span style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: "0.18em", color: TOKENS.brass }}>
                    ENTERPRISE
                  </span>
                </div>
                <h2 style={{ fontFamily: FONTS.serif, fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)", fontWeight: 400, color: TOKENS.ink, margin: 0, marginBottom: 24, lineHeight: 1.15 }}>
                  Some things are better discussed.
                </h2>
                <p style={{ fontFamily: FONTS.sans, fontSize: 17, lineHeight: 1.7, color: TOKENS.inkSoft, margin: "0 0 32px", maxWidth: 620 }}>
                  If your portfolio is large, your structure complex, or your requirements particular, the calculator will only take us so far. I am happy to understand your organisation properly and design something around it. The complete Hobson, fitted to you.
                </p>
                <div>
                  <a href="mailto:info@hobsonschoice.ai" className="hp-btn hp-btn-brass">Talk to me</a>
                </div>
              </div>
            </div>
          </div>
        </section>









        {/* ---------------- Section 6 — FAQ ---------------- */}
        <section
          style={{
            padding: "clamp(80px, 11vw, 150px) 24px",
            background: `radial-gradient(1100px 500px at 100% 0%, rgba(249,115,22,0.10), transparent 60%), radial-gradient(900px 500px at 0% 100%, rgba(139,92,246,0.14), transparent 60%), ${TOKENS.paperSoft}`,
            borderTop: `1px solid ${TOKENS.hairline}`,
          }}
        >
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: TOKENS.paper,
                  border: `1px solid ${TOKENS.hairline}`,
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: TOKENS.brass,
                  marginBottom: 20,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 999, background: TOKENS.brass }} />
                Frequently asked
              </div>
              <H2>Questions, answered plainly.</H2>
              <p style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 17, color: TOKENS.inkSoft, marginTop: 14, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
                The things I'm most often asked — answered in my own words.
              </p>
            </div>
            <div>
              {FAQS.map((f, i) => (
                <details key={f.q} className="hp-faq" open={i === 0}>
                  <summary>
                    <span>{f.q}</span>
                    <span className="hp-plus" aria-hidden>+</span>
                  </summary>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, paddingTop: 4 }}>
                    <img src={owlMascot} alt="" style={{ width: 30, height: 30, flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontFamily: FONTS.serif, fontStyle: "italic", margin: 0, lineHeight: 1.65, color: TOKENS.inkSoft }}>
                      &ldquo;{f.a}&rdquo;
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>


      </main>
      <InterestModal open={interestOpen} onClose={() => setInterestOpen(false)} source="pricing-register-interest" />
    </>
  );
}
