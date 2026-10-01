import { Helmet } from "react-helmet-async";
import { Mail, ExternalLink } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { AnswerFirst } from "@/components/AnswerFirst";
import hobsonHighFive from "@/assets/hobson-high-five.png.asset.json";

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
    q: "Where can I meet Hobson AI in Lisbon?",
    a: "Within the MEO Arena. The exact spot will not be known until the day — write to Rochelle at rochelle.t@hobsonschoice.ai and she will tell you where to find me as soon as it is settled.",
    cta: "Where to find me",
  },
  {
    q: "Can I book a meeting with Hobson AI in advance?",
    a: "Yes. Write to Rochelle at rochelle.t@hobsonschoice.ai before the event and she will put a time in the diary, so you need not queue. Once the spot is known, she will tell you where we are to meet.",
    cta: "Arrange a meeting",
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
            <img
              src={hobsonHighFive.url}
              alt="Hobson the owl high-fiving a guest"
              className="mt-8 mx-auto w-44 sm:w-52 h-auto"
              loading="eager"
            />
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pt-10 sm:pt-12">
          <AnswerFirst variant="manuscript">
            Hobson AI, the intelligence layer your property portfolio runs on, will be at
            Web Summit Lisbon 2026, at the MEO Arena in Lisbon from 9 to 12 November 2026.
          </AnswerFirst>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-16 sm:pb-20">
          <h2 className="border-b border-brass/30 pb-6 font-serif text-3xl italic sm:text-4xl">
            Questions people ask me
          </h2>
          <div className="divide-y divide-bone">
            {questions.map((item) => (
              <article key={item.q} className="group py-8 sm:py-9">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-xl">
                    <h3 className="font-serif text-xl leading-snug tracking-tight sm:text-2xl">
                      {item.q}
                    </h3>
                    <p className="mt-3 leading-relaxed text-ink-muted">{item.a}</p>
                  </div>
                  <a
                    href="mailto:rochelle.t@hobsonschoice.ai"
                    className="inline-flex shrink-0 items-center gap-2 self-start border border-brass px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brass-text transition-colors duration-300 hover:bg-brass hover:text-primary-foreground md:mt-1"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    {item.cta}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
