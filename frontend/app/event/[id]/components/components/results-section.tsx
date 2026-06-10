import Result from "@/types/result";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Event from "@/types/event";
import { Card, CardContent } from "@/components/ui/card";
import CountryIcon from "@/components/common/countryIcon";

export const ResultTab = ({ event }: { event: Event }) => {
  if (!event.results) {
    return <p>No results yet.</p>;
  }

  return (
    <Tabs defaultValue="general">
      <TabsList variant="line">
        {event.results?.general && (
          <TabsTrigger value="general">General</TabsTrigger>
        )}
        {event.results?.mountain && (
          <TabsTrigger value="mountain">Mountain</TabsTrigger>
        )}
        {event.results?.point && (
          <TabsTrigger value="points">Points</TabsTrigger>
        )}
        {event.results?.young && <TabsTrigger value="young">Young</TabsTrigger>}
      </TabsList>
      <TabsContent value="general">
        {event.results?.general && (
          <ResultSection type="time" results={event.results?.general} />
        )}
      </TabsContent>
      <TabsContent value="mountain">
        {event.results?.mountain && (
          <ResultSection type="points" results={event.results?.mountain} />
        )}
      </TabsContent>
      <TabsContent value="points">
        {event.results?.point && (
          <ResultSection type="points" results={event.results?.point} />
        )}
      </TabsContent>
      <TabsContent value="young">
        {event.results?.young && (
          <ResultSection type="time" results={event.results?.young} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export const ResultSection = ({
  results,
  type,
}: {
  results?: Result[];
  type: "time" | "points";
}) => {
  if (!results) {
    return;
  }

  const firstTime = results[0].timeSeconds || 0;

  return (
    <Card>
      <CardContent>
        <Table className="bg-card">
          <TableHeader>
            <TableRow className="hover:bg-card uppercase">
              <TableHead className="w-20">Rank</TableHead>
              <TableHead>Rider</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">
                {type === "time" ? "Time" : "Points"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow
                key={result.rider?.id ? result.rider.id : result.team?.id}
                className="odd:bg-muted hover:bg-card odd:hover:bg-muted"
              >
                <TableCell>{result.rank || result.status}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <CountryIcon
                    countryCode={result.rider?.nationality?.alpha2 || ""}
                  />
                  {result.rider?.firstName} {result.rider?.lastName}
                </TableCell>
                <TableCell>
                  <span className="hidden md:inline">
                    {result.rider?.team?.name}
                  </span>
                  <span className="md:hidden">
                    {result.rider?.team?.abbreviation}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {result.timeSeconds
                    ? result.rank === 1
                      ? formatHHMMSS(result.timeSeconds)
                      : `+${formatHHMMSS(result.timeSeconds - firstTime)}`
                    : result.points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};


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
