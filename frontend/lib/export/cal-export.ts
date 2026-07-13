import Event from "@/types/event";

const START = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ZContent.net//Zap Calendar 1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH`;

const END = `END:VCALENDAR`;

const convertDateToIcs = (date: string) =>
  new Date(date).toISOString().slice(0, 10).replace(/-/g, "");

const calEvent = (start: string, summary: string) => `BEGIN:VEVENT
SUMMARY:${summary}
DTSTART:${convertDateToIcs(start)}
END:VEVENT`;

export const eventToIcs = (events: Event[]): IcsEvent[] => {
  return events.map(
    (e) =>
      <IcsEvent>{
        start: e.start,
        summary: e.name,
      },
  );
};

export interface IcsEvent {
  start: string;
  summary: string;
}

export const generateIcs = (events: IcsEvent[]) => {
  return `${START}\n${events.map((e) => `${calEvent(e.start, e.summary)}`).join("\n")}\n${END}`;
};
