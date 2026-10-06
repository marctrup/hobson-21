import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Film, Play, X } from 'lucide-react';
import { GlobalHeader } from '@/components/GlobalHeader';
import { tutorials, type Tutorial } from '@/content/tutorials';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import hobson from '@/assets/owl-mascot.png';

const TutorialCard = ({ tutorial }: { tutorial: Tutorial }) => {
  const [open, setOpen] = useState(false);
  const related = tutorials.find((item) => item.id === tutorial.relatedId);

  return (
    <article id={tutorial.id} className="min-w-0 scroll-mt-28">
      <div className="relative aspect-video overflow-hidden rounded-sm border border-bone bg-document-white">
        {tutorial.youtubeId ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label={`Play: ${tutorial.title}`}
                className="group flex h-full w-full cursor-pointer flex-col items-center justify-center gap-6 bg-lavender-wash px-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brass"
              >
                <img
                  src={hobson}
                  alt="Hobson"
                  className="h-24 w-24 object-contain transition duration-300 group-hover:-translate-y-1 sm:h-28 sm:w-28"
                  loading="lazy"
                  width={112}
                  height={112}
                />
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-brass bg-paper/95 shadow-sm transition duration-300 group-hover:bg-paper group-hover:shadow-md"
                >
                  <Play className="ml-0.5 h-5 w-5 text-brass-text" aria-hidden="true" />
                </span>
              </button>
            </DialogTrigger>
            <DialogContent
              className="!gap-0 !border-0 !bg-transparent !p-0 !shadow-none [&>button]:hidden"
              style={{ width: 'min(92vw, 940px, calc((84vh - 130px) * 16 / 9))', maxWidth: 'none' }}
            >
              <DialogTitle className="sr-only">{tutorial.title}</DialogTitle>
              <DialogDescription className="sr-only">{tutorial.description}</DialogDescription>
              <div
                className="relative rounded-sm border border-bone bg-bone-wash p-2 sm:p-3"
                style={{ boxShadow: '0 30px 60px -30px rgba(45,45,45,0.45), 0 10px 30px -15px rgba(45,45,45,0.20)' }}
              >
                <DialogClose
                  aria-label="Stop the demonstration"
                  className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-brass bg-paper text-brass-text transition duration-200 hover:bg-brass hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </DialogClose>
                <div className="aspect-video overflow-hidden rounded-sm bg-ink">
                  {open && (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${tutorial.youtubeId}?autoplay=1&rel=0`}
                      title={tutorial.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="mt-3 flex flex-col gap-3 border-t border-bone pt-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs text-ink-faint">{tutorial.context}</p>
                    <p className="mt-1 font-serif text-lg italic leading-snug text-ink">{tutorial.title}</p>
                  </div>
                  <DialogClose className="inline-flex shrink-0 items-center border border-brass px-4 py-2 text-xs uppercase tracking-[0.18em] text-brass-text transition duration-200 hover:bg-brass hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass">
                    Close
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
};

const LearnTutorials = () => (
  <div className="min-h-screen bg-paper text-ink">
    <Helmet>
      <title>A few useful tips — Short demonstrations of Hobson AI</title>
      <meta name="description" content="Short demonstrations of Hobson at work with papers, cited answers and the map. A collection of useful examples, with more clips being added." />
      <link rel="canonical" href="https://hobsonschoice.ai/learn/tutorials" />
      <meta property="og:title" content="A few useful tips — Short demonstrations of Hobson AI" />
      <meta property="og:description" content="Short demonstrations of useful things I can do. Papers, conversations and the map — more clips being added." />
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
        <h1 className="mt-8 font-serif text-4xl font-normal sm:text-5xl">A few useful tips</h1>
        <p className="mt-4 font-serif text-xl italic text-ink-muted sm:text-2xl">Short demonstrations of useful things I can do.</p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          You can start anywhere. Each clip shows one small part of how I work,
          with related clips nearby if you want to keep exploring.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-x-12 gap-y-14 pt-12 lg:grid-cols-2 lg:gap-y-16">
        {tutorials.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </div>
    </main>
  </div>
);

export default LearnTutorials;
