import { api } from "@/services/api";
import Event from "@/types/event";

export const getEvents = async (year: number, gender: string) => {
  const resp = await api.get(`/events?year=${year}&gender=${gender}`);
  const data: Event[] = (resp && resp.data) || [];
  return data;
};

export const getEvent = async (id: string) => {
  const resp = await api.get(`/events/${id}`);
  const data: Event = (resp && resp.data);
  return data;
};

export const getStages = async (id: string) => {
  const resp = await api.get(`/events/${id}/stages`);
  const data: Event[] = (resp && resp.data) || [];
  return data
}
