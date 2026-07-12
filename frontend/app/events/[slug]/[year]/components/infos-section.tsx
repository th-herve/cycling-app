import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateLong } from "@/lib/utils";
import Event from "@/types/event";

export const InfoSection = ({ event }: { event: Event }) => (
  <Card>
    <CardHeader className="sr-only">
      <CardTitle>Event infos</CardTitle>
    </CardHeader>
    <CardContent>
      <dl className="flex flex-col justify-around md:flex-row gap-2 md:gap-0">
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
  <div className="border-muted-foreground flex w-full items-center justify-between last:border-r-0 md:flex-col md:border-r">
    <dt className="text-muted-foreground">{title}</dt>
    <dd className="font-bold">{value || "-"}</dd>
  </div>
);
