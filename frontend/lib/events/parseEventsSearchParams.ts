import { siteConfig } from "@/siteConfig";
import { getYear } from "date-fns";

export type EventFilters = {
  year: string;
  gender: string;
};

const defaultGender = "men";

export function parseEventSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): EventFilters {
  const defaultYear = getYear(new Date()).toString();

  // get the year and check if valid
  let year = searchParams.year ? (searchParams.year as string) : defaultYear;
  const yearAsNumber = Number(year);

  if (
    isNaN(yearAsNumber) ||
    !siteConfig.availableYears.includes(yearAsNumber)
  ) {
    year = defaultYear;
  }

  // get the gender and check if valid
  let gender = searchParams.gender
    ? (searchParams.gender as "men" | "women")
    : defaultGender;

  if (gender !== "men" && gender !== "women") {
    gender = defaultGender;
  }

  return {
    year,
    gender,
  };
}
