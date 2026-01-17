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
import { useTransition } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { UTCDate } from "@date-fns/utc";

export const useCalendar = (year?: string) => {
  // these are the calendar current month and year relative to the current date. NOT the month and year displayed, which come from the props.
  const currentMonth = getMonth(new Date());
  const currentYear = getYear(new Date()).toString();

  const displayedYear = year || currentYear;

  const daysOfMonths = generateDaysOfMonthsArray(Number(displayedYear));

  const urlNav = useUrlParamsNavigation();
  const [isPending, startTransition] = useTransition();

  // uses nuqs query state for the month so that it does not trigger a refresh of the page when the month update
  const [displayedMonth, setDisplayedMonth] = useQueryState(
    "month",
    // set January as default month. Unless the current year is displayed, then display the current month
    parseAsInteger.withDefault(year === currentYear ? currentMonth : 0),
  );

  const handleNextMonth = () => {
    // increase the month or go to the next year if December
    if (displayedMonth < 11) {
      setDisplayedMonth(displayedMonth + 1);
    } else {
      startTransition(() => {
        urlNav.updateAndPushUrl({
          year: String(Number(year) + 1),
          month: "0", // January
        });
      });
    }
  };
  const handlePrevMonth = () => {
    // decrease the month or go to the previous year if January
    if (displayedMonth > 0) {
      setDisplayedMonth(displayedMonth - 1);
    } else {
      startTransition(() => {
        urlNav.updateAndPushUrl({
          year: String(Number(year) - 1),
          month: "11", // December
        });
      });
    }
  };
  const handleToday = () => {
    startTransition(() => {
      urlNav.updateAndPushUrl({
        year: currentYear,
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
 * Generate an array with an entry or each month of a year.
 * With each entry containing the days of that month.
 *
 * Include the full weeks for the month, even if it contains day outside the given month.
 * (ex: If the month start a Wednesday, include Monday 30th and Tuesday 31st of last month)
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
