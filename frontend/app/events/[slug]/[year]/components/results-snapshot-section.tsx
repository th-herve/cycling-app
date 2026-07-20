import { JerseyLine, ResultLine } from "@/components/common/result-line";
import { getLastStageWithResults } from "@/lib/events/events-utils";
import Event from "@/types/event";
import { ResultsResponse } from "@/types/result";

// Either display the tour jerseys standings or final depending if the final result is available or not.
export const ResultsSnapshotSection = ({
  event,
  stages,
}: {
  event: Event;
  stages: Event[];
}) => {
  const hasFinalResult = !!event.results;

  const stage = getLastStageWithResults(stages);

  const hasStandings = !!stage;

  return hasFinalResult ? (
    <FinalResultsSection results={event.results} />
  ) : hasStandings ? (
    <StandingSection stageName={stage.name} results={stage.results} />
  ) : null;
};

// Shows tour final jerseys.
const FinalResultsSection = ({
  results,
  className,
}: {
  results?: ResultsResponse;
  className?: string;
}) => {
  if (!results) return null;

  const types = ["general", "mountain", "point", "young"] as const;

  return (
    <div className={className}>
      <h3 className="mb-2">Final result</h3>
      <div className="space-y-1 md:flex md:justify-between md:gap-2 md:space-y-0">
        {types.map((type) => {
          const [leader] = results[type] ?? [];

          return leader?.rider ? (
            <JerseyLine
              key={type}
              className="grow"
              type={type}
              rider={leader.rider}
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

// Shows tour standings jerseys.
export const StandingSection = ({
  results,
  stageName,
  className,
}: {
  results?: ResultsResponse;
  stageName?: string;
  className?: string;
}) => {
  if (!results) return null;

  const types = [
    { retultType: "overallGeneral", iconType: "general" },
    { retultType: "overallMountain", iconType: "mountain" },
    { retultType: "overallPoint", iconType: "point" },
    { retultType: "overallYoung", iconType: "young" },
  ] as const;

  return (
    <div className={className}>
      <h3 className="mb-2">Standings after {stageName}</h3>
      <div className="space-y-1 md:flex md:justify-between md:gap-2 md:space-y-0">
        {types.map((type) => {
          const [leader] = results[type.retultType] ?? [];

          return leader?.rider ? (
            <JerseyLine
              key={type.retultType}
              className="grow"
              type={type.iconType}
              rider={leader.rider}
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

// Shows one day race top 3.
export const Top3Result = ({
  results,
  className,
}: {
  results?: ResultsResponse;
  className?: string;
}) => {
  if (!results || !results.general) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="mb-2">Final result</h3>
      <div className="space-y-1 md:flex md:justify-between md:gap-2 md:space-y-0">
        <ResultLine className="grow" rank={1} result={results.general[0]} />
        <ResultLine className="grow" rank={2} result={results.general[1]} />
        <ResultLine className="grow" rank={3} result={results.general[2]} />
      </div>
    </div>
  );
};

export default FinalResultsSection;
