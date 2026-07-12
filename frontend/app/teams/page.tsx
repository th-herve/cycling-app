import CountryIcon from "@/components/common/country-icon";
import GenderSelectLinks from "@/components/common/gender-select";
import TeamCategoryBadge from "@/components/common/team-category-badge";
import YearSelectLinks from "@/components/common/year-select";
import DefaultLayout from "@/components/layouts/default-layout";
import { Card, CardContent } from "@/components/ui/card";
import { getTeams } from "@/lib/events/getTeams";
import { parseEventSearchParams } from "@/lib/events/parseEventsSearchParams";
import { Team } from "@/types/team";
import { LucideFilter } from "lucide-react";
import TeamJerseyIcon from "../events/[slug]/[year]/components/team-jersey";
import { notFound } from "next/navigation";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const TeamPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const { year, gender } = parseEventSearchParams(params);

  const teams = await getTeams(year, gender);

  if (!teams) {
    notFound();
  }

  const wtw = teams.filter((t) => t.category === "WTW");
  const ptw = teams.filter((t) => t.category === "PRW");

  const wtt = teams.filter((t) => t.category === "WTT");
  const ptt = teams.filter((t) => t.category === "PRT");

  return (
    <DefaultLayout>
      <h1>Teams</h1>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <LucideFilter className="text-primary" size={14} />
          <p>Filters</p>
        </div>
        <YearSelectLinks value={String(year)} />
        <GenderSelectLinks value={gender} />
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        {wtt.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
        {ptt.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
        {wtw.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
        {ptw.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </DefaultLayout>
  );
};

export default TeamPage;

const TeamCard = ({ team }: { team: Team }) => {
  return (
    <Card>
      <CardContent className="flex gap-10">
        <div className="w-full">
          <div className="flex w-full justify-between">
            <h2 className="flex items-start gap-2 text-2xl">
              <CountryIcon
                className="pt-2.5"
                countryCode={team.country?.alpha2 || ""}
              />
              {team.name}
            </h2>
            <span>
              <TeamCategoryBadge category={team.category} />
            </span>
          </div>
          <dl className="mt-6 grid grid-cols-[150px_auto] gap-1">
            <dt className="text-muted-foreground">Abbreviation</dt>
            <dd className="font-bold">{team.abbreviation}</dd>

            <dt className="text-muted-foreground">Country</dt>
            <dd className="font-bold">{team.country?.name}</dd>

            <dt aria-hidden className="text-muted-foreground">
              Jersey
            </dt>
            <dd aria-hidden className="font-bold">
              <TeamJerseyIcon className="size-8" teamID={team.id} />
            </dd>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
};
