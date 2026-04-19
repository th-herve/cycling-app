import { api } from "@/services/api";
import Event from "@/types/event";

export const getEvents = async (year: number, gender: string) => {
  const resp = await api.get(`/events?year=${year}&gender=${gender}`);
  const data: Event[] = (resp && resp.data) || [];
  return data;
};
