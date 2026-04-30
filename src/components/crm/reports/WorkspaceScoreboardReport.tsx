import { ReportCard } from "./ReportCard";
import { useWorkspaceScoreboard } from "@/hooks/crm/reports/useScoreboard";
import { downloadCsv } from "@/lib/crm/reportsExport";

export const WorkspaceScoreboardReport = ({ enabled }: { enabled: boolean }) => {
  const { data, isLoading } = useWorkspaceScoreboard(enabled);
  const rows = data ?? [];

  return (
    <ReportCard
      title="Workspace performance"
      description="Activity across the team in this date range. Owner filter ignored — always shows the whole workspace."
      isLoading={isLoading}
      isEmpty={rows.length === 0}
      emptyLabel="No team activity in this range."
      onExport={() =>
        downloadCsv(
          "workspace-performance",
          [
            "Member",
            "Email",
            "Clients owned",
            "Comms logged",
            "Issues resolved",
            "Tasks completed",
          ],
          rows.map((r) => [
            r.display_name,
            r.email,
            r.clients_owned,
            r.comms_logged,
            r.issues_resolved,
            r.tasks_completed,
          ]),
        )
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 uppercase tracking-wide">
            <tr className="text-left">
              <th className="py-2 pr-4 font-medium">Member</th>
              <th className="py-2 pr-4 font-medium text-right">Clients owned</th>
              <th className="py-2 pr-4 font-medium text-right">Comms logged</th>
              <th className="py-2 pr-4 font-medium text-right">Issues resolved</th>
              <th className="py-2 pr-4 font-medium text-right">Tasks completed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.user_id}>
                <td className="py-2 pr-4">
                  <div className="font-medium text-slate-900">{r.display_name}</div>
                  <div className="text-xs text-slate-500">{r.email}</div>
                </td>
                <td className="py-2 pr-4 text-right tabular-nums">{r.clients_owned}</td>
                <td className="py-2 pr-4 text-right tabular-nums">{r.comms_logged}</td>
                <td className="py-2 pr-4 text-right tabular-nums">{r.issues_resolved}</td>
                <td className="py-2 pr-4 text-right tabular-nums">{r.tasks_completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportCard>
  );
};
