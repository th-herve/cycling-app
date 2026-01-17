import Event from "@/types/event";
import EventCalendar from "./event-calendar";

interface Props {
  data: Event[];
  year: string;
  gender: string;
  className?: string;
}

const CalendarView = ({ data, year, gender, className }: Props) => {
  const eventsByDay = groupEventsByDays(data);
  return (
    <EventCalendar
      className={className}
      year={year}
      gender={gender}
      eventsByDay={eventsByDay}
    />
  );
};

export default CalendarView;

/*
 * Group the givens cycling events by their start date
 */
function groupEventsByDays(events: Event[]) {
  return events.reduce<Map<string, Event[]>>((map, e) => {
    const items = e.stages ?? [e];

    for (const item of items) {
      const key = new Date(item.start).toISOString().slice(0, 10);
      const list = map.get(key);

      if (list) {
        list.push(item);
      } else {
        map.set(key, [item]);
      }
    }

    return map;
  }, new Map());
}
