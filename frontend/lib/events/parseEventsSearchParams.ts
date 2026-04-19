import { siteConfig } from "@/siteConfig";
import { getYear } from "date-fns";

export type EventFilters = {
  year: number;
  gender: string;
};

const defaultGender = "men";

export function parseEventSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): EventFilters {
  const defaultYear = getYear(new Date());
  let year = defaultYear;

  // Get the year and check if valid.
  if (searchParams.year) {
    const yearAsNumber = Number(searchParams.year);

    if (
      !isNaN(yearAsNumber) &&
      siteConfig.availableYears.includes(yearAsNumber)
    ) {
      year = yearAsNumber;
    }
  }

  // Get the gender and check if valid.
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
