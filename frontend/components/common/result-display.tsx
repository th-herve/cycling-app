import { cn, formatRider } from "@/lib/utils";
import Result from "@/types/result";
import { LucideCrown } from "lucide-react";

const ResultDisplay = ({
  results,
  className,
}: {
  results: Result[];
  className?: string;
}) => {
  const winner = results?.[0];
  if (!winner || winner.rank != 1) {
    return null;
  }

  const text = winner.rider
    ? formatRider(winner.rider)
    : winner.team
      ? winner.team.name
      : undefined;

  if (!text) return null;

  return (
    <dl
      aria-label="Race winner"
      className={cn(
        "bg-muted rounded-md px-2 py-3 md:bg-transparent",
        className,
      )}
    >
      <dd className="flex items-center gap-2">
        <LucideCrown aria-hidden="true" className="size-4 text-yellow-400" />
        <span className="text-xs font-semibold">{text}</span>
      </dd>
    </dl>
  );
};

export default ResultDisplay;
