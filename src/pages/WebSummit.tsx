import { Helmet } from "react-helmet-async";
import { CalendarDays, MapPin, Sparkles, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GlobalHeader } from "@/components/GlobalHeader";
import { AnswerFirst } from "@/components/AnswerFirst";

const title = "Hobson AI at Web Summit Lisbon 2026";
const officialListingUrl =
  "https://websummit.com/appearances/lis26/92785eda-a81c-4b0b-b4ba-f793e60bd34f/hobson-ai-%E2%80%94%E2%80%94-the-intelligence-layer-your-property-portfolio-runs-on/";
const description =
  "Hobson AI — the intelligence layer your property portfolio runs on — will be at Web Summit Lisbon 2026, 9–12 November, MEO Arena, as an ALPHA startup.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://hobsonschoice.ai/#organization",
      name: "Hobson AI",
      url: "https://hobsonschoice.ai",
      description: "The intelligence layer your property portfolio runs on.",
      sameAs: [officialListingUrl],
    },
    {
      "@type": "Event",
      name: "Web Summit Lisbon 2026",
      startDate: "2026-11-09",
      endDate: "2026-11-12",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "MEO Arena",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lisbon",
          addressCountry: "PT",
        },
      },
      organizer: { "@type": "Organization", name: "Web Summit", url: "https://websummit.com" },
      performer: { "@id": "https://hobsonschoice.ai/#organization" },
      url: "https://websummit.com/web-summit-2026/",
    },
    {
      "@type": "WebPage",
      name: title,
      url: "https://hobsonschoice.ai/web-summit",
      about: { "@id": "https://hobsonschoice.ai/#organization" },
      description,
    },
  ],
};

const particulars = [
  { icon: CalendarDays, label: "When", value: "9–12 November 2026" },
  { icon: MapPin, label: "Where", value: "MEO Arena, Lisbon — the exact spot is confirmed on the day" },
  { icon: Sparkles, label: "Standing", value: "Exhibiting as an ALPHA startup" },
];

const questions = [
  {
    q: "Is Hobson AI at Web Summit 2026?",
    a: "Yes. Hobson AI will exhibit at Web Summit Lisbon 2026, which runs from 9 to 12 November 2026 at the MEO Arena in Lisbon, as part of the ALPHA startup programme.",
  },
  {
    q: "Where can I meet Hobson AI in Lisbon?",
    a: "At the MEO Arena throughout the conference, 9–12 November 2026. The exact spot will not be known until the day — write to rochelle.t@hobsonschoice.ai and I shall confirm where to find me as soon as it is settled.",
  },
  {
    q: "Can I book a meeting with Hobson AI in advance?",
    a: "Yes. Write to rochelle.t@hobsonschoice.ai before the event and we shall arrange a time that suits you, so you need not queue. I shall confirm the exact meeting place once the spot is known.",
  },
];

export default function WebSummit() {
  return (
    <div className="min-h-screen bg-paper text-foreground">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://hobsonschoice.ai/web-summit" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://hobsonschoice.ai/web-summit" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <GlobalHeader />
      <main id="main-content">
        <section className="bg-bone-wash border-b border-bone py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brass-text">
              Where to meet me
            </p>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-normal leading-tight">
              Web Summit Lisbon 2026
            </h1>
            <p className="mt-6 text-lg font-medium">
              I shall be in Lisbon from 9 to 12 November, exhibiting as an ALPHA startup.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The exact spot will not be known until the day — write to me at
              rochelle.t@hobsonschoice.ai and I shall confirm where to find me.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6">
          <AnswerFirst>
            Yes — Hobson AI, the intelligence layer your property portfolio runs on, will be at
            Web Summit Lisbon 2026, at the MEO Arena in Lisbon from 9 to 12 November 2026,
            exhibiting as an ALPHA startup. The exact meeting spot is confirmed on the day;
            write to rochelle.t@hobsonschoice.ai and I shall tell you where to find me.
          </AnswerFirst>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-14 sm:py-16">
          <h2 className="font-serif text-3xl sm:text-4xl">The particulars</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {particulars.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-bone bg-document-white p-6"
              >
                <item.icon className="h-5 w-5 text-brass-text" aria-hidden="true" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 font-medium leading-snug">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-muted-foreground leading-relaxed">
            ALPHA is Web Summit's programme for early-stage companies, and places there are
            chosen from thousands of applications. We are glad of the invitation.
          </p>
        </section>

        <section className="border-y border-bone bg-zebra">
          <div className="max-w-3xl mx-auto px-6 py-14 sm:py-16">
            <h2 className="font-serif text-3xl sm:text-4xl">What I shall show you</h2>
            <div className="mt-6 space-y-5 text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">
                The intelligence layer your property portfolio runs on.
              </p>
              <p>
                I read your property documents — leases, licences, certificates, management
                agreements — and turn them into structured, evidence-backed answers, each one
                linked to the exact clause and page it came from.
              </p>
              <p>
                At the show you may ask me about your own portfolio, watch me prepare the
                information and the evidence, and see how a decision is made: preparation is
                mine, decision is yours.
              </p>
            </div>
            <Button asChild variant="link" className="mt-4 h-auto p-0 text-brass-text">
              <Link to="/">
                Learn more about me
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
          <h2 className="font-serif text-3xl sm:text-4xl">Questions people ask me</h2>
          <div className="mt-8 space-y-5">
            {questions.map((item) => (
              <article
                key={item.q}
                className="rounded-lg border border-bone bg-document-white p-6 sm:p-8"
              >
                <h3 className="font-serif text-2xl leading-snug">{item.q}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{item.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-bone-wash border-t border-bone py-14 sm:py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl">Do write before you travel</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              If you would like a proper conversation rather than a stand-side hello, send a
              note and we shall put a time in the diary before Lisbon begins.
            </p>
            <Button asChild className="mt-7">
              <a href="mailto:rochelle.t@hobsonschoice.ai">
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                Arrange a meeting
              </a>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
