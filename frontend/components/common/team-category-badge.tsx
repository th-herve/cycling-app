import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

const TeamCategoryBadge = ({ category }: { category: string }) => {
  return (
    <Badge
      className={cn({
        "bg-green-950 text-green-300": category === "WTT",
        "bg-blue-950 text-blue-300": category === "PRT",
        "bg-sky-950 text-sky-300": category === "WTW",
        "bg-purple-950 text-purple-300": category === "PRW",
      })}
    >
      {category}
    </Badge>
  );
};

export default TeamCategoryBadge;
