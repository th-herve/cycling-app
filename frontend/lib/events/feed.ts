import { api } from "@/services/api";

export const generateFeed = (events: string[]) =>
  api<string>(`/feed`, {
    method: "POST",
    body: JSON.stringify(events),
  });
