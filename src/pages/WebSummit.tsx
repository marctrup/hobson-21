import { Helmet } from "react-helmet-async";
import { Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalHeader } from "@/components/GlobalHeader";
import { AnswerFirst } from "@/components/AnswerFirst";

const title = "Hobson AI at Web Summit Lisbon 2026";
const officialListingUrl =
  "https://websummit.com/appearances/lis26/92785eda-a81c-4b0b-b4ba-f793e60bd34f/hobson-ai-%E2%80%94-the-intelligence-layer-your-property-portfolio-runs-on/";
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

const questions = [
  {
    q: "Is Hobson AI at Web Summit 2026?",
    a: "Yes — I am exhibiting from the doors opening on the 9th to the close on the 12th, as one of the ALPHA startups: Web Summit's programme for early-stage companies, chosen from thousands of applications.",
  },
  {
    q: "Where can I meet Hobson AI in Lisbon?",
    a: "Within the MEO Arena. The exact spot will not be known until the day — write to rochelle.t@hobsonschoice.ai and I shall tell you where to find me as soon as it is settled.",
  },
  {
    q: "Can I book a meeting with Hobson AI in advance?",
    a: "Yes. Write to rochelle.t@hobsonschoice.ai before the event and we shall put a time in the diary, so you need not queue. Once the spot is known, I shall tell you where we are to meet.",
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
            <a
              href={officialListingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brass-text underline decoration-brass/40 underline-offset-4 hover:decoration-brass"
            >
              My official Web Summit listing
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6">
          <AnswerFirst>
            Hobson AI, the intelligence layer your property portfolio runs on, will be at
            Web Summit Lisbon 2026, at the MEO Arena in Lisbon from 9 to 12 November 2026,
            exhibiting as an ALPHA startup. The exact meeting spot is confirmed on the day;
            write to rochelle.t@hobsonschoice.ai and I shall tell you where to find me.
          </AnswerFirst>
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
