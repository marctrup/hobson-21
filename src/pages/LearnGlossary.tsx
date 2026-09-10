import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";

const BRASS = "#B4914F";
const INK = "#2D2D2D";
const MUTED = "#6E6A62";
const FAINT = "#8A8478";
const LAVENDER_BG = "#F1EBDE";
const LAVENDER_BORDER = "#E8E1D4";
const PAPER = "#FCFAF7";
const RULE = "#F7EDDC";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Glossary terms — add new entries here; they are sorted and grouped automatically.
const TERMS: { term: string; definition: string }[] = [
  {
    term: "Agent",
    definition:
      "A Hobson component that can research, assess information and make recommendations, but does not change the property record itself.",
  },
  {
    term: "Deterministic",
    definition:
      "Designed to produce the same result when given the same information and rules.",
  },
  {
    term: "Get-tool",
    definition:
      "A tool that reads information already recorded in Hobson and applies fixed rules to answer a question.",
  },
  {
    term: "Write tool",
    definition:
      "A tool that records an approved change to information held in Hobson.",
  },
];

const LearnGlossary = () => {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const filtered = TERMS.filter(
      (t) =>
        t.term.toLowerCase().includes(query.toLowerCase()) ||
        t.definition.toLowerCase().includes(query.toLowerCase())
    );
    const map = new Map<string, { term: string; definition: string }[]>();
    for (const t of filtered) {
      const letter = t.term[0]?.toUpperCase() ?? "#";
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(t);
    }
    return map;
  }, [query]);

  const activeLetters = new Set(grouped.keys());

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAPER }}>
      <Helmet>
        <title>Glossary — Learn about Hobson AI</title>
        <meta
          name="description"
          content="Plain-English explanations of the property, document and Hobson terms used across Hobson."
        />
        <link rel="canonical" href="https://hobson-21.lovable.app/learn/glossary" />
        <meta property="og:title" content="Hobson Glossary" />
        <meta property="og:url" content="https://hobson-21.lovable.app/learn/glossary" />
        <meta property="og:type" content="website" />
      </Helmet>
      <GlobalHeader />

      <main className="flex-1">
        {/* Hero */}
        <section
          style={{
            backgroundColor: LAVENDER_BG,
            borderBottom: `1px solid rgba(180,145,79,0.2)`,
          }}
        >
          <div className="mx-auto max-w-3xl px-6 pt-20 pb-12 text-center">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: BRASS }}
            >
              Learn
            </p>
            <h1
              className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight"
              style={{ color: INK }}
            >
              Glossary
            </h1>
            <p
              className="mt-5 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
              style={{ color: MUTED }}
            >
              Plain-English definitions of the terms used across Hobson.
            </p>
            <div
              className="mx-auto mt-10 h-px w-24"
              style={{ backgroundColor: RULE }}
            />
          </div>
        </section>

        {/* Search */}
        <section className="mx-auto max-w-3xl px-6 pt-12">
          <div
            className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm"
            style={{ border: `1px solid ${LAVENDER_BORDER}` }}
          >
            <Search className="h-5 w-5 shrink-0" style={{ color: FAINT }} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the glossary"
              aria-label="Search the glossary"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#8A8478]"
              style={{ color: INK }}
            />
          </div>

          {/* A–Z navigation */}
          <nav aria-label="Alphabetical navigation" className="mt-8 flex flex-wrap justify-center gap-1.5">
            {LETTERS.map((letter) => {
              const active = activeLetters.has(letter);
              return active ? (
                <a
                  key={letter}
                  href={`#glossary-${letter}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors"
                  style={{ backgroundColor: LAVENDER_BG, color: BRASS, border: `1px solid ${LAVENDER_BORDER}` }}
                >
                  {letter}
                </a>
              ) : (
                <span
                  key={letter}
                  aria-disabled="true"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm"
                  style={{ color: "#C9C2B4" }}
                >
                  {letter}
                </span>
              );
            })}
          </nav>
        </section>

        {/* Glossary body */}
        <section className="mx-auto max-w-3xl px-6 pt-14 pb-20">
          {TERMS.length === 0 ? (
            <div
              className="rounded-[20px] bg-white p-10 sm:p-14 text-center shadow-sm"
              style={{ border: `1px solid ${LAVENDER_BORDER}` }}
            >
              <h2
                className="font-serif text-2xl font-normal tracking-tight"
                style={{ color: INK }}
              >
                The glossary is being prepared
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed" style={{ color: MUTED }}>
                Terms and their plain-English definitions will appear here,
                arranged from A to Z.
              </p>
            </div>
          ) : (
            LETTERS.filter((l) => activeLetters.has(l)).map((letter) => (
              <div key={letter} id={`glossary-${letter}`} className="scroll-mt-24 first:mt-0 mt-12">
                <div className="flex items-center gap-4">
                  <span className="font-serif text-3xl" style={{ color: BRASS }}>
                    {letter}
                  </span>
                  <div className="h-px flex-1" style={{ backgroundColor: RULE }} />
                </div>
                <dl className="mt-6 space-y-6">
                  {grouped.get(letter)!.map((t) => (
                    <div
                      key={t.term}
                      className="rounded-[16px] bg-white p-6 shadow-sm"
                      style={{ border: `1px solid ${LAVENDER_BORDER}` }}
                    >
                      <dt className="font-serif text-xl" style={{ color: INK }}>
                        {t.term}
                      </dt>
                      <dd className="mt-2 text-[15px] leading-relaxed" style={{ color: MUTED }}>
                        {t.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default LearnGlossary;
