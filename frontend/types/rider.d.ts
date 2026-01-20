import Country from "./country";

export interface RiderSnapshot {
  id: string;
  firstName: string;
  lastName: string;
  nationality?: Country;
  // Team;
}
