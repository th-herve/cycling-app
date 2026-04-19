"use client";
import GenderSelectLinks from "@/components/common/genderSelect";
import YearSelectLinks from "@/components/common/yearSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCalendar } from "@/lib/hooks/useCalendar";
import { cn } from "@/lib/utils";
import Event from "@/types/event";
import { format, getDate, getMonth, isToday } from "date-fns";
import { LuChevronLeft, LuChevronRight, LuFilter } from "react-icons/lu";
import { LoadingCalendarBody } from "../loading";
import { useDebouncedLoader } from "@/lib/hooks/useDebouncedLoader";
import CountryIcon from "@/components/common/countryIcon";
import { startTransition } from "react";
import { useUrlParamsNavigation } from "@/lib/hooks/useUrlParamsNavigation";
import { siteConfig } from "@/siteConfig";

const weekDayNames = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

type EventsByDay = Map<string, Event[]>;

interface Props {
  year: number;
  gender: string;
  eventsByDay: EventsByDay;
  className?: string;
}

const EventCalendar = ({ eventsByDay, year, gender }: Props) => {
  const {
    handleYearSelect,
    handleToday,
    handleNextMonth,
    handlePrevMonth,
    isPending,
    displayedDays,
    displayedMonth,
    displayedYear,
    hasNextMonth,
    hasPrevMonth,
  } = useCalendar(year, siteConfig.minYear, siteConfig.maxYear);

  const debouncedLoading = useDebouncedLoader(isPending);

  const urlNav = useUrlParamsNavigation();

  const handleGenderSelect = (newGender: string) => {
    startTransition(() => {
      urlNav.updateAndPushUrl({
        gender: newGender,
      });
    });
  };

  return (
    <div className="space-y-2">
      <CalendarHeader
        year={displayedYear}
        gender={gender}
        displayedMonth={displayedMonth}
        onNextMonth={handleNextMonth}
        onPrevMonth={handlePrevMonth}
        onToday={handleToday}
        onYearSelect={handleYearSelect}
        onGenderSelect={handleGenderSelect}
        isPending={isPending}
        hasNextMonth={hasNextMonth}
        hasPrevMonth={hasPrevMonth}
      />

      {debouncedLoading ? (
        <LoadingCalendarBody />
      ) : (
        <CalendarBody
          eventsByDay={eventsByDay}
          displayedDays={displayedDays}
          displayedMonth={displayedMonth}
        />
      )}
    </div>
  );
};

export default EventCalendar;

const CalendarBody = ({
  eventsByDay,
  displayedDays,
  displayedMonth,
}: {
  eventsByDay: EventsByDay;
  displayedDays: Date[];
  displayedMonth: number;
}) => {
  return (
    <Card className="p-0">
      <CardContent className="space-y-2 p-0">
        <CalendarWeekDaysRow />

        <CalendarDaysCells
          displayedDays={displayedDays}
          eventsByDay={eventsByDay}
          month={displayedMonth}
        />
      </CardContent>
    </Card>
  );
};

const CalendarDaysCells = ({
  displayedDays,
  eventsByDay,
  month: displayedMonth,
}: {
  displayedDays: Date[];
  eventsByDay: EventsByDay;
  month: number;
}) => {
  return (
    <div className="grid grid-cols-7 gap-0.5 p-0 md:gap-4">
      {displayedDays.map((day) => {
        return (
          <DayCell
            key={`cal-day-${day.toISOString()}`}
            day={day}
            events={eventsByDay.get(day.toISOString().slice(0, 10))}
            isOutsideMonth={getMonth(day) !== displayedMonth}
          />
        );
      })}
    </div>
  );
};

const DayCell = ({
  day,
  events,
  isOutsideMonth,
}: {
  day: Date;
  events?: Event[];
  isOutsideMonth: boolean;
}) => {
  const isCellToday = isToday(day);

  return (
    <div
      className={cn(
        "bg-secondary h-27 px-0.5 py-1 md:h-35 md:rounded-xl md:px-3",
        {
          "outline-primary outline-2": isCellToday,
          "bg-secondary/40": isOutsideMonth,
        },
      )}
    >
      <time
        dateTime={day.toISOString()}
        className="font-date mb-2 flex justify-center"
      >
        {getDate(day)}
      </time>
      <div className="space-y-1 md:space-y-2">
        {events?.map((e) => (
          <EventCard key={`event-card-${e.id}`} event={e} />
        ))}
      </div>
    </div>
  );
};

const EventCard = ({ event }: { event: Event }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl px-0.5 md:px-2",
        event.parentEventId ? "bg-green-700" : "bg-cyan-700",
      )}
    >
      <CountryIcon
        className="mt-0.5 hidden md:block"
        countryCode={event.country?.alpha2 || ""}
        aria-label={event.country?.name}
      />
      <p className="truncate text-xs font-semibold md:text-sm">
        {event.parentName && event.parentName + " "}
        {event.name}
      </p>
    </div>
  );
};

const CalendarWeekDaysRow = () => {
  return (
    <div className="grid grid-cols-7 gap-4 p-0">
      {weekDayNames.map((name) => (
        <p className="font-date text-center capitalize" key={name}>
          {name}
        </p>
      ))}
    </div>
  );
};

const CalendarHeader = ({
  year,
  gender,
  displayedMonth,
  onNextMonth,
  onPrevMonth,
  onToday,
  onYearSelect,
  onGenderSelect,
  isPending = false,
  hasNextMonth,
  hasPrevMonth,
}: {
  year: number;
  gender: string;
  displayedMonth: number;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onToday: () => void;
  onYearSelect: (year: string) => void;
  onGenderSelect: (gender: string) => void;
  isPending?: boolean;
  hasNextMonth: boolean;
  hasPrevMonth: boolean;
}) => {
  return (
    <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-10">
        <h2 className="font-date min-w-82">
          {getMonthName(displayedMonth)} {year} {gender}
        </h2>

        <div className="flex items-center gap-2">
          <LuFilter className="text-primary" />
          <p>Filters</p>
          <YearSelectLinks
            value={String(year)}
            onValueChange={onYearSelect}
            disabled={isPending}
          />
          <GenderSelectLinks
            value={gender}
            onValueChange={onGenderSelect}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          aria-label="Go to the month of the current day"
          onClick={onToday}
          variant="card"
          disabled={isPending}
        >
          Today
        </Button>

        <Button
          aria-label="Display previous month"
          onClick={onPrevMonth}
          variant="card"
          disabled={isPending || !hasPrevMonth}
        >
          <LuChevronLeft />
        </Button>
        <Button
          aria-label="Display next month"
          onClick={onNextMonth}
          variant="card"
          disabled={isPending || !hasNextMonth}
        >
          <LuChevronRight />
        </Button>
      </div>
    </div>
  );
};

function getMonthName(monthIndex: number) {
  return format(new Date(2024, monthIndex, 1), "LLLL");
}
