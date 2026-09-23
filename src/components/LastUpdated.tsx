import { formatUpdatedDate } from "@/utils/content-dates";

interface LastUpdatedProps {
  /** ISO date, YYYY-MM-DD */
  date: string;
  className?: string;
}

/**
 * Visible freshness signal. Uses a <time> element so crawlers and answer
 * engines can read the date as a date, not as prose.
 */
export const LastUpdated = ({ date, className = "" }: LastUpdatedProps) => (
  <p
    className={`text-[13px] tracking-wide ${className}`}
    style={{ color: "#6E6A62" }}
  >
    Last updated{" "}
    <time dateTime={date}>{formatUpdatedDate(date)}</time>
  </p>
);
