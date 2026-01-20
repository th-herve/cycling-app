import { RiderSnapshot } from "./rider";

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
  rider: RiderSnapshot;
}

export interface ResultsSnapshot {
  general: ResultSnapshot[];
}
