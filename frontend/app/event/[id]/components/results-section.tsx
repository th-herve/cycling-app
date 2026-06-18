import Result, {
  labels as resultLabels,
  resultMetricByType,
  ResultsResponse,
  resultTypes,
} from "@/types/result";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import CountryIcon from "@/components/common/country-icon";
import { cn, formatRider } from "@/lib/utils";

export const ResultSection = ({ results }: { results?: ResultsResponse }) => {
  if (!results) {
    return <p>No results yet.</p>;
  }
  const availableTypes = resultTypes.filter((t) => results?.[t]?.length);

  if (availableTypes.length === 0) {
    return <p>No results yet.</p>;
  }

  return (
    <Tabs defaultValue={availableTypes[0]}>
      <TabsList variant="line">
        {availableTypes.map((t) => (
          <TabsTrigger key={t} value={t}>
            {resultLabels[t]}
          </TabsTrigger>
        ))}
      </TabsList>
      {availableTypes.map((t) => (
        <TabsContent key={t} value={t}>
          <ResultCard type={resultMetricByType[t]} results={results?.[t]} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export const ResultCard = ({
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
  const isRiderResult = !!results[0].rider;
  const isTeamResult = !!results[0].team;

  if (isRiderResult === isTeamResult) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-2">
        <Table className="bg-card table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-card uppercase">
              <TableHead className="w-14 md:w-20">Rank</TableHead>
              {isRiderResult && <TableHead>Rider</TableHead>}
              <TableHead
                className={cn("hidden md:table-cell", {
                  "table-cell": isTeamResult,
                })}
              >
                Team
              </TableHead>
              <TableHead className="w-20 text-right">
                {type === "time" ? "Time" : "Points"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow
                key={isRiderResult ? result.rider?.id : result.team?.id}
                className="odd:bg-muted hover:bg-card odd:hover:bg-muted"
              >
                <TableCell>{result.rank || result.status}</TableCell>
                {isRiderResult && (
                  <>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <CountryIcon
                          countryCode={result.rider?.nationality?.alpha2 || ""}
                        />
                        <span className="sm:hidden">
                          {result.rider && formatRider(result.rider)}
                        </span>
                        <span className="hidden sm:table-cell">
                          {result.rider?.firstName} {result.rider?.lastName}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {result.rider?.team?.name}
                    </TableCell>
                  </>
                )}
                {isTeamResult && (
                  <TableCell className="flex items-center gap-2">
                    <CountryIcon
                      countryCode={result.team?.country?.alpha2 || ""}
                    />
                    <span className="min-w-0 truncate">
                      {result.team?.name}
                    </span>
                  </TableCell>
                )}
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
