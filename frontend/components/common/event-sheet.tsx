import { useIsMobile } from "@/lib/hooks/useIsMobile";
import Event from "@/types/event";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CountryIcon from "./country-icon";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateLong, slugify } from "@/lib/utils";
import ClassificationIcon from "./classification-icon";
import { classificationLabels } from "@/types/classification";
import {
  FaArrowRight,
  FaCalendar,
  FaLocationDot,
  FaRoad,
} from "react-icons/fa6";
import { JerseyLine, ResultLine } from "./result-line";
import Result from "@/types/result";
import EventProfile from "@/app/event/[id]/components/profile";
import Link from "next/link";
import { siteRoute } from "@/siteConfig";
import CanceledLabel from "./canceled-label";

const getFirstRider = (result?: Result[]) =>
  result?.find((r) => r.rank === 1)?.rider;

const EventSheet = ({
  children,
  event,
}: {
  children: React.ReactNode;
  event: Event;
}) => {
  const title = `${event.parentName ?? ""} ${event.name}`.trim();

  const isStageEvent = event.type === "stage";

  const hasFinalGeneral = !!event.results?.general?.length;

  const eventMode =
    event.type === "race"
      ? "single-day"
      : hasFinalGeneral
        ? "final-stage"
        : "intermediate-stage";

  // Get the podium of the stage or the single day race.
  const podium =
    eventMode === "single-day" ? event.results?.general : event.results?.stage;

  // Helper to extract the rider at a specific rank from the podium.
  const getByRank = (rank: number) => podium?.find((r) => r.rank === rank);

  // Extract the standing leader or the final winner for each jersey for stage event.
  const general =
    eventMode === "final-stage"
      ? getFirstRider(event.results?.general)
      : eventMode === "intermediate-stage"
        ? getFirstRider(event.results?.overallGeneral)
        : undefined;
  const mountain =
    eventMode === "final-stage"
      ? getFirstRider(event.results?.mountain)
      : eventMode === "intermediate-stage"
        ? getFirstRider(event.results?.overallMountain)
        : undefined;
  const point =
    eventMode === "final-stage"
      ? getFirstRider(event.results?.point)
      : eventMode === "intermediate-stage"
        ? getFirstRider(event.results?.overallPoint)
        : undefined;
  const young =
    eventMode === "final-stage"
      ? getFirstRider(event.results?.young)
      : eventMode === "intermediate-stage"
        ? getFirstRider(event.results?.overallYoung)
        : undefined;

  const hasJerseySection = general || mountain || point || young;

  const resultLink = !event.parentEventId
    ? siteRoute.event.root(event.id)
    : siteRoute.event.results(event.parentEventId, slugify(event.name));

  const isMobile = useIsMobile();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="flex h-[60dvh] flex-col p-6 focus:outline-none md:h-dvh md:min-w-125"
        side={isMobile ? "bottom" : "right"}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <SheetHeader>
          <Link
            href={siteRoute.event.root(
              event.parentEventId ? event.parentEventId : event.id,
            )}
          >
            <SheetTitle className="text-2xl flex items-start">
              <CountryIcon
                className="mr-2 pt-3 text-xl"
                countryCode={event.country?.alpha2 || ""}
                aria-label={event.country?.name}
              />
              {title}
            </SheetTitle>
          </Link>

          <SheetDescription className="sr-only">
            Event infos sheet
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-6 px-4">
            {event.status === "canceled" && <CanceledLabel />}

            {event.classification && (
              <div className="flex items-center gap-2">
                <ClassificationIcon classification={event.classification} />
                <p className="font-bold">
                  {classificationLabels[event.classification]}
                </p>
              </div>
            )}

            <EventProfile id={event.id} />

            <Card className="rounded-sm">
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaCalendar />
                  <p>{formatDateLong(event.start)}</p>
                </div>
                {event.departureCity && event.arrivalCity && (
                  <div className="flex items-center gap-2">
                    <FaLocationDot />
                    <span>{event.departureCity}</span>
                    <span aria-hidden="true">
                      <FaArrowRight />
                    </span>
                    <span>{event.arrivalCity}</span>
                  </div>
                )}
                {event.distance && (
                  <div className="flex items-center gap-2">
                    <FaRoad />
                    <p>{event.distance} km</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {podium && (
              <div className="space-y-3">
                <h4 className="font-bold">
                  {isStageEvent ? "Stage top 3" : "Top 3 result"}
                </h4>
                <div className="space-y-1">
                  <ResultLine result={getByRank(1)} rank={1} />
                  <ResultLine result={getByRank(2)} rank={2} />
                  <ResultLine result={getByRank(3)} rank={3} />
                </div>
              </div>
            )}

            {hasJerseySection && (
              <div className="space-y-3">
                <h4 className="font-bold">
                  {eventMode === "final-stage" ? "Final result" : "Standing"}
                </h4>
                <div className="space-y-1">
                  {general && <JerseyLine type="general" rider={general} />}
                  {point && <JerseyLine type="point" rider={point} />}
                  {mountain && <JerseyLine type="mountain" rider={mountain} />}
                  {young && <JerseyLine type="young" rider={young} />}
                </div>
              </div>
            )}
            {podium && (
              <Link className="text-muted-foreground" href={resultLink}>
                Full result
              </Link>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default EventSheet;
