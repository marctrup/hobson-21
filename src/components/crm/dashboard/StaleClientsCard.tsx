import { CalendarX } from "lucide-react";
import { Link } from "react-router-dom";
import { useStaleClients } from "@/hooks/crm/dashboard/useStaleClients";
import { StageBadge } from "@/components/crm/StageBadge";

export const StaleClientsCard = () => {
  const { data, isLoading } = useStaleClients(10);

  return (
    <div className="bg-white border border-bone rounded-lg h-full flex flex-col">
      <div className="px-4 py-3 border-b border-bone flex items-center gap-2">
        <CalendarX className="size-4 text-warning" />
        <h2 className="font-medium">No contact in 30+ days</h2>
      </div>
      {isLoading ? (
        <div className="p-6 text-sm text-ink-muted">Loading…</div>
      ) : !data || data.length === 0 ? (
        <div className="p-8 text-center text-sm text-ink-muted">
          All open clients have been contacted recently. Nice.
        </div>
      ) : (
        <ul className="divide-y divide-faint-rule">
          {data.map((c) => (
            <li key={c.id}>
              <Link
                to={`/crm/clients/${c.id}`}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-paper"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm text-ink truncate">
                    {c.name}
                  </div>
                  <div className="text-xs text-ink-muted">
                    {c.days_since >= 9999
                      ? "No activity recorded"
                      : `${c.days_since} day${c.days_since === 1 ? "" : "s"} since last activity`}
                  </div>
                </div>
                <StageBadge stage={c.pipeline_stage} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
