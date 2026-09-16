import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Mail } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Button } from "@/components/ui/button";

const publicationDates = [
  { iso: "2019-02-14", label: "14 February 2019" },
  { iso: "2019-03-12", label: "12 March 2019" },
  { iso: "2020-11-11", label: "11 November 2020" },
];
const coverage = [
  { publication: "Property Reporter", title: "In the Spotlight with Marc Trup", description: "Founder interview covering Marc’s background in property, why he created Arthur Online and his approach to property technology.", url: "https://www.propertyreporter.co.uk/in-the-spotlight/in-the-spotlight-with-marc-trup.html", cta: "Read on Property Reporter" },
  { publication: "TechRound", title: "Modernising the Property Market: Arthur Online", description: "Interview with Marc Trup, then CEO and founder of Arthur Online, discussing the business, property technology and the company’s plans.", url: "https://techround.co.uk/business/modernising-the-property-market-arthur-online/", cta: "Read on TechRound" },
  { publication: "Mennie Talks Podcast", title: "Interview with Marc Trup — Co-founder of Arthur Online", description: "Long-form interview covering Marc’s entrepreneurial journey, property investing and the creation of Arthur Online.", url: "https://reecemennie.podbean.com/e/season-2-007-interview-with-marc-trup-co-founder-of-property-management-platform-arthur-online/", cta: "Listen to the interview" },
];

const title = "Press & Media | Hobson AI";
const description = "Press, interviews and media coverage of Hobson AI and founders Marc and Rochelle Trup, including their previous work building property technology platform Arthur Online.";

export default function Press() {
  return (
    <div className="min-h-screen bg-paper text-foreground">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://hobsonschoice.ai/press" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://hobsonschoice.ai/press" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@graph": [
          { "@type": "Organization", "@id": "https://hobsonschoice.ai/#organization", name: "Hobson AI", url: "https://hobsonschoice.ai", founder: [{ "@id": "https://hobsonschoice.ai/#marc-trup" }, { "@id": "https://hobsonschoice.ai/#rochelle-trup" }] },
          { "@type": "Person", "@id": "https://hobsonschoice.ai/#marc-trup", name: "Marc Trup", url: "https://hobsonschoice.ai/founder" },
          { "@type": "Person", "@id": "https://hobsonschoice.ai/#rochelle-trup", name: "Rochelle Trup" },
          { "@type": "CollectionPage", name: title, url: "https://hobsonschoice.ai/press", about: { "@id": "https://hobsonschoice.ai/#organization" } },
        ] })}</script>
      </Helmet>
      <GlobalHeader />
      <main id="main-content">
        <section className="bg-bone-wash border-b border-bone py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h1 className="font-serif text-4xl sm:text-5xl font-normal">Press &amp; Media</h1>
            <p className="mt-6 text-lg font-medium">Hobson AI is being built by property people to change how property work gets done.</p>
            <p className="mt-4 text-muted-foreground leading-relaxed">News, interviews and commentary from Hobson and its founders, together with selected coverage from their previous work in PropTech.</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
          <h2 className="font-serif text-3xl sm:text-4xl">Independent Coverage</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">Selected articles, interviews and commentary published by independent property industry organisations.</p>
          <article className="mt-8 max-w-3xl rounded-lg border border-bone bg-document-white p-6 sm:p-8">
            <p className="font-semibold">Property Investors Bureau</p>
            <h3 className="mt-4 font-serif text-2xl leading-snug">How AI Recognises Patterns – Like a Boxer and a Trainer</h3>
            <p className="mt-4 text-muted-foreground">Marc Trup, Director of Hobson AI</p>
            <p className="mt-1 text-sm text-muted-foreground">Published <time dateTime="2025-12-07">7 December 2025</time></p>
            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:gap-6">
              <Button asChild variant="link" className="h-auto p-0 text-brass-text whitespace-normal text-left justify-start">
                <a href="https://pibuk.org/how-ai-recognises-patterns-like-a-boxer-and-a-trainer/" target="_blank" rel="noopener noreferrer">Read on Property Investors Bureau<ExternalLink className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" /></a>
              </Button>
              <Button asChild variant="link" className="h-auto p-0 text-brass-text whitespace-normal text-left justify-start">
                <Link to="/blog/how-ai-recognises-patterns-tenancy-agreements">Read the article on Hobson<ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" /></Link>
              </Button>
            </div>
          </article>
        </section>

        <section className="border-y border-bone bg-zebra">
          <div className="max-w-6xl mx-auto px-6 py-14 sm:py-16">
            <h2 className="font-serif text-3xl">Founder Track Record</h2>
            <p className="mt-4 max-w-3xl text-muted-foreground leading-relaxed">Hobson’s founders have spent more than a decade building technology for the property industry. Before Hobson, Marc and Rochelle Trup co-founded Arthur Online, the property management platform subsequently acquired by Aareon.</p>
            <p className="mt-3 text-muted-foreground">Here is selected independent coverage from that journey.</p>
            <div className="grid md:grid-cols-3 gap-6 mt-9">
              {coverage.map((item, index) => (
                <article key={item.url} className="flex flex-col rounded-lg border border-bone bg-document-white p-6">
                  <p className="text-xs font-medium text-brass-text">FROM THE ARTHUR ONLINE YEARS</p>
                  <p className="mt-5 font-semibold">{item.publication}</p>
                  <time dateTime={publicationDates[index].iso} className="mt-1 text-sm text-muted-foreground">{publicationDates[index].label}</time>
                  <h3 className="mt-4 font-serif text-2xl leading-snug">{item.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  <div className="mt-auto pt-6">
                    <Button asChild variant="link" className="h-auto p-0 text-brass-text whitespace-normal text-left justify-start">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">{item.cta}<ExternalLink className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" /></a>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
          <h2 className="font-serif text-3xl sm:text-4xl">From Arthur to Hobson</h2>
          <div className="mt-6 space-y-5 text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground">Marc and Rochelle Trup have spent years working at the intersection of property and technology.</p>
            <p>They co-founded Arthur Online after experiencing first-hand the complexity of managing property portfolios. Arthur grew into an established property management platform before being acquired by Aareon.</p>
            <p>That experience exposed a bigger problem.</p>
            <p>Traditional property software became very good at storing information, but property professionals still had to read the documents, understand what they meant, remember what needed doing and then do the work.</p>
            <p>Hobson was created to tackle that next problem.</p>
            <p className="font-serif text-2xl text-foreground">Not another property management system. An AI co-worker built for property.</p>
          </div>
          <Button asChild variant="link" className="mt-6 p-0 text-brass-text"><Link to="/founder">Meet Marc Trup <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </section>

        <section className="bg-bone-wash border-t border-bone py-14 sm:py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl">Talk to Hobson</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">For interviews, commentary, podcasts, speaking opportunities or press enquiries, get in touch with the Hobson team.</p>
            <Button asChild className="mt-7"><a href="mailto:info@hobsonschoice.ai"><Mail className="mr-2 h-4 w-4" />Media enquiries</a></Button>
          </div>
        </section>
      </main>
      
    </div>
  );
}