import GenderSelectLinks from "@/components/common/genderSelect";
import YearSelectLinks from "@/components/common/yearSelect";
import { LucideFilter } from "lucide-react";
import Event from "@/types/event";
import { cn } from "@/lib/utils";
import EventCard from "./event-card";

interface Props {
  className?: string;
  year: string;
  gender: string;
  data: Event[];
}

const ListView = ({ data, year, gender, className }: Props) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <LucideFilter className="text-primary" size={14} />
          <p>Filters</p>
        </div>
        <YearSelectLinks value={year} />
        <GenderSelectLinks value={gender} />
      </div>

      <ul className="space-y-4">
        {data.map((event) => (
          <li key={event.id}>
            <EventCard event={event} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListView;
