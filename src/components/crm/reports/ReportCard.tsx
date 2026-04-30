import { ReactNode } from "react";
import { Download } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyLabel?: string;
  onExport?: () => void;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const ReportCard = ({
  title,
  description,
  isLoading,
  isEmpty,
  emptyLabel = "No data in this range.",
  onExport,
  footer,
  children,
  className,
}: Props) => (
  <div
    className={`bg-white border border-slate-200 rounded-lg p-4 flex flex-col ${className ?? ""}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      {onExport && (
        <button
          onClick={onExport}
          disabled={isLoading || isEmpty}
          className="text-xs text-slate-500 hover:text-slate-900 disabled:opacity-40 inline-flex items-center gap-1"
          title="Download CSV"
        >
          <Download className="size-3.5" />
          CSV
        </button>
      )}
    </div>
    <div className="mt-3 flex-1 min-h-[200px]">
      {isLoading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : isEmpty ? (
        <div className="h-full min-h-[180px] flex items-center justify-center text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        children
      )}
    </div>
    {footer && <div className="mt-2 text-xs text-slate-500">{footer}</div>}
  </div>
);
