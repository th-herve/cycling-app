import { RiderSnapshot } from "./rider";
import { TeamSnapshot } from "./team";

export default interface Result {
  rank?: number;
  status?: string;
  type?: string;
  eventId?: string;
  timeSeconds?: number;
  points?: number;
  rider?: RiderSnapshot;
  team?: TeamSnapshot; // Only for ttt results.
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
