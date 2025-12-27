import { Globe, Search, Users, MousePointer, FileText } from "lucide-react";

export const CustomerOnlineBehaviourVisual = () => {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-blue-500/10 p-6 border border-blue-200/50 dark:border-blue-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Customer Online Behaviour</h3>
              <p className="text-muted-foreground text-sm mt-1">Digital Behaviour & Channel Analysis</p>
            </div>
          </div>
          <p className="text-foreground leading-relaxed">
            Content for Customer Online Behaviour will be provided. This section will cover how target customers 
            discover, research, and evaluate solutions like Hobson across digital channels.
          </p>
        </div>
      </div>

      {/* Placeholder Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-5 border border-purple-200/50 dark:border-purple-800/30">
          <div className="flex items-center gap-3 mb-3">
            <Search className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold text-foreground">Search Behaviour</h4>
          </div>
          <p className="text-sm text-muted-foreground">Search patterns and keywords to be provided</p>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-5 border border-emerald-200/50 dark:border-emerald-800/30">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-semibold text-foreground">Social Channels</h4>
          </div>
          <p className="text-sm text-muted-foreground">Social media behaviour to be provided</p>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 p-5 border border-amber-200/50 dark:border-amber-800/30">
          <div className="flex items-center gap-3 mb-3">
            <MousePointer className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-foreground">Content Preferences</h4>
          </div>
          <p className="text-sm text-muted-foreground">Content consumption patterns to be provided</p>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 p-5 border border-red-200/50 dark:border-red-800/30">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h4 className="font-semibold text-foreground">Discovery Channels</h4>
          </div>
          <p className="text-sm text-muted-foreground">Channel analysis to be provided</p>
        </div>
      </div>

      {/* Note */}
      <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/30">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            Awaiting content for Customer Online Behaviour section. Please provide the detailed digital behaviour analysis to populate this tab.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerOnlineBehaviourVisual;
