export type SiteConfig = typeof siteConfig;

const minYear = 2025;
const maxYear = 2026;
const availableYears = Array.from(
  { length: maxYear - minYear + 1 },
  (_, i) => minYear + i,
);

export const siteConfig = {
  name: "Cycling calendar",
  availableYears: availableYears,
  minYear: minYear,
  maxYear: maxYear,
};

export const siteRoute = {
  schedule: {
    list: "/schedule/list",
    calendar: "/schedule/calendar",
  },
  events: {
    root: (slug: string, year: string) => `/events/${slug}/${year}`,
    stages: (slug: string, year: string) => `/events/${slug}/${year}/stages`,
    results: (eventSlug: string, year: string, stageSlug: string) =>
      `/events/${eventSlug}/${year}/results/${stageSlug}`,
  },
  teams: {
    list: "/teams",
  },
  export: {
    root: "/add-to-calendar",
  },
  // Calendar feed do not include leading '/'.
  calendarFeed: {
    men: "cycling-calendar/men.ics",
    women: "cycling-calendar/women.ics",
  },
};
