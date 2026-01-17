const EventType = {
  RACE: "race",
  STAGE: "stage",
} as const;

type EventType = (typeof EventType)[keyof typeof EventType];

export default EventType;
