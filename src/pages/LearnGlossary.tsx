import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { LastUpdated } from "@/components/LastUpdated";
import { AnswerFirst } from "@/components/AnswerFirst";
import { getUpdatedDate } from "@/utils/content-dates";
import { Search } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { getDefinedTermSetStructuredData } from "@/utils/seo-data";

const BRASS = "var(--brass)";
const INK = "var(--ink)";
const MUTED = "var(--ink-muted)";
const FAINT = "var(--ink-faint)";
const LAVENDER_BG = "var(--bone-wash)";
const LAVENDER_BORDER = "var(--bone)";
const PAPER = "var(--paper)";
const RULE = "var(--bone-wash)";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Glossary terms — add new entries here; they are sorted and grouped automatically.
const TERMS: { term: string; fullName?: string; definition: string; aliases?: string[] }[] = [
  {
    term: "ACD",
    fullName: "Asset and Compliance Documents",
    definition:
      "Documents that relate to the Unit or Unit Group that are not part of a specific occupancy chain.",
  },
  {
    term: "AMD",
    fullName: "Accompanying and Modification Documents",
    definition:
      "Documents linked to an occupancy that cover its entire history.",
  },
  {
    term: "Chain",
    definition:
      "The connected sequence of documents and facts relating to the same occupational relationship over time.",
  },
  {
    term: "Document Family",
    definition:
      "The classification Hobson gives every document: is it an RTO, AMD, ACD, ORD or TPA. It pre-classifies a document into a family.",
  },
  {
    term: "Geolocation",
    definition:
      "The geographic location assigned to a unit, expressed as longitude and latitude.",
  },
  {
    term: "No papers",
    definition:
      "A filter on the map and in Papers Review showing Units where Hobson has no occupational documents in its knowledge base. It marks a gap in what has been provided rather than a finding about the Unit itself.",
  },
  {
    term: "ORD",
    fullName: "Operational & Reference Documents",
    definition:
      "Documents that provide information about the property, portfolio, products or operations, rather than legal arrangements or compliance findings.",
  },
  {
    term: "Portfolio",
    definition:
      "Reporting boundary across everything.",
  },
  {
    term: "RTO",
    fullName: "Right to Occupy",
    definition:
      "The document that creates the right to occupy a property, such as a lease, licence to occupy or tenancy agreement. It forms the starting point of the tenancy chain.",
  },
  {
    term: "Standalone Unit",
    definition:
      "A Unit that exists independently of a Unit Group and has its own geolocation.",
  },
  {
    term: "Structured Property Knowledge",
    definition:
      "Property information that Hobson has taken from documents and organised into defined, consistent records that can be used across the platform.",
  },
  {
    term: "Terminate an Occupancy",
    definition:
      "Ending an occupancy chain so that a new one can begin. Hobson sets out the evidence and records the ending only once you have confirmed what happened; a term end date on its own never terminates an occupancy.",
  },
  {
    term: "TPA",
    fullName: "Third Party Arrangement Documents",
    definition:
      "Documents that create a standalone arrangement with an outside party that burdens, protects, finances or manages the property or ownership structure.",
  },
  {
    term: "Unit",
    definition:
      "One individual occupiable space. A Unit may exist independently as a Standalone Unit or form part of a Unit Group.",
  },
  {
    term: "Unit Group",
    definition:
      "Units grouped structurally by geolocation.",
  },
  {
    term: "Unit Set",
    definition:
      "A collection of existing Units linked for a particular purpose, such as sharing a lease or other document.",
  },
];

const LearnGlossary = () => {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const q = query.toLowerCase();
    const filtered = TERMS.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        (t.aliases ?? []).some((a) => a.toLowerCase().includes(q))
    ).sort((a, b) => a.term.localeCompare(b.term));
    const map = new Map<string, { term: string; fullName?: string; definition: string; aliases?: string[] }[]>();
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
        <link rel="canonical" href="https://hobsonschoice.ai/learn/glossary" />
        <meta property="og:title" content="Glossary — Hobson's property and lease terms" />
        <meta property="og:url" content="https://hobsonschoice.ai/learn/glossary" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(getDefinedTermSetStructuredData(TERMS, getUpdatedDate("/learn/glossary")))}
        </script>
      </Helmet>
      <GlobalHeader />

      <main className="flex-1">
        {/* Hero */}
        <section
          style={{
            backgroundColor: LAVENDER_BG,
            borderBottom: `1px solid hsl(var(--highlight-colour) / 0.2)`,
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
              Plain-English definitions of the terms I may use.
            </p>
            <AnswerFirst>
              My glossary holds the property and lease terms used across Hobson AI,
              defined in plain English — from rent review, break option and deed of variation to
              Hobson's own hierarchy of Portfolio, Unit Group and Unit. Each entry is a
              short, standalone definition written for UK landlords, managing agents,
              surveyors and investors.
            </AnswerFirst>
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
              placeholder="Search the definitions"
              aria-label="Search the definitions"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-ink-faint"
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
                  style={{ color: "var(--bone-strong)" }}
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
                These definitions are being prepared
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
                      {t.fullName && (
                        <dd className="mt-1 text-[13px] font-medium uppercase tracking-wide" style={{ color: BRASS }}>
                          {t.fullName}
                        </dd>
                      )}
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

        <div className="mx-auto max-w-3xl px-6 pb-16">
          <LastUpdated date={getUpdatedDate("/learn/glossary")} />
        </div>
      </main>
    </div>
  );
};

export default LearnGlossary;
