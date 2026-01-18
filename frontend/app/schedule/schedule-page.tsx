import ViewSelector, { View } from "@/components/common/view-selector";
import Event from "@/types/event";
import CalendarView from "./calendar/components/calendar-view";
import ListView from "./list/components/list-view";

interface Props {
  data: Event[];
  year: string;
  gender: string;
  view: View;
  className?: string;
}

const SchedulePage = async ({ data, year, gender, view, className }: Props) => {
  return (
    <div className={className}>
      <div className="flex justify-between">
        <h1>Calendar</h1>
        <ViewSelector currentView={view} year={year} gender={gender} />
      </div>
      {view === "calendar" ? (
        <CalendarView data={data} year={year} gender={gender} />
      ) : (
        <ListView data={data} year={year} gender={gender} />
      )}
    </div>
  );
};

export default SchedulePage;
