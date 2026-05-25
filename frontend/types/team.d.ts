import Country from "./country";

export interface TeamSnapshot {
  id: string;
  name: string;
  abbreviation: string;
  country?: Country;
}
