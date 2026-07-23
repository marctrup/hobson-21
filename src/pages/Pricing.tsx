import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { GlobalHeader } from "@/components/GlobalHeader";
import { InterestModal } from "@/components/InterestModal";
import owlMascot from "@/assets/owl-mascot.png";
import owlHumanHighfive from "@/assets/owl-human-highfive-cutout.png.asset.json";





// ============================================================================
// Tunable constants — update once real figures land.
// ============================================================================
const SEAT = 35; // £ per person per month
const MIN_SEATS = 2;
const SIMPLE = 0.35; // £ per document — low end of range
const COMPLEX = 0.75; // £ per document — high end of range
const BLENDED = 0.50; // £ per document — typical portfolio average
const HANDOFF = 600; // documents threshold for personal quote

const PRICING_HEADING = "See what I cost.";

// ============================================================================
// Design tokens (scoped to this page via inline style vars).
// Deep pine-ink, paper, antique brass — calm British professional-services feel.
// ============================================================================
const TOKENS = {
  ink: "#2D2D2D", // deep charcoal (matches /learn)
  paper: "#FCFAF7", // warm cream paper
  paperSoft: "#FFFFFF",
  brass: "#B4914F", // antique brass
  brassLight: "#C9A868",
  primary: "#B4914F",
  primaryLight: "#C9A868",
  card: "#FFFFFF",
  inkSoft: "rgba(45,45,45,0.82)",
  inkMuted: "rgba(45,45,45,0.65)",
  hairline: "#EDE7DA",
  hairlineDark: "rgba(201,168,104,0.4)",
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
      background: dark ? "rgba(201,168,104,0.10)" : "rgba(255,255,255,0.6)",
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
  step?: number;
}> = ({ label, min, max, value, onChange, suffix, id, step }) => (
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
      step={step ?? 1}
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
        boxShadow: "0 12px 40px -20px rgba(180,145,79,0.35)",
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

          <div>
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
              background: "rgba(180,145,79,0.06)",
              border: `1px solid rgba(180,145,79,0.28)`,
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

// ============================================================================
// New pricing row — one row, three boxes: [AI container: read + seats] + [human]
// ============================================================================
const Calculators: React.FC = () => {
  const [docs, setDocs] = useState(212);
  const [people, setPeople] = useState(5);
  const [conciergeDocs, setConciergeDocs] = useState(300);
  const [conciergeBandId, setConciergeBandId] = useState<string>("5");

  const BANDS: Array<{ id: string; label: string; ceiling: number | null; price: number | null }> = [
    { id: "2", label: "2", ceiling: 2, price: 130 },
    { id: "5", label: "5", ceiling: 5, price: 300 },
    { id: "10", label: "10", ceiling: 10, price: 550 },
    { id: "20", label: "20", ceiling: 20, price: 1000 },
    { id: "20+", label: "More", ceiling: null, price: null },
  ];
  const band = BANDS.find((b) => b.id === conciergeBandId)!;
  const bandOverflow = band.price === null;
  const perPerson = band.price && band.ceiling ? Math.round(band.price / band.ceiling) : null;


  const readEstimate = docs * 0.5;
  const readLow = docs * 0.35;
  const readHigh = docs * 0.75;
  const seatsMonthly = people * 35;
  const conciergeOneOff = conciergeDocs * 3.5;

  const scrollToEnterprise = () => {
    const el = document.getElementById("enterprise");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Token shortcuts scoped to this section
  const T = {
    cream: "#FCFAF7",
    tint: "#F5F1E9",
    ink: "#23211D",
    muted: "#6E6A63",
    faint: "#96918A",
    gold: "#B4914F",
    goldInk: "#8C6F38",
    wash: "#F7F1E5",
    line: "rgba(35,33,29,0.12)",
    dark: "#313131",
    paperSoft: "#FFFDFA",
    paperGrad: "#FFFDF9",
  };

  const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color, style }) => (
    <div
      style={{
        fontFamily: FONTS.mono,
        fontSize: 11,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: color ?? T.faint,
        ...style,
      }}
    >
      {children}
    </div>
  );

  const TogetherRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
      style={{
        marginTop: "auto",
        paddingTop: 14,
        borderTop: `1px solid ${T.line}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: T.faint }}>
        Together
      </span>
      <span style={{ fontFamily: FONTS.serif, fontSize: 19, color: T.ink, textAlign: "right" }}>
        {children}
      </span>
    </div>
  );

  return (
    <>
      <section
        id="calculator"
        style={{
          background: T.cream,
          color: T.ink,
          padding: "56px 24px",
          borderTop: `1px solid ${T.line}`,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Two-column top-level grid: AI container (left) + Human box (right) */}
          <div
            className="hp-price-row"
            aria-live="polite"
            style={{
              display: "grid",
              gridTemplateColumns: "2.1fr 1.3fr",
              gap: 34,
              alignItems: "stretch",
            }}
          >
            {/* ============ LEFT column wrapper ============ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Owl + quote, above the AI container (mirrors the right) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  alignItems: "center",
                  gap: 18,
                  padding: "4px 2px",
                  minHeight: 170,
                }}
              >

                <img
                  src={owlMascot}
                  alt="Hobson"
                  style={{ width: 94, height: "auto", display: "block" }}
                />

                <blockquote style={{ margin: 0, position: "relative", paddingLeft: 22 }}>
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      top: -6,
                      fontFamily: FONTS.serif,
                      fontSize: 42,
                      lineHeight: 1,
                      color: T.gold,
                    }}
                  >
                    “
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: FONTS.serif,
                      fontStyle: "italic",
                      fontSize: 15,
                      lineHeight: 1.5,
                      color: T.ink,
                      maxWidth: 260,
                    }}
                  >
                    Give me your documents, and a seat for each person who needs me. That is all it takes to put me to work — quietly, and on your side.
                  </p>
                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: FONTS.mono,
                      fontSize: 10.5,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: T.gold,
                    }}
                  >
                    — Hobson
                  </div>
                </blockquote>
              </div>

            {/* ============ LEFT: single box, two sections ============ */}
            <div
              style={{
                background: T.paperSoft,
                border: `1px solid rgba(35,33,29,0.13)`,
                borderRadius: 16,
                padding: 26,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                flex: 1,
              }}
            >
              <Eyebrow color={T.faint}>Just me · no people involved</Eyebrow>
              <h3
                style={{
                  fontFamily: FONTS.serif,
                  fontWeight: 400,
                  fontSize: 29,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  margin: "10px 0 10px",
                  color: T.ink,
                }}
                className="hp-card-h"
              >
                Two payments,{" "}
                <span style={{ fontStyle: "italic", color: T.gold }}>and I am yours.</span>
              </h3>
              <p style={{ fontFamily: FONTS.sans, fontSize: 13.5, lineHeight: 1.55, color: T.muted, margin: "0 0 18px" }} className="hp-card-blurb">
                One to teach me your documents. One a month for each person who uses me. Not a choice between — the two halves of what I cost.
              </p>

              {/* Two sections divided by a hairline */}
              <div
                className="hp-ai-inner"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 20,
                  alignItems: "stretch",
                }}
              >
                {/* ---- Section A: reading ---- */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Eyebrow color={T.gold}>Reading · one-off</Eyebrow>
                  <p style={{ fontFamily: FONTS.sans, fontSize: 13, lineHeight: 1.5, color: T.muted, margin: "10px 0 14px" }}>
                    £0.25–£1.00 per document depending on complexity. A typical mix averages 50p. Read once, remembered for good.
                  </p>

                  <Slider id="docs" label="Documents" min={10} max={600} value={docs} onChange={setDocs} suffix="docs" />
                  <div style={{ marginTop: 16 }}>
                    <Eyebrow color={T.faint} style={{ marginBottom: 4 }}>Estimate — one-off</Eyebrow>
                    <div style={{ fontFamily: FONTS.serif, fontSize: 30, lineHeight: 1, color: T.ink, letterSpacing: "-0.02em" }}>
                      {fmtGBP2(readEstimate)}
                    </div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.faint, marginTop: 6 }}>
                      {fmtGBP2(readLow)} – {fmtGBP2(readHigh)}
                    </div>
                  </div>
                </div>

                {/* ---- Horizontal hairline ---- */}
                <div aria-hidden style={{ background: "rgba(35,33,29,0.08)", height: 1, width: "100%" }} />

                {/* ---- Section B: seats ---- */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Eyebrow color={T.gold}>Seats · monthly</Eyebrow>
                  <p style={{ fontFamily: FONTS.sans, fontSize: 13, lineHeight: 1.5, color: T.muted, margin: "10px 0 14px" }}>
                    One Hobson per person, at £35 each per month. I learn how each person works and stay ready for what they need next.
                  </p>

                  <Slider id="people" label="People" min={2} max={30} value={people} onChange={setPeople} suffix={people === 1 ? "person" : "people"} />
                  <div style={{ marginTop: 16 }}>
                    <Eyebrow color={T.faint} style={{ marginBottom: 4 }}>{people} × £35 — every month</Eyebrow>
                    <div style={{ fontFamily: FONTS.serif, fontSize: 30, lineHeight: 1, color: T.ink, letterSpacing: "-0.02em" }}>
                      {fmtGBP(seatsMonthly)}
                    </div>
                  </div>
                </div>
              </div>


              {/* Together row */}
              <div style={{ marginTop: "auto", paddingTop: 20 }}>
                <TogetherRow>
                  <span style={{ color: T.ink }}>{fmtGBP2(readEstimate)} today</span>
                  <span style={{ color: T.muted, fontStyle: "italic" }}>, then </span>
                  <span style={{ color: T.ink }}>{fmtGBP(seatsMonthly)} a month</span>
                </TogetherRow>
              </div>

              <a
                href="mailto:info@hobsonschoice.ai"
                style={{
                  marginTop: 14,
                  padding: "12px 18px",
                  borderRadius: 10,
                  background: "transparent",
                  color: T.gold,
                  border: `1px solid ${T.gold}`,
                  fontFamily: FONTS.sans,
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "center",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                Get my firm quote
              </a>
              <div style={{ fontFamily: FONTS.sans, fontSize: 11.5, color: T.muted, textAlign: "center", marginTop: 8 }}>
                No charge until you approve the document estimate.
              </div>
            </div>
            </div>



            {/* ============ RIGHT column wrapper ============ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Owl + quote, above the human card */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  alignItems: "center",
                  gap: 18,
                  padding: "4px 2px",
                  minHeight: 170,
                }}
              >

                <img
                  src={owlHumanHighfive.url}
                  alt="Hobson high-fiving a person"
                  style={{ width: 130, height: "auto", display: "block" }}
                />
                <blockquote style={{ margin: 0, position: "relative", paddingLeft: 22 }}>
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      top: -6,
                      fontFamily: FONTS.serif,
                      fontSize: 42,
                      lineHeight: 1,
                      color: T.gold,
                    }}
                  >
                    “
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: FONTS.serif,
                      fontStyle: "italic",
                      fontSize: 15,
                      lineHeight: 1.5,
                      color: T.ink,
                    }}
                  >
                    I am fast, and I am accurate. But accurate and certain are not the same thing, and when you need certain, you need a person. I keep several on hand for exactly that reason.
                  </p>
                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: FONTS.mono,
                      fontSize: 10.5,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: T.gold,
                    }}
                  >
                    — Hobson
                  </div>
                </blockquote>
              </div>

            {/* ============ RIGHT: Human option ============ */}
            <div
              style={{
                background: `linear-gradient(180deg, ${T.paperGrad} 0%, ${T.cream} 100%)`,
                border: `1px solid ${T.gold}`,
                borderRadius: 16,
                padding: 26,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                flex: 1,
              }}
            >
              <Eyebrow color={T.gold}>Me and a person · one-off + monthly</Eyebrow>
              <h3
                style={{
                  fontFamily: FONTS.serif,
                  fontWeight: 400,
                  fontSize: 22,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  margin: "8px 0 10px",
                  color: T.ink,
                }}
                className="hp-card-h"
              >
                Everything to the left — but{" "}
                <span style={{ fontStyle: "italic", color: T.gold }}>with a person behind it.</span>
              </h3>
              <p style={{ fontFamily: FONTS.sans, fontSize: 13.5, lineHeight: 1.55, color: T.muted, margin: 0 }} className="hp-card-blurb">
                That box is me, working on my own. This one is me, working with one of my colleagues.
              </p>

              {/* Bullets */}
              <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0" }} className="hp-bullets">
                {[
                  
                  { h: "A person checks the work", b: "Every title and every address confirmed before it reaches you." },
                  { h: "That colleague stays", b: "A named contact, for as long as you want them." },
                ].map((item, i) => (
                  <li
                    key={item.h}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: 10,
                      padding: "10px 0",
                      borderTop: i === 0 ? "none" : `1px solid ${T.line}`,
                    }}
                  >
                    <span style={{ color: T.gold, fontSize: 14, lineHeight: 1.4 }}>✦</span>
                    <div>
                      <div style={{ fontFamily: FONTS.sans, fontSize: 13.5, fontWeight: 600, color: T.ink }}>{item.h}</div>
                      <div style={{ fontFamily: FONTS.sans, fontSize: 12.5, lineHeight: 1.45, color: T.muted }}>{item.b}</div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Controls */}
              <div style={{ marginTop: 16 }}>
                <Slider
                  id="concierge-docs"
                  label="Documents to onboard"
                  min={100}
                  max={2000}
                  step={100}
                  value={conciergeDocs}
                  onChange={setConciergeDocs}
                  suffix="docs"
                />
              </div>

              <div style={{ marginTop: 14 }}>
                <Eyebrow color={T.gold} style={{ marginBottom: 8 }}>How big is your team (up to)</Eyebrow>
                <div role="radiogroup" aria-label="How big is your team" style={{ display: "flex", gap: 6 }}>
                  {BANDS.map((b) => {
                    const active = b.id === conciergeBandId;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setConciergeBandId(b.id);
                          if (b.price === null) setTimeout(scrollToEnterprise, 60);
                        }}
                        style={{
                          flex: 1,
                          padding: "6px 6px",
                          borderRadius: 999,
                          border: `1px solid ${active ? T.gold : T.line}`,
                          background: active ? "rgba(180,145,79,0.14)" : "#fff",
                          color: active ? T.ink : T.muted,
                          fontFamily: FONTS.mono,
                          fontSize: 11,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        {b.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prices */}
              <div style={{ marginTop: "auto", paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <Eyebrow color={T.faint} style={{ marginBottom: 4 }}>Onboarding — one-off</Eyebrow>
                  <div style={{ fontFamily: FONTS.serif, fontSize: 30, lineHeight: 1, color: T.ink, letterSpacing: "-0.02em" }}>
                    {fmtGBP2(conciergeOneOff)}
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      marginTop: 6,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: T.wash,
                      fontFamily: FONTS.mono,
                      fontSize: 10.5,
                      color: T.goldInk,
                      letterSpacing: "0.06em",
                    }}
                  >
                    £3.50 per document — Professor alone is 50p
                  </div>
                </div>

                <div>
                  <Eyebrow color={T.faint} style={{ marginBottom: 4 }}>Then, every month</Eyebrow>
                  {bandOverflow ? (
                    <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 24, color: T.ink }}>
                      Let&rsquo;s talk — see below
                    </div>
                  ) : (
                    <>
                      <div style={{ fontFamily: FONTS.serif, fontSize: 30, lineHeight: 1, color: T.ink, letterSpacing: "-0.02em" }}>
                        {fmtGBP(band.price!)}
                      </div>
                      {perPerson !== null && (
                        <div
                          style={{
                            display: "inline-block",
                            marginTop: 6,
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: T.wash,
                            fontFamily: FONTS.mono,
                            fontSize: 10.5,
                            color: T.goldInk,
                            letterSpacing: "0.06em",
                          }}
                        >
                          £{perPerson} per person, seats included — a standard seat is £35
                        </div>
                      )}

                    </>
                  )}
                </div>
              </div>

              {/* Together row */}
              <div style={{ marginTop: 16 }}>
                <TogetherRow>
                  {bandOverflow ? (
                    <>
                      <span style={{ color: T.ink }}>{fmtGBP2(conciergeOneOff)} today</span>
                      <span style={{ color: T.muted, fontStyle: "italic" }}>, then let&rsquo;s talk</span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: T.ink }}>{fmtGBP2(conciergeOneOff)} today</span>
                      <span style={{ color: T.muted, fontStyle: "italic" }}>, then </span>
                      <span style={{ color: T.ink }}>{fmtGBP(band.price!)} a month</span>
                    </>
                  )}
                </TogetherRow>
              </div>

              <a
                href="mailto:info@hobsonschoice.ai"
                style={{
                  marginTop: 14,
                  padding: "12px 18px",
                  borderRadius: 10,
                  background: T.gold,
                  color: "#fff",
                  fontFamily: FONTS.sans,
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "center",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                Book a consultation
              </a>
              <div style={{ fontFamily: FONTS.sans, fontSize: 11.5, color: T.muted, textAlign: "center", marginTop: 8 }}>
                Nothing is charged until we have spoken and you have approved the scope.
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1120px) {
          .hp-price-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px) {
          .hp-ai-inner { grid-template-columns: 1fr !important; }
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
          background: #F3EFFA;
          border-left: 1px solid #E4DAF3;
          border-bottom: 1px solid #E4DAF3;
          transform: rotate(45deg);
        }
        @media (max-width: 640px) {
          .hp-hero-bubble::before { left: 50%; top: -10px; transform: translateX(-50%) rotate(135deg); }
        }
      `}</style>
    </>
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
        .hp-lift:hover { transform: translateY(-2px); box-shadow: 0 12px 32px -18px rgba(45,45,45,0.25); }
        .hp-slider { -webkit-appearance: none; appearance: none; height: 4px; background: rgba(201,168,104,0.25); border-radius: 999px; outline: none; }
        .hp-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: ${TOKENS.brassLight}; border: 3px solid ${TOKENS.ink}; box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: pointer; }
        .hp-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: ${TOKENS.brassLight}; border: 3px solid ${TOKENS.ink}; cursor: pointer; }
        .hp-slider:focus-visible::-webkit-slider-thumb { outline: 2px solid ${TOKENS.brassLight}; outline-offset: 3px; }
        .hp-btn { font-family: ${FONTS.mono}; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; padding: 14px 28px; border-radius: 999px; cursor: pointer; transition: all .25s ease; border: 1px solid transparent; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
        .hp-btn-brass { background: ${TOKENS.brass}; color: ${TOKENS.paper}; }
        .hp-btn-brass:hover { background: ${TOKENS.brassLight}; }
        .hp-btn-ghost { background: transparent; color: ${TOKENS.paper}; border-color: ${TOKENS.brassLight}; }
        .hp-btn-ghost:hover { background: rgba(201,168,104,0.12); }
        .hp-btn:focus-visible { outline: 2px solid ${TOKENS.brassLight}; outline-offset: 3px; }
        details.hp-faq { background: ${TOKENS.paper}; border: 1px solid ${TOKENS.hairline}; border-radius: 14px; padding: 22px 26px; transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease; }
        details.hp-faq + details.hp-faq { margin-top: 12px; }
        details.hp-faq:hover { border-color: rgba(180,145,79,0.35); box-shadow: 0 6px 24px -12px rgba(45,45,45,0.14); }
        details.hp-faq[open] { border-color: rgba(180,145,79,0.45); box-shadow: 0 10px 30px -14px rgba(45,45,45,0.18); }
        details.hp-faq summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 24px; font-family: ${FONTS.serif}; font-size: 1.15rem; color: ${TOKENS.ink}; }
        details.hp-faq summary::-webkit-details-marker { display: none; }
        details.hp-faq summary .hp-plus { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 999px; background: rgba(180,145,79,0.12); font-family: ${FONTS.mono}; font-size: 18px; line-height: 1; color: ${TOKENS.brass}; transition: transform .25s ease, background .25s ease; flex-shrink: 0; }
        details.hp-faq[open] summary .hp-plus { transform: rotate(45deg); background: rgba(180,145,79,0.22); }
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
        <section id="enterprise" style={{ padding: "clamp(56px, 8vw, 112px) 24px", background: TOKENS.paper, borderTop: `1px solid ${TOKENS.hairline}`, scrollMarginTop: 80 }}>
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
                  Larger portfolios, unusual structures.
                </h2>

                <p style={{ fontFamily: FONTS.sans, fontSize: 17, lineHeight: 1.7, color: TOKENS.inkSoft, margin: "0 0 32px", maxWidth: 620 }}>
                  If your portfolio is large, your structure complex, your team above twenty, or your requirements particular, the calculator will only take us so far. I am happy to understand your organisation properly and design something around it. The complete Hobson, fitted to you.
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
            background: "#F1EEE7",
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
                  <div style={{ paddingTop: 4 }}>
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
