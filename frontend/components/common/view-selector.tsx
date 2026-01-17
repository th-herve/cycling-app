import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LuCalendar, LuCheck, LuList } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type View = "calendar" | "list";

interface Props {
  currentView: View;
  year?: string;
  gender?: string;
  className?: string;
}

const ViewSelector = ({ currentView, className, gender, year }: Props) => {
  const params = new URLSearchParams();

  if (year) params.set("year", year);
  if (gender) params.set("gender", gender);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={className} variant="card">
          {currentView === "calendar" ? <LuCalendar /> : <LuList />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild disabled={currentView === "calendar"}>
          <Link
            className="flex items-center gap-2"
            href={`/schedule/calendar?${params.toString()}`}
          >
            <LuCalendar /> Calendar view
            {currentView === "calendar" && <LuCheck />}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild disabled={currentView === "list"}>
          <Link
            className="flex items-center gap-2"
            href={`/schedule/list?${params.toString()}`}
          >
            <LuList /> List view
            {currentView === "list" && <LuCheck />}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewSelector;
