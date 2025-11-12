import React from 'react';
import { Helmet } from 'react-helmet-async';
import { GlobalHeader } from '@/components/GlobalHeader';
import owlMascot from "@/assets/owl-mascot.png";

const LearnIntroduction = () => {
  return (
    <>
      <Helmet>
        <title>Introduction - Hobson AI</title>
        <meta name="description" content="Learn about Hobson AI - an intelligent property document management assistant that reads and understands your documents to deliver accurate, cited answers instantly." />
        <meta name="keywords" content="Hobson AI introduction, property management AI, document intelligence, getting started" />
        <link rel="canonical" href="https://hobsonschoice.ai/learn/introduction" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <GlobalHeader />
        
        <main id="main-content" className="flex-1">
          <div className="container mx-auto p-4 md:p-8 max-w-6xl mt-[10px]">
            {/* Welcome header above video - responsive alignment */}
            <div className="mb-8 md:mb-12 text-center md:text-left" 
                 style={{ 
                   marginLeft: 'auto', 
                   marginRight: 'auto',
                   maxWidth: '100%'
                 }}>
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <img src={owlMascot} alt="Hobson AI Owl Mascot" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome to Hobson AI</h1>
              </div>
              <p className="text-base md:text-lg text-muted-foreground">Learn about Hobson and how to get started</p>
            </div>
            
            {/* Description text below video - responsive alignment */}
            <div className="text-center md:text-left mt-6 md:mt-12 px-4 md:px-0" 
                 style={{ 
                   marginLeft: 'auto', 
                   marginRight: 'auto',
                   maxWidth: '100%'
                 }}>
              <p className="text-base md:text-lg text-muted-foreground mb-6">
                Hobson is an AI-powered assistant that reads and understands property documents to deliver accurate, cited answers instantly.
              </p>
              
              <div className="space-y-4 text-muted-foreground">
                <h2 className="text-lg font-semibold text-foreground">How Hobson works:</h2>
                
                <div className="space-y-3">
                  <p>
                    <strong className="text-foreground">1. Upload your documents</strong><br />
                    Simply drag your property documents into Hobson. This is the first step to unlocking intelligent insights.
                  </p>
                  
                  <p>
                    <strong className="text-foreground">2. Hobson reads and understands</strong><br />
                    Hobson uses AI to carefully read through each document. This process takes some time depending on the size and complexity of your files. The information is securely stored on our servers so you can access it anytime.
                  </p>
                  
                  <p>
                    <strong className="text-foreground">3. Get notified when ready</strong><br />
                    Once Hobson has finished reading and understanding your documents, you'll receive an email notification letting you know everything is ready.
                  </p>
                  
                  <p>
                    <strong className="text-foreground">4. Ask questions, get instant answers</strong><br />
                    With your documents processed, you can ask Hobson anything. AI powers the entire process—from reading and extracting key information to delivering accurate, cited answers instantly.
                  </p>
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm">
                    <strong className="text-foreground">Coming soon:</strong> Hobson will connect directly to Dropbox, Google Drive, and other cloud storage platforms, making it even easier to access your documents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default LearnIntroduction;
