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
const TERMS: { term: string; fullName?: string; definition: string; aliases?: string[] }[] = [
  {
    term: "ACD",
    fullName: "Asset and Compliance Documents",
    definition:
      "Documents relating to the property or its compliance obligations that are not part of a specific tenancy chain.",
  },
  {
    term: "Action Requirement",
    definition:
      "Whether further action is required, unnecessary, dependent on circumstances or advisable.",
  },
  {
    term: "Action Type",
    definition:
      "The practical action that should be taken, such as renewing, replacing, re-inspecting or reviewing something.",
  },
  {
    term: "Agreement",
    definition:
      "A document that records terms agreed between two or more parties and creates or changes contractual rights or obligations.",
  },
  {
    term: "AMD",
    fullName: "Accompanying and Modification Documents",
    definition:
      "Documents linked to a tenancy that accompany or change its terms over time.",
  },
  {
    term: "Agent",
    definition:
      "A Hobson component that can research, assess information and make recommendations, but does not change the property record itself.",
  },
  {
    term: "Chain",
    definition:
      "The connected sequence of documents and facts relating to the same occupational relationship over time.",
  },
  {
    term: "Chain Status",
    definition:
      "The position a fact holds within a chain: Pre-occupational, Current, Future or Superseded.",
  },
  {
    term: "Classifier Prompt",
    definition:
      "The instructions Hobson uses to identify what something is and assign it to the correct category.",
  },
  {
    term: "Confirmed Surrender",
    definition:
      "A surrender that has been completed and is effective, rather than merely proposed or notified.",
  },
  {
    term: "Consideration",
    definition:
      "A one-off payment or other value exchanged as part of entering into or ending a transaction, rather than for the ongoing right to occupy.",
  },
  {
    term: "Contingent Consideration",
    definition:
      "A one-off payment that becomes due only if a specified future event happens, and may therefore never become payable.",
  },
  {
    term: "Current",
    definition:
      "A fact that applies now within its chain.",
  },
  {
    term: "Deed",
    definition:
      "A formally executed document used to create, transfer, vary, release or confirm legal rights.",
  },
  {
    term: "Deterministic",
    definition:
      "Designed to produce the same result when given the same information and rules.",
  },
  {
    term: "Document Family",
    definition:
      "The classification Hobson gives every document: RTO, AMD or ACD. It determines whether the document starts a tenancy chain, forms part of that chain, or sits separately from it.",
  },
  {
    term: "Effective Date",
    definition:
      "The date on which a document itself takes effect.",
  },
  {
    term: "Finding",
    definition:
      "A piece of information Hobson has established from the available records and can use when answering a question.",
  },
  {
    term: "Future",
    definition:
      "A fact that has been established but does not yet apply.",
  },
  {
    term: "Get-tool",
    definition:
      "A tool that reads information already recorded in Hobson and applies fixed rules to answer a question.",
  },
  {
    term: "Holding Over",
    definition:
      "Where an occupier remains in occupation after the contractual term has expired.",
  },
  {
    term: "Licence",
    definition:
      "A document giving permission or consent for a particular act or activity.",
  },
  {
    term: "Memorandum",
    definition:
      "A document that records or confirms an event, decision, agreement or outcome.",
  },
  {
    term: "Narrator Prompt",
    definition:
      "The instructions Hobson uses to turn the findings returned by its tools into a clear answer for the user, without adding information that has not been established.",
  },
  {
    term: "Notice",
    definition:
      "A formal communication used to give information, make a demand or proposal, exercise a right, or start or end a process.",
  },
  {
    term: "Occupation Payment",
    aliases: ["occupancy payment"],
    definition:
      "The recurring amount paid for the right to occupy or use premises, such as rent or a licence fee.",
  },
  {
    term: "Occupation Payment Mechanism",
    definition:
      "The rule that determines how an occupation payment is set or changed, and when that change applies. It is a rule, not a payment itself.",
  },
  {
    term: "Operational Payment",
    definition:
      "A payment towards the costs of operating or maintaining a property, such as service charge or insurance, rather than payment for the right to occupy.",
  },
  {
    term: "Periodic Holdover",
    definition:
      "Where a tenancy continues on a periodic basis after the contractual term has expired.",
  },
  {
    term: "Personality Prompt",
    definition:
      "The instructions that control Hobson's tone, language and manner of communicating, without changing the facts or content of the answer.",
  },
  {
    term: "Planner Prompt",
    definition:
      "The instructions Hobson uses to decide which tools are needed to answer a question and how they should be used.",
  },
  {
    term: "Portfolio",
    definition:
      "The whole collection of units and unit groups being managed together for reporting and oversight.",
  },
  {
    term: "Pre-occupational",
    definition:
      "A fact that belongs to the period before occupation began within the relevant chain.",
  },
  {
    term: "RTO",
    fullName: "Right to Occupy",
    definition:
      "The document that creates the right to occupy a property, such as a lease, licence to occupy or tenancy agreement. It forms the starting point of the tenancy chain.",
  },
  {
    term: "Relevant Operative Date",
    definition:
      "The date from which a particular fact applies, changes or ends. It may be different from the Effective Date of the document.",
  },
  {
    term: "Statutory Continuation",
    definition:
      "Where a tenancy continues after the contractual term because the law allows or requires it to continue.",
  },
  {
    term: "Side Letter",
    definition:
      "A document that sits alongside another agreement and supplements, qualifies or modifies how it operates between particular parties.",
  },
  {
    term: "Statutory Declaration",
    definition:
      "A formal statement in which a person declares specified facts or circumstances to be true.",
  },
  {
    term: "Summary Narrator Prompt",
    definition:
      "The instructions Hobson uses to answer follow-up questions from what has already been said in the conversation, without carrying out new research, retrieval or calculations.",
  },
  {
    term: "Superseded",
    definition:
      "A fact that applied previously within its chain but has since been replaced by a later position.",
  },
  {
    term: "Term End Date",
    definition:
      "The date on which the contractual term expires. It does not by itself mean the tenancy has ended or the occupier has left.",
  },
  {
    term: "Time-Bound",
    definition:
      "A document or requirement whose validity or compliance status can run out simply because time passes.",
  },
  {
    term: "Time Classification",
    definition:
      "The classification that records whether a document or compliance requirement is Time-Bound or Time-Unbound.",
  },
  {
    term: "Time-Unbound",
    definition:
      "A document or requirement that does not become invalid or non-compliant simply because time passes.",
  },
  {
    term: "Transfer",
    definition:
      "A document that transfers legal ownership of land or an interest in land from one party to another.",
  },
  {
    term: "Unit",
    definition:
      "An individual occupiable space, such as an office suite, shop, warehouse, flat, house, storage unit or separately let parking space.",
  },
  {
    term: "Unit Group",
    definition:
      "A collection of units grouped together within Hobson.",
  },
  {
    term: "Unresolved Position",
    definition:
      "A position that cannot be established from the information currently recorded.",
  },
  {
    term: "Vacate Date",
    definition:
      "The date an occupier is expected or planned to leave. It does not by itself confirm that they actually left.",
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
      </main>
    </div>
  );
};

export default LearnGlossary;
