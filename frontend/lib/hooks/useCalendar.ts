import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  getMonth,
  getYear,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useUrlParamsNavigation } from "./useUrlParamsNavigation";
import { useMemo, useTransition } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { UTCDate } from "@date-fns/utc";

export const useCalendar = (year?: string) => {
  // These are the calendar current month and year relative to the current date. NOT the month and year displayed, which come from the props.
  const currentMonth = getMonth(new Date());
  const currentYear = getYear(new Date());

  const displayedYear = Number(year || currentYear);

  const urlNav = useUrlParamsNavigation();
  const [isPending, startTransition] = useTransition();

  const daysOfMonths = useMemo(
    () => generateDaysOfMonthsArray(Number(displayedYear)),
    [displayedYear],
  );

  // uses nuqs query state for the month so that it does not trigger a refresh of the page when the month update
  const [displayedMonth, setDisplayedMonth] = useQueryState(
    "month",
    // set January as default month. Unless the current year is displayed, then display the current month
    parseAsInteger
      .withDefault(displayedYear === currentYear ? currentMonth : 0)
      // The clearOnDefault option fix the bug where clicking on prev month would not go to january if the year != currentYear.
      .withOptions({ clearOnDefault: false }),
  );

  const changeMonth = (delta: number) => {
    const newMonth = displayedMonth + delta;

    if (newMonth >= 0 && newMonth <= 11) {
      setDisplayedMonth(newMonth);
      return;
    }

    startTransition(() => {
      urlNav.updateAndPushUrl({
        year: String(displayedYear + Math.sign(delta)),
        month: String((newMonth + 12) % 12),
      });
    });
  };

  const handleNextMonth = () => changeMonth(1);
  const handlePrevMonth = () => changeMonth(-1);

  const handleToday = () => {
    startTransition(() => {
      urlNav.updateAndPushUrl({
        year: String(currentYear),
        month: String(currentMonth),
      });
    });
  };
  const handleYearSelect = (newYear: string) => {
    startTransition(() => {
      urlNav.updateAndPushUrl({
        year: newYear,
      });
    });
  };

  // TODO should not be there since not calendar specific
  const handleGenderSelect = (newGender: string) => {
    startTransition(() => {
      urlNav.updateAndPushUrl({
        gender: newGender,
      });
    });
  };

  const displayedDays = daysOfMonths[displayedMonth];

  return {
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    handleYearSelect,
    handleGenderSelect,
    displayedDays,
    isPending,
    displayedMonth,
    displayedYear,
  };
};

/*
 * Generate an array with an entry for each month of a year.
 * With each entry containing the days of that month.
 *
 * Include the full weeks for the month, even if it contains day outside the given month.
 * (ex: If the month start a Wednesday, include Monday 30th and Tuesday 31st of previous month)
 */
function generateDaysOfMonthsArray(year: number) {
  return Array.from({ length: 12 }, (_, month) => getMonthDaysArr(month, year));
}

/*
 * Return all the days in a given month.
 * Include padding days outside the given month, so that each week is full.
 */
function getMonthDaysArr(month: number, year: number) {
  const date = new UTCDate(year, month, 1);

  const start = startOfWeek(startOfMonth(date), {
    weekStartsOn: 1,
  });

  const end = endOfWeek(endOfMonth(date), {
    weekStartsOn: 1,
  });

  return eachDayOfInterval({ start, end });
}
