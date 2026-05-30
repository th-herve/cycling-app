import CountryIcon from "@/components/common/countryIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateLong } from "@/lib/utils";
import Event from "@/types/event";
import EventProfile from "./profile";

interface Props {
  event: Event;
  className?: string;
}

const EventPage = ({ event, className }: Props) => {
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
  <div className="flex w-full flex-col items-center border-r border-gray-400 last:border-r-0">
    <dt className="text-gray-400">{title}</dt>
    <dd className="font-bold">{value || "-"}</dd>
  </div>
);
