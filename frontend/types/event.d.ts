import Classification from "./classification";
import Country from "./country";
import EventType from "./event-type";
import { ResultsResponse } from "./result";

export default interface Event {
  id: string;
  parentEventId?: string;
  categoryCode?: string;
  seasonGender: string;
  seasonYear: int;
  classification?: Classification;
  type: EventType;
  status: string;
  name: string;
  start: string;
  end?: string;

  departureCity?: string;
  arrivalCity?: string;

  distance?: number;
  distanceUnit?: string;

  isSingleDay: boolean;
  countryCode?: string;

  stages?: Event[];

  country?: Country;

  results?: ResultsResponse;

  parentName?: string;
}
