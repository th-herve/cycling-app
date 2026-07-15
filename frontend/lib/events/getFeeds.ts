import { apiString } from "@/services/api";

export const getFeed = (gender: string) =>
  apiString(`/cycling-calendar/${gender}.ics`, {});
