import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import NotFound from "@/pages/NotFound";
import { DefaultOwnerCard } from "@/components/crm/settings/DefaultOwnerCard";
import { IngestSecretCard } from "@/components/crm/settings/IngestSecretCard";

export default function CrmSettingsIntegration() {
  const { isAdmin, isLoading } = useCrmAccess();

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading…</div>;
  }
  if (!isAdmin) return <NotFound />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Helmet>
        <title>Website Integration | CRM Settings | Hobson</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <Link
        to="/crm/settings"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="size-4" /> Back to settings
      </Link>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        Website integration
      </h1>
      <p className="text-sm text-slate-500 mt-1 max-w-2xl">
        Configure the default owner for new website-generated leads and rotate
        the shared secret used by the public website to submit them.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <DefaultOwnerCard />
        <IngestSecretCard />
      </div>
    </div>
  );
}
