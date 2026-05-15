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
import CountryIcon from "./countryIcon";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDateLong } from "@/lib/utils";
import ClassificationIcon from "./classificationIcon";
import { classificationLabels } from "@/types/classification";
import {
  FaArrowRight,
  FaCalendar,
  FaLocationDot,
  FaRoad,
} from "react-icons/fa6";
import { JerseyLine, ResultLine } from "./result-line";
import { ResultSnapshot } from "@/types/result";

const getFirstRider = (result?: ResultSnapshot[]) =>
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

  const isMobile = useIsMobile();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="p-6 focus:outline-none md:min-h-screen md:min-w-125"
        side={isMobile ? "bottom" : "right"}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-2xl">
            <CountryIcon
              className="mr-2 text-xl"
              countryCode={event.country?.alpha2 || ""}
              aria-label={event.country?.name}
            />
            {title}
          </SheetTitle>

          <SheetDescription className="sr-only">
            Event infos sheet
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className={cn(isMobile ? "h-80" : "h-175")}>
          <div className="space-y-6 px-4">
            {event.classification && (
              <div className="flex items-center gap-2">
                <ClassificationIcon classification={event.classification} />
                <p className="font-bold">
                  {classificationLabels[event.classification]}
                </p>
              </div>
            )}
            <Card>
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
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default EventSheet;
