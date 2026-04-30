import { Helmet } from "react-helmet-async";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import { ReportsFiltersProvider } from "@/components/crm/reports/ReportsFiltersContext";
import { ReportsFilterBar } from "@/components/crm/reports/ReportsFilterBar";
import { WonLostRatioReport } from "@/components/crm/reports/WonLostRatioReport";
import { StageConversionFunnelReport } from "@/components/crm/reports/StageConversionFunnelReport";
import { NewEnquiriesReport } from "@/components/crm/reports/NewEnquiriesReport";
import { LeadSourceMixReport } from "@/components/crm/reports/LeadSourceMixReport";
import { CommunicationsVolumeReport } from "@/components/crm/reports/CommunicationsVolumeReport";
import { InboundOutboundReport } from "@/components/crm/reports/InboundOutboundReport";
import { StaleClientsTrendReport } from "@/components/crm/reports/StaleClientsTrendReport";
import { IssuesFlowReport } from "@/components/crm/reports/IssuesFlowReport";
import { AvgTimeToResolutionReport } from "@/components/crm/reports/AvgTimeToResolutionReport";
import { TasksFlowReport } from "@/components/crm/reports/TasksFlowReport";
import { WorkspaceScoreboardReport } from "@/components/crm/reports/WorkspaceScoreboardReport";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mt-8 mb-3">
    {children}
  </h2>
);

export default function CrmReports() {
  const { isAdmin } = useCrmAccess();

  return (
    <>
      <Helmet>
        <title>CRM Reports | Hobson</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <ReportsFiltersProvider>
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-slate-500 mt-1">
            Operational analytics across the CRM. Filters apply to every report
            on the page.
          </p>

          <div className="mt-6">
            <ReportsFilterBar />
          </div>

          <SectionTitle>Pipeline health</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <WonLostRatioReport />
            <StageConversionFunnelReport />
          </div>

          <SectionTitle>Lead acquisition</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <NewEnquiriesReport />
            <LeadSourceMixReport />
          </div>

          <SectionTitle>Activity & engagement</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CommunicationsVolumeReport />
            <InboundOutboundReport />
            <div className="lg:col-span-2">
              <StaleClientsTrendReport />
            </div>
          </div>

          <SectionTitle>Service delivery</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <IssuesFlowReport />
            <AvgTimeToResolutionReport />
            <div className="lg:col-span-2">
              <TasksFlowReport />
            </div>
          </div>

          {isAdmin && (
            <>
              <SectionTitle>Team performance</SectionTitle>
              <WorkspaceScoreboardReport enabled={isAdmin} />
            </>
          )}

          <p className="mt-10 text-xs text-slate-400">
            Reports are point-in-time on page load. Refresh the page to recompute.
          </p>
        </div>
      </ReportsFiltersProvider>
    </>
  );
}
