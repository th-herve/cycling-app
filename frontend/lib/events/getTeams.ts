import { apiOrNull } from "@/services/api";
import { Team } from "@/types/team";

export const getTeams = (year: number, gender: string) => {
  return apiOrNull<Team[]>(`/teams?year=${year}&gender=${gender}`, {
    next: {
      revalidate: 120,
      tags: [`teams-${year}-${gender}`],
    },
  });
};
