export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Cycling calendar",
  availableYears: [2025, 2026],
  minYear: 2025,
  maxYear: 2026,
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
