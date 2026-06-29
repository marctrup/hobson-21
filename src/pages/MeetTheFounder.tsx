import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { YouTubeVideoSection } from "@/components/homepage/YouTubeVideoSection";

const MeetTheFounder = () => {
  return (
    <>
      <Helmet>
        <title>Meet the Founder | Hobson AI</title>
        <meta
          name="description"
          content="Marc Trup on why he built Hobson — an AI co-worker designed specifically for property work."
        />
        <link rel="canonical" href="https://hobsonschoice.ai/founder" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <GlobalHeader />

        <main id="main-content" className="overflow-x-hidden">
          {/* Hero */}
          <section className="pt-16 sm:pt-20 pb-8 sm:pb-12">
            <div className="container mx-auto px-4 max-w-3xl text-center">
              <h1 className="font-bold leading-tight text-4xl sm:text-5xl md:text-6xl text-foreground">
                Meet the <span className="text-primary">Founder</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Hobson was built by property people who believed there had to be
                a better way to manage property work.
              </p>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground/90 leading-relaxed">
                In this short video, Marc Trup explains the vision behind Hobson
                and why property deserves its own AI co-worker.
              </p>
            </div>
          </section>

          {/* Video */}
          <section className="pb-12 sm:pb-16">
            <div className="container mx-auto px-4">
              <div className="max-w-[1000px] mx-auto">
                <div
                  className="rounded-2xl bg-card p-3 sm:p-5 border border-border"
                  style={{ boxShadow: "0 30px 60px -30px hsl(var(--primary) / 0.35), 0 10px 30px -15px hsl(var(--primary) / 0.2)" }}
                >
                  <YouTubeVideoSection
                    videoId="MXutUHZFXIs"
                    title=""
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Below video copy */}
          <section className="pb-16 sm:pb-20">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="rounded-2xl bg-card border border-border p-8 sm:p-12 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                  Why I built Hobson
                </h2>
                <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Property teams spend too much time chasing documents, dates,
                    obligations and decisions across systems that were never
                    designed to think with them.
                  </p>
                  <p>Hobson exists to change that.</p>
                  <p>
                    One conversation. A quiet team behind it. Built specifically
                    for the way property work actually happens.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="pb-20 sm:pb-28">
            <div className="container mx-auto px-4 max-w-3xl text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 w-full sm:w-auto"
                >
                  See how Hobson works
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center rounded-md border border-primary/20 bg-primary/10 px-6 py-3 text-base font-medium text-primary transition-colors hover:bg-primary/15 w-full sm:w-auto"
                >
                  View pricing
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default MeetTheFounder;
