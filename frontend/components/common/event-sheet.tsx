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

const EventSheet = ({
  children,
  event,
}: {
  children: React.ReactNode;
  event: Event;
}) => {
  const title = `${event.parentName ?? ""} ${event.name}`.trim();

  const result = event.parentEventId
    ? event.results?.stage || null
    : event.results?.general || null;

  const winner =
    event.parentEventId && event.results?.general
      ? event.results.general.find((r) => r.rank === 1)?.rider
      : undefined;

  const leader = event.results?.overallGeneral
    ? event.results.overallGeneral.find((r) => r.rank === 1)?.rider
    : undefined;

  const overallMountain = event.results?.overallMountain
    ? event.results.overallMountain.find((r) => r.rank === 1)?.rider
    : undefined;

  const mountain = event.results?.mountain
    ? event.results.mountain.find((r) => r.rank === 1)?.rider
    : undefined;

  const overallPoint = event.results?.overallPoint
    ? event.results.overallPoint.find((r) => r.rank === 1)?.rider
    : undefined;

  const point = event.results?.point
    ? event.results.point.find((r) => r.rank === 1)?.rider
    : undefined;

  const overallYoung = event.results?.overallYoung
    ? event.results.overallYoung.find((r) => r.rank === 1)?.rider
    : undefined;

  const young = event.results?.young
    ? event.results.young.find((r) => r.rank === 1)?.rider
    : undefined;

  const hasStandingSection =
    winner || leader || overallMountain || overallPoint;

  const isMobile = useIsMobile();

  const getByRank = (rank: number) => result?.find((r) => r.rank === rank);

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

            {result && (
              <div className="space-y-3">
                <h4 className="font-bold">
                  {event.parentEventId ? "Stage top 3" : "Top 3 result"}
                </h4>
                <div className="space-y-1">
                  <ResultLine result={getByRank(1)} rank={1} />
                  <ResultLine result={getByRank(2)} rank={2} />
                  <ResultLine result={getByRank(3)} rank={3} />
                </div>
              </div>
            )}

            {hasStandingSection && (
              <div className="space-y-3">
                <h4 className="font-bold">
                  {winner ? "Final result" : "Standing"}
                </h4>
                <div className="space-y-1">
                  {winner && <JerseyLine type="general" rider={winner} />}
                  {leader && <JerseyLine type="general" rider={leader} />}
                  {overallPoint && (
                    <JerseyLine type="point" rider={overallPoint} />
                  )}
                  {point && <JerseyLine type="point" rider={point} />}
                  {mountain && <JerseyLine type="mountain" rider={mountain} />}
                  {overallMountain && (
                    <JerseyLine type="mountain" rider={overallMountain} />
                  )}
                  {overallYoung && (
                    <JerseyLine type="young" rider={overallYoung} />
                  )}
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
