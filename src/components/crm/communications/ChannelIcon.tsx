import {
  Mail,
  Phone,
  Users,
  Video,
  MessageSquare,
  Linkedin,
  Mailbox,
  HelpCircle,
} from "lucide-react";
import type { CommChannel } from "@/lib/crm/communicationsLabels";
import { COMM_CHANNEL_LABELS } from "@/lib/crm/communicationsLabels";

const ICONS: Record<CommChannel, typeof Mail> = {
  email: Mail,
  call: Phone,
  meeting: Users,
  video_call: Video,
  sms: MessageSquare,
  whatsapp: MessageSquare,
  linkedin_message: Linkedin,
  letter: Mailbox,
  other: HelpCircle,
};

export const ChannelIcon = ({
  channel,
  className,
}: {
  channel: CommChannel;
  className?: string;
}) => {
  const Icon = ICONS[channel] ?? HelpCircle;
  return <Icon className={className ?? "size-4"} aria-label={COMM_CHANNEL_LABELS[channel]} />;
};
