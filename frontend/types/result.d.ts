import { RiderSnapshot } from "./rider";
import { TeamSnapshot } from "./team";

export default interface Result {
  id: string;
  type: string;
  eventId: string;
  rank: number;
  timeSeconds: number;
  riderFirstName: string;
  riderLastName: string;
}

export interface ResultSnapshot {
  rank: number;
  rider?: RiderSnapshot;
  team?: TeamSnapshot; // Only for ttt results.
}

export interface ResultsSnapshot {
  general?: ResultSnapshot[];
  stage?: ResultSnapshot[];

  overallGeneral?: ResultSnapshot[];
  overallPoint?: ResultSnapshot[];
  overallMountain?: ResultSnapshot[];
  overallYoung?: ResultSnapshot[];

  point?: ResultSnapshot[];
  mountain?: ResultSnapshot[];
  young?: ResultSnapshot[];
}
