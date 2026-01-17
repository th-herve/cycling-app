import CountryIcon from "@/components/common/countryIcon";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDateRange } from "@/lib/utils";
import Event from "@/types/event";
import Result from "@/types/result";
import { LucideCrown } from "lucide-react";

interface Props {
  event: Event;
}

const EventCard = ({ event }: Props) => {
  const dateRange = formatDateRange(event.start, event.end);
  const titleId = `event-${event.id}-title`;

  return (
    <article aria-labelledby={titleId}>
      <Card>
        <CardContent className="grid min-h-40 grid-rows-[auto_1fr_auto] md:min-h-0 md:grid-cols-[2fr_1fr] md:grid-rows-[auto_auto]">
          <div>
            <header className="flex gap-2">
              <CountryIcon
                className="mt-0.5"
                countryCode={event.country?.alpha2 || ""}
                aria-label={event.country?.name}
              />
              <h2 id={titleId} className="font-race text-2xl font-bold">
                {event.name}
              </h2>
            </header>
          </div>
          <time
            className={cn("self-start md:row-start-2", {
              "self-end": !event.results,
            })}
            dateTime={event.start}
          >
            {dateRange}
          </time>

          {event.results && (
            <ResultDisplay
              className="self-end md:row-span-2"
              results={event.results}
            />
          )}
        </CardContent>
      </Card>
    </article>
  );
};

export default EventCard;

const ResultDisplay = ({
  results,
  className,
}: {
  results: Result[];
  className?: string;
}) => {
  const winner = results?.[0];
  if (!winner?.riderLastName) return null;

  const firstInitial = winner.riderFirstName?.charAt(0);

  return (
    <dl
      aria-label="Race winner"
      className={cn(
        "bg-muted rounded-md px-2 py-3 md:bg-transparent",
        className,
      )}
    >
      <dd className="flex items-center gap-2">
        <LucideCrown aria-hidden="true" className="size-4 text-yellow-400" />
        <span className="text-xs font-semibold">
          {firstInitial && `${firstInitial}.`} {winner.riderLastName}
        </span>
      </dd>
    </dl>
  );
};
