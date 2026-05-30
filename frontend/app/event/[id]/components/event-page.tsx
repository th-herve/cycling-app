import CountryIcon from "@/components/common/countryIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateLong } from "@/lib/utils";
import Event from "@/types/event";
import EventProfile from "./profile";
import Result from "@/types/result";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  event: Event;
  className?: string;
}

const EventPage = ({ event, className }: Props) => {
  const hasResult = event.results;
  return (
    <section className={className}>
      <h1 className="mb-20">
        <CountryIcon
          className="mr-4"
          countryCode={event.country?.alpha2 || ""}
          aria-label={event.country?.name}
        />
        {event.name} {event.seasonYear}
      </h1>

      <div className="space-y-20">
        <InfoSection event={event} />
        <div>
          <h2 className="mb-2">Profile</h2>
          <EventProfile id={event.id} />
        </div>
        {hasResult && <ResultSection results={event.results?.general} />}
      </div>
    </section>
  );
};

export default EventPage;

const InfoSection = ({ event }: { event: Event }) => (
  <Card>
    <CardHeader className="sr-only">
      <CardTitle>Event infos</CardTitle>
    </CardHeader>
    <CardContent>
      <dl className="flex justify-around">
        <DataInfo title="Date" value={formatDateLong(event.start)} />
        <DataInfo title="Country" value={event.country?.name} />
        <DataInfo
          title="Total distance"
          value={
            event.distance
              ? `${event.distance} ${event.distanceUnit}`
              : undefined
          }
        />
        <DataInfo title="Category" value={event.categoryCode} />
        <DataInfo title="Gender" value={event.seasonGender} />
      </dl>
    </CardContent>
  </Card>
);

const DataInfo = ({
  title,
  value,
}: {
  title: string;
  value?: string | null;
}) => (
  <div className="border-muted-foreground flex w-full flex-col items-center border-r last:border-r-0">
    <dt className="text-muted-foreground">{title}</dt>
    <dd className="font-bold">{value || "-"}</dd>
  </div>
);

// TODO move it
function formatHHMMSS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  if (m > 0) {
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return s.toString().padStart(2, "0");
}

const ResultSection = ({ results }: { results?: Result[] }) => {
  if (!results) {
    return;
  }

  const firstTime = results[0].timeSeconds || 0;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Rider</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result) => (
          <TableRow key={result.rider?.id ? result.rider.id : result.team?.id}>
            <TableCell className="font-medium font-mono">
              {result.rank || result.status}
            </TableCell>
            <TableCell className="flex items-center gap-2">
              <CountryIcon
                countryCode={result.rider?.nationality?.alpha2 || ""}
              />
              <p>
                {result.rider?.firstName} {result.rider?.lastName}
              </p>
            </TableCell>
            <TableCell>
              <span className="inline-block w-[9ch] text-right font-mono">
                {result.timeSeconds &&
                  (result.rank === 1
                    ? formatHHMMSS(result.timeSeconds)
                    : `+${formatHHMMSS(result.timeSeconds - firstTime)}`)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
