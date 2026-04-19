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
export const useCalendar = (
  year?: number,
  minYear?: number,
  maxYear?: number,
) => {
  const now = new Date();
  // These are the calendar current month and year relative to the current date. NOT the month and year displayed, which come from the props.
  const currentMonth = getMonth(now);
  const currentYear = getYear(now);

  const displayedYear = Number(year ?? currentYear);

  const urlNav = useUrlParamsNavigation();
  const [isPending, startTransition] = useTransition();

  const daysOfMonths = useMemo(
    () => generateDaysOfMonthsArray(displayedYear),
    [displayedYear],
  );

  // Uses nuqs query state for the month so that it does not trigger a refresh of the page when the month update.
  const [monthParam, setMonthParam] = useQueryState("month", parseAsInteger);

  const displayedMonth =
    monthParam ?? (displayedYear === currentYear ? currentMonth : FIRST_MONTH);

  /*
   * Update the displayed month given a delta. Ex: changeMonth(1), changeMonth(-1), changeMonth(-3)...
   * If the requested month is < 0 or > 11, it change the year instead to go up or down.
   *
   * If a min year and/or max year is specify in the hook argument, it first check if the year change would be in range.
   * Otherwise do nothing.
   */
  const changeMonth = (delta: number) => {
    const newMonth = displayedMonth + delta;

    if (newMonth >= FIRST_MONTH && newMonth <= LAST_MONTH) {
      setMonthParam(newMonth);
      return;
    }

    const newYear = displayedYear + Math.sign(delta);
    if (
      (minYear !== undefined && newYear < minYear) ||
      (maxYear !== undefined && newYear > maxYear)
    ) {
      return;
    }

    startTransition(() => {
      urlNav.updateAndPushUrl({
        year: String(newYear),
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

  const hasNextMonth =
    maxYear === undefined ||
    displayedYear < maxYear ||
    (displayedYear === maxYear && displayedMonth < LAST_MONTH);

  const hasPrevMonth =
    minYear === undefined ||
    displayedYear > minYear ||
    (displayedYear === minYear && displayedMonth > FIRST_MONTH);

  return {
    handleNextMonth: () => changeMonth(1),
    handlePrevMonth: () => changeMonth(-1),
    handleToday,
    handleYearSelect,
    displayedDays,
    isPending,
    displayedMonth,
    displayedYear,
    hasNextMonth,
    hasPrevMonth,
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
