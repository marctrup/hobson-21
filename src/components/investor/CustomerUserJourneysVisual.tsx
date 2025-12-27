import { Card } from "@/components/ui/card";
import { User, Target, MessageSquare, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";

interface Stage {
  stage: string;
  title: string;
  touchpoints: string[];
  thinks: string;
  does: string[];
  feels: string;
  blocks: string;
  improvement: string;
}

export const CustomerUserJourneysVisual = () => {
  const stages: Stage[] = [
    {
      stage: "Stage 1",
      title: "Discovery & Outreach",
      touchpoints: [
        "Personal introduction",
        "Initial proposal document",
        "Discovery meeting with the operational team"
      ],
      thinks: "This looks promising. AI could finally simplify our data access problems.",
      does: [
        "Reviews proposal materials",
        "Engages in discovery conversations",
        "Evaluates whether the concept is worth exploring"
      ],
      feels: "Optimistic and curious about the potential benefit.",
      blocks: "Unclear grasp of Hobson's full capabilities. Concerns about how it would sit alongside existing systems and data concerns with AI",
      improvement: "Provide clearer proposals supported by early examples of real outputs."
    },
    {
      stage: "Stage 2",
      title: "Problem Definition & Alignment",
      touchpoints: [
        "Strategy meeting",
        "Discovery summary and insights report",
        "Follow-up alignment document"
      ],
      thinks: "They understand our challenges. But will the solution actually match our workflow?",
      does: [
        "Confirms key operational pain points",
        "Tests whether Hobson's vision aligns with their processes"
      ],
      feels: "Measured and cautious — alignment feels close, but expectations need precision.",
      blocks: "Worry that the final product may differ from early expectations",
      improvement: "Introduce a no-code preview to align expectations visually before committing to the MVP."
    },
    {
      stage: "Stage 3",
      title: "Data Sharing & Preparation",
      touchpoints: [
        "NDA signing",
        "Uploading initial document sets",
        "Clarification calls on file structure and expected outputs"
      ],
      thinks: "We're stretched — gathering these documents will take time. Will the system handle messy files?",
      does: [
        "Instructs someone to collect documents from multiple internal teams",
        "Coordinates data transfer and clarifies required materials"
      ],
      feels: "Frustrated by the time commitment and anxious about data accuracy.",
      blocks: "Heavy administrative work to gather documents and concerns about security and reliability",
      improvement: "Provide a simple data checklist, secure upload tool, and hands-on support during document preparation."
    },
    {
      stage: "Stage 4",
      title: "No-Code Deployment & Early Testing",
      touchpoints: [
        "Access to basic AI interface",
        "Team feedback session",
        "Usage review and early data insights"
      ],
      thinks: "This is genuinely useful. But can it handle complexity? And how does it fit into our current systems?",
      does: [
        "Tests simple and moderately complex queries",
        "Shares structured feedback",
        "Compares Hobson to existing manual processes"
      ],
      feels: "Excited and reassured by early time savings.",
      blocks: "Uncertainty around future scalability and need for clearer performance metrics",
      improvement: "Add deeper analytics with accuracy indicators, response times, and error mapping."
    },
    {
      stage: "Stage 5",
      title: "Communication Gap & Re-Engagement",
      touchpoints: [
        "Re-engagement meeting following technical delays",
        "Transparent update on challenges and revised timelines",
        "Agreement to share additional documents for improved training"
      ],
      thinks: "They were open and honest. Delays happen, but communication must be consistent.",
      does: [
        "Provides internal reassurance",
        "Approves sharing more data",
        "Reassesses long-term product viability"
      ],
      feels: "Reassured but cautious — trust maintained, but now fragile.",
      blocks: "Fear that communication gaps may occur again and uncertainty around revised timelines",
      improvement: "Establish a predictable communication rhythm and share small, visible progress updates."
    },
    {
      stage: "Stage 6",
      title: "Pre-MVP Engagement & Strengthening",
      touchpoints: [
        "Additional document uploads",
        "Regular progress updates",
        "Previews or screenshots of developing features",
        "Refined no-code demonstrations"
      ],
      thinks: "Progress is clear. The more data they have, the better the output becomes.",
      does: [
        "Shares further portfolio information",
        "Prepares internal teams for MVP testing",
        "Participates actively in feedback loops"
      ],
      feels: "Cautiously optimistic — momentum is returning.",
      blocks: "Concern about time investment versus expected return and fear of another slowdown",
      improvement: "Provide a simple progress tracker and deliver small, frequent wins to sustain confidence."
    },
    {
      stage: "Stage 7",
      title: "MVP Deployment (Q1 2026)",
      touchpoints: [
        "MVP rollout",
        "User onboarding",
        "Usage data monitoring",
        "Team review after two weeks"
      ],
      thinks: "TBA — final assessment depends on live MVP performance.",
      does: ["To be determined once real-world usage begins"],
      feels: "TBA — shaped by MVP testing results.",
      blocks: "TBA — identified once real-world usage begins.",
      improvement: "TBA — shaped by MVP testing results and user feedback cycles."
    }
  ];

  const strategicLessons = [
    "Communication is as important as product quality during early-stage adoption.",
    "Enterprise clients remain committed when progress is visible and expectation-setting is clear."
  ];

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-purple-500/20">
        <p className="text-slate-300 leading-relaxed mb-4">
          The Customer journey maps focus on the MVP journey by one of our pilots. It demonstrates how an adopter moves from first contact to sustained engagement.
        </p>
        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-3">Segment 1: Large Portfolio Operators</h3>
          <p className="text-slate-300 text-sm mb-4">
            Represented by Persona 1 (Leigh). This segment provides the clearest insight into enterprise expectations, adoption barriers, and the behaviours that shape product refinement.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <User className="w-8 h-8 mx-auto text-purple-400 mb-2" />
              <p className="text-xs text-slate-400">Name</p>
              <p className="text-sm font-medium text-white">Leigh X</p>
            </div>
            <div className="text-center">
              <Target className="w-8 h-8 mx-auto text-purple-400 mb-2" />
              <p className="text-xs text-slate-400">Role</p>
              <p className="text-sm font-medium text-white">COO</p>
            </div>
            <div className="text-center">
              <svg className="w-8 h-8 mx-auto text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-xs text-slate-400">Organisation</p>
              <p className="text-sm font-medium text-white">Large Property Mgmt</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-purple-400 mb-2" />
              <p className="text-xs text-slate-400">Primary Goal</p>
              <p className="text-sm font-medium text-white">Quick info retrieval</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Journey Stages */}
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <Card key={index} className="p-5 bg-slate-800/40 border-slate-700/50 hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">{index + 1}</span>
              </div>
              <div>
                <p className="text-xs text-purple-400 uppercase tracking-wider">{stage.stage}</p>
                <h3 className="text-lg font-semibold text-white">{stage.title}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Touchpoints */}
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium text-blue-400 uppercase">Touchpoints</span>
                  </div>
                  <ul className="space-y-1">
                    {stage.touchpoints.map((tp, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        {tp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What Leigh Thinks */}
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-amber-400 uppercase">💭 What Leigh Thinks</span>
                  </div>
                  <p className="text-sm text-slate-300 italic">"{stage.thinks}"</p>
                </div>

                {/* What Leigh Does */}
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-green-400 uppercase">✓ What Leigh Does</span>
                  </div>
                  <ul className="space-y-1">
                    {stage.does.map((action, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* What Leigh Feels */}
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-pink-400 uppercase">❤️ What Leigh Feels</span>
                  </div>
                  <p className="text-sm text-slate-300">{stage.feels}</p>
                </div>

                {/* Blocks */}
                <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-medium text-red-400 uppercase">Blocks</span>
                  </div>
                  <p className="text-sm text-slate-300">{stage.blocks}</p>
                </div>

                {/* Improvement Opportunity */}
                <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-medium text-green-400 uppercase">Improvement Opportunity</span>
                  </div>
                  <p className="text-sm text-slate-300">{stage.improvement}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-slate-900/60 border-purple-500/30">
        <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          Leigh's journey reflects the typical enterprise adoption path: early enthusiasm, validation of alignment, operational friction during data preparation, renewed confidence after initial testing, a temporary loss of momentum due to delays, and restored trust following transparent communication.
        </p>
        
        <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">Two Strategic Lessons</h4>
          <div className="space-y-2">
            {strategicLessons.map((lesson, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold text-xs">{index + 1}</span>
                </span>
                <p className="text-slate-300 text-sm">{lesson}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
          <p className="text-slate-200 font-medium">
            Hobson now enters MVP deployment with stronger trust foundations, deeper document coverage, and clearer alignment with enterprise workflows.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CustomerUserJourneysVisual;
