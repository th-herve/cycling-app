import Result from "@/types/result";
import CountryIcon from "./countryIcon";
import JerseyIcon, { JerseyType } from "./jerseyIcon";
import { Rider } from "@/types/rider";
import { cn } from "@/lib/utils";

export const ResultLine = ({
  result,
  rank,
  className,
}: {
  result?: Result;
  rank: 1 | 2 | 3;
  className?: string;
}) => {
  const rankDisplay = {
    1: "1st",
    2: "2nd",
    3: "3rd",
  };

  const isRiderResult = !!result?.rider;

  if (!isRiderResult && !result?.team) {
    return (
      <Line className={className}>
        <p>-</p>
      </Line>
    );
  }

  const countryCode = isRiderResult
    ? result.rider?.nationality?.alpha2 || ""
    : result.team?.country?.alpha2 || "";

  const countryName = isRiderResult
    ? result.rider?.nationality?.name
    : result.team?.country?.name;

  const label = isRiderResult
    ? `${result.rider?.firstName} ${result.rider?.lastName}`
    : result.team?.name;

  return (
    <Line className={className}>
      <>
        <div className="min-w-5">
          <p className="font-race">{rankDisplay[rank]}</p>
        </div>
        {result ? (
          <div className="flex gap-2">
            <CountryIcon countryCode={countryCode} aria-label={countryName} />
            <p>{label}</p>
          </div>
        ) : (
          <p>-</p>
        )}
      </>
    </Line>
  );
};

export const JerseyLine = ({
  type,
  rider,
  className,
}: {
  type: JerseyType;
  rider: Rider;
  className?: string;
}) => {
  return (
    <Line className={className}>
      <>
        <JerseyIcon type={type} />

        <CountryIcon
          countryCode={rider.nationality?.alpha2 || ""}
          aria-label={rider.nationality?.name}
        />
        <p>
          {rider.firstName} {rider.lastName}
        </p>
      </>
    </Line>
  );
};

const Line = ({
  children,
  className,
}: {
  children: React.ReactElement;
  className?: string;
}) => {
  return (
    <div className={cn("bg-card flex items-center gap-2 px-3 py-1", className)}>
      {children}
    </div>
  );
};
