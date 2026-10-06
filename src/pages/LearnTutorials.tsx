import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Film } from 'lucide-react';
import { GlobalHeader } from '@/components/GlobalHeader';
import { tutorials } from '@/content/tutorials';
import hobson from '@/assets/owl-mascot.png';

const LearnTutorials = () => (
  <div className="min-h-screen bg-paper text-ink">
    <Helmet>
      <title>Tutorials — Short demonstrations of Hobson AI</title>
      <meta name="description" content="Short demonstrations of Hobson at work with papers, cited answers and the map. A collection of useful examples, with videos in preparation." />
      <link rel="canonical" href="https://hobsonschoice.ai/learn/tutorials" />
      <meta property="og:title" content="Tutorials — Short demonstrations of Hobson AI" />
      <meta property="og:description" content="Short demonstrations of useful things I can do. Papers, conversations and the map — videos in preparation." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://hobsonschoice.ai/learn/tutorials" />
      <meta name="twitter:card" content="summary" />
    </Helmet>
    <GlobalHeader />
    <main className="mx-auto max-w-6xl px-6 pb-24 sm:px-10">
      <header className="border-b border-bone pb-10 pt-10 sm:pb-12 sm:pt-14">
        <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-brass-text hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Learn
        </Link>
        <h1 className="mt-8 font-serif text-4xl font-normal sm:text-5xl">Tutorials</h1>
        <p className="mt-4 font-serif text-xl italic text-ink-muted sm:text-2xl">Short demonstrations of useful things I can do.</p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          You can start anywhere. Each clip shows one small part of how I work,
          with related clips nearby if you want to keep exploring.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-x-12 gap-y-14 pt-12 lg:grid-cols-2 lg:gap-y-16">
        {tutorials.map((tutorial) => {
          const related = tutorials.find((item) => item.id === tutorial.relatedId);
          return (
            <article key={tutorial.id} id={tutorial.id} className="min-w-0 scroll-mt-28">
              <div className="relative aspect-video overflow-hidden rounded-sm border border-bone bg-document-white">
                {tutorial.youtubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${tutorial.youtubeId}`}
                    title={tutorial.title}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 bg-lavender-wash px-6">
                    <img src={hobson} alt="Hobson" className="h-24 w-24 object-contain sm:h-28 sm:w-28" loading="lazy" width={112} height={112} />
                    <span className="inline-flex items-center gap-2 text-sm text-ink-muted"><Film className="h-4 w-4 text-brass-text" aria-hidden="true" /> Demonstration coming shortly</span>
                  </div>
                )}
              </div>
              <p className="mt-5 text-xs text-ink-faint">{tutorial.context}</p>
              <h2 className="mt-2 font-serif text-2xl font-normal leading-snug sm:text-3xl">{tutorial.title}</h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">{tutorial.description}</p>
              {related && (
                <a href={`#${related.id}`} className="mt-5 inline-flex max-w-full items-start gap-2 text-sm text-brass-text hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span><span className="text-ink-faint">You may also find useful</span><br />{related.title}</span>
                </a>
              )}
            </article>
          );
        })}
      </div>
    </main>
  </div>
);

export default LearnTutorials;