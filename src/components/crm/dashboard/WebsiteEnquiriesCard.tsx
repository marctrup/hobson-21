import { useQuery } from "@tanstack/react-query";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Result {
  thisWeek: number;
  lastWeek: number;
}

export const WebsiteEnquiriesCard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-website-enquiries-this-week"],
    queryFn: async (): Promise<Result> => {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const [{ count: thisWeek }, { count: lastWeek }] = await Promise.all([
        supabase
          .from("crm_clients")
          .select("*", { count: "exact", head: true })
          .eq("form_source", "website_application")
          .gte("created_at", sevenDaysAgo.toISOString()),
        supabase
          .from("crm_clients")
          .select("*", { count: "exact", head: true })
          .eq("form_source", "website_application")
          .gte("created_at", fourteenDaysAgo.toISOString())
          .lt("created_at", sevenDaysAgo.toISOString()),
      ]);

      return { thisWeek: thisWeek ?? 0, lastWeek: lastWeek ?? 0 };
    },
  });

  const value = data?.thisWeek ?? 0;
  const last = data?.lastWeek ?? 0;
  const delta = value - last;
  const deltaLabel =
    delta === 0 ? "No change" : delta > 0 ? `+${delta} vs last week` : `${delta} vs last week`;

  return (
    <Link
      to="/crm/reports"
      className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
    >
      <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
        <Globe className="size-4" />
        Website enquiries this week
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">
        {isLoading ? "…" : value}
      </div>
      <div className="text-xs text-slate-500 mt-1">
        {isLoading ? "…" : deltaLabel}
      </div>
    </Link>
  );
};
