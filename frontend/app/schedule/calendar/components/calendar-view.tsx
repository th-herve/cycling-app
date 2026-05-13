import Event from "@/types/event";
import EventCalendar from "./event-calendar";

interface Props {
  data: Event[];
  year: number;
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
 * Group the givens cycling events by their starting date.
 *
 * Also attach, to the last stages, the event final result. TODO handle that better.
 */
function groupEventsByDays(events: Event[]) {
  return events.reduce<Map<string, Event[]>>((map, e) => {
    const items = e.stages ?? [e];
    const stagesNumber = items.length;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const key = new Date(item.start).toISOString().slice(0, 10);
      const list = map.get(key);

      if (item.type === "stage" && i + 1 === stagesNumber) {
        if (item.results) {
          item.results.general = e.results?.general;
          item.results.mountain = e.results?.mountain;
          item.results.point = e.results?.point;
        }
      }

      if (list) {
        list.push(item);
      } else {
        map.set(key, [item]);
      }
    }

    return map;
  }, new Map());
}
