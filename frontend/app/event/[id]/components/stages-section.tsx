import ClassificationIcon from "@/components/common/classificationIcon";
import CountryIcon from "@/components/common/countryIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateShort, formatDateShortDay, formatRider } from "@/lib/utils";
import Event from "@/types/event";
import { FaArrowRight, FaLocationDot, FaRoad } from "react-icons/fa6";
import EventProfile from "./profile";
import ResultDisplay from "@/components/common/result-display";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Result from "@/types/result";

export const ResultView = ({ stages }: { stages: Event[] }) => {
  return (
    <div>
      <Select defaultValue={stages[0].id}>
        <SelectTrigger>
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {stages.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const StagesViewSelector = ({ stages }: { stages: Event[] }) => {
  return (
    <Tabs defaultValue="card">
      <TabsList>
        <TabsTrigger value="list">list</TabsTrigger>
        <TabsTrigger value="card">card</TabsTrigger>
      </TabsList>
      <TabsContent value="list">
        <StagesListSections stages={stages} />
      </TabsContent>
      <TabsContent value="card">
        <StagesCardsSection stages={stages} />
      </TabsContent>
    </Tabs>
  );
};

export const StagesListSections = ({ stages }: { stages: Event[] }) => {
  return (
    <Card>
      <CardContent>
        <Table className="bg-card table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-card uppercase">
              <TableHead>Date</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="text-right md:text-left">
                Distance
              </TableHead>
              <TableHead className="hidden md:table-cell">Winner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stages.map((s) => (
              <TableRow
                key={s.id}
                className="odd:bg-muted hover:bg-card odd:hover:bg-muted"
              >
                <TableCell className="font-date">
                  {formatDateShort(s.start)}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <ClassificationIcon classification={s.classification} />
                  {s.name}
                  {s.classification === "ttt" && " (TTT)"}
                </TableCell>
                <TableCell className="text-right md:text-left">
                  {s.distance}
                  {s.distanceUnit}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {s.results?.stage ? (
                    <ResultTableCell result={s.results?.stage[0]} />
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const ResultTableCell = ({ result }: { result?: Result }) => {
  if (!result || result.rank !== 1) return "-";

  const isRider = !!result.rider;
  if (!isRider && !result.team) return "-";

  const countryCode = isRider
    ? result.rider?.nationality?.alpha2
    : result.team?.country?.alpha2;

  const text = result.rider
    ? formatRider(result.rider)
    : result.team
      ? result.team.name
      : undefined;

  if (!text) return "-";

  return (
    <span className="flex items-center gap-2">
      <CountryIcon countryCode={countryCode || ""} />
      {text}
    </span>
  );
};

export const StagesCardsSection = ({ stages }: { stages: Event[] }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {stages.map((s) => (
        <Card key={s.name}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClassificationIcon classification={s.classification} />
                <h2 className="font-race">
                  {s.name} {s.classification === "ttt" && " (TTT)"}
                </h2>
              </div>
              <p className="font-date">{formatDateShortDay(s.start)}</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {s.departureCity && s.arrivalCity && (
              <div className="flex items-center gap-2">
                <FaLocationDot />
                <span>{s.departureCity}</span>
                <span aria-hidden="true">
                  <FaArrowRight />
                </span>
                <span>{s.arrivalCity}</span>
              </div>
            )}
            {s.distance && (
              <div className="flex items-center gap-2">
                <FaRoad />
                <p>{s.distance} km</p>
              </div>
            )}
            <EventProfile id={s.id} />
            {s.results?.stage && (
              <div className="">
                <ResultDisplay
                  className="md:bg-muted"
                  results={s.results.stage}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
