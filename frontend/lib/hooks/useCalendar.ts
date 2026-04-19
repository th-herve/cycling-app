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

const LAST_MONTH = 11;
const FIRST_MONTH = 0;

/*
 * Hook to generate a calendar and navigate it.
 * Generate for the given year the days to display each month.
 *
 * Months navigation across the same year are client side, and the state is reflected in the url query params with month=0.
 * Years navigation is trigger when going to prev month in January or next month in December. It pushes the new year with the right month
 * in the query params which trigger a re fetch.
 */
export const useCalendar = (year?: string) => {
  const now = new Date();
  // These are the calendar current month and year relative to the current date. NOT the month and year displayed, which come from the props.
  const currentMonth = getMonth(now);
  const currentYear = getYear(now);

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
      .withDefault(displayedYear === currentYear ? currentMonth : FIRST_MONTH)
      // The clearOnDefault option fix the bug where clicking on prev month would not go to january if the year != currentYear.
      .withOptions({ clearOnDefault: false }),
  );

  const changeMonth = (delta: number) => {
    const newMonth = displayedMonth + delta;

    if (newMonth >= FIRST_MONTH && newMonth <= LAST_MONTH) {
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

  /*
   * Days to display in the calendar for the displayed month.
   * Include padding day outside the month to have only full weeks.
   */
  const displayedDays = daysOfMonths[displayedMonth];

  return {
    handleNextMonth: () => changeMonth(1),
    handlePrevMonth: () => changeMonth(-1),
    handleToday,
    handleYearSelect,
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
