import { Rider } from "./rider";
import { Team } from "./team";

export default interface Result {
  rank?: number;
  status?: string;
  type?: string;
  eventId?: string;
  timeSeconds?: number;
  points?: number;
  rider?: Rider;
  team?: Team; // Only for ttt results.
}

export interface ResultsResponse {
  general?: Result[];
  stage?: Result[];

  overallGeneral?: Result[];
  overallPoint?: Result[];
  overallMountain?: Result[];
  overallYoung?: Result[];

  point?: Result[];
  mountain?: Result[];
  young?: Result[];
}

export const resultTypes = [
  "stage",
  "general",
  "mountain",
  "point",
  "young",
  "overallGeneral",
  "overallMountain",
  "overallPoint",
  "overallYoung",
] as const;

export type ResultType = (typeof resultTypes)[number];

export const labels: Record<ResultType, string> = {
  general: "General",
  mountain: "Mountain",
  point: "Points",
  young: "Young",
  stage: "Stage",
  overallGeneral: "General",
  overallPoint: "Points",
  overallMountain: "Mountain",
  overallYoung: "Young",
};

type ResultMetricType = "time" | "points";

export const resultMetricByType: Record<ResultType, ResultMetricType> = {
  general: "time",
  mountain: "points",
  point: "points",
  young: "time",
  stage: "time",
  overallGeneral: "time",
  overallPoint: "points",
  overallMountain: "points",
  overallYoung: "time",
};
