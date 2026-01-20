import Country from "./country";
import EventType from "./event-type";
import { ResultsSnapshot } from "./result";

export default interface Event {
  id: string;
  parentEventId?: string;
  categoryId?: string;
  seasonId: string;
  classification?: string;
  type: EventType;
  status: string;
  name: string;
  start: string;
  end?: string;

  departureCity?: string;
  arrivalCity?: string;

  distance?: number;
  distanceUnit?: string;

  singleEvent: boolean;
  countryCode?: string;

  stages?: Event[];

  country?: Country;

  results?: ResultsSnapshot;

  parentName?: string;
}
