import Country from "./country";
import { Team } from "./team";

export interface Rider {
  id: string;
  firstName: string;
  lastName: string;
  nationality?: Country;
  team?: Team
}
