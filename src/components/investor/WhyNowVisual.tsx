import React from "react";
import { Cpu, Users, Target, Shield, PoundSterling } from "lucide-react";

const WhyNowVisual: React.FC = () => {
  const sections = [
    {
      number: "1",
      icon: Cpu,
      title: "Technology Has Reached the Threshold",
      intro: "AI systems can now meet the accuracy, traceability, and reliability requirements of Real Estate decision-making:",
      bullets: [
        "Production-grade document extraction exceeding 95%",
        "Multi-document reasoning at scale",
        "Cost-effective real-time inference",
      ],
      conclusion: "This problem could not be solved before. Now it can be done economically.",
    },
    {
      number: "2",
      icon: Users,
      title: "The Real Estate Industry is Ready and Desperate for Efficiency",
      intro: "Real Estate operators face converging pressure:",
      bullets: [
        "Rising regulatory and reporting burden",
        "Headcount constraints and labour inflation",
        "Margin compression",
        "Increased complexity per asset",
      ],
      conclusion: "Manual processes are no longer inefficient; they are financially irresponsible.",
    },
    {
      number: "3",
      icon: Target,
      title: "Competitive White Space Is Closing",
      intro: "Despite the scale of the opportunity:",
      bullets: [
        "No AI-native leader exists in Real Estate document intelligence",
        "Legacy PropTech platforms are too embedded to replace manual reasoning",
        "Horizontal AI tools cannot meet regulatory or accuracy expectations",
      ],
      conclusion: "A narrow 12–18-month window exists to define the default category standard.",
    },
    {
      number: "4",
      icon: Shield,
      title: "Regulation & Economics",
      intro: "Regulatory requirements are increasing document volume and complexity:",
      bullets: [
        "ESG reporting now requires document-linked evidence",
        "Auditability and traceability are mandatory",
        "Risk and safety obligations expand annually",
        "Data residency rules favour compliant, regional AI solutions",
      ],
      conclusion: "At the same time, labour inflation makes manual document work structurally unaffordable.",
    },
    {
      number: "5",
      icon: PoundSterling,
      title: "The Economics Are Clear",
      intro: "",
      bullets: [],
      conclusion: "AI delivers approximately £6,000 per role per year in reclaimed capacity. Tools that remove labour, not merely optimise it, are adopted first.",
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
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-purple-100 border-2 border-purple-300 rounded-full flex items-center justify-center text-purple-700 font-bold text-lg shadow-md">
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
      <div className="mt-12 bg-gradient-to-br from-purple-100 via-purple-50 to-violet-100 rounded-xl p-6 sm:p-8 border border-purple-200">
        <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
          <h4 className="text-lg sm:text-xl font-bold text-purple-800">The Convergence</h4>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          {convergencePoints.map((point, index) => (
            <span
              key={index}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-200/60 rounded-full text-xs sm:text-sm font-medium text-purple-800"
            >
              {point}
            </span>
          ))}
        </div>

        <div className="text-center space-y-2 sm:space-y-3">
          <p className="text-sm sm:text-lg font-medium text-purple-700">
            This is the exact moment the industry shifts from
          </p>
          <p className="text-base sm:text-xl font-bold text-purple-800">
            'documents everywhere' → 'answers instantly.'
          </p>
          <p className="text-sm sm:text-lg font-semibold text-purple-700 mt-3 sm:mt-4">
            And Hobson is positioned to lead that shift.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyNowVisual;
