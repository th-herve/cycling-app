import ClassificationIcon from "@/components/common/classification-icon";
import CountryIcon from "@/components/common/country-icon";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatDateShort } from "@/lib/utils";
import Event from "@/types/event";
import { LucideCrown } from "lucide-react";

interface Props {
  events: Event[];
}

const EventsTable = ({ events }: Props) => {
  return (
    <Card>
      <CardContent>
        <Table className="bg-card">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Winner</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event, i) => (
              <Row event={event} key={event.id + i} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const Row = ({ event }: { event: Event }) => {

  return (
    <TableRow className="odd:bg-muted odd:hover:bg-muted p-20 hover:bg-transparent">
      <TableCell className="py-5">{formatDateShort(event.start)}</TableCell>

      <TableCell className="flex gap-2 py-5">
        <CountryIcon countryCode={event.country?.alpha2 || ""} />
        {event.name}
      </TableCell>

      <TableCell className="py-5">
        {event.results?.general && (
          <div className="flex items-center gap-2">
            <LucideCrown className="size-4 text-yellow-400" />
            {event.results?.general[0].rider?.firstName?.charAt(0)}{" "}
            {event.results?.general[0].rider?.lastName}
          </div>
        )}
      </TableCell>
      <TableCell>
        {event.stages ? (
          <ClassificationIcon classification={event.stages[4].classification} />
        ) : (
          <ClassificationIcon classification="ttt" />
        )}
      </TableCell>
    </TableRow>
  );
};

export default EventsTable;
