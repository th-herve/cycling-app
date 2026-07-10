import { apiOrEmpty, apiOrNull } from "@/services/api";
import Event from "@/types/event";

export const getEvents = (year: number, gender: string) =>
  apiOrEmpty<Event>(`/events?year=${year}&gender=${gender}`, {
    next: {
      revalidate: 120,
      tags: [`events-${year}-${gender}`],
    },
  });

export const getEvent = (id: string) =>
  apiOrNull<Event>(`/events/${id}`, {
    next: {
      revalidate: 120,
      tags: [`event-${id}`],
    },
  });

export const getEventBySlug = (slug: string, year: string) =>
  apiOrNull<Event>(`/events/${slug}/${year}`, {
    next: {
      revalidate: 120,
      tags: [`event-${slug}-${year}`],
    },
  });

export const getStages = (id: string) =>
  apiOrEmpty<Event>(`/events/${id}/stages`, {
    next: {
      revalidate: 120,
      tags: [`event-${id}-stages`],
    },
  });
