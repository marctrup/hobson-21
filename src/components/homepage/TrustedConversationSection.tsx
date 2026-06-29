import { MessageSquare, GitBranch, Users } from "lucide-react";

const points = [
  {
    icon: MessageSquare,
    title: "One conversation",
    body: "Always with Hobson. You never choose which AI to ask.",
    tone: { icon: "text-primary", bg: "bg-primary/10" },
  },
  {
    icon: GitBranch,
    title: "One orchestrator",
    body: "Hobson decides who is needed and in what order.",
    tone: { icon: "text-accent-teal", bg: "bg-accent-teal/10" },
  },
  {
    icon: Users,
    title: "Eight specialists",
    body: "Four maintain his memory. Four bring expertise on demand.",
    tone: { icon: "text-accent-amber", bg: "bg-accent-amber/15" },
  },
];

export const TrustedConversationSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30" aria-labelledby="trusted-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <h2
              id="trusted-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3"
            >
              One Trusted Conversation
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              A quiet team behind it.
            </p>
          </div>

          {/* Intro paragraph */}
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              You only ever speak to Hobson. Behind him stands a small, carefully chosen team of specialists — each with one job. Hobson decides who is needed, in what order, and brings their work together as a single answer.
            </p>
          </div>

          {/* Three points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {points.map((point, i) => {
              const Icon = point.icon;
              return (
                <div
                  key={i}
                  className="text-center space-y-4 p-6 rounded-xl bg-background border border-border/50 hover:border-border hover:shadow-md transition-all duration-300"
                >
                  <div
                    className={`w-14 h-14 mx-auto rounded-xl ${point.tone.bg} flex items-center justify-center`}
                  >
                    <Icon className={`w-7 h-7 ${point.tone.icon}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {point.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {point.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
