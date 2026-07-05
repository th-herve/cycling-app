import Country from "./country";

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  country?: Country;
}
