import { ResultSnapshot } from "@/types/result";
import CountryIcon from "./countryIcon";
import JerseyIcon, { JerseyType } from "./jerseyIcon";
import { RiderSnapshot } from "@/types/rider";

export const ResultLine = ({
  result,
  rank,
}: {
  result?: ResultSnapshot;
  rank: 1 | 2 | 3;
}) => {
  const rankDisplay = {
    1: "1st",
    2: "2nd",
    3: "3rd",
  };
  return (
    <Line>
      <>
        <div className="min-w-5">
          <p className="font-race">{rankDisplay[rank]}</p>
        </div>
        {result ? (
          <div className="flex gap-2">
            <CountryIcon
              countryCode={result.rider.nationality?.alpha2 || ""}
              aria-label={result.rider.nationality?.name}
            />
            <p>
              {result.rider.firstName} {result.rider.lastName}
            </p>
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
}: {
  type: JerseyType;
  rider: RiderSnapshot;
}) => {
  return (
    <Line>
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

const Line = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="bg-card flex items-center gap-2 px-3 py-1">{children}</div>
  );
};
