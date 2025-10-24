import React from "react";
import { ArrowRight, FileText, Zap, CheckCircle, DollarSign, Clock } from "lucide-react";
import { SimpleButton } from "@/components/ui/simple-button";

export default function Banners() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Animated Banner Concepts</h1>
          <p className="text-muted-foreground">Based on Hobson's positioning statement</p>
        </div>

        {/* Banner 1: Document Flow Animation */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Concept 1: Document to Answer Flow</h2>
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg p-12 border border-border">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              <div className="flex-1 space-y-4 animate-fade-in">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <FileText className="w-12 h-12 animate-pulse" />
                  <div>
                    <p className="text-sm font-medium">Bloated Systems</p>
                    <p className="text-xs">Manual document review</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 mx-8">
                <div className="relative">
                  <ArrowRight className="w-16 h-16 text-primary animate-[slide-in-right_2s_ease-in-out_infinite]" />
                  <Zap className="w-6 h-6 text-primary absolute -top-2 -right-2 animate-pulse" />
                </div>
              </div>
              
              <div className="flex-1 space-y-4 animate-[fade-in_0.5s_ease-out_0.3s_both]">
                <div className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="w-12 h-12 text-primary animate-scale-in" />
                  <div>
                    <p className="text-sm font-bold">Instant Answers</p>
                    <p className="text-xs text-primary">AI-powered & referenced</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4">
              <SimpleButton variant="default" className="animate-[fade-in_0.5s_ease-out_0.6s_both]">
                Try Hobson <ArrowRight className="ml-2 w-4 h-4" />
              </SimpleButton>
            </div>
          </div>
        </div>

        {/* Banner 2: Three Benefits Cascade */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Concept 2: Benefit Cascade</h2>
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 rounded-lg p-12 border border-border">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-8 text-center">
                Transform Your Real Estate Workflow
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-lg p-6 animate-[fade-in_0.5s_ease-out] hover-scale">
                  <Clock className="w-10 h-10 text-primary mb-3 animate-pulse" />
                  <h4 className="font-bold mb-2">Save Time</h4>
                  <p className="text-sm text-muted-foreground">Instant answers from your documents</p>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6 animate-[fade-in_0.5s_ease-out_0.2s_both] hover-scale">
                  <DollarSign className="w-10 h-10 text-primary mb-3 animate-pulse" />
                  <h4 className="font-bold mb-2">Low Cost</h4>
                  <p className="text-sm text-muted-foreground">Lightweight & affordable solution</p>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6 animate-[fade-in_0.5s_ease-out_0.4s_both] hover-scale">
                  <CheckCircle className="w-10 h-10 text-primary mb-3 animate-pulse" />
                  <h4 className="font-bold mb-2">Build Trust</h4>
                  <p className="text-sm text-muted-foreground">Accurate, referenced responses</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <SimpleButton size="lg" className="animate-[fade-in_0.5s_ease-out_0.6s_both]">
                  Get Started Today <ArrowRight className="ml-2 w-4 h-4" />
                </SimpleButton>
              </div>
            </div>
          </div>
        </div>

        {/* Banner 3: Before/After Split */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Concept 3: Before/After Split</h2>
          <div className="relative overflow-hidden bg-background rounded-lg border border-border">
            <div className="grid md:grid-cols-2 divide-x divide-border">
              {/* Before */}
              <div className="p-12 bg-muted/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent" />
                <div className="relative z-10 space-y-6">
                  <div className="inline-block px-3 py-1 bg-destructive/10 text-destructive text-sm font-medium rounded-full">
                    Before
                  </div>
                  <h3 className="text-2xl font-bold">Bloated Systems</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2 animate-[fade-in_0.5s_ease-out]">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Expensive monthly fees</span>
                    </li>
                    <li className="flex items-start gap-2 animate-[fade-in_0.5s_ease-out_0.1s_both]">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Manual document searching</span>
                    </li>
                    <li className="flex items-start gap-2 animate-[fade-in_0.5s_ease-out_0.2s_both]">
                      <span className="text-destructive mt-1">✗</span>
                      <span>Time-consuming processes</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* After */}
              <div className="p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="relative z-10 space-y-6">
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full animate-pulse">
                    With Hobson
                  </div>
                  <h3 className="text-2xl font-bold">AI-Powered Simplicity</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 animate-[fade-in_0.5s_ease-out_0.3s_both]">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Lightweight & low cost</span>
                    </li>
                    <li className="flex items-start gap-2 animate-[fade-in_0.5s_ease-out_0.4s_both]">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Instant, reliable answers</span>
                    </li>
                    <li className="flex items-start gap-2 animate-[fade-in_0.5s_ease-out_0.5s_both]">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Referenced responses</span>
                    </li>
                  </ul>
                  
                  <SimpleButton className="animate-[fade-in_0.5s_ease-out_0.6s_both] w-full md:w-auto">
                    Transform Your Workflow <ArrowRight className="ml-2 w-4 h-4" />
                  </SimpleButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner 4: Compact Hero Style */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Concept 4: Compact Hero Banner</h2>
          <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-lg p-8 md:p-12 text-primary-foreground">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNiA2LTIuNjg2IDYtNi0yLjY4Ni02LTYtNnptMCAxMGMtMi4yMDkgMC00LTEuNzkxLTQtNHMxLjc5MS00IDQtNCA0IDEuNzkxIDQgNC0xLjc5MSA0LTQgNHoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold animate-fade-in">
                    Stop Wrestling With Documents
                  </h3>
                  <p className="text-primary-foreground/90 animate-[fade-in_0.5s_ease-out_0.2s_both]">
                    Get instant, AI-powered answers from your real estate files. Simple, affordable, accurate.
                  </p>
                </div>
                
                <SimpleButton 
                  variant="secondary" 
                  size="lg"
                  className="animate-[fade-in_0.5s_ease-out_0.4s_both] flex-shrink-0"
                >
                  Start Free <ArrowRight className="ml-2 w-4 h-4" />
                </SimpleButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
