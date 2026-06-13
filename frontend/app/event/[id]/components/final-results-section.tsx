import { JerseyLine, ResultLine } from "@/components/common/result-line";
import { ResultsResponse } from "@/types/result";

interface Props {
  results?: ResultsResponse;
  className?: string;
}

const FinalResultsSection = ({ results, className }: Props) => {
  if (!results) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="mb-2">Final result</h2>
      <div className="space-y-1 md:flex md:justify-between md:gap-2 md:space-y-0">
        {results?.general && results?.general[0].rider && (
          <JerseyLine
            className="grow"
            type="general"
            rider={results.general[0].rider}
          />
        )}
        {results?.mountain && results?.mountain[0].rider && (
          <JerseyLine
            className="grow"
            type="mountain"
            rider={results.mountain[0].rider}
          />
        )}
        {results?.point && results?.point[0].rider && (
          <JerseyLine
            className="grow"
            type="point"
            rider={results.point[0].rider}
          />
        )}
        {results?.young && results?.young[0].rider && (
          <JerseyLine
            className="grow"
            type="young"
            rider={results.young[0].rider}
          />
        )}
      </div>
    </div>
  );
};

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
      <h2 className="mb-2">Final result</h2>
      <div className="space-y-1 md:flex md:justify-between md:gap-2 md:space-y-0">
        <ResultLine className="grow" rank={1} result={results.general[0]} />
        <ResultLine className="grow" rank={2} result={results.general[1]} />
        <ResultLine className="grow" rank={3} result={results.general[2]} />
      </div>
    </div>
  );
};

export default FinalResultsSection;
