import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import { GlobalHeader } from '@/components/GlobalHeader';
import { Button } from '@/components/ui/button';
import { PropertyTopicLinks } from '@/components/PropertyTopicLinks';
import { propertyGuides } from '@/content/propertyGuides';
import evidencePack from '@/assets/evidence-pack-example.png.asset.json';

export default function PropertyGuide({ slug }: { slug: string }) {
  const guide = propertyGuides.find(item => item.slug === slug);
  if (!guide) return null;
  const url = `https://hobson-21.lovable.app/learn/${guide.slug}`;
  const faqSections = guide.sections.filter(section => section.title.trim().endsWith('?'));
  const faqEntries = faqSections.length
    ? faqSections.map(section => ({ '@type': 'Question', name: section.title, acceptedAnswer: { '@type': 'Answer', text: [...section.paragraphs, ...(section.points ? ['Key points: ' + section.points.join(' ')] : [])].join('\n\n') } }))
    : (guide.title.trim().endsWith('?') ? [{ '@type': 'Question', name: guide.title, acceptedAnswer: { '@type': 'Answer', text: guide.summary } }] : []);
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', headline: guide.title, description: guide.description, mainEntityOfPage: url, author: { '@type': 'Organization', name: 'Hobson' }, publisher: { '@type': 'Organization', name: 'Hobson AI Limited' } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Learn', item: 'https://hobson-21.lovable.app/learn' }, { '@type': 'ListItem', position: 2, name: guide.title, item: url }] },
    ...(faqEntries.length ? [{ '@type': 'FAQPage', mainEntity: faqEntries }] : []),
  ] };
  return <div className="min-h-screen bg-background text-foreground">
    <Helmet><title>{guide.seoTitle}</title><meta name="description" content={guide.description} /><link rel="canonical" href={url} /><meta property="og:title" content={guide.seoTitle} /><meta property="og:description" content={guide.description} /><meta property="og:url" content={url} /><meta property="og:type" content="article" /><script type="application/ld+json">{JSON.stringify(schema)}</script></Helmet>
    <GlobalHeader />
    <main>
      <header className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
          <Link to="/learn" className="text-sm text-muted-foreground underline underline-offset-4">Learn / Buyer’s guides</Link>
          <h1 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">{guide.title}</h1>
          <p className="mt-7 text-lg leading-relaxed text-muted-foreground">{guide.summary}</p>
          <p className="mt-6 text-sm text-muted-foreground">By Hobson · UK property teams</p>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="In this guide" className="self-start lg:sticky lg:top-28"><h2 className="mb-4 font-semibold">In this guide</h2><ol className="space-y-3 text-sm leading-relaxed">{guide.sections.map(section => <li key={section.id}><a className="text-muted-foreground underline-offset-4 hover:underline hover:text-foreground" href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav>
        <article className="min-w-0 max-w-3xl">
          {guide.sections.map(section => <section key={section.id} id={section.id} className="mb-12 scroll-mt-28"><h2 className="mb-5 font-serif text-3xl leading-tight">{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph} className="mb-4 text-base leading-8 text-muted-foreground">{paragraph}</p>)}{section.points && <ul className="mt-5 list-disc space-y-3 pl-5 text-muted-foreground">{section.points.map(point => <li key={point} className="pl-1 leading-7">{point}</li>)}</ul>}</section>)}
          {slug === 'what-is-lease-management-software' && <figure className="mb-12"><img src={evidencePack.url} alt="Hobson Evidence Pack example showing document evidence for a property answer" className="h-auto w-full rounded-lg border border-border" loading="lazy" /><figcaption className="mt-3 text-sm text-muted-foreground">A Hobson Evidence Pack example. Source evidence should be checked before acting.</figcaption></figure>}
          <section className="border-t border-border pt-8"><h2 className="font-serif text-2xl">Sources and further detail</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Official product descriptions inform this guide; they are not independent performance tests. Check suppliers for current capabilities and terms.</p><ul className="mt-4 space-y-3">{guide.sources.map(source => <li key={source.url}>{source.url.startsWith('/') ? <Link className="text-muted-foreground underline underline-offset-4" to={source.url}>{source.label}</Link> : <a className="text-muted-foreground underline underline-offset-4" href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>}</li>)}</ul></section>
          <div className="mt-12 flex flex-col items-start gap-4"><Button asChild className="h-auto whitespace-normal py-3 text-left"><Link to={guide.target}>{guide.targetLabel}<ArrowRight className="ml-2 h-4 w-4 shrink-0" /></Link></Button><a className="underline underline-offset-4" href="mailto:info@hobsonschoice.ai">Request a conversation</a></div>
        </article>
      </div>
      <PropertyTopicLinks />
    </main>
  </div>;
}
