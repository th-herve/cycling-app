import CountryIcon from "@/components/common/countryIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateLong} from "@/lib/utils";
import Event from "@/types/event";
import EventProfile from "./components/profile";
import { StagesSection } from "./components/stages-section";
import { ResultTab } from "./components/results-section";

interface Props {
  event: Event;
  stages?: Event[];
  className?: string;
}

const EventPage = ({ event, stages, className }: Props) => {
  return (
    <section className={className}>
      <h1>
        <CountryIcon
          className="mr-4"
          countryCode={event.country?.alpha2 || ""}
          aria-label={event.country?.name}
        />
        {event.name} {event.seasonYear}
      </h1>

      <div className="space-y-10">
        <InfoSection event={event} />
        {event.isSingleDay ? (
          <SingleDaySection event={event} />
        ) : (
          <StagesSection stages={stages!} />
        )}
      </div>
    </section>
  );
};

export default EventPage;

const SingleDaySection = ({ event }: { event: Event }) => (
  <>
    <div>
      <h2 className="mb-2">Profile</h2>
      <div>
        <EventProfile id={event.id} />
      </div>
    </div>
    <div>
      <h2 className="mb-2">Results</h2>
      <ResultTab event={event} />
    </div>
  </>
);

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

