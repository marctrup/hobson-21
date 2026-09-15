import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { propertyGuides } from '@/content/propertyGuides';
const topics = [
  ['/lease-management-software', 'Lease management software'],
  ['/property-management-software', 'Property management software'],
  ['/property-portfolio-software', 'Property portfolio software'],
  ['/ai-lease-abstraction', 'AI lease abstraction'],
  ['/learn/glossary', 'Property and Hobson glossary'],
];
export function PropertyTopicLinks() {
  const { pathname } = useLocation();
  return <section className="border-t border-border bg-background py-14" aria-label="Related property resources">
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="font-serif text-3xl text-foreground">Continue your reading</h2>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div><h3 className="mb-3 font-semibold text-foreground">Property software</h3><ul className="space-y-3">{topics.filter(([path]) => path !== pathname).map(([path, label]) => <li key={path}><Link className="inline-flex items-center gap-2 text-muted-foreground underline underline-offset-4 hover:text-foreground" to={path}>{label}<ArrowUpRight className="h-4 w-4 shrink-0" /></Link></li>)}</ul></div>
        <div><h3 className="mb-3 font-semibold text-foreground">Buyer’s guides</h3><ul className="space-y-3">{propertyGuides.filter(g => `/learn/${g.slug}` !== pathname).map(g => <li key={g.slug}><Link className="text-muted-foreground underline underline-offset-4 hover:text-foreground" to={`/learn/${g.slug}`}>{g.title}</Link></li>)}</ul></div>
      </div>
    </div>
  </section>;
}
