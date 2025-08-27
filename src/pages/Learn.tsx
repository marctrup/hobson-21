import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { HomepageHeader } from '@/components/homepage/HomepageHeader';
import { UseCasesContent } from '@/components/UseCasesContent';

const Learn = () => {
  return (
    <>
      <Helmet>
        <title>Learn - Hobson's Choice AI</title>
        <meta name="description" content="Learn how to use Hobson's Choice AI with our comprehensive guides, tutorials, and documentation." />
      </Helmet>
      
      <HomepageHeader />
      
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Learn Hobson's Choice AI</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Comprehensive guides, tutorials, and documentation to help you get the most out of our AI-powered property management platform.
            </p>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Getting Started</h3>
                <p className="text-muted-foreground mb-4">
                  Learn the basics of uploading documents and asking your first questions.
                </p>
                <Link to="/blog" className="text-primary hover:underline">
                  Read Guides →
                </Link>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Features Overview</h3>
                <p className="text-muted-foreground mb-4">
                  Discover all the powerful features available in Hobson's Choice AI.
                </p>
                <Link to="/blog" className="text-primary hover:underline">
                  Explore Features →
                </Link>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
                <p className="text-muted-foreground mb-4">
                  Tips and tricks from our experts to maximize your productivity.
                </p>
                <Link to="/blog" className="text-primary hover:underline">
                  Learn More →
                </Link>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Use Cases & Success Stories</h2>
              <UseCasesContent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Learn;