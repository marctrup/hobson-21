import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Users,
  TrendingUp,
  AlertCircle,
  Activity,
  CheckSquare,
  CalendarClock,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { formatDateUK } from "@/lib/crm/labels";
import { StageBadge } from "@/components/crm/StageBadge";
import { useAuth } from "@/hooks/useAuth";
import { IssueStatusPill } from "@/components/crm/issues/IssueStatusPill";
import { IssuePriorityPill } from "@/components/crm/issues/IssuePriorityDot";
import { TaskStatusPill } from "@/components/crm/tasks/TaskStatusPill";
import { TaskPriorityDot } from "@/components/crm/tasks/TaskPriorityDot";
import {
  TASK_PRIORITY_WEIGHT,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/crm/tasksLabels";
import {
  ISSUE_PRIORITY_WEIGHT,
  type IssuePriority,
  type IssueStatus,
} from "@/lib/crm/issuesLabels";
import { cn } from "@/lib/utils";

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  hint?: string;
}) => (
  <div className="bg-white border border-slate-200 rounded-lg p-4">
    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
      <Icon className="size-4" />
      {label}
    </div>
    <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
    {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
  </div>
);

const isPastDue = (date: string | null): boolean => {
  if (!date) return false;
  return new Date(date) < new Date(new Date().toDateString());
};

export default function CrmDashboard() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ["crm-dashboard-summary"],
    queryFn: async () => {
      const [{ count: total }, { count: active }, { count: hot }, { data: recent }] =
        await Promise.all([
          supabase.from("crm_clients").select("*", { count: "exact", head: true }),
          supabase
            .from("crm_clients")
            .select("*", { count: "exact", head: true })
            .eq("status", "active"),
          supabase
            .from("crm_clients")
            .select("*", { count: "exact", head: true })
            .eq("interest_level", "hot"),
          supabase
            .from("crm_clients")
            .select("id, name, segment, pipeline_stage, updated_at")
            .order("updated_at", { ascending: false })
            .limit(8),
        ]);
      return {
        total: total ?? 0,
        active: active ?? 0,
        hot: hot ?? 0,
        recent: recent ?? [],
      };
    },
  });

  // Open issues count + my-open issue list (top 5).
  const issuesQ = useQuery({
    queryKey: ["crm-dashboard-issues", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { count: openCount } = await supabase
        .from("crm_issues")
        .select("*", { count: "exact", head: true })
        .in("status", ["open", "in_progress", "blocked"]);

      const { data: mine } = await supabase
        .from("crm_issues")
        .select("id, title, status, priority, due_date, client_id")
        .eq("assignee_id", userId!)
        .in("status", ["open", "in_progress", "blocked"])
        .order("due_date", { ascending: true, nullsFirst: false })
        .limit(20);

      const rows = (mine ?? []) as Array<{
        id: string;
        title: string;
        status: IssueStatus;
        priority: IssuePriority;
        due_date: string | null;
        client_id: string | null;
      }>;

      // Sort: due_date asc nulls last, then priority desc.
      rows.sort((a, b) => {
        const ad = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const bd = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        if (ad !== bd) return ad - bd;
        return (
          ISSUE_PRIORITY_WEIGHT[b.priority] -
          ISSUE_PRIORITY_WEIGHT[a.priority]
        );
      });

      return {
        openCount: openCount ?? 0,
        mine: rows.slice(0, 5),
      };
    },
  });

  // Open tasks count + my-open task list (top 5).
  const tasksQ = useQuery({
    queryKey: ["crm-dashboard-tasks", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { count: openCount } = await supabase
        .from("crm_tasks")
        .select("*", { count: "exact", head: true })
        .in("status", ["todo", "in_progress"]);

      const { data: mine } = await supabase
        .from("crm_tasks")
        .select("id, title, status, priority, due_date, client_id")
        .eq("assignee_id", userId!)
        .in("status", ["todo", "in_progress"])
        .order("due_date", { ascending: true, nullsFirst: false })
        .limit(20);

      const rows = (mine ?? []) as Array<{
        id: string;
        title: string;
        status: TaskStatus;
        priority: TaskPriority;
        due_date: string | null;
        client_id: string | null;
      }>;

      rows.sort((a, b) => {
        const ad = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const bd = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        if (ad !== bd) return ad - bd;
        return (
          TASK_PRIORITY_WEIGHT[b.priority] - TASK_PRIORITY_WEIGHT[a.priority]
        );
      });

      return {
        openCount: openCount ?? 0,
        mine: rows.slice(0, 5),
      };
    },
  });

  return (
    <>
      <Helmet>
        <title>CRM Dashboard | Hobson</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Snapshot of your client portfolio and recent activity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          <SummaryCard
            icon={Users}
            label="Total clients"
            value={isLoading ? "…" : data?.total ?? 0}
          />
          <SummaryCard
            icon={Activity}
            label="Active clients"
            value={isLoading ? "…" : data?.active ?? 0}
          />
          <SummaryCard
            icon={TrendingUp}
            label="Hot leads"
            value={isLoading ? "…" : data?.hot ?? 0}
          />
          <SummaryCard
            icon={AlertCircle}
            label="Open issues"
            value={issuesQ.isLoading ? "…" : issuesQ.data?.openCount ?? 0}
          />
          <SummaryCard
            icon={CheckSquare}
            label="Open tasks"
            value={tasksQ.isLoading ? "…" : tasksQ.data?.openCount ?? 0}
          />
        </div>

        {/* My open issues + My open tasks (same shape) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MyOpenCard
            title="My open issues"
            href="/crm/issues"
            isLoading={issuesQ.isLoading}
            emptyHref="/crm/issues"
            emptyLabel="No issues assigned to you."
            rows={(issuesQ.data?.mine ?? []).map((r) => ({
              id: r.id,
              title: r.title,
              dueDate: r.due_date,
              clientId: r.client_id,
              link: `/crm/issues?focus=${r.id}`,
              left: <IssuePriorityPill priority={r.priority} />,
              right: <IssueStatusPill status={r.status} />,
            }))}
          />
          <MyOpenCard
            title="My open tasks"
            href="/crm/tasks"
            isLoading={tasksQ.isLoading}
            emptyHref="/crm/tasks"
            emptyLabel="No tasks assigned to you."
            rows={(tasksQ.data?.mine ?? []).map((r) => ({
              id: r.id,
              title: r.title,
              dueDate: r.due_date,
              clientId: r.client_id,
              link: `/crm/tasks?focus=${r.id}`,
              left: <TaskPriorityDot priority={r.priority} />,
              right: <TaskStatusPill status={r.status} />,
            }))}
          />
        </div>

        <div className="mt-8 bg-white border border-slate-200 rounded-lg">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-medium">Recently updated clients</h2>
            <Link to="/crm/clients" className="text-sm text-slate-600 hover:text-slate-900">
              View all →
            </Link>
          </div>
          {isLoading ? (
            <div className="p-6 text-sm text-slate-500">Loading…</div>
          ) : !data?.recent.length ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No clients yet.{" "}
              <Link to="/crm/clients/new" className="text-slate-900 underline">
                Add your first client
              </Link>
              .
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.recent.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/crm/clients/${c.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
                  >
                    <div>
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-slate-500">
                        Updated {formatDateUK(c.updated_at)}
                      </div>
                    </div>
                    <StageBadge stage={c.pipeline_stage} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

interface MyOpenRow {
  id: string;
  title: string;
  dueDate: string | null;
  clientId: string | null;
  link: string;
  left: React.ReactNode;
  right: React.ReactNode;
}

const MyOpenCard = ({
  title,
  href,
  rows,
  isLoading,
  emptyLabel,
  emptyHref,
}: {
  title: string;
  href: string;
  rows: MyOpenRow[];
  isLoading: boolean;
  emptyLabel: string;
  emptyHref: string;
}) => (
  <div className="bg-white border border-slate-200 rounded-lg">
    <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
      <h2 className="font-medium">{title}</h2>
      <Link to={href} className="text-sm text-slate-600 hover:text-slate-900">
        View all →
      </Link>
    </div>
    {isLoading ? (
      <div className="p-6 text-sm text-slate-500">Loading…</div>
    ) : rows.length === 0 ? (
      <div className="p-8 text-center text-sm text-slate-500">
        {emptyLabel}{" "}
        <Link to={emptyHref} className="text-slate-900 underline">
          Open {title.toLowerCase().replace("my open ", "")}
        </Link>
        .
      </div>
    ) : (
      <ul className="divide-y divide-slate-100">
        {rows.map((r) => {
          const overdue = isPastDue(r.dueDate);
          return (
            <li key={r.id}>
              <Link
                to={r.link}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
              >
                <div className="shrink-0">{r.left}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-900 truncate">
                    {r.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 inline-flex items-center gap-1">
                    {r.dueDate ? (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1",
                          overdue && "text-rose-600 font-medium",
                        )}
                      >
                        {overdue && <CalendarClock className="size-3.5" />}
                        Due {formatDateUK(r.dueDate)}
                      </span>
                    ) : (
                      <span>No due date</span>
                    )}
                  </div>
                </div>
                <div className="shrink-0">{r.right}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);
