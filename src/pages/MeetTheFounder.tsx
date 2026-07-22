import React from "react";
import { Helmet } from "react-helmet-async";
import { GlobalHeader } from "@/components/GlobalHeader";
import { YouTubeVideoSection } from "@/components/homepage/YouTubeVideoSection";
import founderPhoto from "@/assets/founder-photo.jpg.asset.json";

const MeetTheFounder = () => {
  return (
    <>
      <Helmet>
        <title>Meet a Co-Founder | Hobson AI</title>
        <meta
          name="description"
          content="Marc Trup on why he built Hobson — an AI co-worker designed specifically for property work."
        />
        <link rel="canonical" href="https://hobsonschoice.ai/founder" />
      </Helmet>

      <div className="min-h-screen" style={{ background: '#FCFAF7' }}>
        <GlobalHeader />

        <main id="main-content" className="overflow-x-hidden">
          {/* Hero */}
          <section className="pt-16 sm:pt-20 pb-8 sm:pb-12">
            <div className="container mx-auto px-4 max-w-3xl text-center">
              <h1 className="font-bold leading-tight text-4xl sm:text-5xl md:text-6xl text-foreground">
                Meet a <span style={{ color: '#B4914F' }}>Co-Founder</span>
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
              <div className="max-w-[1000px] mx-auto relative">
                <div
                  className="absolute -inset-8 rounded-[2.5rem] blur-3xl opacity-60 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 30% 30%, rgba(180,145,79,0.18), transparent 70%)' }}
                />
                <div
                  className="relative rounded-2xl p-3 sm:p-5"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EDE7DA',
                    boxShadow: '0 30px 60px -30px rgba(45,45,45,0.30), 0 10px 30px -15px rgba(45,45,45,0.18)',
                  }}
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
              <div
                className="rounded-2xl p-8 sm:p-12"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #EDE7DA',
                  boxShadow: '0 10px 30px -20px rgba(45,45,45,0.15)',
                }}
              >
              <div className="flex flex-col items-center gap-4 mb-8">
                <img
                  src={founderPhoto.url}
                  alt="Marc Trup, Co-Founder of Hobson"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-lg"
                  style={{ border: '2px solid #B4914F' }}
                />
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
                  Why we Built Hobson
                </h2>
              </div>
              <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    For over 30 years we've worked in property.
                  </p>
                  <p>
                    We didn't build Hobson because the world needed another property system.
                  </p>
                  <p>
                    We built it because we believed property deserved a better way of working.
                  </p>
                  <p>
                    One that thinks alongside people, quietly takes care of the routine work and gives professionals more time to focus on what really matters.
                  </p>
                </div>
              </div>
            </div>
          </section>


        </main>
      </div>
    </>
  );
};

export default MeetTheFounder;
