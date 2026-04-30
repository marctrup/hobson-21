import { Globe, Send } from "lucide-react";

interface Props {
  variant: "website_enquiries" | "outbound_emails";
}

const COPY = {
  website_enquiries: {
    icon: Globe,
    label: "Website enquiries this week",
    body: "Will populate once the website integration ships.",
  },
  outbound_emails: {
    icon: Send,
    label: "Outbound emails this week",
    body: "Will populate once the website integration ships.",
  },
};

export const PlaceholderCard = ({ variant }: Props) => {
  const { icon: Icon, label, body } = COPY[variant];
  return (
    <div className="bg-white border border-dashed border-slate-300 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
        <Icon className="size-4" />
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-300">—</div>
      <div className="text-xs text-slate-500 mt-1">{body}</div>
    </div>
  );
};
