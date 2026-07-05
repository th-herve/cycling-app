import { api } from "@/services/api";
import { Team } from "@/types/team";

export const getTeams = async (year: number, gender: string) => {
  const resp = await api.get(`/teams?year=${year}&gender=${gender}`);
  const data: Team[] = (resp && resp.data) || [];

  return data;
};
