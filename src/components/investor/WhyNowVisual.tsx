import React from "react";
import { Cpu, Users, Target, Shield, PoundSterling, Zap } from "lucide-react";

const WhyNowVisual: React.FC = () => {
  const sections = [
    {
      number: "1",
      icon: Cpu,
      title: "Technology Has Finally Caught Up to the Problem",
      intro: "For years, real estate workflows were too messy and too document-heavy for past-generation technology. Today:",
      bullets: [
        "Add the right layer on top of an LLM, and you get specialised AI with production-grade accuracy",
        "Document intelligence routinely hits 95%+ extraction quality",
        "Infrastructure costs have fallen 10× in three years",
        "Real-time AI inference is cheap enough to deploy at scale",
      ],
      conclusion: "The technology to solve the document problem properly didn't exist until now. Now it does — and it's affordable.",
    },
    {
      number: "2",
      icon: Users,
      title: "The Industry Is Ready — and Desperate — for Efficiency",
      intro: "Real estate operators have never been under this much pressure:",
      bullets: [
        "65% of businesses plan to increase AI spend (Deloitte)",
        "COVID forced digital maturity a decade early",
        "Remote workflows normalised digital document dependency",
        "Talent shortages make manual processes unsustainable",
      ],
      conclusion: "The market isn't experimenting with AI anymore — it's actively shopping for it.",
    },
    {
      number: "3",
      icon: Target,
      title: "Massive Competitive White Space — Nobody Owns This Category Yet",
      intro: "Despite the size of the opportunity:",
      bullets: [
        "No AI-native leader exists in document intelligence for real estate",
        "Legacy PropTech is too slow and too integrated",
        "Horizontal AI tools can't meet regulatory or accuracy expectations",
        "A 12–18 month window exists to become the default category standard",
      ],
      conclusion: "This is one of the last major AI verticals without a clear winner.",
    },
    {
      number: "4",
      icon: Shield,
      title: "Regulation Is Making Documents More Complex — Not Less",
      intro: "Real estate compliance is exploding:",
      bullets: [
        "New transparency and audit trails",
        "Environmental, Social, and Governance (ESG) reporting now requires document-linked evidence",
        "Risk, safety, and building regulations tightening yearly",
        "Data residency rules favour UK/EU-based AI solutions",
      ],
      conclusion: "More rules → more documents → more cost → more need for automation.",
    },
    {
      number: "5",
      icon: PoundSterling,
      title: "Economics Are Forcing Operators to Remove Waste",
      intro: "Margins are compressing across the industry:",
      bullets: [
        "Operational costs rising",
        "Headcount limits across property and asset management",
        "Labour inflation making manual work unaffordable",
        "AI delivers ~£6,000 per role per year in time savings",
      ],
      conclusion: "When budgets tighten, tools that eliminate waste get adopted fastest.",
    },
  ];

  const convergencePoints = [
    "Technology is ready.",
    "The market is ready.",
    "Competition is absent.",
    "Regulation is rising.",
    "Economics demand efficiency.",
  ];

  return (
    <div className="bg-white rounded-lg p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Why Now?</h3>
        <p className="text-lg text-purple-600 font-medium">
          The Perfect Moment for AI Clarity in Real Estate
        </p>
      </div>

      {/* Main Sections */}
      <div className="space-y-8">
        {sections.map((section, index) => (
          <div
            key={index}
            className="relative bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            {/* Section Number Badge */}
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              {section.number}
            </div>

            {/* Section Header */}
            <div className="flex items-start gap-4 mb-4 ml-4">
              <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                <section.icon className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 leading-tight">
                {section.title}
              </h4>
            </div>

            {/* Intro */}
            <p className="text-gray-600 mb-4 ml-4">{section.intro}</p>

            {/* Bullets */}
            <ul className="space-y-2 mb-5 ml-4">
              {section.bullets.map((bullet, bulletIndex) => (
                <li
                  key={bulletIndex}
                  className="text-gray-700 flex items-start gap-3"
                >
                  <span className="text-purple-500 mt-1.5 text-xs">●</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Conclusion */}
            <div className="ml-4 p-3 bg-purple-600/5 border-l-4 border-purple-500 rounded-r-lg">
              <p className="text-gray-800 font-medium italic">
                {section.conclusion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* The Convergence */}
      <div className="mt-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-8 text-gray-900">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-purple-600" />
          <h4 className="text-xl font-bold">The Convergence</h4>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {convergencePoints.map((point, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-purple-600/15 rounded-full text-sm font-medium text-purple-800"
            >
              {point}
            </span>
          ))}
        </div>

        <div className="text-center space-y-3">
          <p className="text-lg font-medium text-purple-700">
            This is the exact moment the industry shifts from
          </p>
          <p className="text-xl font-bold text-gray-900">
            'documents everywhere' → 'answers instantly.'
          </p>
          <p className="text-lg font-semibold text-purple-600 mt-4">
            And Hobson is positioned to lead that shift.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyNowVisual;
