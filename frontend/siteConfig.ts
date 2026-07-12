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
  event: {
    root: (slug: string, year: string) => `/event/${slug}/${year}`,
    stages: (slug: string, year: string) => `/event/${slug}/${year}/stages`,
    results: (eventSlug: string, year: string, stageSlug: string) =>
      `/event/${eventSlug}/${year}/results/${stageSlug}`,
  },
  teams: {
    list: "/teams",
  },
};
