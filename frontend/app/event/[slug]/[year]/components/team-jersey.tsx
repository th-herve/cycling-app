import { svgTeamJerseyManifest } from "@/generated/svg-team-jersey-manifest";

type Props = {
  teamID: string;
  className?: string;
};

export default function TeamJerseyIcon({ teamID, className }: Props) {
  const src = svgTeamJerseyManifest.has(teamID)
    ? `/team_jerseys/${teamID}.svg`
    : "/team_jerseys/hidden_jersey.svg";

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
