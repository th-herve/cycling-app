import { api } from "@/services/api";
import Event from "@/types/event";

export const getEvents = async (year: string, gender: string) => {
  const resp = await api.get(`/events?year=${year}&gender=${gender}`);
  const data: Event[] = resp.data || [];
  return data;
};
